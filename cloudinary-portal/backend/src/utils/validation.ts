/**
 * Utilidades de validación para el backend
 */

// Tipos de archivos permitidos (MIME types)
export const ALLOWED_MIME_TYPES = [
  // Imágenes
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',

  // Documentos
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Texto
  'text/plain',
  'text/csv',
  'application/json',
  'application/xml',
  'text/xml',

  // Archivos
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed'
];

// Tamaño máximo de archivo (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Valida si un nombre de carpeta es seguro
 */
export const isValidFolderName = (folderName: string): boolean => {
  if (!folderName || typeof folderName !== 'string') {
    return false;
  }

  // Solo permitir letras, números, guiones y guiones bajos
  const validFolderRegex = /^[a-zA-Z0-9_-]+$/;
  return validFolderRegex.test(folderName) && folderName.length <= 100;
};

/**
 * Sanitiza un nombre de carpeta
 */
export const sanitizeFolderName = (folderName: string): string => {
  return folderName
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 100);
};

/**
 * Valida la estructura de la respuesta de Cloudinary
 */
export const validateCloudinaryFolder = (folder: any): boolean => {
  return (
    folder &&
    typeof folder.name === 'string' &&
    typeof folder.path === 'string' &&
    folder.name.length > 0
  );
};