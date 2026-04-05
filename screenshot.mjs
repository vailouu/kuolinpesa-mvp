import { createRequire } from 'module';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/vilot/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const dir = './temporary screenshots';
if (!existsSync(dir)) mkdirSync(dir);

const existing = readdirSync(dir).filter(f => f.endsWith('.png'));
const n = existing.length + 1;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const filepath = join(dir, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);
