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

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const firstName = (body.first_name || '').trim();
    const lastName = (body.last_name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const service = (body.service || '').trim();
    const systemDescription = (body.system_description || '').trim();

    if (!firstName || !email) {
      return json({ error: 'First name and email are required.' }, 400);
    }

    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const safeName = escapeHtml(fullName || firstName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Not provided');
    const safeService = escapeHtml(service || 'Not selected');
    const safeSystem = escapeHtml(systemDescription || 'No system details provided.');

    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `New Cinema Machina enquiry — ${fullName || firstName}`,
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
    });

    if (error) {
      console.error('Resend send error:', error);
      return json({ error: 'Email send failed.' }, 500);
    }

    return json({ ok: true, id: data?.id || null }, 200);
  } catch (error) {
    console.error('Contact API error:', error);
    return json({ error: 'Invalid request.' }, 500);
  }
}

export default { POST };
