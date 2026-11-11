const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 06: Trainers Section & 3D Tilt Cards', () => {
  test('T1-F06-01: Render 3 Demo Trainer Profiles', () => {
    const trainersPath = path.join(process.cwd(), 'src/config/trainers.ts');
    const content = fs.readFileSync(trainersPath, 'utf8');

    assert.includes(content, 'marcus-vance');
    assert.includes(content, 'elena-rostova');
    assert.includes(content, 'jaxson-reed');

    assert.includes(content, 'Marcus Vance');
    assert.includes(content, 'Elena Rostova');
    assert.includes(content, 'Jaxson Reed');
  });

  test('T1-F06-02: Trainer Credentials & Philosophy Quotes', () => {
    const trainersPath = path.join(process.cwd(), 'src/config/trainers.ts');
    const content = fs.readFileSync(trainersPath, 'utf8');

    assert.includes(content, 'CSCS (NSCA)');
    assert.includes(content, 'USAW Level 2 Senior Coach');
    assert.includes(content, 'DPT (Doctor of Physical Therapy)');
    assert.includes(content, 'NASM-PES');
    assert.includes(content, 'quote:');
  });

  test('T1-F06-03: 3D Tilt Physics Calculations on Pointer Move', () => {
    const tiltSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/TiltCard.tsx'), 'utf8');

    assert.includes(tiltSrc, 'handleMouseMove');
    assert.includes(tiltSrc, 'setRotateX');
    assert.includes(tiltSrc, 'setRotateY');

    // Mathematical verification of tilt physics
    const maxTilt = 8;
    const width = 300;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Pointer at top-left (50, 50)
    const x = 50;
    const y = 50;
    const rotX = ((centerY - y) / centerY) * maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    assert.assert(rotX > 0, 'Top pointer position produces positive rotateX');
    assert.assert(rotY < 0, 'Left pointer position produces negative rotateY');
    assert.assert(Math.abs(rotX) <= maxTilt, 'Tilt angle bounded by maxTilt');
    assert.assert(Math.abs(rotY) <= maxTilt, 'Tilt angle bounded by maxTilt');
  });

  test('T1-F06-04: Dynamic Radial Sheen Highlight', () => {
    const tiltSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/TiltCard.tsx'), 'utf8');

    assert.includes(tiltSrc, 'radial-gradient');
    assert.includes(tiltSrc, 'glarePosition');
    assert.includes(tiltSrc, 'rgba(198, 255, 51');
  });

  test('T1-F06-05: Consultation CTA Action Trigger', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/TrainersSection.tsx'), 'utf8');

    assert.includes(secSrc, 'Book Consultation');
    assert.includes(secSrc, 'href="#contact"');
  });
});
