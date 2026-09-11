import { contactEmail, escapeHtml, getMailer, isEmail, isText, json, mailFrom, sendCustomerMail } from './_shared.js'

type ContactRequest = {
  name?: unknown
  phone?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
  website?: unknown
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405)

    let body: ContactRequest

    try {
      body = await request.json() as ContactRequest
    } catch {
      return json({ error: 'INVALID_JSON' }, 400)
    }

    if (body.website) return json({ ok: true })
    if (!isText(body.name, 2, 100) || !isText(body.phone, 6, 30) || !isEmail(body.email) || !isText(body.subject, 2, 100) || !isText(body.message, 10, 3000)) {
      return json({ error: 'INVALID_CONTACT_DATA' }, 400)
    }

    const mailer = getMailer()
    if (!mailer) return json({ error: 'MAIL_NOT_CONFIGURED' }, 503)

    const name = body.name.trim()
    const phone = body.phone.trim()
    const email = body.email.trim()
    const subject = body.subject.trim()
    const message = body.message.trim()

    await mailer.sendMail({
      from: mailFrom,
      to: contactEmail,
      replyTo: email,
      subject: `Contact TAXI-LUX · ${subject}`,
      html: `<h1>Nouvelle demande TAXI-LUX</h1><p><strong>Nom :</strong> ${escapeHtml(name)}</p><p><strong>Téléphone :</strong> ${escapeHtml(phone)}</p><p><strong>E-mail :</strong> ${escapeHtml(email)}</p><p><strong>Objet :</strong> ${escapeHtml(subject)}</p><p><strong>Message :</strong></p><p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>`,
    })

    if (sendCustomerMail) {
      await mailer.sendMail({
        from: mailFrom,
        to: email,
        replyTo: contactEmail,
        subject: 'Votre demande TAXI-LUX a bien été reçue',
        html: `<h1>Merci ${escapeHtml(name)}</h1><p>Nous avons bien reçu votre demande concernant « ${escapeHtml(subject)} ».</p><p>Notre équipe vous répondra dans les meilleurs délais.</p><p>TAXI-LUX</p>`,
      })
    }

    return json({ ok: true })
  },
}
