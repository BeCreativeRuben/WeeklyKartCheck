@echo off
echo Starting Kart Check System...
echo.
echo This will start a local web server for testing.
echo The system will open in your default browser.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

python server.py

echo.
echo Server stopped. Press any key to exit...
pause >nul
