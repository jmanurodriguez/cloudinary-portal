import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folder, resource_type = 'auto' } = body;

    // Validar que se proporcione la carpeta
    if (!folder) {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre de carpeta es requerido'
        },
        { status: 400 }
      );
    }

    // Debug: Verificar que las variables existan
    console.log('Environment check:', {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });

    // Generar timestamp y firma para upload seguro
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        resource_type
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
        resource_type
      },
      message: 'Firma generada exitosamente'
    });

  } catch (error: any) {
    console.error('Error al generar firma:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al generar la firma de subida',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
