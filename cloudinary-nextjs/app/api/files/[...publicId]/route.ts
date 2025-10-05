import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { isUserAdmin } from '@/lib/clerk';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string[] }> }
) {
  try {
    const { publicId } = await params;
    const decodedPublicId = decodeURIComponent(publicId.join('/'));
    
    const { userId } = await auth();

    // Verificar autenticación
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener usuario actual de Clerk
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    // Verificar que sea admin
    if (!isUserAdmin(email)) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos de administrador' },
        { status: 403 }
      );
    }

    if (!decodedPublicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID inválido' },
        { status: 400 }
      );
    }

    // Intentar eliminar como imagen primero
    try {
      await cloudinary.uploader.destroy(decodedPublicId, {
        resource_type: 'image'
      });
    } catch (imageError) {
      // Si falla, intentar como raw (documentos, PDFs, etc.)
      await cloudinary.uploader.destroy(decodedPublicId, {
        resource_type: 'raw'
      });
    }

    return NextResponse.json({
      success: true,
      message: `Archivo eliminado exitosamente`
    });

  } catch (error: any) {
    console.error('Error al eliminar archivo:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar el archivo',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
