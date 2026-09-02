"use client";

import { useActionState, useState } from "react";
import type { TechnicalSettings } from "@/lib/settings/teknik";
import {
  saveFavicon,
  saveHeadCode,
  saveIndexing,
  saveSeo,
  saveSitemap,
  saveSmtp,
  sendSmtpTest,
} from "@/app/actions/teknik";
import { cardCls, fileCls, FormStatus, inputCls, labelCls, LInput, LTextarea, type ActionState } from "./Fields";

export function HeadCodeForm({ initial }: { initial: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveHeadCode, {});
  return (
    <form action={action} className={cardCls}>
      <label className={labelCls}>
        Head Kodu (meta, link ve script etiketleri)
        <textarea
          name="headCode"
          rows={6}
          defaultValue={initial}
          placeholder={'<meta name="google-site-verification" content="..." />'}
          className={`${inputCls} font-mono text-xs`}
        />
      </label>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function SmtpForm({ initial, mailTo }: { initial: TechnicalSettings["smtp"]; mailTo: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSmtp, {});
  return (
    <form action={action} className={cardCls}>
      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <label className={labelCls}>
          SMTP Sunucusu
          <input type="text" name="host" defaultValue={initial.host} placeholder="smtp.orneksaglayici.com" className={inputCls} />
        </label>
        <label className={labelCls}>
          Port
          <input type="number" name="port" defaultValue={initial.port} className={inputCls} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelCls}>
          Kullanıcı Adı
          <input type="text" name="user" defaultValue={initial.user} className={inputCls} />
        </label>
        <label className={labelCls}>
          Şifre (değiştirmeyeceksen boş bırak)
          <input type="password" name="pass" placeholder={initial.pass ? "••••••••" : ""} autoComplete="new-password" className={inputCls} />
        </label>
      </div>
      <label className={labelCls}>
        Gönderen Adresi (From)
        <input type="text" name="from" defaultValue={initial.from} placeholder="info@kraftorapack.com" className={inputCls} />
      </label>
      <label className={labelCls}>
        Formdan Gelen E-postaların Alıcıları (virgülle ayır)
        <input type="text" name="mailTo" defaultValue={mailTo} placeholder="info@kraftorapack.com, satis@kraftorapack.com" className={inputCls} />
      </label>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function SmtpTestForm({ defaultTo }: { defaultTo: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(sendSmtpTest, {});
  return (
    <form action={action} className="mt-4 space-y-3 rounded-2xl border border-dashed border-line bg-card/60 p-5">
      <p className="text-sm font-bold text-ink">SMTP Testi</p>
      <p className="text-xs text-muted">
        Kayıtlı ayarlarla aşağıdaki adrese bir test e-postası gönderir. Yukarıda değişiklik yaptıysanız önce kaydedin.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input type="email" name="to" required defaultValue={defaultTo} placeholder="ornek@adres.com" className={inputCls} />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg border border-brand-600 px-5 py-2 text-sm font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white disabled:opacity-60"
        >
          {pending ? "Gönderiliyor…" : "Test Gönder"}
        </button>
      </div>
      {state.ok && !state.error && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Test e-postası gönderildi. Gelen kutusunu ve spam klasörünü kontrol edin.
        </p>
      )}
      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
    </form>
  );
}

export function FaviconForm({ initial }: { initial: string | null }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveFavicon, {});
  return (
    <form action={action} className={cardCls}>
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-line bg-card">
          {initial ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={initial} alt="Favicon" className="size-8" />
          ) : (
            <span className="text-[10px] font-bold text-[#999]">Varsayılan</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input type="file" name="favicon" accept=".ico,.png,.svg" className={fileCls} />
          {initial && (
            <label className="flex items-center gap-1.5 text-xs font-medium text-red-600">
              <input type="checkbox" name="removeFavicon" className="size-3.5 accent-red-600" />
              Özel faviconu kaldır (varsayılana dön)
            </label>
          )}
        </div>
      </div>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function SeoForm({ initial }: { initial: TechnicalSettings["seo"] }) {
  const [title, setTitle] = useState(initial.title.tr);
  const [description, setDescription] = useState(initial.description.tr);
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSeo, {});
  return (
    <form
      action={action}
      className={cardCls}
      // Türkçe değerlerin canlı önizlemesi için form değişikliklerini izle
      onInput={(e) => {
        const el = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (el.name === "title.tr") setTitle(el.value);
        if (el.name === "description.tr") setDescription(el.value);
      }}
    >
      <LInput name="title" label="Site başlığı (en fazla 70 karakter)" value={initial.title} required />
      <LTextarea name="description" label="Site açıklaması (en fazla 200 karakter)" value={initial.description} rows={3} required />
      <div className="rounded-xl border border-line bg-card/60 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#999]">Google Önizlemesi (TR)</p>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-[#202124]">
            kraftorapack.com<span className="text-[#5f6368]"> › </span>
          </p>
          <p className="mt-1 truncate text-xl leading-snug text-[#1a0dab]">{title || "Site başlığı"}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#4d5156]">
            {description || "Site açıklaması burada görünür."}
          </p>
        </div>
      </div>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function IndexingForm({ initial }: { initial: boolean }) {
  const [noindex, setNoindex] = useState(initial);
  const [state, action, pending] = useActionState<ActionState, FormData>(saveIndexing, {});
  return (
    <form action={action} className={cardCls}>
      <label className="flex items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          name="noindex"
          checked={noindex}
          onChange={(e) => setNoindex(e.target.checked)}
          className="mt-0.5 size-4 accent-brand-600"
        />
        <span>
          <span className="font-semibold">Siteyi arama motorlarına kapat (indeksleme)</span>
          <span className="mt-1 block text-xs text-muted">
            İşaretliyken tüm sayfalara noindex etiketi eklenir ve robots.txt arama motorlarını engeller. Demo alan
            adında yayındayken açık tutun; gerçek alan adına geçince tiki kaldırıp kaydedin.
          </span>
        </span>
      </label>
      {noindex && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Site şu anda arama motorlarına kapalı. Google sonuçlarında görünmez.
        </p>
      )}
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function SitemapForm({ initial }: { initial: string[] }) {
  const [paths, setPaths] = useState<string[]>(initial);
  const [newPath, setNewPath] = useState("");
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSitemap, {});

  const addPath = () => {
    const p = newPath.trim();
    if (!p || !p.startsWith("/") || paths.includes(p)) return;
    setPaths((prev) => [...prev, p]);
    setNewPath("");
  };

  return (
    <form action={action} className={cardCls}>
      <input type="hidden" name="paths" value={JSON.stringify(paths)} />
      <p className="text-xs text-muted">Ürün ve blog sayfaları iki dilde otomatik eklenir; burada sabit sayfalar listelenir.</p>
      <div className="flex flex-wrap gap-2">
        {paths.map((p) => (
          <span key={p} className="flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-ink">
            {p}
            <button
              type="button"
              onClick={() => setPaths((prev) => prev.filter((x) => x !== p))}
              aria-label={`${p} yolunu kaldır`}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </span>
        ))}
        {paths.length === 0 && <span className="text-sm text-muted">Sitemap&apos;te sabit yol yok.</span>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPath();
            }
          }}
          placeholder="/ornek-sayfa"
          className={inputCls}
        />
        <button
          type="button"
          onClick={addPath}
          className="shrink-0 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-700"
        >
          + Ekle
        </button>
      </div>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}
