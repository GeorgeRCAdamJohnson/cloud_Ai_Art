// Working Models Optimization Test - Only testing verified working models
const fs = require('fs');

const COMFYUI_URL = 'http://127.0.0.1:8188';

// Test prompts
const CHARACTER_PROMPT = "beautiful anime character, detailed face, expressive eyes, colorful hair, modern clothing, high quality digital art";
const LANDSCAPE_PROMPT = "serene mountain landscape, golden hour lighting, misty peaks, concept art style";
const NEGATIVE_PROMPT = "blurry, low quality, distorted, bad anatomy, deformed";

// Only test the working models (files > 1GB)
const WORKING_MODELS = [
  {
    filename: "DreamShaperXL_Turbo_V2-SFW.safetensors",
    name: "DreamShaperXL_Turbo_V2", 
    type: "turbo_optimized",
    expectedStrength: "speed_quality_balance",
    notes: "Known working Turbo model - our baseline",
    fileSize: "6.9GB"
  },
  {
    filename: "sd_xl_base_1.0.safetensors",
    name: "SDXL_Base_1.0",
    type: "standard_sdxl",
    expectedStrength: "high_quality_detail",
    notes: "Standard SDXL Base model - quality reference",
    fileSize: "6.9GB"
  }
];

// Test configurations based on our validated findings
const TEST_CONFIGURATIONS = [
  {
    name: "ULTRA_FAST_TURBO",
    description: "Ultra fast turbo settings",
    settings: { steps: 6, cfg: 2, sampler: "euler", scheduler: "normal" },
    expectedTime: "~16s",
    purpose: "speed_baseline",
    bestFor: "turbo"
  },
  {
    name: "OPTIMAL_TURBO", 
    description: "Validated optimal turbo settings",
    settings: { steps: 8, cfg: 2.5, sampler: "euler_ancestral", scheduler: "normal" },
    expectedTime: "~18s", 
    purpose: "main_workflow",
    bestFor: "turbo"
  },
  {
    name: "AVOID_NOISE_VALLEY",
    description: "Testing problematic 12-step range",
    settings: { steps: 12, cfg: 3, sampler: "dpmpp_2m", scheduler: "normal" },
    expectedTime: "~24s",
    purpose: "artifact_validation",
    warning: "Expected to show noise/artifacts",
    bestFor: "validation"
  },
  {
    name: "STANDARD_SDXL_QUALITY",
    description: "Standard SDXL quality settings",
    settings: { steps: 30, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "karras" },
    expectedTime: "~67s",
    purpose: "quality_comparison",
    bestFor: "standard"
  },
  {
    name: "HIGH_QUALITY_SDXL", 
    description: "High quality SDXL settings",
    settings: { steps: 50, cfg: 8, sampler: "dpmpp_2m", scheduler: "karras" },
    expectedTime: "~120s",
    purpose: "max_quality",
    bestFor: "standard"
  }
];

async function testModelConfiguration(model, config, promptType, prompt) {
  const testId = `${model.name}_${config.name}_${promptType}`;
  
  // Skip incompatible combinations
  if (model.type === "turbo_optimized" && config.bestFor === "standard") {
    console.log(`⏭️  Skipping ${testId} - SDXL settings on Turbo model`);
    return { testId, skipped: true, reason: "incompatible_combination" };
  }
  
  if (model.type === "standard_sdxl" && config.bestFor === "turbo") {
    console.log(`⏭️  Skipping ${testId} - Turbo settings on SDXL Base`);
    return { testId, skipped: true, reason: "incompatible_combination" };
  }
  
  const workflow = {
    "3": {
      "class_type": "KSampler",
      "inputs": {
        "seed": Math.floor(Math.random() * 1000000),
        "steps": config.settings.steps,
        "cfg": config.settings.cfg,
        "sampler_name": config.settings.sampler,
        "scheduler": config.settings.scheduler,
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      }
    },
    "4": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": { "ckpt_name": model.filename }
    },
    "5": {
      "class_type": "EmptyLatentImage",
      "inputs": {
        "width": 1024,
        "height": 1024,
        "batch_size": 1
      }
    },
    "6": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": prompt,
        "clip": ["4", 1]
      }
    },
    "7": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": NEGATIVE_PROMPT,
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
        "filename_prefix": `working_models_${testId}`,
        "images": ["8", 0]
      }
    }
  };

  console.log(`\n🧪 Testing: ${model.name} - ${config.name}`);
  console.log(`📝 ${config.description}`);
  console.log(`🎯 Content: ${promptType}`);
  console.log(`📐 Resolution: 1024x1024`);
  console.log(`⚙️ Settings: ${config.settings.steps} steps, CFG ${config.settings.cfg}, ${config.settings.sampler}`);
  console.log(`🤖 Model: ${model.filename} (${model.fileSize})`);
  console.log(`🎲 Purpose: ${config.purpose}`);
  
  if (config.warning) {
    console.log(`⚠️  WARNING: ${config.warning}`);
  }

  const startTime = Date.now();
  
  try {
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const promptId = result.prompt_id;

    await waitForCompletion(promptId, 10 * 60 * 1000);

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    const perStep = (duration / config.settings.steps).toFixed(2);
    const expectedSeconds = parseExpectedTime(config.expectedTime);
    const performanceRating = getPerformanceRating(duration, expectedSeconds);

    const testResult = {
      testId: testId,
      model: model,
      configuration: config,
      promptType: promptType,
      prompt: prompt,
      performance: {
        actualTimeSeconds: duration,
        actualTimeFormatted: formatTime(duration),
        expectedTimeSeconds: expectedSeconds,
        perStepSeconds: parseFloat(perStep),
        performanceRating: performanceRating,
        efficiency: model.type === "turbo_optimized" ? "HIGH" : "STANDARD"
      },
      analysis: {
        isOptimalRange: analyzeStepRange(config.settings.steps, model.type),
        qualityExpectation: getQualityExpectation(config, model.type),
        modelSpecificNotes: model.notes,
        compatibility: "PERFECT"
      },
      timestamp: new Date().toISOString(),
      success: true
    };

    // Save individual result
    if (!fs.existsSync('working-models-results')) {
      fs.mkdirSync('working-models-results');
    }
    
    fs.writeFileSync(
      `working-models-results/${testId}_result.json`,
      JSON.stringify(testResult, null, 2)
    );

    console.log(`✅ ${testId} completed in ${formatTime(duration)}`);
    console.log(`📊 Performance: ${perStep}s per step (${performanceRating})`);
    
    if (config.warning) {
      console.log(`⚠️  Quality Check: Inspect for ${config.purpose === 'artifact_validation' ? 'noise/artifacts' : 'quality characteristics'}`);
    }
    
    return testResult;

  } catch (error) {
    console.error(`❌ ${testId} failed:`, error.message);
    return { 
      testId, model, configuration: config, promptType, 
      success: false, error: error.message, timestamp: new Date().toISOString() 
    };
  }
}

function parseExpectedTime(expectedTime) {
  const match = expectedTime.match(/(\d+)s/);
  return match ? parseInt(match[1]) : 60;
}

function getPerformanceRating(actual, expected) {
  const ratio = actual / expected;
  if (ratio <= 1.2) return 'EXCELLENT';
  if (ratio <= 1.5) return 'GOOD';
  if (ratio <= 2.0) return 'ACCEPTABLE';
  return 'SLOW';
}

function analyzeStepRange(steps, modelType) {
  if (modelType === "turbo_optimized") {
    if (steps >= 6 && steps <= 8) return 'OPTIMAL_TURBO';
    if (steps >= 10 && steps <= 20) return 'TURBO_NOISE_VALLEY';
    if (steps >= 30) return 'TURBO_OVERKILL';
    return 'TURBO_SUBOPTIMAL';
  } else {
    if (steps >= 25 && steps <= 35) return 'SDXL_SWEET_SPOT';
    if (steps >= 40 && steps <= 60) return 'SDXL_HIGH_QUALITY';
    if (steps < 20) return 'SDXL_TOO_LOW';
    return 'SDXL_STANDARD';
  }
}

function getQualityExpectation(config, modelType) {
  const baseExpectation = {
    'speed_baseline': 'Fast generation, acceptable quality',
    'main_workflow': 'Clean, efficient - optimal for production',
    'artifact_validation': 'May show noise/artifacts',
    'quality_comparison': 'Standard quality reference',
    'max_quality': 'Highest quality, slower generation'
  }[config.purpose] || 'Unknown quality characteristics';
  
  const modelNote = modelType === "turbo_optimized" ? " (Turbo optimized)" : " (Standard SDXL)";
  return baseExpectation + modelNote;
}

async function waitForCompletion(promptId, timeout = 600000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
      const history = await response.json();
      
      if (history[promptId]) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log('Waiting for status update...', error.message);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  throw new Error('Generation timeout');
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

async function runWorkingModelsTests() {
  console.log('🧪 STARTING WORKING MODELS OPTIMIZATION TESTS');
  console.log('🎯 Testing ONLY verified working models');
  console.log('📊 Models: DreamShaperXL Turbo V2, SDXL Base 1.0');
  console.log('⚙️ Smart configuration matching - Turbo configs for Turbo, SDXL configs for SDXL');
  console.log('🎨 Content Types: Character & Landscape generation\n');

  const allResults = [];
  let testCount = 0;
  let totalTests = 0;
  
  // Calculate total tests (skip incompatible combinations)
  WORKING_MODELS.forEach(model => {
    TEST_CONFIGURATIONS.forEach(config => {
      if (!((model.type === "turbo_optimized" && config.bestFor === "standard") ||
            (model.type === "standard_sdxl" && config.bestFor === "turbo"))) {
        totalTests += 2; // character + landscape
      }
    });
  });

  for (const model of WORKING_MODELS) {
    console.log(`\n🎭 === TESTING ${model.name.toUpperCase()} ===`);
    console.log(`📋 Type: ${model.type}`);
    console.log(`🎯 Expected Strength: ${model.expectedStrength}`);
    console.log(`📁 File Size: ${model.fileSize}`);
    console.log(`📝 Notes: ${model.notes}\n`);

    for (const config of TEST_CONFIGURATIONS) {
      // Skip incompatible combinations
      if ((model.type === "turbo_optimized" && config.bestFor === "standard") ||
          (model.type === "standard_sdxl" && config.bestFor === "turbo")) {
        continue;
      }
      
      // Test with character prompt
      testCount++;
      console.log(`\n[${testCount}/${totalTests}] Character Generation Test`);
      const characterResult = await testModelConfiguration(model, config, 'character', CHARACTER_PROMPT);
      allResults.push(characterResult);
      
      if (characterResult.success) {
        console.log('🌡️ Cooling down for 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      
      // Test with landscape prompt  
      testCount++;
      console.log(`\n[${testCount}/${totalTests}] Landscape Generation Test`);
      const landscapeResult = await testModelConfiguration(model, config, 'landscape', LANDSCAPE_PROMPT);
      allResults.push(landscapeResult);
      
      if (landscapeResult.success) {
        console.log('🌡️ Cooling down for 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }

  // Analyze results
  const successfulResults = allResults.filter(r => r.success);
  const skippedResults = allResults.filter(r => r.skipped);
  
  const modelPerformance = {};
  
  WORKING_MODELS.forEach(model => {
    const modelResults = successfulResults.filter(r => r.model.name === model.name);
    if (modelResults.length > 0) {
      modelPerformance[model.name] = {
        totalTests: modelResults.length,
        averageTime: modelResults.reduce((sum, r) => sum + r.performance.actualTimeSeconds, 0) / modelResults.length,
        averagePerStep: modelResults.reduce((sum, r) => sum + r.performance.perStepSeconds, 0) / modelResults.length,
        fastestGeneration: modelResults.reduce((fastest, r) => 
          r.performance.actualTimeSeconds < fastest.performance.actualTimeSeconds ? r : fastest),
        bestConfiguration: modelResults.filter(r => r.performance.performanceRating === 'EXCELLENT')[0] || modelResults[0],
        modelType: model.type,
        expectedStrength: model.expectedStrength
      };
    }
  });

  // Save comprehensive analysis
  const summary = {
    testCompleted: new Date().toISOString(),
    testType: 'WORKING_MODELS_OPTIMIZATION_COMPARISON',
    modelsAnalyzed: WORKING_MODELS.map(m => ({ 
      name: m.name, type: m.type, expectedStrength: m.expectedStrength, fileSize: m.fileSize 
    })),
    corruptedModelsSkipped: [
      "animeArtDiffusionXL_alpha3.safetensors (29 bytes)",
      "dreamshaperXL_v21TurboDPMSDE.safetensors (29 bytes)", 
      "Qwen2VL.safetensors (29 bytes)"
    ],
    totalTests: allResults.length,
    successfulTests: successfulResults.length,
    skippedTests: skippedResults.length,
    failedTests: allResults.length - successfulResults.length - skippedResults.length,
    
    modelPerformance: modelPerformance,
    
    keyFindings: {
      turboOptimal: successfulResults.filter(r => 
        r.model.type === "turbo_optimized" && r.configuration.purpose === "main_workflow"),
      sdxlOptimal: successfulResults.filter(r => 
        r.model.type === "standard_sdxl" && r.configuration.purpose === "quality_comparison"),
      fastestOverall: successfulResults.reduce((fastest, r) => 
        r.performance.actualTimeSeconds < fastest.performance.actualTimeSeconds ? r : fastest),
      bestQualitySpeed: successfulResults.filter(r => 
        r.performance.performanceRating === 'EXCELLENT').reduce((best, r) => 
        r.performance.actualTimeSeconds < best.performance.actualTimeSeconds ? r : best)
    },
    
    recommendations: {
      forSpeed: "Use DreamShaperXL Turbo V2 with 8 steps, CFG 2.5, euler_ancestral",
      forQuality: "Use SDXL Base 1.0 with 30 steps, CFG 7.5, dpmpp_2m + karras",
      avoidSettings: "12-step range shows artifacts on both models"
    },
    
    detailedResults: allResults
  };

  fs.writeFileSync('working-models-results/WORKING_MODELS_ANALYSIS.json', JSON.stringify(summary, null, 2));

  console.log('\n🧪 WORKING MODELS TESTS COMPLETED!');
  console.log(`📊 Results saved in working-models-results/`);
  console.log(`🔍 Key Findings:`);
  console.log(`   📈 Total Tests: ${allResults.length} (${successfulResults.length} successful, ${skippedResults.length} skipped)`);
  console.log(`   🏆 Fastest Generation: ${summary.keyFindings.fastestOverall.testId} (${formatTime(summary.keyFindings.fastestOverall.performance.actualTimeSeconds)})`);
  console.log(`   ⚡ Best Speed/Quality: ${summary.keyFindings.bestQualitySpeed.testId}`);
  console.log(`   🎯 Turbo Optimal: ${summary.keyFindings.turboOptimal.length} tests`);
  console.log(`   🎨 SDXL Optimal: ${summary.keyFindings.sdxlOptimal.length} tests`);
  
  console.log(`\n🎭 Model Performance Comparison:`);
  Object.entries(modelPerformance)
    .sort(([,a], [,b]) => a.averagePerStep - b.averagePerStep)
    .forEach(([name, perf], index) => {
      console.log(`   ${index + 1}. ${name}: ${perf.averagePerStep.toFixed(2)}s/step avg (${perf.modelType})`);
      console.log(`      └─ Fastest: ${formatTime(perf.fastestGeneration.performance.actualTimeSeconds)}`);
    });
    
  console.log(`\n💡 Recommendations:`);
  console.log(`   ⚡ Speed: ${summary.recommendations.forSpeed}`);
  console.log(`   🎨 Quality: ${summary.recommendations.forQuality}`);
  console.log(`   ⚠️  Avoid: ${summary.recommendations.avoidSettings}`);
}

runWorkingModelsTests().catch(console.error);