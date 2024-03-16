import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`

  await resend.emails.send({
    from: `onboarding@flocker.top`,
    to: email,
    subject: 'Flocker - Reset your password',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p>We've received a request to reset your password for your account. To complete the process, please follow the instructions below:</p>
      <ol>
        <li>Click on the following link to reset your password: <a href="${resetLink}">Reset Password</a></li>
        <li>If you can't click the link, copy and paste it into your browser's address bar.</li>
        <li>Follow the on-screen instructions to create a new password.</li>
      </ol>
      <p>Please note: This link is only valid for 3 hours. After this period, you'll need to request another password reset.</p>
      <p>Thank you,<br>Flocker team</p>
    </div>
    `,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${token}`

  resend.emails.send({
    from: `onboarding@flocker.top`,
    to: email,
    subject: 'Flocker - Verify your account',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p>Thank you for signing up with Flocker. To get started, we just need to verify your email address.</p>
      <p>Please click on the button below to verify your account:</p>
      <p style="text-align: center;"><a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Account</a></p>
      <p>If you can't click the button, you can also copy and paste the following link into your browser's address bar:</p>
      <p>${verificationLink}</p>
      <p>This link will expire in 3 hours.</p>
      <p>Thank you,<br>Flocker team</p>
    </div>
    `,
  })
}
