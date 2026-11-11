const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 06: Trainers Boundary Cases', () => {
  test('T2-F06-01: TiltCard Integration in TrainersSection (Boundary)', () => {
    const trainersSectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TrainersSection.tsx'),
      'utf8'
    );

    // Verify 3-column responsive grid and 3D TiltCard wrapping
    assert.includes(trainersSectionSrc, 'grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8');
    assert.includes(trainersSectionSrc, '<TiltCard');
    assert.includes(trainersSectionSrc, 'glowColor="lime"');
    assert.includes(trainersSectionSrc, 'className="h-full"');
  });

  test('T2-F06-02: Master Coaches 3-Profile Pedigree Integrity (Corner)', () => {
    const trainersConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/trainers.ts'), 'utf8');

    // Verify all 3 master coach profiles and monikers exist in configuration
    assert.includes(trainersConfigSrc, "id: 'marcus-vance'");
    assert.includes(trainersConfigSrc, "moniker: 'Vanguard'");
    assert.includes(trainersConfigSrc, "id: 'elena-rostova'");
    assert.includes(trainersConfigSrc, "moniker: 'Apex'");
    assert.includes(trainersConfigSrc, "id: 'jaxson-reed'");
    assert.includes(trainersConfigSrc, "moniker: 'Forge'");

    // Verify elite credentials
    assert.includes(trainersConfigSrc, 'CSCS (NSCA)');
    assert.includes(trainersConfigSrc, 'DPT (Doctor of Physical Therapy)');
  });

  test('T2-F06-03: Quantitative Trainer Statistics Boundaries (Boundary)', () => {
    const trainersConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/trainers.ts'), 'utf8');

    // Verify statistical metric declarations
    assert.includes(trainersConfigSrc, "experience: '14+ Yrs'");
    assert.includes(trainersConfigSrc, "specialtyMetric: '805 LBS'");
    assert.includes(trainersConfigSrc, "metricLabel: 'Competition Deadlift PR'");
    assert.includes(trainersConfigSrc, "specialtyMetric: '100%'");
    assert.includes(trainersConfigSrc, "metricLabel: 'Injury Prevention Rate'");
  });

  test('T2-F06-04: Semantic Image Accessibility in Profile Cards (Edge Case)', () => {
    const trainersSectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TrainersSection.tsx'),
      'utf8'
    );

    // Verify accessible alt text template and responsive sizes
    assert.includes(trainersSectionSrc, 'alt={`${trainer.name} - ${trainer.role} at IRONFORGE FITNESS`}');
    assert.includes(trainersSectionSrc, 'sizes="(max-width: 768px) 100vw, 400px"');
  });

  test('T2-F06-05: Consultation Call-to-Action Anchor Linking (Corner)', () => {
    const trainersSectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/TrainersSection.tsx'),
      'utf8'
    );

    // Verify consultation booking button navigates to contact section with glass styling
    assert.includes(trainersSectionSrc, 'href="#contact"');
    assert.includes(trainersSectionSrc, 'variant="glass"');
    assert.includes(trainersSectionSrc, 'Book Consultation');
  });
});
