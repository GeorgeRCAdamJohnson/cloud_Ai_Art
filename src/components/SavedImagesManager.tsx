'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Image as ImageIcon, HardDrive } from 'lucide-react'

interface SavedImage {
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

interface StorageStats {
  totalImages: number
  totalSizeBytes: number
  totalSizeMB: string
  storageDir: string
}

export default function SavedImagesManager() {
  const [images, setImages] = useState<SavedImage[]>([])
  const [stats, setStats] = useState<StorageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSavedImages()
  }, [])

  const fetchSavedImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/saved-images')
      const data = await response.json()
      
      if (data.success) {
        setImages(data.images)
        setStats(data.stats)
        setError(null)
      } else {
        setError(data.error || 'Failed to load saved images')
      }
    } catch (err) {
      setError('Network error loading saved images')
      console.error('Error fetching saved images:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return

    try {
      const response = await fetch(`/api/saved-images?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setImages(images.filter(img => img.filename !== filename))
        // Refresh stats
        fetchSavedImages()
      } else {
        setError(data.error || 'Failed to delete image')
      }
    } catch (err) {
      setError('Network error deleting image')
      console.error('Error deleting image:', err)
    }
  }

  const downloadImage = (image: SavedImage) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = image.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    return bytes < 1024 * 1024 
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading saved images...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <HardDrive className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Saved Images</h2>
      </div>

      {/* Storage Stats */}
      {stats && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total Images:</span>
              <span className="ml-2 text-blue-600 font-semibold">{stats.totalImages}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Storage Used:</span>
              <span className="ml-2 text-blue-600 font-semibold">{stats.totalSizeMB} MB</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Location:</span>
              <span className="ml-2 text-gray-600 text-xs">/public/generated-sprites</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchSavedImages}
            className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No saved images yet</h3>
          <p className="text-gray-400">Generate some sprites and they&apos;ll automatically be saved here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.filename} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Image Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={image.url}
                  alt={image.metadata.prompt}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NS4wMDMgNzNMNzEgNzdMNzUuMDAzIDgxTDc5IDc3TDc1LjAwMyA3M1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyNy4wMDMgNzNMMTIzIDc3TDEyNy4wMDMgODFMMTMxIDc3TDEyNy4wMDMgNzNaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
                  }}
                />
              </div>

              {/* Image Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                  {image.metadata.prompt}
                </h3>
                
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="capitalize font-medium">{image.metadata.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatSize(image.metadata.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDate(image.metadata.timestamp)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadImage(image)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  <button
                    onClick={() => deleteImage(image.filename)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}