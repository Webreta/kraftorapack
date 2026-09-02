import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Panelden yüklenen dosyalar (public/uploads) çalışma anında eklendiği için
// Next'in statik public sunumuna girmez; bu rota onları diskten okuyup sunar.

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  txt: "text/plain; charset=utf-8",
  rtf: "application/rtf",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ yol: string[] }> }
) {
  const { yol } = await params;
  const base = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(base, ...yol.map((p) => decodeURIComponent(p)));

  // Klasör dışına çıkma (path traversal) engeli
  if (!filePath.startsWith(base + path.sep)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
