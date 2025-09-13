// Model-aware workflow optimization for ComfyUI integration
// Based on September 12, 2025 performance testing

export const MODEL_WORKFLOWS = {
  // DreamShaperXL Turbo V2-SFW optimized workflows
  DREAMSHAPER_TURBO_ULTRA_FAST: {
    id: 'dreamshaper_turbo_ultra_fast',
    model: 'DreamShaperXL_Turbo_V2-SFW.safetensors',
    name: 'Turbo Ultra Fast',
    description: 'UI assets, rapid prototyping',
    settings: {
      steps: 6,
      cfg: 2,
      sampler: 'euler',
      scheduler: 'normal'
    },
    performance: {
      estimatedTime: 16,
      vramUsage: '~2GB',
      quality: 'good'
    },
    useCases: ['ui_icons', 'concept_exploration', 'asset_creation', 'rapid_iteration'],
    resolution: {
      recommended: '512x512',
      max: '1024x1024'
    }
  },

  DREAMSHAPER_TURBO_FAST: {
    id: 'dreamshaper_turbo_fast', 
    model: 'DreamShaperXL_Turbo_V2-SFW.safetensors',
    name: 'Turbo Fast',
    description: 'Clean, efficient generation - user validated',
    settings: {
      steps: 8,
      cfg: 2.5,
      sampler: 'euler_ancestral',
      scheduler: 'normal'
    },
    performance: {
      estimatedTime: 18,
      vramUsage: '~3GB', 
      quality: 'clean_efficient'
    },
    useCases: ['anime_characters', 'character_design', 'ui_assets', 'rapid_iteration'],
    resolution: {
      recommended: '1024x1024',
      max: '1024x1024'
    },
    userValidation: 'Clean, no artifacts - optimal Turbo performance'
  },

  SDXL_BASE_BALANCED: {
    id: 'sdxl_base_balanced',
    model: 'sd_xl_base_1.0.safetensors',
    name: 'SDXL Balanced',
    description: 'Pretty good quality - user validated', 
    settings: {
      steps: 30,
      cfg: 7.5,
      sampler: 'dpmpp_2m',
      scheduler: 'karras'
    },
    performance: {
      estimatedTime: 67,
      vramUsage: '~4GB',
      quality: 'pretty_good'
    },
    useCases: ['final_outputs', 'client_work', 'balanced_workflow', 'general_purpose'],
    resolution: {
      recommended: '1024x1024',
      max: '1024x1024'
    },
    userValidation: 'Pretty good quality - validated sweet spot'
  },

  // DEPRECATED - Causes over-processing
  // DREAMSHAPER_TURBO_QUALITY: Removed due to "too verbose" feedback
};

export function selectOptimalWorkflow(options = {}) {
  const {
    style = '',
    priority = 'balanced', // speed | balanced | quality
    persona = '',
    contentType = ''
  } = options;

  // Always prefer user-validated workflows
  
  // Speed priority - use Turbo Fast (validated clean)
  if (priority === 'speed') {
    return MODEL_WORKFLOWS.DREAMSHAPER_TURBO_ULTRA_FAST;
  }

  // Quality priority - use SDXL Base (user validated "pretty good")
  if (priority === 'quality') {
    return MODEL_WORKFLOWS.SDXL_BASE_BALANCED;
  }

  // Anime/Manga content - Turbo Fast (clean, efficient)
  if (style.toLowerCase().includes('anime') || 
      style.toLowerCase().includes('manga') ||
      contentType === 'character') {
    return MODEL_WORKFLOWS.DREAMSHAPER_TURBO_FAST;
  }

  // UI/UX Asset creation - Ultra Fast
  if (persona === 'ui_asset_creator' || 
      contentType === 'ui_asset' ||
      contentType === 'icon') {
    return MODEL_WORKFLOWS.DREAMSHAPER_TURBO_ULTRA_FAST;
  }

  // Realistic/photographic content - SDXL Base validated
  if (style.toLowerCase().includes('realistic') || 
      style.toLowerCase().includes('photo') ||
      style.toLowerCase().includes('portrait')) {
    return MODEL_WORKFLOWS.SDXL_BASE_BALANCED;
  }

  // Balanced default - Turbo Fast (user validated clean)
  return MODEL_WORKFLOWS.DREAMSHAPER_TURBO_FAST;
}

// Validate workflow settings to prevent known issues (USER VALIDATED)
export function validateWorkflowSettings(workflow, customSettings = {}) {
  const warnings = [];
  const errors = [];

  // DreamShaperXL Turbo specific validations
  if (workflow.model === 'DreamShaperXL_Turbo_V2-SFW.safetensors') {
    const steps = customSettings.steps || workflow.settings.steps;
    
    // Check for noise valley (10-20 steps) - USER CONFIRMED
    if (steps >= 10 && steps <= 20) {
      errors.push({
        field: 'steps',
        message: `${steps} steps causes "ton of noise" with Turbo model`,
        suggestion: 'Use 8 steps for clean generation',
        userFeedback: 'Confirmed visual artifacts at 12 steps'
      });
    }

    // Check for verbose valley (50+ steps) - USER CONFIRMED  
    if (steps >= 50) {
      warnings.push({
        field: 'steps',
        message: `${steps} steps causes over-processing - "too verbose"`,
        suggestion: 'Use 8 steps (Turbo) or 30 steps (SDXL Base) for optimal quality',
        userFeedback: 'User reported overly detailed rocks, over-designed'
      });
    }

    // Check CFG range
    const cfg = customSettings.cfg || workflow.settings.cfg;
    if (cfg > 5) {
      warnings.push({
        field: 'cfg',
        message: `CFG ${cfg} may be too high for Turbo model`,
        suggestion: 'Turbo models work best with CFG 2-2.5'
      });
    }
  }

  // SDXL Base specific validations
  if (workflow.model === 'sd_xl_base_1.0.safetensors') {
    const steps = customSettings.steps || workflow.settings.steps;
    
    // User validated range
    if (steps < 25 || steps > 35) {
      warnings.push({
        field: 'steps', 
        message: `${steps} steps outside validated range for SDXL Base`,
        suggestion: '30 steps provides "pretty good" quality - user validated'
      });
    }
  }

  return { warnings, errors, isValid: errors.length === 0 };
}

// Generate ComfyUI workflow JSON
export function generateComfyUIWorkflow(workflow, options = {}) {
  const {
    prompt = '',
    negativePrompt = 'blurry, low quality, deformed',
    width = workflow.resolution.recommended.split('x')[0],
    height = workflow.resolution.recommended.split('x')[1],
    seed = Math.floor(Math.random() * 1000000),
    ...customSettings
  } = options;

  // Merge workflow settings with custom overrides
  const finalSettings = {
    ...workflow.settings,
    ...customSettings
  };

  return {
    "3": {
      "inputs": {
        "seed": seed,
        "steps": finalSettings.steps,
        "cfg": finalSettings.cfg,
        "sampler_name": finalSettings.sampler,
        "scheduler": finalSettings.scheduler,
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0], 
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      },
      "class_type": "KSampler"
    },
    "4": {
      "inputs": {
        "ckpt_name": workflow.model
      },
      "class_type": "CheckpointLoaderSimple"
    },
    "5": {
      "inputs": {
        "width": parseInt(width),
        "height": parseInt(height), 
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage"
    },
    "6": {
      "inputs": {
        "text": prompt,
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode"
    },
    "7": {
      "inputs": {
        "text": negativePrompt,
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode"
    },
    "8": {
      "inputs": {
        "samples": ["3", 0],
        "vae": ["4", 2]
      },
      "class_type": "VAEDecode"
    },
    "9": {
      "inputs": {
        "filename_prefix": `${workflow.id}_generation`,
        "images": ["8", 0]
      },
      "class_type": "SaveImage"
    }
  };
}

// Usage examples for UI components
export const WORKFLOW_EXAMPLES = {
  // For anime character design
  animeCharacter: {
    workflow: MODEL_WORKFLOWS.DREAMSHAPER_TURBO_FAST,
    prompt: 'beautiful anime girl, blue hair, school uniform, detailed face',
    options: { width: 1024, height: 1024 }
  },

  // For UI icon creation
  uiIcon: {
    workflow: MODEL_WORKFLOWS.DREAMSHAPER_TURBO_ULTRA_FAST,
    prompt: 'simple settings icon, flat design, white background, minimalist',
    options: { width: 512, height: 512 }
  },

  // For final portfolio piece
  portfolioPiece: {
    workflow: MODEL_WORKFLOWS.DREAMSHAPER_TURBO_QUALITY,
    prompt: 'epic fantasy character, detailed armor, dramatic lighting, masterpiece',
    options: { width: 1024, height: 1024 }
  }
};

export default {
  MODEL_WORKFLOWS,
  selectOptimalWorkflow,
  validateWorkflowSettings,
  generateComfyUIWorkflow,
  WORKFLOW_EXAMPLES
};