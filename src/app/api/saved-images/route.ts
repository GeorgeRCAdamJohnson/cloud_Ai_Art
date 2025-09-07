// API endpoint for managing saved images
// GET: List all saved images
// POST: Save a new image
// DELETE: Remove a saved image

import { NextRequest, NextResponse } from 'next/server'
import { ImageStorage } from '@/lib/imageStorage'

export async function GET() {
  try {
    const images = ImageStorage.listSavedImages()
    const stats = ImageStorage.getStorageStats()
    
    return NextResponse.json({
      images,
      stats,
      success: true
    })
  } catch (error) {
    console.error('Error fetching saved images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved images', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData, prompt, service, model } = body

    if (!imageData || !prompt || !service) {
      return NextResponse.json(
        { error: 'Missing required fields: imageData, prompt, service', success: false },
        { status: 400 }
      )
    }

    const savedImage = await ImageStorage.saveImage(imageData, prompt, service, model || 'unknown')
    
    return NextResponse.json({
      savedImage,
      message: 'Image saved successfully',
      success: true
    })
  } catch (error) {
    console.error('Error saving image:', error)
    return NextResponse.json(
      { error: 'Failed to save image', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const filename = url.searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename parameter is required', success: false },
        { status: 400 }
      )
    }

    const deleted = ImageStorage.deleteSavedImage(filename)
    
    if (deleted) {
      return NextResponse.json({
        message: 'Image deleted successfully',
        success: true
      })
    } else {
      return NextResponse.json(
        { error: 'Image not found or could not be deleted', success: false },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image', success: false },
      { status: 500 }
    )
  }
}