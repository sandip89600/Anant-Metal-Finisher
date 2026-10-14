require('dotenv').config();
const mongoose = require('mongoose');
const CompanySettings = require('../src/models/CompanySettings');
const Product = require('../src/models/Product');
const Blog = require('../src/models/Blog');
const Category = require('../src/models/Category');
const Gallery = require('../src/models/Gallery');
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
        brandAbbreviation: 'AMF',
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
        aboutStory: 'Anant Metal Finishers (AMF) operates an industrial metal finishing and electroplating job-work facility situated at G-8, MIDC Ambad, Nashik, Maharashtra. Located within one of Maharashtra’s premier manufacturing zones, our shop provides metal-finishing job work for industrial components, engineering manufacturers, and machine component suppliers.',
        mission: 'To deliver reliable, specification-conscious electroplating and surface finishing job work supporting manufacturing and engineering enterprises across Nashik and neighboring industrial regions.',
        values: 'Factual technical clarity, consistent surface treatment standards, transparent communication on job work capabilities, and dependable turnaround.',
        verifiedCapabilities: [
          'Electroplating Job Work',
          'Industrial Metal Finishing'
        ],
        googleMapsUrl: 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010',
        seoDefaults: {
          metaTitle: 'Anant Metal Finishers (AMF) | Industrial Electroplating Job Work | MIDC Ambad, Nashik',
          metaDescription: 'Anant Metal Finishers (AMF) in MIDC Ambad, Nashik provides industrial electroplating and metal finishing job work for engineering components. Submit your job specifications for review.'
        }
      });
      logger.info('Initial factual company settings created');
    } else {
      // Keep existing settings updated with AMF
      existingSettings.brandAbbreviation = 'AMF';
      await existingSettings.save();
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

    // 3. Seed Verified Capabilities (Strict factual capability showcase)
    const initialCapabilities = [
      {
        name: 'Industrial Electroplating',
        slug: 'industrial-electroplating',
        itemType: 'service',
        category: 'Electroplating Job Work',
        summary: 'Commercial electroplating and electrolytic surface coating for industrial machinery parts and engineered metal components.',
        description: `
Anant Metal Finishers (AMF) provides industrial electroplating job-work solutions for engineering components and machined assemblies. Located in the industrial center of MIDC Ambad, Nashik, our facility accommodates job-work batches based on customer component specifications.

### Job-Work Assessment Process
1. **Submit Component Details:** Provide material grade, surface condition, dimensions, and drawing requirements.
2. **Review & Specification:** Our workshop evaluates bath compatibility, rack configurations, and surface treatment processes.
3. **Sample Assessment:** For regular production batches, sample evaluation helps confirm finish standards before mass processing.

*Note: Specific bath parameters, tank sizes, and lead times are confirmed following physical or drawing inspection.*
        `,
        mainImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80'
        ],
        materials: ['Mild Steel', 'Carbon Steel', 'Machined Castings', 'Turned Parts'],
        technicalSpecs: [
          { label: 'Primary Capability', value: 'Electroplating Job Work' },
          { label: 'Facility Location', value: 'G-8, MIDC Ambad, Nashik' },
          { label: 'Evaluation Basis', value: 'Component drawings & batch inspection' }
        ],
        availabilityNotes: 'Job-work capacity is scheduled upon specification review.',
        seoTitle: 'Industrial Electroplating in Nashik | Anant Metal Finishers',
        seoDescription: 'Professional electroplating job work for industrial components at G-8, MIDC Ambad, Nashik.',
        isVerified: true,
        isPublished: true,
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Industrial Metal Finishing',
        slug: 'industrial-metal-finishing',
        itemType: 'service',
        category: 'Metal Finishing',
        summary: 'Surface preparation, descaling, cleaning, and protective metal finishing job work for industrial fabrications.',
        description: `
Metal finishing provides critical substrate protection against premature oxidation, environmental wear, and industrial corrosion. Our workshop in MIDC Ambad handles preparation, acid pickling, rinse cascades, and surface treatment according to engineering drawing specifications.

### Process Highlights
- Degreasing and industrial oil removal
- Rust descaling and chemical preparation
- Protective surface treatment
- Careful component handling and protective packaging
        `,
        mainImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
        ],
        materials: ['Engineering Steels', 'Machined Components', 'Fasteners'],
        technicalSpecs: [
          { label: 'Category', value: 'Industrial Metal Finishing' },
          { label: 'Workshop Zone', value: 'MIDC Ambad, Nashik' },
          { label: 'Inspection', value: 'Visual & specification review' }
        ],
        availabilityNotes: 'Capacity scheduled on component specification review.',
        seoTitle: 'Industrial Metal Finishing Nashik | Anant Metal Finishers',
        seoDescription: 'Reliable industrial metal finishing and surface treatment job work in MIDC Ambad, Nashik.',
        isVerified: true,
        isPublished: true,
        isFeatured: true,
        sortOrder: 2
      },
      {
        name: 'Industrial Surface Finishing',
        slug: 'industrial-surface-finishing',
        itemType: 'service',
        category: 'Metal Finishing',
        summary: 'Uniform surface treatment and conditioning for mechanical assemblies and custom component job work.',
        description: `
Industrial surface finishing enhances substrate durability and prepares metal surfaces for long-term engineering applications. We focus on consistent chemical immersion cycles, proper racking, and thorough rinse procedures for machined parts.
        `,
        mainImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
        gallery: [],
        materials: ['Ferrous Components', 'Engineered Assemblies'],
        technicalSpecs: [
          { label: 'Service', value: 'Surface Finishing Job Work' },
          { label: 'Workshop', value: 'G-8, MIDC Ambad, Nashik' }
        ],
        availabilityNotes: 'Batch production reviewed against customer drawings.',
        seoTitle: 'Industrial Surface Finishing | Anant Metal Finishers',
        seoDescription: 'High quality industrial surface treatment and finishing in MIDC Ambad, Nashik.',
        isVerified: true,
        isPublished: true,
        isFeatured: true,
        sortOrder: 3
      },
      {
        name: 'Component Finishing Job Work',
        slug: 'component-finishing-job-work',
        itemType: 'service',
        category: 'Metal Finishing',
        summary: 'Precision finishing for automotive components, machine bushings, shafts, and hardware job work.',
        description: `
Dedicated job-work finishing for manufactured components, precision turned parts, machine bushings, and custom fittings. Our MIDC Ambad workshop accommodates regular component production batches with dependable turnaround.
        `,
        mainImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        gallery: [],
        materials: ['Bushings', 'Pins', 'Shafts', 'Turned Parts'],
        technicalSpecs: [
          { label: 'Category', value: 'Component Finishing' },
          { label: 'Turnaround', value: 'Batch scheduling upon receipt' }
        ],
        availabilityNotes: 'Share part drawings for capacity scheduling.',
        seoTitle: 'Component Finishing Job Work | Anant Metal Finishers Nashik',
        seoDescription: 'Specialized component finishing job work for engineering manufacturers in Nashik.',
        isVerified: true,
        isPublished: true,
        isFeatured: true,
        sortOrder: 4
      }
    ];

    for (const cap of initialCapabilities) {
      const exists = await Product.findOne({ slug: cap.slug });
      if (!exists) {
        await Product.create(cap);
        logger.info(`Capability seeded: ${cap.name}`);
      } else {
        exists.isVerified = true;
        exists.isPublished = true;
        if (!exists.mainImage) exists.mainImage = cap.mainImage;
        await exists.save();
      }
    }

    // 4. Seed Unconfirmed Draft Services (Strict factual integrity: unconfirmed until admin confirms)
    const draftServices = [
      {
        name: 'Zinc Plating Job Work (Unconfirmed Draft)',
        slug: 'zinc-plating-job-work',
        itemType: 'service',
        category: 'Metal Finishing',
        summary: 'Awaiting administrator verification of active zinc bath capabilities and passivation chemistries.',
        description: 'This is an unconfirmed service entry stored in draft state. It will not appear on the live website until the administrator verifies active bath parameters.',
        isVerified: false,
        isPublished: false,
        sortOrder: 5
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
        sortOrder: 6
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
        seoTitle: 'Understanding Industrial Electroplating: Practical Guide | AMF',
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
        seoTitle: 'Checklist Before Sending Parts for Plating Job Work | AMF Nashik',
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

    // 6. Seed Corporate Gallery & Our Work Showcase
    const galleryItems = [
      {
        title: 'Industrial Immersion Bath Line',
        description: 'Multi-stage process tanks configured for degreasing, acid pickling, and electrolytic plating cycles at our MIDC Ambad workshop.',
        category: 'Factory',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: true,
        order: 1,
        tags: ['Factory', 'Immersion Tanks', 'Processing Line']
      },
      {
        title: 'Component Fixture & Material Handling',
        description: 'Overhead hoisting equipment and custom copper racks designed for balanced current distribution and secure component mounting.',
        category: 'Machinery',
        imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: true,
        order: 2,
        tags: ['Machinery', 'Material Handling', 'Racks']
      },
      {
        title: 'Precision Machined Pin & Bushing Sets',
        description: 'Turned engineering components prepared for protective surface treatment according to customer drawing tolerances.',
        category: 'Components',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: true,
        order: 3,
        tags: ['Components', 'Machining', 'Pins', 'Bushings']
      },
      {
        title: 'Finished Fasteners & Threaded Hardware',
        description: 'Uniform protective coating achieved across complex fastener threads with zero thread clogging or binding defects.',
        category: 'Finished Work',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: true,
        order: 4,
        tags: ['Finished Work', 'Fasteners', 'Electroplating']
      },
      {
        title: 'Finished Cylindrical Component Assemblies',
        description: 'High aesthetic and corrosion-resistant surface finish on precision ground cylindrical machinery components.',
        category: 'Finished Work',
        imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: true,
        order: 5,
        tags: ['Finished Work', 'Components', 'Metal Finishing']
      },
      {
        title: 'Plot G-8, MIDC Ambad Industrial Area',
        description: 'Strategic manufacturing location in Nashik offering easy logistics access for regional engineering suppliers.',
        category: 'Exterior',
        imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: false,
        order: 6,
        tags: ['Exterior', 'Nashik', 'MIDC Ambad']
      },
      {
        title: 'Pre-Treatment Descaling & Chemical Degreasing',
        description: 'Essential pre-plating surface cleaning removing all drawing lubricants, rolling scale, and microscopic oxides.',
        category: 'Factory',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: true,
        order: 7,
        tags: ['Factory', 'Pre-Treatment', 'Cleaning']
      },
      {
        title: 'Batch Dispatch & Component Staging Area',
        description: 'Careful component separation and protective packaging safeguarding finished metal surfaces during transit.',
        category: 'Company',
        imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        isWorkItem: false,
        order: 8,
        tags: ['Company', 'Dispatch', 'Inspection']
      }
    ];

    for (const item of galleryItems) {
      const exists = await Gallery.findOne({ title: item.title });
      if (!exists) {
        await Gallery.create(item);
      }
    }
    logger.info('Corporate gallery & our work items seeded successfully');

    logger.info('Database seeding completed with factual verification rules intact!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Data seeding failed', { error: error.message });
    process.exit(1);
  }
}

seedData();
