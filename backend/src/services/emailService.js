const { getTransporter } = require('../config/email');
const env = require('../config/env');
const logger = require('../utils/logger');

const sendEnquiryNotification = async (enquiry, settings = null) => {
  const transporter = getTransporter();
  const recipient = (settings && settings.contactNotificationEmail) || env.NOTIFICATION_EMAIL;

  if (!transporter || !recipient) {
    logger.info(`Email sending bypassed for enquiry ${enquiry.referenceNumber} (SMTP or notification email unconfigured).`);
    return { success: false, reason: 'SMTP or recipient email not configured' };
  }

  const subject = `[${enquiry.enquiryType.toUpperCase()}] New enquiry received - Ref: ${enquiry.referenceNumber}`;
  
  let requirementsHtml = '';
  if (enquiry.enquiryType === 'quote' && enquiry.requirements) {
    requirementsHtml = `
      <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <h3 style="margin-top: 0; color: #1e293b;">Component Quote Specifications:</h3>
        <p><strong>Component / Service:</strong> ${enquiry.requirements.componentName || 'N/A'}</p>
        <p><strong>Estimated Quantity:</strong> ${enquiry.requirements.estimatedQuantity || 'N/A'}</p>
        <p><strong>Material:</strong> ${enquiry.requirements.material || 'N/A'}</p>
        <p><strong>Required Finish:</strong> ${enquiry.requirements.requiredFinish || 'N/A'}</p>
        <p><strong>Target Date:</strong> ${enquiry.requirements.targetDate || 'N/A'}</p>
        <p><strong>Additional Notes:</strong> ${enquiry.requirements.additionalNotes || 'N/A'}</p>
      </div>
    `;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #334155; line-height: 1.6;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 6px 6px 0 0;">
        <h2 style="margin: 0;">Anant Metal Finishers (AMF)</h2>
        <p style="margin: 4px 0 0; font-size: 14px; color: #94a3b8;">New Industrial Job-Work Enquiry</p>
      </div>
      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 6px 6px;">
        <p><strong>Reference Number:</strong> <span style="font-family: monospace; font-size: 16px; color: #0284c7;">${enquiry.referenceNumber}</span></p>
        <p><strong>Customer Name:</strong> ${enquiry.name}</p>
        <p><strong>Company:</strong> ${enquiry.companyName || 'Not specified'}</p>
        <p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>
        <p><strong>Phone:</strong> ${enquiry.phone || 'Not specified'}</p>
        <p><strong>Related Service:</strong> ${enquiry.relatedProductOrService || 'General Metal Finishing'}</p>
        
        ${requirementsHtml}

        <div style="margin-top: 16px;">
          <h4 style="margin-bottom: 6px; color: #1e293b;">Message / Notes:</h4>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-left: 3px solid #0284c7;">${enquiry.message || 'No additional message provided.'}</p>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
          This message was sent automatically from the Anant Metal Finishers website portal (G-8, MIDC Ambad, Nashik).
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Anant Metal Finishers" <${env.EMAIL_FROM}>`,
      to: recipient,
      replyTo: enquiry.email,
      subject,
      html
    });

    logger.info(`Notification email dispatched successfully for ref: ${enquiry.referenceNumber}`, { messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send notification email for ref: ${enquiry.referenceNumber}`, { error: error.message });
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEnquiryNotification
};
