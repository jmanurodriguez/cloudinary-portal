# ☁️ Cloudvault

<div align="center">

![Cloudvault](https://img.shields.io/badge/Cloudvault-0EA5E9?style=for-the-badge&logo=icloud&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

**Gestión inteligente de archivos en la nube con seguridad empresarial**

[Demo en vivo](https://cloudvault.vercel.app) • [Características](#-características) • [Instalación](#-instalación)

</div>

---

## 🚀 Características

### 📁 Gestión de Carpetas
- ✅ Crear carpetas personalizadas
- ✅ Organizar archivos por categorías  
- ✅ Eliminar carpetas (solo administradores)
- ✅ Navegación intuitiva con breadcrumbs

### 📤 Subida de Archivos
- ✅ Drag & drop interface
- ✅ Múltiples archivos simultáneos
- ✅ Validación de tamaño (10MB máx)
- ✅ Barra de progreso en tiempo real
- ✅ Soporte para imágenes y PDFs

### 🔒 Seguridad
- ✅ Autenticación con Clerk
- ✅ Sistema de roles (Admin/Usuario)
- ✅ Protección de rutas con middleware
- ✅ Almacenamiento seguro en Cloudinary
- ✅ Modo desarrollo bypass para testing local

### 🎨 Diseño
- ✅ UI minimalista y moderna
- ✅ Animaciones fluidas con Framer Motion
- ✅ Responsive design (mobile-first)
- ✅ Glassmorphism effects
- ✅ Gradientes dinámicos
- ✅ Microinteracciones profesionales

### ⚡ Performance & SEO
- ✅ Next.js 15 con App Router
- ✅ Server Components
- ✅ Optimización de imágenes
- ✅ SEO completo (Open Graph, Twitter Cards)
- ✅ Turbopack para desarrollo rápido
- ✅ Sitemap.xml y robots.txt
- ✅ PWA ready (manifest.json)

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15.5.4
- **Language:** TypeScript
- **Styling:** TailwindCSS 3.4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono

### Backend
- **API:** Next.js API Routes
- **Storage:** Cloudinary API
- **Authentication:** Clerk
- **Runtime:** Node.js 18+

### DevOps
- **Hosting:** Vercel
- **Environment:** .env.local
- **Build:** Turbopack (dev) / Webpack (prod)

---

## 📦 Instalación

### Prerrequisitos

```bash
Node.js 18+
npm, pnpm o yarn
```

### 1. Clonar el repositorio

```bash
git clone https://github.com/jmanurodriguez/cloudinary-portal.git
cd cloudinary-portal/cloudinary-nextjs
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edita con tus credenciales:

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name

# Admin Emails (separados por comas)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚀 Deploy en Vercel

### 1. Push a GitHub

```bash
git add .
git commit -m "feat: Initial Cloudvault setup"
git push origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Importa tu repositorio
4. Configura **Root Directory:** `cloudinary-nextjs`
5. Agrega las variables de entorno (las mismas de `.env.local`)
6. **IMPORTANTE:** Actualiza `NEXT_PUBLIC_APP_URL` con tu dominio de Vercel

### 3. Deploy

Click en "Deploy" y espera el build. ¡Listo! 🎉

---

## 🔐 Configuración de Clerk

1. Crea una cuenta en [clerk.com](https://clerk.com)
2. Crea una nueva aplicación
3. Copia las keys:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`
4. En **Settings → Domains**, agrega:
   - `localhost:3000` (desarrollo)
   - Tu dominio de Vercel (producción)
5. Configura emails templates en **Customization** (opcional)

---

## ☁️ Configuración de Cloudinary

1. Crea una cuenta en [cloudinary.com](https://cloudinary.com)
2. Ve a **Dashboard → Settings → Account**
3. Copia tus credenciales:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`  
   - **API Secret** → `CLOUDINARY_API_SECRET`
4. En **Settings → Upload**, puedes configurar:
   - Upload presets
   - Folder structure
   - File size limits

---

## 📚 Estructura del Proyecto

```
cloudinary-nextjs/
├── app/
│   ├── api/                    # API Routes
│   │   ├── folders/           # Gestión de carpetas
│   │   ├── files/             # Gestión de archivos
│   │   ├── sign-upload/       # Firma de subida
│   │   └── create-folder/     # Crear carpeta
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página principal
│   ├── sitemap.ts             # Sitemap SEO
│   └── globals.css            # Estilos globales
├── components/
│   ├── FolderCard.tsx         # Card de carpeta
│   ├── FolderList.tsx         # Lista de carpetas
│   ├── FileGallery.tsx        # Galería de archivos
│   ├── UploadModal.tsx        # Modal de subida
│   ├── CreateFolderModal.tsx  # Modal crear carpeta
│   └── AnimatedCard.tsx       # Componente animado
├── lib/
│   ├── api.ts                 # Cliente API
│   └── clerk.ts               # Utilidades Clerk
├── types/
│   ├── index.ts               # Tipos TypeScript
│   └── components.d.ts        # Declaraciones
├── public/
│   ├── robots.txt             # SEO
│   └── manifest.json          # PWA
├── middleware.ts              # Middleware Clerk
├── .env.local                 # Variables (no commit)
└── README.md                  # Este archivo
```

---

## 🎯 Uso

### Como Usuario

1. **Iniciar sesión** con Clerk
2. **Seleccionar carpeta** existente
3. **Subir archivos** con drag & drop
4. **Descargar** o **visualizar** archivos
5. **Eliminar archivos** individualmente

### Como Administrador

Todo lo de usuario, más:

6. **Crear nuevas carpetas**
7. **Eliminar carpetas** completas
8. **Gestión total** del sistema

### Modo Desarrollo

En `localhost:3000`, el modo desarrollo está activo:
- ✅ No requiere autenticación
- ✅ Badge "Dev Mode" visible
- ✅ Todas las acciones de admin habilitadas

---

## 🎨 Personalización

### Colores

Edita `tailwind.config.ts` para cambiar el tema:

```js
theme: {
  extend: {
    colors: {
      primary: '#0ea5e9', // Tu color principal
      secondary: '#6366f1',
    }
  }
}
```

### Animaciones

Las animaciones están en los componentes con Framer Motion:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/components/...'"

**Solución:** Reinicia el TypeScript Server
```
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Error: Clerk authentication not working

**Solución:**
1. Verifica que las keys en `.env.local` sean correctas
2. Revisa que el dominio esté agregado en Clerk Dashboard
3. Limpia cache: `rm -rf .next && npm run dev`

### Error: Cloudinary upload failed

**Solución:**
1. Verifica las credenciales de Cloudinary
2. Revisa que el tamaño del archivo sea < 10MB
3. Chequea los logs de la API en `/api/sign-upload`

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Manuel Rodriguez**

- GitHub: [@jmanurodriguez](https://github.com/jmanurodriguez)
- Email: cuenta.manuxs@gmail.com

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org) - El framework React para producción
- [Clerk](https://clerk.com) - Autenticación sin esfuerzo
- [Cloudinary](https://cloudinary.com) - Almacenamiento y transformación de medios
- [Vercel](https://vercel.com) - Hosting y deployment
- [Framer Motion](https://www.framer.com/motion/) - Animaciones profesionales
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS

---

<div align="center">

**⭐ Si te gusta Cloudvault, dale una estrella! ⭐**

Made with ❤️ and ☕ by the Cloudvault Team

[⬆ Volver arriba](#️-cloudvault)

</div>
