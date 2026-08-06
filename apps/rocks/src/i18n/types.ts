export interface Strings {
  meta: {
    title: string;
    description: string;
    notFoundTitle: string;
  };
  nav: {
    logo: string;
    contactCta: string;
  };
  languagePicker: {
    label: string;
  };
  hero: {
    kicker: string;
    tagline: string;
    intro: { before: string; struck: string; replacement: string; after: string };
    artAlt: string;
  };
  credits: {
    label: string;
    names: string[];
  };
  themeToggle: {
    system: string;
    light: string;
    dark: string;
    label: string;
  };
  cases: {
    sectionTitle: string;
    stampCaseStudy: string;
    stampProject: string;
    readCase: string;
    roleLabel: string;
    stackLabel: string;
    linksLabel: string;
    periodLabel: string;
    ongoing: string;
    backToOverview: string;
  };
  /** Labels printed on the case tile's flip side (the CD back inlay).
   * The role line reuses `cases.roleLabel` — no duplicate here. */
  caseBack: {
    tracksLabel: string;
    yearLabel: string;
  };
  /** Case-detail device reel (task 28). `kicker` is the section's heading,
   * printed in the mono annotation register; the alts are deliberately
   * generic per device — the surrounding page already names the case. */
  showcase: {
    kicker: string;
    desktopAlt: string;
    tabletAlt: string;
    phoneAlt: string;
  };
  projects: {
    sectionTitle: string;
  };
  teasers: {
    sectionTitle: string;
    intro: string;
    readOn: string;
  };
  about: {
    sectionTitle: string;
    body: string;
    avatarAlt: string;
  };
  footer: {
    copyright: string;
    madeWith: string;
    privacyLabel: string;
    imprintLabel: string;
    contactLabel: string;
  };
  notFound: {
    heading: string;
    body: string;
    backHome: string;
  };
}
