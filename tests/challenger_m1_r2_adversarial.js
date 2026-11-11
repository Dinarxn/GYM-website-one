/**
 * Adversarial Empirical Verification Harness — Milestone 1 Iteration 2
 * Challenger 1 (CRITIC)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Extract actual validation code from ContactForm.tsx to guarantee zero-mock fidelity
const contactFormPath = path.resolve(__dirname, '../src/components/forms/ContactForm.tsx');
const contactFormCode = fs.readFileSync(contactFormPath, 'utf8');

// Match the phoneRegex in the source code
const regexMatch = contactFormCode.match(/const phoneRegex = (\/.*?\/);/);
if (!regexMatch) {
  throw new Error('Could not extract phoneRegex from ContactForm.tsx');
}
const sourceRegex = eval(regexMatch[1]);

function validatePhone(phone) {
  const values = { phone };
  const newErrors = {};

  if (!values.phone.trim()) {
    newErrors.phone = 'Phone number is required.';
  } else if (values.phone.trim().length < 7 || !sourceRegex.test(values.phone.trim())) {
    newErrors.phone = 'Please provide a valid phone number (min 7 digits).';
  }

  return {
    valid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
}

const tests = [
  // 1. Alphabetic inputs
  {
    name: 'Reject alphabetic string "abcdefg"',
    input: 'abcdefg',
    expectValid: false
  },
  {
    name: 'Reject mixed alphanumeric "phone1234"',
    input: 'phone1234',
    expectValid: false
  },

  // 2. Too-short inputs (< 7 chars)
  {
    name: 'Reject empty string',
    input: '',
    expectValid: false
  },
  {
    name: 'Reject 6 digits "123456"',
    input: '123456',
    expectValid: false
  },

  // 3. Valid International & Standard formats
  {
    name: 'Accept US formatted "+1 (800) 476-6367"',
    input: '+1 (800) 476-6367',
    expectValid: true
  },
  {
    name: 'Accept UK international "+44 7911 123456"',
    input: '+44 7911 123456',
    expectValid: true
  },
  {
    name: 'Accept standard "555-1234"',
    input: '555-1234',
    expectValid: true
  },
  {
    name: 'Accept standard "800-476-6367"',
    input: '800-476-6367',
    expectValid: true
  },

  // 4. Symbols-only and Defective Inputs (Stress Testing)
  {
    name: 'Reject arbitrary symbols "!@#$%^&*"',
    input: '!@#$%^&*',
    expectValid: false
  },
  {
    name: 'Reject symbol-only input "-------" (7 dashes, 0 digits)',
    input: '-------',
    expectValid: false,
    isAdversarialFailure: true
  },
  {
    name: 'Reject symbol-only input "(((--)))" (8 parens/dashes, 0 digits)',
    input: '(((--)))',
    expectValid: false,
    isAdversarialFailure: true
  },
  {
    name: 'Reject symbol-only input "... ... ..." (11 dots/spaces, 0 digits)',
    input: '... ... ...',
    expectValid: false,
    isAdversarialFailure: true
  },
  {
    name: 'Reject symbol-only input "+......." (plus with 7 dots, 0 digits)',
    input: '+.......',
    expectValid: false,
    isAdversarialFailure: true
  },
  {
    name: 'Reject sub-minimum digits "1------" (1 digit, 6 dashes = 7 chars)',
    input: '1------',
    expectValid: false,
    isAdversarialFailure: true
  }
];

console.log('======================================================');
console.log('   CHALLENGER 1 EMPIRICAL PHONE VALIDATION HARNESS    ');
console.log(`   Source regex extracted: ${sourceRegex}`);
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;
const failureDetails = [];

for (const t of tests) {
  const res = validatePhone(t.input);
  const passed = res.valid === t.expectValid;

  if (passed) {
    passCount++;
    console.log(`✔ [PASS] ${t.name}`);
  } else {
    failCount++;
    console.log(`✖ [FAIL] ${t.name}`);
    console.log(`    Input: "${t.input}" | Actual valid: ${res.valid} | Expected valid: ${t.expectValid}`);
    failureDetails.push({
      test: t.name,
      input: t.input,
      actual: res.valid,
      expected: t.expectValid,
      isAdversarialFailure: t.isAdversarialFailure
    });
  }
}

console.log('\n------------------------------------------------------');
console.log(`Summary: ${passCount} passed, ${failCount} failed out of ${tests.length} tests.`);
console.log('======================================================');

if (failureDetails.length > 0) {
  console.log('\nCRITICAL ADVERSARIAL DEFECTS DETECTED:');
  failureDetails.forEach((f, idx) => {
    console.log(`  ${idx + 1}. ${f.test}`);
    console.log(`     Input "${f.input}" returned valid=${f.actual}, but should be valid=${f.expected}.`);
  });
}
