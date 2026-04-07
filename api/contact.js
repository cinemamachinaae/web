import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const {
      first_name = '',
      last_name = '',
      email = '',
      phone = '',
      service = '',
      system_description = '',
    } = req.body || {};

    if (!first_name.trim() || !email.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'First name and email are required.',
      });
    }

    const safe = {
      first_name: escapeHtml(first_name),
      last_name: escapeHtml(last_name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      service: escapeHtml(service),
      system_description: escapeHtml(system_description),
    };

    const subject = `Cinema Machina enquiry — ${safe.first_name}${safe.last_name ? ` ${safe.last_name}` : ''}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin:0 0 16px;">New Cinema Machina enquiry</h2>
        <p><strong>First name:</strong> ${safe.first_name}</p>
        <p><strong>Last name:</strong> ${safe.last_name || '—'}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone / WhatsApp:</strong> ${safe.phone || '—'}</p>
        <p><strong>Primary Interest:</strong> ${safe.service || '—'}</p>
        <p><strong>System description:</strong></p>
        <div style="padding:12px 14px; background:#f7f7f7; border-radius:8px; white-space:pre-wrap;">
${safe.system_description || '—'}
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: 'Cinema Machina <enquiry@updates.cinemamachina.ae>',
      to: ['cinemamachina.ae@gmail.com'],
      replyTo: safe.email,
      subject,
      html,
    });

    if (error) {
      return res.status(500).json({ ok: false, error: 'Email send failed.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' });
  }
}
