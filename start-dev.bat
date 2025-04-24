@echo off
echo 🚀 Starting FitBestie dev environment...

start cmd /k "cd Client-React\app && npm start"
start cmd /k "cd Server-node && npm run dev"

echo ✅ All started!
pause