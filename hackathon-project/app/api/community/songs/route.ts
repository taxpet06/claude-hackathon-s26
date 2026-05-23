import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const [rows, countRow] = await Promise.all([
    db.query(
      "SELECT * FROM community_songs ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    ),
    db.query("SELECT COUNT(*)::int AS total FROM community_songs"),
  ]);

  return NextResponse.json({ songs: rows.rows, total: countRow.rows[0].total, page });
}

export async function POST(req: NextRequest) {
  const { title, description, creatorName, audioUrl, stemsUsed } = await req.json();

  if (!title || !audioUrl || !stemsUsed) {
    return NextResponse.json(
      { error: "title, audioUrl, and stemsUsed are required" },
      { status: 400 }
    );
  }

  const { rows } = await db.query(
    `INSERT INTO community_songs (title, description, creator_name, audio_url, stems_used)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description ?? null, creatorName ?? "Anonymous", audioUrl, JSON.stringify(stemsUsed)]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
