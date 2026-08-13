/**
 * Three ways out, picked by whichever env vars exist:
 *   1. RESEND_API_KEY            → Resend HTTP API
 *   2. SMTP_HOST + SMTP_USER/PASS → any SMTP box (Gmail app password works)
 *   3. nothing                   → dry run, prints the digest to stdout
 */
export type MailTransport = "resend" | "smtp" | "dry-run";

export interface MailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export function detectTransport(): MailTransport {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST && process.env.SMTP_USER) return "smtp";
  return "dry-run";
}

async function sendViaResend(msg: MailMessage): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: msg.from,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend rejected the message (${res.status}): ${await res.text()}`);
  }
}

async function sendViaSmtp(msg: MailMessage): Promise<void> {
  // Imported lazily so the web app never pulls nodemailer into its bundle.
  const nodemailer = (await import("nodemailer")).default;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail(msg);
}

export async function sendMail(msg: MailMessage): Promise<MailTransport> {
  const transport = detectTransport();
  if (transport === "resend") await sendViaResend(msg);
  else if (transport === "smtp") await sendViaSmtp(msg);
  return transport;
}
