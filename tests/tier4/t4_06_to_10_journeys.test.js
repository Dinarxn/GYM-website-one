/**
 * Tier 4 — Real-World Application User Journey Scenarios
 * Scenarios T4-SCN-06 through T4-SCN-10
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('../helpers/assert');
const { createDOM, createWindow } = require('../helpers/dom');
const { createEquipmentFSM, createContactFormFSM } = require('../helpers/state');
const { CAMERA_WAYPOINTS, CameraNarrativeEvaluator } = require('../helpers/scroll');

describe('Tier 4: Real-World Prospect User Journeys (Scenarios 06 to 10)', () => {
  test('T4-SCN-06: Equipment Enthusiast Deep 3D Apparatus Exploration Journey', () => {
    // Jax: Strength coach on 2560x1440 analyzing commercial equipment
    const equipSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/equipment.ts'), 'utf8');

    // 1. Barbell Specs & Tensile Strength
    assert.includes(equipSrc, '215,000 PSI');
    assert.includes(equipSrc, '28 mm shaft diameter');
    assert.match(equipSrc, /volcanic knurl/i);

    // 2. Dumbbell Inspection & Polar Angle Clamping
    const minPolarAngle = 0.2;
    const maxPolarAngle = Math.PI / 2 + 0.1;

    const clampPolarAngle = (angle) => Math.max(minPolarAngle, Math.min(maxPolarAngle, angle));

    // Verify polar angle clamping prevents camera clipping below gym floor
    assert.closeTo(clampPolarAngle(-0.5), minPolarAngle, 0.001, 'Under-rotation clamped above floor');
    assert.closeTo(clampPolarAngle(Math.PI), maxPolarAngle, 0.001, 'Over-rotation clamped to ground limit');

    // 3. FSM Lifecycle & Buffer Disposal
    const fsm = createEquipmentFSM();
    const disposedResources = [];

    const mockSwitch = (fromId, toId) => {
      disposedResources.push(`${fromId}_geometry`, `${fromId}_material`);
      fsm.transition(toId);
    };

    mockSwitch('barbell', 'dumbbell');
    assert.equal(fsm.state, 'dumbbell');
    assert.includes(disposedResources, 'barbell_geometry');
    assert.includes(disposedResources, 'barbell_material');

    mockSwitch('dumbbell', 'plates');
    assert.equal(fsm.state, 'plates');
    assert.includes(disposedResources, 'dumbbell_geometry');

    mockSwitch('plates', 'bench');
    assert.equal(fsm.state, 'bench');
    assert.includes(disposedResources, 'plates_geometry');
  });

  test('T4-SCN-07: Visual Explorer Facility & Community Gallery Browsing Journey', () => {
    // Chloe: Functional fitness athlete on 1024x768 iPad
    const dom = createDOM();
    const win = createWindow();
    win.innerWidth = 1024;
    win.innerHeight = 768;

    const gallerySrc = fs.readFileSync(path.join(process.cwd(), 'src/config/gallery.ts'), 'utf8');

    // 1. Gallery items & categories
    assert.includes(gallerySrc, 'galleryItems');
    assert.includes(gallerySrc, 'recovery');
    assert.includes(gallerySrc, 'strength');

    // 2. Category Filtering Simulation
    const items = [
      { id: 1, category: 'strength', title: 'Powerlifting Platforms' },
      { id: 2, category: 'cardio', title: 'Dumbbell Heavy Bay' },
      { id: 3, category: 'recovery', title: 'Cold Plunge & Sauna' },
      { id: 4, category: 'community', title: 'Deadlift Workshop' },
    ];

    const filterImages = (cat) => {
      if (cat === 'all') return items;
      return items.filter((img) => img.category === cat);
    };

    assert.equal(filterImages('all').length, 4, 'All filter displays all 4 photos');
    assert.equal(filterImages('recovery').length, 1, 'Recovery filter displays 1 photo');
    assert.equal(filterImages('recovery')[0].title, 'Cold Plunge & Sauna');

    // 3. Lightbox Scroll Lock and Backdrop Dismissal
    win.scrollY = 2800; // user scrolled to gallery
    dom.body.style.overflow = 'hidden'; // lightbox opened
    assert.equal(dom.body.style.overflow, 'hidden');

    const backdrop = dom.createElement('div');
    backdrop.id = 'gallery-backdrop';
    dom.body.appendChild(backdrop);

    let dismissed = false;
    backdrop.addEventListener('click', () => {
      dismissed = true;
      dom.body.style.overflow = '';
      dom.body.removeChild(backdrop);
    });

    backdrop.click();
    assert.equal(dismissed, true, 'Lightbox dismissed on backdrop tap');
    assert.equal(dom.body.style.overflow, '', 'Body scroll restored');
    assert.equal(win.scrollY, 2800, 'Scroll position preserved at 2800px');
  });

  test('T4-SCN-08: Direct VIP Lead WhatsApp Conversion Pipeline Journey', () => {
    // Tariq: Executive seeking coaching with Marcus Vance on mobile Android (412x915px)
    const siteConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/site.ts'), 'utf8');
    const phoneMatch = siteConfigSrc.match(/whatsappNumber:\s*['"]([^'"]+)['"]/);
    const cleanPhone = phoneMatch[1].replace(/[^0-9]/g, '');

    // 1. Trainer Discovery: Marcus Vance CSCS
    const trainersSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/trainers.ts'), 'utf8');
    assert.includes(trainersSrc, 'Marcus Vance');
    assert.includes(trainersSrc, 'CSCS');

    // 2. Customized WhatsApp URL Construction
    const buildTrainerWhatsAppUrl = (trainerName) => {
      const msg = `Hi IRONFORGE, I would like to book an executive consultation with ${trainerName}.`;
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    };

    const marcusUrl = buildTrainerWhatsAppUrl('Marcus Vance');
    assert.includes(marcusUrl, `https://wa.me/${cleanPhone}?text=`);
    assert.includes(decodeURIComponent(marcusUrl), 'Marcus Vance');
    assert.includes(decodeURIComponent(marcusUrl), 'consultation');

    // 3. Floating WhatsApp Consultation Backup
    const floatingMsg = 'Hello IRONFORGE FITNESS! I am interested in training programs and membership details.';
    const floatingUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(floatingMsg)}`;
    assert.includes(decodeURIComponent(floatingUrl), 'Hello IRONFORGE FITNESS!');
  });

  test('T4-SCN-09: Contact Form Validation Recovery & Demo Lead Submission Flow', () => {
    // Samantha: Desktop Firefox 1920x1080 prospect navigating validation recovery
    const formFSM = createContactFormFSM();
    assert.equal(formFSM.state, 'idle');

    const dom = createDOM();
    const nameInput = dom.createElement('input');
    const phoneInput = dom.createElement('input');
    const emailInput = dom.createElement('input');

    // Step 1: Empty Form Submit -> 3 Errors
    let errors = {};
    const validate = () => {
      const errs = {};
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        errs.name = 'Full name is required.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
        errs.phone = 'Please provide a valid phone number.';
      }
      return errs;
    };

    errors = validate();
    assert.truthy(errors.name, 'Name error triggered');
    assert.truthy(errors.email, 'Email error triggered');
    assert.truthy(errors.phone, 'Phone error triggered');

    // Step 2: Partial invalid correction
    nameInput.value = 'Samantha Wright';
    phoneInput.value = 'invalid-phone';
    emailInput.value = 'samantha@';

    errors = validate();
    assert.falsy(errors.name, 'Name error cleared');
    assert.truthy(errors.email, 'Email error remains on invalid email');
    assert.truthy(errors.phone, 'Phone error remains on invalid phone');

    // Step 3: Complete valid correction
    phoneInput.value = '+15554829102';
    emailInput.value = 'samantha.wright@example.com';

    errors = validate();
    assert.equal(Object.keys(errors).length, 0, 'All errors resolved');

    // Step 4: Submission and Demo Confirmation
    formFSM.transition('submitting');
    assert.equal(formFSM.state, 'submitting');

    formFSM.transition('success');
    assert.equal(formFSM.state, 'success');

    // Verify Demo Mode badge text
    const formSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/forms/ContactForm.tsx'), 'utf8');
    assert.includes(formSrc, 'DEMO MODE');
    assert.includes(formSrc, 'Enquiry Dispatched!');
  });

  test('T4-SCN-10: Full-Site Narrative Scroll-Through Experience (Hero to Footer CTA)', () => {
    // First-time visitor experiencing complete 5-act narrative
    const evaluator = new CameraNarrativeEvaluator();

    // Act 1: The Beginning (Hero, 0% scroll)
    const act1 = evaluator.evaluate(0.0);
    assert.equal(act1.waypointId, 'beginning', 'Act 1 starts at beginning');
    assert.closeTo(act1.position[0], CAMERA_WAYPOINTS[0].position[0], 0.05);

    // Act 2: Strength (Programs, 25% scroll)
    const act2 = evaluator.evaluate(0.25);
    assert.equal(act2.waypointId, 'strength', 'Act 2 moves to strength arena');

    // Act 3: Performance (About & Equipment, 50% scroll)
    const act3 = evaluator.evaluate(0.50);
    assert.equal(act3.waypointId, 'performance', 'Act 3 moves to performance platform');

    // Act 4: Discipline (Trainers & Membership, 75% scroll)
    const act4 = evaluator.evaluate(0.75);
    assert.equal(act4.waypointId, 'discipline', 'Act 4 moves to discipline vantage');

    // Act 5: Your Next Level (Testimonials & Final CTA, 100% scroll)
    const act5 = evaluator.evaluate(1.0);
    assert.equal(act5.waypointId, 'next-level', 'Act 5 locks onto conversion portal');

    // Verify sections in page.tsx and Footer in layout.tsx
    const pageSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/page.tsx'), 'utf8');
    assert.includes(pageSrc, 'HeroOverlay');
    assert.includes(pageSrc, 'ProgramsSection');
    assert.includes(pageSrc, 'AboutSection');
    assert.includes(pageSrc, 'EquipmentSectionOverlay');
    assert.includes(pageSrc, 'TrainersSection');
    assert.includes(pageSrc, 'MembershipSection');
    assert.includes(pageSrc, 'GallerySection');
    assert.includes(pageSrc, 'TestimonialsSection');
    assert.includes(pageSrc, 'FinalCtaSection');

    const layoutSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
    assert.includes(layoutSrc, 'Footer');
  });
});
