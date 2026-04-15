const { Resend } = require('resend');

const TO_EMAIL = 'cinemamachina.ae@gmail.com';
const FROM_EMAIL = 'Cinema Machina Enquiries <enquiries@send.cinemamachina.ae>';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(res, status, payload) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.send(JSON.stringify(payload));
}

function normalizeBody(req) {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body;
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return null;
}

function cleanInput(value, maxLength = 4000) {
  return String(value || '')
    .replace(/\0/g, '')
    .trim()
    .slice(0, maxLength);
}

function sanitizeHeader(value = '') {
  return String(value)
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    return json(res, 500, { error: 'Email service is not configured.' });
  }

  const body = normalizeBody(req);
  if (!body) {
    return json(res, 400, { error: 'Invalid request body.' });
  }

  const firstName = cleanInput(body.first_name, 120);
  const lastName = cleanInput(body.last_name, 120);
  const email = sanitizeHeader(cleanInput(body.email, 320)).toLowerCase();
  const phone = cleanInput(body.phone, 120);
  const service = cleanInput(body.service, 160);
  const systemDescription = cleanInput(body.system_description, 6000);

  if (!firstName || !email) {
    return json(res, 400, { error: 'First name and email are required.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return json(res, 400, { error: 'A valid email address is required.' });
  }

  const fullName = sanitizeHeader(
    [firstName, lastName].filter(Boolean).join(' ')
  );
  const subjectName = sanitizeHeader(fullName || firstName);
  const safeName = escapeHtml(fullName || firstName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || 'Not provided');
  const safeService = escapeHtml(service || 'Not selected');
  const safeSystem = escapeHtml(
    systemDescription || 'No system details provided.'
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `New Cinema Machina enquiry - ${subjectName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
          <h2 style="margin:0 0 16px;">New website enquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone / WhatsApp:</strong> ${safePhone}</p>
          <p><strong>Primary Interest:</strong> ${safeService}</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
          <p><strong>System details:</strong></p>
          <p style="white-space:pre-wrap;">${safeSystem}</p>
        </div>
      `,
      text: [
        'New website enquiry',
        `Name: ${fullName || firstName}`,
        `Email: ${email}`,
        `Phone / WhatsApp: ${phone || 'Not provided'}`,
        `Primary Interest: ${service || 'Not selected'}`,
        '',
        'System details:',
        systemDescription || 'No system details provided.',
      ].join('\n'),
    });

    if (error) {
      console.error('Resend send error:', error);
      return json(res, 502, { error: 'Email send failed.' });
    }

    return json(res, 200, { ok: true, id: data && data.id ? data.id : null });
  } catch (error) {
    console.error('Contact API error:', error);
    return json(res, 500, { error: 'Email send failed.' });
  }
};
