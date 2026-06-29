import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Verifikasi token
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { currentPassword, newPassword } = await req.json();

    // Ambil user dari DB
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1', [decoded.id]
    );

    if (!rows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const user = rows[0];

    // Verifikasi password lama
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return NextResponse.json({ error: 'Password lama salah' }, { status: 400 });

    // Hash password baru
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update ke DB
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashed, decoded.id]
    );

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}