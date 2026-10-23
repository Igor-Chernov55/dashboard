import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import seed from '../mock/seed.json' with { type: 'json' };

const lifetime = 60 * 60;
const cookieName = 'dashboard_demo';
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('Set AUTH_SECRET (at least 32 characters)');
  return value;
}
const sign = value => createHmac('sha256', secret()).update(value).digest('base64url');
const publicUser = user => ({ id: user.id, name: user.name, email: user.email });
function issue(user) {
  const payload = Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + lifetime, nonce: randomUUID() })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
function verify(token) {
  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!Number.isFinite(data.exp) || data.exp <= Date.now() / 1000) return null;
    return seed.users.find(user => user.id === data.sub) ?? null;
  } catch { return null; }
}
function sessionCookie(token, age) {
  return `${cookieName}=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
}
export function createHandler(action) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const method = action === 'me' ? 'GET' : 'POST';
    if (req.method !== method) {
      res.setHeader('Allow', method);
      return res.status(405).json({ message: 'Method not allowed' });
    }
    try { secret(); } catch { return res.status(503).json({ message: 'Demo auth is not configured: set AUTH_SECRET on Vercel' }); }
    if (action === 'login') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ message: 'Invalid JSON' }); } }
      const user = seed.users.find(user => user.email === String(body?.email ?? '').trim().toLowerCase() && user.password === body?.password);
      if (!user) return res.status(401).json({ message: 'Incorrect email or password' });
      const token = issue(user);
      res.setHeader('Set-Cookie', sessionCookie(token, lifetime));
      return res.status(200).json({ token, user: publicUser(user) });
    }
    if (action === 'logout') {
      res.setHeader('Set-Cookie', sessionCookie('', 0));
      return res.status(204).end();
    }
    const token = String(req.headers.authorization ?? '').replace(/^Bearer /, '');
    const cookie = String(req.headers.cookie ?? '').split(';').map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    const user = token && cookie === token ? verify(token) : null;
    if (!user) return res.status(401).json({ message: 'Please log in again' });
    return res.status(200).json(publicUser(user));
  };
}
