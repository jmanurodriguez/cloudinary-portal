import { CloudinaryFolder, CloudinaryFile } from '@/types';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface SignUploadResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  resource_type: string;
}

/**
 * Obtiene la lista de carpetas disponibles en Cloudinary
 */
export const getFolders = async (): Promise<CloudinaryFolder[]> => {
  try {
    const response = await fetch('/api/folders');
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error || 'Error al obtener carpetas');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error de conexión al servidor');
  }
};

/**
 * Obtiene todos los archivos de una carpeta específica
 */
export const getFolderFiles = async (folderName: string): Promise<CloudinaryFile[]> => {
  try {
    const response = await fetch(`/api/folders/${folderName}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error || 'Error al obtener archivos');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error de conexión al servidor');
  }
};

/**
 * Obtiene una firma segura para subir archivos
 */
export const getUploadSignature = async (folder: string): Promise<SignUploadResponse> => {
  try {
    const response = await fetch('/api/sign-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder, resource_type: 'auto' }),
    });
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error || 'Error al obtener firma de subida');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error de conexión al servidor');
  }
};

/**
 * Sube un archivo a Cloudinary
 */
export const uploadFileToCloudinary = async (
  file: File,
  signatureData: SignUploadResponse,
  onProgress?: (progress: UploadProgress) => void
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', signatureData.timestamp.toString());
  formData.append('folder', signatureData.folder);
  formData.append('signature', signatureData.signature);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded * 100) / e.total)
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Error al subir archivo a Cloudinary'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Error al subir archivo a Cloudinary'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/upload`);
    xhr.send(formData);
  });
};

/**
 * Crea una nueva carpeta
 */
export const createFolder = async (name: string, authToken: string): Promise<CloudinaryFolder> => {
  try {
    const response = await fetch('/api/create-folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ name }),
    });
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error || 'Error al crear carpeta');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error de conexión al servidor');
  }
};

/**
 * Elimina una carpeta
 */
export const deleteFolder = async (folderName: string, authToken: string): Promise<void> => {
  try {
    const response = await fetch(`/api/folders/${folderName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al eliminar carpeta');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error de conexión al servidor');
  }
};

/**
 * Elimina un archivo individual
 */
export const deleteFile = async (publicId: string, authToken: string): Promise<void> => {
  try {
    const encodedPublicId = encodeURIComponent(publicId);
    
    const response = await fetch(`/api/files/${encodedPublicId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al eliminar archivo');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Error de conexión al servidor');
  }
};
