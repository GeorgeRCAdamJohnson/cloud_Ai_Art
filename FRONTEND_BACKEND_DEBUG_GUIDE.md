# Frontend-Backend Integration Debug Guide

## 🔍 Quick Diagnosis Steps

### Step 1: Check Development Server Status
```bash
# Check if dev server is running without errors
npm run dev

# Look for these issues:
# ❌ TypeScript compilation errors
# ❌ Module import failures
# ❌ Syntax errors in comfyui-local.ts
```

### Step 2: Test API Endpoint Directly
```bash
# Test the API endpoint directly
curl -X POST http://localhost:3000/api/generate-sprite \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test image", "model": "sdxl"}'

# Expected: JSON response with imageUrl (base64) and metadata
# Actual: Check if returns proper image data
```

### Step 3: Verify ComfyUI Backend
```bash
# Check ComfyUI server status
curl http://localhost:8188/system_stats

# Should return system information if running
```

### Step 4: Check Frontend Component State
```javascript
// Add to SpriteGenerator.tsx for debugging:
console.log('API Response:', response);
console.log('Generated Image URL:', result.imageUrl);
console.log('Image URL type:', typeof result.imageUrl);
console.log('URL starts with data:', result.imageUrl?.startsWith('data:'));
```

## 🐛 Common Issues & Solutions

### Issue 1: TypeScript Compilation Errors
**Symptoms:**
- Development server shows syntax errors
- `Expected ';', got 'catch'` errors
- Module import failures

**Solution:**
```typescript
// Fix malformed try-catch blocks in comfyui-local.ts
// Ensure all async functions have proper error handling
// Verify all imports/exports are correct
```

### Issue 2: API Returns 200 but No Image Data
**Symptoms:**
- API call succeeds (200 status)
- No imageUrl in response
- Backend logs show successful generation

**Debug Steps:**
```javascript
// Add to API endpoint (/api/generate-sprite.ts):
console.log('Generated result:', result);
console.log('Image URL present:', !!result.imageUrl);
console.log('Response being sent:', JSON.stringify(result).substring(0, 200));
```

### Issue 3: Frontend Not Receiving Data
**Symptoms:**
- API works in tests
- Frontend shows no images
- No error messages

**Debug Steps:**
```jsx
// In SpriteGenerator.tsx:
const handleGenerate = async () => {
  try {
    console.log('Starting generation...');
    const response = await fetch('/api/generate-sprite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const result = await response.json();
    console.log('Parsed result:', result);
    
    if (result.imageUrl) {
      console.log('Setting image URL:', result.imageUrl.substring(0, 50));
      setGeneratedImage(result.imageUrl);
    } else {
      console.error('No imageUrl in result:', result);
    }
  } catch (error) {
    console.error('Generation error:', error);
  }
};
```

## 🔧 Systematic Debug Process

### Phase 1: Isolate the Problem
1. **Test ComfyUI directly:** `curl http://localhost:8188/queue`
2. **Test API endpoint:** Use Postman or curl
3. **Check browser network tab:** Look for failed requests
4. **Review console logs:** Both browser and server

### Phase 2: Trace the Data Flow
1. **User clicks generate** → Component state
2. **API call made** → Network request
3. **Server processes** → ComfyUI integration
4. **Image generated** → Base64 conversion
5. **Response sent** → JSON with imageUrl
6. **Frontend receives** → Component state update
7. **Image displays** → UI render

### Phase 3: Fix Each Break Point
- **Break Point A:** Component → API call
- **Break Point B:** API → ComfyUI service
- **Break Point C:** ComfyUI → Image processing
- **Break Point D:** Image → Base64 conversion
- **Break Point E:** Response → Frontend
- **Break Point F:** Data → UI display

## 🎯 Quick Fix Attempts

### Fix 1: Verify Image URL Format
```javascript
// Ensure imageUrl is properly formatted base64
const isValidBase64Image = (url) => {
  return url && url.startsWith('data:image/') && url.includes('base64,');
};
```

### Fix 2: Add Error Boundaries
```jsx
// Wrap image generation in error boundary
const ImageGenerationWrapper = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error('Image generation error:', error);
    return <div>Error generating image</div>;
  }
};
```

### Fix 3: Force Re-render
```jsx
// Add key to force component re-render when image changes
<img 
  key={generatedImage} 
  src={generatedImage} 
  alt="Generated sprite"
  onError={(e) => console.error('Image load error:', e)}
  onLoad={() => console.log('Image loaded successfully')}
/>
```

## 📊 Debugging Checklist

- [ ] Development server compiles without errors
- [ ] ComfyUI server responds to health checks
- [ ] API endpoint returns 200 status
- [ ] API response contains imageUrl field
- [ ] imageUrl is valid base64 data URL
- [ ] Frontend receives API response
- [ ] Component state updates with image data
- [ ] Image element attempts to load
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests

## 🚨 Emergency Rollback Plan

If issues persist, rollback to:
1. **Previous working commit:** `git checkout [last-working-commit]`
2. **Minimal working example:** Create simple test component
3. **Alternative service:** Switch to fallback image service
4. **Local file serving:** Use filesystem-based image serving

## 📝 Report Template

When reporting issues, include:

```
**Environment:**
- Node.js version: 
- Browser: 
- OS: 

**Reproduction Steps:**
1. 
2. 
3. 

**Expected Result:**
- 

**Actual Result:**
- 

**Console Errors:**
```
[paste errors here]
```

**Network Requests:**
```
[paste network tab info]
```

**Additional Context:**
- 
```

---
**Created:** September 8, 2025  
**Purpose:** Debug frontend-backend image generation integration  
**Status:** Active Investigation