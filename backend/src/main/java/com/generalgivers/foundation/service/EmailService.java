package com.generalgivers.foundation.service;

import com.generalgivers.foundation.config.EmailConfig;
import com.generalgivers.foundation.dto.contact.ContactRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailConfig emailConfig;
    private final MailerSendService mailerSendService;

    private static final String PRIMARY_COLOR = "#2563eb";
    private static final String PRIMARY_DARK = "#1d4ed8";
    private static final String LOGO_URL = "https://generousgiversfamily.netlify.app/logo/logo.jpg";

    @Async
    public void sendContactEmail(ContactRequest request) {
        try {
            String subject = "[Contact Form] " + request.getSubject();
            String htmlContent = buildContactEmailHtml(request);
            
            mailerSendService.sendEmail(emailConfig.getContactRecipient(), subject, htmlContent);
            log.info("Contact email sent successfully from: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Failed to send contact email: {}", e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async
    public void sendContactConfirmation(ContactRequest request) {
        try {
            String subject = "Thank you for contacting Generous Givers Family";
            String htmlContent = buildConfirmationEmailHtml(request);
            
            mailerSendService.sendEmail(request.getEmail(), subject, htmlContent);
            log.info("Confirmation email sent to: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Failed to send confirmation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String recipientEmail, String firstName, String lastName, String resetToken) {
        try {
            String subject = "Password Reset - Generous Givers Family";
            String htmlContent = buildPasswordResetEmailHtml(firstName, lastName, resetToken);
            
            mailerSendService.sendEmail(recipientEmail, subject, htmlContent);
            log.info("Password reset email sent to: {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
            throw new RuntimeException("Failed to send reset email", e);
        }
    }

    @Async
    public void sendUserCredentials(String recipientEmail, String firstName, String lastName, String temporaryPassword) {
        try {
            log.info("Sending email via MailerSend to: {}", recipientEmail);
            
            String subject = "Welcome to Generous Givers Family - Your Account Details";
            String htmlContent = buildUserCredentialsEmailHtml(firstName, lastName, recipientEmail, temporaryPassword);
            
            mailerSendService.sendEmail(recipientEmail, subject, htmlContent);
            log.info("User credentials email sent successfully to: {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send user credentials email to {}: {}", recipientEmail, e.getMessage(), e);
        }
    }

    @Async
    public void sendDonationReceipt(String recipientEmail, String donorName, BigDecimal amount,
                                     String mpesaReceipt, String projectTitle) {
        try {
            String subject = "Thank you for your donation - Generous Givers Family";
            String htmlContent = buildDonationReceiptHtml(donorName, amount, mpesaReceipt, projectTitle);
            
            mailerSendService.sendEmail(recipientEmail, subject, htmlContent);
            log.info("Donation receipt sent to: {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send donation receipt: {}", e.getMessage());
        }
    }

    private String buildPasswordResetEmailHtml(String firstName, String lastName, String resetToken) {
        String resetUrl = "http://localhost:3000/auth/reset-password/confirm?token=" + resetToken;
        
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td style="background: linear-gradient(135deg, %s 0%%, %s 100%%); padding: 50px 30px; text-align: center;">
                                        <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%%; margin: 0 auto 20px;">
                                            <span style="font-size: 40px; line-height: 80px;">🔐</span>
                                        </div>
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Password Reset Request</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Dear <strong>%s %s</strong>,</p>
                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">We received a request to reset your password for your Generous Givers Family account.</p>
                                        <div style="text-align: center; margin: 32px 0;">
                                            <a href="%s" style="display: inline-block; background: linear-gradient(135deg, %s 0%%, %s 100%%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Reset Your Password</a>
                                        </div>
                                        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 24px 0;">
                                            <p style="color: #92400e; margin: 0; font-size: 14px;"><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.</p>
                                        </div>
                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 24px 0 0 0;">Best regards,<br><strong style="color: %s;">The Generous Givers Family Team</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="color: %s; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Generous Givers Family CBO</p>
                                        <p style="color: #6b7280; margin: 0 0 4px 0; font-size: 13px;">Empowering Communities, Changing Lives</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                PRIMARY_COLOR, PRIMARY_DARK,
                firstName, lastName,
                resetUrl, PRIMARY_COLOR, PRIMARY_DARK,
                PRIMARY_COLOR, PRIMARY_COLOR
            );
    }

    private String buildUserCredentialsEmailHtml(String firstName, String lastName, String email, String temporaryPassword) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, %s 0%%, %s 100%%); padding: 50px 30px; text-align: center;">
                                        <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%%; margin: 0 auto 20px;">
                                            <span style="font-size: 40px; line-height: 80px;">🎉</span>
                                        </div>
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Generous Givers Family!</h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Dear <strong>%s %s</strong>,</p>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">Welcome to the Generous Givers Family! Your account has been created and you can now access our member portal.</p>

                                        <!-- Credentials Card -->
                                        <div style="background: linear-gradient(135deg, #f0fdf4 0%%, #dcfce7 100%%); border-radius: 16px; padding: 30px; margin: 24px 0;">
                                            <h3 style="color: %s; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">Your Login Credentials</h3>
                                            
                                            <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="120" style="padding: 12px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Email:</td>
                                                    <td style="padding: 12px 0; color: #111827; font-size: 14px; font-weight: 600; font-family: monospace; background-color: rgba(255,255,255,0.7); padding: 8px 12px; border-radius: 6px;">%s</td>
                                                </tr>
                                                <tr>
                                                    <td width="120" style="padding: 12px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Password:</td>
                                                    <td style="padding: 12px 0; color: #111827; font-size: 14px; font-weight: 600; font-family: monospace; background-color: rgba(255,255,255,0.7); padding: 8px 12px; border-radius: 6px;">%s</td>
                                                </tr>
                                            </table>
                                        </div>

                                        <!-- Important Notice -->
                                        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 24px 0;">
                                            <div style="display: flex; align-items: start; gap: 12px;">
                                                <span style="font-size: 20px;">⚠️</span>
                                                <div>
                                                    <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Important Security Notice</h4>
                                                    <p style="color: #92400e; margin: 0; font-size: 13px; line-height: 1.5;">This is a temporary password. You will be required to change it upon your first login for security purposes.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Login Button -->
                                        <div style="text-align: center; margin: 32px 0;">
                                            <a href="https://generousgiversfamily.netlify.app/auth/login" style="display: inline-block; background: linear-gradient(135deg, %s 0%%, %s 100%%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">Access Member Portal</a>
                                        </div>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 24px 0 0 0;">
                                            We're excited to have you as part of our mission to serve humanity.<br><br>
                                            With warm regards,<br>
                                            <strong style="color: %s;">The Generous Givers Family Team</strong>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="color: %s; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Generous Givers Family CBO</p>
                                        <p style="color: #6b7280; margin: 0 0 4px 0; font-size: 13px;">Empowering Communities, Changing Lives</p>
                                        <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 12px; font-style: italic;">"Service to Humanity is Service to God"</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                PRIMARY_COLOR, PRIMARY_DARK,
                firstName, lastName,
                PRIMARY_COLOR,
                email, temporaryPassword,
                PRIMARY_COLOR, PRIMARY_DARK,
                PRIMARY_COLOR,
                PRIMARY_COLOR
            );
    }

    private String buildContactEmailHtml(ContactRequest request) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a"));

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, %s 0%%, %s 100%%); padding: 40px 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Contact Form Submission</h1>
                                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Received on %s</p>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <!-- Sender Info Card -->
                                        <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                                            <tr>
                                                <td>
                                                    <h2 style="color: %s; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Sender Information</h2>

                                                    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td width="100" style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Name:</td>
                                                            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">%s</td>
                                                        </tr>
                                                        <tr>
                                                            <td width="100" style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Email:</td>
                                                            <td style="padding: 8px 0;"><a href="mailto:%s" style="color: %s; text-decoration: none; font-size: 14px;">%s</a></td>
                                                        </tr>
                                                        <tr>
                                                            <td width="100" style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Phone:</td>
                                                            <td style="padding: 8px 0; color: #111827; font-size: 14px;">%s</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Subject -->
                                        <div style="margin-bottom: 24px;">
                                            <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</h3>
                                            <p style="color: #111827; margin: 0; font-size: 16px; font-weight: 500;">%s</p>
                                        </div>

                                        <!-- Message -->
                                        <div>
                                            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
                                            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid %s; border-radius: 8px; padding: 20px;">
                                                <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">%s</p>
                                            </div>
                                        </div>

                                        <!-- Reply Button -->
                                        <div style="margin-top: 32px; text-align: center;">
                                            <a href="mailto:%s?subject=Re: %s" style="display: inline-block; background: linear-gradient(135deg, %s 0%%, %s 100%%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">Reply to %s</a>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="color: #6b7280; margin: 0; font-size: 13px;">Generous Givers Family CBO</p>
                                        <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">This is an automated notification from your website contact form.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                PRIMARY_COLOR, PRIMARY_DARK, timestamp,
                PRIMARY_COLOR,
                request.getName(),
                request.getEmail(), PRIMARY_COLOR, request.getEmail(),
                request.getPhone() != null ? request.getPhone() : "Not provided",
                request.getSubject(),
                PRIMARY_COLOR, request.getMessage(),
                request.getEmail(), request.getSubject(), PRIMARY_COLOR, PRIMARY_DARK, request.getName()
            );
    }

    private String buildConfirmationEmailHtml(ContactRequest request) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, %s 0%%, %s 100%%); padding: 50px 30px; text-align: center;">
                                        <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                            <span style="font-size: 40px;">✉️</span>
                                        </div>
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Message Received!</h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Dear <strong>%s</strong>,</p>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Thank you for reaching out to Generous Givers Family. We have received your message regarding:</p>

                                        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                                            <p style="color: %s; margin: 0; font-size: 16px; font-weight: 600;">"%s"</p>
                                        </div>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Our team will review your message and get back to you as soon as possible, typically within <strong>1-2 business days</strong>.</p>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">If your inquiry is urgent, please don't hesitate to contact us directly.</p>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 32px 0 0 0;">
                                            With warm regards,<br>
                                            <strong style="color: %s;">The Generous Givers Family Team</strong>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="color: %s; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Generous Givers Family CBO</p>
                                        <p style="color: #6b7280; margin: 0 0 4px 0; font-size: 13px;">Empowering Communities, Changing Lives</p>
                                        <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 12px; font-style: italic;">"Service to Humanity is Service to God"</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(PRIMARY_COLOR, PRIMARY_DARK, request.getName(), PRIMARY_COLOR, request.getSubject(), PRIMARY_COLOR, PRIMARY_COLOR);
    }

    private String buildDonationReceiptHtml(String donorName, BigDecimal amount,
                                            String mpesaReceipt, String projectTitle) {
        String projectInfo = projectTitle != null
            ? "Your donation will support: <strong>" + projectTitle + "</strong>"
            : "Your donation will be used to support our various community initiatives.";

        String formattedAmount = String.format("%,.2f", amount);

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, %s 0%%, %s 100%%); padding: 50px 30px; text-align: center;">
                                        <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%%; margin: 0 auto 20px;">
                                            <span style="font-size: 40px; line-height: 80px;">❤️</span>
                                        </div>
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Thank You for Your Donation!</h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Dear <strong>%s</strong>,</p>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">Thank you for your generous donation to Generous Givers Family. Your support means the world to us and the communities we serve.</p>

                                        <!-- Amount Card -->
                                        <div style="background: linear-gradient(135deg, #f0fdf4 0%%, #dcfce7 100%%); border-radius: 16px; padding: 30px; text-align: center; margin: 24px 0;">
                                            <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Donation Amount</p>
                                            <p style="color: %s; margin: 0; font-size: 36px; font-weight: 700;">KES %s</p>
                                        </div>

                                        <!-- Receipt Info -->
                                        <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">
                                            <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="140" style="padding: 8px 0; color: #6b7280; font-size: 14px;">M-Pesa Receipt:</td>
                                                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">%s</td>
                                                </tr>
                                                <tr>
                                                    <td width="140" style="padding: 8px 0; color: #6b7280; font-size: 14px;">Purpose:</td>
                                                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">%s</td>
                                                </tr>
                                            </table>
                                        </div>

                                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0; padding: 16px; background-color: #fef3c7; border-radius: 8px;">
                                            📋 <strong>Tax Receipt:</strong> Your donation may be tax-deductible. Please keep this email as your receipt for your records.
                                        </p>

                                        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 24px 0 0 0;">
                                            With heartfelt gratitude,<br>
                                            <strong style="color: %s;">The Generous Givers Family Team</strong>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="color: %s; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Generous Givers Family CBO</p>
                                        <p style="color: #6b7280; margin: 0 0 4px 0; font-size: 13px;">Empowering Communities, Changing Lives</p>
                                        <p style="color: #9ca3af; margin: 16px 0 0 0; font-size: 12px; font-style: italic;">"Service to Humanity is Service to God"</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                PRIMARY_COLOR, PRIMARY_DARK,
                donorName != null ? donorName : "Friend",
                PRIMARY_COLOR, formattedAmount,
                mpesaReceipt != null ? mpesaReceipt : "N/A",
                projectInfo,
                PRIMARY_COLOR,
                PRIMARY_COLOR
            );
    }
}
