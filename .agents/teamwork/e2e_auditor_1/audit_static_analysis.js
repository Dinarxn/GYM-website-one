const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');
const testsDir = path.join(projectRoot, 'tests');

const findings = {
  dummyAssertions: [],
  emptyTestBodies: [],
  testsWithoutAssertions: [],
  networkCalls: [],
  sourceInspections: [],
  fileStats: []
};

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

const allTestFiles = scanDir(testsDir);

// Patterns to look for
const dummyAssertionPatterns = [
  /assert\s*\(\s*true\s*\)/g,
  /assert\s*\(\s*1\s*\)/g,
  /equal\s*\(\s*true\s*,\s*true\s*\)/g,
  /equal\s*\(\s*1\s*,\s*1\s*\)/g,
  /equal\s*\(\s*['"]a['"]\s*,\s*['"]a['"]\s*\)/g,
  /deepEqual\s*\(\s*\{\}\s*,\s*\{\}\s*\)/g,
  /deepEqual\s*\(\s*\[\]\s*,\s*\[\]\s*\)/g,
  /1\s*===\s*1/g,
  /true\s*===\s*true/g,
];

const networkPatterns = [
  /\bfetch\s*\(/g,
  /require\s*\(\s*['"](http|https|net|dgram|tls|axios|node-fetch)['"]\s*\)/g,
  /from\s*['"](http|https|net|dgram|tls|axios|node-fetch)['"]/g,
];

for (const filePath of allTestFiles) {
  const relPath = path.relative(projectRoot, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Check for dummy assertions
  dummyAssertionPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // Find line number
      const lineNo = content.substring(0, match.index).split('\n').length;
      findings.dummyAssertions.push({
        file: relPath,
        line: lineNo,
        match: match[0],
        lineContent: lines[lineNo - 1].trim()
      });
    }
  });

  // Check for network calls
  networkPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNo = content.substring(0, match.index).split('\n').length;
      findings.networkCalls.push({
        file: relPath,
        line: lineNo,
        match: match[0],
        lineContent: lines[lineNo - 1].trim()
      });
    }
  });

  // Parse tests inside test files
  if (filePath.endsWith('.test.js')) {
    // Regex to match test('...', () => { ... }) or it('...', async () => { ... })
    // We can also count test declarations
    const testDeclRegex = /(?:test|it)\s*\(\s*(['"`].*?['"`])\s*,\s*(async\s*)?\s*\([^)]*\)\s*=>\s*\{/g;
    let testMatch;
    let testCount = 0;
    while ((testMatch = testDeclRegex.exec(content)) !== null) {
      testCount++;
      const testName = testMatch[1];
      const startIndex = testMatch.index + testMatch[0].length;
      // find matching brace
      let depth = 1;
      let currentIndex = startIndex;
      while (depth > 0 && currentIndex < content.length) {
        if (content[currentIndex] === '{') depth++;
        else if (content[currentIndex] === '}') depth--;
        currentIndex++;
      }
      const testBody = content.substring(startIndex, currentIndex - 1).trim();
      const lineNo = content.substring(0, testMatch.index).split('\n').length;

      // Check if body is empty or whitespace only
      if (!testBody || testBody.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim() === '') {
        findings.emptyTestBodies.push({
          file: relPath,
          line: lineNo,
          testName
        });
      }

      // Check if body has zero assertions
      const hasAssertion = /(assert|equal|notEqual|deepEqual|match|notMatch|includes|throws|rejects|closeTo|truthy|falsy)/.test(testBody);
      if (!hasAssertion) {
        findings.testsWithoutAssertions.push({
          file: relPath,
          line: lineNo,
          testName,
          bodySnippet: testBody.substring(0, 100)
        });
      }
    }

    // Check if test inspects src files
    const srcImportsOrReads = [];
    const srcMatchRegex = /(?:require|import|readFileSync)\s*\(.*?(?:src|public|package\.json|next\.config).*?\)/g;
    let sm;
    while ((sm = srcMatchRegex.exec(content)) !== null) {
      srcImportsOrReads.push(sm[0]);
    }

    findings.fileStats.push({
      file: relPath,
      testCount,
      srcRefs: srcImportsOrReads.length
    });
  }
}

console.log(JSON.stringify(findings, null, 2));
