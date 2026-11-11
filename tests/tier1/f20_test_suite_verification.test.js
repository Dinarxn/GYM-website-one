const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 20: E2E Testing Suite & Coverage Verification', () => {
  test('T1-F20-01: Node.js Test Runner Zero-Dependency Execution', () => {
    const runnerPath = path.join(process.cwd(), 'tests/runner.js');
    assert.truthy(fs.existsSync(runnerPath), 'Runner file must exist at tests/runner.js');

    const content = fs.readFileSync(runnerPath, 'utf8');
    assert.includes(content, 'class TestRunner');
    assert.includes(content, 'loadTestFiles');
  });

  test('T1-F20-02: Assertion Library Core Functions Verification', () => {
    // 1. Positive contracts: verify helper methods succeed on valid conditions
    assert.equal(String(2026), '2026', 'equal matches identical string representation');
    assert.notEqual('obsidian', 'lime', 'notEqual distinguishes distinct strings');
    assert.deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }, 'deepEqual matches nested structures');
    assert.match('IRONFORGE FITNESS', /^IRONFORGE/, 'match validates regex prefix');
    assert.notMatch('IRONFORGE FITNESS', /^TITAN/, 'notMatch rejects mismatched regex');
    assert.includes(['strength', 'hiit', 'conditioning'], 'strength', 'includes finds array element');
    assert.includes('IRONFORGE', 'FORGE', 'includes finds substring');
    assert.truthy(process.cwd().length > 0, 'truthy validates truthy expression');
    assert.falsy(false, 'falsy validates false boolean');
    assert.closeTo(3.14159, 3.14, 0.01, 'closeTo validates float tolerance');

    // 2. Negative contracts: verify that assertion library throws AssertionError when conditions fail
    assert.throws(
      () => assert.equal('black', 'white'),
      assert.AssertionError,
      'equal must throw AssertionError on unequal values'
    );
    assert.throws(
      () => assert.notEqual(100, 100),
      assert.AssertionError,
      'notEqual must throw AssertionError on equal values'
    );
    assert.throws(
      () => assert.deepEqual({ x: 1 }, { x: 2 }),
      assert.AssertionError,
      'deepEqual must throw AssertionError on mismatched structures'
    );
    assert.throws(
      () => assert.match('IRONFORGE', /^GOLD/),
      assert.AssertionError,
      'match must throw AssertionError on pattern mismatch'
    );
    assert.throws(
      () => assert.notMatch('IRONFORGE', /^IRON/),
      assert.AssertionError,
      'notMatch must throw AssertionError when pattern matches'
    );
    assert.throws(
      () => assert.includes(['a', 'b'], 'z'),
      assert.AssertionError,
      'includes must throw AssertionError when item is missing'
    );
    assert.throws(
      () => assert.truthy(0),
      assert.AssertionError,
      'truthy must throw AssertionError on 0'
    );
    assert.throws(
      () => assert.truthy(''),
      assert.AssertionError,
      'truthy must throw AssertionError on empty string'
    );
    assert.throws(
      () => assert.falsy(true),
      assert.AssertionError,
      'falsy must throw AssertionError on true'
    );
    assert.throws(
      () => assert.falsy('truthy string'),
      assert.AssertionError,
      'falsy must throw AssertionError on non-empty string'
    );
    assert.throws(
      () => assert.closeTo(1.0, 2.0, 0.1),
      assert.AssertionError,
      'closeTo must throw AssertionError when difference exceeds delta'
    );
  });

  test('T1-F20-03: Tier 1 Feature Coverage Suite Aggregation', () => {
    const tier1Dir = path.join(process.cwd(), 'tests/tier1');
    const files = fs.readdirSync(tier1Dir).filter((f) => f.endsWith('.test.js'));

    assert.assert(files.length >= 20, `Tier 1 must contain 20 test suite files, found ${files.length}`);
  });

  test('T1-F20-04: Process Exit Code Semantics on Success', () => {
    const runnerSrc = fs.readFileSync(path.join(process.cwd(), 'tests/runner.js'), 'utf8');

    assert.includes(runnerSrc, 'process.exit(success ? 0 : 1)');
  });

  test('T1-F20-05: Structured JSON Summary Report Generation', () => {
    const runnerSrc = fs.readFileSync(path.join(process.cwd(), 'tests/runner.js'), 'utf8');

    assert.includes(runnerSrc, 'writeResultsFile');
    assert.includes(runnerSrc, 'test-results.json');
  });
});
