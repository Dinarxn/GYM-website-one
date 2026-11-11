const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const testsDir = path.join(projectRoot, 'tests');

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanDir(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const testFiles = scanDir(testsDir).filter(f => f.endsWith('.test.js'));

const report = {
  tautologicalAssertions: [],
  selfCertifyingLocalObjects: [],
  metadataInspections: [],
  tierStats: {
    tier1: { total: 0, withSrc: 0, withoutSrc: 0 },
    tier2: { total: 0, withSrc: 0, withoutSrc: 0 },
    tier3: { total: 0, withSrc: 0, withoutSrc: 0 },
    tier4: { total: 0, withSrc: 0, withoutSrc: 0 },
  }
};

for (const f of testFiles) {
  const relPath = path.relative(projectRoot, f);
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');

  let tier = 'tier1';
  if (relPath.includes('tier2')) tier = 'tier2';
  else if (relPath.includes('tier3')) tier = 'tier3';
  else if (relPath.includes('tier4')) tier = 'tier4';

  report.tierStats[tier].total++;

  const hasSrcRef = content.includes('src/') || content.includes('src\\') || content.includes('package.json');
  if (hasSrcRef) {
    report.tierStats[tier].withSrc++;
  } else {
    report.tierStats[tier].withoutSrc++;
  }

  // Check for .agents / PROJECT.md
  if (content.includes('.agents') || content.includes('PROJECT.md')) {
    report.metadataInspections.push({
      file: relPath,
      snippet: lines.find(l => l.includes('.agents') || l.includes('PROJECT.md')).trim()
    });
  }

  // Check line by line for tautologies
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (
      trimmed.includes('assert.truthy(true)') ||
      trimmed.includes('assert.falsy(false)') ||
      trimmed.includes('assert.equal(1 + 1, 2)') ||
      trimmed.includes('assert.equal(run1, run2)') ||
      /assert\.equal\(\s*(\w+),\s*\1\s*\)/.test(trimmed)
    ) {
      report.tautologicalAssertions.push({
        file: relPath,
        line: idx + 1,
        content: trimmed
      });
    }
  });
}

console.log(JSON.stringify(report, null, 2));
