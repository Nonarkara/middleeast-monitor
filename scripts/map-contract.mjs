import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Source/parse contract only. The suite's rendered gate and independent
// browser trial still own actual tiles, layout, controls and readability.
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (/\bsrc\s*=|application\/.*json|importmap/.test(m[1])) continue;
  new vm.Script(m[2]);
}
const config = html.match(/const TILE_URLS = (\{[\s\S]*?\n\});/)[1];
const urls = Object.values(vm.runInNewContext('('+config+')'));
const tileProblems = values => values.filter(url => !url.startsWith('https://') || url.includes('cartocdn.com'));
assert.ok(urls.length >= 2);
assert.deepEqual(tileProblems(urls), []);
assert.ok(tileProblems([...urls,'https://a.basemaps.cartocdn.com/dark_all/3/1/1.png']).length, 'key-required provider mutant must fail');
console.log('PASS: JavaScript parses; configured legacy tiles avoid the rejected provider; mutant caught.');

