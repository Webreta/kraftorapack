import "server-only";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

// Panelden yüklenen dosyalar public/uploads/<subdir> altına yazılır.
// Tek klasör altında olmaları canlıda tek volume bağlamayı yeterli kılar.

export const DOCUMENT_EXTENSIONS = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "csv", "txt", "rtf", "odt", "ods", "png", "jpg", "jpeg", "webp",
]);
export const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "svg"]);

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

function slugifyFileName(text: string) {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export type UploadResult =
  | { ok: true; publicPath: string | null }
  | { ok: false; error: string };

// Dosya seçilmediyse { publicPath: null } döner
export async function saveUploadedFile(
  value: FormDataEntryValue | null,
  subdir: string,
  allowed: Set<string>
): Promise<UploadResult> {
  if (!(value instanceof File) || value.size === 0 || !value.name) {
    return { ok: true, publicPath: null };
  }
  const ext = value.name.split(".").pop()?.toLowerCase() ?? "";
  if (!allowed.has(ext)) {
    return {
      ok: false,
      error: `Desteklenmeyen dosya türü (.${ext}). İzin verilenler: ${[...allowed].join(", ")}`,
    };
  }
  if (value.size > MAX_FILE_SIZE) {
    return { ok: false, error: "Dosya 20 MB'den büyük olamaz." };
  }
  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  await mkdir(dir, { recursive: true });
  const base = slugifyFileName(value.name.replace(/\.[^.]+$/, "")) || "dosya";
  const fileName = `${base}-${Date.now().toString(36)}.${ext}`;
  await writeFile(
    path.join(dir, fileName),
    Buffer.from(await value.arrayBuffer())
  );
  return { ok: true, publicPath: `/uploads/${subdir}/${fileName}` };
}

// Yalnızca beklenen alt klasördeki dosyaları siler.
// Eski kayıtlar /<subdir>/, yeniler /uploads/<subdir>/ ile başlar; ikisi de desteklenir.
export async function removeUploadedFile(
  publicPath: string | null | undefined,
  subdir: string
) {
  if (!publicPath) return;
  let fullPath: string;
  if (publicPath.startsWith(`/uploads/${subdir}/`)) {
    fullPath = path.join(
      process.cwd(), "public", "uploads", subdir, path.basename(publicPath)
    );
  } else if (publicPath.startsWith(`/${subdir}/`)) {
    fullPath = path.join(
      process.cwd(), "public", subdir, path.basename(publicPath)
    );
  } else {
    return;
  }
  try {
    await unlink(fullPath);
  } catch {
    // Dosya zaten yoksa sorun değil
  }
}
