import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ── Rate Limiting ─────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; firstRequestAt: number }>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequestAt: now })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true
  }

  entry.count++
  return false
}

// Clean up stale entries every 30 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip)
    }
  }
}, 30 * 60 * 1000)

// ── Types ─────────────────────────────────────────────────────────
interface ContactFormData {
  name: string
  email: string
  subject: string
  budget?: string
  message: string
}

const MY_EMAIL = 'guptahariom049@gmail.com'

export async function POST(request: Request) {
  try {
    // ── Rate limiting ───────────────────────────────────────────
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }

    // ── Parse & validate ────────────────────────────────────────
    const data: ContactFormData = await request.json()

    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (data.message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitize = (str: string) =>
      str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()

    const name = sanitize(data.name)
    const email = data.email.trim()
    const subject = sanitize(data.subject)
    const budget = data.budget ? sanitize(data.budget) : 'Not specified'
    const message = sanitize(data.message)
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    // ── Send notification email to me ───────────────────────────
    await resend.emails.send({
      from: 'Hariom Gupta Portfolio <onboarding@resend.dev>',
      to: MY_EMAIL,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject} — from ${name}`,
      headers: {
        'X-Priority': '1',
      },
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0D0D14, #13131E); padding: 32px 40px;">
              <h1 style="margin: 0; color: #00F5FF; font-size: 22px; font-weight: 700;">📬 New Portfolio Inquiry</h1>
              <p style="margin: 8px 0 0; color: #8B89AA; font-size: 14px;">${timestamp} IST</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #6b7280; font-size: 13px; display: inline-block; width: 100px;">From</span>
                    <strong style="color: #1a1a2e;">${name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #6b7280; font-size: 13px; display: inline-block; width: 100px;">Email</span>
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #6b7280; font-size: 13px; display: inline-block; width: 100px;">Subject</span>
                    <strong style="color: #1a1a2e;">${subject}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #6b7280; font-size: 13px; display: inline-block; width: 100px;">Budget</span>
                    <span style="color: #1a1a2e;">${budget}</span>
                  </td>
                </tr>
              </table>
              <!-- Message -->
              <div style="margin-top: 24px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #A855F7;">
                <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <p style="margin: 0; color: #1a1a2e; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
              </div>
              <!-- Quick actions -->
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">Reply to ${name}</a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">This email was sent from your portfolio contact form at hariomgupta.dev</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    // ── Send auto-reply to the contact ──────────────────────────
    await resend.emails.send({
      from: 'Hariom Gupta Portfolio <onboarding@resend.dev>',
      to: email,
      replyTo: MY_EMAIL,
      subject: `Thanks for reaching out, ${name}!`,
      headers: {
        'X-Priority': '1',
      },
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0D0D14, #13131E); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #00F5FF; font-size: 24px; font-weight: 700;">Hey ${name} 👋</h1>
              <p style="margin: 12px 0 0; color: #8B89AA; font-size: 15px;">Thanks for reaching out!</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0 0 16px;">
                I've received your message and will get back to you within <strong>24–48 hours</strong>.
              </p>
              <p style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0 0 24px;">
                In the meantime, feel free to explore my work:
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://github.com/hariomgupta70427" style="display: inline-block; padding: 10px 20px; margin: 0 8px; background-color: #1a1a2e; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">GitHub</a>
                <a href="https://www.linkedin.com/in/hariomgupta70427/" style="display: inline-block; padding: 10px 20px; margin: 0 8px; background-color: #0077B5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">LinkedIn</a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #eee; text-align: center;">
              <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px; font-weight: 600;">Hariom Gupta</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">Flutter & Full-Stack Developer | guptahariom049@gmail.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
