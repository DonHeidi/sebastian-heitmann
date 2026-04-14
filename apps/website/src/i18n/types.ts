export interface Strings {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    logo: string;
    logoDot: string;
    cvLabel: string;
    cta: string;
  };
  hero: {
    firstName: string;
    lastName: string;
    pitchLead: string;
    pitch: string;
    cta: string;
    ctaNote: string;
    photoAlt: string;
    role: { label: string; value: string };
    focus: { label: string; value: string };
    experience: { label: string; value: string };
    projects: { label: string; value: string };
    status: { label: string; value: string };
  };
  logos: {
    workingWithLabel: string;
    workingWith: string[];
    previouslyAtLabel: string;
    previouslyAt: string[];
  };
  situations: {
    label: string;
    items: string[];
  };
  proof: {
    resultsLabel: string;
    cases: Array<{
      metric: string;
      metricLabel: string;
      description: string;
      tag: string;
    }>;
    engagementLabel: string;
    engagements: Array<{
      model: string;
      billing: string;
      description: string;
      featured?: boolean;
    }>;
  };
  contact: {
    headline: string;
    intro: string;
    nameLabel: string;
    emailLabel: string;
    contextLabel: string;
    contextPlaceholder: string;
    messageLabel: string;
    submitLabel: string;
    sendingLabel: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    copyright: string;
    privacyLabel: string;
    imprintLabel: string;
  };
  languagePicker: {
    label: string;
  };
  caseDetail: {
    backLabel: string;
  };
  featuredArticles: {
    label: string;
    viewAllLabel: string;
  };
  categories: {
    'solopreneurship-career': string;
    'leadership-management': string;
    'technical-decisions': string;
    'shipping-with-ai': string;
    'mental-health': string;
  };
  article: {
    seriesPartPrefix: string;
    seriesPartOf: string;
    readingTimeSuffix: string;
    seriesOverline: string;
    seriesNavLabel: string;
    backToAll: string;
    authorship: {
      human: string;
      aiAssisted: string;
      agentWritten: string;
    };
    aiTranslated: string;
  };
  cv: {
    meta: {
      title: string;
      description: string;
    };
    headline: string;
    summary: string;
    experienceLabel: string;
    experience: Array<{
      period: string;
      role: string;
      company: string;
      location: string;
      description: string;
      highlights: string[];
    }>;
    earlierExperienceLabel: string;
    earlierExperience: Array<{
      period: string;
      role: string;
      company: string;
      location: string;
    }>;
    skillsLabel: string;
    skillGroups: Array<{
      label: string;
      skills: string[];
    }>;
    educationLabel: string;
    education: Array<{
      period: string;
      degree: string;
      institution: string;
      description: string;
    }>;
    languagesLabel: string;
    languages: Array<{
      language: string;
      level: string;
    }>;
    softSkillsLabel: string;
    softSkills: string[];
    certificationsLabel: string;
    currentFocusLabel: string;
    currentFocus: string[];
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
    communityLabel: string;
    communityActivities: string[];
    communityRoles: Array<{
      period: string;
      role: string;
      organization: string;
    }>;
    interestsLabel: string;
    interests: string[];
    downloadLabel: string;
  };
}
