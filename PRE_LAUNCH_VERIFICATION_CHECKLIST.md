# Anant Metal Finishers (AMF) - Pre-Launch Verification Checklist

This document details the checklist of real business information that the business management of **Anant Metal Finishers** must review, verify, and input via the Admin Dashboard (`/admin/settings`) prior to public marketing or production launch.

In adherence to strict factual accuracy standards, no unverified contact details, certifications, or bath capabilities have been fabricated or published.

---

## 1. Verified Core Information (Pre-Configured)
The following details are confirmed and initialized in the database:
- [x] **Company Name:** Anant Metal Finishers
- [x] **Brand Abbreviation:** AMF
- [x] **Business Category:** Industrial metal finishing and electroplating job work
- [x] **Workshop Address:** Plot G-8, MIDC Ambad, Nashik, Maharashtra, India – 422010
- [x] **Initial Verified Capability:** Industrial Electroplating Job Work
- [x] **Google Maps Navigation:** Pinpointed to G-8, MIDC Ambad, Nashik (422010)

---

## 2. Information to Verify & Configure Before Launch

### A. Workshop Contact & Operations
- [ ] **Official Contact Telephone:** Enter verified landline or workshop phone number in Admin Settings (`phone`).
- [ ] **WhatsApp Business Number:** Provide the active WhatsApp number for component drawing receipt (`whatsappNumber`).
- [ ] **Official Email Address:** Provide verified corporate or domain email (e.g., `info@anantmetalfinishers.com` or `contact@anantmetalfinishers.com`).
- [ ] **Enquiry Notification Email:** Set `contactNotificationEmail` to the procurement/operations email that will receive quote submissions.
- [ ] **Workshop Working Hours:** Specify actual shift / operational hours (e.g. *Monday – Saturday: 9:00 AM – 6:30 PM*).
- [ ] **GST Number:** Enter the verified GSTIN if the business wishes it displayed on invoices and public portal.

### B. Chemical Bath & Technical Finishing Capabilities
*Strict Rule: Treat zinc plating, barrel plating, and all specific processes as unconfirmed until shop supervisor verifies tank sizes and chemical baths.*
- [ ] **Zinc Plating (Acid / Alkaline / Cyanide-free):** If operating, verify bath tank volume, compatible passivations (trivalent blue, yellow, black), toggle `isVerified = true` and `isPublished = true` in `/admin/products`.
- [ ] **Barrel Plating:** If active for small fasteners, verify barrel load capacity (kg), mesh size, toggle `isVerified = true` and `isPublished = true`.
- [ ] **Rack Plating Tank Dimensions:** Confirm maximum component length, width, and weight capacity for hanging fixtures.
- [ ] **Pretreatment Stages:** Confirm active degreasing, ultrasonic cleaning, or acid pickling line capabilities.

### C. Company Background & Leadership
- [ ] **Proprietor / Partner Details:** Verify names of authorized leadership if they wish to be listed.
- [ ] **Company History / Year of Establishment:** Only input the confirmed year in company settings; do not estimate or invent years of operation.
- [ ] **Certifications / Approvals:** If ISO 9001, IATF, or automotive OEM vendor approvals exist, upload actual certificate documents before claiming certification. Never claim unconfirmed ISO compliance.

### D. Outbound Email & Domain Setup
- [ ] **Domain DNS Records:** Point `anantmetalfinishers.com` and `www` to production frontend host (e.g. Vercel).
- [ ] **Backend API Subdomain:** Point `api.anantmetalfinishers.com` to production persistent host (e.g. Render / DigitalOcean).
- [ ] **SMTP Outbound Credentials:** Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` in backend `.env` so quotation alerts are automatically dispatched to operations.
- [ ] **Initial Administrator Credentials:** Run `node scripts/seedAdmin.js` with secure environment variables and immediately update the initial password through `/admin/settings` after initial login.

---

## 3. Launch Sign-Off
| Field | Confirmed Value | Verified By | Verification Date |
| :--- | :--- | :--- | :--- |
| **Phone Number** | `[Pending verification]` | | |
| **Workshop Email** | `[Pending verification]` | | |
| **Active Plating Baths** | `[Electroplating Job Work]` | | |
| **Notification Recipient** | `[Pending verification]` | | |
