import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    // Debug: Log environment variables
    console.log('Environment variables check:', {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudinary credentials not configured',
          details: {
            hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
            hasApiKey: !!process.env.CLOUDINARY_API_KEY,
            hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
          }
        },
        { status: 500 }
      );
    }

    // Buscar todas las carpetas en la raíz de la cuenta
    const result = await cloudinary.api.root_folders();

    const folders = result.folders.map((folder: any) => ({
      name: folder.name,
      path: folder.path
    }));

    return NextResponse.json({
      success: true,
      data: folders,
      message: `Se encontraron ${folders.length} carpetas`
    });

  } catch (error: any) {
    console.error('Error al obtener carpetas:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener la lista de carpetas',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
