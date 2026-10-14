# Anant Metal Finishers (AMP) - API Documentation & Testing Guide

Base URL: `http://localhost:5000/api/v1`  
Production URL: `https://api.anantmetalfinishers.com/api/v1`

---

## 1. System Health & Public Information

### Health Check
- **Endpoint:** `GET /api/v1/health`
- **Access:** Public
- **Description:** Verifies service uptime and server status.
- **Example Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-10-14T08:00:00.000Z",
  "uptime": 124.5,
  "company": "Anant Metal Finishers",
  "brand": "AMP",
  "location": "MIDC Ambad, Nashik, Maharashtra"
}
```

### Public Company Settings
- **Endpoint:** `GET /api/v1/settings/public`
- **Access:** Public
- **Description:** Returns non-sensitive company information, workshop address, and verified capabilities.
- **Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "companyName": "Anant Metal Finishers",
    "brandAbbreviation": "AMP",
    "businessCategory": "Industrial metal finishing and electroplating job work",
    "locationAddress": {
      "street": "G-8, MIDC Ambad",
      "city": "Nashik",
      "state": "Maharashtra",
      "country": "India",
      "postalCode": "422010"
    },
    "verifiedCapabilities": [
      "Electroplating Job Work",
      "Industrial Metal Finishing"
    ]
  }
}
```

---

## 2. Public Catalogue Endpoints

### List Verified & Published Products/Services
- **Endpoint:** `GET /api/v1/products`
- **Query Parameters:**
  - `category` (optional, string)
  - `search` (optional, string)
  - `page` (optional, number, default: 1)
  - `limit` (optional, number, default: 12)
- **Note:** Strictly filters by `{ isPublished: true, isVerified: true }`. Unverified drafts never leak.
- **Example Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "670cde...",
      "name": "Industrial Electroplating Job Work",
      "slug": "electroplating-job-work",
      "category": "Electroplating Job Work",
      "summary": "Commercial electroplating job work for engineering components.",
      "isVerified": true,
      "isPublished": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 1,
    "pages": 1
  }
}
```

### Get Single Product/Service by Slug
- **Endpoint:** `GET /api/v1/products/:slug`
- **Access:** Public
- **Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "name": "Industrial Electroplating Job Work",
    "slug": "electroplating-job-work",
    "description": "...",
    "materials": ["Steel", "Iron", "Machined Components"],
    "technicalSpecs": [
      { "label": "Facility Location", "value": "G-8, MIDC Ambad, Nashik" }
    ]
  },
  "related": []
}
```

---

## 3. Public Enquiry & Quote Endpoints

### Submit Contact Enquiry
- **Endpoint:** `POST /api/v1/contact`
- **Rate Limit:** 15 requests per 10 minutes per IP
- **Payload:**
```json
{
  "name": "Precision Engineering Works",
  "companyName": "PEW India",
  "email": "procurement@pew.com",
  "phone": "+91 98220 00000",
  "enquiryType": "contact",
  "message": "Enquiry regarding job-work lead times for machined pins.",
  "consentGiven": true
}
```
- **Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Your enquiry has been received successfully. Our team will review your requirements.",
  "referenceNumber": "AMP-ENQ-2026-A1B2C3456",
  "createdAt": "2026-10-14T08:05:00.000Z"
}
```

### Submit Quote Request
- **Endpoint:** `POST /api/v1/quotes`
- **Rate Limit:** 15 requests per 10 minutes per IP
- **Payload:**
```json
{
  "name": "Sahyadri Auto Components",
  "companyName": "SAC Nashik",
  "email": "vendor@sac.com",
  "phone": "+91 98230 11111",
  "enquiryType": "quote",
  "requirements": {
    "componentName": "Shaft Bushing M24",
    "estimatedQuantity": "3000 pcs / month",
    "material": "EN1A Mild Steel",
    "requiredFinish": "Electroplating Job Work",
    "targetDate": "2026-11-20",
    "additionalNotes": "Tight tolerance on internal bore."
  },
  "consentGiven": true
}
```
- **Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Your request for quote has been submitted. Our technical team will review your component specifications.",
  "referenceNumber": "AMP-QUO-2026-D4E5F7890",
  "createdAt": "2026-10-14T08:06:00.000Z"
}
```

---

## 4. Authentication Endpoints

### Admin Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Rate Limit:** 10 attempts per 15 minutes
- **Payload:**
```json
{
  "email": "admin@anantmetalfinishers.com",
  "password": "YourSecurePassword"
}
```
- **Response:** Sets HttpOnly cookie `amp_token` and returns token + user profile.

### Current Admin Profile
- **Endpoint:** `GET /api/v1/auth/me`
- **Headers:** Cookie `amp_token` or `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "user": {
    "id": "670c...",
    "name": "AMP Operations Desk",
    "email": "admin@anantmetalfinishers.com",
    "role": "superadmin"
  }
}
```

### Admin Logout
- **Endpoint:** `POST /api/v1/auth/logout`
- **Response:** Clears HttpOnly cookie `amp_token`.

---

## 5. Admin Protected Operations (`/api/v1/admin/*`)

Requires valid JWT via HttpOnly cookie or Bearer token header.

### Dashboard Metrics
- `GET /api/v1/admin/dashboard`
  - Returns counts for published/draft products, published/draft blogs, enquiries by status (`new`, `in_progress`, `completed`), and recent records.

### Products & Services Management
- `GET /api/v1/admin/products` — Filter by `status` (all/published/draft) and `verified` (all/verified/unverified).
- `POST /api/v1/admin/products` — Create service.
- `GET /api/v1/admin/products/:id` — Inspect service.
- `PATCH /api/v1/admin/products/:id` — Update service / toggle verification.
- `DELETE /api/v1/admin/products/:id` — Delete service.

### Enquiry & Quotation Management
- `GET /api/v1/admin/enquiries` — Filter by `status` (`new`, `in_progress`, `completed`, `spam`), `type` (`quote`, `contact`), or search text.
- `GET /api/v1/admin/enquiries/export` — Stream filtered enquiries directly as a standard RFC-4180 CSV spreadsheet.
- `GET /api/v1/admin/enquiries/:id` — View details with internal notes.
- `PATCH /api/v1/admin/enquiries/:id/status` — Update status.
- `POST /api/v1/admin/enquiries/:id/notes` — Add internal note.

### Company Settings Management
- `GET /api/v1/admin/settings` — Returns full editable company configuration.
- `PATCH /api/v1/admin/settings` — Update company settings.

---

## 6. cURL Testing Quick Reference

```bash
# 1. Health Check
curl http://localhost:5000/api/v1/health

# 2. Get Public Services
curl http://localhost:5000/api/v1/products

# 3. Submit Quote Enquiry
curl -X POST http://localhost:5000/api/v1/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Precision Tools",
    "email": "test@example.com",
    "phone": "9822000000",
    "requirements": {
      "componentName": "Steel Flange Pin",
      "quantity": "500 pcs",
      "material": "EN8"
    },
    "consentGiven": true
  }'

# 4. Admin Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@anantmetalfinishers.com",
    "password": "AmpNashik@2026AdminSecure!"
  }'
```
