export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
}

export function authDebug(message: string, meta?: Record<string, unknown>) {
  if (process.env.AUTH_DEBUG !== "true") return;

  console.log(`[auth] ${message}`, meta ?? {});
}
