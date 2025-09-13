// Direct ComfyUI performance test
// Using built-in fetch in Node.js 18+

async function testDirectComfyUI() {
  console.log('🚀 Testing Direct ComfyUI Performance...');
  console.log('📝 Simple 512x512 generation test');
  
  const startTime = Date.now();
  
  try {
    // Basic SDXL workflow for 512x512
    const workflow = {
      "3": {
        "inputs": {
          "seed": Math.floor(Math.random() * 1000000),
          "steps": 25,
          "cfg": 7,
          "sampler_name": "euler",
          "scheduler": "normal",
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
          "ckpt_name": "sd_xl_base_1.0.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": "cute rabbit character, digital art",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": "blurry, low quality, deformed",
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
          "filename_prefix": "performance_test",
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };

    console.log('🔄 Sending generation request...');
    
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

    const result = await response.json();
    const promptId = result.prompt_id;
    
    console.log('✅ Request submitted, monitoring progress...');
    console.log('🆔 Prompt ID:', promptId);
    
    // Monitor progress
    await monitorProgress(promptId, startTime);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function monitorProgress(promptId, startTime) {
  const checkProgress = async () => {
    try {
      const historyResponse = await fetch(`http://127.0.0.1:8188/history/${promptId}`);
      const history = await historyResponse.json();
      
      if (history[promptId]) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ Generation completed in ${elapsed} seconds!`);
        
        if (elapsed < 60) {
          console.log('🚀 EXCELLENT PERFORMANCE! Under 1 minute');
        } else if (elapsed < 120) {
          console.log('✅ Good performance');
        } else {
          console.log('⚠️  Slower than expected - check for issues');
        }
        
        return true;
      }
      
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      process.stdout.write(`\r⏱️  Progress: ${elapsed}s elapsed...`);
      
      return false;
    } catch (error) {
      console.error('\n❌ Error checking progress:', error.message);
      return true;
    }
  };
  
  // Check every 2 seconds
  while (true) {
    if (await checkProgress()) break;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

testDirectComfyUI();