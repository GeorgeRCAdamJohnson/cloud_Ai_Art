# ComfyUI Models Setup Guide

## 🚀 Quick Setup for High-Quality Sprite Generation

Your ComfyUI is running, but you need to download the AI models for the best quality. Here's how to get the premium models working:

## 📁 Model Directory Structure

Your ComfyUI models should be in: `C:\Users\biges\ComfyUI\models\`

```
ComfyUI/
├── models/
│   ├── checkpoints/          # Main AI models
│   ├── vae/                  # VAE models for better quality
│   ├── clip/                 # CLIP models for FLUX
│   └── unet/                 # UNET models for FLUX
```

## 🏆 RECOMMENDED MODELS (Download These First)

### 1. SDXL Turbo (Fast + High Quality) ⚡
**Best for: Fast, high-quality sprites**
- **File**: `sd_xl_turbo_1.0_fp16.safetensors` (6.9 GB)
- **Download**: [Hugging Face](https://huggingface.co/stabilityai/sdxl-turbo/blob/main/sd_xl_turbo_1.0_fp16.safetensors)
- **Location**: `ComfyUI/models/checkpoints/`
- **Speed**: ~10 seconds per image
- **Quality**: Excellent

### 2. Anime Sprite Model (Character Focused) 🎌
**Best for: Anime-style game characters**
- **File**: `animagineXLV3_v30.safetensors` (6.6 GB)
- **Download**: [Civitai](https://civitai.com/models/260267/animagine-xl-v30)
- **Location**: `ComfyUI/models/checkpoints/`
- **Speed**: ~30 seconds per image
- **Quality**: Perfect for anime sprites

### 3. Pixel Art Model (Retro Style) 🕹️
**Best for: Classic pixel art sprites**
- **File**: `pixelArtDiffusionXL_v10.safetensors` (6.6 GB)
- **Download**: [Civitai](https://civitai.com/models/120096/pixel-art-xl)
- **Location**: `ComfyUI/models/checkpoints/`
- **Speed**: ~15 seconds per image
- **Quality**: Perfect pixel art

## 🌟 ULTIMATE QUALITY: FLUX.1 Dev (Optional)

**⚠️ Large Download (24+ GB total) - Only if you want the absolute best quality**

### FLUX Models (Ultra Quality)
1. **FLUX.1 Dev UNET** (11.9 GB)
   - Download: [Hugging Face](https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/flux1-dev.safetensors)
   - Location: `ComfyUI/models/unet/`

2. **FLUX VAE** (335 MB)
   - Download: [Hugging Face](https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/ae.safetensors)
   - Location: `ComfyUI/models/vae/`

3. **FLUX CLIP Models**
   - **T5XXL** (9.8 GB): [Download](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp16.safetensors)
   - **CLIP-L** (246 MB): [Download](https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors)
   - Location: `ComfyUI/models/clip/`

## 🛠️ Easy Download Commands

### Option 1: Direct Download (Recommended)
```bash
# Navigate to ComfyUI directory
cd C:\Users\biges\ComfyUI

# Create directories if they don't exist
mkdir models\checkpoints
mkdir models\vae
mkdir models\clip
mkdir models\unet

# Download SDXL Turbo (Fast & Quality)
curl -L "https://huggingface.co/stabilityai/sdxl-turbo/resolve/main/sd_xl_turbo_1.0_fp16.safetensors" -o "models\checkpoints\sd_xl_turbo_1.0_fp16.safetensors"
```

### Option 2: Using ComfyUI Manager
1. Open ComfyUI in browser: http://localhost:8188
2. Click "Manager" button
3. Go to "Model Manager"
4. Search and install:
   - "SDXL Turbo"
   - "Animagine XL V3"
   - "Pixel Art XL"

## 📊 Model Comparison

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| **SDXL Turbo** | 6.9 GB | ⚡ Fast (10s) | 🌟🌟🌟🌟 | General sprites |
| **Anime Sprite** | 6.6 GB | 🔄 Medium (30s) | 🌟🌟🌟🌟🌟 | Anime characters |
| **Pixel Art** | 6.6 GB | ⚡ Fast (15s) | 🌟🌟🌟🌟 | Retro games |
| **FLUX.1 Dev** | 24+ GB | 🐌 Slow (60s) | 🌟🌟🌟🌟🌟 | Ultimate quality |

## 🎯 Quick Start (Minimum Setup)

**Just want to get started quickly?** Download only:

1. **SDXL Turbo** (6.9 GB) - Fast and high quality
2. **Anime Sprite** (6.6 GB) - Perfect for game characters

Total: ~13.5 GB for excellent sprite generation!

## ✅ Verify Installation

After downloading models, restart ComfyUI:

```bash
cd C:\Users\biges\ComfyUI
python main.py --listen --port 8188
```

Then test in your app:
1. Select "ComfyUI Local" service
2. Choose "SDXL Turbo" model
3. Generate a test sprite!

## 🔧 Troubleshooting

### Model Not Found Error
- Check file is in correct folder
- Verify filename matches exactly
- Restart ComfyUI after adding models

### Out of Memory Error
- Close other applications
- Use smaller models first (Pixel Art, SDXL Turbo)
- Avoid FLUX if you have < 8GB VRAM

### Slow Generation
- Use SDXL Turbo for speed
- Avoid FLUX for fast results
- Check GPU usage in Task Manager

## 🎮 Ready to Create Amazing Sprites!

Once you have the models installed, you'll get:
- ⚡ **SDXL Turbo**: Professional quality in 10 seconds
- 🎌 **Anime Sprites**: Perfect anime characters in 30 seconds  
- 🕹️ **Pixel Art**: Retro sprites in 15 seconds
- 🏆 **FLUX**: Ultimate quality in 60 seconds

Your sprite generation will go from basic to **professional game-ready assets**!