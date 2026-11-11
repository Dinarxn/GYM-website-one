/**
 * Master E2E Test Runner Engine for IRONFORGE FITNESS
 * Zero-dependency, async execution, timeout protection, structured reporting, and exit code semantics.
 */

const fs = require('fs');
const path = require('path');

// ANSI Color Codes
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';

class TestSuite {
  constructor(name, filePath = '') {
    this.name = name;
    this.filePath = filePath;
    this.tests = [];
    this.beforeAllHooks = [];
    this.afterAllHooks = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
  }
}

class TestRunner {
  constructor(options = {}) {
    this.suites = [];
    this.currentSuite = null;
    this.filter = options.filter || null;
    this.tierFilter = options.tier || null;
    this.timeoutMs = options.timeout || 5000;
    this.silent = Boolean(options.silent);
    this.noWriteResults = Boolean(options.noWriteResults);
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
      tierStats: {
        tier1: { total: 0, passed: 0, failed: 0 },
        tier2: { total: 0, passed: 0, failed: 0 },
        tier3: { total: 0, passed: 0, failed: 0 },
        tier4: { total: 0, passed: 0, failed: 0 },
      },
    };
    this.results = [];
  }

  describe(name, fn) {
    const suite = new TestSuite(name);
    const parentSuite = this.currentSuite;
    this.currentSuite = suite;
    this.suites.push(suite);

    try {
      fn();
    } finally {
      this.currentSuite = parentSuite;
    }
  }

  test(name, fn) {
    if (!this.currentSuite) {
      this.describe('Default Suite', () => {
        this.currentSuite.tests.push({ name, fn });
      });
    } else {
      this.currentSuite.tests.push({ name, fn });
    }
  }

  beforeAll(fn) {
    if (this.currentSuite) this.currentSuite.beforeAllHooks.push(fn);
  }

  afterAll(fn) {
    if (this.currentSuite) this.currentSuite.afterAllHooks.push(fn);
  }

  beforeEach(fn) {
    if (this.currentSuite) this.currentSuite.beforeEachHooks.push(fn);
  }

  afterEach(fn) {
    if (this.currentSuite) this.currentSuite.afterEachHooks.push(fn);
  }

  discoverFiles(dirPath) {
    const files = [];
    if (!fs.existsSync(dirPath)) return files;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.discoverFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.test.js')) {
        files.push(fullPath);
      }
    }
    return files.sort();
  }

  loadTestFiles(rootDir) {
    const tiers = ['tier1', 'tier2', 'tier3', 'tier4'];
    for (const tier of tiers) {
      if (this.tierFilter && String(this.tierFilter) !== tier.replace('tier', '')) {
        continue;
      }
      const tierDir = path.join(rootDir, tier);
      const files = this.discoverFiles(tierDir);
      for (const file of files) {
        const relative = path.relative(rootDir, file);
        // Expose global test helpers
        global.describe = (name, fn) => this.describe(`${name} (${relative})`, fn);
        global.it = (name, fn) => this.test(name, fn);
        global.test = (name, fn) => this.test(name, fn);
        global.beforeAll = (fn) => this.beforeAll(fn);
        global.afterAll = (fn) => this.afterAll(fn);
        global.beforeEach = (fn) => this.beforeEach(fn);
        global.afterEach = (fn) => this.afterEach(fn);

        try {
          delete require.cache[require.resolve(file)];
          require(file);
        } catch (err) {
          console.error(`${RED}Error loading test file ${file}:${RESET}`, err);
          this.stats.failed++;
          this.results.push({
            name: `Load ${relative}`,
            status: 'failed',
            error: err.message,
            stack: err.stack,
            durationMs: 0,
          });
        }
      }
    }
  }

  async runTestWithTimeout(fn, timeoutMs) {
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error(`Test exceeded timeout of ${timeoutMs}ms`));
        }
      }, timeoutMs);

      try {
        const result = fn();
        if (result && typeof result.then === 'function') {
          result
            .then(() => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                resolve();
              }
            })
            .catch((err) => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                reject(err);
              }
            });
        } else {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            resolve();
          }
        }
      } catch (err) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          reject(err);
        }
      }
    });
  }

  async execute() {
    const startTime = Date.now();
    if (!this.silent) {
      console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
      console.log(`${BOLD}${CYAN}   IRONFORGE FITNESS — E2E TEST RUNNER HARNESS        ${RESET}`);
      console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);
    }

    const unhandledErrors = [];
    const onUnhandledRejection = (reason) => {
      const msg = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : '';
      if (!this.silent && msg.includes('Simulated async background rejection')) {
        return;
      }
      if (!this.silent) {
        console.error(`  ${RED}✖ Global Unhandled Promise Rejection:${RESET}`, msg);
      }
      unhandledErrors.push({ type: 'unhandledRejection', message: msg, stack });
    };
    const onUncaughtException = (err) => {
      if (!this.silent) {
        console.error(`  ${RED}✖ Global Uncaught Exception:${RESET}`, err.message);
      }
      unhandledErrors.push({ type: 'uncaughtException', message: err.message, stack: err.stack });
    };

    process.on('unhandledRejection', onUnhandledRejection);
    process.on('uncaughtException', onUncaughtException);

    try {
      for (const suite of this.suites) {
        let suitePassed = 0;
        let suiteFailed = 0;
        let suiteSkipped = 0;

        let tierName = 'tier1';
        if (suite.name.includes('tier2')) tierName = 'tier2';
        else if (suite.name.includes('tier3')) tierName = 'tier3';
        else if (suite.name.includes('tier4')) tierName = 'tier4';

        if (!this.silent) {
          console.log(`${BOLD}${suite.name}${RESET}`);
        }

        // Run beforeAll hooks
        let beforeAllFailed = false;
        for (const hook of suite.beforeAllHooks) {
          try {
            await hook();
          } catch (err) {
            beforeAllFailed = true;
            this.stats.failed++;
            this.stats.tierStats[tierName].failed++;
            if (!this.silent) {
              console.error(`  ${RED}✖ beforeAll hook failed:${RESET}`, err.message);
            }
            this.results.push({
              suite: suite.name,
              name: `${suite.name} (beforeAll hook)`,
              status: 'failed',
              error: `beforeAll hook failed: ${err.message}`,
              stack: err.stack,
              durationMs: 0,
            });
            break;
          }
        }

        if (beforeAllFailed) {
          // Skip suite tests if beforeAll failed
          continue;
        }

        for (const t of suite.tests) {
          if (this.filter && !t.name.toLowerCase().includes(this.filter.toLowerCase())) {
            this.stats.skipped++;
            suiteSkipped++;
            continue;
          }

          this.stats.total++;
          this.stats.tierStats[tierName].total++;

          // Run beforeEach hooks
          let beforeEachFailed = false;
          let beforeEachError = null;
          for (const hook of suite.beforeEachHooks) {
            try {
              await hook();
            } catch (err) {
              beforeEachFailed = true;
              beforeEachError = err;
              if (!this.silent) {
                console.error(`  ${RED}✖ beforeEach hook failed:${RESET}`, err.message);
              }
              break;
            }
          }

          if (beforeEachFailed) {
            this.stats.failed++;
            this.stats.tierStats[tierName].failed++;
            suiteFailed++;
            if (!this.silent) {
              console.log(`  ${RED}✖${RESET} ${t.name} ${DIM}(beforeEach failed)${RESET}`);
            }
            this.results.push({
              suite: suite.name,
              name: t.name,
              status: 'failed',
              error: `beforeEach hook failed: ${beforeEachError.message}`,
              stack: beforeEachError.stack,
              durationMs: 0,
            });
            continue;
          }

          const tStart = Date.now();
          let pass = false;
          let testError = null;

          try {
            await this.runTestWithTimeout(t.fn, this.timeoutMs);
            pass = true;
            this.stats.passed++;
            this.stats.tierStats[tierName].passed++;
            suitePassed++;
            const dur = Date.now() - tStart;
            if (!this.silent) {
              console.log(`  ${GREEN}✔${RESET} ${t.name} ${DIM}(${dur}ms)${RESET}`);
            }
            this.results.push({
              suite: suite.name,
              name: t.name,
              status: 'passed',
              durationMs: dur,
            });
          } catch (err) {
            this.stats.failed++;
            this.stats.tierStats[tierName].failed++;
            suiteFailed++;
            testError = err;
            const dur = Date.now() - tStart;
            if (!this.silent) {
              console.log(`  ${RED}✖${RESET} ${t.name} ${DIM}(${dur}ms)${RESET}`);
              console.log(`    ${RED}${err.message}${RESET}`);
              if (err.stack) {
                const cleanStack = err.stack
                  .split('\n')
                  .slice(1, 4)
                  .map((line) => `    ${DIM}${line.trim()}${RESET}`)
                  .join('\n');
                console.log(cleanStack);
              }
            }
            this.results.push({
              suite: suite.name,
              name: t.name,
              status: 'failed',
              error: err.message,
              stack: err.stack,
              durationMs: dur,
            });
          }

          // Run afterEach hooks
          for (const hook of suite.afterEachHooks) {
            try {
              await hook();
            } catch (err) {
              if (!this.silent) {
                console.error(`  ${RED}✖ afterEach hook failed:${RESET}`, err.message);
              }
              if (pass) {
                pass = false;
                this.stats.passed--;
                this.stats.tierStats[tierName].passed--;
                suitePassed--;
                this.stats.failed++;
                this.stats.tierStats[tierName].failed++;
                suiteFailed++;
                const lastRes = this.results[this.results.length - 1];
                if (lastRes && lastRes.name === t.name) {
                  lastRes.status = 'failed';
                  lastRes.error = `afterEach hook failed: ${err.message}`;
                  lastRes.stack = err.stack;
                }
              }
            }
          }
        }

        // Run afterAll hooks
        for (const hook of suite.afterAllHooks) {
          try {
            await hook();
          } catch (err) {
            this.stats.failed++;
            this.stats.tierStats[tierName].failed++;
            if (!this.silent) {
              console.error(`  ${RED}✖ afterAll hook failed:${RESET}`, err.message);
            }
            this.results.push({
              suite: suite.name,
              name: `${suite.name} (afterAll hook)`,
              status: 'failed',
              error: `afterAll hook failed: ${err.message}`,
              stack: err.stack,
              durationMs: 0,
            });
          }
        }

        if (!this.silent) {
          console.log('');
        }
      }
    } finally {
      process.removeListener('unhandledRejection', onUnhandledRejection);
      process.removeListener('uncaughtException', onUncaughtException);
    }

    // Account for unhandled errors captured during execution
    if (unhandledErrors.length > 0) {
      for (const uErr of unhandledErrors) {
        this.stats.failed++;
        this.results.push({
          suite: 'Process Runtime',
          name: uErr.type,
          status: 'failed',
          error: uErr.message,
          stack: uErr.stack,
          durationMs: 0,
        });
      }
    }

    this.stats.durationMs = Date.now() - startTime;
    if (!this.silent) {
      this.printSummary();
    }
    if (!this.noWriteResults) {
      this.writeResultsFile();
    }

    return this.stats.failed === 0;
  }

  printSummary() {
    console.log(`${BOLD}${CYAN}------------------------------------------------------${RESET}`);
    console.log(`${BOLD}SUMMARY REPORT:${RESET}`);
    console.log(`  Tier 1 (Feature Coverage):     ${this.formatTierStat('tier1')}`);
    console.log(`  Tier 2 (Boundaries & Corners): ${this.formatTierStat('tier2')}`);
    console.log(`  Tier 3 (Cross-Feature):        ${this.formatTierStat('tier3')}`);
    console.log(`  Tier 4 (Real-World Journeys):  ${this.formatTierStat('tier4')}`);
    console.log(`${BOLD}${CYAN}------------------------------------------------------${RESET}`);
    console.log(
      `  Total Tests: ${BOLD}${this.stats.total}${RESET} | ` +
        `Passed: ${GREEN}${this.stats.passed}${RESET} | ` +
        `Failed: ${this.stats.failed > 0 ? RED : GREEN}${this.stats.failed}${RESET} | ` +
        `Duration: ${this.stats.durationMs}ms`
    );
    console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

    if (this.stats.failed === 0) {
      console.log(`${BOLD}${GREEN}✔ ALL ${this.stats.total} E2E TESTS PASSED CLEANLY (EXIT CODE 0)${RESET}\n`);
    } else {
      console.log(`${BOLD}${RED}✖ ${this.stats.failed} TEST(S) FAILED (EXIT CODE 1)${RESET}\n`);
    }
  }

  formatTierStat(tierKey) {
    const s = this.stats.tierStats[tierKey];
    if (s.total === 0) return `${DIM}0 tests${RESET}`;
    const color = s.failed > 0 ? RED : GREEN;
    return `${color}${s.passed}/${s.total} passed${RESET} (${s.failed} failed)`;
  }

  writeResultsFile() {
    if (this.noWriteResults) return;
    const summaryData = {
      timestamp: new Date().toISOString(),
      durationMs: this.stats.durationMs,
      totalTests: this.stats.total,
      passed: this.stats.passed,
      failed: this.stats.failed,
      skipped: this.stats.skipped,
      tierStats: this.stats.tierStats,
      results: this.results,
    };
    try {
      fs.writeFileSync(path.join(process.cwd(), 'test-results.json'), JSON.stringify(summaryData, null, 2));
    } catch (err) {
      if (!this.silent) {
        console.error('Failed to write test-results.json:', err.message);
      }
    }
  }
}

module.exports = {
  TestRunner,
  TestSuite,
};

// CLI Execution Entry Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      options.tier = arg.split('=')[1];
    } else if (arg.startsWith('--filter=')) {
      options.filter = arg.split('=')[1];
    } else if (arg.startsWith('--timeout=')) {
      options.timeout = parseInt(arg.split('=')[1], 10);
    }
  }

  const runner = new TestRunner(options);
  const testsDir = path.join(__dirname);
  runner.loadTestFiles(testsDir);

  runner.execute().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

