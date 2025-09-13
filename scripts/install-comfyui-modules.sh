#!/bin/bash
# ComfyUI Performance Modules Installation Script
# Optimized for kid-friendly art, UI/UX assets, and photorealistic characters

echo "🚀 Starting ComfyUI Performance Modules Installation..."
echo "📋 Optimized for: Kid-friendly art, UI/UX assets, photorealistic characters"
echo "💻 Hardware: RTX 3050 6GB"

# Check if ComfyUI directory exists
if [ ! -d "ComfyUI/custom_nodes" ]; then
    echo "❌ ComfyUI directory not found. Please run this script from your ComfyUI installation directory."
    exit 1
fi

cd ComfyUI/custom_nodes

echo ""
echo "📦 Phase 1: Essential Safety & Performance Modules"
echo "================================================="

# Safety and content filtering
echo "🛡️ Installing ComfyUI-SafetyChecker..."
if [ ! -d "ComfyUI-SafetyChecker" ]; then
    git clone https://github.com/pydn/ComfyUI-SafetyChecker
    echo "✅ SafetyChecker installed"
else
    echo "⚠️ SafetyChecker already exists, skipping..."
fi

# Background removal for clean assets
echo "🎨 Installing BRIA AI Background Removal..."
if [ ! -d "ComfyUI-BRIA_AI-RMBG" ]; then
    git clone https://github.com/ZHO-ZHO-ZHO/ComfyUI-BRIA_AI-RMBG
    echo "✅ Background removal installed"
else
    echo "⚠️ Background removal already exists, skipping..."
fi

# Performance optimization
echo "⚡ Installing TensorRT acceleration..."
if [ ! -d "ComfyUI_TensorRT" ]; then
    git clone https://github.com/comfyanonymous/ComfyUI_TensorRT
    echo "✅ TensorRT installed"
else
    echo "⚠️ TensorRT already exists, skipping..."
fi

echo ""
echo "📦 Phase 2: Core Functionality Modules"
echo "======================================"

# Easy workflows for quick asset creation
echo "💻 Installing Easy-Use for UI/UX workflows..."
if [ ! -d "ComfyUI-Easy-Use" ]; then
    git clone https://github.com/yolain/ComfyUI-Easy-Use
    echo "✅ Easy-Use installed"
else
    echo "⚠️ Easy-Use already exists, skipping..."
fi

# Advanced workflow tools
echo "🔧 Installing Inspire Pack..."
if [ ! -d "ComfyUI-Inspire-Pack" ]; then
    git clone https://github.com/ltdrdata/ComfyUI-Inspire-Pack
    echo "✅ Inspire Pack installed"
else
    echo "⚠️ Inspire Pack already exists, skipping..."
fi

# Image enhancement and processing
echo "🖼️ Installing Impact Pack..."
if [ ! -d "ComfyUI-Impact-Pack" ]; then
    git clone https://github.com/ltdrdata/ComfyUI-Impact-Pack
    echo "✅ Impact Pack installed"
else
    echo "⚠️ Impact Pack already exists, skipping..."
fi

echo ""
echo "📦 Phase 3: Character & Asset Specialized Modules"
echo "================================================"

# Face consistency for characters
echo "👤 Installing ReActor for character consistency..."
if [ ! -d "comfyui-reactor-node" ]; then
    git clone https://github.com/Gourieff/comfyui-reactor-node
    echo "✅ ReActor installed"
else
    echo "⚠️ ReActor already exists, skipping..."
fi

# Vector conversion for scalable assets
echo "📐 Installing Vectorize for scalable assets..."
if [ ! -d "ComfyUI-Vectorize" ]; then
    git clone https://github.com/kijai/ComfyUI-Vectorize
    echo "✅ Vectorize installed"
else
    echo "⚠️ Vectorize already exists, skipping..."
fi

echo ""
echo "🔧 Installing Dependencies..."
echo "============================"

# Install Python dependencies for the modules
pip install -r ComfyUI-SafetyChecker/requirements.txt 2>/dev/null || echo "⚠️ SafetyChecker requirements not found"
pip install -r ComfyUI-BRIA_AI-RMBG/requirements.txt 2>/dev/null || echo "⚠️ BRIA requirements not found"
pip install -r ComfyUI-Easy-Use/requirements.txt 2>/dev/null || echo "⚠️ Easy-Use requirements not found"
pip install -r ComfyUI-Inspire-Pack/requirements.txt 2>/dev/null || echo "⚠️ Inspire Pack requirements not found"
pip install -r ComfyUI-Impact-Pack/requirements.txt 2>/dev/null || echo "⚠️ Impact Pack requirements not found"
pip install -r comfyui-reactor-node/requirements.txt 2>/dev/null || echo "⚠️ ReActor requirements not found"

echo ""
echo "📋 Manual Installation Required"
echo "==============================="
echo "Please install these modules manually through ComfyUI Manager:"
echo ""
echo "🔍 Search for these in ComfyUI Manager:"
echo "  - 'Memory Efficient Attention' (Essential for 6GB VRAM)"
echo "  - 'Style Aligned' (Consistent styling)"
echo "  - 'Content Filter' (Additional safety)"
echo "  - 'Face Analysis' (Character enhancement)"
echo "  - 'Batch Processor' (UI asset batching)"
echo "  - 'Size Optimizer' (Web optimization)"
echo "  - 'Low VRAM' (Memory optimization)"
echo ""

echo "✅ Installation Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Restart ComfyUI to load new modules"
echo "2. Install remaining modules through ComfyUI Manager"
echo "3. Configure RTX 3050 optimization settings"
echo "4. Test kid-friendly character generation"
echo "5. Test UI/UX asset creation workflows"
echo ""
echo "📖 For detailed usage instructions, see:"
echo "   COMFYUI_PERFORMANCE_MODULES_GUIDE.md"
echo ""
echo "🎯 Your setup is now optimized for:"
echo "   🛡️ Family-safe content generation"
echo "   💻 Web-ready UI/UX assets" 
echo "   👤 Photorealistic character creation"
echo "   ⚡ RTX 3050 performance optimization"