import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { title, description_id, description_en, tech_stack, image_url, images, live_url, github_url, is_featured } = body;
    // Pastikan images sudah dalam bentuk array sebelum di-stringify
    const imagesArr = Array.isArray(images) ? images : JSON.parse(images || '[]');

    await pool.query(
      `UPDATE projects SET title=?, description_id=?, description_en=?, tech_stack=?, image_url=?, images=?, live_url=?, github_url=?, is_featured=?
      WHERE id=?`,
      [title, description_id, description_en, JSON.stringify(tech_stack), image_url, JSON.stringify(imagesArr), live_url, github_url, is_featured, (await params).id]
    );

    return NextResponse.json({ message: 'Project updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await pool.query('DELETE FROM projects WHERE id = ?', [(await params).id]);
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}