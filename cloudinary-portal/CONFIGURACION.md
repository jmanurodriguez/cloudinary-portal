# 🚀 Configuración del Portal de Cloudinary

Esta guía te ayudará a configurar y ejecutar tu aplicación de portal de carga de archivos con Cloudinary.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [NPM](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)
- Una cuenta de [Cloudinary](https://cloudinary.com/) (gratis)

## 🔧 Configuración Paso a Paso

### 1. Obtener Credenciales de Cloudinary

1. Ve a [Cloudinary](https://cloudinary.com/) y crea una cuenta gratuita
2. En el dashboard, encontrarás tus credenciales:
   - **Cloud Name** (nombre de la nube)
   - **API Key** (clave de API)
   - **API Secret** (secreto de API) ⚠️ **NUNCA lo compartas públicamente**

### 2. Configurar el Backend

1. Ve al directorio del backend:
   ```bash
   cd backend
   ```

2. Crea el archivo `.env` copiando el ejemplo:
   ```bash
   cp .env.example .env
   ```

3. Edita el archivo `.env` y completa tus credenciales:
   ```env
   # Puerto del servidor
   PORT=3001

   # URL del frontend para CORS
   FRONTEND_URL=http://localhost:5173

   # ⚠️ COMPLETA ESTAS CREDENCIALES CON LAS TUYAS
   CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
   CLOUDINARY_API_KEY=tu_api_key_aqui
   CLOUDINARY_API_SECRET=tu_api_secret_aqui

   # Entorno
   NODE_ENV=development
   ```

4. Instala las dependencias:
   ```bash
   npm install
   ```

### 3. Configurar el Frontend

1. Ve al directorio del frontend:
   ```bash
   cd ../frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### 4. Crear Carpetas en Cloudinary

**⚠️ IMPORTANTE:** Debes crear las carpetas directamente en el panel de Cloudinary:

1. Ve a tu [Dashboard de Cloudinary](https://cloudinary.com/console)
2. Haz clic en "Media Library" en el menú izquierdo
3. Crea las carpetas que necesites haciendo clic en "Create Folder"
4. Ejemplo de carpetas:
   - `documentos-legales`
   - `imagenes-productos`
   - `facturas`
   - `contratos`

## 🚀 Ejecutar la Aplicación

### Opción 1: Ejecutar Ambos Servicios Manualmente

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

### Opción 2: Usar el Script de Desarrollo (si está disponible)

```bash
npm run dev
```

## 🌐 Acceder a la Aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 🔒 Seguridad Implementada

✅ **Tu aplicación ya incluye estas medidas de seguridad:**

1. **API Secret protegido**: Nunca se expone al frontend
2. **Firmas de subida**: Cada subida requiere una firma única del backend
3. **Validación de carpetas**: Solo carpetas válidas son aceptadas
4. **CORS configurado**: Solo tu frontend puede acceder al backend
5. **Helmet**: Protección de cabeceras HTTP
6. **Validación de tipos**: Control de archivos permitidos

## 🛠️ Solución de Problemas

### Error: "Variables de entorno faltantes"
- ✅ Verifica que el archivo `.env` existe en `backend/`
- ✅ Completa todas las credenciales de Cloudinary
- ✅ Reinicia el servidor del backend

### Error: "No se encontraron carpetas"
- ✅ Crea carpetas en tu panel de Cloudinary
- ✅ Verifica que las credenciales son correctas
- ✅ Haz clic en "Actualizar" en la aplicación

### Error: "Error de conexión al servidor"
- ✅ Verifica que el backend esté ejecutándose en puerto 3001
- ✅ Revisa la configuración de CORS en el backend
- ✅ Verifica la URL en `frontend/src/services/api.ts`

### Error de subida de archivos
- ✅ Verifica que la carpeta existe en Cloudinary
- ✅ Comprueba que el archivo no supere el límite de tamaño
- ✅ Revisa los logs del backend para más detalles

## 📚 Estructura del Proyecto

```
cloudinary-portal/
├── backend/                # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/        # Configuración de Cloudinary
│   │   ├── routes/        # Rutas de la API
│   │   ├── types/         # Tipos TypeScript
│   │   ├── utils/         # Utilidades y validaciones
│   │   └── server.ts      # Punto de entrada
│   ├── .env.example       # Variables de entorno de ejemplo
│   └── package.json
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── App.tsx        # Componente principal
│   └── package.json
└── README.md
```

## ✨ Características

- 📁 **Gestión de carpetas**: Lista automática de carpetas de Cloudinary
- 📤 **Subida múltiple**: Selecciona varios archivos a la vez
- 📊 **Progreso en tiempo real**: Ve el progreso de cada archivo
- 🔐 **Seguridad robusta**: Firmas seguras para cada subida
- 📱 **Diseño responsivo**: Funciona en desktop y móvil
- 🎨 **UI moderna**: Interfaz limpia con Tailwind CSS

## 🎯 Próximos Pasos

Una vez que tu aplicación esté funcionando:

1. **Personaliza el diseño** según tus necesidades
2. **Agrega más validaciones** de archivos si es necesario
3. **Configura un dominio** para producción
4. **Considera implementar autenticación** para múltiples usuarios

¿Necesitas ayuda? Revisa los logs del servidor o contacta al administrador.