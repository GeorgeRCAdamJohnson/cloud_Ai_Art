@echo off
REM ComfyUI Performance Modules Installation Script (Windows)
REM Optimized for kid-friendly art, UI/UX assets, and photorealistic characters

echo 🚀 Starting ComfyUI Performance Modules Installation...
echo 📋 Optimized for: Kid-friendly art, UI/UX assets, photorealistic characters
echo 💻 Hardware: RTX 3050 6GB
echo.

REM Set ComfyUI path
set "COMFYUI_PATH=C:\Users\biges\ComfyUI"

REM Check if ComfyUI directory exists
if not exist "%COMFYUI_PATH%\custom_nodes" (
    echo ❌ ComfyUI directory not found at %COMFYUI_PATH%
    echo Please update the COMFYUI_PATH variable in this script.
    pause
    exit /b 1
)

echo 📂 Using ComfyUI installation at: %COMFYUI_PATH%
echo.

cd "%COMFYUI_PATH%\custom_nodes"

echo.
echo 📦 Phase 1: Essential Safety ^& Performance Modules
echo =================================================
echo.

REM Safety and content filtering
echo 🛡️ Installing ComfyUI-SafetyChecker...
if not exist "ComfyUI-SafetyChecker" (
    git clone https://github.com/pydn/ComfyUI-SafetyChecker
    echo ✅ SafetyChecker installed
) else (
    echo ⚠️ SafetyChecker already exists, skipping...
)

REM Background removal for clean assets
echo 🎨 Installing BRIA AI Background Removal...
if not exist "ComfyUI-BRIA_AI-RMBG" (
    git clone https://github.com/ZHO-ZHO-ZHO/ComfyUI-BRIA_AI-RMBG
    echo ✅ Background removal installed
) else (
    echo ⚠️ Background removal already exists, skipping...
)

REM Performance optimization
echo ⚡ Installing TensorRT acceleration...
if not exist "ComfyUI_TensorRT" (
    git clone https://github.com/comfyanonymous/ComfyUI_TensorRT
    echo ✅ TensorRT installed
) else (
    echo ⚠️ TensorRT already exists, skipping...
)

echo.
echo 📦 Phase 2: Core Functionality Modules
echo ======================================
echo.

REM Easy workflows for quick asset creation
echo 💻 Installing Easy-Use for UI/UX workflows...
if not exist "ComfyUI-Easy-Use" (
    git clone https://github.com/yolain/ComfyUI-Easy-Use
    echo ✅ Easy-Use installed
) else (
    echo ⚠️ Easy-Use already exists, skipping...
)

REM Advanced workflow tools
echo 🔧 Installing Inspire Pack...
if not exist "ComfyUI-Inspire-Pack" (
    git clone https://github.com/ltdrdata/ComfyUI-Inspire-Pack
    echo ✅ Inspire Pack installed
) else (
    echo ⚠️ Inspire Pack already exists, skipping...
)

REM Image enhancement and processing
echo 🖼️ Installing Impact Pack...
if not exist "ComfyUI-Impact-Pack" (
    git clone https://github.com/ltdrdata/ComfyUI-Impact-Pack
    echo ✅ Impact Pack installed
) else (
    echo ⚠️ Impact Pack already exists, skipping...
)

echo.
echo 📦 Phase 3: Character ^& Asset Specialized Modules
echo ================================================
echo.

REM Face consistency for characters
echo 👤 Installing ReActor for character consistency...
if not exist "comfyui-reactor-node" (
    git clone https://github.com/Gourieff/comfyui-reactor-node
    echo ✅ ReActor installed
) else (
    echo ⚠️ ReActor already exists, skipping...
)

REM Vector conversion for scalable assets
echo 📐 Installing Vectorize for scalable assets...
if not exist "ComfyUI-Vectorize" (
    git clone https://github.com/kijai/ComfyUI-Vectorize
    echo ✅ Vectorize installed
) else (
    echo ⚠️ Vectorize already exists, skipping...
)

echo.
echo 🔧 Installing Dependencies...
echo ============================
echo.

REM Install Python dependencies for the modules
if exist "ComfyUI-SafetyChecker\requirements.txt" (
    pip install -r ComfyUI-SafetyChecker\requirements.txt
) else (
    echo ⚠️ SafetyChecker requirements not found
)

if exist "ComfyUI-BRIA_AI-RMBG\requirements.txt" (
    pip install -r ComfyUI-BRIA_AI-RMBG\requirements.txt
) else (
    echo ⚠️ BRIA requirements not found
)

if exist "ComfyUI-Easy-Use\requirements.txt" (
    pip install -r ComfyUI-Easy-Use\requirements.txt
) else (
    echo ⚠️ Easy-Use requirements not found
)

if exist "ComfyUI-Inspire-Pack\requirements.txt" (
    pip install -r ComfyUI-Inspire-Pack\requirements.txt
) else (
    echo ⚠️ Inspire Pack requirements not found
)

if exist "ComfyUI-Impact-Pack\requirements.txt" (
    pip install -r ComfyUI-Impact-Pack\requirements.txt
) else (
    echo ⚠️ Impact Pack requirements not found
)

if exist "comfyui-reactor-node\requirements.txt" (
    pip install -r comfyui-reactor-node\requirements.txt
) else (
    echo ⚠️ ReActor requirements not found
)

echo.
echo 📋 REAL Modules to Install via ComfyUI Manager
echo ==============================================
echo Please install these REAL modules through ComfyUI Manager:
echo.
echo 🔍 Search for these ACTUAL modules in ComfyUI Manager:
echo   - 'Custom Scripts' (Memory optimization ^& tools)
echo   - 'WAS Node Suite' (Batch processing powerhouse)
echo   - 'IPAdapter Plus' (Character consistency)
echo   - 'NSFW Checker' (Content safety)
echo   - 'KJNodes' (Advanced workflows)
echo   - 'Image Filters' (Asset optimization)
echo   - 'Essentials' (Basic processing tools)
echo.
echo 💡 Pro Tip: Use --lowvram flag when starting ComfyUI:
echo    python main.py --lowvram --preview-method auto --force-fp16
echo.

echo ✅ Installation Complete!
echo.
echo 📝 Next Steps:
echo 1. Restart ComfyUI to load new modules
echo 2. Install remaining modules through ComfyUI Manager
echo 3. Configure RTX 3050 optimization settings
echo 4. Test kid-friendly character generation
echo 5. Test UI/UX asset creation workflows
echo.
echo 📖 For detailed usage instructions, see:
echo    COMFYUI_PERFORMANCE_MODULES_GUIDE.md
echo.
echo 🎯 Your setup is now optimized for:
echo    🛡️ Family-safe content generation
echo    💻 Web-ready UI/UX assets
echo    👤 Photorealistic character creation
echo    ⚡ RTX 3050 performance optimization
echo.

pause