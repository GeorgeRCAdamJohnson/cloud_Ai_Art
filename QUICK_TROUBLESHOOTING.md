# Quick Troubleshooting Guide

## 🚨 Emergency Fixes

### ComfyUI Won't Start
```bash
# Check if port is in use
netstat -an | findstr :8188

# Kill existing process
taskkill /f /im python.exe

# Restart with correct flags
cd C:\Users\biges\ComfyUI
python main.py --listen --port 8188 --enable-cors-header "*"
```

### Next.js Won't Connect to ComfyUI
```bash
# Test ComfyUI connection
curl http://localhost:8188/system_stats

# Check CORS headers
curl -H "Origin: http://localhost:3000" http://localhost:8188/system_stats

# Restart Next.js
cd C:\Users\biges\Clould_Ai_Art
npm run dev
```

### Out of Memory Errors
1. Lower quality setting (Optimized instead of Ultra)
2. Reduce resolution (768x768 instead of 1024x1024)
3. Restart ComfyUI server
4. Check VRAM: `nvidia-smi`

---

## 🔧 Common Error Solutions

### Error: "ComfyUI server not running"
**Solution**: Start ComfyUI server first
```bash
cd C:\Users\biges\ComfyUI
python main.py --listen --port 8188 --enable-cors-header "*"
```

### Error: "CORS policy blocked"
**Solution**: Add CORS header to ComfyUI startup
```bash
python main.py --listen --port 8188 --enable-cors-header "*"
```

### Error: "Cannot import Qwen2_5_VLForConditionalGeneration"
**Solution**: This is non-critical, ComfyUI will work fine
```bash
# Optional fix:
pip install transformers --upgrade
```

### Error: "Generation timeout"
**Solution**: Use appropriate quality setting
- Optimized: <1 minute
- High: <5 minutes  
- Ultra: <20 minutes

---

## 📋 Health Check Commands

### System Status
```bash
# GPU status
nvidia-smi

# ComfyUI status
curl http://localhost:8188/system_stats

# Next.js status
curl http://localhost:3000/api/health
```

### Quick Tests
```bash
# Test ComfyUI connection
node test-comfyui-connection.js

# Test simple generation
node test-simple.js

# Test quality system
node test-quality.js
```

---

## 🎯 Performance Optimization

### For Better Speed:
1. Use "Optimized" quality (25-45s)
2. Use 768x768 resolution
3. Keep prompts concise
4. Restart ComfyUI after 10+ generations

### For Better Quality:
1. Use "Ultra" quality (up to 20min)
2. Use 1024x1024 resolution
3. Use detailed prompts
4. Ensure stable power supply

---

## 📞 When to Restart Services

### Restart ComfyUI if:
- Generation fails repeatedly
- VRAM usage seems high
- Error messages in console
- Performance degrades

### Restart Next.js if:
- Frontend becomes unresponsive
- API calls fail
- Hot reload stops working
- Environment changes made

---

## 🔍 Log Locations

- **ComfyUI Logs**: `C:\Users\biges\ComfyUI\user\comfyui.log`
- **Browser Console**: F12 → Console tab
- **Next.js Terminal**: Where you ran `npm run dev`
- **System Events**: Windows Event Viewer

---

**Quick Reference Card - Keep This Handy!**