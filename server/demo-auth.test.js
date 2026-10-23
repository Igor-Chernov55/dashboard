import { beforeEach, describe, expect, it } from 'vitest';
import login from '../api/login.js';
import me from '../api/me.js';
import logout from '../api/logout.js';

async function invoke(handler, { method = 'POST', body, token, cookie } = {}) {
  const result = { headers: {}, statusCode: 200 };
  const response = {
    setHeader(name, value) { result.headers[name] = value; },
    status(code) { result.statusCode = code; return this; },
    json(body) { result.body = body; return this; },
    end() { return this; },
  };
  await handler({ method, body, headers: { authorization: token ? `Bearer ${token}` : '', cookie } }, response);
  return result;
}
const credentials = { email: 'demo@example.com', password: 'demo123' };
describe('Vercel demo auth', () => {
  beforeEach(() => { process.env.AUTH_SECRET = 'test-only-secret-with-at-least-32-characters'; });
  it('requires server configuration', async () => {
    delete process.env.AUTH_SECRET;
    expect((await invoke(login, { body: credentials })).statusCode).toBe(503);
  });
  it('rejects invalid credentials and unsupported methods', async () => {
    expect((await invoke(login, { body: { ...credentials, password: 'wrong' } })).statusCode).toBe(401);
    expect((await invoke(login, { method: 'GET' })).statusCode).toBe(405);
  });
  it('issues a signed session and restores it on another invocation', async () => {
    const result = await invoke(login, { body: credentials });
    expect(result.statusCode).toBe(200);
    expect(result.body.user).not.toHaveProperty('password');
    expect(result.headers['Set-Cookie']).toContain('HttpOnly; Secure; SameSite=Strict');
    const token = result.body.token;
    const cookie = result.headers['Set-Cookie'].split(';')[0];
    expect((await invoke(me, { method: 'GET', token, cookie })).body.email).toBe(credentials.email);
    expect((await invoke(me, { method: 'GET', token: token + 'x', cookie })).statusCode).toBe(401);
    expect((await invoke(me, { method: 'GET', token })).statusCode).toBe(401);
    const ended = await invoke(logout);
    expect(ended.statusCode).toBe(204);
    expect(ended.headers['Set-Cookie']).toContain('Max-Age=0');
    expect((await invoke(me, { method: 'GET', token, cookie: 'dashboard_demo=' })).statusCode).toBe(401);
  });
});
