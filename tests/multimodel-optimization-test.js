// Multi-Model Optimization Test - Testing all available models
// Testing: Qwen2VL, animeArtDiffusionXL, dreamshaperXL_v21TurboDPMSDE
const fs = require('fs');

const COMFYUI_URL = 'http://127.0.0.1:8188';

// Test prompt optimized for character generation (our main use case)
const CHARACTER_PROMPT = "beautiful anime character, detailed face, expressive eyes, colorful hair, modern clothing, high quality digital art";
const LANDSCAPE_PROMPT = "serene mountain landscape, golden hour lighting, misty peaks, concept art style";
const NEGATIVE_PROMPT = "blurry, low quality, distorted, bad anatomy, deformed";

// Models to test with their expected characteristics (corrected filenames)
const MODELS_TO_TEST = [
  {
    filename: "Qwen2VL.safetensors",
    name: "Qwen2VL", 
    type: "multimodal",
    expectedStrength: "text_understanding",
    notes: "Multimodal model - may have different optimal settings"
  },
  {
    filename: "animeArtDiffusionXL_alpha3.safetensors", 
    name: "AnimeArtDiffusionXL",
    type: "anime_specialist",
    expectedStrength: "anime_characters",
    notes: "Anime specialist - should excel at character generation"
  },
  {
    filename: "dreamshaperXL_v21TurboDPMSDE.safetensors",
    name: "DreamshaperXL_v21_Turbo", 
    type: "turbo_variant",
    expectedStrength: "speed_optimization",
    notes: "Different Dreamshaper Turbo variant - may have different sweet spots"
  }
];

// Test configurations based on our validated findings
const TEST_CONFIGURATIONS = [
  {
    name: "ULTRA_FAST",
    description: "Ultra fast generation test",
    settings: { steps: 6, cfg: 2, sampler: "euler", scheduler: "normal" },
    expectedTime: "~16s",
    purpose: "speed_baseline"
  },
  {
    name: "OPTIMAL_FAST", 
    description: "Validated optimal fast settings",
    settings: { steps: 8, cfg: 2.5, sampler: "euler_ancestral", scheduler: "normal" },
    expectedTime: "~18s", 
    purpose: "main_workflow"
  },
  {
    name: "AVOID_NOISE_VALLEY",
    description: "Testing problematic 12-step range",
    settings: { steps: 12, cfg: 3, sampler: "dpmpp_2m", scheduler: "normal" },
    expectedTime: "~24s",
    purpose: "artifact_validation",
    warning: "Expected to show noise/artifacts"
  },
  {
    name: "STANDARD_QUALITY",
    description: "Standard quality comparable to SDXL Base 30-step",
    settings: { steps: 30, cfg: 7.5, sampler: "dpmpp_2m", scheduler: "karras" },
    expectedTime: "~67s",
    purpose: "quality_comparison"
  },
  {
    name: "AVOID_VERBOSE_VALLEY", 
    description: "Testing if 60 steps causes over-processing",
    settings: { steps: 60, cfg: 8, sampler: "dpmpp_2m", scheduler: "karras" },
    expectedTime: "~120s",
    purpose: "verbose_validation", 
    warning: "May be overly detailed/verbose"
  }
];

async function testModelConfiguration(model, config, promptType, prompt) {
  const testId = `${model.name}_${config.name}_${promptType}`;
  
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
        "filename_prefix": `multimodel_${testId}`,
        "images": ["8", 0]
      }
    }
  };

  console.log(`\n🧪 Testing: ${model.name} - ${config.name}`);
  console.log(`📝 ${config.description}`);
  console.log(`🎯 Content: ${promptType}`);
  console.log(`📐 Resolution: 1024x1024`);
  console.log(`⚙️ Settings: ${config.settings.steps} steps, CFG ${config.settings.cfg}, ${config.settings.sampler}`);
  console.log(`🤖 Model: ${model.filename}`);
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
        vramUsage: estimateVRAM(config.settings)
      },
      analysis: {
        isOptimalRange: analyzeStepRange(config.settings.steps),
        qualityExpectation: getQualityExpectation(config),
        modelSpecificNotes: model.notes
      },
      timestamp: new Date().toISOString(),
      success: true
    };

    // Save individual result
    if (!fs.existsSync('multimodel-results')) {
      fs.mkdirSync('multimodel-results');
    }
    
    fs.writeFileSync(
      `multimodel-results/${testId}_result.json`,
      JSON.stringify(testResult, null, 2)
    );

    console.log(`✅ ${testId} completed in ${formatTime(duration)}`);
    console.log(`📊 Performance: ${perStep}s per step (${performanceRating})`);
    
    if (config.warning) {
      console.log(`⚠️  Quality Check: Inspect for ${config.purpose === 'artifact_validation' ? 'noise/artifacts' : 'over-processing'}`);
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

function analyzeStepRange(steps) {
  if (steps >= 6 && steps <= 8) return 'OPTIMAL_TURBO';
  if (steps >= 10 && steps <= 20) return 'NOISE_VALLEY';
  if (steps >= 25 && steps <= 35) return 'SDXL_SWEET_SPOT';
  if (steps >= 50) return 'VERBOSE_RISK';
  return 'UNKNOWN';
}

function getQualityExpectation(config) {
  switch (config.purpose) {
    case 'speed_baseline': return 'Fast generation, acceptable quality';
    case 'main_workflow': return 'Clean, efficient - optimal for production';
    case 'artifact_validation': return 'Expected to show noise/artifacts';
    case 'quality_comparison': return 'Should match SDXL Base quality';
    case 'verbose_validation': return 'May be overly detailed/verbose';
    default: return 'Unknown quality characteristics';
  }
}

function estimateVRAM(settings) {
  const baseVRAM = 2.5; // 1024x1024 base
  const stepMultiplier = Math.min(settings.steps / 30, 2);
  return `~${Math.round(baseVRAM * stepMultiplier * 10) / 10}GB`;
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

async function runMultiModelTests() {
  console.log('🧪 STARTING MULTI-MODEL OPTIMIZATION TESTS');
  console.log('🎯 Testing 3 additional models with validated settings');
  console.log('📊 Models: Qwen2VL, AnimeArtDiffusionXL, DreamshaperXL v21 Turbo');
  console.log('⚙️ Configurations: Ultra Fast → Optimal → Noise Valley → Standard → Verbose Valley');
  console.log('🎨 Content Types: Character & Landscape generation\n');

  const allResults = [];
  let testCount = 0;
  const totalTests = MODELS_TO_TEST.length * TEST_CONFIGURATIONS.length * 2; // 2 prompt types

  for (const model of MODELS_TO_TEST) {
    console.log(`\n🎭 === TESTING ${model.name.toUpperCase()} ===`);
    console.log(`📋 Type: ${model.type}`);
    console.log(`🎯 Expected Strength: ${model.expectedStrength}`);
    console.log(`📝 Notes: ${model.notes}\n`);

    for (const config of TEST_CONFIGURATIONS) {
      // Test with character prompt
      testCount++;
      console.log(`\n[${testCount}/${totalTests}] Character Generation Test`);
      const characterResult = await testModelConfiguration(model, config, 'character', CHARACTER_PROMPT);
      allResults.push(characterResult);
      
      console.log('🌡️ Cooling down for 15 seconds...');
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      // Test with landscape prompt  
      testCount++;
      console.log(`\n[${testCount}/${totalTests}] Landscape Generation Test`);
      const landscapeResult = await testModelConfiguration(model, config, 'landscape', LANDSCAPE_PROMPT);
      allResults.push(landscapeResult);
      
      console.log('🌡️ Cooling down for 15 seconds...');
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }

  // Analyze results across models
  const successfulResults = allResults.filter(r => r.success);
  const modelPerformance = {};
  
  MODELS_TO_TEST.forEach(model => {
    const modelResults = successfulResults.filter(r => r.model.name === model.name);
    if (modelResults.length > 0) {
      modelPerformance[model.name] = {
        totalTests: modelResults.length,
        averageTime: modelResults.reduce((sum, r) => sum + r.performance.actualTimeSeconds, 0) / modelResults.length,
        averagePerStep: modelResults.reduce((sum, r) => sum + r.performance.perStepSeconds, 0) / modelResults.length,
        bestConfiguration: modelResults.reduce((best, r) => 
          r.performance.performanceRating === 'EXCELLENT' && r.performance.actualTimeSeconds < best.performance.actualTimeSeconds ? r : best),
        modelType: model.type,
        expectedStrength: model.expectedStrength
      };
    }
  });

  // Save comprehensive analysis
  const summary = {
    testCompleted: new Date().toISOString(),
    testType: 'MULTI_MODEL_OPTIMIZATION_COMPARISON',
    modelsAnalyzed: MODELS_TO_TEST.map(m => ({ name: m.name, type: m.type, expectedStrength: m.expectedStrength })),
    totalTests: allResults.length,
    successfulTests: successfulResults.length,
    failedTests: allResults.length - successfulResults.length,
    
    modelPerformance: modelPerformance,
    
    configurationAnalysis: {
      fastestOverall: successfulResults.reduce((fastest, r) => 
        r.performance.actualTimeSeconds < fastest.performance.actualTimeSeconds ? r : fastest),
      bestQualitySpeed: successfulResults.filter(r => 
        r.configuration.purpose === 'main_workflow').reduce((best, r) => 
        r.performance.performanceRating === 'EXCELLENT' ? r : best),
      noiseValleyConfirmation: successfulResults.filter(r => 
        r.configuration.purpose === 'artifact_validation'),
      verboseValleyConfirmation: successfulResults.filter(r => 
        r.configuration.purpose === 'verbose_validation')
    },
    
    recommendations: {
      bestOverallModel: Object.keys(modelPerformance).reduce((best, modelName) => 
        modelPerformance[modelName].averagePerStep < modelPerformance[best]?.averagePerStep ? modelName : best, Object.keys(modelPerformance)[0]),
      recommendedConfigurations: successfulResults.filter(r => 
        r.performance.performanceRating === 'EXCELLENT' && r.configuration.purpose === 'main_workflow')
    },
    
    detailedResults: allResults
  };

  fs.writeFileSync('multimodel-results/MULTI_MODEL_ANALYSIS.json', JSON.stringify(summary, null, 2));

  console.log('\n🧪 MULTI-MODEL TESTS COMPLETED!');
  console.log(`📊 Results saved in multimodel-results/`);
  console.log(`🔍 Key Findings:`);
  console.log(`   📈 Total Tests: ${allResults.length} (${successfulResults.length} successful)`);
  console.log(`   🏆 Best Overall Model: ${summary.recommendations.bestOverallModel}`);
  console.log(`   ⚡ Fastest Generation: ${summary.configurationAnalysis.fastestOverall.testId} (${formatTime(summary.configurationAnalysis.fastestOverall.performance.actualTimeSeconds)})`);
  console.log(`   🎯 Recommended Configs: ${summary.recommendations.recommendedConfigurations.length} excellent workflows found`);
  console.log(`   ⚠️  Noise Valley Tests: ${summary.configurationAnalysis.noiseValleyConfirmation.length} validation tests`);
  console.log(`   📝 Verbose Valley Tests: ${summary.configurationAnalysis.verboseValleyConfirmation.length} validation tests`);
  
  console.log(`\n🎭 Model Performance Ranking:`);
  Object.entries(modelPerformance)
    .sort(([,a], [,b]) => a.averagePerStep - b.averagePerStep)
    .forEach(([name, perf], index) => {
      console.log(`   ${index + 1}. ${name}: ${perf.averagePerStep.toFixed(2)}s/step (${perf.modelType})`);
    });
}

runMultiModelTests().catch(console.error);