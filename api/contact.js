const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { first_name, last_name, email, phone, service, system_description } = req.body;

    // Basic validation
    if (!first_name || !email) {
      return res.status(400).json({ error: 'First name and email are required.' });
    }

    // Sanitize helper (simple HTML escaping)
    const esc = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const fullName = `${esc(first_name)} ${esc(last_name)}`.trim();
    const safeEmail = esc(email);
    const safePhone = esc(phone);
    const safeService = esc(service);
    const safeSystem = esc(system_description);

    const emailHtml = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #c9a96e; border-bottom: 2px solid #c9a96e; padding-bottom: 10px;">New Enquiry: Cinema Machina</h2>
        <p><strong>From:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone || 'Not provided'}</p>
        <p><strong>Primary Interest:</strong> ${safeService || 'Not selected'}</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <h3 style="margin-top: 0; font-size: 1rem; color: #666;">System Description:</h3>
          <p style="white-space: pre-wrap;">${safeSystem || 'No description provided.'}</p>
        </div>
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 0.8rem; color: #999;">This enquiry was sent via the cinemamachina.ae contact form.</p>
      </div>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Cinema Machina <enquiry@updates.cinemamachina.ae>',
      to: ['contact@cinemamachina.ae'],
      replyTo: safeEmail,
      subject: `New Enquiry from ${fullName}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return res.status(500).json({ error: 'Failed to send email.' });
    }

    return res.status(200).json({ success: true, message: 'Enquiry sent successfully.' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};
