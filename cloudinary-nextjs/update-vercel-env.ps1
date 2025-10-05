# Script para actualizar variables de entorno en Vercel

Write-Host "🚀 Actualizando variables de entorno en Vercel..." -ForegroundColor Cyan

# Cambiar al directorio del proyecto
cd "c:\Users\USUARIO\Desktop\Manu Proyectos\Cloudinary\cloudinary-nextjs"

# Variables que necesitamos agregar/actualizar
$envVars = @{
    "CLOUDINARY_CLOUD_NAME" = "dpcpcnqmq"
    "CLOUDINARY_API_KEY" = "697776761719538"
    "CLOUDINARY_API_SECRET" = "LIvQbCcz4D8vw2w_nrTitutYXW0"
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" = "dpcpcnqmq"
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" = "pk_test_dXB3YXJkLWd1cHB5LTk5LmNsZXJrLmFjY291bnRzLmRldiQ"
    "CLERK_SECRET_KEY" = "sk_test_69yKGckBGj6jNae0iLegP85WAhhguFOx5i8sUv3w4j"
    "ADMIN_EMAILS" = "cuenta.manuxs@gmail.com,manuxs.rodriguez@gmail.com"
    "NEXT_PUBLIC_APP_URL" = "https://cloudinary-portal-378e.vercel.app"
}

Write-Host "📝 Variables a configurar:" -ForegroundColor Yellow
$envVars.Keys | ForEach-Object { Write-Host "  - $_" }

Write-Host "`n✨ Por favor, ve a Vercel Dashboard y:" -ForegroundColor Green
Write-Host "1. Settings → Environment Variables" -ForegroundColor White
Write-Host "2. Para cada variable que solo esté en 'Production':" -ForegroundColor White
Write-Host "   - Click en los 3 puntos (⋯) → Remove" -ForegroundColor White
Write-Host "   - Add Environment Variable de nuevo" -ForegroundColor White
Write-Host "   - Marca: Production, Preview, Development" -ForegroundColor White
Write-Host "3. Después: Deployments → Redeploy (sin cache)" -ForegroundColor White

Write-Host "`n🎯 O usa esta solución más rápida:" -ForegroundColor Cyan
Write-Host "Ve a tu proyecto en Vercel → Settings → Environment Variables" -ForegroundColor White
Write-Host "Click en 'Import .env' y pega el contenido de .env.local" -ForegroundColor White

Read-Host "`nPresiona Enter para abrir el archivo .env.local"
notepad .env.local
