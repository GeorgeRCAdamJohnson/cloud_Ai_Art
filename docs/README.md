# Cloud AI Art Studio

A lightweight AI art platform for generating 2D game sprites for kids' games, built with Next.js and integrating multiple cloud AI services.

## 🎯 Project Overview

Cloud AI Art Studio is designed to be a simple alternative to complex tools like ComfyUI, providing an easy-to-use interface for generating kid-friendly game sprites using various AI services.

## ✨ Features

### Core Functionality
- **Multi-Service AI Integration**: Support for AWS Bedrock, Azure OpenAI, Google Cloud Vertex AI, Hugging Face, and Replicate
- **Kid-Friendly Content**: Automatic prompt enhancement for cartoon-style, colorful, safe content
- **Real-time Generation**: Live sprite generation with progress indicators
- **Image Storage**: Automatic saving and management of generated sprites
- **Gallery View**: Browse and manage your generated sprites

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error messages and fallback systems
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Beautiful gradient interface with Tailwind CSS
- **API Architecture**: RESTful API design with proper error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AI service API keys (optional for mock services)

### Installation
```bash
# Clone the repository
git clone https://github.com/GeorgeRCAdamJohnson/cloud_Ai_Art.git
cd cloud_Ai_Art

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with your API keys:

```env
# Hugging Face (Free Tier Available)
HUGGINGFACE_API_TOKEN=hf_your_token_here

# Replicate (Free $5 Credit)
REPLICATE_API_TOKEN=your_replicate_token_here

# Premium Services (Optional)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1

AZURE_OPENAI_API_KEY=your_azure_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint

GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```

### Supported AI Services

| Service | Status | Cost | Quality | Speed |
|---------|--------|------|---------|--------|
| Hugging Face | ✅ Working | FREE (100/day) | High | Fast |
| Replicate | ✅ Ready | $5 free credit | High | Medium |
| AWS Bedrock | 🔧 Mock | Pay-per-use | Highest | Fast |
| Azure OpenAI | 🔧 Mock | Pay-per-use | Highest | Fast |
| Google Vertex AI | 🔧 Mock | Pay-per-use | High | Medium |

## 🎮 Usage

### Generating Sprites
1. **Select AI Service**: Choose from available services in the sidebar
2. **Enter Prompt**: Describe your sprite (e.g., "cute dragon character")
3. **Generate**: Click the generate button and wait for results
4. **Download**: Save individual sprites or view in the gallery

### Managing Images
1. **Automatic Saving**: All generated images are automatically saved
2. **Gallery View**: Click "💾 Saved Images" to view all sprites
3. **Download**: Click download button on any saved image
4. **Delete**: Remove unwanted images to free up space

### Best Practices
- Use descriptive prompts (e.g., "friendly robot character with blue armor")
- Keep prompts focused on single characters or objects
- The system automatically adds kid-friendly styling terms
- Try different AI services for varied artistic styles

## 📁 Project Structure

```
cloud_Ai_Art/
├── docs/                     # Documentation
├── public/
│   └── generated-sprites/    # Saved images storage
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── api/             # API routes
│   │   │   ├── generate-sprite/
│   │   │   └── saved-images/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── components/          # React components
│   │   ├── CloudServiceSelector.tsx
│   │   ├── SavedImagesManager.tsx
│   │   ├── SpriteGallery.tsx
│   │   └── SpriteGenerator.tsx
│   └── lib/                 # Utility libraries
│       ├── aws-bedrock.ts
│       ├── azure-ai.ts
│       ├── google-ai.ts
│       ├── huggingface.ts
│       ├── imageStorage.ts
│       └── replicate.ts
├── real-implementations/     # Production API implementations
├── package.json
└── README.md
```

## 🔗 API Endpoints

### POST `/api/generate-sprite`
Generate a new sprite using specified AI service.

**Request:**
```json
{
  "prompt": "cute dragon character",
  "service": "huggingface"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "metadata": {
    "service": "huggingface",
    "model": "FLUX.1-schnell",
    "prompt": "cute dragon character, cartoon style...",
    "timestamp": "2025-09-07T19:00:00.000Z",
    "cost": "FREE"
  },
  "saved": {
    "filename": "huggingface_cute_dragon_2025-09-07T19-00-00-000Z.png",
    "url": "/generated-sprites/huggingface_cute_dragon_2025-09-07T19-00-00-000Z.png"
  }
}
```

### GET `/api/saved-images`
Retrieve all saved images and storage statistics.

**Response:**
```json
{
  "success": true,
  "images": [...],
  "stats": {
    "totalImages": 5,
    "totalSizeMB": "2.3",
    "storageDir": "/path/to/storage"
  }
}
```

### DELETE `/api/saved-images?filename=image.png`
Delete a specific saved image.

## 🛠 Development

### Adding New AI Services
1. Create service implementation in `src/lib/your-service.ts`
2. Export `generateWithYourService` function
3. Add service to the switch statement in `generate-sprite/route.ts`
4. Update `CloudServiceSelector.tsx` with new option

### Customizing UI
- Modify components in `src/components/`
- Update styling in `src/app/globals.css`
- Adjust Tailwind classes for design changes

### Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## 🎨 Customization

### Prompt Enhancement
The system automatically enhances user prompts with kid-friendly terms. Modify this in each service file:

```typescript
const enhancedPrompt = `${prompt}, 2D game sprite, cartoon style, colorful, cute, friendly, simple background, kids game character`
```

### UI Themes
Update the gradient background and colors in `src/app/page.tsx`:

```css
bg-gradient-to-br from-purple-400 via-pink-500 to-red-500
```

## 📊 Monitoring & Analytics

### Storage Monitoring
- View storage statistics in the "💾 Saved Images" tab
- Monitor disk usage and total images
- Clean up old images as needed

### Error Logging
- Check browser console for client-side errors
- Monitor server logs for API errors
- Review network requests for API debugging

## 🔒 Security

### API Key Management
- Never commit API keys to version control
- Use `.env.local` for local development
- Use proper environment variables in production

### File Storage
- Images are stored in `/public/generated-sprites/`
- Direct access via URLs like `/generated-sprites/filename.png`
- Consider implementing access controls for production

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
- **Netlify**: Full Next.js support
- **Railway**: Docker deployment option
- **Self-hosted**: Use `npm run build && npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check `/docs` folder for detailed guides
- **Community**: Join discussions in GitHub Discussions

## 🎯 Roadmap

### Near Term
- [ ] Fix Hugging Face FLUX.1-schnell parameters
- [ ] Implement real Replicate integration
- [ ] Add more free AI service options
- [ ] Improve error handling and user feedback

### Future Features
- [ ] Batch sprite generation
- [ ] Sprite animation tools
- [ ] Team collaboration features
- [ ] Advanced prompt templates
- [ ] Integration with game engines
- [ ] Cloud storage options (AWS S3, Google Cloud)
- [ ] User authentication and profiles
- [ ] Sprite variation generation
- [ ] Custom model fine-tuning

---

Built with ❤️ for game developers and kids everywhere!