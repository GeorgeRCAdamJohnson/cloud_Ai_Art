# Configuration Directory

This directory contains all configuration files for the ComfyUI optimization project.

## Configuration Files

### 🌐 Web Framework Configuration
- `next.config.js` - Next.js build and runtime configuration
- `tailwind.config.js` - Tailwind CSS styling configuration  
- `tsconfig.json` - TypeScript compiler configuration

### 🚀 Deployment Configuration
- `netlify.toml` - Netlify deployment settings
- `vercel.json` - Vercel deployment configuration

### 📊 Data Configuration
- Various JSON configuration files for specific features

## Environment Variables

Environment variables should be set in the root directory:
- `.env.local` - Local development settings
- `.env` - General environment configuration
- `.env.example` - Template for environment setup

## Key Settings

### ComfyUI Configuration
- **COMFYUI_URL**: Default `http://127.0.0.1:8188`
- **COMFYUI_PATH**: Path to ComfyUI installation
- **OPTIMIZATION_MODE**: `development` or `production`

### Model Configuration  
- **MODEL_PATH**: Path to model files
- **DEFAULT_MODEL**: Primary model for generation
- **TURBO_MODE**: Enable turbo optimizations

## Modifying Configuration

1. **Development**: Edit files directly in this directory
2. **Production**: Ensure proper environment variables are set
3. **Deployment**: Update deployment-specific config files

## Backup

Always backup configuration files before making changes - they contain critical project settings.