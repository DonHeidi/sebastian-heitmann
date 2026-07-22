# AI Process Automation Product Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual product page for AI-powered product and process development, linked as a second link from the featured "Deliver — Per Cycle" engagement card on both homepages.

**Architecture:** Follows the existing product-page pattern exactly: a typed `aiProcessAutomation` section in `Strings`, locale content in `en-us.ts`/`de-de.ts`, one content component with scoped SCSS using `--v8-*` tokens, one page shell per locale, a locale route-map entry in the navigation, and a new optional `aiLink` prop on `proof-section.astro`.

**Tech Stack:** Astro 6, SCSS, TypeScript, Bun. No test framework exists in this repo; verification is `bun run build` plus visual checks via Chrome DevTools MCP.

**Spec:** `docs/superpowers/specs/2026-07-20-ai-process-automation-page-design.md`

## Global Constraints

- Routes: `/ai-process-automation` (en-us) and `/de-de/ki-prozess-automation` (de-de).
- All user-visible text comes from i18n strings; components receive typed props, no hardcoded copy.
- Use `--v8-*` CSS custom properties only; breakpoints 1440/1024/768/375; scoped `<style lang="scss">` per component.
- Conventional commits (`feat(scope): …`).
- German copy is the user's draft essentially verbatim (typo cleanup only: the stray `https://www.job-directory.eu/` pasted mid-sentence in the prototype section is removed; trailing commas/periods dropped from list items rendered as styled lists).
- Prices: `ab 4.200 € netto` / `from €4,200 net`, `ab 10.990 € netto` / `from €10,990 net`.
- Work happens in a git worktree (create via superpowers:using-git-worktrees before Task 1).
- `bun run build` wraps `varlock run --`; if varlock cannot resolve secrets (no pass-cli session), run `cd apps/website && bunx astro build` instead — `PUBLIC_MAIL_ENDPOINT` is optional at build time.

---

### Task 1: i18n types and content (both locales)

**Files:**
- Modify: `apps/website/src/i18n/types.ts` (append new section to `Strings` before the closing `}`)
- Modify: `apps/website/src/i18n/en-us.ts` (append new top-level key)
- Modify: `apps/website/src/i18n/de-de.ts` (append new top-level key)

**Interfaces:**
- Produces: `Strings['aiProcessAutomation']` consumed by Tasks 2 and 3. Exact shape below.

- [ ] **Step 1: Add the type to `types.ts`**

Insert before the final closing `}` of `interface Strings` (after the `technicalProjectManagement` block, line ~312):

```ts
  aiProcessAutomation: {
    meta: { title: string; description: string };
    hero: { eyebrow: string; headline: string; subline: string; cta: string };
    approach: { eyebrow: string; headline: string; body: string[] };
    offerings: {
      eyebrow: string;
      headline: string;
      items: Array<{
        name: string;
        tagline: string;
        description: string[];
        scopeLabel: string;
        scope: string[];
        outcomeLabel: string;
        outcomeIntro: string;
        outcomes?: string[];
        price: string;
        priceNote?: string;
      }>;
    };
    example: {
      eyebrow: string;
      headline: string;
      intro: string;
      components: string[];
      body: string[];
      linkLabel: string;
      linkHref: string;
    };
    useCases: {
      eyebrow: string;
      headline: string;
      intro: string;
      items: string[];
      closing: string;
    };
    process: {
      eyebrow: string;
      headline: string;
      steps: Array<{ title: string; description: string }>;
    };
    evolution: {
      eyebrow: string;
      headline: string;
      intro: string;
      items: string[];
      closing: string;
    };
    cta: {
      headline: string;
      body: string;
      bullets: string[];
      closing: string;
      button: string;
    };
    contact: {
      headline: string;
      intro: string;
    };
  };
```

- [ ] **Step 2: Add English content to `en-us.ts`**

Insert as a new top-level key after the `technicalProjectManagement` block (keep the object comma-consistent):

```ts
  aiProcessAutomation: {
    meta: {
      title: 'AI-Powered Products & Processes — Sebastian Heitmann',
      description: 'I build AI-powered processes and software products with companies: prototypes, production-ready first releases, and custom AI systems that connect AI, automation, existing systems, and human decisions.',
    },
    hero: {
      eyebrow: 'AI Products & Processes',
      headline: 'Building AI-powered products and processes',
      subline: 'AI only creates dependable value once it is embedded in a working process.',
      cta: 'Discuss your initiative',
    },
    approach: {
      eyebrow: 'Approach',
      headline: 'One continuous workflow, not an isolated model',
      body: [
        'I develop AI-powered processes and software products together with companies. In doing so, I connect AI models, classic automation, existing systems, and human decisions into a single end-to-end workflow.',
        'The engagement can start with a focused prototype, a production-ready first release, or the development of a custom AI system.',
      ],
    },
    offerings: {
      eyebrow: 'Offerings',
      headline: 'Three ways to start',
      items: [
        {
          name: 'AI Prototype',
          tagline: 'Test a concrete idea in practice',
          description: [
            'An AI prototype tests one central assumption with an executable workflow and realistic data.',
            'In a joint workshop we narrow down the use case, define the intended outcome, and identify the decisive technical and domain uncertainties. Immediately afterwards, I build a first working slice of the process.',
          ],
          scopeLabel: 'Typical scope',
          scope: [
            'Workshop to define the process and goals',
            'Selection of a clearly bounded use case',
            'Development of an executable process segment',
            'Integration of a suitable AI component',
            'Use of real or representative data',
            'Simplified integration of existing systems',
            'Evaluation of quality, cost, and technical limits',
            'Assessment of the next sensible development steps',
          ],
          outcomeLabel: 'Outcome',
          outcomeIntro: 'You receive a working prototype that lets you judge in practice:',
          outcomes: [
            'whether the chosen approach works',
            'what result quality is achievable',
            'which risks and edge cases exist',
            'whether developing a production system is worth it',
          ],
          price: 'From €4,200 net',
          priceNote: 'The exact price depends on the data situation, the integrations involved, and the size of the process segment under test.',
        },
        {
          name: 'AI Product',
          tagline: 'From workflow to a production-ready first release',
          description: [
            'I take a clearly bounded use case to a production-ready first release within four weeks.',
            'The workshop is not an upfront strategy phase. It is the start of the joint development. Once process, scope, and success criteria are defined, technical implementation begins immediately.',
          ],
          scopeLabel: 'Typical scope',
          scope: [
            'Joint kick-off and process workshop',
            'Definition of scope and success criteria',
            'Technical solution design',
            'Development of an end-to-end core process',
            'Integration of the agreed data sources and systems',
            'Combination of AI, rules, and classic automation',
            'Human review and approval steps',
            'A simple working or control interface where required',
            'Data storage and process state',
            'Basic error handling and logging',
            'Tests with realistic cases',
            'Deployment and rollout',
            'Documentation of the delivered system',
          ],
          outcomeLabel: 'Outcome',
          outcomeIntro: 'You receive a production-ready first release for a clearly defined use case. Production-ready means the agreed core process:',
          outcomes: [
            'can be used with real cases',
            'works within the defined usage scenario',
            'is usable and understandable for the people involved',
            'makes relevant errors and edge states visible',
            'can be extended technically',
          ],
          price: 'From €10,990 net',
          priceNote: 'Delivery within four weeks requires that the use case is sufficiently bounded, the necessary data and access are available, and decisions can be made quickly during development.',
        },
        {
          name: 'Custom AI System',
          tagline: 'Developing more complex processes, products, and platforms',
          description: [
            'Some initiatives cannot reasonably be reduced to a single process or a compact first release.',
            'I develop custom AI systems for initiatives with multiple processes, integrations, user groups, or elevated technical and organizational requirements.',
          ],
          scopeLabel: 'Possible components',
          scope: [
            'Multiple interconnected business processes',
            'Different roles and permissions',
            'Custom working and control interfaces',
            'Integration of internal and external systems',
            'Data storage and more complex process states',
            'AI agents and automated tasks',
            'Human decisions and approvals',
            'Monitoring, quality assurance, and cost control',
            'Security and compliance requirements',
            'APIs and interfaces for further systems or agents',
            'Custom hosting and operating models',
          ],
          outcomeLabel: 'Outcome',
          outcomeIntro: 'The result is a software system tailored to its specific purpose, bringing together processes, data, AI, automation, and human work.',
          price: 'Priced individually by scope',
        },
      ],
    },
    example: {
      eyebrow: 'Example',
      headline: 'Job Directory',
      intro: 'Job Directory is an AI-powered process product I built for structured job searching and application preparation. The system connects several components into one continuous human-AI process:',
      components: [
        'Automated capture of job postings',
        'AI-based scoring and prioritization',
        'Regular briefings',
        'Human selection of relevant postings',
        'Tracking of further processing status',
        'Preparation of personalized application documents',
        'Feedback loops that improve future scoring',
        'A dashboard for transparency and control',
        'Interfaces via REST, OpenAPI, and MCP',
      ],
      body: [
        'Humans stay responsible for the decisions that matter. The AI takes over research, preparation, scoring, and groundwork.',
        'The case shows how a recurring, information-heavy workflow can become a standalone product with automation, data storage, a user interface, and human control points.',
      ],
      linkLabel: 'View Job Directory',
      linkHref: 'https://www.job-directory.eu/',
    },
    useCases: {
      eyebrow: 'Use Cases',
      headline: 'Typical applications',
      intro: 'The offerings are a good fit for work such as:',
      items: [
        'Evaluating incoming email and transferring the relevant data',
        'Capturing and structuring documents and PDFs',
        'Qualifying customer or sales inquiries',
        'Researching and assessing information from multiple sources',
        'Preparing quotes, reports, or documents',
        'Reducing manual data transfer between systems',
        'Supporting decisions with well-prepared information',
        'Making the status of automated processes visible to the team',
        'Extending existing automation tools with custom functionality',
      ],
      closing: 'Not every process needs AI. Where rules, classic software, or existing automation tools are the better solution, that is what gets used.',
    },
    process: {
      eyebrow: 'Process',
      headline: 'How the collaboration starts',
      steps: [
        {
          title: 'Discuss the initiative',
          description: 'In a first conversation we clarify the current process, the intended outcome, and the key constraints.',
        },
        {
          title: 'Choose the offering',
          description: 'Based on size and uncertainty, we classify the initiative as an AI prototype, an AI product, or a custom AI system.',
        },
        {
          title: 'Define the scope',
          description: 'Before the engagement starts, we define the concrete deliverables, necessary integrations, success criteria, and your part in the work.',
        },
        {
          title: 'Develop right away',
          description: 'Workshop and implementation are tightly linked. Insights from development feed directly into the next step.',
        },
        {
          title: 'Test and ship',
          description: 'The system is tested with realistic cases, documented, and made available for the agreed use.',
        },
      ],
    },
    evolution: {
      eyebrow: 'Afterwards',
      headline: 'Further development and operations',
      intro: 'After the first release, the product can be extended and improved in further development iterations. Possible next steps include:',
      items: [
        'Additional process steps and use cases',
        'Further integrations',
        'Improved result quality',
        'Additional roles and approval stages',
        'More extensive user interfaces',
        'Monitoring and quality measurement',
        'Cost optimization',
        'Switching models or providers',
        'Maintenance and technical operations support',
      ],
      closing: 'Every further iteration gets its own scope and a defined outcome.',
    },
    cta: {
      headline: 'Discuss a concrete initiative',
      body: 'You have a manual, information-heavy, or recurring process where AI could make a practical difference? Briefly describe:',
      bullets: [
        'how the process runs today',
        'which systems and data are involved',
        'where time is currently lost',
        'what outcome you want to reach',
      ],
      closing: 'We can then determine whether a prototype, a production-ready first release, or a custom system development is the most sensible way to start.',
      button: 'Discuss your initiative',
    },
    contact: {
      headline: 'Discuss a concrete initiative',
      intro: 'Describe your process in a few sentences. I will get back to you within one business day with a candid view on the most sensible way to start.',
    },
  },
```

- [ ] **Step 3: Add German content to `de-de.ts`**

Insert as a new top-level key after the `technicalProjectManagement` block:

```ts
  aiProcessAutomation: {
    meta: {
      title: 'KI-gestützte Produkte & Prozesse — Sebastian Heitmann',
      description: 'Ich entwickle gemeinsam mit Unternehmen KI-gestützte Prozesse und Softwareprodukte: Prototypen, produktive erste Releases und individuelle KI-Systeme, die KI, Automatisierung, bestehende Systeme und menschliche Entscheidungen verbinden.',
    },
    hero: {
      eyebrow: 'KI-Produkte & Prozesse',
      headline: 'KI-gestützte Produkte und Prozesse entwickeln',
      subline: 'KI schafft erst dann einen belastbaren Nutzen, wenn sie in einen funktionierenden Prozess eingebunden ist.',
      cta: 'Vorhaben besprechen',
    },
    approach: {
      eyebrow: 'Ansatz',
      headline: 'Ein durchgängiger Arbeitsablauf statt eines isolierten Modells',
      body: [
        'Ich entwickle gemeinsam mit Unternehmen KI-gestützte Prozesse und Softwareprodukte. Dabei verbinde ich KI-Modelle, klassische Automatisierung, bestehende Systeme und menschliche Entscheidungen zu einem durchgängigen Arbeitsablauf.',
        'Der Einstieg kann über einen begrenzten Prototyp, einen produktiven ersten Release oder die Entwicklung eines individuellen KI-Systems erfolgen.',
      ],
    },
    offerings: {
      eyebrow: 'Angebote',
      headline: 'Drei Wege zum Einstieg',
      items: [
        {
          name: 'KI-Prototyp',
          tagline: 'Eine konkrete Idee praktisch überprüfen',
          description: [
            'Ein KI-Prototyp überprüft eine zentrale Annahme anhand eines ausführbaren Ablaufs und realistischer Daten.',
            'In einem gemeinsamen Workshop grenzen wir den Anwendungsfall ein, definieren das gewünschte Ergebnis und identifizieren die entscheidenden technischen und fachlichen Unsicherheiten. Direkt anschließend entwickle ich einen ersten funktionierenden Ausschnitt des Prozesses.',
          ],
          scopeLabel: 'Typischer Leistungsumfang',
          scope: [
            'Workshop zur Prozess- und Zieldefinition',
            'Auswahl eines klar abgegrenzten Anwendungsfalls',
            'Entwicklung eines ausführbaren Prozessabschnitts',
            'Einbindung einer passenden KI-Komponente',
            'Nutzung realer oder repräsentativer Daten',
            'Vereinfachte Integration bestehender Systeme',
            'Auswertung von Qualität, Kosten und technischen Grenzen',
            'Einordnung der nächsten sinnvollen Entwicklungsschritte',
          ],
          outcomeLabel: 'Ergebnis',
          outcomeIntro: 'Sie erhalten einen funktionsfähigen Prototyp, mit dem sich praktisch beurteilen lässt:',
          outcomes: [
            'ob der gewählte Ansatz funktioniert',
            'welche Ergebnisqualität erreichbar ist',
            'welche Risiken und Ausnahmefälle bestehen',
            'ob sich die Entwicklung eines produktiven Systems lohnt',
          ],
          price: 'ab 4.200 € netto',
          priceNote: 'Der konkrete Preis richtet sich nach Datenlage, Integrationen und Umfang des zu überprüfenden Prozessabschnitts.',
        },
        {
          name: 'KI-Produkt',
          tagline: 'Vom Arbeitsablauf zum produktiven ersten Release',
          description: [
            'Ich entwickle einen klar abgegrenzten Anwendungsfall innerhalb von vier Wochen zu einem produktiv nutzbaren ersten Release.',
            'Der Workshop ist dabei keine vorgelagerte Strategiephase. Er bildet den Beginn der gemeinsamen Entwicklung. Nach der Definition von Prozess, Scope und Erfolgskriterien beginnt unmittelbar die technische Umsetzung.',
          ],
          scopeLabel: 'Typischer Leistungsumfang',
          scope: [
            'Gemeinsamer Kick-off- und Prozessworkshop',
            'Definition des Scopes und der Erfolgskriterien',
            'Technisches Lösungsdesign',
            'Entwicklung eines durchgängigen Kernprozesses',
            'Integration der vereinbarten Datenquellen und Systeme',
            'Kombination aus KI, Regeln und klassischer Automatisierung',
            'Einbindung menschlicher Prüf- und Freigabeschritte',
            'Einfache Arbeits- oder Kontrolloberfläche, sofern erforderlich',
            'Datenhaltung und Prozessstatus',
            'Grundlegende Fehlerbehandlung und Protokollierung',
            'Tests mit realistischen Vorgängen',
            'Deployment und Einführung',
            'Dokumentation des entwickelten Systems',
          ],
          outcomeLabel: 'Ergebnis',
          outcomeIntro: 'Sie erhalten einen produktiv nutzbaren ersten Release für einen klar definierten Anwendungsfall. Produktreife bedeutet in diesem Zusammenhang, dass der vereinbarte Kernprozess:',
          outcomes: [
            'mit realen Vorgängen eingesetzt werden kann',
            'innerhalb des definierten Nutzungsszenarios funktioniert',
            'für die beteiligten Mitarbeitenden bedienbar und nachvollziehbar ist',
            'relevante Fehler- und Ausnahmezustände sichtbar macht',
            'technisch weiterentwickelt werden kann',
          ],
          price: 'ab 10.990 € netto',
          priceNote: 'Die Umsetzung innerhalb von vier Wochen setzt voraus, dass der Anwendungsfall ausreichend klar begrenzt ist, notwendige Daten und Zugänge verfügbar sind und Entscheidungen während der Entwicklung kurzfristig getroffen werden können.',
        },
        {
          name: 'Individuelles KI-System',
          tagline: 'Komplexere Prozesse, Produkte und Plattformen entwickeln',
          description: [
            'Manche Vorhaben lassen sich nicht sinnvoll auf einen einzelnen Prozess oder einen kompakten ersten Release begrenzen.',
            'Ich entwickle individuelle KI-Systeme für Vorhaben mit mehreren Prozessen, Integrationen, Nutzergruppen oder erhöhten technischen und organisatorischen Anforderungen.',
          ],
          scopeLabel: 'Mögliche Bestandteile',
          scope: [
            'Mehrere miteinander verbundene Geschäftsprozesse',
            'Unterschiedliche Rollen und Berechtigungen',
            'Individuelle Bedien- und Kontrolloberflächen',
            'Integration interner und externer Systeme',
            'Datenhaltung und komplexere Prozesszustände',
            'KI-Agenten und automatisierte Aufgaben',
            'Menschliche Entscheidungen und Freigaben',
            'Monitoring, Qualitätssicherung und Kostenkontrolle',
            'Sicherheits- und Compliance-Anforderungen',
            'APIs und Schnittstellen für weitere Systeme oder Agenten',
            'Individuelle Hosting- und Betriebsmodelle',
          ],
          outcomeLabel: 'Ergebnis',
          outcomeIntro: 'Es entsteht ein auf den konkreten Einsatzzweck zugeschnittenes Softwaresystem, das Prozesse, Daten, KI, Automatisierung und menschliche Arbeit zusammenführt.',
          price: 'Preis individuell nach Scope',
        },
      ],
    },
    example: {
      eyebrow: 'Beispiel',
      headline: 'Job Directory',
      intro: 'Job Directory ist ein von mir entwickeltes KI-gestütztes Prozessprodukt für die strukturierte Jobsuche und Vorbereitung von Bewerbungen. Das System verbindet mehrere Bestandteile zu einem durchgängigen Mensch-KI-Prozess:',
      components: [
        'Automatisierte Erfassung von Stellenangeboten',
        'KI-gestützte Bewertung und Priorisierung',
        'Erstellung regelmäßiger Briefings',
        'Menschliche Auswahl relevanter Stellen',
        'Verwaltung des weiteren Bearbeitungsstatus',
        'Vorbereitung personalisierter Bewerbungsunterlagen',
        'Rückmeldungen zur Verbesserung zukünftiger Bewertungen',
        'Dashboard für Transparenz und Steuerung',
        'Schnittstellen über REST, OpenAPI und MCP',
      ],
      body: [
        'Der Mensch bleibt für relevante Entscheidungen verantwortlich. Die KI übernimmt Recherche, Aufbereitung, Bewertung und vorbereitende Arbeit.',
        'Der Case zeigt, wie aus einem wiederkehrenden, informationsintensiven Arbeitsablauf ein eigenständiges Produkt mit Automation, Datenhaltung, Benutzeroberfläche und menschlichen Kontrollpunkten entstehen kann.',
      ],
      linkLabel: 'Job Directory ansehen',
      linkHref: 'https://www.job-directory.eu/',
    },
    useCases: {
      eyebrow: 'Anwendungsfälle',
      headline: 'Typische Anwendungsfälle',
      intro: 'Die Angebote sind beispielsweise geeignet für:',
      items: [
        'Eingehende E-Mails auswerten und relevante Daten übertragen',
        'Dokumente und PDFs erfassen und strukturieren',
        'Kunden- oder Vertriebsanfragen qualifizieren',
        'Informationen aus mehreren Quellen recherchieren und bewerten',
        'Angebote, Berichte oder Dokumente vorbereiten',
        'Manuelle Datenübertragungen zwischen Systemen reduzieren',
        'Entscheidungen mit aufbereiteten Informationen unterstützen',
        'Den Status automatisierter Prozesse für Mitarbeitende sichtbar machen',
        'Bestehende Automationstools um individuelle Funktionen ergänzen',
      ],
      closing: 'Nicht jeder Prozess benötigt KI. Wo Regeln, klassische Software oder bestehende Automationstools die bessere Lösung darstellen, werden diese entsprechend eingesetzt.',
    },
    process: {
      eyebrow: 'Ablauf',
      headline: 'So beginnt die Zusammenarbeit',
      steps: [
        {
          title: 'Vorhaben besprechen',
          description: 'In einem ersten Gespräch klären wir den aktuellen Prozess, das gewünschte Ergebnis und die wichtigsten Rahmenbedingungen.',
        },
        {
          title: 'Angebot auswählen',
          description: 'Anhand von Umfang und Unsicherheit ordnen wir das Vorhaben als KI-Prototyp, KI-Produkt oder individuelles KI-System ein.',
        },
        {
          title: 'Scope festlegen',
          description: 'Vor der Beauftragung werden der konkrete Lieferumfang, notwendige Integrationen, Erfolgskriterien und Mitwirkungspflichten definiert.',
        },
        {
          title: 'Direkt entwickeln',
          description: 'Workshop und Umsetzung sind eng miteinander verbunden. Erkenntnisse aus der Entwicklung fließen unmittelbar in den nächsten Arbeitsschritt ein.',
        },
        {
          title: 'Testen und bereitstellen',
          description: 'Das entwickelte System wird mit realistischen Vorgängen geprüft, dokumentiert und für den vereinbarten Einsatz bereitgestellt.',
        },
      ],
    },
    evolution: {
      eyebrow: 'Danach',
      headline: 'Weiterentwicklung und Betrieb',
      intro: 'Nach dem ersten Release kann das Produkt in weiteren Entwicklungsiterationen erweitert und verbessert werden. Mögliche nächste Schritte sind:',
      items: [
        'Zusätzliche Prozessschritte und Anwendungsfälle',
        'Weitere Integrationen',
        'Verbesserte Ergebnisqualität',
        'Zusätzliche Rollen und Freigabestufen',
        'Umfangreichere Bedienoberflächen',
        'Monitoring und Qualitätsmessung',
        'Kostenoptimierung',
        'Modell- oder Anbieterwechsel',
        'Wartung und technische Betriebsbegleitung',
      ],
      closing: 'Jede weitere Iteration erhält einen eigenen Scope und ein definiertes Ergebnis.',
    },
    cta: {
      headline: 'Ein konkretes Vorhaben besprechen',
      body: 'Sie haben einen manuellen, informationsintensiven oder wiederkehrenden Prozess, bei dem KI einen praktischen Beitrag leisten könnte? Beschreiben Sie mir kurz:',
      bullets: [
        'wie der Prozess heute abläuft',
        'welche Systeme und Daten beteiligt sind',
        'wo aktuell Zeit verloren geht',
        'welches Ergebnis Sie erreichen möchten',
      ],
      closing: 'Anschließend können wir einordnen, ob ein Prototyp, ein produktiver erster Release oder eine individuelle Systementwicklung der sinnvollste Einstieg ist.',
      button: 'Vorhaben besprechen',
    },
    contact: {
      headline: 'Ein konkretes Vorhaben besprechen',
      intro: 'Beschreiben Sie Ihren Prozess in wenigen Sätzen. Ich melde mich innerhalb eines Werktags mit einer ehrlichen Einschätzung zum sinnvollsten Einstieg.',
    },
  },
```

- [ ] **Step 4: Verify the content typechecks**

Run: `cd apps/website && bunx tsc --noEmit -p . 2>/dev/null || bunx astro build` (fall back per Global Constraints if varlock blocks; a successful build is sufficient since both locale files are typed `const … : Strings`).

Simplest reliable check: `cd apps/website && bunx astro build` completes without errors.

- [ ] **Step 5: Commit**

```bash
git add apps/website/src/i18n/types.ts apps/website/src/i18n/en-us.ts apps/website/src/i18n/de-de.ts
git commit -m "feat(i18n): add AI process automation page strings"
```

---

### Task 2: Content component

**Files:**
- Create: `apps/website/src/components/ai-process-automation-content.astro`

**Interfaces:**
- Consumes: `Strings['aiProcessAutomation']` from Task 1.
- Produces: `<AiProcessAutomationContent content={s.aiProcessAutomation} />` (no locale prop needed; all links are `#contact` or external).

- [ ] **Step 1: Write the component**

Full file content:

```astro
---
import type { Strings } from '../i18n/types';

type Props = {
    content: Strings['aiProcessAutomation'];
};

const { content } = Astro.props;
const contactUrl = '#contact';
---

<!-- 1. Hero -->
<section class="ap-hero reveal">
    <div class="ap-hero__content">
        <span class="ap-eyebrow">{content.hero.eyebrow}</span>
        <h1 class="ap-hero__headline">{content.hero.headline}</h1>
        <p class="ap-hero__subline">{content.hero.subline}</p>
        <a class="ap-cta-link" href={contactUrl}>
            <span class="ap-cta-link__text">{content.hero.cta}</span>
            <span class="ap-cta-link__arrow">&rarr;</span>
        </a>
    </div>
</section>

<!-- 2. Approach -->
<section class="ap-section reveal">
    <div class="ap-header">
        <span class="ap-eyebrow">{content.approach.eyebrow}</span>
        <div class="ap-rule"></div>
    </div>
    <h2 class="ap-headline">{content.approach.headline}</h2>
    <div class="ap-body">
        {content.approach.body.map(p => (
            <p>{p}</p>
        ))}
    </div>
</section>

<!-- 3. Offerings -->
<section class="ap-section reveal">
    <div class="ap-header">
        <span class="ap-eyebrow">{content.offerings.eyebrow}</span>
        <div class="ap-rule"></div>
    </div>
    <h2 class="ap-headline">{content.offerings.headline}</h2>
    <div class="ap-offerings">
        {content.offerings.items.map((o, i) => (
            <article class="ap-offering">
                <div class="ap-offering__head">
                    <span class="ap-offering__num">{String(i + 1).padStart(2, '0')}</span>
                    <div class="ap-offering__title-group">
                        <h3 class="ap-offering__name">{o.name}</h3>
                        <p class="ap-offering__tagline">{o.tagline}</p>
                    </div>
                    <span class="ap-offering__price">{o.price}</span>
                </div>
                <div class="ap-offering__desc">
                    {o.description.map(p => (
                        <p>{p}</p>
                    ))}
                </div>
                <div class="ap-split">
                    <div class="ap-split__col">
                        <h4 class="ap-split__label">{o.scopeLabel}</h4>
                        <ul class="ap-split__list">
                            {o.scope.map(item => (
                                <li class="ap-split__item">{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div class="ap-split__col">
                        <h4 class="ap-split__label">{o.outcomeLabel}</h4>
                        <p class="ap-offering__outcome-intro">{o.outcomeIntro}</p>
                        {o.outcomes && (
                            <ul class="ap-split__list">
                                {o.outcomes.map(item => (
                                    <li class="ap-split__item">{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {o.priceNote && <p class="ap-offering__price-note">{o.priceNote}</p>}
            </article>
        ))}
    </div>
</section>

<!-- 4. Example: Job Directory -->
<section class="ap-section reveal">
    <div class="ap-header">
        <span class="ap-eyebrow">{content.example.eyebrow}</span>
        <div class="ap-rule"></div>
    </div>
    <h2 class="ap-headline">{content.example.headline}</h2>
    <p class="ap-lead">{content.example.intro}</p>
    <ul class="ap-tags">
        {content.example.components.map(item => (
            <li class="ap-tags__item">{item}</li>
        ))}
    </ul>
    <div class="ap-body">
        {content.example.body.map(p => (
            <p>{p}</p>
        ))}
    </div>
    <a class="ap-cta-link" href={content.example.linkHref} target="_blank" rel="noopener noreferrer">
        <span class="ap-cta-link__text">{content.example.linkLabel}</span>
        <span class="ap-cta-link__arrow">&rarr;</span>
    </a>
</section>

<!-- 5. Use cases -->
<section class="ap-section reveal">
    <div class="ap-header">
        <span class="ap-eyebrow">{content.useCases.eyebrow}</span>
        <div class="ap-rule"></div>
    </div>
    <h2 class="ap-headline">{content.useCases.headline}</h2>
    <p class="ap-lead">{content.useCases.intro}</p>
    <ul class="ap-list">
        {content.useCases.items.map((item, i) => (
            <li class="ap-list__item" style={`transition-delay: ${i * 0.06}s`}>{item}</li>
        ))}
    </ul>
    <p class="ap-body__closing">{content.useCases.closing}</p>
</section>

<!-- 6. Process steps -->
<section class="ap-section reveal">
    <div class="ap-header">
        <span class="ap-eyebrow">{content.process.eyebrow}</span>
        <div class="ap-rule"></div>
    </div>
    <h2 class="ap-headline">{content.process.headline}</h2>
    <ol class="ap-steps">
        {content.process.steps.map((step, i) => (
            <li class="ap-step">
                <span class="ap-step__num">{String(i + 1).padStart(2, '0')}</span>
                <div class="ap-step__content">
                    <h3 class="ap-step__title">{step.title}</h3>
                    <p class="ap-step__desc">{step.description}</p>
                </div>
            </li>
        ))}
    </ol>
</section>

<!-- 7. Evolution -->
<section class="ap-section reveal">
    <div class="ap-header">
        <span class="ap-eyebrow">{content.evolution.eyebrow}</span>
        <div class="ap-rule"></div>
    </div>
    <h2 class="ap-headline">{content.evolution.headline}</h2>
    <p class="ap-lead">{content.evolution.intro}</p>
    <ul class="ap-tags">
        {content.evolution.items.map(item => (
            <li class="ap-tags__item">{item}</li>
        ))}
    </ul>
    <p class="ap-body__closing">{content.evolution.closing}</p>
</section>

<!-- 8. CTA bridge -->
<section class="ap-section ap-cta reveal">
    <div class="ap-cta__inner">
        <h2 class="ap-headline">{content.cta.headline}</h2>
        <p class="ap-lead">{content.cta.body}</p>
        <ul class="ap-list ap-list--compact">
            {content.cta.bullets.map(item => (
                <li class="ap-list__item">{item}</li>
            ))}
        </ul>
        <p class="ap-body__closing">{content.cta.closing}</p>
        <a class="ap-cta-link" href={contactUrl}>
            <span class="ap-cta-link__text">{content.cta.button}</span>
            <span class="ap-cta-link__arrow">&rarr;</span>
        </a>
    </div>
</section>

<style lang="scss">
    /* ------------------------------------------------
       Shared atoms
       ------------------------------------------------ */
    .ap-eyebrow {
        font-family: var(--v8-font-mono);
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--v8-text-muted);
        flex-shrink: 0;
    }

    .ap-header {
        display: flex;
        align-items: center;
        gap: 24px;
        padding-bottom: 32px;
    }

    .ap-rule {
        flex: 1;
        height: 1px;
        background: var(--v8-border);
    }

    .ap-headline {
        font-family: var(--v8-font-display);
        font-size: clamp(32px, 4vw, 48px);
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.01em;
        color: var(--v8-text);
        margin: 0 0 32px;
    }

    .ap-lead {
        font-family: var(--v8-font-body);
        font-size: 20px;
        font-weight: 300;
        line-height: 1.65;
        color: var(--v8-text-secondary);
        max-width: 640px;
        margin: 0 0 32px;
    }

    .ap-body {
        max-width: 640px;

        p {
            font-family: var(--v8-font-body);
            font-size: 17px;
            font-weight: 300;
            line-height: 1.65;
            color: var(--v8-text-secondary);
            margin: 0 0 20px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .ap-body__closing {
        font-family: var(--v8-font-body);
        font-size: 17px;
        font-weight: 300;
        line-height: 1.65;
        color: var(--v8-text-secondary);
        max-width: 640px;
        margin: 40px 0 0;
    }

    .ap-cta-link {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        padding: 16px 0;
        border-bottom: 1px solid var(--v8-accent);
        align-self: flex-start;
        margin-top: 32px;
        transition: gap 0.3s cubic-bezier(0.22, 1, 0.36, 1);

        &:hover {
            gap: 20px;
        }

        &__text {
            font-family: var(--v8-font-mono);
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--v8-text);
        }

        &__arrow {
            font-size: 16px;
            color: var(--v8-accent);
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        &:hover &__arrow {
            transform: translateX(4px);
        }
    }

    /* ------------------------------------------------
       Shared section wrapper
       ------------------------------------------------ */
    .ap-section {
        max-width: 1440px;
        margin: 0 auto;
        padding: 80px 80px;
    }

    /* ------------------------------------------------
       1. Hero
       ------------------------------------------------ */
    .ap-hero {
        width: 100%;
        padding: 160px 80px 80px;
        display: flex;
        flex-direction: column;
        gap: 24px;

        &__content {
            max-width: 1440px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .ap-eyebrow {
            margin-bottom: 8px;
        }

        &__headline {
            font-family: var(--v8-font-display);
            font-size: clamp(40px, 6vw, 72px);
            font-weight: 400;
            font-style: italic;
            line-height: 1.05;
            letter-spacing: -0.02em;
            color: var(--v8-text);
            margin: 0;
        }

        &__subline {
            font-family: var(--v8-font-body);
            font-size: 20px;
            font-weight: 300;
            line-height: 1.65;
            color: var(--v8-text-secondary);
            max-width: 640px;
            margin: 0;
        }
    }

    /* ------------------------------------------------
       3. Offerings
       ------------------------------------------------ */
    .ap-offerings {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .ap-offering {
        background: var(--v8-glass-bg);
        backdrop-filter: blur(12px) saturate(1.4);
        -webkit-backdrop-filter: blur(12px) saturate(1.4);
        border: 1px solid var(--v8-glass-border);
        box-shadow:
            0 1px 0 var(--v8-glass-highlight) inset,
            0 24px 60px -36px rgba(0, 0, 0, 0.25);
        padding: 44px 40px;
        transition: border-color 0.2s ease;

        &:hover {
            border-color: var(--v8-text-muted);
        }

        &__head {
            display: flex;
            align-items: baseline;
            gap: 24px;
            margin-bottom: 24px;
        }

        &__num {
            font-family: var(--v8-font-mono);
            font-size: 10px;
            letter-spacing: 0.14em;
            color: var(--v8-accent);
        }

        &__title-group {
            flex: 1;
        }

        &__name {
            font-family: var(--v8-font-display);
            font-style: italic;
            font-size: clamp(26px, 3vw, 36px);
            font-weight: 400;
            line-height: 1.1;
            color: var(--v8-text);
            margin: 0 0 6px;
        }

        &__tagline {
            font-family: var(--v8-font-body);
            font-style: italic;
            font-size: 15px;
            font-weight: 300;
            color: var(--v8-text-muted);
            margin: 0;
        }

        &__price {
            font-family: var(--v8-font-mono);
            font-size: 14px;
            letter-spacing: 0.04em;
            color: var(--v8-accent);
            white-space: nowrap;
        }

        &__desc {
            max-width: 640px;
            margin-bottom: 36px;

            p {
                font-family: var(--v8-font-body);
                font-size: 16px;
                font-weight: 300;
                line-height: 1.65;
                color: var(--v8-text-secondary);
                margin: 0 0 16px;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }

        &__outcome-intro {
            font-family: var(--v8-font-body);
            font-size: 15px;
            font-weight: 300;
            line-height: 1.6;
            color: var(--v8-text-secondary);
            margin: 0 0 16px;
        }

        &__price-note {
            font-family: var(--v8-font-body);
            font-style: italic;
            font-size: 14px;
            font-weight: 300;
            line-height: 1.6;
            color: var(--v8-text-muted);
            max-width: 640px;
            margin: 32px 0 0;
        }
    }

    /* ------------------------------------------------
       Split columns (offering scope | outcome)
       ------------------------------------------------ */
    .ap-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 48px;

        &__col {
            display: flex;
            flex-direction: column;
        }

        &__label {
            font-family: var(--v8-font-mono);
            font-size: 10px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--v8-text-muted);
            margin: 0 0 20px;
        }

        &__list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        &__item {
            font-family: var(--v8-font-body);
            font-size: 15px;
            font-weight: 300;
            line-height: 1.6;
            color: var(--v8-text-secondary);
            padding: 12px 0;
            border-bottom: 1px solid var(--v8-border);

            &:first-child {
                border-top: 1px solid var(--v8-border);
            }
        }
    }

    /* ------------------------------------------------
       4 & 7. Tag grids (example components, evolution)
       ------------------------------------------------ */
    .ap-tags {
        list-style: none;
        padding: 0;
        margin: 0 0 40px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        max-width: 900px;

        &__item {
            font-family: var(--v8-font-mono);
            font-size: 12px;
            letter-spacing: 0.04em;
            color: var(--v8-text-secondary);
            padding: 10px 16px;
            border: 1px solid var(--v8-border);
            transition: color 0.2s ease, border-color 0.2s ease;

            &:hover {
                color: var(--v8-text);
                border-color: var(--v8-text-muted);
            }
        }
    }

    /* ------------------------------------------------
       5. Use case list
       ------------------------------------------------ */
    .ap-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;

        &__item {
            font-family: var(--v8-font-body);
            font-size: 20px;
            font-weight: 300;
            line-height: 1.6;
            color: var(--v8-text-tertiary);
            padding: 24px 0 24px 32px;
            border-bottom: 1px solid var(--v8-border);
            position: relative;
            transition: color 0.3s ease;

            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--v8-accent);
                transition: transform 0.3s ease;
            }

            &:hover {
                color: var(--v8-text);

                &::before {
                    transform: translateY(-50%) scale(1.3);
                }
            }

            &:first-child {
                border-top: 1px solid var(--v8-border);
            }
        }

        &--compact &__item {
            font-size: 17px;
            padding: 16px 0 16px 32px;
        }
    }

    /* ------------------------------------------------
       6. Process steps
       ------------------------------------------------ */
    .ap-steps {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .ap-step {
        display: grid;
        grid-template-columns: 64px 1fr;
        gap: 24px;
        padding: 28px 0;
        border-bottom: 1px solid var(--v8-border);

        &:first-child {
            border-top: 1px solid var(--v8-border);
        }

        &__num {
            font-family: var(--v8-font-mono);
            font-size: 12px;
            letter-spacing: 0.14em;
            color: var(--v8-accent);
            padding-top: 6px;
        }

        &__title {
            font-family: var(--v8-font-display);
            font-style: italic;
            font-size: clamp(20px, 2.2vw, 26px);
            font-weight: 400;
            line-height: 1.2;
            color: var(--v8-text);
            margin: 0 0 8px;
        }

        &__desc {
            font-family: var(--v8-font-body);
            font-size: 16px;
            font-weight: 300;
            line-height: 1.65;
            color: var(--v8-text-secondary);
            max-width: 640px;
            margin: 0;
        }
    }

    /* ------------------------------------------------
       8. CTA bridge
       ------------------------------------------------ */
    .ap-cta {
        padding-bottom: 40px;

        &__inner {
            border: 1px solid var(--v8-border-accent, var(--v8-border));
            padding: 56px 48px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
    }

    /* ------------------------------------------------
       Responsive
       ------------------------------------------------ */
    @media (max-width: 1024px) {
        .ap-section {
            padding: 60px 48px;
        }

        .ap-hero {
            padding: 140px 48px 60px;
        }

        .ap-split {
            gap: 32px;
        }
    }

    @media (max-width: 768px) {
        .ap-section {
            padding: 40px 24px;
        }

        .ap-hero {
            padding: 120px 24px 40px;
        }

        .ap-offering {
            padding: 28px 24px;

            &__head {
                flex-wrap: wrap;
                gap: 12px;
            }

            &__title-group {
                flex-basis: 100%;
                order: 3;
            }

            &__price {
                margin-left: auto;
            }
        }

        .ap-split {
            grid-template-columns: 1fr;
            gap: 40px;
        }

        .ap-step {
            grid-template-columns: 40px 1fr;
            gap: 16px;
        }

        .ap-cta__inner {
            padding: 36px 24px;
        }

        .ap-list__item {
            font-size: 17px;
            padding: 18px 0 18px 28px;
        }
    }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add apps/website/src/components/ai-process-automation-content.astro
git commit -m "feat(website): add AI process automation content component"
```

---

### Task 3: Page shells (both locales)

**Files:**
- Create: `apps/website/src/pages/ai-process-automation.astro`
- Create: `apps/website/src/pages/de-de/ki-prozess-automation.astro`

**Interfaces:**
- Consumes: `AiProcessAutomationContent` component (Task 2), `s.aiProcessAutomation` strings (Task 1).
- Produces: routes `/ai-process-automation` and `/de-de/ki-prozess-automation`.

- [ ] **Step 1: Create the English page**

`apps/website/src/pages/ai-process-automation.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/navigation.astro';
import AiProcessAutomationContent from '../components/ai-process-automation-content.astro';
import ContactSection from '../components/contact-section.astro';
import Footer from '../components/footer.astro';
import { getStrings } from '../i18n/utils';
import type { Locale } from '../i18n/utils';

const locale = Astro.currentLocale as Locale;
const s = getStrings(locale);

const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://www.sebastian-heitmann.dev').replace(/\/$/, '');
const alternates = [
    { hreflang: 'en', href: `${siteUrl}/ai-process-automation` },
    { hreflang: 'de-DE', href: `${siteUrl}/de-de/ki-prozess-automation` },
    { hreflang: 'x-default', href: `${siteUrl}/ai-process-automation` },
];
---
<Layout
    locale={locale}
    title={s.aiProcessAutomation.meta.title}
    description={s.aiProcessAutomation.meta.description}
    alternates={alternates}
>
    <Navigation nav={s.nav} languagePicker={s.languagePicker} />
    <main>
        <AiProcessAutomationContent content={s.aiProcessAutomation} />
        <ContactSection contact={{ ...s.contact, headline: s.aiProcessAutomation.contact.headline, intro: s.aiProcessAutomation.contact.intro }} />
    </main>
    <Footer footer={s.footer} />
</Layout>
```

- [ ] **Step 2: Create the German page**

`apps/website/src/pages/de-de/ki-prozess-automation.astro` — identical except import depth (`../../`):

```astro
---
import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/navigation.astro';
import AiProcessAutomationContent from '../../components/ai-process-automation-content.astro';
import ContactSection from '../../components/contact-section.astro';
import Footer from '../../components/footer.astro';
import { getStrings } from '../../i18n/utils';
import type { Locale } from '../../i18n/utils';

const locale = Astro.currentLocale as Locale;
const s = getStrings(locale);

const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://www.sebastian-heitmann.dev').replace(/\/$/, '');
const alternates = [
    { hreflang: 'en', href: `${siteUrl}/ai-process-automation` },
    { hreflang: 'de-DE', href: `${siteUrl}/de-de/ki-prozess-automation` },
    { hreflang: 'x-default', href: `${siteUrl}/ai-process-automation` },
];
---
<Layout
    locale={locale}
    title={s.aiProcessAutomation.meta.title}
    description={s.aiProcessAutomation.meta.description}
    alternates={alternates}
>
    <Navigation nav={s.nav} languagePicker={s.languagePicker} />
    <main>
        <AiProcessAutomationContent content={s.aiProcessAutomation} />
        <ContactSection contact={{ ...s.contact, headline: s.aiProcessAutomation.contact.headline, intro: s.aiProcessAutomation.contact.intro }} />
    </main>
    <Footer footer={s.footer} />
</Layout>
```

- [ ] **Step 3: Build and verify both routes emit**

Run: `cd apps/website && bunx astro build` (or `bun run build` if varlock works)
Expected: build succeeds; `dist/ai-process-automation/index.html` and `dist/de-de/ki-prozess-automation/index.html` exist.

```bash
ls dist/ai-process-automation/index.html dist/de-de/ki-prozess-automation/index.html
```

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/pages/ai-process-automation.astro apps/website/src/pages/de-de/ki-prozess-automation.astro
git commit -m "feat(website): add AI process automation pages for both locales"
```

---

### Task 4: Navigation locale route map

**Files:**
- Modify: `apps/website/src/components/navigation.astro:21-26` (the `routeMap` object)

**Interfaces:**
- Consumes: nothing new.
- Produces: language picker switches correctly between `/ai-process-automation` and `/de-de/ki-prozess-automation`.

- [ ] **Step 1: Add both slugs to `routeMap`**

```ts
const routeMap: Record<string, Record<string, string>> = {
    '/web-entwicklung': { 'en-us': '/web-development', 'de-de': '/web-entwicklung' },
    '/web-development': { 'en-us': '/web-development', 'de-de': '/web-entwicklung' },
    '/technical-project-management': { 'en-us': '/technical-project-management', 'de-de': '/technisches-projektmanagement' },
    '/technisches-projektmanagement': { 'en-us': '/technical-project-management', 'de-de': '/technisches-projektmanagement' },
    '/ai-process-automation': { 'en-us': '/ai-process-automation', 'de-de': '/ki-prozess-automation' },
    '/ki-prozess-automation': { 'en-us': '/ai-process-automation', 'de-de': '/ki-prozess-automation' },
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/website/src/components/navigation.astro
git commit -m "feat(website): map AI process automation slugs in language picker"
```

---

### Task 5: Second link on the Deliver — Per Cycle card

**Files:**
- Modify: `apps/website/src/components/proof-section.astro` (Props type, destructuring, featured-card markup)
- Modify: `apps/website/src/pages/index.astro:42`
- Modify: `apps/website/src/pages/de-de/index.astro:49`

**Interfaces:**
- Consumes: existing `webDevLink`/`tpmLink` prop pattern.
- Produces: optional prop `aiLink?: { label: string; href: string }` rendered above the web-dev link on the featured card.

- [ ] **Step 1: Extend `proof-section.astro` Props**

Change the Props type and destructuring (lines 6-13):

```ts
type Props = {
    proof: Strings['proof'];
    locale?: Locale;
    webDevLink?: { label: string; href: string };
    tpmLink?: { label: string; href: string };
    aiLink?: { label: string; href: string };
};

const { proof, locale, webDevLink, tpmLink, aiLink } = Astro.props;
```

- [ ] **Step 2: Render the second link on the featured card**

In the engagements map, replace the existing featured-link block:

```astro
{e.featured && aiLink && (
    <a class="engagement-link" href={aiLink.href}>
        <span>{aiLink.label}</span>
        <span class="engagement-link__arrow">&rarr;</span>
    </a>
)}
{e.featured && webDevLink && (
    <a class="engagement-link" href={webDevLink.href}>
        <span>{webDevLink.label}</span>
        <span class="engagement-link__arrow">&rarr;</span>
    </a>
)}
```

Note: with two stacked `.engagement-link`s, only the first should carry the `margin-top: auto` push. Add a style tweak so consecutive links don't double the top border spacing oddly — append to the `.engagement` styles:

```scss
&-link + &-link {
    margin-top: 0;
    padding-top: 12px;
    border-top: none;
}
```

(The first link keeps `margin-top: auto; padding-top: 16px; border-top: 1px solid var(--v8-border);` from the existing rule.)

- [ ] **Step 3: Pass `aiLink` from both homepages**

`apps/website/src/pages/index.astro` line 42:

```astro
<ProofSection proof={s.proof} aiLink={{ label: 'AI-powered products & processes', href: '/ai-process-automation' }} webDevLink={{ label: 'Web development for local businesses', href: '/web-development' }} tpmLink={{ label: 'Technical project management', href: '/technical-project-management' }} />
```

`apps/website/src/pages/de-de/index.astro` line 49:

```astro
<ProofSection proof={s.proof} aiLink={{ label: 'KI-gestützte Produkte & Prozesse', href: '/de-de/ki-prozess-automation' }} webDevLink={{ label: 'Webentwicklung für lokale Unternehmen', href: '/de-de/web-entwicklung' }} tpmLink={{ label: 'Technisches Projektmanagement', href: '/de-de/technisches-projektmanagement' }} />
```

- [ ] **Step 4: Build**

Run: `cd apps/website && bunx astro build`
Expected: success; `dist/index.html` contains `href="/ai-process-automation"`, `dist/de-de/index.html` contains `href="/de-de/ki-prozess-automation"`.

```bash
grep -c "ai-process-automation" dist/index.html dist/de-de/index.html
```

- [ ] **Step 5: Commit**

```bash
git add apps/website/src/components/proof-section.astro apps/website/src/pages/index.astro apps/website/src/pages/de-de/index.astro
git commit -m "feat(website): link AI process automation page from Deliver engagement card"
```

---

### Task 6: Visual verification

**Files:** none (verification only; fix defects found, amend relevant commits or add `fix(website): …` commits)

- [ ] **Step 1: Start the dev server**

Run: `cd apps/website && bunx astro dev` (background) — or `bun run dev` if varlock resolves.

- [ ] **Step 2: Screenshot both locales, both themes, three viewports**

Via Chrome DevTools MCP: `/ai-process-automation` and `/de-de/ki-prozess-automation` at 1440px, 768px, and 375px widths, in light and dark theme (toggle via the nav theme switcher or `document.documentElement.className`). Also screenshot both homepages' engagement cards to check the two stacked links.

Checklist per screenshot:
- Hero italic display headline renders, eyebrow above it
- Offering blocks: number, name, tagline, price aligned; scope/outcome split collapses to one column at 768px
- Job Directory tag grid wraps cleanly
- Steps numbers align; CTA bridge box padding correct
- Featured engagement card shows both links without layout breakage
- No horizontal scroll at 375px

- [ ] **Step 3: Fix any defects found and re-screenshot**

- [ ] **Step 4: Final full build**

Run: `cd apps/website && bunx astro build`
Expected: success, no warnings about missing assets.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A apps/website/src
git commit -m "fix(website): visual polish for AI process automation page"
```

(Skip if no fixes were needed.)
