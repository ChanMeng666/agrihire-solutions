import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "AgriHire <noreply@agrihire.co.nz>";

export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password - AgriHire",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2d7a3a; font-size: 24px; margin: 0;">AgriHire Solutions</h1>
          </div>
          <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
            We received a request to reset your password. Click the button below to choose a new password.
            This link will expire in 30 minutes.
          </p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}"
               style="display: inline-block; background-color: #2d7a3a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.5;">
            If you didn't request this, you can safely ignore this email. Your password will not be changed.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            AgriHire Solutions &mdash; Agricultural Equipment Hire
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false };
  }
}

export async function sendBookingConfirmationEmail(
  email: string,
  bookingId: number,
  total: string
) {
  const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Booking Confirmed #${bookingId} - AgriHire`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2d7a3a; font-size: 24px; margin: 0;">AgriHire Solutions</h1>
          </div>
          <h2 style="font-size: 20px; color: #1a1a1a; margin-bottom: 16px;">Booking Confirmed!</h2>
          <p style="color: #555; line-height: 1.6;">
            Your booking <strong>#${bookingId}</strong> has been confirmed.
          </p>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #555;">Total: <strong style="color: #2d7a3a;">$${total}</strong></p>
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${baseUrl}/my-bookings/${bookingId}"
               style="display: inline-block; background-color: #2d7a3a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Booking
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            AgriHire Solutions &mdash; Agricultural Equipment Hire
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
  }
}
