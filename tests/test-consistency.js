async function testConsistency() {
  const prompt = "smiling sun character with face"
  const baseOptions = {
    width: 512,
    height: 512,
    quality: 'high'
  }

  console.log('🧪 Testing prompt consistency improvements...\n')
  
  // Test with consistency OFF (random seeds)
  console.log('🎲 Testing with random seeds (normal behavior):')
  for (let i = 1; i <= 2; i++) {
    try {
      const response = await fetch('http://localhost:3000/api/generate-sprite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          service: 'comfyui-local',
          model: 'sdxl',
          comfyUIOptions: {
            ...baseOptions,
            customSettings: { consistentSeed: false }
          }
        })
      })
      
      const result = await response.json()
      if (result.success) {
        console.log(`  ✅ Generation ${i}: ${result.savedImage?.filename || 'Generated successfully'}`)
      } else {
        console.log(`  ❌ Generation ${i} failed: ${result.error}`)
      }
    } catch (error) {
      console.log(`  ❌ Generation ${i} error: ${error.message}`)
    }
  }

  console.log('\n🔒 Testing with consistent seeds (should be identical):')
  for (let i = 1; i <= 2; i++) {
    try {
      const response = await fetch('http://localhost:3000/api/generate-sprite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          service: 'comfyui-local',
          model: 'sdxl',
          comfyUIOptions: {
            ...baseOptions,
            customSettings: { consistentSeed: true }
          }
        })
      })
      
      const result = await response.json()
      if (result.success) {
        console.log(`  ✅ Generation ${i}: ${result.savedImage?.filename || 'Generated successfully'}`)
      } else {
        console.log(`  ❌ Generation ${i} failed: ${result.error}`)
      }
    } catch (error) {
      console.log(`  ❌ Generation ${i} error: ${error.message}`)
    }
  }

  console.log('\n🎯 Test complete! Check the generated images to compare consistency.')
  console.log('💡 With consistent seeds, the same prompt should generate nearly identical images.')
  console.log('🔧 The enhanced negative prompts should also prevent cars/vehicles from appearing.')
}

testConsistency()