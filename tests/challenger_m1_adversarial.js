/**
 * Adversarial Empirical Test Harness for Milestone 1 (IRONFORGE FITNESS)
 * Authored by Challenger 1
 * 
 * Verifies:
 * 1. ContactForm validation logic on edge cases & boundary conditions
 * 2. ContactForm 5-state state machine and demo mode notices
 * 3. WhatsApp URL builder query encoding, phone sanitization, injection resistance
 * 4. Membership pricing math, 20% discount calculations, and amenities matrix integrity
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ANSI formatting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const findings = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${GREEN}✔${RESET} ${name}`);
  } catch (err) {
    failedTests++;
    console.log(`  ${RED}✖${RESET} ${BOLD}${name}${RESET}`);
    console.log(`    ${RED}Error: ${err.message}${RESET}`);
    findings.push({ name, error: err.message });
  }
}

console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
console.log(`${BOLD}${CYAN}   IRONFORGE FITNESS — CHALLENGER 1 ADVERSARIAL SUITE ${RESET}`);
console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

// =========================================================================
// SECTION 1: ContactForm Validation Logic Replication & Stress Testing
// =========================================================================
console.log(`${BOLD}1. ContactForm Validation & Edge Case Stress-Testing${RESET}`);

// Replicate exact validation logic from ContactForm.tsx lines 40-65
function validateContactForm(values) {
  const newErrors = {};

  if (!values.fullName || !values.fullName.trim()) {
    newErrors.fullName = 'Full name is required.';
  } else if (values.fullName.trim().length < 2) {
    newErrors.fullName = 'Name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email || !values.email.trim()) {
    newErrors.email = 'Email address is required.';
  } else if (!emailRegex.test(values.email.trim())) {
    newErrors.email = 'Please enter a valid email address.';
  }

  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!values.phone || !values.phone.trim()) {
    newErrors.phone = 'Phone number is required.';
  } else if (values.phone.trim().length < 7) {
    newErrors.phone = 'Please provide a valid phone number (min 7 digits).';
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
}

// 1.1 Full Name Edge Cases
test('Full Name: Empty string fails', () => {
  const res = validateContactForm({ fullName: '', email: 'test@example.com', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.fullName, 'Full name is required.');
});

test('Full Name: Whitespace-only string fails', () => {
  const res = validateContactForm({ fullName: '     \t  \n ', email: 'test@example.com', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.fullName, 'Full name is required.');
});

test('Full Name: Single character fails (min 2 chars required)', () => {
  const res = validateContactForm({ fullName: 'M', email: 'test@example.com', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.fullName, 'Name must be at least 2 characters.');
});

test('Full Name: Script tag string "<script>alert(1)</script>" passes length validation', () => {
  const res = validateContactForm({ fullName: '<script>alert(1)</script>', email: 'test@example.com', phone: '1234567' });
  // It passes client length validation (length = 25 >= 2).
  // Note: In React JSX this is safely encoded as a text node, avoiding DOM XSS, but it is not sanitized or rejected.
  assert.strictEqual(res.isValid, true);
});

// 1.2 Email Edge Cases
test('Email: Empty string fails', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: '', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Email address is required.');
});

test('Email: Whitespace-only fails', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: '   ', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Email address is required.');
});

test('Email: Missing @ symbol fails', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete.ironforge.com', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Please enter a valid email address.');
});

test('Email: Missing domain extension (.com) fails', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Please enter a valid email address.');
});

test('Email: Embedded spaces fail', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'ath lete@ironforge.com', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Please enter a valid email address.');
});

test('Email: Trailing dot fails', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.', phone: '1234567' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Please enter a valid email address.');
});

test('Email: Valid standard email passes', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.com', phone: '1234567' });
  assert.strictEqual(res.isValid, true);
});

// 1.3 Phone Edge Cases
test('Phone: Empty string fails', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.com', phone: '' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.phone, 'Phone number is required.');
});

test('Phone: Short phone (< 7 characters) fails', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.com', phone: '123456' });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.phone, 'Please provide a valid phone number (min 7 digits).');
});

test('Phone: Exactly 7 digits boundary passes length check', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.com', phone: '5551234' });
  assert.strictEqual(res.isValid, true);
});

test('Phone: Standard US formatted phone (+1 (800) 476-6367) passes', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.com', phone: '+1 (800) 476-6367' });
  assert.strictEqual(res.isValid, true);
});

test('Phone: Very long phone (50 chars) passes length check', () => {
  const res = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.com', phone: '+1234567890123456789012345678901234567890' });
  assert.strictEqual(res.isValid, true);
});

test('CRITIC OBSERVATION: phoneRegex is defined but unused in ContactForm', () => {
  // In ContactForm.tsx:
  // line 56: const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  // but it is NEVER tested against values.phone. Only .length < 7 is checked.
  // As a result: alphabetic string of length 7 passes!
  const resAlpha = validateContactForm({ fullName: 'Marcus Vance', email: 'athlete@ironforge.com', phone: 'abcdefg' });
  assert.strictEqual(resAlpha.isValid, true, 'Permissive validation allows alpha strings because phoneRegex is unused');
});

// =========================================================================
// SECTION 2: ContactForm State Machine & UI Verification
// =========================================================================
console.log(`\n${BOLD}2. ContactForm State Machine & Demo Notice Verification${RESET}`);

const contactFormCode = fs.readFileSync(path.join(__dirname, '../src/components/forms/ContactForm.tsx'), 'utf8');

test('Form Status Type includes all 5 states: idle, validating, submitting, success, error', () => {
  assert.ok(contactFormCode.includes("'idle' | 'validating' | 'submitting' | 'success' | 'error'"));
});

test('Prominent DEMO MODE Badge is rendered with disclosure copy', () => {
  assert.ok(contactFormCode.includes('variant="demo"'));
  assert.ok(contactFormCode.includes('DEMO MODE'));
  assert.ok(contactFormCode.includes('Submissions are simulated for client demonstration'));
});

test('Success state renders personalized confirmation and reset button', () => {
  assert.ok(contactFormCode.includes("status === 'success'"));
  assert.ok(contactFormCode.includes('Enquiry Dispatched!'));
  assert.ok(contactFormCode.includes('Submit Another Enquiry'));
  assert.ok(contactFormCode.includes('handleReset'));
});

test('Error state renders alert role with error banner', () => {
  assert.ok(contactFormCode.includes('role="alert"'));
  assert.ok(contactFormCode.includes('Please resolve the highlighted validation issues below'));
});

// =========================================================================
// SECTION 3: WhatsApp URL Builder & Parameter Sanitization Stress-Testing
// =========================================================================
console.log(`\n${BOLD}3. WhatsApp URL Builder Stress-Testing${RESET}`);

function buildWhatsAppUrl(whatsappNumber, customMessage, tier) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  let text = customMessage;
  if (!text) {
    if (tier) {
      text = `Hello IRONFORGE FITNESS! I would like to inquire about the ${tier.toUpperCase()} membership tier and schedule a visit.`;
    } else {
      text = `Hello IRONFORGE FITNESS! I am interested in training programs and membership details.`;
    }
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

test('WhatsApp Phone Sanitization: removes +, spaces, parentheses, dashes', () => {
  const url = buildWhatsAppUrl('+1 (800) 476-6367', null, null);
  assert.ok(url.startsWith('https://wa.me/18004766367?text='));
});

test('WhatsApp URL: Special characters in custom message correctly URL-encoded', () => {
  const complexMessage = 'Hello! Does "Pro" tier include & save $190/yr? Also <script>alert(1)</script> & 100% gains?';
  const url = buildWhatsAppUrl('+18004766367', complexMessage, null);
  
  const parsed = new URL(url);
  assert.strictEqual(parsed.hostname, 'wa.me');
  assert.strictEqual(parsed.pathname, '/18004766367');
  
  const retrievedText = parsed.searchParams.get('text');
  assert.strictEqual(retrievedText, complexMessage);
});

test('WhatsApp URL: Tier parameter injection stress-test', () => {
  const maliciousTier = 'pro&admin=true#fragment';
  const url = buildWhatsAppUrl('+18004766367', null, maliciousTier);
  const parsed = new URL(url);
  
  assert.strictEqual(parsed.searchParams.get('admin'), null);
  assert.strictEqual(parsed.hash, '');
  assert.ok(parsed.searchParams.get('text').includes('PRO&ADMIN=TRUE#FRAGMENT'));
});

// =========================================================================
// SECTION 4: Membership Pricing & Matrix Math Verification
// =========================================================================
console.log(`\n${BOLD}4. Membership Pricing Math & Amenities Matrix Calculations${RESET}`);

// Safely extract membership data from src/config/membership.ts
const membershipRaw = fs.readFileSync(path.join(__dirname, '../src/config/membership.ts'), 'utf8');
const jsCode = membershipRaw
  .replace(/export interface[\s\S]*?}\n\n/g, '')
  .replace(/export const membershipPlans: MembershipPlan\[\] =/, 'const membershipPlans =')
  .replace(/export const amenityMatrix: AmenityMatrixRow\[\] =/, 'const amenityMatrix =');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(jsCode + '\nthis.membershipPlans = membershipPlans; this.amenityMatrix = amenityMatrix;', sandbox);
const { membershipPlans, amenityMatrix } = sandbox;

test('Membership plans contain exactly 3 tiers: Starter, Pro, Elite', () => {
  assert.strictEqual(membershipPlans.length, 3);
  const ids = Array.from(membershipPlans).map(p => p.id);
  assert.strictEqual(ids[0], 'starter');
  assert.strictEqual(ids[1], 'pro');
  assert.strictEqual(ids[2], 'elite');
});

test('Membership Annual Discount Math: ~20% discount on all tiers', () => {
  for (const plan of membershipPlans) {
    const monthlyRate = plan.priceMonthly;
    const annualMonthlyRate = plan.priceAnnualMonthly;
    
    // Discount percentage = (monthly - annualMonthly) / monthly
    const discountFraction = (monthlyRate - annualMonthlyRate) / monthlyRate;
    const discountPercent = discountFraction * 100;
    
    console.log(`    Tier ${plan.id.toUpperCase()}: $${monthlyRate}/mo -> $${annualMonthlyRate}/mo (${discountPercent.toFixed(2)}% discount)`);
    
    // Must be between 20.0% and 20.5% (accounting for integer dollar rounding)
    assert.ok(discountPercent >= 20.0 && discountPercent <= 20.5, 
      `Discount for ${plan.id} should be ~20%, got ${discountPercent.toFixed(2)}%`);
      
    // Total annual savings
    const annualMonthlyCost = annualMonthlyRate * 12;
    const fullMonthlyCost = monthlyRate * 12;
    const annualSavings = fullMonthlyCost - annualMonthlyCost;
    
    assert.ok(annualSavings > 0, 'Annual savings must be positive');
  }
});

test('Amenity Matrix contains exactly 16 comprehensive rows', () => {
  assert.strictEqual(amenityMatrix.length, 16);
});

test('Amenity Matrix has valid entries for all three tiers in every row', () => {
  for (const row of amenityMatrix) {
    assert.ok(row.feature && row.feature.length > 0, 'Row must have feature description');
    assert.ok(row.starter !== undefined, `Row ${row.feature} missing starter value`);
    assert.ok(row.pro !== undefined, `Row ${row.feature} missing pro value`);
    assert.ok(row.elite !== undefined, `Row ${row.feature} missing elite value`);
  }
});

test('Pro Athlete plan has popular=true and lime accent', () => {
  const proPlan = membershipPlans.find(p => p.id === 'pro');
  assert.strictEqual(proPlan.popular, true);
  assert.strictEqual(proPlan.accentBorder, 'lime');
});

// =========================================================================
// SUMMARY
// =========================================================================
console.log(`\n${BOLD}${CYAN}------------------------------------------------------${RESET}`);
console.log(`${BOLD}ADVERSARIAL STRESS TEST SUMMARY:${RESET}`);
console.log(`  Total Executed: ${totalTests}`);
console.log(`  Passed:         ${GREEN}${passedTests}${RESET}`);
console.log(`  Failed:         ${failedTests > 0 ? RED : GREEN}${failedTests}${RESET}`);
console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
