import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { isUserAdmin } from '@/lib/clerk';

export async function GET() {
  try {
    console.log('🔍 check-admin: Iniciando verificación...');
    
    const user = await currentUser();
    console.log('👤 check-admin: Usuario obtenido:', user ? 'Sí' : 'No');

    if (!user) {
      return NextResponse.json({
        success: false,
        isAdmin: false,
        message: 'No autenticado'
      });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    console.log('📧 check-admin: Email del usuario:', email);
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    console.log('📋 check-admin: Admin emails configurados:', adminEmails);
    
    const admin = isUserAdmin(email);
    console.log('✅ check-admin: Es admin?', admin);

    return NextResponse.json({
      success: true,
      isAdmin: admin,
      email: email,
      adminEmails: adminEmails, // Debug: mostrar emails configurados
      message: admin ? 'Usuario es administrador' : 'Usuario no es administrador'
    });

  } catch (error: any) {
    console.error('❌ Error al verificar admin:', error);

    return NextResponse.json(
      {
        success: false,
        isAdmin: false,
        error: 'Error al verificar permisos',
        message: error.message || 'Error interno del servidor',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
