export function isUserAdmin(email: string | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  return adminEmails.includes(email);
}

export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development';
}
