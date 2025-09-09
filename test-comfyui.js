// Test ComfyUI connection specifically
async function testComfyUIConnection() {
  console.log('Testing ComfyUI Local connection...\n');
  
  try {
    const response = await fetch('http://localhost:3002/api/generate-sprite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'test connection',
        service: 'comfyui-local',
        model: 'sdxl',
        comfyUIOptions: {
          quality: 'optimized'
        }
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API Response successful');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ API Error:', response.status);
      console.log('Error details:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

// Also test direct ComfyUI connection
async function testDirectComfyUI() {
  console.log('\nTesting direct ComfyUI connection...\n');
  
  try {
    // Test if ComfyUI is responding
    const historyResponse = await fetch('http://localhost:8188/history');
    console.log('ComfyUI History endpoint:', historyResponse.status, historyResponse.ok ? '✅' : '❌');
    
    // Test system stats
    const systemResponse = await fetch('http://localhost:8188/system_stats');
    console.log('ComfyUI System Stats:', systemResponse.status, systemResponse.ok ? '✅' : '❌');
    
    // Test queue
    const queueResponse = await fetch('http://localhost:8188/queue');
    console.log('ComfyUI Queue endpoint:', queueResponse.status, queueResponse.ok ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Direct ComfyUI connection failed:', error.message);
  }
}

testComfyUIConnection();
testDirectComfyUI();