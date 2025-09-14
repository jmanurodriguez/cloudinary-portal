@echo off
echo 🚀 Iniciando servidores del Portal de Cloudinary...
echo ================================================

echo Iniciando backend en puerto 3001...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Iniciando frontend en puerto 5173...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servidores iniciados!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3001
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul