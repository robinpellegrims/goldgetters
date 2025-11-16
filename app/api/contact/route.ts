import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken?: string;
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      },
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message, turnstileToken } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 },
      );
    }

    // Verify Turnstile token only if secret key is configured
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecretKey) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Turnstile verificatie is verplicht' },
          { status: 400 },
        );
      }

      const isValidToken = await verifyTurnstileToken(turnstileToken);
      if (!isValidToken) {
        return NextResponse.json(
          { error: 'Ongeldige Turnstile verificatie' },
          { status: 400 },
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 },
      );
    }

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP connection error:', error);
      return NextResponse.json(
        { error: 'E-mailservice niet beschikbaar' },
        { status: 500 },
      );
    }

    const contactEmailTo =
      process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
    const contactEmailFrom =
      process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER;

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${contactEmailFrom}>`,
      to: contactEmailTo,
      replyTo: email,
      subject: `Contactformulier: ${subject}`,
      text: `
Naam: ${name}
E-mail: ${email}
Onderwerp: ${subject}

Bericht:
${message}
      `,
      html: /* HTML */ `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #f4f4f4;
                padding: 10px;
                border-left: 4px solid #007bff;
                margin-bottom: 20px;
              }
              .field {
                margin-bottom: 15px;
              }
              .label {
                font-weight: bold;
                color: #555;
              }
              .message {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Nieuw contactformulier bericht</h2>
              </div>

              <div class="field"><span class="label">Naam:</span> ${name}</div>

              <div class="field">
                <span class="label">E-mail:</span>
                <a href="mailto:${email}">${email}</a>
              </div>

              <div class="field">
                <span class="label">Onderwerp:</span> ${subject}
              </div>

              <div class="field">
                <span class="label">Bericht:</span>
                <div class="message">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: 'E-mail succesvol verzonden' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
