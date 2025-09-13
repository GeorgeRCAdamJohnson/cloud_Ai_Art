// Landscape Quality Test - Sci-Fi Cityscape vs Rural Mountain/Forest
const fs = require('fs');

const COMFYUI_URL = 'http://127.0.0.1:8188';

// Two distinct landscape scenarios
const SCIFI_PROMPT = "futuristic sci-fi cityscape, 3/4 isometric angle, towering skyscrapers, neon lights, flying vehicles, cyberpunk atmosphere, dense urban environment, claustrophobic feeling, dramatic lighting, concept art style";

const RURAL_PROMPT = "majestic mountain landscape with ancient forest, regal and grand vista, misty peaks, towering pine trees, golden hour lighting, epic fantasy environment, serene and powerful atmosphere, concept art style";

const NEGATIVE_PROMPT = "blurry, low quality, distorted, bad composition, oversaturated, cartoon style, anime style";

// Test quality progression for landscapes (may handle higher res better than characters)
const landscapeTests = [
  {
    level: 1,
    name: "LANDSCAPE_512_Fast",
    description: "Fast landscape preview",
    settings: { width: 512, height: 512, steps: 25, cfg: 7, sampler: "euler", scheduler: "normal" }
  },
  {
    level: 2,
    name: "LANDSCAPE_768_Quality", 
    description: "Balanced landscape quality",
    settings: { width: 768, height: 768, steps: 40, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "normal" }
  },
  {
    level: 3,
    name: "LANDSCAPE_1024_High",
    description: "High quality landscape",
    settings: { width: 1024, height: 1024, steps: 60, cfg: 8, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 4,
    name: "LANDSCAPE_1536_Test",
    description: "Testing 1536 for landscapes (may work better than characters)",
    settings: { width: 1536, height: 1536, steps: 80, cfg: 8, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 5,
    name: "LANDSCAPE_1536_Conservative",
    description: "Conservative 1536 settings for landscapes",
    settings: { width: 1536, height: 1536, steps: 60, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "normal" }
  },
  {
    level: 6,
    name: "LANDSCAPE_2048_Test",
    description: "Testing 2048 for landscapes (experimental)",
    settings: { width: 2048, height: 2048, steps: 80, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "normal" }
  }
];

async function generateLandscapeTest(test, prompt, scenario) {
  const workflow = {
    "3": {
      "class_type": "KSampler",
      "inputs": {
        "seed": Math.floor(Math.random() * 1000000),
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
        "text": prompt,
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
        "filename_prefix": `landscape_${scenario}_${test.name}`,
        "images": ["8", 0]
      }
    }
  };

  console.log(`🏞️ Testing Landscape Quality - ${scenario.toUpperCase()}`);
  console.log(`📝 ${test.name}: ${test.description}`);
  console.log(`📐 Resolution: ${test.settings.width}x${test.settings.height}`);
  console.log(`⚙️ Settings: ${test.settings.steps} steps, CFG ${test.settings.cfg}, ${test.settings.sampler}`);

  const startTime = Date.now();
  
  try {
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });

    const result = await response.json();
    const promptId = result.prompt_id;

    await waitForCompletion(promptId, 20 * 60 * 1000); // 20 min timeout

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    const testResult = {
      ...test,
      scenario: scenario,
      prompt: prompt,
      performance: {
        actualTimeSeconds: duration,
        actualTimeFormatted: formatTime(duration),
        vramUsage: estimateVRAM(test.settings)
      },
      timestamp: new Date().toISOString(),
      success: true
    };

    fs.writeFileSync(
      `landscape-results/${scenario}_${test.name}_results.json`,
      JSON.stringify(testResult, null, 2)
    );

    console.log(`✅ ${scenario} ${test.name} completed in ${formatTime(duration)}`);
    return testResult;

  } catch (error) {
    console.error(`❌ ${scenario} ${test.name} failed:`, error.message);
    return { ...test, scenario, success: false, error: error.message };
  }
}

function estimateVRAM(settings) {
  const pixels = settings.width * settings.height;
  const baseVRAM = (pixels / 1000000) * 2;
  const stepMultiplier = Math.min(settings.steps / 50, 2);
  return `~${Math.round(baseVRAM * stepMultiplier * 10) / 10}GB`;
}

async function waitForCompletion(promptId, timeout = 1200000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
      const history = await response.json();
      
      if (history[promptId]) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
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

async function runLandscapeTests() {
  console.log('🏞️ STARTING LANDSCAPE QUALITY TESTS');
  console.log('🎯 Testing two scenarios across quality levels:');
  console.log('   1. Sci-Fi Cityscape (3/4 isometric, claustrophobic)');
  console.log('   2. Rural Mountain/Forest (regal, majestic)\n');

  if (!fs.existsSync('landscape-results')) {
    fs.mkdirSync('landscape-results');
  }

  const allResults = [];

  // Test Sci-Fi Cityscape scenario
  console.log('🌆 === STARTING SCI-FI CITYSCAPE TESTS ===\n');
  for (const test of landscapeTests) {
    const result = await generateLandscapeTest(test, SCIFI_PROMPT, 'scifi');
    allResults.push(result);
    
    console.log('🌡️ Cooling down GPU for 30 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  console.log('🏔️ === STARTING RURAL MOUNTAIN/FOREST TESTS ===\n');
  // Test Rural Mountain/Forest scenario  
  for (const test of landscapeTests) {
    const result = await generateLandscapeTest(test, RURAL_PROMPT, 'rural');
    allResults.push(result);
    
    console.log('🌡️ Cooling down GPU for 30 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  // Save comprehensive summary
  const summary = {
    testCompleted: new Date().toISOString(),
    testType: 'LANDSCAPE_QUALITY_COMPARISON',
    scenarios: {
      scifi: {
        description: "Futuristic sci-fi cityscape, 3/4 isometric, claustrophobic",
        prompt: SCIFI_PROMPT
      },
      rural: {
        description: "Majestic mountain/forest landscape, regal and grand",
        prompt: RURAL_PROMPT
      }
    },
    levelsCompleted: allResults.filter(r => r.success).length,
    totalLevels: landscapeTests.length * 2,
    findings: {
      hypothesis: "Landscapes may handle higher resolutions better than character portraits",
      testResolutions: ["512x512", "768x768", "1024x1024", "1536x1536", "2048x2048"],
      keyQuestions: [
        "Do landscapes avoid the anatomy deformities seen in character tests?",
        "Can 1536x1536 or 2048x2048 produce usable landscape results?",
        "Which scenario (sci-fi vs rural) handles high resolution better?"
      ]
    },
    results: allResults
  };

  fs.writeFileSync('landscape-results/LANDSCAPE_SUMMARY.json', JSON.stringify(summary, null, 2));

  console.log('🏞️ LANDSCAPE QUALITY TESTS COMPLETED!');
  console.log(`📊 Results saved in landscape-results/`);
  console.log(`🔍 Compare landscape quality vs character quality at high resolutions`);
  console.log(`🎯 Key analysis: Do landscapes break the 1024x1024 limit we found for characters?`);
}

runLandscapeTests().catch(console.error);