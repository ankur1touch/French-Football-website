export function verifyCmsToken(authHeader: string | null): boolean {
  const token = process.env.CMS_API_TOKEN;
  if (!token) return true;
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === token;
}

export function cmsAuthRequired(): boolean {
  return Boolean(process.env.CMS_API_TOKEN);
}
