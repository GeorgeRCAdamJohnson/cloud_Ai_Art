# Tests Directory

This directory contains all test files for the ComfyUI optimization project.

## Test Categories

### 🔌 Connection Tests
- `test-comfyui-connection.js` - Basic ComfyUI connectivity
- `test-comfyui-direct.js` - Direct API testing
- `test-comfyui.js` - General ComfyUI functionality

### 🏃‍♂️ Performance Tests  
- `test-turbo-optimization.js` - Turbo model optimization validation
- `test-quality.js` - Image quality assessment
- `multimodel-optimization-test.js` - Multi-model comparison

### 🎨 Content Tests
- `test-consistency.js` - Character consistency validation
- `adult-stress-test.js` - Content-specific stress testing

### 🔧 System Tests
- `test-enhanced-prompts.js` - Enhanced prompting system
- `test-enhanced-status.js` - Status monitoring
- `test-default-service.js` - Default service validation
- `test-simple.js` - Basic functionality tests

## Running Tests

```bash
# Individual test files
node tests/test-comfyui-connection.js
node tests/test-turbo-optimization.js

# With npm scripts (if configured)
npm run test:comfyui
npm run test:optimization
```

## Test Results

Results are automatically saved to the `/results/` directory with timestamped folders.