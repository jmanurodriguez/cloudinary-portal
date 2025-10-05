import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { isUserAdmin } from '@/lib/clerk';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folderName: string }> }
) {
  try {
    const { folderName } = await params;

    if (!folderName) {
      return NextResponse.json(
        { success: false, error: 'Nombre de carpeta inválido' },
        { status: 400 }
      );
    }

    // Obtener recursos de la carpeta (imágenes y videos)
    const imageResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folderName}/`,
      max_results: 500,
      resource_type: 'image'
    });

    // Obtener recursos de tipo raw (documentos, PDFs, etc.)
    const rawResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folderName}/`,
      max_results: 500,
      resource_type: 'raw'
    });

    // Combinar y formatear todos los recursos con URLs firmadas
    const allFiles = [
      ...imageResources.resources.map((file: any) => {
        // Generar URL firmada para el archivo
        const signedUrl = cloudinary.url(file.public_id, {
          resource_type: 'image',
          type: file.type,
          sign_url: true,
          secure: true
        });
        
        return {
          public_id: file.public_id,
          url: signedUrl,
          format: file.format,
          resource_type: file.resource_type,
          type: file.type,
          created_at: file.created_at,
          bytes: file.bytes,
          width: file.width,
          height: file.height,
          folder: file.folder,
          filename: file.public_id.split('/').pop()
        };
      }),
      ...rawResources.resources.map((file: any) => {
        // Generar URL firmada para archivos raw
        const signedUrl = cloudinary.url(file.public_id, {
          resource_type: 'raw',
          type: file.type,
          sign_url: true,
          secure: true
        });
        
        return {
          public_id: file.public_id,
          url: signedUrl,
          format: file.format,
          resource_type: file.resource_type,
          type: file.type,
          created_at: file.created_at,
          bytes: file.bytes,
          folder: file.folder,
          filename: file.public_id.split('/').pop()
        };
      })
    ];

    // Ordenar por fecha de creación (más reciente primero)
    allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: allFiles,
      message: `Se encontraron ${allFiles.length} archivos en la carpeta ${folderName}`
    });

  } catch (error: any) {
    console.error('Error al obtener archivos:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los archivos de la carpeta',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folderName: string }> }
) {
  try {
    const { folderName } = await params;
    const { userId } = await auth();

    // Verificar autenticación
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener usuario actual de Clerk
    const { currentUser } = await import('@clerk/nextjs/server');
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    // Verificar que sea admin
    if (!isUserAdmin(email)) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos de administrador' },
        { status: 403 }
      );
    }

    if (!folderName) {
      return NextResponse.json(
        { success: false, error: 'Nombre de carpeta inválido' },
        { status: 400 }
      );
    }

    // Eliminar la carpeta y todo su contenido
    await cloudinary.api.delete_resources_by_prefix(`${folderName}/`);
    await cloudinary.api.delete_folder(folderName);

    return NextResponse.json({
      success: true,
      message: `Carpeta ${folderName} eliminada exitosamente`
    });

  } catch (error: any) {
    console.error('Error al eliminar carpeta:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar la carpeta',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
