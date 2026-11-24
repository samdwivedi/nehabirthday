'use server';

import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { redirect } from 'next/navigation';

export async function verifyPasswordAction(submittedPassword: string): Promise<boolean> {
  const expected = (process.env.BIRTHDAY_PASSWORD ?? '').trim().toLowerCase().replace(/[\s\-_]/g, '');
  const clean = submittedPassword.trim().toLowerCase().replace(/[\s\-_]/g, '');
  if (!expected || !clean) return false;
  return clean === expected || clean === expected.replace(/^0/, '') || ('0' + clean) === expected;
}

export async function unlockBirthday(formData: FormData) {
  const submitted = String(formData.get('password') ?? '').trim().toLowerCase();
  const expected = (process.env.BIRTHDAY_PASSWORD ?? '').trim().toLowerCase();
  const secret = (process.env.SESSION_SECRET ?? '').trim();
  if (!expected || secret.length < 32) redirect('/?error=setup');

  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  const valid = a.length === b.length && timingSafeEqual(a, b);
  if (!valid) redirect('/?error=wrong');

  const token = createHmac('sha256', secret).update('neha-exe-access').digest('hex');
  const jar = await cookies();
  jar.set('neha-exe-access', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/');
}

export async function lockBirthday() {
  const jar = await cookies();
  jar.delete('neha-exe-access');
  redirect('/?lock=true');
}
