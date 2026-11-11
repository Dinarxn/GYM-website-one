const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 07: Membership Experience', () => {
  test('T1-F07-01: Render Three Tiered Plans (Starter, Pro, Elite)', () => {
    const configPath = path.join(process.cwd(), 'src/config/membership.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    assert.includes(content, 'id: \'starter\'');
    assert.includes(content, 'id: \'pro\'');
    assert.includes(content, 'id: \'elite\'');

    assert.includes(content, 'priceMonthly: 79');
    assert.includes(content, 'priceMonthly: 149');
    assert.includes(content, 'priceMonthly: 249');
  });

  test('T1-F07-02: Pro Tier Visual Prominence & "MOST POPULAR" Badge', () => {
    const configPath = path.join(process.cwd(), 'src/config/membership.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    assert.includes(content, 'badgeText: \'MOST POPULAR\'');
    assert.includes(content, 'accentBorder: \'lime\'');

    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/MembershipSection.tsx'), 'utf8');
    assert.includes(secSrc, 'border-[#C6FF33]');
  });

  test('T1-F07-03: Monthly vs Annual Billing Toggle & 20% Discount', () => {
    const configPath = path.join(process.cwd(), 'src/config/membership.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    // Annual prices: 79 -> 63, 149 -> 119, 249 -> 199 (~20% discount)
    assert.includes(content, 'priceAnnualMonthly: 63');
    assert.includes(content, 'priceAnnualMonthly: 119');
    assert.includes(content, 'priceAnnualMonthly: 199');

    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/MembershipSection.tsx'), 'utf8');
    assert.includes(secSrc, 'role="switch"');
    assert.includes(secSrc, 'aria-checked={isAnnual}');
    assert.includes(secSrc, 'SAVE 20%');
  });

  test('T1-F07-04: Interactive Amenities Comparison Matrix', () => {
    const configPath = path.join(process.cwd(), 'src/config/membership.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    assert.includes(content, 'export const amenityMatrix: AmenityMatrixRow[] = [');

    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/MembershipSection.tsx'), 'utf8');
    assert.includes(secSrc, 'amenityMatrix');
    assert.includes(secSrc, 'showMatrix');
    assert.includes(secSrc, 'Compare All 16 Amenities & Features');
  });

  test('T1-F07-05: Tier CTA Preselection Integration', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/MembershipSection.tsx'), 'utf8');

    assert.includes(secSrc, 'href="#contact"');
    assert.includes(secSrc, 'plan.ctaLabel');
  });
});
