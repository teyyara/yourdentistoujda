const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:4173';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const consoleErrors = [];
  const pageErrors = [];

  const viewports = [
    { name: 'mobile', width: 390, height: 844, isMobile: true },
    { name: 'tablet', width: 768, height: 900, isMobile: false },
    { name: 'desktop', width: 1440, height: 1000, isMobile: false }
  ];

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        deviceScaleFactor: 1,
        locale: 'fr-FR',
        timezoneId: 'Africa/Casablanca'
      });
      const page = await context.newPage();

      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push({ viewport: viewport.name, text: msg.text() });
      });
      page.on('pageerror', error => {
        pageErrors.push({ viewport: viewport.name, text: String(error) });
      });

      await page.addInitScript(() => {
        window.__openedUrls = [];
        window.open = (url) => {
          window.__openedUrls.push(String(url));
          return null;
        };
      });

      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(150);

      const title = await page.title();
      if (!title.toLowerCase().includes('your dentist')) throw new Error('Unexpected document title');

      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - window.innerWidth
      );
      if (overflow > 1) throw new Error(`Horizontal overflow: ${overflow}px at ${viewport.name}`);

      const anchorResults = await page.evaluate(() => {
        const out = [];
        for (const anchor of document.querySelectorAll('a[href^="#"]')) {
          const href = anchor.getAttribute('href');
          if (!href || href === '#') continue;
          out.push({ href, exists: Boolean(document.querySelector(href)) });
        }
        return out;
      });
      const brokenAnchors = anchorResults.filter(item => !item.exists);
      if (brokenAnchors.length) {
        throw new Error('Broken internal anchors: ' + JSON.stringify(brokenAnchors));
      }

      await page.getByRole('navigation', { name: 'Navigation principale' }).waitFor();
      await page.getByRole('heading', { level: 1 }).waitFor();

      if (viewport.isMobile) {
        const toggle = page.getByRole('button', { name: /Ouvrir le menu/i });
        await toggle.click();
        const nav = page.locator('#primary-nav');
        if (!(await nav.evaluate(el => el.classList.contains('open')))) {
          throw new Error('Mobile navigation did not open');
        }
        await toggle.press('Escape');
        if (await nav.evaluate(el => el.classList.contains('open'))) {
          throw new Error('Escape did not close mobile navigation');
        }
      }

      const faq = page.locator('#faq details').first();
      if (!(await faq.locator('summary').isVisible())) throw new Error('FAQ summary is not visible');
      await faq.locator('summary').click();
      if (!(await faq.evaluate(el => el.open))) throw new Error('FAQ did not open');

      results.push({
        viewport: viewport.name,
        dimensions: [viewport.width, viewport.height],
        overflowPx: overflow,
        faqInteractive: true,
        navigationInteractive: viewport.isMobile
      });

      await page.screenshot({ path: `test-results/${viewport.name}.png`, fullPage: true });
      await context.close();
    }

    // Full booking request journey on a fresh mobile-sized page.
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      deviceScaleFactor: 1,
      locale: 'fr-FR',
      timezoneId: 'Africa/Casablanca'
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
      window.__openedUrls = [];
      window.open = (url) => {
        window.__openedUrls.push(String(url));
        return null;
      };
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const todayMin = await page.locator('#booking-date').getAttribute('min');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(todayMin || '')) {
      throw new Error('Booking date min is missing or malformed');
    }

    await page.locator('select[name="service"]').selectOption({ label: 'Implantologie' });
    await page.locator('select[name="doctor"]').selectOption({ label: 'Dr Mohammed Taha Zarrouki' });
    await page.locator('input[name="date"]').fill('2099-06-15');
    await page.locator('select[name="time"]').selectOption({ label: '10:00' });
    await page.locator('input[name="name"]').fill('Test Patient');
    await page.locator('input[name="phone"]').fill('+212600000000');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"]').fill('Automated booking-flow validation.');
    await page.locator('input[name="consent"]').check();

    await page.locator('#booking-form').evaluate(form => form.requestSubmit());
    await page.waitForTimeout(100);

    const opened = await page.evaluate(() => window.__openedUrls || []);
    if (opened.length !== 1) throw new Error(`Expected one WhatsApp handoff, got ${opened.length}`);
    const target = new URL(opened[0]);
    if (target.hostname !== 'wa.me') throw new Error('Booking handoff does not target wa.me');
    const text = target.searchParams.get('text') || '';
    for (const required of ['Implantologie', 'Dr Mohammed Taha Zarrouki', '2099-06-15', '10:00', 'Test Patient', '+212600000000']) {
      if (!text.includes(required)) throw new Error('Booking payload missing: ' + required);
    }

    // Keyboard/focus smoke: skip-link and first navigable control must be focusable.
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      href: document.activeElement?.getAttribute('href'),
      visible: Boolean(document.activeElement && document.activeElement.getBoundingClientRect().width)
    }));
    if (focused.tag !== 'A' || focused.href !== 'http://127.0.0.1:4173/#main' || !focused.visible) {
      throw new Error('Skip-link keyboard focus smoke failed: ' + JSON.stringify(focused));
    }

    await context.close();
    results.push({ bookingJourney: 'PASS', whatsappPayload: 'PASS', keyboardSkipLink: 'PASS' });

    if (consoleErrors.length || pageErrors.length) {
      throw new Error(JSON.stringify({ consoleErrors, pageErrors }));
    }

    require('fs').mkdirSync('test-results', { recursive: true });
    require('fs').writeFileSync(
      'test-results/runtime-report.json',
      JSON.stringify({ baseUrl: BASE_URL, results, consoleErrors, pageErrors }, null, 2)
    );

    console.log(JSON.stringify({ status: 'PASS', results }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});