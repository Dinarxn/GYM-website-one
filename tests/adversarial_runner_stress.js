/**
 * Adversarial Runner & Assertion Framework Stress Suite
 * IRONFORGE FITNESS E2E Test Suite - Iteration 2 Challenger Verification
 */

const assert = require('./helpers/assert');
const { TestRunner, TestSuite } = require('./runner');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runAdversarialHarness() {
  console.log('\n======================================================');
  console.log('   RUNNER & ASSERTION ADVERSARIAL STRESS HARNESS      ');
  console.log('======================================================\n');

  let passedCases = 0;
  let failedCases = 0;

  function record(name, pass, err = null) {
    if (pass) {
      passedCases++;
      console.log(`  \x1b[32m✔\x1b[0m [PASS] ${name}`);
    } else {
      failedCases++;
      console.error(`  \x1b[31m✖\x1b[0m [FAIL] ${name}`);
      if (err) console.error(`    \x1b[31m${err.message || err}\x1b[0m`);
    }
  }

  // =========================================================================
  // 1. ASSERTION LIBRARY STRESS TESTS
  // =========================================================================
  console.log('\x1b[1m[Section 1: Assertion Library Stress]\x1b[0m');

  // 1.1 assert()
  try {
    assert.assert(true, 'should pass');
    let threw = false;
    try {
      assert.assert(false, 'custom error msg');
    } catch (e) {
      threw = e instanceof assert.AssertionError && e.message === 'custom error msg';
    }
    record('assert() positive and negative boundary', threw);
  } catch (err) {
    record('assert() positive and negative boundary', false, err);
  }

  // 1.2 equal() and notEqual()
  try {
    assert.equal(42, 42);
    assert.equal('ironforge', 'ironforge');
    assert.notEqual(42, '42'); // strict equality check
    let threw = false;
    try {
      assert.equal(1, 2, 'mismatch');
    } catch (e) {
      threw = e instanceof assert.AssertionError && e.message.includes('mismatch');
    }
    record('equal() & notEqual() strict type and identity boundaries', threw);
  } catch (err) {
    record('equal() & notEqual() strict type and identity boundaries', false, err);
  }

  // 1.3 deepEqual()
  try {
    const objA = { a: [1, 2, { b: 'c' }], d: 10 };
    const objB = { a: [1, 2, { b: 'c' }], d: 10 };
    assert.deepEqual(objA, objB);

    // Negative deepEqual: array vs object
    let threw1 = false;
    try {
      assert.deepEqual([1, 2], { 0: 1, 1: 2 });
    } catch (e) {
      threw1 = true;
    }

    // Negative deepEqual: missing key
    let threw2 = false;
    try {
      assert.deepEqual({ a: 1 }, { a: 1, b: 2 });
    } catch (e) {
      threw2 = true;
    }

    // Negative deepEqual: mismatched nested value
    let threw3 = false;
    try {
      assert.deepEqual({ a: { b: 1 } }, { a: { b: 2 } });
    } catch (e) {
      threw3 = true;
    }

    record('deepEqual() nested structures & structural disparity checks', threw1 && threw2 && threw3);
  } catch (err) {
    record('deepEqual() nested structures & structural disparity checks', false, err);
  }

  // 1.4 match() and notMatch()
  try {
    assert.match('IRONFORGE FITNESS', /^IRONFORGE/);
    assert.match('hello@ironforge.com', '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
    assert.notMatch('invalid-email', /@/);

    let threw = false;
    try {
      assert.match('abc', /xyz/, 'pattern failed');
    } catch (e) {
      threw = e.message.includes('pattern failed');
    }
    record('match() & notMatch() regex validation & error messaging', threw);
  } catch (err) {
    record('match() & notMatch() regex validation & error messaging', false, err);
  }

  // 1.5 includes()
  try {
    assert.includes('Acid Lime (#C6FF33)', '#C6FF33');
    assert.includes(['barbell', 'dumbbell'], 'barbell');
    assert.includes(new Set([1, 2, 3]), 2);
    assert.includes({ a: 'val1', b: 'val2' }, 'val2');

    let threw = false;
    try {
      assert.includes(['barbell'], 'kettlebell');
    } catch (e) {
      threw = true;
    }
    record('includes() string, array, set, and object dictionary support', threw);
  } catch (err) {
    record('includes() string, array, set, and object dictionary support', false, err);
  }

  // 1.6 throws()
  try {
    // String matching
    assert.throws(() => { throw new Error('Timeout exceeded'); }, 'Timeout');
    // RegExp matching
    assert.throws(() => { throw new RangeError('Index 99 out of range'); }, /out of range/i);
    // Class constructor matching
    assert.throws(() => { throw new TypeError('Invalid type'); }, TypeError);

    // Negative: doesn't throw
    let threwOnNoThrow = false;
    try {
      assert.throws(() => { /* nothing */ });
    } catch (e) {
      threwOnNoThrow = e.message.includes('Expected function to throw an error');
    }

    // Negative: throws wrong message
    let threwOnWrongMsg = false;
    try {
      assert.throws(() => { throw new Error('foo'); }, 'bar');
    } catch (e) {
      threwOnWrongMsg = e.message.includes('Expected error message to include "bar"');
    }

    record('throws() validation with string, regex, constructor, and negative verification', threwOnNoThrow && threwOnWrongMsg);
  } catch (err) {
    record('throws() validation with string, regex, constructor, and negative verification', false, err);
  }

  // 1.7 rejects()
  try {
    await assert.rejects(async () => {
      throw new Error('Async network failure');
    }, 'network failure');

    await assert.rejects(Promise.reject(new Error('Direct rejection')), /rejection/);

    // Negative: resolves instead of rejecting
    let threwOnResolve = false;
    try {
      await assert.rejects(async () => 'success');
    } catch (e) {
      threwOnResolve = e.message.includes('Expected promise to reject');
    }

    record('rejects() async rejection trapping with message matching and resolution detection', threwOnResolve);
  } catch (err) {
    record('rejects() async rejection trapping with message matching and resolution detection', false, err);
  }

  // 1.8 closeTo(), truthy(), falsy()
  try {
    assert.closeTo(0.1 + 0.2, 0.3, 0.0001);
    assert.truthy('non-empty string');
    assert.truthy(1);
    assert.truthy({});
    assert.falsy('');
    assert.falsy(0);
    assert.falsy(null);
    assert.falsy(undefined);
    assert.falsy(false);

    let threwClose = false;
    try {
      assert.closeTo(1.0, 1.5, 0.1);
    } catch (e) {
      threwClose = true;
    }
    record('closeTo(), truthy(), and falsy() boundary precision and coercions', threwClose);
  } catch (err) {
    record('closeTo(), truthy(), and falsy() boundary precision and coercions', false, err);
  }

  // =========================================================================
  // 2. RUNNER TIMEOUT ADVERSARIAL STRESS
  // =========================================================================
  console.log('\n\x1b[1m[Section 2: Runner Timeout Adversarial Stress]\x1b[0m');

  // 2.1 Direct runTestWithTimeout trapping
  try {
    const runner = new TestRunner({ silent: true, noWriteResults: true });
    let timeoutCaught = false;
    const start = Date.now();
    try {
      await runner.runTestWithTimeout(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }, 50);
    } catch (err) {
      const elapsed = Date.now() - start;
      // Must catch timeout error and abort well before the 400ms task completes
      timeoutCaught = err.message.includes('Test exceeded timeout of 50ms') && elapsed < 350;
    }
    record('runTestWithTimeout terminates long-running async promises promptly at timeout threshold', timeoutCaught);
  } catch (err) {
    record('runTestWithTimeout terminates long-running async promises promptly at timeout threshold', false, err);
  }

  // 2.2 Suite level timeout handling
  try {
    const runner = new TestRunner({ timeout: 60, silent: true, noWriteResults: true });
    runner.describe('Timeout Suite (tier1/timeout.test.js)', () => {
      runner.test('Fast Test', () => { /* fast */ });
      runner.test('Slow Test Hanging', async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
      });
      runner.test('Subsequent Fast Test', () => { /* should still run */ });
    });

    const passed = await runner.execute();
    const isSuccess = !passed &&
      runner.stats.total === 3 &&
      runner.stats.passed === 2 &&
      runner.stats.failed === 1 &&
      runner.results.some((r) => r.name === 'Slow Test Hanging' && r.status === 'failed' && r.error.includes('timeout'));

    record('TestRunner accurately marks timed-out test as failed without aborting remaining suite tests', isSuccess);
  } catch (err) {
    record('TestRunner accurately marks timed-out test as failed without aborting remaining suite tests', false, err);
  }

  // =========================================================================
  // 3. UNHANDLED REJECTION & UNCAUGHT EXCEPTION ADVERSARIAL STRESS
  // =========================================================================
  console.log('\n\x1b[1m[Section 3: Unhandled Rejection & Uncaught Exception Stress]\x1b[0m');

  // 3.1 Unhandled Promise Rejection Trap
  try {
    const runner = new TestRunner({ silent: true, noWriteResults: true });
    runner.describe('Rejection Suite (tier1/rejection.test.js)', () => {
      runner.test('Trigger Unhandled Rejection', async () => {
        // Asynchronously emit an unhandled rejection outside the test promise chain
        setTimeout(() => {
          Promise.reject(new Error('Uncaught background task error'));
        }, 10);
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
    });

    const passed = await runner.execute();
    const captured = runner.results.some(
      (r) => r.status === 'failed' && r.error && r.error.includes('Uncaught background task error')
    );
    const failureCounted = runner.stats.failed >= 1;

    record('TestRunner catches global unhandledRejection, preserves runner process, and tallies failure', !passed && captured && failureCounted);
  } catch (err) {
    record('TestRunner catches global unhandledRejection, preserves runner process, and tallies failure', false, err);
  }

  // 3.2 Uncaught Exception Trap
  try {
    const runner = new TestRunner({ silent: true, noWriteResults: true });
    runner.describe('Exception Suite (tier1/exception.test.js)', () => {
      runner.test('Trigger Uncaught Async Exception', async () => {
        setTimeout(() => {
          // Thrown inside timeout callback without handler -> triggers uncaughtException
          throw new Error('Async timer explosion');
        }, 10);
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
    });

    const passed = await runner.execute();
    const captured = runner.results.some(
      (r) => r.status === 'failed' && r.error && r.error.includes('Async timer explosion')
    );
    const failureCounted = runner.stats.failed >= 1;

    record('TestRunner catches global uncaughtException, preserves runner process, and tallies failure', !passed && captured && failureCounted);
  } catch (err) {
    record('TestRunner catches global uncaughtException, preserves runner process, and tallies failure', false, err);
  }

  // =========================================================================
  // 4. LIFECYCLE HOOKS ADVERSARIAL STRESS (beforeAll, beforeEach, afterEach, afterAll)
  // =========================================================================
  console.log('\n\x1b[1m[Section 4: Lifecycle Hooks Adversarial Stress]\x1b[0m');

  // 4.1 Failing beforeAll halts entire suite
  try {
    let test1Executed = false;
    let test2Executed = false;
    const runner = new TestRunner({ silent: true, noWriteResults: true });

    runner.describe('Failing beforeAll Suite (tier1/beforeall.test.js)', () => {
      runner.beforeAll(() => {
        throw new Error('DB connection failed in beforeAll');
      });
      runner.test('Test 1', () => { test1Executed = true; });
      runner.test('Test 2', () => { test2Executed = true; });
    });

    const passed = await runner.execute();
    const hookFailureRecorded = runner.results.some(
      (r) => r.name.includes('beforeAll hook') && r.status === 'failed' && r.error.includes('DB connection failed')
    );
    const testsWereSkipped = !test1Executed && !test2Executed;
    const failureCounted = runner.stats.failed === 1;

    record('Failing beforeAll halts suite, skips subsequent tests, and logs hook failure', !passed && hookFailureRecorded && testsWereSkipped && failureCounted);
  } catch (err) {
    record('Failing beforeAll halts suite, skips subsequent tests, and logs hook failure', false, err);
  }

  // 4.2 Failing beforeEach halts test, reports failure, but continues to next test
  try {
    let callCount = 0;
    let test1Executed = false;
    let test2Executed = false;
    const runner = new TestRunner({ silent: true, noWriteResults: true });

    runner.describe('Failing beforeEach Suite (tier1/beforeeach.test.js)', () => {
      runner.beforeEach(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('beforeEach simulated setup crash on test 1');
        }
      });
      runner.test('Test 1 with failing beforeEach', () => { test1Executed = true; });
      runner.test('Test 2 with working beforeEach', () => { test2Executed = true; });
    });

    const passed = await runner.execute();
    const test1FailedWithHookError = runner.results.some(
      (r) => r.name === 'Test 1 with failing beforeEach' && r.status === 'failed' && r.error.includes('beforeEach hook failed')
    );
    const test2Passed = runner.results.some(
      (r) => r.name === 'Test 2 with working beforeEach' && r.status === 'passed'
    );
    const test1SkippedFn = !test1Executed && test2Executed;

    record('Failing beforeEach halts affected test fn without executing it, but allows next test to proceed', !passed && test1FailedWithHookError && test2Passed && test1SkippedFn);
  } catch (err) {
    record('Failing beforeEach halts affected test fn without executing it, but allows next test to proceed', false, err);
  }

  // 4.3 Failing afterEach converts passed test to failed
  try {
    const runner = new TestRunner({ silent: true, noWriteResults: true });
    runner.describe('Failing afterEach Suite (tier1/aftereach.test.js)', () => {
      runner.afterEach(() => {
        throw new Error('Cleanup failed in afterEach');
      });
      runner.test('Test passing its body', () => {
        assert.equal(1, 1);
      });
    });

    const passed = await runner.execute();
    const testFailedInAfterEach = runner.results.some(
      (r) => r.name === 'Test passing its body' && r.status === 'failed' && r.error.includes('afterEach hook failed')
    );
    const statsAccurate = runner.stats.passed === 0 && runner.stats.failed === 1;

    record('Failing afterEach rolls back passed status and tallies test as failed', !passed && testFailedInAfterEach && statsAccurate);
  } catch (err) {
    record('Failing afterEach rolls back passed status and tallies test as failed', false, err);
  }

  // 4.4 Failing afterAll logs failure and sets non-zero exit state
  try {
    const runner = new TestRunner({ silent: true, noWriteResults: true });
    runner.describe('Failing afterAll Suite (tier1/afterall.test.js)', () => {
      runner.test('Normal Test', () => { assert.equal(1, 1); });
      runner.afterAll(() => {
        throw new Error('Teardown crash in afterAll');
      });
    });

    const passed = await runner.execute();
    const hookFailureRecorded = runner.results.some(
      (r) => r.name.includes('afterAll hook') && r.status === 'failed' && r.error.includes('Teardown crash')
    );
    const statsAccurate = runner.stats.passed === 1 && runner.stats.failed === 1;

    record('Failing afterAll records teardown failure and causes suite to fail', !passed && hookFailureRecorded && statsAccurate);
  } catch (err) {
    record('Failing afterAll records teardown failure and causes suite to fail', false, err);
  }

  // =========================================================================
  // 5. TEST FILTERING, OPTIONS & CONFIGURATION INTEGRITY
  // =========================================================================
  console.log('\n\x1b[1m[Section 5: Filtering & Configuration Integrity]\x1b[0m');

  // 5.1 Test name filter
  try {
    const runner = new TestRunner({ filter: 'Special', silent: true, noWriteResults: true });
    runner.describe('Filtering Suite', () => {
      runner.test('Normal Test Alpha', () => {});
      runner.test('Special Test Beta', () => {});
      runner.test('Another Normal Test', () => {});
    });

    await runner.execute();
    const isFiltered = runner.stats.total === 1 &&
      runner.stats.passed === 1 &&
      runner.stats.skipped === 2 &&
      runner.results.length === 1 &&
      runner.results[0].name === 'Special Test Beta';

    record('Runner options.filter executes only matched tests and increments stats.skipped', isFiltered);
  } catch (err) {
    record('Runner options.filter executes only matched tests and increments stats.skipped', false, err);
  }

  // 5.2 noWriteResults flag prevents touching test-results.json
  try {
    const resultsPath = path.join(process.cwd(), 'test-results.json');
    const mtimeBefore = fs.existsSync(resultsPath) ? fs.statSync(resultsPath).mtimeMs : null;

    const runner = new TestRunner({ silent: true, noWriteResults: true });
    runner.describe('Dummy Suite', () => { runner.test('Dummy', () => {}); });
    await runner.execute();

    const mtimeAfter = fs.existsSync(resultsPath) ? fs.statSync(resultsPath).mtimeMs : null;
    const unmodified = mtimeBefore === mtimeAfter;

    record('options.noWriteResults strictly preserves filesystem state of test-results.json', unmodified);
  } catch (err) {
    record('options.noWriteResults strictly preserves filesystem state of test-results.json', false, err);
  }

  // =========================================================================
  // 6. PROCESS-LEVEL ADVERSARIAL EXIT CODES & CLI INVOCATION
  // =========================================================================
  console.log('\n\x1b[1m[Section 6: CLI Invocation & Exit Code Verification]\x1b[0m');

  // 6.1 CLI with tier filter
  try {
    const proc = spawnSync(process.execPath, ['tests/runner.js', '--tier=4'], { encoding: 'utf8' });
    const cleanStdout = (proc.stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
    const exitZero = proc.status === 0;
    const stdoutHasTier4Only = cleanStdout.includes('Tier 4') &&
      cleanStdout.includes('Total Tests: 10') &&
      cleanStdout.includes('Passed: 10') &&
      cleanStdout.includes('Failed: 0');

    record('CLI execution with --tier=4 loads exactly Tier 4 suites and exits code 0', exitZero && stdoutHasTier4Only);
  } catch (err) {
    record('CLI execution with --tier=4 loads exactly Tier 4 suites and exits code 0', false, err);
  }

  // 6.2 CLI with deliberate failure script
  try {
    const tempTestFile = path.join(process.cwd(), 'tests', 'tier1', '__temp_failing_challenge__.test.js');
    try {
      fs.writeFileSync(tempTestFile, `
        describe('Temp Adversarial Failing Suite', () => {
          it('Deliberate challenger injection error test', () => {
            throw new Error('Deliberate challenger injection error');
          });
        });
      `);

      const proc = spawnSync(process.execPath, ['tests/runner.js', '--filter=Deliberate challenger'], { encoding: 'utf8' });
      const cleanStdout = (proc.stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
      const exitNonZero = proc.status === 1;
      const reportedFailure = cleanStdout.includes('1 TEST(S) FAILED (EXIT CODE 1)') &&
        cleanStdout.includes('Deliberate challenger injection error');

      record('CLI master runner exits with code 1 and accurate error diff upon deliberate test failure', exitNonZero && reportedFailure);
    } finally {
      if (fs.existsSync(tempTestFile)) {
        fs.unlinkSync(tempTestFile);
      }
    }
  } catch (err) {
    record('CLI master runner exits with code 1 and accurate error diff upon deliberate test failure', false, err);
  }

  // =========================================================================
  // 7. SEQUENTIAL IDEMPOTENCY & RUNNER LEAK STRESS
  // =========================================================================
  console.log('\n\x1b[1m[Section 7: Sequential Idempotency & Runner Trap Stress]\x1b[0m');

  // 7.1 Multi-run CLI Idempotency
  try {
    const cliRuns = [];
    for (let i = 1; i <= 3; i++) {
      const t0 = Date.now();
      const proc = spawnSync(process.execPath, ['tests/runner.js'], { encoding: 'utf8' });
      const elapsed = Date.now() - t0;
      const cleanStdout = (proc.stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
      const passed = proc.status === 0 &&
        cleanStdout.includes('ALL 234 E2E TESTS PASSED CLEANLY (EXIT CODE 0)');
      cliRuns.push({ run: i, passed, elapsed });
    }

    const allCliPassed = cliRuns.every((r) => r.passed);
    const avgCliDur = cliRuns.reduce((a, b) => a + b.elapsed, 0) / cliRuns.length;
    record(`3 consecutive CLI test runs: 100% deterministic (234/234 passed each, exit code 0, avg ${avgCliDur.toFixed(0)}ms)`, allCliPassed);
  } catch (err) {
    record('3 consecutive CLI test runs: 100% deterministic', false, err);
  }

  // 7.2 Detection of unhandled rejection leak under options.silent = true
  try {
    const runner = new TestRunner({ silent: true, noWriteResults: true });
    runner.loadTestFiles(path.join(process.cwd(), 'tests'));
    const success = await runner.execute();
    const hasRejectionLeak = runner.stats.failed === 1 &&
      runner.results.some((r) => r.suite === 'Process Runtime' && r.error.includes('Simulated async background rejection'));

    if (hasRejectionLeak) {
      console.warn('    \x1b[33m⚠ Empirical finding: TestRunner({ silent: true }) leaks unhandled rejection from T2-20-03 because line 205 has inverted/faulty condition (!this.silent)\x1b[0m');
    }

    // Record this test as a stress finding verification:
    // If hasRejectionLeak is true, it empirically verifies and confirms the bug exists!
    record('Empirical verification of unhandled rejection trap leak under TestRunner({ silent: true })', hasRejectionLeak);
  } catch (err) {
    record('Empirical verification of unhandled rejection trap leak under TestRunner({ silent: true })', false, err);
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n------------------------------------------------------');
  console.log(`STRESS HARNESS RESULT: ${passedCases} Passed, ${failedCases} Failed`);
  console.log('------------------------------------------------------\n');

  return { passedCases, failedCases };
}

if (require.main === module) {
  runAdversarialHarness().then(({ failedCases }) => {
    process.exit(failedCases === 0 ? 0 : 1);
  });
}

module.exports = { runAdversarialHarness };
