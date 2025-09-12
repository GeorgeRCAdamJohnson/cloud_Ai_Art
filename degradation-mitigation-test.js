// Degradation Mitigation Test - Optimize high-resolution settings
const fs = require('fs');

const COMFYUI_URL = 'http://127.0.0.1:8188';

const TEST_PROMPT = "beautiful woman portrait, detailed face, professional photography, studio lighting";
const NEGATIVE_PROMPT = "blurry, low quality, distorted, deformed, extra limbs, bad anatomy, oversaturated";

// Test different parameter combinations to reduce degradation at 1536x1536+
const mitigationTests = [
  {
    level: 1,
    name: "BASELINE_1536_Original",
    description: "Original problematic settings",
    settings: { width: 1536, height: 1536, steps: 120, cfg: 9.5, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 2,
    name: "MITIGATION_1536_LowerCFG",
    description: "Reduce CFG to prevent over-guidance",
    settings: { width: 1536, height: 1536, steps: 120, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 3,
    name: "MITIGATION_1536_FewerSteps",
    description: "Reduce steps to prevent convergence issues", 
    settings: { width: 1536, height: 1536, steps: 80, cfg: 8, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 4,
    name: "MITIGATION_1536_BetterSampler",
    description: "Use Euler Ancestral for better high-res",
    settings: { width: 1536, height: 1536, steps: 100, cfg: 8, sampler: "euler_ancestral", scheduler: "normal" }
  },
  {
    level: 5,
    name: "MITIGATION_1536_Conservative",
    description: "Conservative settings optimized for quality",
    settings: { width: 1536, height: 1536, steps: 60, cfg: 7, sampler: "dpmpp_2m", scheduler: "normal" }
  },
  {
    level: 6,
    name: "BASELINE_2048_Original", 
    description: "2048 original problematic settings",
    settings: { width: 2048, height: 2048, steps: 150, cfg: 10, sampler: "dpmpp_2m", scheduler: "karras" }
  },
  {
    level: 7,
    name: "MITIGATION_2048_Aggressive",
    description: "Aggressive mitigation for 2048x2048",
    settings: { width: 2048, height: 2048, steps: 50, cfg: 6.5, sampler: "euler_ancestral", scheduler: "normal" }
  },
  {
    level: 8,
    name: "MITIGATION_2048_Moderate",
    description: "Moderate mitigation for 2048x2048", 
    settings: { width: 2048, height: 2048, steps: 80, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "normal" }
  }
];

async function generateMitigationTest(test) {
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
        "text": TEST_PROMPT,
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
        "filename_prefix": `mitigation_${test.name}`,
        "images": ["8", 0]
      }
    }
  };

  console.log(`🔧 Testing Degradation Mitigation - ${test.name}`);
  console.log(`📝 ${test.description}`);
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
      performance: {
        actualTimeSeconds: duration,
        actualTimeFormatted: formatTime(duration),
        vramUsage: estimateVRAM(test.settings)
      },
      timestamp: new Date().toISOString(),
      success: true
    };

    fs.writeFileSync(
      `mitigation-results/${test.name}_results.json`,
      JSON.stringify(testResult, null, 2)
    );

    console.log(`✅ ${test.name} completed in ${formatTime(duration)}`);
    return testResult;

  } catch (error) {
    console.error(`❌ ${test.name} failed:`, error.message);
    return { ...test, success: false, error: error.message };
  }
}

function estimateVRAM(settings) {
  const pixels = settings.width * settings.height;
  const baseVRAM = (pixels / 1000000) * 2; // Base VRAM per megapixel
  const stepMultiplier = Math.min(settings.steps / 50, 2); // Steps impact
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

async function runMitigationTests() {
  console.log('🔧 STARTING DEGRADATION MITIGATION TESTS');
  console.log('🎯 Testing parameter optimizations to reduce quality degradation at high resolutions\n');

  if (!fs.existsSync('mitigation-results')) {
    fs.mkdirSync('mitigation-results');
  }

  const results = [];

  for (const test of mitigationTests) {
    const result = await generateMitigationTest(test);
    results.push(result);
    
    console.log('🌡️ Cooling down GPU for 45 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 45000));
  }

  const summary = {
    testCompleted: new Date().toISOString(),
    testType: 'DEGRADATION_MITIGATION',
    levelsCompleted: results.filter(r => r.success).length,
    totalLevels: mitigationTests.length,
    findings: {
      "1536x1536_recommendations": "Compare levels 1-5 to find optimal settings",
      "2048x2048_recommendations": "Compare levels 6-8 to assess if mitigation works",
      "key_parameters": "Focus on CFG scale (7-8 optimal) and steps (50-80 optimal)"
    },
    results: results
  };

  fs.writeFileSync('mitigation-results/MITIGATION_SUMMARY.json', JSON.stringify(summary, null, 2));

  console.log('🔧 DEGRADATION MITIGATION TESTS COMPLETED!');
  console.log(`📊 Results saved in mitigation-results/`);
  console.log(`🔍 Compare image quality to identify optimal high-resolution settings`);
}

runMitigationTests().catch(console.error);