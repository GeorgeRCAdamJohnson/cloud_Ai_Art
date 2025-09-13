// Simple test to check ComfyUI connection and model loading
const COMFYUI_URL = 'http://127.0.0.1:8188';

async function testComfyUIConnection() {
  console.log('🔌 Testing ComfyUI connection...');
  
  try {
    // Test basic connection
    const response = await fetch(`${COMFYUI_URL}/system_stats`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    console.log('✅ ComfyUI is responding');
    
    // Test object_info endpoint to see available nodes
    const objectInfoResponse = await fetch(`${COMFYUI_URL}/object_info`);
    if (!objectInfoResponse.ok) {
      throw new Error(`Object info failed: ${objectInfoResponse.status}`);
    }
    const objectInfo = await objectInfoResponse.json();
    console.log('✅ Object info loaded successfully');
    
    // Check if CheckpointLoaderSimple is available
    if (objectInfo.CheckpointLoaderSimple) {
      console.log('✅ CheckpointLoaderSimple node is available');
      console.log('📋 Available checkpoint inputs:', objectInfo.CheckpointLoaderSimple.input);
    } else {
      console.log('❌ CheckpointLoaderSimple node not found');
    }
    
    return true;
  } catch (error) {
    console.error('❌ ComfyUI connection failed:', error.message);
    return false;
  }
}

async function testSingleModel() {
  console.log('\n🧪 Testing single model generation...');
  
  // Use the DreamShaperXL Turbo V2 that we know works
  const workflow = {
    "3": {
      "class_type": "KSampler",
      "inputs": {
        "seed": 123456,
        "steps": 8,
        "cfg": 2.5,
        "sampler_name": "euler_ancestral",
        "scheduler": "normal",
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      }
    },
    "4": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": { "ckpt_name": "DreamShaperXL_Turbo_V2-SFW.safetensors" }
    },
    "5": {
      "class_type": "EmptyLatentImage",
      "inputs": {
        "width": 512,
        "height": 512,
        "batch_size": 1
      }
    },
    "6": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": "beautiful anime character, simple test",
        "clip": ["4", 1]
      }
    },
    "7": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": "blurry, low quality",
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
        "filename_prefix": "test_connection",
        "images": ["8", 0]
      }
    }
  };

  try {
    console.log('📤 Sending test workflow...');
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Workflow submitted successfully');
    console.log('🎯 Prompt ID:', result.prompt_id);
    
    // Wait for completion
    console.log('⏳ Waiting for generation...');
    await waitForCompletion(result.prompt_id);
    console.log('✅ Test generation completed!');
    
    return true;
  } catch (error) {
    console.error('❌ Test generation failed:', error.message);
    return false;
  }
}

async function waitForCompletion(promptId, timeout = 120000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
      const history = await response.json();
      
      if (history[promptId]) {
        return true;
      }
      
      console.log('⏳ Still generating...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.log('⏳ Checking status...', error.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  throw new Error('Generation timeout');
}

async function testOtherModels() {
  console.log('\n🎭 Testing other models individually...');
  
  const modelsToTest = [
    "animeArtDiffusionXL_alpha3.safetensors",
    "dreamshaperXL_v21TurboDPMSDE.safetensors", 
    "Qwen2VL.safetensors"
  ];
  
  for (const modelFile of modelsToTest) {
    console.log(`\n🧪 Testing ${modelFile}...`);
    
    const workflow = {
      "3": {
        "class_type": "KSampler",
        "inputs": {
          "seed": 123456,
          "steps": 8,
          "cfg": 2.5,
          "sampler_name": "euler_ancestral", 
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        }
      },
      "4": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": { "ckpt_name": modelFile }
      },
      "5": {
        "class_type": "EmptyLatentImage",
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        }
      },
      "6": {
        "class_type": "CLIPTextEncode",
        "inputs": {
          "text": "simple test image",
          "clip": ["4", 1]
        }
      },
      "7": {
        "class_type": "CLIPTextEncode",
        "inputs": {
          "text": "blurry",
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
          "filename_prefix": `test_${modelFile.replace('.safetensors', '')}`,
          "images": ["8", 0]
        }
      }
    };

    try {
      const response = await fetch(`${COMFYUI_URL}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: workflow })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ ${modelFile} failed: ${errorText}`);
        continue;
      }

      const result = await response.json();
      console.log(`✅ ${modelFile} workflow submitted (${result.prompt_id})`);
      
      // Wait for completion with shorter timeout
      try {
        await waitForCompletion(result.prompt_id, 60000);
        console.log(`✅ ${modelFile} generation completed!`);
      } catch (timeoutError) {
        console.log(`⏰ ${modelFile} timed out (may still be processing):`, timeoutError.message);
      }
      
    } catch (error) {
      console.log(`❌ ${modelFile} error:`, error.message);
    }
    
    // Cooling down between tests
    console.log('🌡️ Cooling down for 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

async function runDiagnosticTests() {
  console.log('🔧 COMFYUI MODEL DIAGNOSTIC TESTS');
  console.log('=' .repeat(50));
  
  const connectionOk = await testComfyUIConnection();
  if (!connectionOk) {
    console.log('❌ Cannot proceed - ComfyUI connection failed');
    return;
  }
  
  const singleTestOk = await testSingleModel();
  if (!singleTestOk) {
    console.log('❌ Basic test failed - check ComfyUI logs');
    return;
  }
  
  await testOtherModels();
  
  console.log('\n🎯 DIAGNOSTIC COMPLETE');
  console.log('Check ComfyUI output folder for generated test images');
}

runDiagnosticTests().catch(console.error);