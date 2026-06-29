import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { title, description_id, description_en, tech_stack, image_url, images, live_url, github_url, is_featured } = body;

    const imagesArr = Array.isArray(images) ? images : JSON.parse(images || '[]');
    const { id } = await params;

    // ? diganti $1, $2, dst
    await pool.query(
      `UPDATE projects 
       SET title=$1, description_id=$2, description_en=$3, tech_stack=$4, 
           image_url=$5, images=$6, live_url=$7, github_url=$8, 
           is_featured=$9, updated_at=NOW()
       WHERE id=$10`,
      [
        title,
        description_id ?? "",
        description_en ?? "",
        JSON.stringify(tech_stack),
        image_url ?? "",
        JSON.stringify(imagesArr),
        live_url ?? "",
        github_url ?? "",
        is_featured ?? false,
        id,
      ]
    );

    return NextResponse.json({ message: 'Project updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // ? diganti $1
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}