const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Mock browser globals if any are needed or keep pure
console.log('Testing React SSR render of layout and page...');

try {
  // Try importing compiled Next.js page or tsx files via ts-node / typescript transpile
  const ts = require('typescript');
  const fs = require('fs');
  const path = require('path');

  // Let's test if GymCanvas or any canvas component throws when imported or rendered
  console.log('Testing GymCanvas import and render...');
  
  // Test require Three.js
  const THREE = require('three');
  console.log('Three.js version:', THREE.REVISION);

  // Test require @react-three/fiber
  const r3f = require('@react-three/fiber');
  console.log('R3F Canvas:', typeof r3f.Canvas);

  // Test require @react-three/drei
  const drei = require('@react-three/drei');
  console.log('Drei keys count:', Object.keys(drei).length);

} catch (err) {
  console.error('SSR TEST ERROR:', err);
}
