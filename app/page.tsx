"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "it" | "en" | "pt" | "de";
type ServiceKey =
  | "branding"
  | "landing"
  | "googleAds"
  | "metaAds"
  | "instaBase"
  | "instaGrowth"
  | "instaPremium";

type Service = {
  label: string;
  price: string;
  numericPrice: number;
  recurring: boolean;
  note: string;
  description: string;
  short: string;
  includes: string[];
};

/* ─────────────────────────────────────────────
   WEIT LOGO — fiel ao anexo
   W geométrico com duas setas de crescimento
   saindo do topo direito
───────────────────────────────────────────── */
function WeitLogo({
  dark = false,
  className = "h-10 w-auto",
}: {
  dark?: boolean;
  className?: string;
}) {
  const id = dark ? "dk" : "lt";
  return (
    <svg
      viewBox="0 0 110 90"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        {/* W gradient — azul escuro p/ azul médio */}
        <linearGradient id={`wg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dark ? "#1e3a7a" : "#0d2b6e"} />
          <stop offset="100%" stopColor={dark ? "#2563eb" : "#1a5ecf"} />
        </linearGradient>
        {/* seta esquerda — azul médio */}
        <linearGradient id={`a1${id}`} x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        {/* seta direita — azul claro */}
        <linearGradient id={`a2${id}`} x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      {/*
        W geométrico — estilo do logo anexado:
        linhas diagonais com espessura uniforme,
        forma angular que se fecha no centro
      */}
      {/* perna esquerda do W */}
      <polygon
        points="4,72 18,72 34,22 20,22"
        fill={`url(#wg${id})`}
      />
      {/* meio-esquerdo (V interno esq) */}
      <polygon
        points="18,72 30,72 42,38 30,38"
        fill={`url(#wg${id})`}
        opacity="0.92"
      />
      {/* meio-direito (V interno dir) */}
      <polygon
        points="30,72 42,72 54,38 42,38"
        fill={`url(#wg${id})`}
        opacity="0.85"
      />

      {/*
        Seta 1 — mais à esquerda, sobe diagonal
        nasce do topo-centro do W
      */}
      <polygon
        points="42,38 50,38 72,4 64,4"
        fill={`url(#a1${id})`}
      />
      {/* ponta da seta 1 */}
      <polygon points="64,4 76,4 68,14 60,14" fill={`url(#a1${id})`} />

      {/*
        Seta 2 — mais à direita, sobe mais alto
        nasce um pouco mais à direita
      */}
      <polygon
        points="52,38 60,38 84,0 76,0"
        fill={`url(#a2${id})`}
      />
      {/* ponta da seta 2 */}
      <polygon points="76,0 90,0 82,12 68,12" fill={`url(#a2${id})`} />
    </svg>
  );
}

const SVC_ICON: Record<ServiceKey, string> = {
  branding: "◈",
  landing: "⬡",
  googleAds: "◎",
  metaAds: "◉",
  instaBase: "▲",
  instaGrowth: "▲▲",
  instaPremium: "▲▲▲",
};

// Conversão de preços por moeda
const CURRENCY = {
  it: { symbol: "€", rate: 1 },
  en: { symbol: "$", rate: 1.08 },   // USD
  pt: { symbol: "R$", rate: 6.2 },  // BRL
  de: { symbol: "€", rate: 1 },
} as const;

function formatPrice(numericEur: number, lang: Lang, suffix?: string): string {
  const { symbol, rate } = CURRENCY[lang];
  const val = Math.round(numericEur * rate);
  const formatted =
    lang === "pt"
      ? `${symbol} ${val.toLocaleString("pt-BR")}`
      : `${symbol}${val.toLocaleString("en-US")}`;
  return suffix ? `${formatted}${suffix}` : formatted;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("it");
  const [selected, setSelected] = useState<ServiceKey[]>(["googleAds"]);
  const [entered, setEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const whatsapp = "https://wa.me/393936232182";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Sufixos mensais por idioma
  const monthlySuffix: Record<Lang, string> = {
    it: "/mese",
    en: "/mo",
    pt: "/mês",
    de: "/Mo.",
  };
  const oneTimeSuffix: Record<Lang, string> = {
    it: " una tantum",
    en: " one-time",
    pt: " único",
    de: " einmalig",
  };

  type PkgRaw = {
    name: string;
    priceEur: number;
    priceRecurring: boolean;
    desc: string;
    note: string;
    features: string[];
    highlight: boolean;
  };

  type WhyItem = { icon: string; title: string; desc: string };

  const content: Record<
    Lang,
    {
      brand: string;
      tagline: string;
      slogan: string;
      splashSub: string;
      splashHint: string;
      heroTitle: string;
      heroDesc: string;
      cta: string;
      selectorTitle: string;
      selectorDesc: string;
      includedTitle: string;
      includedEmpty: string;
      totalTitle: string;
      totalLabel: string;
      totalNote: string;
      packagesTitle: string;
      whyTitle: string;
      finalCta: string;
      footer: string;
      monthlyLabel: string;
      onetimeLabel: string;
      contactPkg: string;
      onlineNote: string;
      services: Record<
        ServiceKey,
        Omit<Service, "price" | "note">
      >;
      packages: PkgRaw[];
      why: WhyItem[];
    }
  > = {
    it: {
      brand: "Weit Digital",
      tagline: "Growth Lab",
      slogan: "Clienti reali.\nCrescita misurabile.",
      splashSub:
        "Strategie digitali per aziende che vogliono risultati concreti.",
      splashHint: "Entra",
      heroTitle: "Il tuo marketing,\nfinalmente chiaro.",
      heroDesc:
        "Google Ads, Meta Ads, Instagram e branding. Lavoriamo con piccole e medie imprese in qualsiasi settore — completamente online, ovunque tu sia.",
      cta: "Scrivici su WhatsApp",
      selectorTitle: "Servizi",
      selectorDesc:
        "Seleziona i servizi che ti interessano per vedere prezzi e dettagli.",
      includedTitle: "Dettaglio servizio",
      includedEmpty:
        "Seleziona un servizio per vedere la descrizione e i contenuti inclusi.",
      totalTitle: "Il tuo piano",
      totalLabel: "Totale selezionato",
      totalNote:
        "I servizi mensili si rinnovano ogni mese. I servizi una tantum si pagano una sola volta.",
      packagesTitle: "Pacchetti",
      whyTitle: "Perché scegliere noi",
      finalCta: "Pronto a crescere?",
      footer: "Servizio 100% online • WhatsApp: +39 393 6232182",
      monthlyLabel: "include servizi mensili",
      onetimeLabel: "solo pagamenti una tantum",
      contactPkg: "Contattaci su WhatsApp",
      onlineNote: "Servizio 100% online — nessun ufficio fisico richiesto.",
      services: {
        branding: {
          label: "Branding & Logo",
          numericPrice: 220,
          recurring: false,
          description:
            "Identità visiva professionale per presentarti meglio online e offline. Logo, palette colori e direzione grafica per qualsiasi tipo di attività.",
          short: "Logo, palette e direzione visiva per il tuo brand.",
          includes: ["Logo base", "Palette colori", "Direzione visiva"],
        },
        landing: {
          label: "Landing Page",
          numericPrice: 450,
          recurring: false,
          description:
            "Pagina ottimizzata per trasformare visite in contatti, preventivi o messaggi diretti. Struttura chiara, design moderno e CTA forte.",
          short: "Pagina per convertire visite in contatti reali.",
          includes: [
            "Struttura orientata ai lead",
            "Design moderno",
            "CTA chiara",
          ],
        },
        googleAds: {
          label: "Google Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Intercetta clienti già in cerca del tuo prodotto o servizio su Google. Setup completo, ottimizzazione continua e report mensile inclusi.",
          short: "Campagne Google per chi cerca già quello che offri.",
          includes: ["Setup campagna", "Ottimizzazione", "Report mensile"],
        },
        metaAds: {
          label: "Meta Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Raggiungi nuovi clienti su Facebook e Instagram con creatività mirate e targeting preciso per qualsiasi settore e tipo di business.",
          short: "Campagne Facebook/Instagram per visibilità e nuovi clienti.",
          includes: [
            "Setup campagna",
            "Targeting preciso",
            "Creatività inclusa",
          ],
        },
        instaBase: {
          label: "Instagram Base",
          numericPrice: 180,
          recurring: true,
          description:
            "Presenza Instagram costante con 8 contenuti mensili curati. Ideale per chi vuole iniziare a comunicare in modo professionale sui social.",
          short: "8 contenuti/mese per tenere il profilo attivo.",
          includes: [
            "8 contenuti/mese",
            "Organizzazione profilo",
            "Supporto base",
          ],
        },
        instaGrowth: {
          label: "Instagram Growth",
          numericPrice: 320,
          recurring: true,
          description:
            "Gestione editoriale più strutturata con 12 contenuti mensili. Per chi vuole costruire una presenza social solida e crescere con continuità.",
          short: "12 contenuti/mese con strategia di crescita.",
          includes: [
            "12 contenuti/mese",
            "Strategia editoriale",
            "Focus crescita",
          ],
        },
        instaPremium: {
          label: "Instagram Premium",
          numericPrice: 550,
          recurring: true,
          description:
            "Gestione completa del profilo Instagram: strategia, contenuti, copywriting e supporto continuativo per una presenza online seria.",
          short: "Gestione avanzata con strategia e supporto continuo.",
          includes: [
            "Gestione completa",
            "Strategia contenuti",
            "Supporto continuo",
          ],
        },
      },
      packages: [
        {
          name: "Start",
          priceEur: 199,
          priceRecurring: false,
          desc: "Per iniziare",
          note: "Ingresso ideale per presentarsi meglio online senza grandi investimenti.",
          features: ["Branding base", "Setup presenza", "Consulenza inclusa"],
          highlight: false,
        },
        {
          name: "Growth",
          priceEur: 499,
          priceRecurring: true,
          desc: "Il più scelto",
          note: "La scelta migliore per generare clienti in modo serio ogni mese.",
          features: [
            "Google Ads o Meta Ads",
            "Supporto mensile",
            "Creatività inclusa",
          ],
          highlight: true,
        },
        {
          name: "Boost",
          priceEur: 899,
          priceRecurring: true,
          desc: "Completo",
          note: "Per chi vuole più canali attivi e risultati più veloci.",
          features: [
            "Google + Meta Ads",
            "Gestione Instagram",
            "Landing page",
          ],
          highlight: false,
        },
      ],
      why: [
        {
          icon: "↗",
          title: "Risultati concreti",
          desc: "L'obiettivo non è fare cose belle, è generare contatti, richieste e clienti reali per il tuo business.",
        },
        {
          icon: "◉",
          title: "Qualsiasi settore",
          desc: "Lavoriamo con ristoranti, negozi, professionisti, hotel e qualsiasi tipo di azienda locale o online.",
        },
        {
          icon: "⟳",
          title: "100% online",
          desc: "Gestiamo tutto da remoto. Nessun appuntamento fisico necessario — comunicazione diretta via WhatsApp e video call.",
        },
        {
          icon: "▲",
          title: "Struttura scalabile",
          desc: "Inizia con poco e cresci nel tempo. Ogni servizio si adatta al tuo ritmo e al tuo budget.",
        },
      ],
    },

    en: {
      brand: "Weit Digital",
      tagline: "Growth Lab",
      slogan: "Real clients.\nMeasurable growth.",
      splashSub:
        "Digital strategies for businesses that want concrete results.",
      splashHint: "Enter",
      heroTitle: "Your marketing,\nfinally clear.",
      heroDesc:
        "Google Ads, Meta Ads, Instagram and branding. We work with small and medium businesses in any sector — fully remote, wherever you are.",
      cta: "Message us on WhatsApp",
      selectorTitle: "Services",
      selectorDesc:
        "Select the services you're interested in to see pricing and details.",
      includedTitle: "Service details",
      includedEmpty:
        "Select a service to view description and included items.",
      totalTitle: "Your plan",
      totalLabel: "Selected total",
      totalNote:
        "Monthly services renew each month. One-time services are paid once.",
      packagesTitle: "Packages",
      whyTitle: "Why choose us",
      finalCta: "Ready to grow?",
      footer: "100% online service • WhatsApp: +39 393 6232182",
      monthlyLabel: "includes monthly services",
      onetimeLabel: "one-time services only",
      contactPkg: "Contact us on WhatsApp",
      onlineNote: "100% online — no physical office needed.",
      services: {
        branding: {
          label: "Branding & Logo",
          numericPrice: 220,
          recurring: false,
          description:
            "Professional visual identity to present yourself better online and offline. Logo, color palette and essential graphic direction for any type of business.",
          short: "Logo, palette and visual direction for your brand.",
          includes: ["Basic logo", "Color palette", "Visual direction"],
        },
        landing: {
          label: "Landing Page",
          numericPrice: 450,
          recurring: false,
          description:
            "Optimized page to turn visits into leads, quotes or direct messages. Clear structure, modern design and a strong call to action.",
          short: "Page to convert visits into real leads.",
          includes: [
            "Lead-focused structure",
            "Modern design",
            "Clear CTA",
          ],
        },
        googleAds: {
          label: "Google Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Reach clients already searching for your product or service on Google. Full setup, ongoing optimization and monthly report included.",
          short: "Google campaigns for people already searching what you offer.",
          includes: ["Campaign setup", "Optimization", "Monthly report"],
        },
        metaAds: {
          label: "Meta Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Reach new clients on Facebook and Instagram with targeted creatives and precise audience targeting. Works for any sector.",
          short:
            "Facebook/Instagram campaigns for visibility and new clients.",
          includes: [
            "Campaign setup",
            "Precise targeting",
            "Creatives included",
          ],
        },
        instaBase: {
          label: "Instagram Base",
          numericPrice: 180,
          recurring: true,
          description:
            "Consistent Instagram presence with 8 curated monthly posts. Ideal for those who want to start communicating professionally on social media.",
          short: "8 posts/month to keep the profile active.",
          includes: [
            "8 posts/month",
            "Profile organization",
            "Basic support",
          ],
        },
        instaGrowth: {
          label: "Instagram Growth",
          numericPrice: 320,
          recurring: true,
          description:
            "More structured editorial management with 12 monthly posts. For those who want to build a solid social presence and grow consistently.",
          short: "12 posts/month with growth strategy.",
          includes: [
            "12 posts/month",
            "Editorial strategy",
            "Growth focus",
          ],
        },
        instaPremium: {
          label: "Instagram Premium",
          numericPrice: 550,
          recurring: true,
          description:
            "Complete Instagram profile management: strategy, content, copywriting and ongoing support for a serious online presence.",
          short: "Advanced management with strategy and ongoing support.",
          includes: [
            "Complete management",
            "Content strategy",
            "Ongoing support",
          ],
        },
      },
      packages: [
        {
          name: "Start",
          priceEur: 199,
          priceRecurring: false,
          desc: "Get started",
          note: "Ideal entry for businesses wanting a better online presence without big upfront investment.",
          features: [
            "Basic branding",
            "Presence setup",
            "Consultation included",
          ],
          highlight: false,
        },
        {
          name: "Growth",
          priceEur: 499,
          priceRecurring: true,
          desc: "Most popular",
          note: "Best choice for seriously and measurably generating clients every month.",
          features: [
            "Google Ads or Meta Ads",
            "Monthly support",
            "Creatives included",
          ],
          highlight: true,
        },
        {
          name: "Boost",
          priceEur: 899,
          priceRecurring: true,
          desc: "Complete",
          note: "For those who want more active channels and faster results.",
          features: [
            "Google + Meta Ads",
            "Instagram management",
            "Landing page",
          ],
          highlight: false,
        },
      ],
      why: [
        {
          icon: "↗",
          title: "Concrete results",
          desc: "The goal is not to make pretty things, it's to generate leads, requests and real clients for your business.",
        },
        {
          icon: "◉",
          title: "Any sector",
          desc: "We work with restaurants, shops, professionals, hotels and any type of local or online business.",
        },
        {
          icon: "⟳",
          title: "100% remote",
          desc: "We manage everything remotely. No physical appointments needed — direct communication via WhatsApp and video calls.",
        },
        {
          icon: "▲",
          title: "Scalable structure",
          desc: "Start small and grow over time. Every service adapts to your pace and budget.",
        },
      ],
    },

    pt: {
      brand: "Weit Digital",
      tagline: "Growth Lab",
      slogan: "Clientes reais.\nCrescimento mensurável.",
      splashSub:
        "Estratégias digitais para empresas que querem resultados concretos.",
      splashHint: "Entrar",
      heroTitle: "O seu marketing,\nfinalmente claro.",
      heroDesc:
        "Google Ads, Meta Ads, Instagram e branding. Trabalhamos com pequenas e médias empresas em qualquer setor — 100% online, onde você estiver.",
      cta: "Fale no WhatsApp",
      selectorTitle: "Serviços",
      selectorDesc:
        "Selecione os serviços que te interessam para ver preços e detalhes.",
      includedTitle: "Detalhes do serviço",
      includedEmpty:
        "Selecione um serviço para ver a descrição e os itens incluídos.",
      totalTitle: "O seu plano",
      totalLabel: "Total selecionado",
      totalNote:
        "Serviços mensais renovam todo mês. Serviços únicos são pagos uma só vez.",
      packagesTitle: "Pacotes",
      whyTitle: "Por que nos escolher",
      finalCta: "Pronto para crescer?",
      footer: "Serviço 100% online • WhatsApp: +39 393 6232182",
      monthlyLabel: "inclui serviços mensais",
      onetimeLabel: "apenas pagamentos únicos",
      contactPkg: "Fale no WhatsApp",
      onlineNote: "100% online — sem escritório físico, atendimento direto.",
      services: {
        branding: {
          label: "Branding & Logo",
          numericPrice: 220,
          recurring: false,
          description:
            "Identidade visual profissional para se apresentar melhor online e offline. Logo, paleta de cores e direção gráfica para qualquer tipo de negócio.",
          short: "Logo, paleta e direção visual para a sua marca.",
          includes: ["Logo base", "Paleta de cores", "Direção visual"],
        },
        landing: {
          label: "Landing Page",
          numericPrice: 450,
          recurring: false,
          description:
            "Página otimizada para transformar visitas em contatos, orçamentos ou mensagens diretas. Estrutura clara, design moderno e CTA forte.",
          short: "Página para converter visitas em contatos reais.",
          includes: [
            "Estrutura focada em leads",
            "Design moderno",
            "CTA clara",
          ],
        },
        googleAds: {
          label: "Google Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Alcance clientes que já procuram o seu produto ou serviço no Google. Setup completo, otimização contínua e relatório mensal incluídos.",
          short: "Campanhas Google para quem já procura o que você oferece.",
          includes: [
            "Configuração",
            "Otimização contínua",
            "Relatório mensal",
          ],
        },
        metaAds: {
          label: "Meta Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Alcance novos clientes no Facebook e Instagram com criativos direcionados e segmentação precisa. Funciona para qualquer setor.",
          short:
            "Campanhas Facebook/Instagram para visibilidade e novos clientes.",
          includes: [
            "Configuração",
            "Segmentação precisa",
            "Criativos incluídos",
          ],
        },
        instaBase: {
          label: "Instagram Base",
          numericPrice: 180,
          recurring: true,
          description:
            "Presença constante no Instagram com 8 conteúdos mensais cuidados. Ideal para quem quer começar a comunicar profissionalmente nas redes.",
          short: "8 posts/mês para manter o perfil ativo.",
          includes: [
            "8 posts/mês",
            "Organização do perfil",
            "Suporte base",
          ],
        },
        instaGrowth: {
          label: "Instagram Growth",
          numericPrice: 320,
          recurring: true,
          description:
            "Gestão editorial mais estruturada com 12 conteúdos mensais. Para quem quer construir uma presença social sólida e crescer com continuidade.",
          short: "12 posts/mês com estratégia de crescimento.",
          includes: [
            "12 posts/mês",
            "Estratégia editorial",
            "Foco em crescimento",
          ],
        },
        instaPremium: {
          label: "Instagram Premium",
          numericPrice: 550,
          recurring: true,
          description:
            "Gestão completa do perfil Instagram: estratégia, conteúdos, copywriting e suporte contínuo para uma presença online séria.",
          short: "Gestão avançada com estratégia e suporte contínuo.",
          includes: [
            "Gestão completa",
            "Estratégia de conteúdo",
            "Suporte contínuo",
          ],
        },
      },
      packages: [
        {
          name: "Start",
          priceEur: 199,
          priceRecurring: false,
          desc: "Para começar",
          note: "Entrada ideal para quem quer se apresentar melhor online sem grandes investimentos iniciais.",
          features: [
            "Branding base",
            "Configuração de presença",
            "Consultoria incluída",
          ],
          highlight: false,
        },
        {
          name: "Growth",
          priceEur: 499,
          priceRecurring: true,
          desc: "Mais escolhido",
          note: "A melhor escolha para gerar clientes de forma séria e mensurável todo mês.",
          features: [
            "Google Ads ou Meta Ads",
            "Suporte mensal",
            "Criativos incluídos",
          ],
          highlight: true,
        },
        {
          name: "Boost",
          priceEur: 899,
          priceRecurring: true,
          desc: "Completo",
          note: "Para quem quer mais canais ativos e resultados mais rápidos.",
          features: [
            "Google + Meta Ads",
            "Gestão Instagram",
            "Landing page",
          ],
          highlight: false,
        },
      ],
      why: [
        {
          icon: "↗",
          title: "Resultados concretos",
          desc: "O objetivo não é fazer coisas bonitas, é gerar contatos, pedidos e clientes reais para o seu negócio.",
        },
        {
          icon: "◉",
          title: "Qualquer setor",
          desc: "Trabalhamos com restaurantes, lojas, profissionais, hotéis e qualquer tipo de empresa local ou online.",
        },
        {
          icon: "⟳",
          title: "100% online",
          desc: "Gerenciamos tudo remotamente. Sem encontros físicos — comunicação direta via WhatsApp e videochamada.",
        },
        {
          icon: "▲",
          title: "Estrutura escalável",
          desc: "Comece pequeno e cresça com o tempo. Cada serviço se adapta ao seu ritmo e ao seu orçamento.",
        },
      ],
    },

    de: {
      brand: "Weit Digital",
      tagline: "Growth Lab",
      slogan: "Echte Kunden.\nMessbares Wachstum.",
      splashSub:
        "Digitale Strategien für Unternehmen, die konkrete Ergebnisse wollen.",
      splashHint: "Eintreten",
      heroTitle: "Ihr Marketing,\nendlich klar.",
      heroDesc:
        "Google Ads, Meta Ads, Instagram und Branding. Wir arbeiten mit kleinen und mittleren Unternehmen in jeder Branche — vollständig online, wo immer Sie sind.",
      cta: "WhatsApp schreiben",
      selectorTitle: "Leistungen",
      selectorDesc:
        "Wählen Sie die gewünschten Leistungen aus, um Preise und Details zu sehen.",
      includedTitle: "Leistungsdetails",
      includedEmpty:
        "Wählen Sie eine Leistung, um Beschreibung und enthaltene Inhalte zu sehen.",
      totalTitle: "Ihr Plan",
      totalLabel: "Ausgewählte Summe",
      totalNote:
        "Monatliche Leistungen verlängern sich monatlich. Einmalige Leistungen werden einmalig bezahlt.",
      packagesTitle: "Pakete",
      whyTitle: "Warum uns wählen",
      finalCta: "Bereit zu wachsen?",
      footer: "100% Online-Service • WhatsApp: +39 393 6232182",
      monthlyLabel: "enthält monatliche Leistungen",
      onetimeLabel: "nur Einmalzahlungen",
      contactPkg: "Auf WhatsApp schreiben",
      onlineNote: "100% online — kein physisches Büro erforderlich.",
      services: {
        branding: {
          label: "Branding & Logo",
          numericPrice: 220,
          recurring: false,
          description:
            "Professionelle visuelle Identität für einen besseren Auftritt online und offline. Logo, Farbpalette und grafische Grundrichtung für jede Art von Unternehmen.",
          short: "Logo, Palette und visuelle Richtung für Ihre Marke.",
          includes: ["Basis-Logo", "Farbpalette", "Visuelle Richtung"],
        },
        landing: {
          label: "Landing Page",
          numericPrice: 450,
          recurring: false,
          description:
            "Optimierte Seite, um Besucher in Leads, Angebote oder direkte Nachrichten umzuwandeln. Klare Struktur, modernes Design und starker CTA.",
          short: "Seite zur Umwandlung von Besuchern in echte Kontakte.",
          includes: [
            "Lead-orientierte Struktur",
            "Modernes Design",
            "Klarer CTA",
          ],
        },
        googleAds: {
          label: "Google Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Erreichen Sie Kunden, die bereits nach Ihrem Produkt oder Ihrer Dienstleistung auf Google suchen. Vollständiges Setup, laufende Optimierung und monatlicher Bericht.",
          short: "Google-Kampagnen für Personen, die bereits suchen.",
          includes: ["Kampagnen-Setup", "Optimierung", "Monatsbericht"],
        },
        metaAds: {
          label: "Meta Ads",
          numericPrice: 350,
          recurring: true,
          description:
            "Neue Kunden auf Facebook und Instagram mit gezielten Creatives und präzisem Targeting erreichen. Funktioniert für jede Branche.",
          short:
            "Facebook/Instagram-Kampagnen für Sichtbarkeit und neue Kunden.",
          includes: [
            "Kampagnen-Setup",
            "Präzises Targeting",
            "Creatives inklusive",
          ],
        },
        instaBase: {
          label: "Instagram Basis",
          numericPrice: 180,
          recurring: true,
          description:
            "Konstante Instagram-Präsenz mit 8 kuratierten monatlichen Beiträgen. Ideal für den professionellen Start in den sozialen Medien.",
          short: "8 Beiträge/Monat, um das Profil aktiv zu halten.",
          includes: [
            "8 Beiträge/Monat",
            "Profilorganisation",
            "Basis-Support",
          ],
        },
        instaGrowth: {
          label: "Instagram Growth",
          numericPrice: 320,
          recurring: true,
          description:
            "Strukturiertes redaktionelles Management mit 12 monatlichen Beiträgen. Für eine starke, kontinuierliche Social-Media-Präsenz.",
          short: "12 Beiträge/Monat mit Wachstumsstrategie.",
          includes: [
            "12 Beiträge/Monat",
            "Redaktionsstrategie",
            "Wachstumsfokus",
          ],
        },
        instaPremium: {
          label: "Instagram Premium",
          numericPrice: 550,
          recurring: true,
          description:
            "Vollständiges Instagram-Profilmanagement: Strategie, Inhalte, Copywriting und laufender Support für eine seriöse Online-Präsenz.",
          short: "Erweitertes Management mit Strategie und laufendem Support.",
          includes: [
            "Vollständiges Management",
            "Content-Strategie",
            "Laufender Support",
          ],
        },
      },
      packages: [
        {
          name: "Start",
          priceEur: 199,
          priceRecurring: false,
          desc: "Einsteiger",
          note: "Idealer Einstieg für alle, die online besser auftreten wollen — ohne große Anfangsinvestition.",
          features: [
            "Basis-Branding",
            "Präsenz-Setup",
            "Beratung inklusive",
          ],
          highlight: false,
        },
        {
          name: "Growth",
          priceEur: 499,
          priceRecurring: true,
          desc: "Beliebtestes",
          note: "Die beste Wahl, um jeden Monat ernsthaft und messbar neue Kunden zu gewinnen.",
          features: [
            "Google Ads oder Meta Ads",
            "Monatlicher Support",
            "Creatives inklusive",
          ],
          highlight: true,
        },
        {
          name: "Boost",
          priceEur: 899,
          priceRecurring: true,
          desc: "Komplett",
          note: "Für alle, die mehr aktive Kanäle und schnellere Ergebnisse wollen.",
          features: [
            "Google + Meta Ads",
            "Instagram-Management",
            "Landing Page",
          ],
          highlight: false,
        },
      ],
      why: [
        {
          icon: "↗",
          title: "Konkrete Ergebnisse",
          desc: "Das Ziel ist nicht, schöne Dinge zu machen, sondern echte Leads, Anfragen und Kunden für Ihr Business zu generieren.",
        },
        {
          icon: "◉",
          title: "Jede Branche",
          desc: "Wir arbeiten mit Restaurants, Geschäften, Freiberuflern, Hotels und jeder Art von lokalem oder Online-Business.",
        },
        {
          icon: "⟳",
          title: "100% online",
          desc: "Wir verwalten alles remote. Keine physischen Termine — direkte Kommunikation per WhatsApp und Videoanruf.",
        },
        {
          icon: "▲",
          title: "Skalierbare Struktur",
          desc: "Klein anfangen und im Laufe der Zeit wachsen. Jede Leistung passt sich Ihrem Tempo und Budget an.",
        },
      ],
    },
  };

  const t = content[lang];

  // Build services with computed prices
  const activeServices = useMemo(() => {
    return selected.map((k) => {
      const raw = t.services[k];
      const suffix = raw.recurring
        ? monthlySuffix[lang]
        : oneTimeSuffix[lang];
      return {
        key: k,
        ...raw,
        price: formatPrice(raw.numericPrice, lang, suffix),
        note: raw.recurring ? monthlySuffix[lang].replace("/", "") : oneTimeSuffix[lang].trim(),
      };
    });
  }, [selected, lang]);

  const summary = useMemo(
    () => ({
      total: activeServices.reduce((a, s) => a + s.numericPrice, 0),
      hasRecurring: activeServices.some((s) => s.recurring),
    }),
    [activeServices]
  );

  const toggle = (k: ServiceKey) =>
    setSelected((p) =>
      p.includes(k) ? p.filter((x) => x !== k) : [...p, k]
    );

  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    setTimeout(() => setEntered(true), 750);
  };

  useEffect(() => {
    document.body.style.overflow = entered ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [entered]);

  const blue = "#1d4ed8";
  const dark = "#0d2b6e";

  /* ══════════ SPLASH ══════════ */
  if (!entered) {
    return (
      <div
        className="relative flex min-h-screen cursor-pointer select-none items-center justify-center overflow-hidden px-6 text-center text-white"
        style={{
          background:
            "radial-gradient(ellipse at 58% 38%, #0f2d6b 0%, #050d1a 65%)",
        }}
        onClick={handleEnter}
      >
        {/* grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.07) 1px,transparent 1px)",
            backgroundSize: "68px 68px",
          }}
        />
        {/* glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(59,130,246,.18) 0%,transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        <div
          className={`relative z-10 transition-all duration-700 ${
            isEntering
              ? "scale-110 opacity-0 blur-sm"
              : "opacity-100 scale-100"
          }`}
        >
          <div className="mb-8 flex justify-center">
            <WeitLogo dark className="h-20 w-auto" />
          </div>

          <h1
            className="text-6xl font-black leading-tight tracking-tighter md:text-8xl"
            style={{
              background:
                "linear-gradient(135deg,#ffffff 0%,#93c5fd 55%,#3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              whiteSpace: "pre-line",
            }}
          >
            {t.slogan}
          </h1>

          <p className="mt-6 mx-auto max-w-md text-base text-white/45">
            {t.splashSub}
          </p>

          <button className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[.07] px-8 py-3.5 text-sm text-white/70 backdrop-blur-sm transition hover:border-white/30 hover:text-white/95">
            <span
              className="inline-block animate-bounce"
              style={{ animationDuration: "1.6s" }}
            >
              ↓
            </span>
            {t.splashHint}
          </button>
        </div>
      </div>
    );
  }

  /* ══════════ MAIN ══════════ */
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg,#f5f9ff 0%,#ffffff 55%,#f0f6ff 100%)",
        color: "#0a1423",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu  { animation:fadeUp .65s ease both; }
        .fu1 { animation-delay:.04s; }
        .fu2 { animation-delay:.14s; }
        .fu3 { animation-delay:.26s; }
        .fu4 { animation-delay:.38s; }
        .card {
          transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;
          border:1px solid rgba(10,31,70,.09);
          background:rgba(255,255,255,.88);
        }
        .card:hover {
          transform:translateY(-4px) scale(1.012);
          box-shadow:0 20px 48px rgba(10,31,70,.11);
          border-color:#3b82f6;
        }
      `}</style>

      {/* HEADER */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,.91)"
            : "rgba(255,255,255,.55)",
          backdropFilter: "blur(22px)",
          borderBottom: scrolled
            ? "1px solid rgba(10,31,70,.07)"
            : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <WeitLogo className="h-9 w-auto" />
            <div>
              <div className="text-[15px] font-black tracking-tight">
                {t.brand}
              </div>
              <div
                className="text-[9px] font-bold tracking-[.18em] uppercase"
                style={{ color: blue }}
              >
                {t.tagline}
              </div>
            </div>
          </div>

          {/* Online badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold"
            style={{ borderColor:`${blue}25`, background:`${blue}08`, color: blue }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t.onlineNote}
          </div>

          <div className="flex items-center gap-1">
            {(["it", "en", "pt", "de"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-black uppercase tracking-widest transition"
                style={{
                  background: lang === l ? dark : "transparent",
                  color: lang === l ? "#fff" : "#94a3b8",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-24">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider fu fu1"
            style={{
              borderColor: `${blue}30`,
              background: `${blue}09`,
              color: blue,
            }}
          >
            Weit Digital Growth Lab
          </div>

          <h1
            className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tighter md:text-7xl fu fu2"
            style={{ whiteSpace: "pre-line" }}
          >
            {t.heroTitle}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500 fu fu3">
            {t.heroDesc}
          </p>

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-blue-200 fu fu4"
            style={{ background: `linear-gradient(135deg,${blue},${dark})` }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.12 1.533 5.847L.057 23.882l6.196-1.623A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.576 9.576 0 01-4.892-1.339l-.35-.208-3.677.964.981-3.587-.228-.369A9.576 9.576 0 012.4 12C2.4 6.698 6.698 2.4 12 2.4S21.6 6.698 21.6 12 17.302 21.6 12 21.6z" />
            </svg>
            {t.cta}
          </a>
        </section>

        <div className="mx-auto max-w-7xl px-6">
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right,transparent,rgba(29,78,216,.18),transparent)",
            }}
          />
        </div>

        {/* SERVICES */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-black tracking-tight">
            {t.selectorTitle}
          </h2>
          <p className="mt-2 text-slate-500">{t.selectorDesc}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {(Object.keys(t.services) as ServiceKey[]).map((key) => {
              const svc = t.services[key];
              const sel = selected.includes(key);
              const suffix = svc.recurring
                ? monthlySuffix[lang]
                : oneTimeSuffix[lang];
              const price = formatPrice(svc.numericPrice, lang, suffix);
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="group rounded-2xl p-5 text-left transition-all duration-200"
                  style={{
                    background: sel
                      ? `linear-gradient(135deg,${blue},${dark})`
                      : "rgba(255,255,255,.88)",
                    border: `1px solid ${sel ? blue : "rgba(10,31,70,.09)"}`,
                    color: sel ? "#fff" : "inherit",
                    boxShadow: sel
                      ? `0 14px 32px rgba(29,78,216,.28)`
                      : "0 2px 12px rgba(10,31,70,.05)",
                    transform: sel ? "translateY(-2px)" : undefined,
                  }}
                >
                  <div className="mb-3 text-lg opacity-60">
                    {SVC_ICON[key]}
                  </div>
                  <div className="font-bold leading-snug">{svc.label}</div>
                  <div className="mt-2 text-2xl font-black">{price}</div>
                  <div
                    className="mt-1 text-xs"
                    style={{
                      color: sel ? "rgba(255,255,255,.55)" : "#94a3b8",
                    }}
                  >
                    {svc.recurring ? "+" : ""}
                    {svc.recurring
                      ? lang === "it"
                        ? "budget ads"
                        : lang === "de"
                        ? "Ad-Budget"
                        : "ad budget"
                      : oneTimeSuffix[lang].trim()}
                  </div>
                  <div
                    className="mt-4 flex h-5 w-5 items-center justify-center rounded-full border text-[10px]"
                    style={{
                      borderColor: sel
                        ? "rgba(255,255,255,.4)"
                        : "#cbd5e1",
                      background: sel
                        ? "rgba(255,255,255,.18)"
                        : "transparent",
                      color: sel ? "#fff" : "transparent",
                    }}
                  >
                    ✓
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* DETAIL + SUMMARY */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
            {/* Detail */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: "rgba(255,255,255,.88)",
                border: "1px solid rgba(10,31,70,.08)",
                boxShadow: "0 20px 60px rgba(10,31,70,.06)",
              }}
            >
              <h3 className="text-2xl font-black">{t.includedTitle}</h3>
              {activeServices.length === 0 ? (
                <p className="mt-4 text-slate-400">{t.includedEmpty}</p>
              ) : (
                <div className="mt-6 space-y-5">
                  {activeServices.map((s) => (
                    <div
                      key={s.key}
                      className="rounded-2xl border p-6"
                      style={{
                        borderColor: "rgba(10,31,70,.08)",
                        background: "linear-gradient(135deg,#f7fbff,#fff)",
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ color: blue }}>
                              {SVC_ICON[s.key]}
                            </span>
                            <span className="text-lg font-black">
                              {s.label}
                            </span>
                          </div>
                          <p className="text-sm leading-7 text-slate-500">
                            {s.description}
                          </p>
                        </div>
                        <div
                          className="rounded-2xl px-5 py-4 text-white flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg,${blue},${dark})`,
                          }}
                        >
                          <div className="text-xl font-black">{s.price}</div>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {s.includes.map((item) => (
                          <span
                            key={item}
                            className="rounded-xl border px-3 py-2 text-xs font-medium text-slate-600"
                            style={{
                              borderColor: "rgba(10,31,70,.1)",
                              background: "#f3f8ff",
                            }}
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div
              className="flex flex-col rounded-3xl p-8"
              style={{
                background: "rgba(255,255,255,.88)",
                border: "1px solid rgba(10,31,70,.08)",
                boxShadow: "0 20px 60px rgba(10,31,70,.06)",
              }}
            >
              <h3 className="text-2xl font-black">{t.totalTitle}</h3>
              <div
                className="mt-6 rounded-2xl p-6 text-white"
                style={{
                  background: `linear-gradient(135deg,${blue},${dark})`,
                }}
              >
                <div
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,.5)" }}
                >
                  {t.totalLabel}
                </div>
                <div className="mt-1 text-4xl font-black">
                  {formatPrice(summary.total, lang)}
                </div>
                <div
                  className="mt-1.5 text-xs"
                  style={{ color: "rgba(255,255,255,.55)" }}
                >
                  {summary.hasRecurring ? t.monthlyLabel : t.onetimeLabel}
                </div>
              </div>
              <p className="mt-4 text-xs leading-6 text-slate-400">
                {t.totalNote}
              </p>
              <div className="mt-5 flex-1 space-y-3">
                {activeServices.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between gap-3 rounded-xl border p-4 text-sm"
                    style={{
                      borderColor: "rgba(10,31,70,.07)",
                      background: "#f8fbff",
                    }}
                  >
                    <div>
                      <div className="font-bold">{s.label}</div>
                    </div>
                    <div className="font-black" style={{ color: blue }}>
                      {s.price}
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg,${blue},${dark})`,
                }}
              >
                {t.cta}
              </a>
            </div>
          </div>
        </section>

        {/* PACKAGES */}
        <section
          className="py-20"
          style={{
            background: "linear-gradient(180deg,#eef4ff 0%,#e8f0ff 100%)",
          }}
        >
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-black">{t.packagesTitle}</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {t.packages.map((pkg) => {
                const suffix = pkg.priceRecurring
                  ? monthlySuffix[lang]
                  : oneTimeSuffix[lang];
                const pkgPrice = formatPrice(pkg.priceEur, lang, suffix);
                return (
                  <div
                    key={pkg.name}
                    className="rounded-3xl p-8 card transition-all duration-200"
                    style={
                      pkg.highlight
                        ? {
                            background: `linear-gradient(160deg,${blue} 0%,${dark} 100%)`,
                            color: "#fff",
                            border: `1px solid ${blue}`,
                            boxShadow: `0 28px 64px rgba(29,78,216,.32)`,
                          }
                        : {}
                    }
                  >
                    <div
                      className="text-[10px] font-bold tracking-widest uppercase mb-1"
                      style={{
                        color: pkg.highlight
                          ? "rgba(255,255,255,.5)"
                          : blue,
                      }}
                    >
                      {pkg.desc}
                    </div>
                    <div className="text-3xl font-black">{pkg.name}</div>
                    <div className="mt-4 text-4xl font-black tracking-tight">
                      {pkgPrice}
                    </div>
                    <p
                      className="mt-4 text-sm leading-6"
                      style={{
                        color: pkg.highlight
                          ? "rgba(255,255,255,.6)"
                          : "#64748b",
                      }}
                    >
                      {pkg.note}
                    </p>
                    <div className="mt-6 space-y-2.5">
                      {pkg.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
                          style={{
                            background: pkg.highlight
                              ? "rgba(255,255,255,.10)"
                              : "#e8f0ff",
                            color: pkg.highlight ? "#fff" : dark,
                          }}
                        >
                          <span
                            style={{
                              color: pkg.highlight ? "#93c5fd" : blue,
                            }}
                          >
                            ✓
                          </span>
                          {f}
                        </div>
                      ))}
                    </div>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold transition hover:scale-[1.02]"
                      style={{
                        background: pkg.highlight ? "#fff" : dark,
                        color: pkg.highlight ? dark : "#fff",
                      }}
                    >
                      {t.contactPkg} →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-black">{t.whyTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {t.why.map((item) => (
              <div key={item.title} className="rounded-2xl p-7 card">
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black"
                  style={{ background: "#e8f0ff", color: blue }}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          className="px-6 py-24 text-center text-white"
          style={{
            background: `linear-gradient(160deg,${dark} 0%,${blue} 100%)`,
          }}
        >
          <div className="pointer-events-none mx-auto mb-8 flex justify-center opacity-[.18]">
            <WeitLogo dark className="h-16 w-auto" />
          </div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            {t.finalCta}
          </h2>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold transition hover:scale-105 hover:shadow-2xl"
            style={{ color: dark }}
          >
            WhatsApp →
          </a>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400">
        {t.footer}
      </footer>
    </div>
  );
}
