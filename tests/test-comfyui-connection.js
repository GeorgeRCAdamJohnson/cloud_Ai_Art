// Quick ComfyUI connection test

async function testComfyUI() {
  const serverUrl = 'http://localhost:8188';
  
  try {
    console.log('🔍 Testing ComfyUI connection...');
    
    // Test 1: System stats
    const statsResponse = await fetch(`${serverUrl}/system_stats`);
    if (!statsResponse.ok) {
      throw new Error(`Stats failed: ${statsResponse.status}`);
    }
    const stats = await statsResponse.json();
    console.log('✅ ComfyUI server is running');
    console.log(`   Version: ${stats.system.comfyui_version}`);
    console.log(`   VRAM Free: ${(stats.devices[0].vram_free / 1024 / 1024 / 1024).toFixed(1)}GB`);
    
    // Test 2: Simple workflow
    const workflow = {
      "3": {
        "inputs": {
          "seed": 12345,
          "steps": 10,
          "cfg": 7.0,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1.0,
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
          "text": "test connection",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": "blurry, low quality",
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
          "filename_prefix": "test",
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };
    
    console.log('🚀 Queuing test workflow...');
    const promptResponse = await fetch(`${serverUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });
    
    if (!promptResponse.ok) {
      throw new Error(`Prompt failed: ${promptResponse.status} - ${await promptResponse.text()}`);
    }
    
    const promptResult = await promptResponse.json();
    console.log(`✅ Workflow queued with ID: ${promptResult.prompt_id}`);
    
    // Test 3: Check queue
    const queueResponse = await fetch(`${serverUrl}/queue`);
    const queue = await queueResponse.json();
    console.log(`📋 Queue status: ${queue.queue_running.length} running, ${queue.queue_pending.length} pending`);
    
    console.log('🎉 ComfyUI connection test PASSED!');
    
  } catch (error) {
    console.error('❌ ComfyUI connection test FAILED:');
    console.error(`   Error: ${error.message}`);
    
    // Troubleshooting tips
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure ComfyUI is running: python main.py --listen --port 8188');
    console.log('   2. Check if SDXL model exists: ComfyUI/models/checkpoints/sd_xl_base_1.0.safetensors');
    console.log('   3. Verify no firewall blocking port 8188');
  }
}

testComfyUI();