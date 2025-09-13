// DreamshaperXL Turbo Optimized Test
// Testing proper Turbo model settings vs SDXL Base settings

async function testTurboOptimization() {
  console.log('🚀 Testing DreamshaperXL Turbo Optimization...');
  console.log('🎯 Comparing SDXL Base settings vs Turbo-optimized settings');
  
  const tests = [
    {
      name: "WRONG_SDXL_Base_Settings",
      description: "Using SDXL Base settings on Turbo (SLOW)",
      steps: 60,
      cfg: 8,
      sampler: "dpmpp_2m",
      scheduler: "karras",
      expected: "SLOW - 20+ seconds per step"
    },
    {
      name: "CORRECT_Turbo_Fast",
      description: "Turbo optimized settings (FAST)",
      steps: 6,
      cfg: 2,
      sampler: "euler",
      scheduler: "normal", 
      expected: "FAST - 1-2 seconds per step"
    },
    {
      name: "CORRECT_Turbo_Quality",
      description: "Turbo quality settings (BALANCED)",
      steps: 8,
      cfg: 2.5,
      sampler: "euler_ancestral",
      scheduler: "normal",
      expected: "FAST - 2-3 seconds per step"
    },
    {
      name: "CORRECT_Turbo_High",
      description: "Turbo high quality (STILL FAST)",
      steps: 12,
      cfg: 3,
      sampler: "dpmpp_2m",
      scheduler: "normal",
      expected: "FAST - 3-4 seconds per step"
    }
  ];

  for (const test of tests) {
    console.log(`\n🔧 Testing: ${test.name}`);
    console.log(`📝 ${test.description}`);
    console.log(`⚙️ Settings: ${test.steps} steps, CFG ${test.cfg}, ${test.sampler}`);
    console.log(`📈 Expected: ${test.expected}`);
    
    const startTime = Date.now();
    
    try {
      const workflow = createTurboWorkflow(test);
      const result = await runWorkflow(workflow);
      
      await monitorProgress(result.prompt_id, startTime, test.name);
      
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message);
    }
    
    // Cool down between tests
    console.log('🌡️ Cooling down for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}

function createTurboWorkflow(test) {
  return {
    "3": {
      "inputs": {
        "seed": Math.floor(Math.random() * 1000000),
        "steps": test.steps,
        "cfg": test.cfg,
        "sampler_name": test.sampler,
        "scheduler": test.scheduler,
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      },
      "class_type": "KSampler"
    },
    "4": {
      "inputs": {
        "ckpt_name": "DreamShaperXL_Turbo_V2-SFW.safetensors"
      },
      "class_type": "CheckpointLoaderSimple"
    },
    "5": {
      "inputs": {
        "width": 1024,
        "height": 1024,
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage"
    },
    "6": {
      "inputs": {
        "text": "beautiful anime character, masterpiece, high quality",
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode"
    },
    "7": {
      "inputs": {
        "text": "blurry, low quality, deformed, ugly",
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode"
    },
    "8": {
      "inputs": {
        "samples": ["3", 0],
        "vae": ["4", 2]
      },
      "class_type": "VAEDecode"
    },
    "9": {
      "inputs": {
        "filename_prefix": `turbo_test_${test.name}`,
        "images": ["8", 0]
      },
      "class_type": "SaveImage"
    }
  };
}

async function runWorkflow(workflow) {
  const response = await fetch('http://127.0.0.1:8188/prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: workflow
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

async function monitorProgress(promptId, startTime, testName) {
  const checkProgress = async () => {
    try {
      const historyResponse = await fetch(`http://127.0.0.1:8188/history/${promptId}`);
      const history = await historyResponse.json();
      
      if (history[promptId]) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ ${testName} completed in ${elapsed} seconds!`);
        
        // Calculate per-step performance
        const steps = history[promptId].prompt?.[3]?.inputs?.steps || 'unknown';
        const perStep = (elapsed / steps).toFixed(2);
        console.log(`📊 Performance: ${perStep}s per step (${steps} total steps)`);
        
        if (perStep < 5) {
          console.log('🚀 EXCELLENT! This is proper Turbo performance');
        } else if (perStep < 10) {
          console.log('✅ Good performance for this setting');
        } else {
          console.log('⚠️  Slower than expected - check settings');
        }
        
        return true;
      }
      
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      process.stdout.write(`\r⏱️  ${testName}: ${elapsed}s elapsed...`);
      
      return false;
    } catch (error) {
      console.error(`\n❌ Error checking progress for ${testName}:`, error.message);
      return true;
    }
  };
  
  // Check every 2 seconds
  while (true) {
    if (await checkProgress()) break;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

console.log('🎯 DreamshaperXL Turbo Optimization Test');
console.log('📋 This will prove that model settings matter!');
console.log('⚠️  Expected: WRONG settings = 20s/step, CORRECT settings = 2s/step');
console.log('');

testTurboOptimization();