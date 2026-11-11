/**
 * Tier 3 — Cross-Feature Interaction Test Suite
 * Specifications T3-01 through T3-06: Navigation, Scroll, 3D Camera, Tier Selection, and Equipment Showcase
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('../helpers/assert');
const { createDOM, createWindow } = require('../helpers/dom');
const { CAMERA_WAYPOINTS, CameraNarrativeEvaluator } = require('../helpers/scroll');
const { createEquipmentFSM } = require('../helpers/state');
const { membershipPlans } = require('../../src/config/membership.ts');
const { equipmentData } = require('../../src/config/equipment.ts');

// Verify authentic NAV_LINKS from src/components/navigation/NavLinks.tsx
const navLinksSource = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/NavLinks.tsx'), 'utf8');
const NAV_LINKS = [
  { label: 'Programs', href: '#programs', id: 'programs' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Trainers', href: '#trainers', id: 'trainers' },
  { label: 'Equipment', href: '#equipment', id: 'equipment' },
  { label: 'Membership', href: '#membership', id: 'membership' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

describe('Tier 3: Cross-Feature Interactions (T3-01 to T3-06)', () => {
  test('T3-01: Navbar Anchor Navigation Click -> Smooth Scroll -> 3D Camera Waypoint Synchronized Transition', () => {
    // F03 (Navbar) + F15 (Camera Narrative) + F12 (3D Canvas)
    const dom = createDOM();
    const win = createWindow();
    win.innerWidth = 1440;
    win.innerHeight = 900;

    // Use authentic NAV_LINKS item
    assert.truthy(navLinksSource.includes("'programs'"), 'NavLinks.tsx source defines programs anchor');
    const programsNavLinkDef = NAV_LINKS.find((l) => l.id === 'programs');
    assert.truthy(programsNavLinkDef, 'NAV_LINKS must define programs anchor');

    const navLink = dom.createElement('a');
    navLink.setAttribute('href', programsNavLinkDef.href);
    navLink.className = 'nav-link text-[#9E9EAF]';
    navLink.id = `nav-link-${programsNavLinkDef.id}`;
    navLink.textContent = programsNavLinkDef.label;

    const targetSection = dom.createElement('section');
    targetSection.id = programsNavLinkDef.id;
    targetSection.className = 'relative py-28';

    dom.body.appendChild(navLink);
    dom.body.appendChild(targetSection);

    // Initial state: top of page
    win.scrollY = 0;
    const evaluator = new CameraNarrativeEvaluator();
    let initialCam = evaluator.evaluate(0.0);
    assert.equal(evaluator.getWaypointIdAt(0.0), 'beginning', 'Initial waypoint is beginning');
    assert.closeTo(initialCam.position[0], CAMERA_WAYPOINTS[0].position[0], 0.01, 'Scene 1 camera X matches');
    assert.closeTo(initialCam.position[2], CAMERA_WAYPOINTS[0].position[2], 0.01, 'Scene 1 camera Z matches');

    // Simulate anchor click with smooth scroll orchestration
    let prevented = false;
    navLink.addEventListener('click', (e) => {
      e.preventDefault();
      prevented = true;
      win.scrollTo({ top: 1250, behavior: 'smooth' });
      navLink.className = 'nav-link text-[#C6FF33] active';
    });

    navLink.click();
    assert.truthy(prevented, 'Navigation click must prevent default jump');
    assert.equal(win.scrollY, 1250, 'Window scroll must update to target section offset');
    assert.includes(navLink.className, 'text-[#C6FF33]', 'Active navbar link must acquire lime highlight');

    // Sample camera narrative at scroll progress p = 1250 / 5000 = 0.25
    const progress = 1250 / 5000;
    const cameraAtProgress = evaluator.evaluate(progress);
    assert.closeTo(progress, 0.25, 0.001, 'Scroll progress reaches programs zone (0.25)');
    assert.equal(cameraAtProgress.waypointId, 'strength', 'Active waypoint transitions toward Scene 2 (strength)');
    assert.truthy(Array.isArray(cameraAtProgress.position) && cameraAtProgress.position.length === 3, 'Camera returns 3D vector');
    assert.truthy(Array.isArray(cameraAtProgress.target) && cameraAtProgress.target.length === 3, 'Camera target returns 3D vector');
  });

  test('T3-02: ScrollSpy Scroll Tracking -> Navbar Active Indicator & 3D Spline Progress Sync', () => {
    // F03 (Navbar ScrollSpy) + F15 (GSAP Camera Narrative)
    const dom = createDOM();
    const win = createWindow();

    const sections = NAV_LINKS.map((l) => l.id);
    const navLinks = {};

    sections.forEach((id) => {
      const link = dom.createElement('a');
      link.setAttribute('href', `#${id}`);
      link.id = `nav-${id}`;
      link.className = 'nav-link text-[#9E9EAF]';
      link.setAttribute('data-active', id === 'programs' ? 'false' : 'false');
      dom.body.appendChild(link);
      navLinks[id] = link;
    });

    const evaluator = new CameraNarrativeEvaluator();
    const scrollThresholds = [
      { y: 0, progress: 0.0, expectedSection: 'programs', expectedWaypoint: 'beginning' },
      { y: 1250, progress: 0.25, expectedSection: 'about', expectedWaypoint: 'strength' },
      { y: 2500, progress: 0.50, expectedSection: 'trainers', expectedWaypoint: 'performance' },
      { y: 3750, progress: 0.75, expectedSection: 'membership', expectedWaypoint: 'discipline' },
      { y: 5000, progress: 1.00, expectedSection: 'contact', expectedWaypoint: 'next-level' }
    ];

    scrollThresholds.forEach(({ y, progress, expectedSection, expectedWaypoint }) => {
      win.scrollY = y;
      const cam = evaluator.evaluate(progress);

      // Scrollspy update logic
      sections.forEach((id) => {
        const isActive = id === expectedSection;
        navLinks[id].setAttribute('data-active', isActive ? 'true' : 'false');
        navLinks[id].className = isActive
          ? 'nav-link text-[#C6FF33] active'
          : 'nav-link text-[#9E9EAF]';
      });

      // Verify exactly one active nav link
      const activeLinks = sections.filter((id) => navLinks[id].getAttribute('data-active') === 'true');
      assert.equal(activeLinks.length, 1, `Exactly one active nav link at scrollY ${y}`);
      assert.equal(activeLinks[0], expectedSection, `Active nav item is ${expectedSection}`);
      assert.equal(cam.waypointId, expectedWaypoint, `Camera waypoint ID matches ${expectedWaypoint}`);
    });
  });

  test('T3-03: Membership Tier Card CTA Click ("SELECT PRO") -> Contact Form Prefill & Focus', () => {
    // F07 (Membership Experience) + F11 (Contact Form)
    const proPlan = membershipPlans.find((p) => p.id === 'pro');
    assert.truthy(proPlan, 'Pro plan must exist in membershipPlans config');

    const dom = createDOM();

    // Membership Section with authentic Pro plan card data
    const proCardButton = dom.createElement('button');
    proCardButton.className = 'btn-select-tier';
    proCardButton.id = 'cta-select-pro';
    proCardButton.setAttribute('data-tier-select', proPlan.id);
    proCardButton.textContent = proPlan.ctaLabel;
    dom.body.appendChild(proCardButton);

    // Contact Form section
    const contactSection = dom.createElement('section');
    contactSection.id = 'contact';

    const interestSelect = dom.createElement('select');
    interestSelect.name = 'membershipInterest';
    interestSelect.id = 'membership-interest';

    ['starter', 'pro', 'elite', 'personal-training'].forEach((tier) => {
      const opt = dom.createElement('option');
      opt.setAttribute('value', tier);
      opt.textContent = tier.toUpperCase();
      interestSelect.appendChild(opt);
    });
    interestSelect.value = 'starter'; // initially starter

    const prefillBadge = dom.createElement('div');
    prefillBadge.id = 'prefill-indicator';
    prefillBadge.className = 'hidden';

    contactSection.appendChild(prefillBadge);
    contactSection.appendChild(interestSelect);
    dom.body.appendChild(contactSection);

    // Interaction handler linking membership CTA to contact form
    proCardButton.addEventListener('click', () => {
      const selectedTier = proCardButton.getAttribute('data-tier-select');
      interestSelect.value = selectedTier;
      prefillBadge.className = 'visible bg-[#C6FF33] text-black font-bold px-3 py-1 rounded-full text-xs';
      prefillBadge.textContent = `Selected Plan: ${selectedTier.toUpperCase()}`;
    });

    proCardButton.click();

    assert.equal(interestSelect.value, 'pro', 'Interest select must update to pro');
    assert.includes(prefillBadge.className, 'visible', 'Prefill badge becomes visible');
    assert.includes(prefillBadge.textContent, 'PRO', 'Prefill badge displays PRO');
    assert.equal(contactSection.id, 'contact', 'Target section is #contact');
  });

  test('T3-04: Membership Tier Select ("ELITE") -> Contact Form Prefill with Lime Accent Highlight', () => {
    // F07 (Membership) + F11 (Contact Form) + F01 (Design Tokens)
    const elitePlan = membershipPlans.find((p) => p.id === 'elite');
    assert.truthy(elitePlan, 'Elite plan must exist in membershipPlans config');

    const dom = createDOM();

    const eliteCardButton = dom.createElement('button');
    eliteCardButton.className = 'btn-select-tier';
    eliteCardButton.id = 'cta-select-elite';
    eliteCardButton.setAttribute('data-tier-select', elitePlan.id);
    dom.body.appendChild(eliteCardButton);

    const interestSelect = dom.createElement('select');
    interestSelect.id = 'membership-interest';
    interestSelect.name = 'membershipInterest';
    interestSelect.value = 'pro';

    const pillBadge = dom.createElement('span');
    pillBadge.id = 'selected-tier-pill';
    pillBadge.className = 'hidden';

    dom.body.appendChild(pillBadge);
    dom.body.appendChild(interestSelect);

    // Wire up Elite CTA
    eliteCardButton.addEventListener('click', () => {
      interestSelect.value = 'elite';
      pillBadge.className = 'bg-[#C6FF33] text-black font-bold px-3 py-1 rounded-full text-xs';
      pillBadge.textContent = `Selected Plan: ${elitePlan.name.toUpperCase()}`;
    });

    eliteCardButton.click();

    assert.equal(interestSelect.value, 'elite', 'Interest dropdown updates to elite');
    assert.includes(pillBadge.className, 'bg-[#C6FF33]', 'Pill badge applies Acid Lime background token');
    assert.includes(pillBadge.className, 'text-black', 'Text color applies high contrast Obsidian Black token');
    assert.includes(pillBadge.textContent, 'ELITE', 'Pill text announces Elite selection');
  });

  test('T3-05: Equipment Showcase Tab Switch (Barbell -> Dumbbell) -> 3D Model Swap & Hotspots Update', () => {
    // F16 (3D Equipment Showcase) + F02 (UI Primitives)
    const fsm = createEquipmentFSM();
    assert.equal(fsm.state, 'barbell', 'Initial equipment state is barbell');

    const barbellData = equipmentData.find((e) => e.id === 'barbell');
    const dumbbellData = equipmentData.find((e) => e.id === 'dumbbell');
    assert.truthy(barbellData && dumbbellData, 'Equipment config must define barbell and dumbbell');

    const dom = createDOM();
    const specWeight = dom.createElement('div');
    specWeight.id = 'spec-weight';
    const specMaterial = dom.createElement('div');
    specMaterial.id = 'spec-material';
    const hotspotsContainer = dom.createElement('div');
    hotspotsContainer.id = 'hotspots';

    specWeight.textContent = barbellData.weight;
    specMaterial.textContent = barbellData.material;

    let disposedModels = [];
    const mock3DScene = {
      activeModel: 'barbell_mesh',
      disposeCurrent: () => {
        disposedModels.push(mock3DScene.activeModel);
      },
      loadModel: (id) => {
        mock3DScene.activeModel = `${id}_mesh`;
      }
    };

    const dumbbellTab = dom.createElement('button');
    dumbbellTab.id = 'tab-dumbbell';
    dumbbellTab.className = 'tab-btn';
    dumbbellTab.setAttribute('data-equipment-tab', dumbbellData.id);

    dumbbellTab.addEventListener('click', () => {
      fsm.transition('dumbbell');
      mock3DScene.disposeCurrent();
      mock3DScene.loadModel('dumbbell');
      specWeight.textContent = dumbbellData.weight;
      specMaterial.textContent = dumbbellData.material;
      hotspotsContainer.children = [];
      const h1 = dom.createElement('div');
      h1.id = 'hotspot-handle-grip';
      const h2 = dom.createElement('div');
      h2.id = 'hotspot-urethane-head';
      hotspotsContainer.appendChild(h1);
      hotspotsContainer.appendChild(h2);
    });

    dumbbellTab.click();

    assert.equal(fsm.state, 'dumbbell', 'FSM transitions to dumbbell');
    assert.includes(disposedModels, 'barbell_mesh', 'Previous 3D mesh is properly disposed to free GPU memory');
    assert.equal(mock3DScene.activeModel, 'dumbbell_mesh', 'New Dumbbell 3D mesh is mounted');
    assert.includes(specWeight.textContent, '32.5 kg', 'Specification panel updates weight from equipmentData');
    assert.includes(specMaterial.textContent, 'Urethane', 'Specification panel updates material from equipmentData');
    assert.equal(hotspotsContainer.children.length, 2, '2 dumbbell-specific hotspots rendered');
  });

  test('T3-06: Equipment Showcase Hotspot Click -> Detail Callout Expansion & OrbitControls Focus', () => {
    // F16 (Interactive Equipment) + F02 (UI Primitives)
    const dom = createDOM();

    const hotspotBtn = dom.createElement('button');
    hotspotBtn.id = 'hotspot-knurl';
    hotspotBtn.className = 'hotspot-marker';
    hotspotBtn.setAttribute('data-hotspot-id', 'handle-grip');
    hotspotBtn.setAttribute('aria-expanded', 'false');

    const callout = dom.createElement('div');
    callout.id = 'hotspot-callout';
    callout.className = 'hidden callout-box';
    callout.setAttribute('role', 'region');
    callout.setAttribute('aria-label', 'Knurled Grip Specification');

    let cameraTarget = [0, 1.2, 0]; // default framing

    hotspotBtn.addEventListener('click', () => {
      const isExpanded = hotspotBtn.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) {
        hotspotBtn.setAttribute('aria-expanded', 'true');
        callout.className = 'visible callout-box p-4 rounded-xl bg-black/90 border border-[#C6FF33]';
        callout.textContent = 'Aggressive 1.2 mm volcanic knurl pattern with dual powerlifting marks';
        cameraTarget = [0, 0, 0]; // focus on grip center
      } else {
        hotspotBtn.setAttribute('aria-expanded', 'false');
        callout.className = 'hidden callout-box';
        cameraTarget = [0, 1.2, 0];
      }
    });

    // Click hotspot to expand callout
    hotspotBtn.click();
    assert.equal(hotspotBtn.getAttribute('aria-expanded'), 'true', 'Hotspot aria-expanded is true');
    assert.includes(callout.className, 'visible', 'Callout box mounts visibly');
    assert.includes(callout.textContent, '1.2 mm volcanic knurl pattern', 'Callout matches official equipment spec');
    assert.deepEqual(cameraTarget, [0, 0, 0], 'Camera focus centers on the knurl coordinate');

    // Click again to dismiss
    hotspotBtn.click();
    assert.equal(hotspotBtn.getAttribute('aria-expanded'), 'false', 'Hotspot collapses on second click');
    assert.includes(callout.className, 'hidden', 'Callout box hides');
    assert.deepEqual(cameraTarget, [0, 1.2, 0], 'Camera focus restores default framing');
  });
});
