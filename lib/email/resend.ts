import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface WelcomeEmailData {
  userEmail: string;
  userName: string;
  userRole: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const { userEmail, userName, userRole } = data;
    
    const result = await resend.emails.send({
      from: 'Tabor Academy <academy@tabordigital.com>',
      to: [userEmail],
      subject: 'Welcome to Tabor Academy! 🎉',
      html: generateWelcomeEmailHTML(userName, userRole),
      text: generateWelcomeEmailText(userName, userRole),
    });

    console.log('Welcome email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export interface ConfirmationEmailData {
  userEmail: string;
  userName: string;
  confirmationToken: string;
}

export async function sendConfirmationEmail(data: ConfirmationEmailData) {
  try {
    const { userEmail, userName, confirmationToken } = data;
    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/confirm-email?token=${confirmationToken}`;

    const result = await resend.emails.send({
      from: 'Tabor Academy <academy@tabordigital.com>',
      to: [userEmail],
      subject: 'Confirm your email for Tabor Academy',
      html: generateConfirmationEmailHTML(userName, confirmUrl),
      text: generateConfirmationEmailText(userName, confirmUrl),
    });

    console.log('Confirmation email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { success: false, error };
  }
}

function generateWelcomeEmailHTML(userName: string, userRole: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Tabor Academy</title>
      <link href="https://fonts.googleapis.com/css?family=Inter:400,700&display=swap" rel="stylesheet" type="text/css">
      <style>
        body { background: #F7F9F9; font-family: 'Inter', Arial, sans-serif; color: #2C3E50; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; border: 1px solid #E5E8E8; box-shadow: 0 2px 8px #E5E8E8; overflow: hidden; }
        .header {
          background: linear-gradient(90deg, #FF6B35 0%, #4ECDC4 100%);
          padding: 32px 24px 16px 24px;
          text-align: center;
        }
        .logo {
          width: 120px;
          height: auto;
          margin-bottom: 16px;
        }
        .title {
          color: #fff;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -1px;
        }
        .subtitle {
          color: #fff;
          font-size: 1.1rem;
          margin: 0 0 8px 0;
        }
        .content { padding: 32px 24px 24px 24px; }
        .greeting { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
        .highlight {
          background: #FFF3CD;
          color: #2C3E50;
          padding: 16px;
          border-radius: 8px;
          margin: 24px 0 16px 0;
          font-size: 1rem;
        }
        .button {
          display: inline-block;
          background: linear-gradient(90deg, #FF6B35 0%, #4ECDC4 100%);
          color: #fff;
          padding: 14px 36px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 1.1rem;
          margin: 24px 0;
          box-shadow: 0 2px 8px #E5E8E8;
        }
        .quick-tips {
          margin: 24px 0 0 0;
          padding: 0;
          list-style: none;
        }
        .quick-tips li {
          margin-bottom: 8px;
          color: #2C3E50;
        }
        .footer {
          text-align: center;
          color: #6E6C75;
          font-size: 0.95rem;
          padding: 24px 16px 16px 16px;
        }
        @media (max-width: 600px) {
          .container, .content, .header { padding-left: 8px !important; padding-right: 8px !important; }
          .content { padding-top: 16px !important; padding-bottom: 16px !important; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://academy.tabordigital.com/TaborAcademyLogoFinal.png" alt="Tabor Academy Logo" class="logo" />
          <div class="title">Welcome to Tabor Academy!</div>
          <div class="subtitle">Your journey to digital excellence starts now</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName}!</div>
          <p>Welcome to Tabor Academy! We're thrilled to have you join our community of learners and innovators.</p>
          <div class="highlight">
            <strong>Your Role:</strong> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}<br>
            <strong>Account Status:</strong> Active and Ready to Learn
          </div>
          <h3 style="margin-top: 32px; color: #FF6B35;">🚀 What's Next?</h3>
          <ul>
            <li><strong>Explore Courses:</strong> Browse our extensive catalog of digital skills courses</li>
            <li><strong>Complete Your Profile:</strong> Add your interests and learning goals</li>
            <li><strong>Join the Community:</strong> Connect with fellow learners and mentors</li>
            <li><strong>Start Learning:</strong> Enroll in your first course and begin your journey</li>
          </ul>
          <div style="text-align: center;">
            <a href="https://academy.tabordigital.com/dashboard" class="button">Go to Your Dashboard</a>
          </div>
          <h3 style="margin-top: 32px; color: #4ECDC4;">💡 Quick Tips</h3>
          <ul class="quick-tips">
            <li>Set up your learning preferences in your dashboard</li>
            <li>Check out our recommended courses for beginners</li>
            <li>Join study groups to connect with peers</li>
            <li>Download our mobile app for learning on the go</li>
          </ul>
          <p style="margin-top: 32px;">If you have any questions or need assistance, don't hesitate to reach out to our support team. We're here to help you succeed!</p>
          <p style="margin-top: 24px;">Happy learning!<br><strong>The Tabor Academy Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2024 Tabor Academy. All rights reserved.</p>
          <p>This email was sent to you as part of your Tabor Academy membership.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateWelcomeEmailText(userName: string, userRole: string): string {
  return `
Welcome to Tabor Academy! 🎉

Hello ${userName}!

Welcome to Tabor Academy! We're thrilled to have you join our community of learners and innovators.

Your Role: ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}
Account Status: Active and Ready to Learn

🚀 What's Next?

• Explore Courses: Browse our extensive catalog of digital skills courses
• Complete Your Profile: Add your interests and learning goals  
• Join the Community: Connect with fellow learners and mentors
• Start Learning: Enroll in your first course and begin your journey

💡 Quick Tips

• Set up your learning preferences in your dashboard
• Check out our recommended courses for beginners
• Join study groups to connect with peers
• Download our mobile app for learning on the go

Visit your dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard

If you have any questions or need assistance, don't hesitate to reach out to our support team. We're here to help you succeed!

Happy learning!
The Tabor Academy Team

© 2025 Tabor Academy. All rights reserved.
  `.trim();
}

function generateConfirmationEmailHTML(userName: string, confirmUrl: string): string {
  return `
    <html>
      <body style="font-family: Inter, Arial, sans-serif; background: #F7F9F9; color: #2C3E50;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #E5E8E8; padding: 32px;">
          <h1 style="color: #FF6B35;">Welcome, ${userName}!</h1>
          <p>Thank you for registering at Tabor Academy. Please confirm your email address to activate your account.</p>
          <a href="${confirmUrl}" style="display: inline-block; background: linear-gradient(90deg, #FF6B35 0%, #4ECDC4 100%); color: #fff; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 24px 0;">Confirm Email</a>
          <p>If you did not create this account, you can safely ignore this email.</p>
          <p style="color: #6E6C75; font-size: 14px;">&copy; 2024 Tabor Academy</p>
        </div>
      </body>
    </html>
  `;
}

function generateConfirmationEmailText(userName: string, confirmUrl: string): string {
  return `
Welcome, ${userName}!

Thank you for registering at Tabor Academy. Please confirm your email address to activate your account.

Confirm your email: ${confirmUrl}

If you did not create this account, you can safely ignore this email.

© 2024 Tabor Academy
  `.trim();
} 