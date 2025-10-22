import { createMiddleware } from 'hono/factory';
import { getSignedCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { UserEntity } from './entities';
import type { Env } from './core-utils';
// This secret should be a securely generated and stored value in a real application.
// For this project's constraints, we define it here.
const COOKIE_SECRET = 'a-very-secret-and-secure-string-for-clarity-journal';
const COOKIE_NAME = 'clarity_session';
type AuthVariables = {
  userId?: string;
};
export const authMiddleware = createMiddleware<{ Bindings: Env, Variables: AuthVariables }>(async (c, next) => {
  const cookie = await getSignedCookie(c, COOKIE_SECRET, COOKIE_NAME);
  if (!cookie) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  const user = new UserEntity(c.env, cookie);
  if (!(await user.exists())) {
    deleteCookie(c, COOKIE_NAME);
    return c.json({ success: false, error: 'Unauthorized: User not found' }, 401);
  }
  c.set('userId', cookie);
  await next();
});
export async function createSession(c: any, userId: string) {
  await setSignedCookie(c, COOKIE_NAME, userId, COOKIE_SECRET, {
    path: '/',
    httpOnly: true,
    secure: c.req.url.startsWith('https://'),
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
export function clearSession(c: any) {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
}