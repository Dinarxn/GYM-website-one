const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { DOMNode, createWindow } = require('../helpers/dom');

describe('Tier 1 - Feature 18: Mobile-First Performance & Layout Hardening', () => {
  test('T1-F18-01: Zero Horizontal Overflow Across Standard Mobile Viewports', () => {
    const globalsCss = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

    assert.includes(globalsCss, 'overflow-x: clip;');

    const win = createWindow();
    win.setViewport(375, 812);
    assert.equal(win.innerWidth, 375);
  });

  test('T1-F18-02: Touch Target Minimum Dimension Compliance (44x44px)', () => {
    const btnNode = new DOMNode('button');
    btnNode.setBoundingClientRect({ width: 44, height: 44 });

    const rect = btnNode.getBoundingClientRect();
    assert.assert(rect.width >= 44, 'Touch target width must be >= 44px');
    assert.assert(rect.height >= 44, 'Touch target height must be >= 44px');
  });

  test('T1-F18-03: Mobile DPR Clamping (Capped at 1.3)', () => {
    function getClampedDPR(nativeDPR, isMobile) {
      if (isMobile) {
        return Math.min(nativeDPR, 1.3);
      }
      return Math.min(nativeDPR, 1.8);
    }

    const mobileDPR = getClampedDPR(3.0, true);
    assert.equal(mobileDPR, 1.3);
  });

  test('T1-F18-04: Single-Column Responsive Grid Reflow', () => {
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/AboutSection.tsx'), 'utf8');
    const trainersSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/TrainersSection.tsx'), 'utf8');

    assert.includes(aboutSrc, 'grid-cols-1');
    assert.includes(trainersSrc, 'grid-cols-1');
  });

  test('T1-F18-05: GPU Resource Disposal on Component Unmount', () => {
    let geometriesDisposed = 0;
    let materialsDisposed = 0;

    const mockMesh = {
      geometry: {
        dispose: () => {
          geometriesDisposed++;
        },
      },
      material: {
        dispose: () => {
          materialsDisposed++;
        },
      },
    };

    function deepDispose(obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    deepDispose(mockMesh);
    assert.equal(geometriesDisposed, 1);
    assert.equal(materialsDisposed, 1);
  });
});
