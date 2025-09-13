# Cloud AI Art - 2D Game Sprite Generator

A lightweight AI-powered platform for generating 2D game sprites specifically designed for kids' games. This application provides an easy-to-use web interface that integrates with **FREE and paid** cloud AI services without the complexity of local model setup.

## 🆓 **FREE AI Opti## 📖 API Documentation

### Generate Sprite Endpoint
```
POST /api/generate-sprite
{
  "prompt": "cute dragon character",
  "service": "aws" | "azure" | "google" | "huggingface" | "replicate" | "comfyui-local",
  "model": "sdxl-base" | "anime-sprite" | "cartoon-3d",
  "comfyUIOptions": {
    "width": 768,
    "height": 768,
    "quality": "optimized" | "high" | "ultra"
  }
}
```

### ComfyUI Local Options
```json
{
  "service": "comfyui-local",
  "model": "sdxl-base",
  "comfyUIOptions": {
    "width": 1024,
    "height": 1024,
    "quality": "ultra"
  }
}
```

### Response Format
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,<base64_data>",
  "metadata": {
    "service": "comfyui-local",
    "model": "sdxl-base",
    "prompt": "cute dragon character",
    "resolution": "1024x1024",
    "quality": "ultra",
    "vramUsage": "5.8GB",
    "generationTime": "12.5min",
    "timestamp": "2025-09-08T00:00:00.000Z"
  }
}
```

### **Hugging Face** (Completely FREE)
- ✅ **1000 images per month** at no cost
- ✅ **No credit card required**
- ✅ **Stable Diffusion models**
- ✅ **Perfect for kids' sprites**

### **Replicate** (FREE $5 Credit Monthly)  
- ✅ **$5 free credit** every month
- ✅ **SDXL model** (excellent quality)
- ✅ **~100-500 sprites** per month free

## 🚀 Features

- **🎨 ComfyUI Local Integration**: RTX 3050 6GB optimized with professional SDXL model and hardware-aware throttling
- **⚡ Ultimate Performance**: 25-45s optimized generation, 2-5min high quality, up to 20min ultra quality
- **🧠 Smart Memory Management**: Automatic VRAM usage calculation and safe parameter selection
- **📐 Flexible Resolution Control**: 8 preset sizes plus custom resolution with memory impact warnings
- **🎯 Quality System**: 3-tier system (Optimized/High/Ultra) with RTX 3050-specific parameter tuning
- **💾 Hardware Optimized**: Perfect for RTX 3050 6GB - prevents VRAM overflow with intelligent throttling
- **☁️ Multi-Cloud AI Integration**: Support for FREE (Hugging Face, Replicate) and paid services (AWS, Azure, Google)
- **👶 Kid-Friendly Design**: Colorful, intuitive interface perfect for creating children's game assets
- **🎮 2D Sprite Focused**: Optimized prompts and settings for game sprite generation
- **⚡ Real-time Generation**: Fast sprite creation with live preview and VRAM monitoring
- **💾 Download & Gallery**: Save and organize your generated sprites with metadata
- **🆓 FREE OPTIONS**: Start generating immediately with free services or unlimited local generation

## 🎯 Target Use Cases

- **Indie Game Developers**: Quickly prototype character sprites for kids' games
- **Educational Games**: Create engaging visual assets for learning applications
- **Parents & Educators**: Generate custom characters for storytelling and activities
- **Small Studios**: Cost-effective sprite generation without hiring artists

## ☁️ **AI Service Options**

### 🚀 **ULTIMATE: ComfyUI Local (RTX 3050 Optimized)**

### 🚀 **ULTIMATE: ComfyUI Local (RTX 3050 Optimized)**

#### **ComfyUI Local** (UNLIMITED FREE)
- **Cost**: FREE - Unlimited generation with no API costs
- **Model**: SDXL Base 1.0 (Professional quality, versatile)
- **Speed**: 25-45s (Optimized) | 2-5min (High) | up to 20min (Ultra)
- **Quality**: Professional game-ready assets with studio-grade detail
- **Hardware**: RTX 3050 6GB optimized with intelligent memory management
- **Features**: 
  - 🧠 **Smart VRAM Management**: Automatic parameter adjustment based on resolution
  - 📐 **8 Resolution Presets**: From 512×512 to 1280×720 plus custom sizes
  - ⚡ **3-Tier Quality System**: Optimized/High/Ultra with hardware-aware settings
  - 🎯 **Memory-Safe Generation**: Prevents VRAM overflow with usage estimation
  - ⏱️ **Extended Timeout**: Up to 20 minutes for ultra-high quality generation
  - 🔄 **Real-time Monitoring**: Live VRAM usage and generation progress
- **Setup**: Download SDXL model, run ComfyUI locally, configure workspace

### 🆓 **FREE Services (Cloud-based)**

#### **Hugging Face** (Completely FREE)
- **Cost**: FREE - 1000 images per month
- **Models**: Stable Diffusion 2.1
- **Quality**: Good for sprites
- **Setup**: Just sign up at huggingface.co

#### **Replicate** (FREE Credit)
- **Cost**: FREE $5 credit monthly (~100-500 images)
- **Models**: SDXL (Stable Diffusion XL)
- **Quality**: Excellent
- **Setup**: Sign up at replicate.com

### 💰 **Premium Services**

#### **AWS Bedrock**
- **Model**: Stable Diffusion XL
- **Cost**: ~$0.04 per image
- **Best For**: Production applications with consistent quality
- **Setup**: AWS account + IAM permissions

#### **Azure OpenAI (DALL-E 3)**
- **Model**: DALL-E 3
- **Cost**: ~$0.04 per image
- **Best For**: High-quality artistic sprites
- **Setup**: Azure subscription + OpenAI resource

#### **Google Cloud Vertex AI**
- **Model**: Imagen 2
- **Cost**: ~$0.02-0.05 per image
- **Best For**: Advanced AI features
- **Setup**: Google Cloud project + Vertex AI API

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- **For ComfyUI Local**: RTX 3050/3060/4060 or better (6GB+ VRAM required)
- **For ComfyUI Setup**: Python 3.8+ and Git
- **For Cloud Services**: Cloud service account (AWS/Azure/Google)
- Basic knowledge of environment variables

### 1. Clone & Install
```bash
git clone <your-repo>
cd cloud-ai-art
npm install
```

### 2. ComfyUI Local Setup (Recommended for Unlimited FREE Generation)

#### Download ComfyUI:
```bash
# Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt
```

#### Download SDXL Model:
```bash
# Download the SDXL Base model (6.9GB)
cd models/checkpoints
# Download from: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
# Place as: sd_xl_base_1.0.safetensors
```

#### Start ComfyUI Server:
```bash
cd ComfyUI
python main.py --listen --port 8188
```

#### RTX 3050 Optimization Features:
- **Automatic VRAM Management**: Prevents out-of-memory errors
- **Dynamic Parameter Scaling**: Adjusts steps/CFG based on resolution
- **Memory Usage Estimation**: Real-time VRAM usage calculation
- **Safe Settings Calculation**: Hardware-aware parameter selection
- **Extended Timeout Support**: Up to 20 minutes for ultra quality

### 3. Environment Setup
Copy `.env.example` to `.env.local` and configure your cloud credentials:

#### For AWS Bedrock:
1. Create IAM user with Bedrock permissions
2. Get Access Key ID and Secret Access Key
3. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

#### For Azure OpenAI:
1. Create Azure OpenAI resource
2. Deploy DALL-E 3 model
3. Get endpoint URL and API key
4. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY

#### For Google Cloud:
1. Create Google Cloud project
2. Enable Vertex AI API
3. Create service account and download JSON key
4. Set GOOGLE_CLOUD_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 How to Use

1. **Choose Your AI Service**: Select AWS, Azure, or Google Cloud
2. **Describe Your Sprite**: Enter a description like "cute dragon character"
3. **Generate**: Click the generate button and wait for your sprite
4. **Download**: Save your sprite as PNG with transparent background
5. **Gallery**: View all your generated sprites in the gallery

## 🎨 Sprite Generation Tips

### Effective Prompts:
- "cute cartoon cat character jumping"
- "friendly robot character for kids game"
- "magical fairy with sparkly wings"
- "brave knight character in colorful armor"

### Style Keywords:
- "2D game sprite"
- "pixel art style"
- "cartoon style"
- "kids friendly"
- "colorful"
- "simple design"

## 💰 Cost Optimization

### Tips to Minimize Costs:
1. **Start with AWS Bedrock**: Generally most cost-effective
2. **Batch Generation**: Generate multiple sprites in sessions
3. **Prompt Refinement**: Use detailed prompts to get desired results faster
4. **Service Rotation**: Test different services to find best value

### Expected Monthly Costs:
- **Light Usage** (50 sprites): $2-5
- **Medium Usage** (200 sprites): $8-20
- **Heavy Usage** (500+ sprites): $20-50

## 🔧 Customization

### Adding New AI Services:
1. Create new service file in `src/lib/`
2. Implement `GenerationResult` interface
3. Add service to `CloudServiceSelector` component
4. Update API route in `generate-sprite/route.ts`

### Styling Modifications:
- Tailwind CSS for all styling
- Modify `tailwind.config.js` for color schemes
- Update components in `src/components/`

## 🚀 Deployment

### Vercel (Recommended):
```bash
npm install -g vercel
vercel
```

### Other Platforms:
- Netlify: Connect GitHub repo
- Railway: Deploy from GitHub
- AWS Amplify: Connect repository

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use IAM roles with minimal required permissions
- Implement rate limiting for production use
- Consider adding user authentication for multi-user scenarios

## 🐛 Troubleshooting

### Common Issues:

**"Cannot find module" errors**:
```bash
npm install
```

**AI service authentication errors**:
- Check environment variables are correctly set
- Verify cloud service credentials and permissions

**Images not generating**:
- Check network connectivity
- Verify API quotas and billing setup
- Check browser console for detailed errors

### ComfyUI Local Issues:

**"ComfyUI server not running" error**:
```bash
# Start ComfyUI server
cd ComfyUI
python main.py --listen --port 8188
```

**VRAM out of memory errors**:
- Use lower quality settings (Optimized instead of Ultra)
- Reduce resolution (try 768×768 instead of 1024×1024)
- Check VRAM usage in the UI before generation

**Model file corrupted**:
```bash
# Re-download SDXL model
cd ComfyUI/models/checkpoints
# Download fresh copy of sd_xl_base_1.0.safetensors
```

**Slow generation times**:
- Ensure you're using RTX 3050-optimized settings
- Check GPU utilization in Task Manager
- Use Optimized quality for faster results (25-45s)

**Timeout errors**:
- Ultra quality can take up to 20 minutes
- Check ComfyUI server logs for actual progress
- Ensure stable power supply for long generations

## � Deployment

### **FREE Deployment with GitHub Actions**

Since Netlify environment variables require a paid subscription, we use **GitHub Secrets** (completely free) with automatic deployment:

#### **Step 1: Set Up GitHub Secrets**
1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Add these repository secrets:

```
HUGGINGFACEALL: [Your Hugging Face API Token from .env.local]
NEXTAUTH_SECRET: cloud-ai-art-secret-2025-netlify-production
NETLIFY_AUTH_TOKEN: [Your Netlify Personal Access Token]
```

#### **Step 2: Get Netlify Auth Token**
1. Visit: https://app.netlify.com/user/applications#personal-access-tokens
2. Create new token: "GitHub Actions Deploy"
3. Copy token and add as `NETLIFY_AUTH_TOKEN` secret

#### **Step 3: Deploy**
```bash
# Quick setup helper
npm run setup-github-secrets

# Push to trigger deployment
git push origin main
```

#### **✅ Benefits**
- **Completely FREE** - No paid Netlify subscription needed
- **Automatic deployment** on every push to main
- **Secure environment variables** stored in GitHub
- **Proper API route handling** as serverless functions

**📖 Detailed guide**: [`GITHUB_SECRETS_SETUP.md`](./GITHUB_SECRETS_SETUP.md)

## �📖 API Documentation

### Generate Sprite Endpoint
```
POST /api/generate-sprite
{
  "prompt": "cute dragon character",
  "service": "aws" | "azure" | "google"
}
```

### Response Format
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,<base64_data>",
  "metadata": {
    "service": "aws",
    "prompt": "cute dragon character",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- AWS Bedrock for Stable Diffusion models
- Azure OpenAI for DALL-E 3 integration
- Google Cloud for Vertex AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling

---

**Happy Sprite Creating! 🎮✨**