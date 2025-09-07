# 🎨 How to Connect Real AI Services for Art Generation

This guide shows you how to upgrade from mock implementations to real AI art generation services.

## 🚀 Quick Start (Choose One Service)

### Option 1: AWS Bedrock (Recommended - Easiest Setup)

#### Step 1: Install AWS SDK
```bash
npm install @aws-sdk/client-bedrock-runtime
```

#### Step 2: Get AWS Credentials
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Create IAM user with Bedrock permissions
3. Generate Access Key & Secret

#### Step 3: Set Environment Variables
Create `.env.local` file:
```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
```

#### Step 4: Replace Mock Implementation
Replace `src/lib/aws-bedrock.ts` content with:

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithAWS(prompt: string): Promise<GenerationResult> {
  try {
    const modelId = 'stability.stable-diffusion-xl-v1'
    
    const body = {
      text_prompts: [{ text: `${prompt}, 2D game sprite, pixel art, kids friendly`, weight: 1 }],
      cfg_scale: 7,
      steps: 30,
      seed: Math.floor(Math.random() * 4294967295),
      width: 512,
      height: 512,
      style_preset: "pixel-art"
    }

    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify(body),
      contentType: 'application/json',
      accept: 'application/json'
    })

    const response = await client.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    
    if (responseBody.artifacts && responseBody.artifacts.length > 0) {
      const imageBase64 = responseBody.artifacts[0].base64
      return {
        imageUrl: `data:image/png;base64,${imageBase64}`,
        metadata: { service: 'aws', modelId, prompt, timestamp: new Date().toISOString() }
      }
    }
    
    throw new Error('No image generated')
  } catch (error) {
    console.error('AWS Bedrock error:', error)
    throw new Error('Failed to generate image with AWS Bedrock')
  }
}
```

---

### Option 2: Azure OpenAI (Best Quality)

#### Step 1: Install Dependencies
```bash
npm install axios
```

#### Step 2: Setup Azure OpenAI
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create "Azure OpenAI" resource
3. Deploy DALL-E 3 model
4. Get endpoint URL and API key

#### Step 3: Environment Variables
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_DEPLOYMENT_NAME=dall-e-3
```

#### Step 4: Replace Mock Implementation
Replace `src/lib/azure-ai.ts` content with:

```typescript
import axios from 'axios'

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithAzure(prompt: string): Promise<GenerationResult> {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_API_KEY
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'dall-e-3'

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI credentials not configured')
    }

    const response = await axios.post(
      `${endpoint}/openai/deployments/${deploymentName}/images/generations?api-version=2024-02-01`,
      {
        prompt: `${prompt}, 2D game sprite, pixel art style, transparent background, kids friendly, cartoon style`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        }
      }
    )

    if (response.data.data && response.data.data.length > 0) {
      return {
        imageUrl: response.data.data[0].url,
        metadata: {
          service: 'azure',
          deployment: deploymentName,
          prompt,
          timestamp: new Date().toISOString()
        }
      }
    }
    
    throw new Error('No image generated')
  } catch (error) {
    console.error('Azure AI error:', error)
    throw new Error('Failed to generate image with Azure AI')
  }
}
```

---

### Option 3: Google Cloud Vertex AI

#### Step 1: Install SDK
```bash
npm install @google-cloud/aiplatform
```

#### Step 2: Setup Google Cloud
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Vertex AI API
4. Create service account & download JSON key

#### Step 3: Environment Variables
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

---

## 💰 Cost Comparison

| Service | Cost per Image | Setup Difficulty | Quality |
|---------|---------------|------------------|---------|
| AWS Bedrock | ~$0.04 | Easy ⭐⭐⭐ | High |
| Azure OpenAI | ~$0.04 | Medium ⭐⭐ | Excellent |
| Google Cloud | ~$0.02-0.05 | Hard ⭐ | Very High |

## 🔧 Implementation Steps

### 1. Choose Your Service (AWS Recommended)
Pick one service to start with. AWS Bedrock is the easiest to set up.

### 2. Get Credentials
Follow the setup guide for your chosen service above.

### 3. Install Dependencies
Run the npm install command for your chosen service.

### 4. Create Environment File
Copy `.env.example` to `.env.local` and fill in your credentials.

### 5. Replace Mock Code
Replace the mock implementation with the real code provided above.

### 6. Test It!
Restart your dev server and try generating a sprite!

## 🚨 Important Notes

### Security
- Never commit `.env.local` to version control
- Use IAM roles with minimal permissions
- Set up billing alerts to avoid surprises

### Rate Limits
- AWS: 5 requests/second (default)
- Azure: 10 requests/minute (DALL-E 3)
- Google: Varies by quota

### Costs
- Start with small tests
- Each image costs 2-5 cents
- Set up billing alerts in your cloud console

## 🎯 Testing Your Setup

Once you've set up a service, test it with these prompts:
- "cute dragon character"
- "friendly robot for kids game"
- "magical fairy with sparkly wings"

## 🆘 Troubleshooting

### Common Issues:
1. **Authentication errors**: Check environment variables
2. **Model not found**: Verify model deployment (Azure) or region (AWS)
3. **Rate limits**: Add delays between requests
4. **Costs**: Monitor usage in cloud console

### Quick Fix Commands:
```bash
# Restart dev server after env changes
npm run dev

# Check environment variables
echo $AWS_ACCESS_KEY_ID  # Linux/Mac
echo $env:AWS_ACCESS_KEY_ID  # Windows PowerShell

# Test build
npm run build
```

Want to start with AWS Bedrock? It's the easiest option!