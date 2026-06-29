import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM projects ORDER BY order_index ASC, created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description_id, description_en, tech_stack, image_url, images, live_url, github_url, is_featured } = body;

    // $1, $2, dst — bukan ?
    const { rows } = await pool.query(
      `INSERT INTO projects 
        (title, description_id, description_en, tech_stack, image_url, images, live_url, github_url, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        description_id ?? "",
        description_en ?? "",
        JSON.stringify(tech_stack),
        image_url ?? "",
        JSON.stringify(images || []),
        live_url ?? "",
        github_url ?? "",
        is_featured ?? false,
      ]
    );

    return NextResponse.json({ id: rows[0].id, message: 'Project created' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}