const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 08: Gallery Experience Boundary Cases', () => {
  test('T2-F08-01: Lightbox Modal Keyboard Navigation & Escape Key in Source (Boundary)', () => {
    const modalSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/ui/LightboxModal.tsx'),
      'utf8'
    );

    // Verify keyboard handlers in LightboxModal component
    assert.includes(modalSrc, "e.key === 'Escape'");
    assert.includes(modalSrc, "e.key === 'ArrowLeft'");
    assert.includes(modalSrc, "e.key === 'ArrowRight'");
    assert.includes(modalSrc, 'handlePrev()');
    assert.includes(modalSrc, 'handleNext()');
  });

  test('T2-F08-02: 8-Photo Curated Gallery Catalog Completeness (Corner)', () => {
    const galleryConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/gallery.ts'), 'utf8');

    // Count declared gallery items
    const idMatches = galleryConfigSrc.match(/id:\s*'gallery-\d+'/g) || [];
    assert.equal(idMatches.length, 8, 'Gallery must declare exactly 8 photo items');

    // Verify all items define descriptive accessibility alt text
    const altMatches = galleryConfigSrc.match(/alt:\s*'/g) || [];
    assert.equal(altMatches.length, 8, 'Every gallery photo must declare an alt description');
  });

  test('T2-F08-03: Lightbox Modal Component Mounting & Item Passing (Boundary)', () => {
    const gallerySectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/GallerySection.tsx'),
      'utf8'
    );

    // Verify LightboxModal is integrated into GallerySection with correct props
    assert.includes(gallerySectionSrc, '<LightboxModal');
    assert.includes(gallerySectionSrc, 'isOpen={Boolean(activeLightboxItem)}');
    assert.includes(gallerySectionSrc, 'item={activeLightboxItem}');
    assert.includes(gallerySectionSrc, 'items={filteredItems}');
    assert.includes(gallerySectionSrc, 'onClose={() => setActiveLightboxItem(null)}');
  });

  test('T2-F08-04: Image Zoom Hover Animation & Visual Styling (Edge Case)', () => {
    const gallerySectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/GallerySection.tsx'),
      'utf8'
    );

    // Verify group hover zoom transformation and smooth duration
    assert.includes(gallerySectionSrc, 'group-hover:scale-105');
    assert.includes(gallerySectionSrc, 'transition-transform');
    assert.includes(gallerySectionSrc, 'duration-700');
  });

  test('T2-F08-05: Category Filter Tab Synchronization (Corner)', () => {
    const gallerySectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/GallerySection.tsx'),
      'utf8'
    );

    // Verify all 5 category filter options exist in GallerySection
    assert.includes(gallerySectionSrc, "id: 'all'");
    assert.includes(gallerySectionSrc, "id: 'strength'");
    assert.includes(gallerySectionSrc, "id: 'cardio'");
    assert.includes(gallerySectionSrc, "id: 'recovery'");
    assert.includes(gallerySectionSrc, "id: 'community'");
    assert.includes(gallerySectionSrc, 'selectedCategory === cat.id');
  });
});
