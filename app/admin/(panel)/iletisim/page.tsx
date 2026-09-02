import { desc } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { requireSection } from "@/lib/auth/session";
import { getContactSettings } from "@/lib/data/settings";
import { deleteSubmission, toggleRead } from "@/app/actions/iletisim";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { ContactPageForm, ContactSettingsForm } from "@/components/admin/ContactForms";

function formatDateTime(d: Date) {
  return d.toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminContactPage() {
  await requireSection("iletisim");
  const [settings, messages] = await Promise.all([
    getContactSettings(),
    db.select().from(submissions).orderBy(desc(submissions.createdAt)),
  ]);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-ink">İletişim</h1>

      <div className="mt-6 space-y-10">
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">İletişim Bilgileri</h2>
          <ContactSettingsForm initial={settings} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">İletişim Sayfası Metinleri</h2>
          <ContactPageForm initial={settings.page} />
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">
            Gelen Mesajlar ve Teklif Talepleri
            {unread > 0 && (
              <span className="ml-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">{unread} yeni</span>
            )}
          </h2>
          <div className="mt-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl border p-5 ${
                  m.read ? "border-line bg-white" : "border-brand-200 bg-brand-50/40"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-ink">
                      <span
                        className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          m.kind === "quote" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {m.kind === "quote" ? "Teklif" : "İletişim"}
                      </span>
                      {m.name}
                      {!m.read && (
                        <span className="ml-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">Yeni</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      <a href={`mailto:${m.email}`} className="hover:text-brand-700">
                        {m.email}
                      </a>
                      {m.phone && <> · {m.phone}</>}
                      <> · {m.lang.toUpperCase()}</>
                    </p>
                  </div>
                  <p className="text-xs text-muted">{formatDateTime(m.createdAt)}</p>
                </div>

                {m.meta && Object.keys(m.meta).length > 0 && (
                  <dl className="mt-3 grid gap-x-4 gap-y-1 rounded-lg bg-white/70 p-3 text-sm sm:grid-cols-2">
                    {Object.entries(m.meta).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="shrink-0 font-semibold text-ink">{k}:</dt>
                        <dd className="text-muted">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {m.message && (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{m.message}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <form action={toggleRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand-500 hover:text-brand-700"
                    >
                      {m.read ? "Okunmadı işaretle" : "Okundu işaretle"}
                    </button>
                  </form>
                  <form action={deleteSubmission}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmSubmit
                      label="Sil"
                      message="Bu mesaj kalıcı olarak silinecek. Emin misiniz?"
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    />
                  </form>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">Henüz mesaj yok.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
