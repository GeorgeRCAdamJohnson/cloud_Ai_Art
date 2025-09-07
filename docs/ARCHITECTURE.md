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
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │ SpriteGallery   │ │ SavedImages     │                       │
│  └─────────────────┘ └─────────────────┘                       │
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
│  │ Hugging Face│ │ Replicate   │ │ AWS Bedrock │ │ Azure AI  │ │
│  │ (Working)   │ │ (Ready)     │ │ (Mock)      │ │ (Mock)    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐                               │
│  │ Google AI   │ │ ImageStorage│                               │
│  │ (Mock)      │ │ (Local FS)  │                               │
│  └─────────────┘ └─────────────┘                               │
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

#### 4. SpriteGallery (`src/components/SpriteGallery.tsx`)
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
User Input → Prompt Enhancement → Service Selection → API Call → Image Processing → Storage → UI Update
```

1. **User Input**: User enters prompt and selects AI service
2. **Prompt Enhancement**: System adds kid-friendly terms automatically
3. **Service Selection**: Router directs to appropriate AI service
4. **API Call**: HTTP request to external AI service
5. **Image Processing**: Convert response to base64 format
6. **Storage**: Automatically save to local filesystem
7. **UI Update**: Display result and update gallery

### 2. Image Management Flow
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
- Single server deployment
- Local file storage
- No horizontal scaling
- Limited concurrent users

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
- Console logging
- Error boundary catching
- Storage statistics
- Network request monitoring

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