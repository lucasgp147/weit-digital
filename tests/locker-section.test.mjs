import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

test('renders dedicated locker pickup optimizer section between why and final CTA', () => {
  assert.match(page, /lockerTitle:/);
  assert.match(page, /Locker Pickup Optimizer/);
  assert.match(page, /t\.lockerTitle/);
  assert.match(page, /t\.lockerBenefits\.map/);

  const whyIndex = page.indexOf('{t.whyTitle}');
  const lockerIndex = page.indexOf('{t.lockerTitle}');
  const finalIndex = page.indexOf('{t.finalCta}');

  assert.ok(whyIndex >= 0, 'why section should exist');
  assert.ok(lockerIndex > whyIndex, 'locker section should come after why section');
  assert.ok(finalIndex > lockerIndex, 'final CTA should come after locker section');
});

test('includes italian logistics-specific benefit copy', () => {
  assert.match(page, /Più ritiri completati, meno attrito nell'ultimo miglio\./);
  assert.match(page, /Riduci i ritiri falliti/);
  assert.match(page, /Per e-commerce e logistica/);
});
