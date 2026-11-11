const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');
const { createEquipmentFSM } = require('../helpers/state');

describe('Tier 2 - Feature 16: Equipment Showcase Boundary Cases', () => {
  test('T2-16-01: Equipment Catalog Item Schema & Narrative Descriptions (Boundary)', () => {
    const configSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/equipment.ts'), 'utf8');

    // Verify all 4 equipment models have extensive interactive descriptions
    assert.includes(configSrc, 'interactiveDescription:');
    assert.includes(configSrc, 'The crown jewel of IRONFORGE');
    assert.includes(configSrc, 'Engineered for indestructible unilateral loading');
    assert.includes(configSrc, 'Thin, dense, and unforgiving');
    assert.includes(configSrc, 'A rock-solid structural foundation for pressing');
  });

  test('T2-16-02: EquipmentSectionOverlay Interactive Tab Selection State (Corner)', () => {
    const overlaySrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/EquipmentSectionOverlay.tsx'),
      'utf8'
    );

    // Verify state management for active equipment item selection
    assert.includes(
      overlaySrc,
      'const [selectedItem, setSelectedItem] = useState<EquipmentItem>(equipmentData[0])'
    );
    assert.includes(overlaySrc, 'onClick={() => setSelectedItem(item)}');
    assert.includes(overlaySrc, 'selectedItem.id === item.id');
  });

  test('T2-16-03: FSM State Transition Validation Across All 4 Equipment Models (Boundary)', () => {
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

    // Reject unknown equipment model IDs
    assert.throws(() => fsm.transition('treadmill'), /Invalid transition/);
  });

  test('T2-16-04: Overlay Material & Dimensions Badge Callouts in Source (Edge Case)', () => {
    const overlaySrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/EquipmentSectionOverlay.tsx'),
      'utf8'
    );

    // Verify technical specification cards and iconography
    assert.includes(overlaySrc, 'Material Composition');
    assert.includes(overlaySrc, '{selectedItem.material}');
    assert.includes(overlaySrc, 'Dimensions & Shaft');
    assert.includes(overlaySrc, '{selectedItem.dimensions}');
  });

  test('T2-16-05: Calibrated Precision Metric Labels in Equipment Config (Corner)', () => {
    const configSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/equipment.ts'), 'utf8');

    // Verify calibrated competition weights
    assert.includes(configSrc, "weight: '20.0 kg / 44.1 lbs'");
    assert.includes(configSrc, "weight: '32.5 kg / 71.6 lbs (5 – 150 lbs Series)'");
    assert.includes(configSrc, "weight: '25.0 kg / 55.1 lbs (Red Competition Standard)'");
    assert.includes(configSrc, "weight: '62.0 kg / 136.7 lbs'");
  });
});
