@echo off
cd /d "C:\Users\biges\ComfyUI"
python main.py --listen --port 8188 --enable-cors-header "*"
pause