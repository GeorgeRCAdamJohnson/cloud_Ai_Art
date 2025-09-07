// Image Storage Utilities
// Handles saving generated images locally and providing download functionality

import fs from 'fs'
import path from 'path'

export interface SavedImage {
  filename: string
  filepath: string
  url: string
  metadata: {
    service: string
    model: string
    prompt: string
    timestamp: string
    size?: number
  }
}

export class ImageStorage {
  private static readonly storageDir = path.join(process.cwd(), 'public', 'generated-sprites')

  // Ensure storage directory exists
  static ensureStorageDir() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true })
    }
  }

  // Save base64 image to local storage
  static async saveImage(
    base64Data: string, 
    prompt: string, 
    service: string, 
    model: string
  ): Promise<SavedImage> {
    this.ensureStorageDir()

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const sanitizedPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')
    const filename = `${service}_${sanitizedPrompt}_${timestamp}.png`
    const filepath = path.join(this.storageDir, filename)

    // Remove data URL prefix if present
    const imageData = base64Data.replace(/^data:image\/[a-z]+;base64,/, '')
    
    // Save to file
    fs.writeFileSync(filepath, imageData, 'base64')
    
    // Get file size
    const stats = fs.statSync(filepath)
    
    return {
      filename,
      filepath,
      url: `/generated-sprites/${filename}`,
      metadata: {
        service,
        model,
        prompt,
        timestamp: new Date().toISOString(),
        size: stats.size
      }
    }
  }

  // List all saved images
  static listSavedImages(): SavedImage[] {
    this.ensureStorageDir()
    
    try {
      const files = fs.readdirSync(this.storageDir)
      const imageFiles = files.filter(file => 
        file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
      )

      return imageFiles.map(filename => {
        const filepath = path.join(this.storageDir, filename)
        const stats = fs.statSync(filepath)
        
        // Try to extract metadata from filename
        const parts = filename.replace(/\.(png|jpg|jpeg)$/, '').split('_')
        const service = parts[0] || 'unknown'
        const prompt = parts.slice(1, -1).join('_').replace(/_/g, ' ') || 'unknown'
        
        return {
          filename,
          filepath,
          url: `/generated-sprites/${filename}`,
          metadata: {
            service,
            model: 'extracted-from-filename',
            prompt,
            timestamp: stats.birthtime.toISOString(),
            size: stats.size
          }
        }
      }).sort((a, b) => 
        new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
      )
    } catch (error) {
      console.error('Error listing saved images:', error)
      return []
    }
  }

  // Delete a saved image
  static deleteSavedImage(filename: string): boolean {
    try {
      const filepath = path.join(this.storageDir, filename)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  // Get storage statistics
  static getStorageStats() {
    this.ensureStorageDir()
    
    try {
      const files = fs.readdirSync(this.storageDir)
      const imageFiles = files.filter(file => 
        file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
      )

      let totalSize = 0
      imageFiles.forEach(filename => {
        const filepath = path.join(this.storageDir, filename)
        const stats = fs.statSync(filepath)
        totalSize += stats.size
      })

      return {
        totalImages: imageFiles.length,
        totalSizeBytes: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        storageDir: this.storageDir
      }
    } catch (error) {
      console.error('Error getting storage stats:', error)
      return {
        totalImages: 0,
        totalSizeBytes: 0,
        totalSizeMB: '0.00',
        storageDir: this.storageDir
      }
    }
  }
}