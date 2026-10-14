const CompanySettings = require('../models/CompanySettings');
const logger = require('../utils/logger');

// PUBLIC: Get public company information
const getPublicSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne().lean();

    if (!settings) {
      // Create initial factual settings document if none exists
      settings = await CompanySettings.create({});
    }

    // Filter out internal non-public fields
    const publicData = {
      companyName: settings.companyName,
      brandAbbreviation: settings.brandAbbreviation,
      businessCategory: settings.businessCategory,
      locationAddress: settings.locationAddress,
      phone: settings.phone,
      whatsappNumber: settings.whatsappNumber,
      email: settings.email,
      workingHours: settings.workingHours,
      aboutStory: settings.aboutStory,
      mission: settings.mission,
      values: settings.values,
      verifiedCapabilities: settings.verifiedCapabilities,
      googleMapsUrl: settings.googleMapsUrl,
      socialLinks: settings.socialLinks,
      seoDefaults: settings.seoDefaults,
      gstNumber: settings.gstNumber // If provided
    };

    res.status(200).json({
      success: true,
      data: publicData
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get full settings
const adminGetSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update settings
const adminUpdateSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    const updated = await settings.save();
    logger.info('Company settings updated by administrator');

    res.status(200).json({
      success: true,
      message: 'Company settings updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSettings,
  adminGetSettings,
  adminUpdateSettings
};
