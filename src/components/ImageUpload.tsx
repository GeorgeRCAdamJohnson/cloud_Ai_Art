'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  currentImage: string | null
  onImageRemove: () => void
}

export default function ImageUpload({ onImageSelect, currentImage, onImageRemove }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file)
    } else {
      alert('Please select an image file (PNG, JPG, etc.)')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Reference Image (Optional)
        </label>
        {currentImage && (
          <button
            onClick={onImageRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Reference"
            className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg cursor-pointer flex items-center justify-center"
               onClick={handleClick}>
            <div className="opacity-0 hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-2">
              <Upload className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drop an image here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Upload a reference image to refine and iterate on
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500">
        💡 Upload a photo, sketch, or previous generation to refine and improve it with AI
      </p>
    </div>
  )
}