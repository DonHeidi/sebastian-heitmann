import type { Strings } from './types';

export const deDe: Strings = {
  meta: {
    title: 'Sebastian Heitmann \u2014 Strategic Technology Consultant',
    description: 'Strategic Technology Consultant. Architektur, Delivery, Teams.',
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
    role: { label: 'Rolle', value: 'Strategic Technology Consultant' },
    focus: { label: 'Fokus', value: 'Architektur, Delivery, Teams' },
    experience: { label: 'Erfahrung', value: '15 Jahre' },
    projects: { label: 'Projekte', value: '20+ umgesetzt' },
    status: { label: 'Status', value: 'Verf\u00FCgbar' },
  },
  logos: {
    workingWithLabel: 'Aktuelle Zusammenarbeit',
    workingWith: ['Pool Position GmbH'],
    previouslyAtLabel: 'Zuvor bei',
    previouslyAt: ['Jung von Matt', 'Synergy', 'Granny & Smith', 'OFFIS'],
  },
  situations: {
    label: 'Wann ein Gespräch sinnvoll ist',
    items: [
      'Die Delivery ist ins Stocken geraten, und im Team sieht jeder eine andere Ursache.',
      'Deine Architektur hat dich weit gebracht, aber trägt die nächste Phase nicht weiter.',
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
        description: 'Im Rahmen eines Assessments ein Projektrisiko von 54 % identifiziert, daraufhin das Projektmanagement neu aufgesetzt und die Rahmenbedingungen so verändert, dass die folgenden Initiativen auf einer tragfähigen Basis umgesetzt werden konnten.',
        tag: 'Ausführungsrisiko',
      },
      {
        metric: 'AWS',
        metricLabel: 'Migration von SAP BW',
        description: 'Eine bestehende Analytics-Umgebung von SAP BW in ein AWS-basiertes Setup überführt und damit die Grundlage für belastbareres Reporting und kontinuierliche Delivery geschaffen.',
        tag: 'Cloud-Migration',
      },
      {
        metric: '7 Länder',
        metricLabel: 'internationaler Rollout',
        description: 'Plattform und Content-Pipeline vor dem Launch stabilisiert und damit einen zuverlässigen Rollout in sieben Ländern ab dem ersten Tag ermöglicht.',
        tag: 'Technische Delivery',
      },
      {
        metric: 'Stillstand → Live',
        metricLabel: 'stabiler Intranet Relaunch',
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
    engagementLabel: 'Zusammenarbeit',
    engagements: [
      {
        model: 'Beraten',
        billing: 'Stundenbasiert',
        description: 'Abrechnung nach Stunden. Architektur-Reviews, Einstellungskriterien, Anbieterbewertungen und Zweitmeinungen vor wichtigen technischen Entscheidungen.',
      },
      {
        model: 'Umsetzen',
        billing: 'Pro Zyklus',
        description: 'Festpreis pro Delivery-Zyklus. Ein fokussiertes Engagement mit klarem Ziel \u2014 etwa ein MVP, eine Migration, ein Rebuild oder ein Delivery-Reset.',
        featured: true,
      },
      {
        model: 'Begleiten',
        billing: 'Monatlicher Retainer',
        description: 'Laufender monatlicher Retainer. Erfahrene technische Partnerschaft in Architektur, Delivery und Umsetzungskontinuität.',
      },
    ],
  },
  contact: {
    headline: 'Lass uns reden',
    intro: 'Erzähl mir, woran du gerade arbeitest. Ich melde mich innerhalb eines Werktages mit einer offenen Einschätzung zurück, ob und wie ich helfen kann.',
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    contextLabel: 'Was verändert sich gerade, steckt fest oder ist dein aktueller Engpass?',
    contextPlaceholder: 'z.\u00A0B. eine Migration, eine Team-Umstrukturierung, eine Architekturentscheidung',
    messageLabel: 'Wobei soll ich dich unterstützen – bei Klarheit, Bewertung oder dem nächsten konkreten Schritt?',
    submitLabel: 'Senden',
    sendingLabel: 'Wird gesendet',
    successMessage: 'Nachricht gesendet. Ich melde mich bald.',
    errorMessage: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
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
