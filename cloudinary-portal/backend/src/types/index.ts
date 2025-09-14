// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipo para las carpetas de Cloudinary
export interface CloudinaryFolder {
  name: string;
  path: string;
}

// Tipo para la petición de firma de subida
export interface SignUploadRequest {
  folder: string;
  resource_type?: string;
}

// Tipo para la respuesta de firma de subida
export interface SignUploadResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder: string;
}