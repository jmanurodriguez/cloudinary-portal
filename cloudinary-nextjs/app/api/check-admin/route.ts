import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { isUserAdmin } from '@/lib/clerk';

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        isAdmin: false,
        message: 'No autenticado'
      });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const admin = isUserAdmin(email);

    return NextResponse.json({
      success: true,
      isAdmin: admin,
      email: email,
      message: admin ? 'Usuario es administrador' : 'Usuario no es administrador'
    });

  } catch (error: any) {
    console.error('Error al verificar admin:', error);

    return NextResponse.json(
      {
        success: false,
        isAdmin: false,
        error: 'Error al verificar permisos',
        message: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
