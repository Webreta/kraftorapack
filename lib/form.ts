import type { L } from "@/lib/l10n";

// Panel formlarındaki iki dilli alanları okur: "<ad>.tr" ve "<ad>.en"
export function readL(formData: FormData, name: string): L {
  return {
    tr: String(formData.get(`${name}.tr`) ?? "").trim(),
    en: String(formData.get(`${name}.en`) ?? "").trim(),
  };
}

export function readStr(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export function readBool(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}
