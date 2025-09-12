#!/usr/bin/env node

/**
 * RTX 3050 6GB Stress Test - Progressive Quality Validation
 * Tests GPU limits from 8-second cartoon to 20+ minute photorealistic 4K
 * 
 * Usage: node rtx3050-stress-test.js
 */

const fs = require('fs');
const path = require('path');

// Test Configuration
const TEST_PROMPT = "beautiful woman with flowing hair";
const COMFYUI_SERVER = "http://localhost:8188";
const OUTPUT_DIR = "./stress-test-results";

// Progressive Test Levels (8 seconds to 20+ minutes)
const TEST_LEVELS = [
  // Level 1: Ultra Fast Cartoon (8-10 seconds)
  {
    name: "01_UltraFast_Cartoon",
    description: "Ultra fast cartoon style",
    width: 512,
    height: 512,
    steps: 8,
    cfg: 5.0,
    sampler: "euler",
    scheduler: "normal",
    style: "simple cartoon style, basic colors",
    negative: "realistic, photorealistic, detailed",
    expectedTime: "8-10 seconds",
    vramUsage: "~2GB"
  },
  
  // Level 2: Fast Cartoon (15-20 seconds)
  {
    name: "02_Fast_Cartoon",
    description: "Fast cartoon with better quality",
    width: 512,
    height: 512,
    steps: 15,
    cfg: 6.0,
    sampler: "euler",
    scheduler: "normal",
    style: "cartoon style, vibrant colors, clean lines",
    negative: "realistic, photorealistic, blurry",
    expectedTime: "15-20 seconds",
    vramUsage: "~2.5GB"
  },
  
  // Level 3: Quality Cartoon (30-45 seconds)
  {
    name: "03_Quality_Cartoon",
    description: "High quality cartoon style",
    width: 768,
    height: 768,
    steps: 25,
    cfg: 7.0,
    sampler: "euler_ancestral",
    scheduler: "normal",
    style: "high quality cartoon, Disney Pixar style, detailed animation",
    negative: "realistic, photorealistic, blurry, low quality",
    expectedTime: "30-45 seconds",
    vramUsage: "~3GB"
  },
  
  // Level 4: Disney Quality (1-2 minutes)
  {
    name: "04_Disney_Quality",
    description: "Disney/Pixar studio quality",
    width: 768,
    height: 768,
    steps: 40,
    cfg: 7.5,
    sampler: "dpmpp_2m",
    scheduler: "normal",
    style: "Disney Pixar studio quality, professional 3D animation, perfect lighting, detailed textures",
    negative: "realistic, photorealistic, blurry, low quality, amateur",
    expectedTime: "1-2 minutes",
    vramUsage: "~3.5GB"
  },
  
  // Level 5: Semi-Realistic (2-4 minutes)
  {
    name: "05_SemiRealistic",
    description: "Semi-realistic high quality",
    width: 1024,
    height: 1024,
    steps: 50,
    cfg: 8.0,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    style: "semi-realistic, detailed features, professional art, high quality rendering",
    negative: "cartoon, anime, blurry, low quality, distorted",
    expectedTime: "2-4 minutes",
    vramUsage: "~4GB"
  },
  
  // Level 6: Photorealistic Standard (4-8 minutes)
  {
    name: "06_Photorealistic_Standard",
    description: "Photorealistic standard quality",
    width: 1024,
    height: 1024,
    steps: 80,
    cfg: 8.5,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    style: "photorealistic, professional photography, studio lighting, detailed skin texture, perfect anatomy",
    negative: "cartoon, anime, blurry, low quality, distorted, bad anatomy, bad hands",
    expectedTime: "4-8 minutes",
    vramUsage: "~4.5GB"
  },
  
  // Level 7: Photorealistic High (8-12 minutes)
  {
    name: "07_Photorealistic_High",
    description: "High-end photorealistic",
    width: 1536,
    height: 1536,
    steps: 100,
    cfg: 9.0,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    style: "masterpiece, best quality, ultra high resolution, photorealistic, professional photography, studio lighting, sharp focus, detailed textures, perfect anatomy, realistic skin",
    negative: "cartoon, anime, blurry, low quality, distorted, bad anatomy, bad hands, bad fingers, extra fingers, deformed",
    expectedTime: "8-12 minutes",
    vramUsage: "~5GB"
  },
  
  // Level 8: Ultra Photorealistic (12-18 minutes)
  {
    name: "08_Ultra_Photorealistic",
    description: "Ultra photorealistic quality",
    width: 1536,
    height: 1536,
    steps: 120,
    cfg: 9.5,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    style: "masterpiece, best quality, ultra high resolution, 8k, photorealistic, professional photography, studio lighting, sharp focus, detailed textures, cinematic quality, perfect anatomy, realistic skin texture, natural pose, professional model",
    negative: "blurry, low quality, distorted, bad anatomy, bad hands, bad fingers, extra fingers, missing fingers, deformed hands, extra limbs, bad proportions, cartoon, anime, illustration",
    expectedTime: "12-18 minutes",
    vramUsage: "~5.5GB"
  },
  
  // Level 9: 4K Photorealistic (18-25 minutes) - DANGER ZONE
  {
    name: "09_4K_Photorealistic_DANGER",
    description: "4K photorealistic - GPU limit test",
    width: 2048,
    height: 2048,
    steps: 150,
    cfg: 10.0,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    style: "masterpiece, best quality, ultra high resolution, 4K, 8K, photorealistic, professional photography, studio lighting, sharp focus, detailed textures, cinematic quality, perfect anatomy, realistic skin texture, natural pose, professional model, high-end fashion photography",
    negative: "blurry, low quality, distorted, bad anatomy, bad hands, bad fingers, extra fingers, missing fingers, deformed hands, mutated hands, extra limbs, missing limbs, deformed limbs, bad proportions, malformed limbs, disfigured, cartoon, anime, illustration, painting, drawing, art, sketch",
    expectedTime: "18-25 minutes",
    vramUsage: "~6GB - VRAM LIMIT WARNING"
  },
  
  // Level 10: EXTREME 4K+ (25+ minutes) - BREAKING POINT
  {
    name: "10_EXTREME_4K_BREAKING_POINT",
    description: "EXTREME 4K+ - RTX 3050 breaking point",
    width: 2048,
    height: 2048,
    steps: 200,
    cfg: 11.0,
    sampler: "dpmpp_2m",
    scheduler: "karras",
    style: "masterpiece, best quality, ultra high resolution, 4K, 8K, photorealistic, professional photography, studio lighting, sharp focus, detailed textures, cinematic quality, perfect anatomy, realistic skin texture, natural pose, professional model, high-end fashion photography, award winning photograph",
    negative: "blurry, low quality, distorted, bad anatomy, bad hands, bad fingers, extra fingers, missing fingers, deformed hands, mutated hands, extra limbs, missing limbs, deformed limbs, extra arms, extra legs, bad proportions, malformed limbs, disfigured, ugly face, asymmetric face, long neck, duplicate, morbid, mutilated, out of frame, body out of frame, cartoon, anime, illustration, painting, drawing, art, sketch",
    expectedTime: "25+ minutes",
    vramUsage: "6GB+ - LIKELY TO CRASH"
  }
];

// Create ComfyUI workflow template
function createWorkflow(level, prompt) {
  const fullPrompt = `${prompt}, ${level.style}`;
  
  return {
    "3": {
      "inputs": {
        "seed": Math.floor(Math.random() * 1000000),
        "steps": level.steps,
        "cfg": level.cfg,
        "sampler_name": level.sampler,
        "scheduler": level.scheduler,
        "denoise": 1.0,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      },
      "class_type": "KSampler",
      "_meta": {
        "title": "KSampler"
      }
    },
    "4": {
      "inputs": {
        "ckpt_name": "sd_xl_base_1.0.safetensors"
      },
      "class_type": "CheckpointLoaderSimple",
      "_meta": {
        "title": "Load Checkpoint"
      }
    },
    "5": {
      "inputs": {
        "width": level.width,
        "height": level.height,
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": {
        "title": "Empty Latent Image"
      }
    },
    "6": {
      "inputs": {
        "text": fullPrompt,
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP Text Encode (Prompt)"
      }
    },
    "7": {
      "inputs": {
        "text": level.negative,
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP Text Encode (Negative)"
      }
    },
    "8": {
      "inputs": {
        "samples": ["3", 0],
        "vae": ["4", 2]
      },
      "class_type": "VAEDecode",
      "_meta": {
        "title": "VAE Decode"
      }
    },
    "9": {
      "inputs": {
        "filename_prefix": level.name,
        "images": ["8", 0]
      },
      "class_type": "SaveImage",
      "_meta": {
        "title": "Save Image"
      }
    }
  };
}

// Queue prompt to ComfyUI
async function queuePrompt(workflow) {
  const response = await fetch(`${COMFYUI_SERVER}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: workflow })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to queue prompt: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.prompt_id;
}

// Check system health and VRAM usage
async function checkSystemHealth() {
  try {
    const response = await fetch(`${COMFYUI_SERVER}/system_stats`);
    if (response.ok) {
      const stats = await response.json();
      return {
        healthy: true,
        vramUsed: stats.system?.vram_used || 0,
        vramTotal: stats.system?.vram_total || 6144
      };
    }
  } catch (error) {
    console.log('⚠️  Could not check system stats');
  }
  return { healthy: true, vramUsed: 0, vramTotal: 6144 };
}

// Wait for completion and get result
async function waitForCompletion(promptId) {
  let attempts = 0;
  const maxAttempts = 600; // 30 minutes max
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    
    try {
      const response = await fetch(`${COMFYUI_SERVER}/history/${promptId}`);
      if (!response.ok) continue;
      
      const history = await response.json();
      if (history[promptId]) {
        return history[promptId];
      }
      
      // Show progress every 30 seconds
      if (attempts % 6 === 0) {
        const minutes = Math.floor((attempts * 5) / 60);
        const seconds = (attempts * 5) % 60;
        console.log(`⏳ Still generating... ${minutes}m ${seconds}s elapsed`);
      }
    } catch (error) {
      console.log(`⏳ Generation in progress... (${attempts * 5}s)`);
    }
    
    attempts++;
  }
  
  throw new Error('Generation timeout');
}

// Run single test level
async function runTestLevel(level, levelIndex) {
  console.log(`\\n${'='.repeat(60)}`);
  console.log(`🧪 LEVEL ${levelIndex + 1}/10: ${level.name}`);
  console.log(`📝 ${level.description}`);
  console.log(`📐 Resolution: ${level.width}x${level.height}`);
  console.log(`⚙️  Steps: ${level.steps}, CFG: ${level.cfg}, Sampler: ${level.sampler}`);
  console.log(`⏱️  Expected Time: ${level.expectedTime}`);
  console.log(`💾 VRAM Usage: ${level.vramUsage}`);
  console.log(`${'='.repeat(60)}`);
  
  if (level.vramUsage.includes('CRASH') || level.vramUsage.includes('BREAKING')) {
    console.log(`⚠️  WARNING: This level may crash your GPU!`);
    console.log(`⚠️  Make sure to save your work before proceeding.`);
    console.log(`⚠️  Press Ctrl+C to cancel if needed.`);
    
    // 10 second warning for dangerous levels
    for (let i = 10; i > 0; i--) {
      process.stdout.write(`\\r⚠️  Starting in ${i} seconds... `);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\\n');
  }
  
  const startTime = Date.now();
  
  try {
    // Create workflow
    const workflow = createWorkflow(level, TEST_PROMPT);
    
    // Queue prompt
    console.log(`🚀 Queuing prompt...`);
    const promptId = await queuePrompt(workflow);
    console.log(`📋 Prompt ID: ${promptId}`);
    
    // Wait for completion
    console.log(`⏳ Generating... (Expected: ${level.expectedTime})`);
    const result = await waitForCompletion(promptId);
    
    const endTime = Date.now();
    const actualTime = Math.round((endTime - startTime) / 1000);
    const minutes = Math.floor(actualTime / 60);
    const seconds = actualTime % 60;
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    console.log(`✅ COMPLETED: ${level.name}`);
    console.log(`⏱️  Actual Time: ${timeString}`);
    console.log(`📊 Performance: ${actualTime < 60 ? 'FAST' : actualTime < 300 ? 'NORMAL' : actualTime < 600 ? 'SLOW' : 'VERY SLOW'}`);
    
    // Save results
    const resultData = {
      level: levelIndex + 1,
      name: level.name,
      description: level.description,
      settings: {
        width: level.width,
        height: level.height,
        steps: level.steps,
        cfg: level.cfg,
        sampler: level.sampler,
        scheduler: level.scheduler
      },
      performance: {
        expectedTime: level.expectedTime,
        actualTimeSeconds: actualTime,
        actualTimeFormatted: timeString,
        vramUsage: level.vramUsage
      },
      timestamp: new Date().toISOString(),
      success: true
    };
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Save result data
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${level.name}_results.json`),
      JSON.stringify(resultData, null, 2)
    );
    
    return resultData;
    
  } catch (error) {
    const endTime = Date.now();
    const actualTime = Math.round((endTime - startTime) / 1000);
    
    console.log(`❌ FAILED: ${level.name}`);
    console.log(`💥 Error: ${error.message}`);
    console.log(`⏱️  Time before failure: ${actualTime}s`);
    
    const errorData = {
      level: levelIndex + 1,
      name: level.name,
      error: error.message,
      timeBeforeFailure: actualTime,
      timestamp: new Date().toISOString(),
      success: false
    };
    
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${level.name}_ERROR.json`),
      JSON.stringify(errorData, null, 2)
    );
    
    return errorData;
  }
}

// Main test runner
async function runStressTest() {
  console.log(`🎯 RTX 3050 6GB Stress Test Starting...`);
  console.log(`📝 Test Prompt: "${TEST_PROMPT}"`);
  console.log(`🖥️  ComfyUI Server: ${COMFYUI_SERVER}`);
  console.log(`📁 Output Directory: ${OUTPUT_DIR}`);
  console.log(`🧪 Total Levels: ${TEST_LEVELS.length}`);
  
  const results = [];
  let lastSuccessfulLevel = 0;
  
  for (let i = 0; i < TEST_LEVELS.length; i++) {
    const result = await runTestLevel(TEST_LEVELS[i], i);
    results.push(result);
    
    if (result.success) {
      lastSuccessfulLevel = i + 1;
    } else {
      console.log(`\\n💥 GPU LIMIT REACHED at Level ${i + 1}`);
      console.log(`🏆 Last successful level: ${lastSuccessfulLevel}`);
      break;
    }
    
    // Smart cooling and system recovery between levels
    if (i < TEST_LEVELS.length - 1) {
      const nextLevel = TEST_LEVELS[i + 1];
      let cooldownTime = 15000; // Base 15 seconds
      
      // Longer cooldown for high-intensity levels
      if (result.success && result.performance?.actualTimeSeconds > 300) {
        cooldownTime = 30000; // 30 seconds after 5+ minute generations
      }
      if (nextLevel.vramUsage.includes('DANGER') || nextLevel.vramUsage.includes('BREAKING')) {
        cooldownTime = 60000; // 60 seconds before dangerous levels
      }
      
      console.log(`\\n🧊 System Recovery Phase (${cooldownTime/1000}s)`);
      console.log(`   💾 Allowing VRAM to clear...`);
      console.log(`   🌡️  GPU cooling down...`);
      console.log(`   🔄 Preparing for next level...`);
      
      // Show countdown for longer waits
      if (cooldownTime >= 30000) {
        for (let countdown = cooldownTime/1000; countdown > 0; countdown -= 5) {
          process.stdout.write(`\\r   ⏳ Cooling down: ${countdown}s remaining...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        console.log('\\r   ✅ System ready for next level!        ');
      } else {
        await new Promise(resolve => setTimeout(resolve, cooldownTime));
      }
      
      // Check system health before proceeding
      console.log(`🔍 Checking system health...`);
      const health = await checkSystemHealth();
      if (health.vramUsed > health.vramTotal * 0.8) {
        console.log(`⚠️  High VRAM usage detected: ${health.vramUsed}MB/${health.vramTotal}MB`);
        console.log(`🧊 Extended cooling period...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  }
  
  // Generate final report
  console.log(`\\n${'='.repeat(80)}`);
  console.log(`🏁 RTX 3050 STRESS TEST COMPLETE`);
  console.log(`${'='.repeat(80)}`);
  console.log(`🏆 Levels Completed: ${lastSuccessfulLevel}/${TEST_LEVELS.length}`);
  console.log(`💪 GPU Performance Rating: ${getPerformanceRating(lastSuccessfulLevel)}`);
  
  const summary = {
    testCompleted: new Date().toISOString(),
    levelsCompleted: lastSuccessfulLevel,
    totalLevels: TEST_LEVELS.length,
    performanceRating: getPerformanceRating(lastSuccessfulLevel),
    results: results
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'STRESS_TEST_SUMMARY.json'),
    JSON.stringify(summary, null, 2)
  );
  
  console.log(`📊 Full results saved to: ${OUTPUT_DIR}`);
}

function getPerformanceRating(completedLevels) {
  if (completedLevels >= 10) return "🔥 EXTREME - GPU BEAST";
  if (completedLevels >= 8) return "💎 EXCELLENT - High-end capable";
  if (completedLevels >= 6) return "⭐ VERY GOOD - Professional quality";
  if (completedLevels >= 4) return "✅ GOOD - Solid performance";
  if (completedLevels >= 2) return "⚠️ BASIC - Entry level";
  return "❌ INSUFFICIENT - Upgrade needed";
}

// Run the test
if (require.main === module) {
  runStressTest().catch(console.error);
}

module.exports = { runStressTest, TEST_LEVELS };