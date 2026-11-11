const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 1 - Feature 08: Gallery Experience', () => {
  test('T1-F08-01: Curated 8-Photo Masonry Grid Rendering', () => {
    const galleryPath = path.join(process.cwd(), 'src/config/gallery.ts');
    const content = fs.readFileSync(galleryPath, 'utf8');

    // Count gallery items in config
    const ids = content.match(/id:\s*'gallery-\d+'/g) || [];
    assert.assert(ids.length >= 8, `Expected at least 8 gallery items, found ${ids.length}`);
  });

  test('T1-F08-02: Category Filter Tabs', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/GallerySection.tsx'), 'utf8');

    assert.includes(secSrc, 'All Views');
    assert.includes(secSrc, 'Lifting Platforms');
    assert.includes(secSrc, 'Cardio & Turf');
    assert.includes(secSrc, 'Recovery Suite');
    assert.includes(secSrc, 'Atmosphere');
  });

  test('T1-F08-03: WebP Lazy Loading & Skeleton Placeholders', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/GallerySection.tsx'), 'utf8');

    assert.includes(secSrc, 'sizes=');
    assert.includes(secSrc, 'fill');
  });

  test('T1-F08-04: Click-to-Enlarge Lightbox Modal Open', () => {
    const secSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/sections/GallerySection.tsx'), 'utf8');

    assert.includes(secSrc, 'setActiveLightboxItem(item)');
    assert.includes(secSrc, 'LightboxModal');
  });

  test('T1-F08-05: Lightbox Next and Previous Navigation', () => {
    const modalSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/LightboxModal.tsx'), 'utf8');

    assert.includes(modalSrc, 'handlePrev');
    assert.includes(modalSrc, 'handleNext');
    assert.includes(modalSrc, 'ArrowLeft');
    assert.includes(modalSrc, 'ArrowRight');
  });
});
