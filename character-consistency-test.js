// Character Consistency Test - Generate same character across quality levels
const fs = require('fs');

const COMFYUI_URL = 'http://127.0.0.1:8188';

// Fixed character prompt for consistency testing
const CHARACTER_PROMPT = "portrait of Emma Stone as a medieval knight, detailed armor, green eyes, red hair in braids, confident expression, fantasy art style";
const NEGATIVE_PROMPT = "blurry, low quality, distorted face, multiple people, extra limbs, deformed";

const consistencyTests = [
  {
    level: 1,
    name: "CONSISTENCY_512_Fast",
    settings: { width: 512, height: 512, steps: 25, cfg: 7, sampler: "euler", scheduler: "normal" }
  },
  {
    level: 2, 
    name: "CONSISTENCY_768_Quality",
    settings: { width: 768, height: 768, steps: 40, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "normal" }
  },
  {
    level: 3,
    name: "CONSISTENCY_1024_High", 
    settings: { width: 1024, height: 1024, steps: 60, cfg: 8, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 4,
    name: "CONSISTENCY_1536_Ultra",
    settings: { width: 1536, height: 1536, steps: 80, cfg: 8.5, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 5,
    name: "CONSISTENCY_1536_Conservative", 
    settings: { width: 1536, height: 1536, steps: 60, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "karras" }
  }
];

// Fixed seed for consistency
const FIXED_SEED = 42424242;

async function generateConsistencyTest(test) {
  const workflow = {
    "3": {
      "class_type": "KSampler",
      "inputs": {
        "seed": FIXED_SEED, // FIXED SEED FOR CONSISTENCY
        "steps": test.settings.steps,
        "cfg": test.settings.cfg,
        "sampler_name": test.settings.sampler,
        "scheduler": test.settings.scheduler,
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      }
    },
    "4": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": { "ckpt_name": "sd_xl_base_1.0.safetensors" }
    },
    "5": {
      "class_type": "EmptyLatentImage",
      "inputs": {
        "width": test.settings.width,
        "height": test.settings.height,
        "batch_size": 1
      }
    },
    "6": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": CHARACTER_PROMPT,
        "clip": ["4", 1]
      }
    },
    "7": {
      "class_type": "CLIPTextEncode", 
      "inputs": {
        "text": NEGATIVE_PROMPT,
        "clip": ["4", 1]
      }
    },
    "8": {
      "class_type": "VAEDecode",
      "inputs": {
        "samples": ["3", 0],
        "vae": ["4", 2]
      }
    },
    "9": {
      "class_type": "SaveImage",
      "inputs": {
        "filename_prefix": `consistency_${test.name}`,
        "images": ["8", 0]
      }
    }
  };

  console.log(`🎭 Testing Character Consistency - ${test.name}`);
  console.log(`📐 Resolution: ${test.settings.width}x${test.settings.height}`);
  console.log(`⚙️ Settings: ${test.settings.steps} steps, CFG ${test.settings.cfg}`);
  console.log(`🌱 Fixed Seed: ${FIXED_SEED}`);

  const startTime = Date.now();
  
  try {
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });

    const result = await response.json();
    const promptId = result.prompt_id;

    // Wait for completion with extended timeout
    await waitForCompletion(promptId, 15 * 60 * 1000); // 15 min timeout

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    const testResult = {
      ...test,
      performance: {
        actualTimeSeconds: duration,
        actualTimeFormatted: formatTime(duration),
        seed: FIXED_SEED,
        characterPrompt: CHARACTER_PROMPT
      },
      timestamp: new Date().toISOString(),
      success: true
    };

    // Save individual result
    fs.writeFileSync(
      `consistency-results/${test.name}_results.json`,
      JSON.stringify(testResult, null, 2)
    );

    console.log(`✅ ${test.name} completed in ${formatTime(duration)}`);
    return testResult;

  } catch (error) {
    console.error(`❌ ${test.name} failed:`, error.message);
    return { ...test, success: false, error: error.message };
  }
}

async function waitForCompletion(promptId, timeout = 600000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
      const history = await response.json();
      
      if (history[promptId]) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  throw new Error('Generation timeout');
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

async function runConsistencyTests() {
  console.log('🎭 STARTING CHARACTER CONSISTENCY TESTS');
  console.log('🎯 Testing same character (Emma Stone knight) across quality levels');
  console.log(`🌱 Using fixed seed: ${FIXED_SEED} for reproducibility\n`);

  // Create results directory
  if (!fs.existsSync('consistency-results')) {
    fs.mkdirSync('consistency-results');
  }

  const results = [];

  for (const test of consistencyTests) {
    const result = await generateConsistencyTest(test);
    results.push(result);
    
    // Cooldown between tests
    console.log('🌡️ Cooling down GPU for 30 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  // Save summary
  const summary = {
    testCompleted: new Date().toISOString(),
    testType: 'CHARACTER_CONSISTENCY',
    fixedSeed: FIXED_SEED,
    characterPrompt: CHARACTER_PROMPT,
    levelsCompleted: results.filter(r => r.success).length,
    totalLevels: consistencyTests.length,
    results: results
  };

  fs.writeFileSync('consistency-results/CONSISTENCY_SUMMARY.json', JSON.stringify(summary, null, 2));

  console.log('🎭 CHARACTER CONSISTENCY TESTS COMPLETED!');
  console.log(`📊 Results saved in consistency-results/`);
  console.log(`🎯 Compare generated images to assess character consistency across resolutions`);
}

runConsistencyTests().catch(console.error);