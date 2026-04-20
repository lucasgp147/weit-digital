const copy = {
  it: {
    greeting: 'Ciao Weit Digital!',
    servicesTitle: 'Servizi selezionati:',
    servicesIntro: 'Vorrei ricevere maggiori dettagli su questi servizi:',
    packageTitle: 'Pacchetto scelto:',
    packageIntro: 'Vorrei ricevere maggiori dettagli e capire il prossimo passo.',
    fallback: 'Vorrei ricevere maggiori informazioni sui vostri servizi digitali.',
  },
  en: {
    greeting: 'Hi Weit Digital!',
    servicesTitle: 'Selected services:',
    servicesIntro: 'I would like more details about these services:',
    packageTitle: 'Selected package:',
    packageIntro: 'I would like more details and to understand the next step.',
    fallback: 'I would like more information about your digital services.',
  },
  pt: {
    greeting: 'Olá Weit Digital!',
    servicesTitle: 'Serviços selecionados:',
    servicesIntro: 'Gostaria de receber mais detalhes sobre estes serviços:',
    packageTitle: 'Pacote escolhido:',
    packageIntro: 'Gostaria de receber mais detalhes e entender o próximo passo.',
    fallback: 'Gostaria de receber mais informações sobre os seus serviços digitais.',
  },
  de: {
    greeting: 'Hallo Weit Digital!',
    servicesTitle: 'Ausgewählte Leistungen:',
    servicesIntro: 'Ich möchte mehr Details zu diesen Leistungen erhalten:',
    packageTitle: 'Gewähltes Paket:',
    packageIntro: 'Ich möchte mehr Details erhalten und den nächsten Schritt verstehen.',
    fallback: 'Ich möchte mehr Informationen über Ihre digitalen Dienstleistungen erhalten.',
  },
};

function buildWhatsAppUrl(phone, lines) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`;
}

export function buildServicesWhatsAppUrl({ phone, lang, services }) {
  const t = copy[lang] ?? copy.it;

  if (!services || services.length === 0) {
    return buildWhatsAppUrl(phone, [t.greeting, '', t.fallback]);
  }

  return buildWhatsAppUrl(phone, [
    t.greeting,
    '',
    t.servicesIntro,
    '',
    t.servicesTitle,
    ...services.map((service) => `- ${service.label} (${service.price})`),
  ]);
}

export function buildPackageWhatsAppUrl({ phone, lang, packageName, packagePrice }) {
  const t = copy[lang] ?? copy.it;

  return buildWhatsAppUrl(phone, [
    t.greeting,
    '',
    `${t.packageTitle} ${packageName} (${packagePrice})`,
    '',
    t.packageIntro,
  ]);
}
