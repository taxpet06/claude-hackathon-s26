import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  await writeFile(join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
