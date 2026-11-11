const { TestRunner } = require('../../../tests/runner.js');

async function testRunnerFailureHandling() {
  const runner = new TestRunner();
  runner.describe('Adversarial Verification Suite', () => {
    runner.test('Passing test', () => {
      // pass
    });
    runner.test('Failing test', () => {
      throw new Error('Deliberate assertion failure for auditor verification');
    });
  });

  const success = await runner.execute();
  console.log(`Runner returned success: ${success}`);
  console.log(`Stats total: ${runner.stats.total}, passed: ${runner.stats.passed}, failed: ${runner.stats.failed}`);
  if (!success && runner.stats.failed === 1 && runner.stats.passed === 1) {
    console.log('AUDIT_VERIFIED: TestRunner correctly detects test failure and returns false.');
  } else {
    console.error('AUDIT_FAILED: TestRunner did not behave as expected.');
    process.exit(1);
  }
}

testRunnerFailureHandling();
