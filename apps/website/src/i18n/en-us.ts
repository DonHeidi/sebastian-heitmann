import type { Strings } from './types';

export const enUs: Strings = {
  meta: {
    title: 'Sebastian Heitmann \u2014 Fractional CTO',
    description: 'Fractional CTO & Technical Partner. Architecture, Delivery, Teams.',
  },
  nav: {
    logo: 'sebastian-heitmann',
    logoDot: '.dev',
    cta: 'Book a Call',
  },
  hero: {
    firstName: 'Sebastian',
    lastName: 'Heitmann',
    pitch: 'When architecture, delivery, or team structure becomes the constraint, I help leadership teams make the next technical decisions with clarity.',
    cta: 'Book an Introduction Call',
    ctaNote: '30 minutes. No slides. No pitch.',
    photoAlt: 'Sebastian Heitmann',
    role: { label: 'Role', value: 'Fractional CTO & Technical Partner' },
    focus: { label: 'Focus', value: 'Architecture, Delivery, Teams' },
    experience: { label: 'Experience', value: '15 years' },
    projects: { label: 'Projects', value: '20+ delivered' },
    status: { label: 'Status', value: 'Available' },
  },
  logos: {
    workingWithLabel: 'Working with',
    workingWith: ['Pool Position GmbH', 'mobilespace GmbH'],
    previouslyAtLabel: 'Previously at',
    previouslyAt: ['Jung von Matt', 'Synergy', 'Granny & Smith', 'OFFIS'],
  },
  situations: {
    label: 'When to reach out',
    items: [
      'Delivery has slowed, and the team sees a different cause in every direction',
      'The architecture got you here, but it will not carry the next stage',
      'A technical decision now will shape cost, speed, or team structure for years',
      'A migration, rebuild, or reorg needs someone who has already done it',
    ],
  },
  proof: {
    resultsLabel: 'Results',
    cases: [
      {
        metric: 'Gap Closed',
        metricLabel: '54% project risk identified and addressed',
        description: 'Identified a 54% projected failure risk through an initial assessment, then restructured the project management and changed the execution conditions to create a more viable foundation for the initiatives that followed.',
        tag: 'Execution Risk',
      },
      {
        metric: 'AWS',
        metricLabel: 'migration from SAP BW',
        description: 'Moved a legacy analytics environment from SAP BW toward an AWS-based setup, replacing brittle internal tooling with a more workable foundation for reporting and ongoing delivery.',
        tag: 'Cloud Migration',
      },
      {
        metric: '7',
        metricLabel: 'countries rolled out',
        description: 'Stabilized the platform and content pipeline ahead of launch, enabling a reliable rollout across seven countries from day one.',
        tag: 'Technical Delivery',
      },
      {
        metric: 'Stalled \u2192 Stable',
        metricLabel: 'intranet relaunch',
        description: 'Aligned concept, planning, budget approval, and cross-team execution for the relaunch of an internal platform \u2014 turning a stalled initiative into a stable delivery.',
        tag: 'Product Leadership',
      },
      {
        metric: '+2',
        metricLabel: 'points in satisfaction',
        description: 'Introduced a decentralized IT support model to improve internal service quality, contributing to a measurable two-point increase in satisfaction across the organization.',
        tag: 'Operational Improvement',
      },
    ],
    engagementLabel: 'Engagement',
    engagements: [
      {
        model: 'Advise',
        price: '$150',
        unit: '/hour',
        description: 'Architecture reviews, hiring decisions, vendor evaluations, and second opinions before a high-impact commitment.',
      },
      {
        model: 'Deliver',
        price: '$5,499',
        unit: '/cycle',
        cycleNote: 'Typically 2 weeks',
        description: 'A focused engagement around a defined outcome \u2014 an MVP, a migration, a rebuild, or a delivery reset.',
        featured: true,
      },
      {
        model: 'Partner',
        price: '$2,749',
        unit: '/month',
        description: 'Ongoing technical partnership for companies that need senior oversight across architecture, delivery, and execution continuity.',
      },
    ],
  },
  contact: {
    headline: 'Start a Conversation',
    intro: 'Tell me what you are working through. I will get back to you within one business day with a candid view on whether and how I can help.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    contextLabel: 'What is changing, stuck, or at risk right now?',
    contextPlaceholder: 'e.g. a migration, a team restructure, an architecture decision',
    messageLabel: 'What would you like me to help you clarify, assess, or move forward?',
    submitLabel: 'Send',
    sendingLabel: 'Sending',
    successMessage: 'Message sent. I will get back to you soon.',
    errorMessage: 'Something went wrong. Please try again.',
  },
  footer: {
    copyright: '\u00A9 2026 Sebastian Heitmann',
    privacyLabel: 'Privacy',
    imprintLabel: 'Imprint',
  },
  languagePicker: {
    label: 'Language',
  },
  caseDetail: {
    backLabel: 'Back',
  },
};
