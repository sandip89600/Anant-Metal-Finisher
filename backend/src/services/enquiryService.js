const Enquiry = require('../models/Enquiry');
const CompanySettings = require('../models/CompanySettings');
const generateReferenceNumber = require('../utils/referenceGenerator');
const { sendEnquiryNotification } = require('./emailService');
const logger = require('../utils/logger');

const createEnquiry = async (data, ipAddress = '') => {
  // Check for duplicate submission within 2 minutes with identical email and message/component
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const duplicateQuery = {
    email: data.email.toLowerCase(),
    createdAt: { $gte: twoMinutesAgo }
  };

  if (data.enquiryType === 'quote') {
    duplicateQuery['requirements.componentName'] = data.requirements?.componentName;
  } else {
    duplicateQuery.message = data.message;
  }

  const existingRecent = await Enquiry.findOne(duplicateQuery);
  if (existingRecent) {
    const error = new Error('A matching enquiry was recently submitted. Please wait a moment before submitting again.');
    error.statusCode = 429;
    throw error;
  }

  // Generate unique reference number
  const prefix = data.enquiryType === 'quote' ? 'AMF-QUO' : 'AMF-ENQ';
  let referenceNumber = generateReferenceNumber(prefix);
  
  // Ensure uniqueness
  while (await Enquiry.findOne({ referenceNumber })) {
    referenceNumber = generateReferenceNumber(prefix);
  }

  // Create new enquiry record
  const newEnquiry = new Enquiry({
    referenceNumber,
    name: data.name,
    companyName: data.companyName || '',
    email: data.email.toLowerCase(),
    phone: data.phone || '',
    enquiryType: data.enquiryType || 'contact',
    relatedProductOrService: data.relatedProductOrService || '',
    message: data.message || `Quote request for ${data.requirements?.componentName || 'component finishing'}`,
    requirements: data.requirements || {},
    consentGiven: data.consentGiven,
    ipAddress,
    status: 'new'
  });

  const savedEnquiry = await newEnquiry.save();

  // Try to send email notification in background
  try {
    const settings = await CompanySettings.findOne();
    const emailResult = await sendEnquiryNotification(savedEnquiry, settings);

    if (emailResult.success) {
      savedEnquiry.emailSent = true;
    } else {
      savedEnquiry.emailSent = false;
      savedEnquiry.emailError = emailResult.error || emailResult.reason || 'Email not sent';
    }
    await savedEnquiry.save();
  } catch (emailErr) {
    logger.error('Error during email dispatch step', { error: emailErr.message, ref: savedEnquiry.referenceNumber });
    savedEnquiry.emailSent = false;
    savedEnquiry.emailError = emailErr.message;
    await savedEnquiry.save();
  }

  return savedEnquiry;
};

module.exports = {
  createEnquiry
};
