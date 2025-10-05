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
