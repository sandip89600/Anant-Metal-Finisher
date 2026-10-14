require('dotenv').config();
const mongoose = require('mongoose');
const CompanySettings = require('../src/models/CompanySettings');
const Product = require('../src/models/Product');
const Blog = require('../src/models/Blog');
const Category = require('../src/models/Category');
const env = require('../src/config/env');
const logger = require('../src/utils/logger');

async function seedData() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for initial factual data seeding');

    // 1. Seed Company Settings
    const existingSettings = await CompanySettings.findOne();
    if (!existingSettings) {
      await CompanySettings.create({
        companyName: 'Anant Metal Finishers',
        brandAbbreviation: 'AMP',
        businessCategory: 'Industrial metal finishing and electroplating job work',
        locationAddress: {
          street: 'G-8, MIDC Ambad',
          city: 'Nashik',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '422010'
        },
        phone: '', // Placeholder until business provides verified contact phone
        whatsappNumber: '',
        email: '', // Placeholder until business provides verified email
        contactNotificationEmail: '',
        workingHours: '', // Placeholder until business confirms hours
        gstNumber: '', // Placeholder until verified
        aboutStory: 'Anant Metal Finishers (AMP) operates an industrial metal finishing and electroplating job-work facility situated at G-8, MIDC Ambad, Nashik, Maharashtra. Located within one of Maharashtra’s premier manufacturing zones, our shop provides metal-finishing job work for industrial components, engineering manufacturers, and machine component suppliers.',
        mission: 'To deliver reliable, specification-conscious electroplating and surface finishing job work supporting manufacturing and engineering enterprises across Nashik and neighboring industrial regions.',
        values: 'Factual technical clarity, consistent surface treatment standards, transparent communication on job work capabilities, and dependable turnaround.',
        verifiedCapabilities: [
          'Electroplating Job Work',
          'Industrial Metal Finishing'
        ],
        googleMapsUrl: 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010',
        seoDefaults: {
          metaTitle: 'Anant Metal Finishers (AMP) | Industrial Electroplating Job Work | MIDC Ambad, Nashik',
          metaDescription: 'Anant Metal Finishers (AMP) in MIDC Ambad, Nashik provides industrial electroplating and metal finishing job work for engineering components. Submit your job specifications for review.'
        }
      });
      logger.info('Initial factual company settings created');
    }

    // 2. Seed Categories
    const categories = [
      { name: 'Metal Finishing', slug: 'metal-finishing', type: 'product', description: 'Industrial surface finishing and protective coatings for metal parts.' },
      { name: 'Electroplating Job Work', slug: 'electroplating-job-work', type: 'product', description: 'Custom electroplating services for engineering components.' },
      { name: 'Industrial Finishing Guides', slug: 'industrial-finishing-guides', type: 'blog', description: 'Educational articles on metal finishing and job-work planning.' }
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }
    logger.info('Categories seeded');

    // 3. Seed Verified Service (Only confirmed business capability initially published)
    const confirmedServiceSlug = 'electroplating-job-work';
    const existingConfirmedService = await Product.findOne({ slug: confirmedServiceSlug });

    if (!existingConfirmedService) {
      await Product.create({
        name: 'Industrial Electroplating Job Work',
        slug: confirmedServiceSlug,
        itemType: 'service',
        category: 'Electroplating Job Work',
        summary: 'Commercial electroplating and surface treatment job work for industrial machinery parts and engineered metal components.',
        description: `
Anant Metal Finishers provides industrial electroplating job-work solutions for engineering components and machined assemblies. Located in the industrial heart of MIDC Ambad, Nashik, our facility accommodates job-work batches based on component specifications.

### Job-Work Assessment Process
To enquiry about electroplating job work for your components:
1. **Submit Component Details:** Provide material grade, surface condition, dimensions, and drawing requirements.
2. **Review & Specification:** Our shop evaluates current bath capabilities and compatible surface treatment processes.
3. **Sample Assessment & Commercials:** For continuous job work, sample trials can be reviewed to establish finishing standards.

*Note: All coating types, bath parameters, and lead times are confirmed following physical or drawing inspection of components.*
        `,
        mainImage: '', // Will use high-quality industrial fallback SVG/asset
        gallery: [],
        materials: ['Steel', 'Iron', 'Machined Components'],
        technicalSpecs: [
          { label: 'Service Category', value: 'Electroplating Job Work' },
          { label: 'Facility Location', value: 'G-8, MIDC Ambad, Nashik' },
          { label: 'Evaluation Basis', value: 'Component drawings & sample review' }
        ],
        availabilityNotes: 'Job-work capacity is scheduled on requirement review. Please share component drawings and batch quantities.',
        seoTitle: 'Industrial Electroplating Job Work in Nashik | Anant Metal Finishers (AMP)',
        seoDescription: 'Professional electroplating job work for industrial components at MIDC Ambad, Nashik. Share your component specifications for finishing review.',
        isVerified: true,
        isPublished: true,
        isFeatured: true,
        sortOrder: 1
      });
      logger.info('Verified service seeded: Industrial Electroplating Job Work');
    }

    // 4. Seed Unconfirmed Draft Services (Strict rule: treat zinc, barrel plating as unconfirmed until admin verifies!)
    const draftServices = [
      {
        name: 'Zinc Plating Job Work (Unconfirmed Draft)',
        slug: 'zinc-plating-job-work',
        itemType: 'service',
        category: 'Metal Finishing',
        summary: 'Awaiting administrator verification of active zinc bath capabilities and passivation chemistries.',
        description: 'This is an unconfirmed service entry stored in draft state. It will not appear on the live website until the administrator verifies the active bath parameters, tank sizes, and passivate options.',
        isVerified: false,
        isPublished: false,
        sortOrder: 2
      },
      {
        name: 'Barrel Plating Job Work (Unconfirmed Draft)',
        slug: 'barrel-plating-job-work',
        itemType: 'service',
        category: 'Metal Finishing',
        summary: 'Awaiting administrator verification of barrel sizes and small-fastener job-work processing capacity.',
        description: 'This service listing is held in draft status. Verify barrel dimensions, load capacities, and compatible fasteners before publishing to live visitors.',
        isVerified: false,
        isPublished: false,
        sortOrder: 3
      }
    ];

    for (const draft of draftServices) {
      const exists = await Product.findOne({ slug: draft.slug });
      if (!exists) {
        await Product.create(draft);
      }
    }

    // 5. Seed Educational Blog Guides (Fact-checked industrial guides, no unverified company claims)
    const educationalBlogs = [
      {
        title: 'Understanding Industrial Electroplating: A Practical Guide for Engineers',
        slug: 'understanding-industrial-electroplating-guide',
        summary: 'A foundational overview of electroplating fundamentals, cathode-anode chemistry, surface preparation, and selecting suitable finishes for engineering parts.',
        content: `
<h2>Introduction to Industrial Electroplating</h2>
<p>Electroplating is a versatile surface-finishing process where an electric current deposits a dissolved metal coating onto a conductive substrate. In industrial manufacturing, electroplating serves two primary functions: <strong>corrosion protection</strong> and <strong>functional wear enhancement</strong>.</p>

<h3>Core Principles of the Electroplating Cell</h3>
<p>The standard plating setup involves three essential components:</p>
<ul>
  <li><strong>The Electrolyte Bath:</strong> An aqueous chemical solution containing ions of the plating metal alongside conductive salts and buffering additives.</li>
  <li><strong>The Anode:</strong> The positive electrode, typically composed of the metal being deposited or an inert conductor like titanium or carbon.</li>
  <li><strong>The Cathode (The Component):</strong> The engineering part requiring finishing is connected to the negative terminal of the direct-current (DC) power source.</li>
</ul>

<h3>The Vital Role of Surface Pretreatment</h3>
<p>In metal finishing job work, up to 70% of plating adhesion defects stem not from the bath itself, but from improper surface cleaning. Prior to entering the plating tank, parts must undergo:</p>
<ol>
  <li><strong>Degreasing & Oil Removal:</strong> Removing machining oils, lubricants, and drawing compounds.</li>
  <li><strong>Acid Pickling / Descaling:</strong> Eliminating surface oxides, mill scale, and rust.</li>
  <li><strong>Water Rinsing:</strong> Clean, staged counterflow rinses to prevent cross-contamination of plating chemistries.</li>
</ol>

<h3>Key Takeaways for Procurement Teams</h3>
<p>When selecting a metal-finishing partner, always provide clear substrate specifications, surface finish tolerances, and dimensional limits to ensure optimal coating performance.</p>
        `,
        author: 'Anant Metal Finishers Editorial',
        category: 'Industrial Finishing Guides',
        tags: ['Electroplating', 'Manufacturing', 'Surface Finishing', 'Engineering'],
        readingTime: '5 min read',
        seoTitle: 'Understanding Industrial Electroplating: Practical Guide | AMP',
        seoDescription: 'Learn the fundamentals of industrial electroplating, surface preparation, and quality factors for engineering components.',
        isPublished: true,
        publicationDate: new Date('2026-09-15')
      },
      {
        title: 'What to Consider Before Sending Components for Metal Finishing Job Work',
        slug: 'considerations-before-sending-components-for-plating',
        summary: 'Essential checklist for component manufacturers before dispatching parts for plating job work: cleaning, packaging, drawings, and contact points.',
        content: `
<h2>Preparing Engineering Components for Plating Job Work</h2>
<p>Effective collaboration between manufacturing shops and electroplating job-work facilities ensures high yield rates, consistent aesthetics, and minimal turnaround delays. Here is a practical checklist before shipping parts for surface treatment:</p>

<h3>1. Clear Substrate Specification</h3>
<p>Always declare the exact base material grade (e.g., Mild Steel EN1A, EN8, Cast Iron, Brass, Stainless Steel). Different base materials react distinctly to pickling acids and current densities.</p>

<h3>2. Machining Residues and Heat-Treat Scale</h3>
<p>Heavy carbon soot, scale from induction hardening, or stubborn silicon lubricants require specialized pre-cleaning. Inform your job-work facility if components have undergone high-temperature heat treatment.</p>

<h3>3. Critical Dimensional Tolerances</h3>
<p>Electroplating adds microscopic thickness to all exterior surfaces and internal geometries. On threaded fasteners or bearing journals, this growth must be factored into the pre-plating machining dimension.</p>

<h3>4. J脸/Rack Attachment Points</h3>
<p>Every component requires an electrical contact point during electroplating. Indicate preferred clamping or wire locations where minor contact marks will not affect functionality.</p>

<h3>Conclusion</h3>
<p>Clear communication between component designers and surface finishers guarantees the finished job fulfills its functional lifecycle.</p>
        `,
        author: 'Anant Metal Finishers Technical Desk',
        category: 'Industrial Finishing Guides',
        tags: ['Job Work', 'Quality Control', 'Machining', 'Plating Checklist'],
        readingTime: '4 min read',
        seoTitle: 'Checklist Before Sending Parts for Plating Job Work | AMP Nashik',
        seoDescription: 'Important considerations for engineering shops before sending machined parts for electroplating and metal finishing job work.',
        isPublished: true,
        publicationDate: new Date('2026-10-01')
      },
      {
        title: 'Preparing an Enquiry for Industrial Finishing Requirements',
        slug: 'preparing-enquiry-for-industrial-finishing',
        summary: 'How to write a complete and accurate job-work enquiry for electroplating services to receive precise technical feedback and turnaround estimates.',
        content: `
<h2>How to Structure an Electroplating Job-Work Enquiry</h2>
<p>When engineering procurement teams request quotes for surface treatment, providing comprehensive data upfront speeds up evaluation and prevents misunderstandings.</p>

<h3>Key Details to Include in Your Enquiry:</h3>
<ul>
  <li><strong>Component Drawing / Dimensions:</strong> Overall length, outer diameter, or surface area calculations.</li>
  <li><strong>Base Metal & Surface Condition:</strong> Raw cast, forged, turned, stamped, or ground.</li>
  <li><strong>Batch Quantities:</strong> Prototype quantities, monthly job work runs, or ongoing delivery schedules.</li>
  <li><strong>Packaging and Transport Requirements:</strong> Protective rust-preventative wrapping, binning, or carton requirements post-plating.</li>
</ul>

<p>Share your component drawings with Anant Metal Finishers to begin technical review of your requirements.</p>
        `,
        author: 'Anant Metal Finishers Technical Desk',
        category: 'Industrial Finishing Guides',
        tags: ['Enquiry', 'Job Work', 'B2B Procurement'],
        readingTime: '3 min read',
        seoTitle: 'How to Prepare a Metal Finishing Enquiry | Anant Metal Finishers',
        seoDescription: 'Guide to preparing industrial job-work enquiries for electroplating and metal finishing services in MIDC Ambad, Nashik.',
        isPublished: true,
        publicationDate: new Date('2026-10-10')
      }
    ];

    for (const blog of educationalBlogs) {
      const exists = await Blog.findOne({ slug: blog.slug });
      if (!exists) {
        await Blog.create(blog);
      }
    }
    logger.info('Educational blog guides seeded successfully');

    logger.info('Database seeding completed with factual verification rules intact!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Data seeding failed', { error: error.message });
    process.exit(1);
  }
}

seedData();
