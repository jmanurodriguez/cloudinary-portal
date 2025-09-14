@echo off
echo 🚀 Instalando Portal de Cloudinary...
echo ====================================

echo 📦 Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando backend
    pause
    exit /b 1
)

echo 📦 Instalando dependencias del frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando frontend
    pause
    exit /b 1
)

cd ..
echo ✅ ¡Instalación completada!
echo.
echo 📝 SIGUIENTE PASO:
echo 1. Edita backend\.env y agrega tu CLOUDINARY_API_SECRET
echo 2. Ejecuta start-servers.bat para iniciar la aplicación
echo.
pause