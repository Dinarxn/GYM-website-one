const fs = require('fs');

const runtimePath = '.next/server/webpack-runtime.js';
if (fs.existsSync(runtimePath)) {
  let content = fs.readFileSync(runtimePath, 'utf8');
  content = content.replace(
    'try{a[d](f,f.exports,c)',
    'if(typeof a[d] !== "function"){ console.error("MISSING MODULE ID IN WEBPACK RUNTIME:", d); } try{a[d](f,f.exports,c)'
  );
  fs.writeFileSync(runtimePath, content);
  console.log('Successfully instrumented webpack-runtime.js');
} else {
  console.log('webpack-runtime.js not found');
}
