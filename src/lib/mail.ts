import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
