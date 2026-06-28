import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, tech_stack, image_url, images, live_url, github_url, is_featured } = body;

    const [result]: any = await pool.query(
      `INSERT INTO projects (title, description_id, description_en, tech_stack, image_url, images, live_url, github_url, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, JSON.stringify(tech_stack), image_url, JSON.stringify(images || []), live_url, github_url, is_featured ?? false]
    );

    return NextResponse.json({ id: result.insertId, message: 'Project created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}