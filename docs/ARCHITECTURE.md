# System Architecture

## Overview
Cloud AI Art Studio follows a modern three-tier architecture with a React/Next.js frontend, Node.js API backend, and multiple AI service integrations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  React Components (TSX)                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ SpriteGenerator │ │ ServiceSelector │ │ ImageManager    │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ SpriteGallery   │ │ SavedImages     │ │ ComfyUISettings │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                         API Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes                                            │
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │ /generate-sprite│ │ /saved-images   │                       │
│  └─────────────────┘ └─────────────────┘                       │
├─────────────────────────────────────────────────────────────────┤
│                      Service Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  AI Service Integrations                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ ComfyUI Local│ │ Hugging Face│ │ Replicate   │ │ AWS Bedrock│ │
│  │ (✅ Active)  │ │ (✅ Working)  │ │ (🔧 Ready)   │ │ (🔧 Mock)   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐                               │
│  │ Azure AI    │ │ Google AI   │                               │
│  │ (🔧 Mock)    │ │ (🔧 Mock)    │                               │
│  └─────────────┘ └─────────────┘                               │
│                                                                 │
│  Hardware Layer (RTX 3050 Optimization)                        │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ VRAM Management | Memory Throttling | Safe Parameter Selection │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. Page Layout (`src/app/page.tsx`)
- **Purpose**: Main application container
- **Responsibilities**:
  - State management for active service and generated sprites
  - Tab navigation between generation and saved images
  - Layout structure and responsive design
- **Key State**:
  ```typescript
  const [selectedService, setSelectedService] = useState<'aws' | 'azure' | 'google' | 'huggingface' | 'replicate'>('huggingface')
  const [generatedSprites, setGeneratedSprites] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate')
  ```

#### 2. CloudServiceSelector (`src/components/CloudServiceSelector.tsx`)
- **Purpose**: AI service selection interface
- **Responsibilities**:
  - Display available AI services with status indicators
  - Show pricing and capability information
  - Handle service selection changes
- **Props**:
  ```typescript
  interface CloudServiceSelectorProps {
    selectedService: string
    onServiceChange: (service: string) => void
  }
  ```

#### 3. SpriteGenerator (`src/components/SpriteGenerator.tsx`)
- **Purpose**: Main sprite generation interface
- **Responsibilities**:
  - Prompt input and validation
  - Quick prompt suggestions
  - API calls to generation endpoint
  - Display generated results
  - Download functionality
- **Key Features**:
  - Textarea for custom prompts
  - Grid of suggested prompts
  - Loading states and error handling
  - Automatic prompt enhancement

#### 4. ComfyUIModelSelector (`src/components/ComfyUIModelSelector.tsx`)
- **Purpose**: Model selection interface for ComfyUI Local
- **Responsibilities**:
  - Display available ComfyUI models with status indicators
  - Show model capabilities and RTX 3050 optimization info
  - Handle model selection for local generation
- **Props**:
  ```typescript
  interface ComfyUIModelSelectorProps {
    selectedModel: string
    onModelChange: (model: string) => void
    isVisible: boolean
  }
  ```

#### 5. ComfyUISettings (`src/components/ComfyUISettings.tsx`)
- **Purpose**: Advanced settings for ComfyUI Local generation
- **Responsibilities**:
  - Resolution selection with 8 presets plus custom
  - Quality level selection (Optimized/High/Ultra)
  - VRAM usage estimation and warnings
  - Hardware-aware parameter recommendations
- **Key Features**:
  - Real-time VRAM usage calculation
  - Memory-safe resolution recommendations
  - Quality preset descriptions with time estimates
  - RTX 3050-specific optimization hints

#### 6. SpriteGenerator (`src/components/SpriteGenerator.tsx`) - Enhanced
- **Purpose**: Display current session's generated sprites
- **Responsibilities**:
  - Grid layout of generated images
  - Image metadata display
  - Download and share functionality

#### 5. SavedImagesManager (`src/components/SavedImagesManager.tsx`)
- **Purpose**: Manage persistently saved images
- **Responsibilities**:
  - Fetch and display saved images from storage
  - Storage statistics and usage display
  - Delete and download operations
  - Error handling for file operations

### API Layer

#### 1. Generate Sprite Endpoint (`src/app/api/generate-sprite/route.ts`)
- **Method**: POST
- **Purpose**: Coordinate sprite generation across AI services
- **Flow**:
  ```
  Request → Validation → Service Selection → AI API Call → Image Processing → Auto-save → Response
  ```
- **Responsibilities**:
  - Input validation and sanitization
  - Service routing based on selection
  - Error handling and logging
  - Automatic image saving
  - Response formatting

#### 2. Saved Images Endpoint (`src/app/api/saved-images/route.ts`)
- **Methods**: GET, POST, DELETE
- **Purpose**: Manage saved image CRUD operations
- **Responsibilities**:
  - List all saved images with metadata
  - Save new images to storage
  - Delete specific images
  - Provide storage statistics

### Service Layer

#### 1. AI Service Integrations
Each AI service follows a consistent interface:

```typescript
export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithService(prompt: string): Promise<GenerationResult>
```

**ComfyUI Local (`src/lib/comfyui-local.ts`)**:
- **Status**: ✅ Fully Active with RTX 3050 Optimization
- **Model**: SDXL Base 1.0 (6.9GB, Professional Quality)
- **Cost**: Completely Free (No API costs)
- **Features**: 
  - RTX 3050 6GB memory optimization
  - 3-tier quality system with hardware-aware parameters
  - 8 resolution presets plus custom sizing
  - Extended 20-minute timeout for ultra quality
  - Real-time VRAM usage monitoring
  - Automatic parameter throttling to prevent overflow
  - Dynamic workflow generation based on settings
- **Architecture**:
  ```typescript
  interface RTX_3050_CONFIG {
    maxVRAM: 6144 // MB
    safeVRAM: 5120 // MB with buffer
    maxBatchSize: 1
    getSafeSettings: (width, height, quality) => SafeSettings
    getVRAMUsage: (width, height, steps) => number
  }
  ```

**Hugging Face (`src/lib/huggingface.ts`)**:
- **Status**: ✅ Working
- **Model**: FLUX.1-schnell
- **Cost**: Free (with rate limits)
- **Features**: Fast generation, kid-friendly prompts

**Replicate (`src/lib/replicate.ts`)**:
- **Status**: 🔧 Ready (needs API token)
- **Cost**: $5 free credit
- **Features**: High-quality models, async processing

**AWS Bedrock (`src/lib/aws-bedrock.ts`)**:
- **Status**: 🔧 Mock implementation
- **Cost**: Pay-per-use
- **Features**: Enterprise-grade, multiple models

**Azure OpenAI (`src/lib/azure-ai.ts`)**:
- **Status**: 🔧 Mock implementation
- **Cost**: Pay-per-use
- **Features**: DALL-E integration, high quality

**Google Vertex AI (`src/lib/google-ai.ts`)**:
- **Status**: 🔧 Mock implementation
- **Cost**: Pay-per-use
- **Features**: Imagen models, Google Cloud integration

#### 2. Image Storage Service (`src/lib/imageStorage.ts`)
- **Purpose**: Local file system storage management
- **Responsibilities**:
  - Save base64 images to filesystem
  - Generate unique filenames
  - List and retrieve saved images
  - Calculate storage statistics
  - File deletion and cleanup

## Data Flow

### 1. Sprite Generation Flow
```
User Input → Service Selection → ComfyUI Settings → VRAM Check → Parameter Optimization → Workflow Generation → Local Processing → Storage → UI Update
```

1. **User Input**: User enters prompt and selects ComfyUI Local service
2. **Service Selection**: Router directs to ComfyUI Local integration
3. **ComfyUI Settings**: User configures resolution and quality level
4. **VRAM Check**: System estimates memory usage and validates safety
5. **Parameter Optimization**: RTX 3050 config calculates safe parameters
6. **Workflow Generation**: Dynamic JSON workflow created with optimized settings
7. **Local Processing**: ComfyUI server processes with hardware throttling
8. **Storage**: Automatically save to local filesystem with metadata
9. **UI Update**: Display result with generation stats and VRAM usage

### 2. ComfyUI Hardware Optimization Flow
```
Resolution + Quality Input → VRAM Estimation → Parameter Calculation → Safety Validation → Workflow Adjustment
```

1. **Resolution + Quality Input**: User selects dimensions and quality tier
2. **VRAM Estimation**: Calculate expected memory usage based on resolution
3. **Parameter Calculation**: Determine safe steps, CFG, and sampler settings
4. **Safety Validation**: Ensure total usage stays under 5.1GB threshold
5. **Workflow Adjustment**: Modify ComfyUI JSON with optimized parameters

### 3. Extended Timeout Flow
```
Storage Request → File System Access → Metadata Processing → Response Formatting
```

1. **Storage Request**: User requests saved images list
2. **File System Access**: Read directory and file metadata
3. **Metadata Processing**: Extract creation date, size, prompt info
4. **Response Formatting**: Return structured data for UI

## Storage Architecture

### Local File Storage
```
public/
└── generated-sprites/
    ├── huggingface_cute_dragon_2025-09-07T19-00-00-000Z.png
    ├── replicate_robot_knight_2025-09-07T19-05-00-000Z.png
    └── azure_fairy_character_2025-09-07T19-10-00-000Z.png
```

**Filename Format**: `{service}_{prompt_snippet}_{iso_timestamp}.png`

**Benefits**:
- Simple implementation
- Direct browser access via URLs
- No database complexity
- Easy backup and migration

**Limitations**:
- No metadata persistence
- Limited scalability
- No access control
- Local storage only

### Future Storage Options

**Database Integration**:
```sql
CREATE TABLE generated_images (
  id UUID PRIMARY KEY,
  filename VARCHAR(255),
  prompt TEXT,
  service VARCHAR(50),
  model VARCHAR(100),
  created_at TIMESTAMP,
  file_size INTEGER,
  user_id UUID
);
```

**Cloud Storage**:
- AWS S3 for scalable storage
- Cloudinary for image optimization
- Google Cloud Storage for global CDN

## Security Architecture

### API Security
- Input validation and sanitization
- Rate limiting (planned)
- API key encryption in environment variables
- CORS configuration for browser safety

### File Security
- Filename sanitization to prevent path traversal
- File type validation
- Size limits to prevent abuse
- Directory traversal protection

### Future Security Enhancements
- User authentication with JWT
- Role-based access control
- Image watermarking
- Content moderation

## RTX 3050 Optimization Architecture

### Hardware Configuration
```typescript
const RTX_3050_CONFIG = {
  maxVRAM: 6144,     // Total 6GB VRAM
  safeVRAM: 5120,    // Safe limit with 1GB buffer
  maxBatchSize: 1,   // Single image generation
  
  // Dynamic VRAM estimation
  getVRAMUsage: (width, height, steps) => {
    const pixelCount = width * height
    const baseVRAM = pixelCount < 512*512 ? 2800 :
                     pixelCount < 768*768 ? 3500 :
                     pixelCount < 1024*1024 ? 4800 : 6000
    return baseVRAM + (steps * 45) // Additional per step
  },
  
  // Safe parameter calculation
  getSafeSettings: (width, height, quality) => {
    const estimatedVRAM = getVRAMUsage(width, height, baseSteps)
    
    if (estimatedVRAM > safeVRAM) {
      // Reduce parameters to fit in memory
      return reduceParameters(quality, estimatedVRAM)
    }
    
    return getOptimalParameters(quality)
  }
}
```

### Quality System Architecture
```typescript
const QUALITY_PRESETS = {
  optimized: {
    description: 'Fast generation (~25-45s)',
    targetSteps: 20,
    targetCFG: 6.0,
    memoryEfficient: true
  },
  high: {
    description: 'High Quality (~2-5min)',
    targetSteps: 28,
    targetCFG: 7.0, 
    memoryEfficient: true
  },
  ultra: {
    description: 'Ultra Quality (up to 20min)',
    targetSteps: 35,
    targetCFG: 7.5,
    memoryEfficient: false,
    maxTimeout: 1200000 // 20 minutes
  }
}
```

### Memory Management Flow
```
User Settings → VRAM Estimation → Parameter Adjustment → Workflow Generation → Safe Execution
```

1. **User Settings**: Resolution and quality selection
2. **VRAM Estimation**: Calculate expected memory usage
3. **Parameter Adjustment**: Reduce steps/CFG if needed for safety
4. **Workflow Generation**: Create optimized ComfyUI JSON
5. **Safe Execution**: Monitor and throttle during generation

## Timeout Architecture

### Multi-Platform Timeout Configuration
```typescript
// Core ComfyUI timeout (local development)
const DEFAULT_CONFIG = {
  timeout: parseInt(process.env.COMFYUI_TIMEOUT || '1200000') // 20 minutes
}

// Deployment platform limits
const PLATFORM_LIMITS = {
  local: 1200000,      // 20 minutes
  netlify: 900000,     // 15 minutes (platform max)
  vercel: 900000       // 15 minutes (Pro plan max)
}
```

### Extended Processing Support
- **Local Development**: Full 20-minute timeout for ultra quality
- **Serverless Deployment**: 15-minute limit with graceful degradation
- **Progress Monitoring**: Real-time generation status updates
- **Automatic Fallback**: Timeout handling with partial results

## Performance Considerations

### Frontend Optimization
- Component lazy loading
- Image optimization with Next.js Image component
- Efficient state management
- Responsive design for mobile performance

### API Optimization
- Async processing for long-running AI calls
- Response caching (planned)
- Error retry mechanisms
- Timeout handling

### Storage Optimization
- Image compression
- Thumbnail generation (planned)
- Cleanup routines for old files
- Storage monitoring and alerts

## Scalability Architecture

### Current Limitations
- Single ComfyUI server instance
- RTX 3050 hardware dependency for local generation
- 20-minute maximum generation time
- Local file storage
- Limited concurrent ComfyUI users (1 generation at a time)

### Scaling Strategies

**ComfyUI Horizontal Scaling**:
- Multiple GPU instances with load balancing
- Queue management for concurrent requests
- Distributed ComfyUI worker nodes
- Cloud GPU instances (RunPod, Lambda Labs)

**Hybrid Cloud-Local Architecture**:
```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ ComfyUI Local  │ │ Cloud Services │ │ Queue Manager  │
│ (RTX 3050)    │ │ (AWS/Azure)   │ │ (Load Balance) │
└───────────────┘ └───────────────┘ └───────────────┘
```

**Hardware Optimization Scaling**:
- RTX 4060/4070 upgrade path
- Multi-GPU ComfyUI setups
- Dedicated VRAM monitoring
- Hardware-specific optimization profiles

### Scaling Strategies

**Horizontal Scaling**:
- Load balancer distribution
- Multiple server instances
- Shared storage layer
- Database for state persistence

**Vertical Scaling**:
- Increased server resources
- SSD storage for faster I/O
- Memory optimization
- CPU optimization for image processing

**Microservices Architecture**:
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Frontend  │ │  API Gateway│ │   Storage   │
│   Service   │ │   Service   │ │   Service   │
└─────────────┘ └─────────────┘ └─────────────┘
       │               │               │
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    AI       │ │    User     │ │   Analytics │
│  Services   │ │  Management │ │   Service   │
└─────────────┘ └─────────────┘ └─────────────┘
```

## Error Handling Architecture

### Frontend Error Handling
- Component error boundaries
- User-friendly error messages
- Fallback UI components
- Retry mechanisms

### API Error Handling
- Structured error responses
- HTTP status codes
- Error logging
- Graceful degradation

### Service Error Handling
- Service availability checking
- Fallback to alternative services
- Rate limit handling
- Timeout management

## Monitoring and Observability

### Current Monitoring
- Console logging with ComfyUI-specific details
- Error boundary catching
- Storage statistics
- Network request monitoring
- **ComfyUI Health Monitoring**: Server status checks
- **VRAM Usage Tracking**: Real-time memory monitoring
- **Generation Progress**: Step-by-step workflow status
- **Hardware Performance**: GPU utilization and thermal monitoring

### ComfyUI-Specific Monitoring
```typescript
// Health check endpoint
GET /api/comfyui/health
{
  "status": "running",
  "server": "http://localhost:8188",
  "vramUsage": "2.1GB / 6GB",
  "queueLength": 0,
  "activeGeneration": null
}

// Generation progress
GET /api/comfyui/progress/{promptId}
{
  "promptId": "abc123",
  "status": "generating",
  "progress": 0.65,
  "currentStep": 23,
  "totalSteps": 35,
  "elapsedTime": "4m 32s",
  "estimatedRemaining": "2m 18s"
}
```

### Future Monitoring
- Application Performance Monitoring (APM)
- Error tracking with Sentry
- Usage analytics
- Cost monitoring for AI services

## Development Architecture

### Development Workflow
```
Local Development → Testing → Staging → Production
```

### Build Process
- TypeScript compilation
- Next.js optimization
- Asset bundling
- Environment variable injection

### Deployment Pipeline
- Git-based deployment
- Automatic builds on push
- Environment-specific configurations
- Health checks and rollback

This architecture provides a solid foundation for a scalable, maintainable AI art generation platform while maintaining simplicity for development and deployment.