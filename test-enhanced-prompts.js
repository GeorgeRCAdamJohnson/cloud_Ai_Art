// Test script for enhanced prompting system
const fs = require('fs');

async function testEnhancedPrompts() {
  const baseUrl = 'http://localhost:3002';
  
  const testCases = [
    {
      name: 'Basic Character Test',
      prompt: 'cute rabbit character',
      model: 'sdxl',
      quality: 'high'
    },
    {
      name: 'Knight Character Test',
      prompt: 'brave knight warrior',
      model: 'sdxl',
      quality: 'ultra'
    },
    {
      name: 'SD15 Sprite Test',
      prompt: 'colorful butterfly',
      model: 'sd15',
      quality: 'optimized'
    }
  ];
  
  console.log('🎨 Testing Enhanced Prompting System...\n');
  
  for (const test of testCases) {
    console.log(`Testing: ${test.name}`);
    console.log(`Original prompt: "${test.prompt}"`);
    console.log(`Model: ${test.model}, Quality: ${test.quality}\n`);
    
    try {
      const response = await fetch(`${baseUrl}/api/generate-sprite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: test.prompt,
          service: 'comfyui-local',
          model: test.model,
          comfyUIOptions: {
            quality: test.quality
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Error: ${response.status} - ${errorText}\n`);
        continue;
      }
      
      const result = await response.json();
      console.log(`✅ Success! Generated image: ${result.filename}`);
      console.log(`Enhanced prompt was: "${result.enhancedPrompt || 'Not returned'}"`);
      console.log(`Negative prompt: "${result.negativePrompt || 'Not returned'}"`);
      console.log(`---\n`);
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('✨ Enhanced prompting test complete!');
}

// Run the test
testEnhancedPrompts().catch(console.error);