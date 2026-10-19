import { next } from '@vercel/edge';

// Server-side gate: never put credentials in VITE_ variables or client code.
export default function middleware(request) {
  const username = process.env.AETT_LOGIN_USER;
  const password = process.env.AETT_LOGIN_PASSWORD;
  if (!username || !password) {
    return new Response('Innskraning er ekki uppsett. Stilltu AETT_LOGIN_USER og AETT_LOGIN_PASSWORD i Vercel.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  const header = request.headers.get('authorization') || '';
  let candidate = '';
  if (header.startsWith('Basic ')) {
    try { candidate = atob(header.slice(6)); } catch { /* invalid authorization */ }
  }
  // Check all bytes rather than exiting at first mismatch.
  const expected = `${username}:${password}`;
  const enc = new TextEncoder();
  const a = enc.encode(candidate);
  const b = enc.encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] || 0) ^ (b[i] || 0);
  if (!candidate || diff !== 0) {
    return new Response('Innskraningar krafist', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Aettarslodir", charset="UTF-8"', 'Cache-Control': 'no-store' } });
  }
  return next();
}

export const config = { matcher: '/(.*)' };
