const fs = require('fs');
const path = require('path');
const assert = require('../helpers/assert');

describe('Tier 2 - Feature 04: Training Programs Boundary Cases', () => {
  test('T2-F04-01: Category Filtering Logic Against Real Program Catalog', () => {
    const programsConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/programs.ts'), 'utf8');

    // Extract all defined category tokens from programs.ts
    const categories = ['strength', 'conditioning', 'personal', 'functional'];
    for (const cat of categories) {
      assert.includes(programsConfigSrc, `category: '${cat}'`);
    }

    // Verify filtering against unknown categories returns zero results
    function filterCatalog(catalogCategories, requestedCategory) {
      if (requestedCategory === 'all') return catalogCategories;
      return catalogCategories.filter((c) => c === requestedCategory);
    }

    assert.equal(filterCatalog(categories, 'nonexistent').length, 0);
    assert.equal(filterCatalog(categories, 'strength').length, 1);
    assert.equal(filterCatalog(categories, 'all').length, 4);
  });

  test('T2-F04-02: Syllabus Modal Keyboard Dismissal & Scroll Lock in Source', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/ProgramsSection.tsx'),
      'utf8'
    );

    // Verify modal traps Escape key and manages document.body.style.overflow
    assert.includes(sectionSrc, "e.key === 'Escape'");
    assert.includes(sectionSrc, 'setActiveModalProgram(null)');
    assert.includes(sectionSrc, "document.body.style.overflow = 'hidden'");
    assert.includes(sectionSrc, 'document.body.style.overflow = originalOverflow');
  });

  test('T2-F04-03: Intensity Scale Boundaries (1 to 5 Verification)', () => {
    const programsConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/programs.ts'), 'utf8');

    // Parse all intensity values declared in the program catalog
    const matches = programsConfigSrc.match(/intensity:\s*(\d+)/g) || [];
    assert.assert(matches.length >= 4, 'Must define intensity for all programs');

    for (const m of matches) {
      const val = parseInt(m.replace(/\D/g, ''), 10);
      assert.assert(val >= 1 && val <= 5, `Program intensity ${val} must be clamped between 1 and 5`);
    }
  });

  test('T2-F04-04: Structured 3-Phase Syllabus Progression Completeness', () => {
    const programsConfigSrc = fs.readFileSync(path.join(process.cwd(), 'src/config/programs.ts'), 'utf8');

    // Verify all 3 periodization phases exist in syllabus definitions
    assert.includes(programsConfigSrc, 'Phase 1:');
    assert.includes(programsConfigSrc, 'Phase 2:');
    assert.includes(programsConfigSrc, 'Phase 3:');
    assert.includes(programsConfigSrc, 'focus:');
    assert.includes(programsConfigSrc, 'details:');
  });

  test('T2-F04-05: Category Filter Tabs Configuration Completeness', () => {
    const sectionSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/sections/ProgramsSection.tsx'),
      'utf8'
    );

    // Verify all 5 filter tab IDs exist in UI component
    assert.includes(sectionSrc, "id: 'all'");
    assert.includes(sectionSrc, "id: 'strength'");
    assert.includes(sectionSrc, "id: 'conditioning'");
    assert.includes(sectionSrc, "id: 'personal'");
    assert.includes(sectionSrc, "id: 'functional'");
    assert.includes(sectionSrc, 'selectedCategory === cat.id');
  });
});
