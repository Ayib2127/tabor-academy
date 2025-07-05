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

function generateWelcomeEmailHTML(userName: string, userRole: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Tabor Academy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Tabor Academy!</h1>
          <p>Your journey to digital excellence starts now</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName}!</h2>
          
          <p>Welcome to Tabor Academy! We're thrilled to have you join our community of learners and innovators.</p>
          
          <div class="highlight">
            <strong>Your Role:</strong> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}<br>
            <strong>Account Status:</strong> Active and Ready to Learn
          </div>
          
          <h3>🚀 What's Next?</h3>
          <ul>
            <li><strong>Explore Courses:</strong> Browse our extensive catalog of digital skills courses</li>
            <li><strong>Complete Your Profile:</strong> Add your interests and learning goals</li>
            <li><strong>Join the Community:</strong> Connect with fellow learners and mentors</li>
            <li><strong>Start Learning:</strong> Enroll in your first course and begin your journey</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" class="button">
              Go to Your Dashboard
            </a>
          </div>
          
          <h3>💡 Quick Tips</h3>
          <ul>
            <li>Set up your learning preferences in your dashboard</li>
            <li>Check out our recommended courses for beginners</li>
            <li>Join study groups to connect with peers</li>
            <li>Download our mobile app for learning on the go</li>
          </ul>
          
          <p>If you have any questions or need assistance, don't hesitate to reach out to our support team. We're here to help you succeed!</p>
          
          <p>Happy learning!<br>
          <strong>The Tabor Academy Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2024 Tabor Academy. All rights reserved.</p>
          <p>This email was sent to ${userEmail}</p>
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

© 2024 Tabor Academy. All rights reserved.
  `.trim();
} 