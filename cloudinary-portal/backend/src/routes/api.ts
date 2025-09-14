import express from 'express';
import cloudinary from '../config/cloudinary';
import {
  ApiResponse,
  CloudinaryFolder,
  SignUploadRequest,
  SignUploadResponse
} from '../types';
import { isValidFolderName, validateCloudinaryFolder } from '../utils/validation';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/clerk';

const router = express.Router();

/**
 * GET /api/folders
 * Obtiene la lista de carpetas de primer nivel en Cloudinary
 */
router.get('/folders', async (req, res) => {
  try {
    // Buscar todas las carpetas en la raíz de la cuenta
    const result = await cloudinary.api.root_folders();

    const folders: CloudinaryFolder[] = result.folders
      .filter(validateCloudinaryFolder)
      .map((folder: any) => ({
        name: folder.name,
        path: folder.path
      }));

    const response: ApiResponse<CloudinaryFolder[]> = {
      success: true,
      data: folders,
      message: `Se encontraron ${folders.length} carpetas`
    };

    res.json(response);

  } catch (error: any) {
    console.error('Error al obtener carpetas:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Error al obtener la lista de carpetas',
      message: error.message || 'Error interno del servidor'
    };

    res.status(500).json(response);
  }
});

/**
 * POST /api/sign-upload
 * Genera una firma segura para la subida de archivos
 */
router.post('/sign-upload', async (req, res) => {
  try {
    const { folder, resource_type = 'auto' }: SignUploadRequest = req.body;

    // Validar que se proporcione la carpeta y sea válida
    if (!folder || !isValidFolderName(folder)) {
      const response: ApiResponse = {
        success: false,
        error: 'El nombre de carpeta es requerido y debe contener solo letras, números, guiones y guiones bajos'
      };
      return res.status(400).json(response);
    }

    // Generar timestamp actual
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Parámetros para la firma (IMPORTANTE: mantener el mismo orden)
    const params = {
      folder,
      timestamp,
    };

    // Generar la firma usando el API Secret (solo disponible en el backend)
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    const response: ApiResponse<SignUploadResponse> = {
      success: true,
      data: {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY!,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        folder
      },
      message: 'Firma generada correctamente'
    };

    res.json(response);

  } catch (error: any) {
    console.error('Error al generar firma:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Error al generar la firma de subida',
      message: error.message || 'Error interno del servidor'
    };

    res.status(500).json(response);
  }
});

/**
 * POST /api/folders
 * Crea una nueva carpeta en Cloudinary (solo administradores)
 */
router.post('/folders', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    // Validar nombre de carpeta
    if (!name || !isValidFolderName(name)) {
      return res.status(400).json({
        success: false,
        error: 'Nombre de carpeta inválido',
        message: 'El nombre debe contener solo letras, números, guiones y guiones bajos (máximo 100 caracteres)'
      });
    }

    // Crear la carpeta mediante la subida de un archivo temporal
    // En Cloudinary, las carpetas se crean automáticamente al subir archivos
    const tempFileResult = await cloudinary.uploader.upload(
      'data:text/plain;base64,VGVtcG9yYXJ5IGZpbGU=', // "Temporary file" en base64
      {
        folder: name,
        public_id: 'temp_folder_creation',
        resource_type: 'raw'
      }
    );

    // Eliminar el archivo temporal inmediatamente
    await cloudinary.uploader.destroy(tempFileResult.public_id, {
      resource_type: 'raw'
    });

    const response: ApiResponse<CloudinaryFolder> = {
      success: true,
      data: {
        name,
        path: name
      },
      message: `Carpeta '${name}' creada exitosamente`
    };

    res.json(response);

  } catch (error: any) {
    console.error('Error al crear carpeta:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Error al crear la carpeta',
      message: error.message || 'Error interno del servidor'
    };

    res.status(500).json(response);
  }
});

/**
 * DELETE /api/folders/:folderName
 * Elimina una carpeta de Cloudinary (solo administradores)
 */
router.delete('/folders/:folderName', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { folderName } = req.params;

    // Validar nombre de carpeta
    if (!folderName || !isValidFolderName(folderName)) {
      return res.status(400).json({
        success: false,
        error: 'Nombre de carpeta inválido'
      });
    }

    // Verificar que la carpeta existe antes de eliminar
    try {
      await cloudinary.api.root_folders();
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'Carpeta no encontrada'
      });
    }

    // Eliminar todos los recursos en la carpeta
    const deleteResult = await cloudinary.api.delete_resources_by_prefix(folderName + '/');

    // Eliminar también los recursos de tipo 'raw' (documentos, etc.)
    await cloudinary.api.delete_resources_by_prefix(folderName + '/', {
      resource_type: 'raw'
    });

    // Eliminar la carpeta vacía
    await cloudinary.api.delete_folder(folderName);

    const response: ApiResponse = {
      success: true,
      message: `Carpeta '${folderName}' eliminada exitosamente (${deleteResult.deleted.length} archivos eliminados)`
    };

    res.json(response);

  } catch (error: any) {
    console.error('Error al eliminar carpeta:', error);

    // Manejar errores específicos de Cloudinary
    if (error.http_code === 404) {
      return res.status(404).json({
        success: false,
        error: 'Carpeta no encontrada',
        message: 'La carpeta especificada no existe'
      });
    }

    const response: ApiResponse = {
      success: false,
      error: 'Error al eliminar la carpeta',
      message: error.message || 'Error interno del servidor'
    };

    res.status(500).json(response);
  }
});

export default router;