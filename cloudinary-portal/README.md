# 🌥️ Cloudinary Portal

Portal web moderno para gestión de archivos con autenticación segura y panel de administración.

## ✨ Características

- 🔐 **Autenticación**: Sistema completo con Clerk (login/registro)
- 👑 **Panel Admin**: CRUD de carpetas (crear/eliminar) solo para administradores
- 📁 **Gestión de Carpetas**: Organización visual de archivos
- ⬆️ **Subida Segura**: Upload directo a Cloudinary con firmas seguras
- 📱 **Responsive**: Diseño adaptable mobile-first
- 🎨 **UI Moderna**: Interfaz con backdrop-blur y gradientes
- ⚡ **Performance**: Frontend React + Vite, Backend Node.js

## 🚀 Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Clerk** para autenticación
- **Lucide React** para iconos

### Backend
- **Node.js** + Express
- **TypeScript** para tipado
- **Clerk SDK** para auth
- **Cloudinary API** para archivos

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- Cuenta en [Cloudinary](https://cloudinary.com/)
- Cuenta en [Clerk](https://clerk.com/)

### 1. Clonar repositorio
```bash
git clone https://github.com/jmanurodriguez/cloudinary-portal.git
cd cloudinary-portal
```

### 2. Instalar dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Configurar variables de entorno

**Backend (.env):**
```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Servidor
PORT=3003
NODE_ENV=development
FRONTEND_URL=http://localhost:5175

# Clerk
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Administradores (emails separados por comas)
ADMIN_EMAILS=admin@ejemplo.com,otro@ejemplo.com
```

**Frontend (.env.local):**
```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# API
VITE_API_URL=http://localhost:3003

# Administradores
VITE_ADMIN_EMAILS=admin@ejemplo.com,otro@ejemplo.com
```

### 4. Ejecutar en desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5175
- Backend: http://localhost:3003

## 🔧 Configuración

### Cloudinary Setup
1. Crear cuenta en [Cloudinary](https://cloudinary.com/)
2. Obtener credenciales del Dashboard
3. Configurar variables de entorno

### Clerk Setup
1. Crear aplicación en [Clerk](https://clerk.com/)
2. Configurar providers de autenticación
3. Obtener las claves API
4. Configurar dominios permitidos

### Administradores
Los emails de administrador se configuran en las variables de entorno:
- Pueden crear y eliminar carpetas
- Acceso completo al panel admin
- Múltiples admins soportados

## 📁 Estructura del Proyecto

```
cloudinary-portal/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuración Cloudinary
│   │   ├── middleware/     # Auth Clerk + validación
│   │   ├── routes/         # Endpoints API
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   └── package.json
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── lib/           # Configuración Clerk
│   │   ├── services/      # API calls
│   │   └── types/         # Tipos compartidos
│   └── package.json
└── README.md
```

## 🔐 Autenticación y Seguridad

- **JWT Tokens**: Manejo seguro con Clerk
- **Firmas Cloudinary**: Upload con signatures del backend
- **Middleware Protegido**: Rutas admin con validación
- **CORS Configurado**: Solo orígenes permitidos
- **Variables de Entorno**: Credenciales fuera del código

## 🎨 Características de UI

- **Design System**: Colores consistentes y spacing
- **Animations**: Transiciones suaves y hover effects
- **Loading States**: Feedback visual en operaciones
- **Error Handling**: Mensajes de error amigables
- **Modal System**: Overlays para acciones importantes

## 🚀 Deploy

### Vercel (Recomendado)
1. Fork el repositorio
2. Conectar con Vercel
3. Configurar variables de entorno
4. Deploy automático

### Variables de entorno en producción
- Actualizar URLs de desarrollo a producción
- Configurar CORS para dominio real
- Ajustar configuración de Clerk

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Manuel Rodriguez** - [@jmanurodriguez](https://github.com/jmanurodriguez)

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación
2. Busca en Issues existentes
3. Crea un nuevo Issue con detalles

---

⭐ **¡Dale una estrella si te gustó el proyecto!**

