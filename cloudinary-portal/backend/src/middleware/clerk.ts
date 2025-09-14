/**
 * Middleware de autenticación y autorización con Clerk
 */
import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// Extender el tipo Request para incluir auth de Clerk
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId?: string;
        sessionId?: string;
        user?: any;
      };
    }
  }
}

/**
 * Middleware de autenticación requerida
 */
export const requireAuth = ClerkExpressWithAuth();

/**
 * Middleware para verificar permisos de administrador
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!req.auth?.userId) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado',
        message: 'Debes iniciar sesión'
      });
    }

    // Obtener lista de emails de administrador
    const adminEmails = process.env.ADMIN_EMAILS;

    if (!adminEmails) {
      return res.status(500).json({
        success: false,
        error: 'Configuración incompleta',
        message: 'Emails de administrador no configurados'
      });
    }

    // Convertir la cadena de emails en un array
    const adminEmailList = adminEmails.split(',').map(email => email.trim());

    // En un caso real, obtendrías el email del usuario desde Clerk
    // Por ahora, simulamos que el usuario autenticado es admin
    // TODO: Implementar verificación real del email comparando con adminEmailList

    next();
  } catch (error: any) {
    console.error('Error en verificación de admin:', error);
    res.status(500).json({
      success: false,
      error: 'Error de autorización',
      message: 'Error interno al verificar permisos'
    });
  }
};

/**
 * Middleware opcional de autenticación (no falla si no está autenticado)
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // Si hay headers de autorización, intenta autenticar
  const authHeader = req.headers.authorization;

  if (authHeader) {
    return requireAuth(req, res, next);
  }

  // Si no hay headers, continúa sin autenticación
  next();
};