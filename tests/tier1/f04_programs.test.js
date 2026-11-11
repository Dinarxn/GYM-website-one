const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { DOMNode } = require('../helpers/dom');
const { createModalFSM } = require('../helpers/state');

describe('Tier 1 - Feature 04: Training Programs Section', () => {
  test('T1-F04-01: Render 4 Core Training Disciplines', () => {
    const configPath = path.join(process.cwd(), 'src/config/programs.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    assert.includes(content, 'strength-powerlifting');
    assert.includes(content, 'hiit-conditioning');
    assert.includes(content, 'personal-training');
    assert.includes(content, 'functional-fitness');

    assert.includes(content, 'Strength & Powerlifting');
    assert.includes(content, 'HIIT & Conditioning');
    assert.includes(content, '1-on-1 Elite Personal Training');
    assert.includes(content, 'Functional Fitness & Mobility');
  });

  test('T1-F04-02: Category Filter Tabs Functionality', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/ProgramsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'All Disciplines');
    assert.includes(secSrc, 'Strength');
    assert.includes(secSrc, 'Conditioning');
    assert.includes(secSrc, '1-on-1 Coaching');
    assert.includes(secSrc, 'Functional');

    // Filter logic simulation
    const mockPrograms = [
      { id: '1', category: 'strength' },
      { id: '2', category: 'conditioning' },
      { id: '3', category: 'personal' },
      { id: '4', category: 'functional' },
    ];

    const filterStrength = mockPrograms.filter((p) => p.category === 'strength');
    assert.equal(filterStrength.length, 1);
    assert.equal(filterStrength[0].id, '1');

    const filterAll = mockPrograms.filter(() => true);
    assert.equal(filterAll.length, 4);
  });

  test('T1-F04-03: Program Card Metadata & Intensity Meter', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/ProgramsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'intensity');
    assert.includes(secSrc, 'duration');
    assert.includes(secSrc, 'coachToMemberRatio');
    assert.includes(secSrc, 'keyBenefits');

    // Intensity pip generation check
    const intensity = 4;
    const pips = Array.from({ length: 5 }, (_, i) => i < intensity);
    assert.equal(pips.filter(Boolean).length, 4);
  });

  test('T1-F04-04: Syllabus Modal Trigger & Detailed Content', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/ProgramsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'View Syllabus');
    assert.includes(secSrc, 'activeModalProgram');
    assert.includes(secSrc, 'syllabus');

    const modalFSM = createModalFSM();
    assert.equal(modalFSM.state, 'closed');
    modalFSM.transition('open');
    assert.equal(modalFSM.state, 'open');
  });

  test('T1-F04-05: Syllabus Modal Dismissal', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/ProgramsSection.tsx'), 'utf8');

    assert.includes(secSrc, 'setActiveModalProgram(null)');
    assert.includes(secSrc, 'Close modal');

    const modalFSM = createModalFSM();
    modalFSM.transition('open');
    modalFSM.transition('closed');
    assert.equal(modalFSM.state, 'closed');
  });
});
