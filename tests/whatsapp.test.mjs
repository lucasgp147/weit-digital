import test from 'node:test';
import assert from 'node:assert/strict';

const { buildServicesWhatsAppUrl, buildPackageWhatsAppUrl } = await import('../lib/whatsapp.mjs');

test('buildServicesWhatsAppUrl includes selected services in prefilled message', () => {
  const url = buildServicesWhatsAppUrl({
    phone: '393936232182',
    lang: 'it',
    services: [
      { label: 'Google Ads', price: '€350/mese' },
      { label: 'Landing Page', price: '€450' },
    ],
  });

  assert.match(url, /^https:\/\/wa\.me\/393936232182\?text=/);
  const message = decodeURIComponent(url.split('?text=')[1]);
  assert.match(message, /Ciao Weit Digital!/);
  assert.match(message, /Servizi selezionati:/);
  assert.match(message, /- Google Ads \(€350\/mese\)/);
  assert.match(message, /- Landing Page \(€450\)/);
});

test('buildPackageWhatsAppUrl includes package choice in prefilled message', () => {
  const url = buildPackageWhatsAppUrl({
    phone: '393936232182',
    lang: 'it',
    packageName: 'Growth',
    packagePrice: '€499/mese',
  });

  const message = decodeURIComponent(url.split('?text=')[1]);
  assert.match(message, /Pacchetto scelto: Growth \(€499\/mese\)/);
  assert.match(message, /Vorrei ricevere maggiori dettagli/);
});
