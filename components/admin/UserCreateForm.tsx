"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { createUser, type UserState } from "@/app/actions/kullanicilar";
import { SavedToast } from "@/components/admin/SavedToast";
import { cardCls, inputCls, labelCls, submitCls } from "./Fields";

const SECTIONS = [
  { key: "genel", label: "Ana Sayfa" },
  { key: "hakkimizda", label: "Hakkımızda" },
  { key: "urunler", label: "Ürünler" },
  { key: "galeri", label: "Galeri" },
  { key: "blog", label: "Blog" },
  { key: "iletisim", label: "İletişim" },
  { key: "teknik", label: "Teknik" },
];

export function UserCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [role, setRole] = useState<"admin" | "editor">("admin");
  const [state, formAction, pending] = useActionState<UserState, FormData>(createUser, {});

  useEffect(() => {
    if (state.ok && !pending) {
      formRef.current?.reset();
      setRole("admin");
    }
  }, [state, pending]);

  return (
    <form ref={formRef} action={formAction} className={cardCls}>
      <SavedToast show={!!state.ok} label="Kullanıcı oluşturuldu" signal={state} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelCls}>
          Kullanıcı Adı
          <input type="text" name="username" required autoComplete="off" className={inputCls} />
        </label>
        <label className={labelCls}>
          Ad Soyad
          <input type="text" name="name" required className={inputCls} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelCls}>
          Şifre
          <input type="password" name="password" required autoComplete="new-password" className={inputCls} />
        </label>
        <label className={labelCls}>
          Yetki
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "editor")}
            className={inputCls}
          >
            <option value="admin">Yönetici (tüm sekmeler)</option>
            <option value="editor">Editör (seçili sekmeler)</option>
          </select>
        </label>
      </div>

      {role === "editor" && (
        <div className="rounded-lg border border-line bg-card/60 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#999]">Erişebileceği Sekmeler</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SECTIONS.map((s) => (
              <label key={s.key} className="flex items-center gap-2 text-sm font-medium text-ink">
                <input type="checkbox" name="permissions" value={s.key} className="size-4 accent-brand-600" />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Oluşturuluyor…" : "Kullanıcı Oluştur"}
      </button>
    </form>
  );
}
