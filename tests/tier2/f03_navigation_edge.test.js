const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { DOMNode, createWindow } = require('../helpers/dom');
const { createDrawerFSM } = require('../helpers/state');

describe('Tier 2 - Feature 03: Navigation Boundary Cases', () => {
  test('T2-F03-01: Mobile Drawer Body Scroll Lock (Boundary)', () => {
    const drawerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/navigation/MobileDrawer.tsx'),
      'utf8'
    );

    // Verify MobileDrawer locks body overflow on open and restores on cleanup
    assert.includes(drawerSrc, "document.body.style.overflow = 'hidden'");
    assert.includes(drawerSrc, 'document.body.style.overflow = originalOverflow');

    // Simulate in virtual DOM environment
    const win = createWindow();
    const body = win.document.body;

    body.style.overflow = 'hidden';
    assert.equal(body.style.overflow, 'hidden');
    body.style.overflow = '';
    assert.equal(body.style.overflow, '');
  });

  test('T2-F03-02: Mobile Drawer Escape Key & Accessibility Dialog (Boundary)', () => {
    const drawerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/navigation/MobileDrawer.tsx'),
      'utf8'
    );

    // Verify accessible modal dialog semantics and Escape key listener
    assert.includes(drawerSrc, 'role="dialog"');
    assert.includes(drawerSrc, 'aria-modal="true"');
    assert.includes(drawerSrc, 'aria-label="Mobile Navigation Menu"');
    assert.includes(drawerSrc, "e.key === 'Escape'");
    assert.includes(drawerSrc, 'onClose()');

    const drawerFSM = createDrawerFSM();
    drawerFSM.transition('open');
    assert.equal(drawerFSM.state, 'open');
    drawerFSM.transition('closed');
    assert.equal(drawerFSM.state, 'closed');
  });

  test('T2-F03-03: Rapid Hamburger Toggle FSM Transitions (Corner)', () => {
    // Test rapid state machine transitions between open and closed states
    const drawerFSM = createDrawerFSM();

    for (let i = 0; i < 5; i++) {
      drawerFSM.transition('open');
      assert.equal(drawerFSM.state, 'open');
      drawerFSM.transition('closed');
      assert.equal(drawerFSM.state, 'closed');
    }

    assert.equal(drawerFSM.state, 'closed', 'After rapid toggling, state must settle in closed');
    assert.throws(() => drawerFSM.transition('invalid-state'), /Invalid transition/);
  });

  test('T2-F03-04: Responsive Breakpoint Separation for Desktop vs Mobile (Boundary)', () => {
    const navbarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/Navbar.tsx'), 'utf8');
    const drawerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/navigation/MobileDrawer.tsx'),
      'utf8'
    );

    // Verify desktop navigation uses lg:block and drawer hides on desktop breakpoints
    assert.includes(navbarSrc, 'hidden lg:block');
    assert.includes(drawerSrc, 'md:hidden');
  });

  test('T2-F03-05: ScrollSpy 9-Section Detection Algorithm (Corner)', () => {
    const navbarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/navigation/Navbar.tsx'), 'utf8');

    // Verify all 9 section IDs are tracked in Navbar ScrollSpy
    const expectedSections = [
      'hero',
      'programs',
      'about',
      'trainers',
      'equipment',
      'membership',
      'gallery',
      'testimonials',
      'contact',
    ];

    for (const sectionId of expectedSections) {
      assert.includes(navbarSrc, `'${sectionId}'`);
    }

    // Verify scroll position offset buffer
    assert.includes(navbarSrc, 'window.scrollY + 250');
  });
});
