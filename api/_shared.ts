import nodemailer from 'nodemailer'

export const contactEmail = process.env.COMPANY_EMAIL ?? 'info@taxi-lux.be'
export const mailFrom = process.env.SMTP_USER ? `TAXI-LUX <${process.env.SMTP_USER}>` : 'TAXI-LUX <info@taxi-lux.be>'
export const sendCustomerMail = process.env.SEND_CUSTOMER_MAIL !== 'false'

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function getMailer() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  const port = Number(process.env.SMTP_PORT ?? 465)

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE !== 'false',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isText(value: unknown, min: number, max: number): value is string {
  return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max
}
