# Cloud AI Art - 2D Game Sprite Generator

A lightweight AI-powered platform for generating 2D game sprites specifically designed for kids' games. This application provides an easy-to-use web interface that integrates with **FREE and paid** cloud AI services without the complexity of local model setup.

## 🆓 **FREE AI Options Available!**

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

- **Multi-Cloud AI Integration**: Support for FREE (Hugging Face, Replicate) and paid services (AWS, Azure, Google)
- **Kid-Friendly Design**: Colorful, intuitive interface perfect for creating children's game assets
- **2D Sprite Focused**: Optimized prompts and settings for game sprite generation
- **Real-time Generation**: Fast sprite creation with live preview
- **Download & Gallery**: Save and organize your generated sprites
- **No Local Setup Required**: All AI processing happens in the cloud
- **🆓 FREE OPTIONS**: Start generating immediately with free services

## 🎯 Target Use Cases

- **Indie Game Developers**: Quickly prototype character sprites for kids' games
- **Educational Games**: Create engaging visual assets for learning applications
- **Parents & Educators**: Generate custom characters for storytelling and activities
- **Small Studios**: Cost-effective sprite generation without hiring artists

## ☁️ **AI Service Options**

### 🆓 **FREE Services (Recommended to Start)**

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
- Cloud service account (AWS/Azure/Google)
- Basic knowledge of environment variables

### 1. Clone & Install
```bash
git clone <your-repo>
cd cloud-ai-art
npm install
```

### 2. Environment Setup
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

## 📖 API Documentation

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