// Landscape Quality Test - TURBO OPTIMIZED VERSION
// Testing DreamShaperXL Turbo V2-SFW with optimized settings for landscape generation
const fs = require('fs');

const COMFYUI_URL = 'http://127.0.0.1:8188';

// Same landscape scenarios but optimized for Turbo model
const SCIFI_PROMPT = "futuristic sci-fi cityscape, 3/4 isometric angle, towering skyscrapers, neon lights, flying vehicles, cyberpunk atmosphere, dense urban environment, claustrophobic feeling, dramatic lighting, concept art style";

const RURAL_PROMPT = "majestic mountain landscape with ancient forest, regal and grand vista, misty peaks, towering pine trees, golden hour lighting, epic fantasy environment, serene and powerful atmosphere, concept art style";

const NEGATIVE_PROMPT = "blurry, low quality, distorted, bad composition, oversaturated";

// TURBO OPTIMIZED TEST LEVELS - Based on September 12, 2025 performance analysis
const turboLandscapeTests = [
  {
    level: 1,
    name: "TURBO_512_UltraFast",
    description: "Turbo ultra fast landscape preview",
    settings: { 
      width: 512, height: 512, 
      steps: 6, cfg: 2, 
      sampler: "euler", scheduler: "normal" 
    },
    expectedTime: "~16s",
    use: "rapid_preview"
  },
  {
    level: 2,
    name: "TURBO_768_Fast", 
    description: "Turbo fast landscape - balanced speed/quality",
    settings: { 
      width: 768, height: 768, 
      steps: 8, cfg: 2.5, 
      sampler: "euler_ancestral", scheduler: "normal" 
    },
    expectedTime: "~18s",
    use: "main_workflow"
  },
  {
    level: 3,
    name: "TURBO_1024_Fast",
    description: "Turbo fast at full resolution",
    settings: { 
      width: 1024, height: 1024, 
      steps: 8, cfg: 2.5, 
      sampler: "euler_ancestral", scheduler: "normal" 
    },
    expectedTime: "~25s",
    use: "production_ready"
  },
  {
    level: 4,
    name: "TURBO_1024_Quality",
    description: "Turbo quality mode for final outputs",
    settings: { 
      width: 1024, height: 1024, 
      steps: 60, cfg: 8, 
      sampler: "dpmpp_2m", scheduler: "karras" 
    },
    expectedTime: "~120s",
    use: "portfolio_quality"
  },
  {
    level: 5,
    name: "AVOID_NoiseValley_12step",
    description: "Testing problematic 12-step range (should show artifacts)",
    settings: { 
      width: 1024, height: 1024, 
      steps: 12, cfg: 3, 
      sampler: "dpmpp_2m", scheduler: "normal" 
    },
    expectedTime: "~24s",
    use: "artifact_test",
    warning: "EXPECTED TO SHOW VISUAL NOISE - This is the problematic range!"
  },
  {
    level: 6,
    name: "COMPARISON_SDXL_Base",
    description: "SDXL Base comparison (old workflow)",
    settings: { 
      width: 1024, height: 1024, 
      steps: 30, cfg: 7.5, 
      sampler: "dpmpp_2m", scheduler: "karras" 
    },
    expectedTime: "~90s",
    use: "baseline_comparison",
    model: "sd_xl_base_1.0.safetensors"
  }
];

async function generateTurboLandscapeTest(test, prompt, scenario) {
  // Use Turbo model unless specifically testing SDXL Base
  const modelName = test.model || "DreamShaperXL_Turbo_V2-SFW.safetensors";
  
  const workflow = {
    "3": {
      "class_type": "KSampler",
      "inputs": {
        "seed": Math.floor(Math.random() * 1000000),
        "steps": test.settings.steps,
        "cfg": test.settings.cfg,
        "sampler_name": test.settings.sampler,
        "scheduler": test.settings.scheduler,
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      }
    },
    "4": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": { "ckpt_name": modelName }
    },
    "5": {
      "class_type": "EmptyLatentImage",
      "inputs": {
        "width": test.settings.width,
        "height": test.settings.height,
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
        "filename_prefix": `turbo_landscape_${scenario}_${test.name}`,
        "images": ["8", 0]
      }
    }
  };

  console.log(`🏞️ Testing TURBO Landscape Quality - ${scenario.toUpperCase()}`);
  console.log(`📝 ${test.name}: ${test.description}`);
  console.log(`📐 Resolution: ${test.settings.width}x${test.settings.height}`);
  console.log(`⚙️ Settings: ${test.settings.steps} steps, CFG ${test.settings.cfg}, ${test.settings.sampler}`);
  console.log(`🎯 Expected: ${test.expectedTime} (${test.use})`);
  console.log(`🤖 Model: ${modelName}`);
  
  if (test.warning) {
    console.log(`⚠️  WARNING: ${test.warning}`);
  }

  const startTime = Date.now();
  
  try {
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });

    const result = await response.json();
    const promptId = result.prompt_id;

    await waitForCompletion(promptId, 10 * 60 * 1000); // 10 min timeout (faster than before)

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    const perStep = (duration / test.settings.steps).toFixed(2);

    const testResult = {
      ...test,
      scenario: scenario,
      prompt: prompt,
      model: modelName,
      performance: {
        actualTimeSeconds: duration,
        actualTimeFormatted: formatTime(duration),
        expectedTimeSeconds: parseExpectedTime(test.expectedTime),
        perStepSeconds: parseFloat(perStep),
        performanceRating: getPerformanceRating(duration, parseExpectedTime(test.expectedTime)),
        vramUsage: estimateVRAM(test.settings)
      },
      analysis: {
        isOptimalRange: isOptimalStepRange(test.settings.steps),
        warningLevel: getWarningLevel(test),
        qualityExpectation: getQualityExpectation(test)
      },
      timestamp: new Date().toISOString(),
      success: true
    };

    // Create results directory if it doesn't exist
    if (!fs.existsSync('landscape-results/turbo')) {
      fs.mkdirSync('landscape-results/turbo', { recursive: true });
    }

    fs.writeFileSync(
      `landscape-results/turbo/${scenario}_${test.name}_results.json`,
      JSON.stringify(testResult, null, 2)
    );

    console.log(`✅ ${scenario} ${test.name} completed in ${formatTime(duration)}`);
    console.log(`📊 Performance: ${perStep}s per step (${testResult.performance.performanceRating})`);
    
    if (testResult.analysis.warningLevel !== 'none') {
      console.log(`⚠️  Quality Note: ${testResult.analysis.qualityExpectation}`);
    }
    
    return testResult;

  } catch (error) {
    console.error(`❌ ${scenario} ${test.name} failed:`, error.message);
    return { ...test, scenario, success: false, error: error.message };
  }
}

function parseExpectedTime(expectedTime) {
  // Parse "~18s" or "~120s" format
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

function isOptimalStepRange(steps) {
  // Based on our findings: 6-8 steps optimal, 10-20 problematic, 50+ acceptable
  if (steps >= 6 && steps <= 8) return 'OPTIMAL';
  if (steps >= 10 && steps <= 20) return 'PROBLEMATIC';
  if (steps >= 50) return 'QUALITY_MODE';
  return 'UNKNOWN';
}

function getWarningLevel(test) {
  if (test.warning) return 'EXPECTED_ARTIFACTS';
  if (test.settings.steps >= 10 && test.settings.steps <= 20) return 'NOISE_VALLEY';
  return 'none';
}

function getQualityExpectation(test) {
  const range = isOptimalStepRange(test.settings.steps);
  switch (range) {
    case 'OPTIMAL': return 'Clean, fast generation - no artifacts expected';
    case 'PROBLEMATIC': return 'May show visual noise/artifacts in this step range';
    case 'QUALITY_MODE': return 'High quality but slower - should be clean';
    default: return 'Unknown quality characteristics';
  }
}

function estimateVRAM(settings) {
  const pixels = settings.width * settings.height;
  const baseVRAM = (pixels / 1000000) * 1.5; // Turbo model is more efficient
  const stepMultiplier = Math.min(settings.steps / 50, 1.5);
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
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Check more frequently
    } catch (error) {
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

async function runTurboLandscapeTests() {
  console.log('🚀 STARTING TURBO-OPTIMIZED LANDSCAPE TESTS');
  console.log('🎯 Testing DreamShaperXL Turbo V2-SFW with optimized settings');
  console.log('📊 Comparing: Ultra Fast → Fast → Quality → Problematic Range → SDXL Base');
  console.log('⚠️  Will test the 12-step "noise valley" to confirm artifacts\n');

  if (!fs.existsSync('landscape-results/turbo')) {
    fs.mkdirSync('landscape-results/turbo', { recursive: true });
  }

  const allResults = [];

  // Test Sci-Fi Cityscape scenario with Turbo optimization
  console.log('🌆 === STARTING TURBO SCI-FI CITYSCAPE TESTS ===\n');
  for (const test of turboLandscapeTests) {
    const result = await generateTurboLandscapeTest(test, SCIFI_PROMPT, 'scifi');
    allResults.push(result);
    
    console.log('🌡️ Cooling down GPU for 20 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 20000)); // Shorter cooldown for faster Turbo
  }

  console.log('🏔️ === STARTING TURBO RURAL MOUNTAIN/FOREST TESTS ===\n');
  // Test Rural Mountain/Forest scenario with Turbo optimization
  for (const test of turboLandscapeTests) {
    const result = await generateTurboLandscapeTest(test, RURAL_PROMPT, 'rural');
    allResults.push(result);
    
    console.log('🌡️ Cooling down GPU for 20 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 20000));
  }

  // Analyze results
  const successfulResults = allResults.filter(r => r.success);
  const performanceAnalysis = {
    fastestGeneration: successfulResults.reduce((min, r) => 
      r.performance.actualTimeSeconds < min.performance.actualTimeSeconds ? r : min),
    slowestGeneration: successfulResults.reduce((max, r) => 
      r.performance.actualTimeSeconds > max.performance.actualTimeSeconds ? r : max),
    averagePerStep: successfulResults.reduce((sum, r) => 
      sum + r.performance.perStepSeconds, 0) / successfulResults.length,
    optimalPerformance: successfulResults.filter(r => 
      r.analysis.isOptimalRange === 'OPTIMAL').map(r => r.performance.actualTimeSeconds),
    problematicResults: successfulResults.filter(r => 
      r.analysis.warningLevel !== 'none')
  };

  // Save comprehensive summary
  const summary = {
    testCompleted: new Date().toISOString(),
    testType: 'TURBO_LANDSCAPE_OPTIMIZATION',
    modelTested: 'DreamShaperXL_Turbo_V2-SFW.safetensors',
    scenarios: {
      scifi: {
        description: "Futuristic sci-fi cityscape with Turbo optimization",
        prompt: SCIFI_PROMPT
      },
      rural: {
        description: "Majestic mountain/forest landscape with Turbo optimization",
        prompt: RURAL_PROMPT
      }
    },
    levelsCompleted: successfulResults.length,
    totalLevels: turboLandscapeTests.length * 2,
    performanceAnalysis: performanceAnalysis,
    keyFindings: {
      turboOptimization: "DreamShaperXL Turbo V2-SFW performance with landscapes",
      stepRangeValidation: "Testing 6-8 step optimal range vs 12-step noise valley",
      speedComparison: "Turbo vs SDXL Base performance comparison",
      qualityAnalysis: "Visual quality assessment across different step counts"
    },
    results: allResults
  };

  fs.writeFileSync('landscape-results/turbo/TURBO_LANDSCAPE_SUMMARY.json', JSON.stringify(summary, null, 2));

  console.log('🚀 TURBO LANDSCAPE TESTS COMPLETED!');
  console.log(`📊 Results saved in landscape-results/turbo/`);
  console.log(`🔍 Key Findings:`);
  console.log(`   ⚡ Fastest: ${performanceAnalysis.fastestGeneration.name} (${formatTime(performanceAnalysis.fastestGeneration.performance.actualTimeSeconds)})`);
  console.log(`   🐌 Slowest: ${performanceAnalysis.slowestGeneration.name} (${formatTime(performanceAnalysis.slowestGeneration.performance.actualTimeSeconds)})`);
  console.log(`   📈 Average: ${performanceAnalysis.averagePerStep.toFixed(2)}s per step`);
  console.log(`   ⚠️  Problematic results: ${performanceAnalysis.problematicResults.length}/${successfulResults.length}`);
  console.log(`🎯 Compare landscape vs character performance with Turbo optimization!`);
}

runTurboLandscapeTests().catch(console.error);