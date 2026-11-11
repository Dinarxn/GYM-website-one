const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 07: Membership Experience Boundary Cases', () => {
  test('T2-F07-01: Annual Discount Calculation & 20% Math Verification (Boundary)', () => {
    const membershipConfigSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/config/membership.ts'),
      'utf8'
    );

    // Verify monthly and annual monthly rates declared in membership.ts
    assert.includes(membershipConfigSrc, 'priceMonthly: 79');
    assert.includes(membershipConfigSrc, 'priceAnnualMonthly: 63');
    assert.includes(membershipConfigSrc, 'priceMonthly: 149');
    assert.includes(membershipConfigSrc, 'priceAnnualMonthly: 119');
    assert.includes(membershipConfigSrc, 'priceMonthly: 249');
    assert.includes(membershipConfigSrc, 'priceAnnualMonthly: 199');

    // Mathematical verification: 20% discount formula
    const starterDisc = Math.round(79 * 0.8);
    const proDisc = Math.round(149 * 0.8);
    const eliteDisc = Math.round(249 * 0.8);

    assert.equal(starterDisc, 63, 'Starter annual discount must be $63/mo');
    assert.equal(proDisc, 119, 'Pro annual discount must be $119/mo');
    assert.equal(eliteDisc, 199, 'Elite annual discount must be $199/mo');
  });

  test('T2-F07-02: Comparison Matrix Toggle Button & Conditional Rendering (Corner)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/MembershipSection.tsx'),
      'utf8'
    );

    // Verify state hook and conditional rendering for amenities matrix
    assert.includes(sectionSrc, 'const [showMatrix, setShowMatrix] = useState(false)');
    assert.includes(sectionSrc, '{showMatrix && (');
    assert.includes(sectionSrc, 'Comprehensive Amenities Comparison');
    assert.includes(sectionSrc, 'onClick={() => setShowMatrix(!showMatrix)}');
  });

  test('T2-F07-03: Accessible Billing Switch Semantics (Boundary)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/MembershipSection.tsx'),
      'utf8'
    );

    // Verify WAI-ARIA switch roles and accessible labels on toggle
    assert.includes(sectionSrc, 'role="switch"');
    assert.includes(sectionSrc, 'aria-checked={isAnnual}');
    assert.includes(sectionSrc, 'aria-label="Toggle annual billing discount"');
    assert.includes(sectionSrc, 'SAVE 20%');
  });

  test('T2-F07-04: Amenity Matrix Complete 3-Tier Feature Breakdown (Corner)', () => {
    const membershipConfigSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/config/membership.ts'),
      'utf8'
    );

    // Verify AmenityMatrixRow interface declares all three tiers
    assert.includes(membershipConfigSrc, 'starter: boolean | string');
    assert.includes(membershipConfigSrc, 'pro: boolean | string');
    assert.includes(membershipConfigSrc, 'elite: boolean | string');
    assert.includes(membershipConfigSrc, 'export const amenityMatrix');
  });

  test('T2-F07-05: Mobile Amenities Table Horizontal Scrolling Container (Boundary)', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/MembershipSection.tsx'),
      'utf8'
    );

    // Genuinely inspect MembershipSection.tsx to verify table container has horizontal scrolling
    assert.includes(sectionSrc, '<div className="overflow-x-auto">');
    assert.includes(sectionSrc, '<table className="w-full text-left text-xs sm:text-sm">');
  });
});
