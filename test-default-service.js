// Tes      const response = await fetch('http://localhost:3000/api/generate-sprite', { that ComfyUI Local is now the default service
async function testDefaultService() {
  console.log('🔧 Testing Default Service Fix...\n');
  
  try {
    // Test with no service specified - should default to comfyui-local now
    const response = await fetch('http://localhost:3002/api/generate-sprite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'test default service',
        model: 'sdxl'
        // No service specified - should default to comfyui-local
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log('✅ Success! Default service is now working correctly');
        console.log(`   🎯 Service used: ${result.metadata.service}`);
        console.log(`   📝 Model: ${result.metadata.model}`);
        console.log(`   📁 Image saved as: ${result.savedImage.filename}`);
        console.log(`   💰 Cost: ${result.metadata.cost}`);
        
        if (result.metadata.service === 'comfyui-local') {
          console.log('\n🎉 Perfect! ComfyUI Local is now the default service!');
          console.log('   No more external API calls by default');
          console.log('   No more token usage issues');
        } else {
          console.log(`\n❌ Still using external service: ${result.metadata.service}`);
        }
      } else {
        console.log(`❌ Generation failed: ${result.error}`);
      }
    } else {
      const errorResult = await response.json();
      console.log(`❌ API Error: ${response.status}`);
      console.log(`   Error: ${errorResult.error}`);
    }
  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
  }
}

testDefaultService();