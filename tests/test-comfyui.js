// Simple test to check ComfyUI connection
async function testComfyUI() {
  const serverUrl = 'http://localhost:8188'
  
  try {
    console.log('Testing ComfyUI connection...')
    
    // Test basic connection
    const response = await fetch(`${serverUrl}/system_stats`)
    console.log('Connection status:', response.status)
    
    if (response.ok) {
      const stats = await response.json()
      console.log('ComfyUI is running:', stats)
    } else {
      console.log('ComfyUI not responding properly')
    }
    
  } catch (error) {
    console.error('Connection failed:', error.message)
    console.log('\nTo fix this:')
    console.log('1. Make sure ComfyUI is running')
    console.log('2. Start with: python main.py --listen --port 8188 --enable-cors-header "*"')
  }
}

testComfyUI()