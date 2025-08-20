import { NextResponse } from 'next/server';

export async function POST() {
  // Set the token cookie to expire in the past, matching login options
  const isProd = process.env.NODE_ENV === 'production';
  const cookie = [
    'token=;',
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    isProd ? 'Secure' : '',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ].filter(Boolean).join('; ');

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Set-Cookie': cookie,
    },
  });
}