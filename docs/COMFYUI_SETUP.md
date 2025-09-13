# ComfyUI Local Setup Guide

## 🚀 **Ultimate Free AI Art Solution**

Transform your AI Art platform into a **completely free, unlimited sprite generation powerhouse** by running ComfyUI locally!

### **Benefits:**
- ✅ **100% FREE** - No API costs, ever
- ✅ **Unlimited Generation** - Create as many sprites as you want
- ✅ **Complete Control** - Use any Stable Diffusion model
- ✅ **No Internet Required** - Works completely offline
- ✅ **High Quality** - Access to SDXL, FLUX, SD3.5 models
- ✅ **Custom Models** - Add your own trained models

---

## 📋 **System Requirements**

### **Minimum Requirements:**
- **GPU**: NVIDIA GTX 1060 6GB or better (AMD/Intel GPUs also supported)
- **RAM**: 8GB system RAM
- **Storage**: 10GB free space (more for additional models)
- **OS**: Windows 10/11, macOS, or Linux

### **Recommended Requirements:**
- **GPU**: NVIDIA RTX 3060 12GB or better
- **RAM**: 16GB+ system RAM
- **Storage**: 50GB+ SSD space

---

## 🛠️ **Installation Steps**

### **Option 1: Windows Portable (Easiest)**

1. **Download ComfyUI Portable:**
   - Visit: https://github.com/comfyanonymous/ComfyUI/releases
   - Download: `ComfyUI_windows_portable_nvidia.7z`
   - Extract with 7-Zip to `C:\ComfyUI\`

2. **Download Models:**
   - **SDXL Model**: Download `sd_xl_base_1.0.safetensors` (~6.5GB)
   - **SD 1.5 Model**: Download `v1-5-pruned-emaonly.ckpt` (~4GB)
   - Place in: `C:\ComfyUI\models\checkpoints\`

3. **Run ComfyUI:**
   ```cmd
   cd C:\ComfyUI
   run_nvidia_gpu.bat --listen --port 8188
   ```

### **Option 2: Manual Install (Advanced)**

1. **Install Python 3.11+:**
   ```bash
   # Download from python.org or use conda
   python --version  # Should be 3.11+
   ```

2. **Clone ComfyUI:**
   ```bash
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

3. **Install Dependencies:**
   ```bash
   # For NVIDIA GPUs
   pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu121
   pip install -r requirements.txt
   ```

4. **Download Models:**
   - Place models in `models/checkpoints/`
   - SDXL: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
   - SD 1.5: https://huggingface.co/runwayml/stable-diffusion-v1-5

5. **Run ComfyUI:**
   ```bash
   python main.py --listen --port 8188
   ```

---

## 🔧 **Model Downloads**

### **Essential Models (Choose 1-2):**

1. **SDXL Base (Recommended)**
   - **File**: `sd_xl_base_1.0.safetensors`
   - **Size**: 6.5GB
   - **Quality**: Excellent, high-resolution
   - **Download**: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0

2. **Stable Diffusion 1.5**
   - **File**: `v1-5-pruned-emaonly.ckpt`
   - **Size**: 4GB
   - **Quality**: Good, fast generation
   - **Download**: https://huggingface.co/runwayml/stable-diffusion-v1-5

### **Specialized Models (Optional):**

3. **Anything V5 (Anime/Cartoon)**
   - **Perfect for kids' game sprites**
   - **Size**: 4GB
   - **Style**: Anime, cartoon, colorful

4. **DreamShaper (Artistic)**
   - **Great for creative sprites**
   - **Size**: 4GB
   - **Style**: Artistic, creative

---

## 🚀 **Quick Start**

1. **Start ComfyUI Server:**
   ```bash
   python main.py --listen --port 8188
   ```

2. **Verify Installation:**
   - Open browser: http://localhost:8188
   - You should see ComfyUI interface

3. **Test Your AI Art Platform:**
   - Go to your platform: https://cloudaiart.netlify.app
   - Select "ComfyUI Local" service
   - Generate a sprite!

---

## 🎯 **Configuration**

### **Environment Variables (Optional):**
```bash
# Custom ComfyUI server URL
COMFYUI_SERVER_URL=http://localhost

# Custom port
COMFYUI_PORT=8188

# Timeout for generation (milliseconds)
COMFYUI_TIMEOUT=60000
```

### **Performance Optimization:**
```bash
# For low VRAM GPUs (4GB or less)
python main.py --listen --port 8188 --lowvram

# For very low VRAM (2GB)
python main.py --listen --port 8188 --novram

# CPU only (slow but works)
python main.py --listen --port 8188 --cpu
```

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"ComfyUI server not accessible"**
   - ✅ Make sure ComfyUI is running: `python main.py --listen --port 8188`
   - ✅ Check if port 8188 is accessible: http://localhost:8188
   - ✅ Restart ComfyUI with `--listen` flag

2. **"Out of Memory" errors**
   - ✅ Use `--lowvram` or `--novram` flags
   - ✅ Close other applications
   - ✅ Try smaller batch sizes

3. **Models not found**
   - ✅ Ensure models are in `models/checkpoints/` folder
   - ✅ Check file names match exactly
   - ✅ Restart ComfyUI after adding models

4. **Slow generation**
   - ✅ Use GPU instead of CPU
   - ✅ Update graphics drivers
   - ✅ Reduce image resolution

---

## 🎮 **Perfect Setup for Kids' Games**

### **Recommended Configuration:**
- **Model**: SDXL Base + Anything V5
- **Settings**: 512x512 resolution, 20 steps
- **Style**: Cartoon, colorful, kid-friendly

### **Example Prompts:**
- "cute cartoon dragon character for kids game"
- "friendly robot sprite, colorful, simple design"
- "magical fairy character with wings, cartoon style"

---

## 🔗 **Next Steps**

1. **Install ComfyUI** using one of the methods above
2. **Download at least one model** (SDXL recommended)
3. **Start the server** with `--listen --port 8188`
4. **Test generation** on your AI Art platform
5. **Enjoy unlimited free sprite creation!** 🎨

---

## 📚 **Resources**

- **ComfyUI GitHub**: https://github.com/comfyanonymous/ComfyUI
- **Model Downloads**: https://huggingface.co/models
- **ComfyUI Discord**: https://discord.gg/comfyorg
- **Video Tutorials**: https://www.youtube.com/results?search_query=comfyui+tutorial

---

**🎉 Congratulations!** You now have a **completely free, unlimited AI art generation platform** perfect for creating 2D game sprites for kids' games!