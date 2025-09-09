// Simple test to verify enhanced prompting
async function testSinglePrompt() {
  try {
    const response = await fetch('http://localhost:3002/api/generate-sprite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'cute rabbit character',
        service: 'comfyui-local',
        model: 'sdxl',
        comfyUIOptions: {
          quality: 'high'
        }
      })
    });
    
    const result = await response.json();
    console.log('Full response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSinglePrompt();