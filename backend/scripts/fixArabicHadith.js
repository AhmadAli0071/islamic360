import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedFile = join(__dirname, 'seedHadith.js');
let content = readFileSync(seedFile, 'utf8');

const SOURCE_MAP = {
  'Sahih Bukhari': 'ara-bukhari',
  'Sahih Muslim': 'ara-muslim',
  'Sunan Abi Dawud': 'ara-abudawud',
  'Sunan an-Nasai': 'ara-nasai',
  'Jami At-Tirmidhi': 'ara-tirmidhi',
  'Sunan Ibn Majah': 'ara-ibnmajah',
  'Musnad Ahmad': 'ara-ahmad',
  'Sahih': 'ara-bukhari',
};

const API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

async function fetchArabic(source, ref) {
  const edition = SOURCE_MAP[source];
  if (!edition) return null;
  try {
    const url = `${API_BASE}/${edition}/${ref}.min.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.hadiths?.[0]?.text || null;
  } catch {
    return null;
  }
}

async function main() {
  const hadithRegex = /dayOfYear:\s*(\d+)[\s\S]*?arabic:\s*'([^']*)'[\s\S]*?source:\s*'([^']*)'[\s\S]*?reference:\s*'([^']*)'/g;
  let match;
  let fixed = 0;
  let failed = 0;
  let matches = [];

  while ((match = hadithRegex.exec(content)) !== null) {
    matches.push({
      full: match[0],
      day: parseInt(match[1]),
      arabic: match[2],
      source: match[3],
      ref: match[4],
      startIdx: match.index,
      endIdx: match.index + match[0].length,
    });
  }

  console.log(`Found ${matches.length} hadiths to check`);

  for (const h of matches) {
    if (h.arabic.includes('\uFFFD') || h.arabic.includes('?')) {
      process.stdout.write(`Fixing hadith ${h.day} (${h.source} ${h.ref})... `);
      const arabic = await fetchArabic(h.source, h.ref);
      if (arabic) {
        const oldStr = `dayOfYear: ${h.day},\n    arabic: '${h.arabic}'`;
        const newStr = `dayOfYear: ${h.day},\n    arabic: '${arabic}'`;
        content = content.replace(oldStr, newStr);
        fixed++;
        console.log('✓ fixed');
      } else {
        console.log(`✗ failed (source=${h.source}, ref=${h.ref})`);
        failed++;
      }
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
    }
  }

  writeFileSync(seedFile, content, 'utf8');
  console.log(`\nDone! Fixed: ${fixed}, Failed: ${failed}`);
}

main().catch(console.error);
