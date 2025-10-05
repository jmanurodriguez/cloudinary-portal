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

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { name } = body;

    if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre de carpeta debe contener solo letras, números, guiones y guiones bajos'
        },
        { status: 400 }
      );
    }

    // Crear la carpeta en Cloudinary
    await cloudinary.api.create_folder(name);

    return NextResponse.json({
      success: true,
      data: { name, path: name },
      message: `Carpeta ${name} creada exitosamente`
    });

  } catch (error: any) {
    console.error('Error al crear carpeta:', error);
    
    // Si la carpeta ya existe, devolver error específico
    if (error.error && error.error.message && error.error.message.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: 'La carpeta ya existe',
          message: 'Ya existe una carpeta con ese nombre'
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear la carpeta',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
