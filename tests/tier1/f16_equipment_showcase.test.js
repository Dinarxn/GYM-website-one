const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { createEquipmentFSM } = require('../helpers/state');

describe('Tier 1 - Feature 16: Interactive 3D Equipment Showcase', () => {
  test('T1-F16-01: Equipment Catalog Complete 4-Item Roster & IDs', () => {
    const configPath = path.join(process.cwd(), 'src/config/equipment.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    // Verify all 4 equipment models defined in the application config
    assert.includes(content, "id: 'barbell'");
    assert.includes(content, "id: 'dumbbell'");
    assert.includes(content, "id: 'plates'");
    assert.includes(content, "id: 'bench'");

    // State machine verifies seamless switching between all 4 models
    const fsm = createEquipmentFSM();
    assert.equal(fsm.state, 'barbell');
    fsm.transition('dumbbell');
    assert.equal(fsm.state, 'dumbbell');
    fsm.transition('plates');
    assert.equal(fsm.state, 'plates');
    fsm.transition('bench');
    assert.equal(fsm.state, 'bench');
    fsm.transition('barbell');
    assert.equal(fsm.state, 'barbell');
  });

  test('T1-F16-02: Competition Barbell & Dumbbell Biomechanical Engineering Specifications', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'src/config/equipment.ts'), 'utf8');

    // Barbell tensile specifications
    assert.includes(content, 'Competition Olympic Barbell');
    assert.includes(content, '215,000 PSI tensile strength rated to 1,500 kg');
    assert.includes(content, '1.2 mm volcanic knurl pattern with dual powerlifting marks');
    assert.includes(content, 'Swedish Tensile Steel');

    // Dumbbell specifications
    assert.includes(content, 'Pro-Hex Urethane Dumbbell');
    assert.includes(content, 'Solid Steel Core with Molded High-Density CPU Urethane');
    assert.includes(content, 'Drop-tested over 20,000 repetitions without weld compromise');
  });

  test('T1-F16-03: Calibrated Competition Plates & Adjustable Bench Specifications', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'src/config/equipment.ts'), 'utf8');

    // Plates specifications
    assert.includes(content, 'Calibrated Competition Steel Plates');
    assert.includes(content, 'within ±10 grams of official IPF competition standard');
    assert.includes(content, 'Ultra-slim 27 mm profile allowing up to 700 kg load capacity');

    // Bench specifications
    assert.includes(content, 'Commercial Adjustable Incline Bench');
    assert.includes(content, 'Heavy 11-gauge 75x75 mm laser-cut boxed steel frame');
    assert.includes(content, 'Tested to an extraordinary static weight load capacity of 1,200 kg');
  });

  test('T1-F16-04: EquipmentSectionOverlay Interactive Tabs & Cues', () => {
    const overlaySrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/EquipmentSectionOverlay.tsx'),
      'utf8'
    );

    // Section container and accessible label
    assert.includes(overlaySrc, 'id="equipment"');
    assert.includes(overlaySrc, 'aria-label="Interactive Equipment Showcase"');

    // Dynamic selector tabs and 3D viewport cues
    assert.includes(overlaySrc, 'equipmentData.map');
    assert.includes(overlaySrc, 'setSelectedItem(item)');
    assert.includes(overlaySrc, 'bg-[#C6FF33] text-black');
    assert.includes(overlaySrc, '3D SHOWCASE READY');
    assert.includes(overlaySrc, 'Drag to rotate model 360°');
  });

  test('T1-F16-05: Technical Specifications & Key Features Split Display', () => {
    const overlaySrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/EquipmentSectionOverlay.tsx'),
      'utf8'
    );

    // Verified dual specification list layout
    assert.includes(overlaySrc, 'CALIBRATED SPECIFICATIONS');
    assert.includes(overlaySrc, 'IPF ±10g TOLERANCE');
    assert.includes(overlaySrc, 'selectedItem.material');
    assert.includes(overlaySrc, 'selectedItem.dimensions');
    assert.includes(overlaySrc, 'selectedItem.specs');
    assert.includes(overlaySrc, 'Engineering Specifications');
  });
});
