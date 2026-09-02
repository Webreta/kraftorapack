import "server-only";
import nodemailer from "nodemailer";
import { getTechnicalSettings } from "@/lib/data/settings";

type ContactMail = {
  subject: string;
  replyTo: string;
  lines: (string | null | undefined)[];
};

function createTransporter(smtp: {
  host: string;
  port: number;
  user: string;
  pass: string;
}) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
    // Sunucuya ulaşılamıyorsa istek dakikalarca askıda kalmasın
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
  });
}

// Form bildirimi gönderir; SMTP ayarları eksikse sessizce atlar.
export async function sendNotification(data: ContactMail) {
  const settings = await getTechnicalSettings();
  const { smtp, mailTo } = settings;
  if (!smtp.host || !smtp.user || !mailTo) return;

  const recipients = mailTo
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  if (recipients.length === 0) return;

  const transporter = createTransporter(smtp);
  await transporter.sendMail({
    from: smtp.from || smtp.user,
    to: recipients,
    replyTo: data.replyTo,
    subject: data.subject,
    text: data.lines.filter((l) => l !== null && l !== undefined).join("\n"),
  });
}

// Panelden SMTP testine yarar: kayıtlı ayarlarla verilen adrese test e-postası atar.
export async function sendTestMail(to: string) {
  const { smtp } = await getTechnicalSettings();
  if (!smtp.host || !smtp.user) {
    throw new Error(
      "SMTP sunucusu veya kullanıcı adı boş. Önce ayarları doldurup kaydedin."
    );
  }
  const transporter = createTransporter(smtp);
  await transporter.sendMail({
    from: smtp.from || smtp.user,
    to,
    subject: "Kraftora SMTP testi",
    text: [
      "Bu bir test e-postasıdır.",
      "",
      "Yönetim panelindeki SMTP ayarları çalışıyor; iletişim ve teklif formu bildirimleri bu hesap üzerinden gönderilecek.",
      `Sunucu: ${smtp.host}:${smtp.port}`,
      `Gönderen: ${smtp.from || smtp.user}`,
    ].join("\n"),
  });
}
