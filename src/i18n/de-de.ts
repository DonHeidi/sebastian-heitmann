import type { Strings } from './types';

export const deDe: Strings = {
  meta: {
    title: 'Sebastian Heitmann \u2014 Fractional CTO',
    description: 'Fractional CTO & Technischer Partner. Architektur, Delivery, Teams.',
  },
  nav: {
    logo: 'sebastian-heitmann',
    logoDot: '.dev',
    cta: 'Gespr\u00E4ch buchen',
  },
  hero: {
    firstName: 'Sebastian',
    lastName: 'Heitmann',
    pitch: 'Wenn Architektur, Delivery oder Teamstruktur zum Engpass werden, helfe ich Führungsteams, die nächsten technischen Entscheidungen mit mehr Klarheit und Sicherheit zu treffen.',
    cta: 'Erstgespr\u00E4ch vereinbaren',
    ctaNote: '30 Minuten. Keine Folien. Kein Pitch.',
    photoAlt: 'Sebastian Heitmann',
    role: { label: 'Rolle', value: 'Fractional CTO & Technischer Partner' },
    focus: { label: 'Fokus', value: 'Architektur, Delivery, Teams' },
    experience: { label: 'Erfahrung', value: '15 Jahre' },
    projects: { label: 'Projekte', value: '20+ umgesetzt' },
    status: { label: 'Status', value: 'Verf\u00FCgbar' },
  },
  logos: {
    workingWithLabel: 'Aktuelle Zusammenarbeit',
    workingWith: ['Pool Position GmbH', 'mobilespace GmbH'],
    previouslyAtLabel: 'Zuvor bei',
    previouslyAt: ['Jung von Matt', 'Synergy', 'Granny & Smith', 'OFFIS'],
  },
  situations: {
    label: 'Wann ein Gespräch sinnvoll ist',
    items: [
      'Die Delivery ist ins Stocken geraten, und im Team sieht jeder eine andere Ursache.',
      'Ihre Architektur hat Sie weit gebracht, aber trägt die nächste Phase nicht weiter.',
      'Technische Entscheidungen fühlen sich schwer an und prägen Kosten, Geschwindigkeit und Teamstrukturen für Jahre.',
      'Eine Migration, ein Rebuild oder eine Reorganisation braucht jemanden, der das schon einmal gemacht hat.',
    ],
  },
  proof: {
    resultsLabel: 'Ergebnisse',
    cases: [
      {
        metric: 'Risiko minimiert',
        metricLabel: '54 % Projektrisiko erkannt und adressiert',
        description: 'Im ursprünglichen Delivery-Setup ein projiziertes Ausfallrisiko von 54 % identifiziert, die Ausgangslage neu aufgesetzt und die Rahmenbedingungen so verändert, dass die folgenden Initiativen auf einer tragfähigen Basis umgesetzt werden konnten.',
        tag: 'Ausführungsrisiko',
      },
      {
        metric: 'AWS',
        metricLabel: 'Migration von SAP BW',
        description: 'Eine bestehende Analytics-Umgebung von SAP BW in ein AWS-basiertes Setup überführt und damit die Grundlage für belastbareres Reporting und kontinuierliche Delivery geschaffen.',
        tag: 'Cloud-Migration',
      },
      {
        metric: '7',
        metricLabel: 'Länder ausgerollt',
        description: 'Plattform und Content-Pipeline vor dem Launch stabilisiert und damit einen zuverlässigen Rollout in sieben Ländern ab dem ersten Tag ermöglicht.',
        tag: 'Technische Delivery',
      },
      {
        metric: 'Stillstand → Stabil',
        metricLabel: 'Intranet-Relaunch',
        description: 'Konzept, Planung, Budgetfreigabe und teamübergreifende Umsetzung für den Relaunch einer internen Plattform aufeinander abgestimmt und eine blockierte Initiative in einen stabilen Relaunch überführt.',
        tag: 'Produktführung',
      },
      {
        metric: '+2',
        metricLabel: 'Punkte Zufriedenheit',
        description: 'Ein dezentrales IT-Support-Modell eingeführt und damit die interne Servicequalität so verbessert, dass die Zufriedenheit organisationsweit messbar um zwei Punkte stieg.',
        tag: 'Operative Verbesserung',
      },
    ],
    testimonialsLabel: 'Was andere sagen',
    testimonials: [
      {
        quote: 'Sebastian kam dazu, als wir zwischen zwei Architekturpfaden und einer Board-Deadline feststeckten. Innerhalb von Wochen hatte das Team eine klare Richtung und lieferte wieder.',
        attribution: 'CTO, Series-A-Fintech',
      },
      {
        quote: 'Wir brauchten jemanden, der in derselben Woche mit Engineers und Investoren sprechen kann. Er hat beides geschafft, ohne bei einer Seite an Glaubw\u00FCrdigkeit zu verlieren.',
        attribution: 'Head of Engineering, Mid-Market SaaS',
      },
      {
        quote: 'Ruhig unter Druck, kein Ego, und jede Empfehlung kam mit einem realistischen Plan zur Umsetzung. Genau die Art von technischem Partner, die wir gesucht haben.',
        attribution: 'CEO, B2B-Marktplatz',
      },
    ],
    engagementLabel: 'Zusammenarbeit',
    engagements: [
      {
        model: 'Beraten',
        price: '\u20AC130',
        unit: '/Stunde',
        description: 'Architektur-Reviews, Einstellungsentscheidungen, Anbieterbewertungen und Zweitmeinungen vor wichtigen technischen Festlegungen.',
      },
      {
        model: 'Umsetzen',
        price: '\u20AC4.999',
        unit: '/Zyklus',
        cycleNote: 'Typischerweise 4\u20136 Wochen',
        description: 'Ein fokussiertes Engagement mit klarem Ziel – etwa ein MVP, eine Migration, ein Rebuild oder ein Delivery-Reset.',
        featured: true,
      },
      {
        model: 'Begleiten',
        price: '\u20AC2.499',
        unit: '/Monat',
        description: 'Laufende technische Partnerschaft für Unternehmen, die erfahrene Führung in Architektur, Delivery und technischer Umsetzung brauchen.',
      },
    ],
  },
  contact: {
    headline: 'Gespr\u00E4ch starten',
    intro: 'Erzählen Sie mir, woran Sie gerade arbeiten. Ich melde mich innerhalb eines Werktages mit einer offenen Einschätzung zurück, ob und wie ich helfen kann.',
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    contextLabel: 'Was verändert sich gerade, steckt fest oder ist Ihr aktueller Engpass?',
    contextPlaceholder: 'z.\u00A0B. eine Migration, eine Team-Umstrukturierung, eine Architekturentscheidung',
    messageLabel: 'Wobei soll ich Sie unterstützen – bei Klarheit, Bewertung oder dem nächsten konkreten Schritt?',
    submitLabel: 'Senden',
  },
  footer: {
    copyright: '\u00A9 2026 Sebastian Heitmann',
    privacyLabel: 'Datenschutz',
    imprintLabel: 'Impressum',
  },
  languagePicker: {
    label: 'Sprache',
  },
  caseDetail: {
    backLabel: 'Zur\u00FCck',
  },
};
