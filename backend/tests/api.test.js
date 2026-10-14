jest.mock('../src/utils/sanitizeHtml', () => (str) => str || '');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const env = require('../src/config/env');
const Admin = require('../src/models/Admin');
const Product = require('../src/models/Product');
const Blog = require('../src/models/Blog');
const Enquiry = require('../src/models/Enquiry');
const CompanySettings = require('../src/models/CompanySettings');

describe('Anant Metal Finishers API Integration Tests', () => {
  let adminToken = '';
  let adminUser = null;

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);

    // Create a dedicated test admin
    await Admin.deleteMany({ email: 'testadmin@anantmetalfinishers.com' });
    adminUser = await Admin.create({
      name: 'Test Administrator',
      email: 'testadmin@anantmetalfinishers.com',
      password: 'TestPassword123!',
      role: 'superadmin',
      isActive: true
    });
  });

  afterAll(async () => {
    if (adminUser) {
      await Admin.deleteOne({ _id: adminUser._id });
    }
    await Enquiry.deleteMany({ email: 'test.enquiry@example.com' });
    await Product.deleteMany({ slug: 'test-created-service' });
    await Blog.deleteMany({ slug: 'test-created-blog' });
    await mongoose.disconnect();
  });

  describe('Health & Public Company Information', () => {
    it('GET /api/v1/health should return status healthy and company details', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.company).toBe('Anant Metal Finishers');
      expect(res.body.brand).toBe('AMP');
      expect(res.body.location).toContain('MIDC Ambad, Nashik');
    });

    it('GET /api/v1/settings/public should return factual company settings and exclude internal fields', async () => {
      const res = await request(app).get('/api/v1/settings/public');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.companyName).toBe('Anant Metal Finishers');
      expect(res.body.data.locationAddress.city).toBe('Nashik');
      expect(res.body.data.locationAddress.postalCode).toBe('422010');
      // Must not expose internal notification email or password
      expect(res.body.data.contactNotificationEmail).toBeUndefined();
    });
  });

  describe('Authentication & Authorization', () => {
    it('POST /api/v1/auth/login should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testadmin@anantmetalfinishers.com',
          password: 'WrongPassword'
        });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/auth/login should succeed and set HttpOnly cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testadmin@anantmetalfinishers.com',
          password: 'TestPassword123!'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('testadmin@anantmetalfinishers.com');
      expect(res.body.user.password).toBeUndefined();
      
      adminToken = res.body.token;

      // Verify cookie header
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const hasTokenCookie = cookies.some(c => c.includes('amp_token='));
      expect(hasTokenCookie).toBe(true);
    });

    it('GET /api/v1/auth/me should return current admin when authorized', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('testadmin@anantmetalfinishers.com');
    });

    it('Admin endpoints should reject unauthorized requests with 401', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Catalogue & Strict Verification Filter', () => {
    it('GET /api/v1/products should only return verified and published items', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      // Verify every returned item is strictly verified and published
      res.body.data.forEach((item) => {
        expect(item.isPublished).toBe(true);
        expect(item.isVerified).toBe(true);
      });

      // Verify unverified drafts like 'zinc-plating-job-work' are NOT returned
      const unverifiedFound = res.body.data.some(i => i.slug === 'zinc-plating-job-work');
      expect(unverifiedFound).toBe(false);
    });

    it('GET /api/v1/products/:slug should return 404 for unverified draft item', async () => {
      const res = await request(app).get('/api/v1/products/zinc-plating-job-work');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/products/:slug should return 200 for confirmed electroplating job work', async () => {
      const res = await request(app).get('/api/v1/products/electroplating-job-work');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toContain('Electroplating');
    });
  });

  describe('Public Enquiry & Quote Submissions', () => {
    it('POST /api/v1/contact should validate required fields and privacy consent', async () => {
      const res = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'T', // Too short
          email: 'not-an-email'
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('POST /api/v1/contact should successfully record enquiry and issue reference number', async () => {
      const res = await request(app)
        .post('/api/v1/contact')
        .send({
          name: 'Precision Components India',
          companyName: 'PCI Machining Works',
          email: 'test.enquiry@example.com',
          phone: '+91 98230 00000',
          message: 'Enquiry regarding batch electroplating finishing requirements for steel pins.',
          consentGiven: true
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.referenceNumber).toMatch(/^AMP-ENQ-2026-/);
    });

    it('POST /api/v1/quotes should record quote request with specifications', async () => {
      const res = await request(app)
        .post('/api/v1/quotes')
        .send({
          name: 'Nashik Auto Components',
          companyName: 'NAC Engineering',
          email: 'test.enquiry@example.com',
          phone: '+91 98220 11111',
          relatedProductOrService: 'Electroplating Job Work',
          requirements: {
            componentName: 'Shaft Sleeve Bushing M24',
            estimatedQuantity: '2000 pcs / month',
            material: 'EN1A Mild Steel',
            requiredFinish: 'Protective metal finish',
            targetDate: '2026-11-15',
            additionalNotes: 'Requires uniform coating thickness per drawing tolerances.'
          },
          consentGiven: true
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.referenceNumber).toMatch(/^AMP-QUO-2026-/);
    });
  });

  describe('Admin Operations', () => {
    it('GET /api/v1/admin/dashboard should return operational metrics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.products.total).toBeGreaterThanOrEqual(1);
      expect(res.body.data.enquiries.total).toBeGreaterThanOrEqual(1);
    });

    it('Admin can create, update, and delete a service', async () => {
      // Create
      const createRes = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Created Service',
          slug: 'test-created-service',
          category: 'Metal Finishing',
          summary: 'A test service entry created during automated verification.',
          description: 'Detailed description of the test service created by automated test suite.',
          isVerified: false,
          isPublished: false
        });
      expect(createRes.status).toBe(201);
      const createdId = createRes.body.data._id;

      // Update
      const updateRes = await request(app)
        .patch(`/api/v1/admin/products/${createdId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          summary: 'Updated summary for the test service.'
        });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.summary).toBe('Updated summary for the test service.');

      // Delete
      const deleteRes = await request(app)
        .delete(`/api/v1/admin/products/${createdId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
    });

    it('Admin can export enquiries to CSV', async () => {
      const res = await request(app)
        .get('/api/v1/admin/enquiries/export')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Reference Number');
    });
  });
});
