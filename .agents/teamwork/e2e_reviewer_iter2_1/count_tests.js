const fs = require('fs');
const path = require('path');

function analyzeTier(tierName) {
  const dir = path.join('tests', tierName);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.js')).sort();
  const report = [];
  let totalTests = 0;

  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    // Match test('...', or test("...", but not preceded by a dot like regex.test(...)
    const testNames = [];
    const regex = /(?:^|[^.\w])test\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      testNames.push(match[1]);
    }
    report.push({ file: f, count: testNames.length, testNames });
    totalTests += testNames.length;
  }
  return { tierName, fileCount: files.length, totalTests, report };
}

const t1 = analyzeTier('tier1');
const t2 = analyzeTier('tier2');
const t3 = analyzeTier('tier3');
const t4 = analyzeTier('tier4');

console.log('=== TIER BREAKDOWN (Exact Test Calls) ===');
console.log('Tier 1:', t1.fileCount, 'files,', t1.totalTests, 'tests');
t1.report.forEach(r => console.log('  ', r.file.padEnd(35), r.count, 'tests'));

console.log('\nTier 2:', t2.fileCount, 'files,', t2.totalTests, 'tests');
t2.report.forEach(r => console.log('  ', r.file.padEnd(40), r.count, 'tests'));

console.log('\nTier 3:', t3.fileCount, 'files,', t3.totalTests, 'tests');
t3.report.forEach(r => console.log('  ', r.file.padEnd(45), r.count, 'tests'));

console.log('\nTier 4:', t4.fileCount, 'files,', t4.totalTests, 'tests');
t4.report.forEach(r => console.log('  ', r.file.padEnd(40), r.count, 'tests'));

console.log('\nGRAND TOTAL:', t1.totalTests + t2.totalTests + t3.totalTests + t4.totalTests);
