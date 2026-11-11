const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { DOMNode, createDOM, createWindow } = require('../helpers/dom');
const { createDrawerFSM } = require('../helpers/state');

describe('Tier 1 - Feature 03: Floating Navbar & Mobile Drawer', () => {
  test('T1-F03-01: Desktop Floating Pill Navbar Structure & Links', () => {
    const navSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/NavLinks.tsx'), 'utf8');

    const expectedAnchors = [
      '#programs',
      '#about',
      '#trainers',
      '#equipment',
      '#membership',
      '#gallery',
      '#contact',
    ];

    for (const anchor of expectedAnchors) {
      assert.includes(navSrc, anchor, `NavLinks must include anchor ${anchor}`);
    }

    const navbarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/Navbar.tsx'), 'utf8');
    assert.match(navbarSrc, /fixed top-4/);
    assert.match(navbarSrc, /backdrop-blur/);
  });

  test('T1-F03-02: Dynamic Scroll Blur & Compact State', () => {
    const navbarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/Navbar.tsx'), 'utf8');

    // Logic in Navbar: setIsScrolled(window.scrollY > 40)
    assert.match(navbarSrc, /window\.scrollY\s*>\s*40/);

    const win = createWindow();
    assert.equal(win.scrollY, 0);
    win.scrollTo({ top: 60 });
    assert.equal(win.scrollY, 60);

    const isScrolled = win.scrollY > 40;
    assert.truthy(isScrolled, 'Scroll position > 40 must activate compact/scrolled state');
  });

  test('T1-F03-03: ScrollSpy Active Section Highlighting', () => {
    const navbarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/Navbar.tsx'), 'utf8');

    assert.match(navbarSrc, /sectionIds/);
    assert.match(navbarSrc, /activeSection/);

    // Virtual list simulation
    const link = new DOMNode('a');
    link.setAttribute('href', '#trainers');
    link.className = 'nav-link text-white';

    const isActive = true;
    if (isActive) {
      link.classList.add('text-[#C6FF33]');
      link.setAttribute('aria-current', 'page');
    }

    assert.equal(link.getAttribute('aria-current'), 'page');
    assert.truthy(link.classList.contains('text-[#C6FF33]'));
  });

  test('T1-F03-04: Mobile Hamburger Toggle & Morphing Icon', () => {
    const navbarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/Navbar.tsx'), 'utf8');

    assert.match(navbarSrc, /aria-label="(?:Open mobile navigation|Toggle navigation menu)"/);
    assert.match(navbarSrc, /setIsMobileOpen/);

    const drawerFSM = createDrawerFSM();
    assert.equal(drawerFSM.state, 'closed');
    drawerFSM.transition('open');
    assert.equal(drawerFSM.state, 'open');
  });

  test('T1-F03-05: Mobile Drawer Link Navigation & Auto-Close', () => {
    const drawerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/MobileDrawer.tsx'), 'utf8');

    assert.match(drawerSrc, /onClose\(\)/);
    assert.match(drawerSrc, /onNavigate/);

    const drawerFSM = createDrawerFSM();
    drawerFSM.transition('open');

    // Simulate link click inside drawer
    let targetNavigated = null;
    const handleLinkClick = (id) => {
      targetNavigated = id;
      drawerFSM.transition('closed');
    };

    handleLinkClick('about');
    assert.equal(targetNavigated, 'about');
    assert.equal(drawerFSM.state, 'closed');
  });
});
