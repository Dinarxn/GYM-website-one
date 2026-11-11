const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) res.push(...getFiles(full));
    else if (item.name.endsWith('.test.js')) res.push(full);
  }
  return res;
}

const files = getFiles('tests');
console.log('Total test files found:', files.length);

let suspiciousCount = 0;

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    // Exclude f20 which specifically tests assertion contracts
    if (f.includes('f20_test_suite_verification')) return;

    if (/assert\.(equal|notEqual|deepEqual)\(\s*([0-9]+|'[^']*'|"[^"]*")\s*,\s*\2\s*[,)]/.test(trimmed)) {
      console.log('Suspicious literal equal:', f, (idx + 1) + ':', trimmed);
      suspiciousCount++;
    }
    if (/assert\.truthy\(\s*true\s*[,)]/.test(trimmed)) {
      console.log('Suspicious truthy(true):', f, (idx + 1) + ':', trimmed);
      suspiciousCount++;
    }
    if (/assert\.falsy\(\s*false\s*[,)]/.test(trimmed)) {
      console.log('Suspicious falsy(false):', f, (idx + 1) + ':', trimmed);
      suspiciousCount++;
    }
  });
}
console.log('Total suspicious assertions found:', suspiciousCount);
