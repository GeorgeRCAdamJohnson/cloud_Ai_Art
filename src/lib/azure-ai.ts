// Mock Azure AI implementation for demo purposes
// To use real Azure OpenAI, install: npm install axios and configure Azure OpenAI credentials

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithAzure(prompt: string): Promise<GenerationResult> {
  try {
    // This is a mock implementation for demo purposes
    // In production, replace with actual Azure OpenAI API calls
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Generate a simple colored square with the prompt as demo
    const canvas = createMockCanvas(prompt, '#4ECDC4')
    
    return {
      imageUrl: canvas,
      metadata: {
        service: 'azure',
        model: 'dall-e-3 (mock)',
        prompt,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Azure AI generation error:', error)
    throw new Error('Failed to generate image with Azure AI')
  }
}

function createMockCanvas(text: string, color: string): string {
  // Create a simple SVG as base64 for demo
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="${color}"/>
      <text x="256" y="256" text-anchor="middle" dominant-baseline="middle" 
            fill="white" font-family="Arial" font-size="24" font-weight="bold">
        ${text.substring(0, 20)}...
      </text>
      <text x="256" y="300" text-anchor="middle" dominant-baseline="middle" 
            fill="white" font-family="Arial" font-size="16">
        Generated with Azure
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}