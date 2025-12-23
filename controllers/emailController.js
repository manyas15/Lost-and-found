const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  if (!host || !user || !pass) {
    console.warn('SMTP not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS');
    return null;
  }
  
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

async function sendEmail(req, res, next) {
  try {
    const { to, subject, body, itemName, itemStatus } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: to, subject, and body are required.' 
      });
    }

    const transporter = createTransport();
    
    if (!transporter) {
      // In development, log the email instead of failing
      if (process.env.NODE_ENV !== 'production') {
        console.log('='.repeat(60));
        console.log('📧 Email would be sent (SMTP not configured):');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Body:', body);
        console.log('='.repeat(60));
        return res.json({ 
          success: true, 
          message: 'Email logged to console (SMTP not configured)' 
        });
      }
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured. Please contact administrator.' 
      });
    }

    const from = process.env.SMTP_USER || 'no-reply@lostfound.com';
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06d6a0 100%); padding: 2rem; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 1.5rem;">University Lost & Found</h1>
        </div>
        <div style="padding: 2rem; background: #f9f9f9;">
          <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="white-space: pre-wrap; line-height: 1.8; color: #333;">${body.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #ddd; font-size: 0.9rem; color: #666;">
            <p style="margin: 0.5rem 0;"><strong>Item:</strong> ${itemName || 'N/A'}</p>
            <p style="margin: 0.5rem 0;"><strong>Status:</strong> ${itemStatus || 'N/A'}</p>
            <p style="margin: 0.5rem 0; color: #999; font-size: 0.85rem;">This email was sent through the University Lost & Found system.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"University Lost & Found" <${from}>`,
      to,
      subject,
      text: body,
      html: htmlBody
    });

    res.json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    });
  }
}

module.exports = { sendEmail };

