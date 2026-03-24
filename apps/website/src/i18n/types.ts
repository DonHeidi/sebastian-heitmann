export interface Strings {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    logo: string;
    logoDot: string;
    cta: string;
  };
  hero: {
    firstName: string;
    lastName: string;
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
}
