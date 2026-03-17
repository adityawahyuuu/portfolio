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

    // Create attachment summary for email body
    const attachmentSummary = attachments && attachments.length > 0 
      ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <h4 style="color: #0c4a6e; margin-top: 0;">📎 Attachments (${attachments.length})</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${attachments.map((att: any) => `
              <li style="margin: 5px 0; color: #0369a1;">
                <strong>${att.filename}</strong> 
                <span style="color: #64748b; font-size: 12px;">(${(att.size / 1024).toFixed(1)} KB)</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` 
      : '';

    const mailOptions = {
      from: user,
      to: 'pradhanaaditya30@gmail.com',
      replyTo: email,
      subject: `[IMPORTANT] New Contact Form Message from ${name}${attachments?.length ? ' (with attachments)' : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Message</h1>
            <p style="color: #e2e8f0; margin: 5px 0 0 0;">From your portfolio website</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e2e8f0;">
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">📋 Contact Information</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> 
                <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a>
              </p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">💬 Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #374151;">${message}</p>
            </div>
            
            ${attachmentSummary}
            
            <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border-radius: 8px;">
              <p style="color: #059669; margin: 0; font-weight: 500;">
                💡 Click "Reply" to respond directly to ${name}
              </p>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              This email was sent from your portfolio contact form
            </p>
            ${attachments?.length ? 
              `<p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
                Total attachment size: ${(attachments.reduce((sum: number, att: any) => sum + att.size, 0) / 1024 / 1024).toFixed(2)} MB
              </p>` 
              : ''
            }
          </div>
        </div>
      `,
      attachments: emailAttachments,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
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