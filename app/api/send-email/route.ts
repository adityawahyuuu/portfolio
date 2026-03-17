// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs'; // penting: Nodemailer butuh Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, attachments } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = process.env.TITAN_EMAIL;
    const pass = process.env.TITAN_PASSWORD;

    if (!user || !pass) {
      return NextResponse.json(
        { error: 'Email credentials are not configured on the server' },
        { status: 500 }
      );
    }

    // Transporter Titan Email (SMTP)
    const transporter = nodemailer.createTransport({
      host: 'smtp.titan.email',
      port: 465,
      secure: true, // 465 = SSL
      auth: { user, pass },
    });

    // Prepare attachments for nodemailer
    const emailAttachments = attachments ? attachments.map((attachment: any) => ({
      filename: attachment.filename,
      content: attachment.content,
      encoding: 'base64',
      contentType: attachment.contentType,
    })) : [];

    const receivedAt = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const attachmentRows = attachments?.length
      ? attachments.map((att: any) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;">${att.filename}</td>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#999;text-align:right;">${(att.size / 1024).toFixed(1)} KB</td>
          </tr>`).join('')
      : '';

    const attachmentSection = attachments?.length ? `
      <tr><td style="padding:24px 40px 0;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#999;">Attachments</p>
        <table width="100%" cellpadding="0" cellspacing="0">${attachmentRows}</table>
      </td></tr>` : '';

    const mailOptions = {
      from: `"Portfolio Aditya Wahyu Pradhana" <${user}>`,
      to: 'pradhanaaditya30@gmail.com',
      replyTo: `"${name}" <${email}>`,
      subject: `Message from ${name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:48px 20px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border:1px solid #e8e8e8;border-radius:4px;">

      <!-- Top accent -->
      <tr><td style="height:3px;background:#1a1a1a;border-radius:4px 4px 0 0;"></td></tr>

      <!-- Header -->
      <tr><td style="padding:32px 40px 24px;">
        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Portfolio Contact</p>
        <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#1a1a1a;line-height:1.3;">You received a new message</h1>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f0f0f0;margin:0;"></td></tr>

      <!-- Sender -->
      <tr><td style="padding:24px 40px 0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#999;">From</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">${name}</p>
        <p style="margin:3px 0 0;font-size:13px;color:#666;">
          <a href="mailto:${email}" style="color:#1a1a1a;text-decoration:underline;">${email}</a>
        </p>
      </td></tr>

      <!-- Message -->
      <tr><td style="padding:24px 40px 0;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#999;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.8;color:#333;white-space:pre-wrap;background:#fafafa;border-left:2px solid #1a1a1a;padding:16px 20px;">${message}</p>
      </td></tr>

      ${attachmentSection}

      <!-- Reply button -->
      <tr><td style="padding:28px 40px;">
        <a href="mailto:${email}?subject=Re:%20Your%20message" style="display:inline-block;background:#1a1a1a;color:#fff;font-size:13px;font-weight:500;text-decoration:none;padding:10px 22px;border-radius:3px;">Reply</a>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:16px 40px 24px;border-top:1px solid #f0f0f0;">
        <p style="margin:0;font-size:12px;color:#bbb;">Received ${receivedAt} WIB via portfolio contact form</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`,
      attachments: emailAttachments,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-GM-LABELS': '\\Starred',
      },
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    console.log('Attachments sent:', attachments?.length || 0);

    return NextResponse.json({ 
      message: 'Email sent successfully',
      messageId: info.messageId,
      attachmentCount: attachments?.length || 0
    }, { status: 200 });
    
  } catch (err) {
    console.error('Error sending email:', err);
    return NextResponse.json({ 
      error: 'Failed to send email', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    }, { status: 500 });
  }
}