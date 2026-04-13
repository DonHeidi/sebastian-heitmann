---
title: "Softwareentwicklung wird zur Management-Disziplin. Die alten Manager bleiben außen vor."
overline: "Führung"
subline: "Agenten ersetzen nicht die Engineers — sie ersetzen die Koordinationsebene darüber"
abstract: "Agentisches Coding macht Engineers nicht einfach nur schneller. Es legt drei Rollen — Designer, Tech Lead, Projektmanager — auf eine einzige Person, die parallel mehrere Projekte fährt. Der Engpass ist nicht der Durchsatz der Agenten, sondern wie viele tragfähige Entscheidungen ein Mensch am Tag durchhält. Dieser Text zeigt, was wirklich bricht, wer mit der Veränderung davonkommt — und welche Praktiken (Knowledge as Code, eine neue Junior-Rolle, Org-Design rund um Entscheidungskapazität) der neuen Last standhalten."
type: "article"
tags: ["KI-Agenten", "Engineering Leadership", "Org Design", "Knowledge as Code", "KI-übersetzt"]
author: "sebastian-heitmann"
publishedAt: 2026-04-13
authorship: "ai-assisted"
draft: false
---

**Mein härtester Tag in diesem Jahr war kein Tag, an dem ich Code geschrieben habe. Es war ein Tag, an dem ich sechs Stunden lang fünf KI-Agenten parallel orchestriert habe.**

Als ich abends den Laptop zugeklappt habe, war ich erschöpfter als nach jeder Woche, in der ich ein Fünfer-Team geführt habe. Es lag nicht am Code, und es lag auch nicht an den Agenten. Es lag an der schieren Menge an Entscheidungen — irgendwo zwischen fünfzig und hundert — gepresst in ein Zeitfenster, in dem ein klassischer Manager vielleicht eine Handvoll trifft.

**Dieser Tag hat mir etwas gezeigt, das in der Berichterstattung über agentisches Coding fast immer fehlt.**

Agenten ersetzen nicht die Engineers. Sie ersetzen die Schicht *über* den Engineers — Koordination, Übergaben, Projektmanagement, also genau den Teil des Org-Charts, der existiert, um Kommunikationsaufwand zu senken. Und genau diese Schicht bricht gerade weg — die Schicht, die die meisten Führungskräfte instinktiv schützen wollen.

Worum es im Folgenden geht: was in der Software-Branche tatsächlich kippt, wer mit der Veränderung davonkommt — und was du morgen früh anders machen kannst.

## Die versteckten Kosten heißen nicht Geschwindigkeit. Sie heißen Entscheidungen.

Die meisten Diskussionen über KI-Produktivität sind im Kern Diskussionen über Durchsatz. Agenten liefern Features schneller, schreiben Tests schneller, refaktorieren schneller. Der Pitch verkauft sich von selbst.

Nur trifft dieses Framing den Engpass nicht. **Der Engpass ist nicht, wie schnell die Agenten arbeiten. Der Engpass ist, wie viele tragfähige Entscheidungen du an einem Tag durchhältst.**

Wenn ich fünf Agenten parallel laufen lasse, treffe ich pro Agent über eine aktive Session hinweg etwa zehn bis zwanzig Entscheidungen. Hochgerechnet: fünfzig bis hundert aktive Entscheidungen in einem Zeitfenster, in dem ein klassischer Manager vielleicht zehn trifft. Jede einzelne ist klein — diesen Ansatz akzeptieren oder verwerfen, den Scope enger oder weiter ziehen, die Dateistruktur ändern oder so lassen — aber die Summe frisst den Tag. Mit Domain-Driven Design und konsequentem Context-Management lässt sich ein Teil davon abfangen, weil weniger „Phantom-Entscheidungen" entstehen, die ein Agent nur deshalb produziert, weil er Kontext erneut von Grund auf rekonstruiert. Die Last bleibt trotzdem real.

Und hier kommt der Punkt, der für mich alles verschoben hat. In einem Meeting zu sitzen ist *passive kognitive Last*. Du kannst zu sechzig Prozent anwesend sein, das Meeting läuft trotzdem. Agenten zu orchestrieren ist *aktive kognitive Last*. Bei sechzig Prozent Anwesenheit bricht der Output zusammen. Genau deshalb stimmt der Spruch „KI macht dich zehnmal produktiver" so nicht — er rechnet den Durchsatz hoch und ignoriert die Konzentrationssteuer.

Meine persönliche Obergrenze liegt bei rund fünf Stunden Deep Work, danach lässt die Konzentration nach. Nicht „unbrauchbar" — nur degradiert. Schärfere Engineers werden höhere Grenzen haben, und Routinen rund um Batching und Context Pruning werden die Kurve insgesamt anheben. **Aber es gibt eine Decke, und das nächste Kapitel der Produktivitätsgeschichte handelt von dieser Decke, nicht vom Tempo der Agenten.**

Unternehmen, die das ignorieren, werden ihre besten Operator bis Q3 verheizt haben.

## „Agent Fatigue" ist das falsche Framing. Es sind drei Rollen, kollabiert in eine — multipliziert mit jedem Projekt.

Texte über „Agent Fatigue" tauchen gerade überall auf. Die meisten stecken so tief in der Tech-Bubble, dass die Brücke zur eigentlichen Disziplin fehlt.

Was ich beschreibe, ist keine Müdigkeit vom Umgang mit KI. **Es ist ein Prozess, in dem mehrere Entscheider auf eine einzige Person kollabieren — und dann mit jedem parallel laufenden Projekt multipliziert werden.** Design-Entscheidungen lagen früher bei einer Designerin oder einem Senior Engineer. Architektur-Entscheidungen lagen beim Tech Lead. Projekt-Entscheidungen lagen beim Product Manager. Heute landen alle drei Entscheidungsströme auf demselben Schreibtisch, im selben Fenster, gleichzeitig. Und dann multiplizierst du das mit der Anzahl Projekte, die parallel laufen.

Die Werkzeuge sind neu. **Die Arbeit ist es nicht.** Es sind drei Jobs an Entscheidungsarbeit, geleistet von jemandem, der einmal davon gelebt hat, Code zu schreiben — über zwei, drei, manchmal fünf Codebases parallel.

Wenn du dieses Framing annimmst, lautet die Frage nicht mehr „Wie machen wir Agenten weniger anstrengend?", sondern „Wie sieht das Org-Chart aus, wenn ein einzelner Engineer die Arbeit von Designerin, Tech Lead und Projektmanager macht — über mehrere Projekte parallel?"

## Linear killt sein eigenes Produkt. Und Linear hat recht.

Das deutlichste externe Signal kommt von Linear, dem Issue-Tracking-Anbieter. Auf der öffentlichen Roadmap-Seite (linear.app/next) argumentiert Linear, dass **Issue-Tracking als Kategorie zu Ende geht**.

Das sagt kein Außenstehender. Das sagt der Marktführer. Ein Unternehmen, dessen Produkt Issue-Tracking *ist*, erklärt öffentlich, dass diese Kategorie kollabiert.

Warum würden sie das sagen? Weil sie verstanden haben, was Issue-Tracking eigentlich tut. **Issue-Tracking existiert, um Menschen über Übergaben hinweg zu koordinieren.** Ein Ticket ist ein Vertrag zwischen zwei Personen: derjenigen, die die Arbeit beschreibt, und derjenigen, die sie ausführt. Der PM schreibt es. Der Engineer übernimmt. QA bestätigt. Engineering Management trackt den Durchsatz. Jede Spalte deines Kanban-Boards ist eine Übergabe zwischen Rollen.

Nimm die Übergaben weg — weil ein einziger Engineer-Operator Anforderung, Architektur, Implementierung und Validierung besitzt, mit Agenten als Kapazitätsschicht — dann verliert das Ticket seine Funktion. Die Spalte auch. Das Board auch. Und auf Dauer auch die Rolle, die existierte, um beides zu verwalten.

Genau das ist der Effekt zweiter Ordnung, den die „KI ersetzt Engineers"-Berichterstattung übersieht. Die Engineers werden nicht ersetzt. **Die Koordinationsschicht, die früher verhindert hat, dass mehrere Engineers sich gegenseitig im Weg stehen, wird ersetzt.** PMs, Engineering Manager, Scrum Master, Ticket-Triagierer, Status-Update-Generatoren — das ist die Schicht, die strukturell überflüssig wird, sobald eine Person plus Agenten den Loop von Anfang bis Ende besitzt.

Linear kann das so offen sagen, aus demselben Grund, aus dem Block 4.000 Leute entlassen konnte: tech-native Unternehmen sehen die Veränderung zuerst, weil sie strukturell nichts haben, was die alte Schicht schützt.

**Kapazität liefern die Agenten. Menschen sind Teil des Loops — aber nicht mehr die Belegschaft dahinter.**

## Aber die meisten Unternehmen werden das jahrelang nicht sehen. Hier ist, warum.

Der Kollaps läuft nicht überall im gleichen Tempo. Es gibt drei Schichten, und der Unterschied zwischen ihnen ist *Workflow-Trägheit*, nicht technische Fähigkeit.

**Schicht 1 — Tech-native Operator.** Block, Agenturen, Indies, KI-First-Startups. Sie können sich anpassen, weil sie keinen dreißig Jahre alten Workflow haben, der das alte Org-Chart schützt. Dass Block Anfang dieses Jahres viertausend Stellen gestrichen hat, ist der bisher sichtbarste Schnitt am Enterprise-Ende. Im März wurde der Tonwechsel in der Unternehmenskommunikation unübersehbar — Business Insider begann, Layoff-Memos nicht mehr als Sparmaßnahmen, sondern als Strategiepapiere für das KI-Zeitalter zu lesen.

Am anderen Ende des Spektrums lohnt der Blick auf Black Forest Labs — ein kleines, exzellentes Team aus Deutschland, das mit den FLUX-Bildmodellen den gesamten Markt verschoben hat, mit einem Engineering-Footprint, der bei einem klassischen Anbieter kaum für ein einziges Feature-Team reichen würde. KI-First-Unternehmen dieses Formats liefern Software in Produktion in Größenordnungen, für die früher zwanzig- bis dreißigköpfige Teams nötig waren — mit Engineering-Headcounts im einstelligen Bereich. Die Org-Chart-Verschiebung kommt nicht. Sie läuft bereits, in Echtzeit, an der Spitze des Marktes.

**Schicht 2 — Mittelständische Digitalunternehmen.** Etablierte SaaS-Firmen, mittelgroße Produktorganisationen, Digitalagenturen mit zwanzig bis zweihundert Leuten. Sie werden sich bewegen, aber langsamer. Sie stehen mit einem Bein im neuen Modell und mit einem Bein in Prozessen, die sie sich noch nicht trauen abzuschaffen. Erwarte zuerst Einstellungsstopps, dann stille Abgänge in den PM- und EM-Reihen, dann eine unangenehme Reorg-Ankündigung 2027 oder 2028. Vorhersehbarer Rückstand: ein bis drei Jahre hinter den Operatoren.

**Schicht 3 — Regulierte Schwergewichte.** Banken, Automobil, Pharma — überall dort, wo eine Aufsichtsbehörde auf der anderen Seite jeder Produktionsänderung sitzt. **Der Engpass ist nicht die KI-Fähigkeit, sondern der Workflow, in den die KI passen muss.** Neue Audit-Frameworks und Compliance-Werkzeuge müssen erst entstehen, bevor sich das Org-Chart bewegen kann. Jahre entfernt. Vielleicht ein Jahrzehnt.

Diese Karte ist deshalb wichtig, weil die meiste „KI verändert alles"-Berichterstattung sie plattmacht. Die Realität ist gestaffelt — und **genau diese Staffelung ist die strategische Lücke**: für Beratungen, für Einzeloperator und für alle, die den Spalt zwischen Schicht 1 und Schicht 3 bedienen.

## Wir brauchen nicht weniger Juniors. Wir brauchen einen anderen Junior.

Die Schlagzeile „KI tötet Junior-Engineering-Jobs" stimmt zur Hälfte. Die alte Junior-Rolle ist tot. **Eine neue Junior-Rolle muss erst noch entstehen — und niemand hat sie bisher entworfen.**

Die alte Junior-Rolle drehte sich um Durchsatz. Man stellte Juniors ein, damit sie den Code schrieben, für den die Seniors keine Zeit hatten. Sie verdienten sich ihre Sporen mit den unspektakulären Tickets. Ihr Wert skalierte damit, wie schnell sie Code produzieren konnten, der überwiegend funktionierte.

Genau das tun jetzt die Agenten — schneller und billiger. Diese Rolle ist also weg.

Die neue Rolle ist, wenn man sie richtig denkt, deutlich interessanter als die alte. Sie ist keine Einstiegsstufe zur Produktion. **Sie ist eine Einstiegsstufe zur Domänen-Expertise — in der Disziplin Software selbst.**

Die klarste Analogie: So wie Software-Entwickler früher Buchhaltung gelernt haben, um eine bessere Rechnungsstellung zu bauen. Der Entwickler musste kein *Buchhalter* sein. Er musste Buchhaltung tief genug verstehen, um sie zu modellieren, zu hinterfragen und zu beurteilen, ob das gebaute System wirklich abbildet, wie Buchhalter denken.

Das ist der neue Junior. **Programmiersprachen als Domäne, nicht als brauchbares Werkzeug.** Sie lernen Typsysteme, Paradigmen, Architekturmuster, Fehlerklassen — nicht um Code zu produzieren, sondern um zu lesen, was die Agenten geliefert haben, Architekturentscheidungen zu hinterfragen, Teststrategien zu entwerfen, Fehlerbilder zu studieren. Ihr Wert skaliert mit Urteilsvermögen, nicht mit Durchsatz.

*Der Entwickler, der früher Buchhaltung lernte, braucht heute Juniors, die Programmierung so lernen, wie er damals Buchhaltung gelernt hat.* Die Disziplin Software wird zu ihrer eigenen externen Domäne.

Ich bin mir nicht sicher, ob „Junior" überhaupt das richtige Wort ist — es trägt zu viel Durchsatz-Ballast mit sich. Vielleicht Apprentice. Vielleicht Software-Analyst. Vielleicht ein Begriff, den die Branche noch nicht erfunden hat. Aber die Rolle ist real, und die Unternehmen, die zuerst herausfinden, wie man dafür einstellt und ausbildet, werden fünf Jahre Vorsprung vor denen haben, die noch immer „Junior gesucht, der schnell Features liefert" ausschreiben.

## Knowledge as Code ist das neue hochwirksame Repo-Artefakt

**Knowledge as Code (KaC) bedeutet, die Sprache deiner Domäne neben dem Code zu versionieren, damit Menschen und Agenten ein gemeinsames Verständnis davon haben, was Begriffe eigentlich bedeuten.**

Der Mechanismus ist banal: Markdown-Dateien im Repo, die die Bedeutung jedes Begriffs festschreiben, der zählt. Der Agent liest sie zu Beginn jeder Session und hört auf, Begriffe neu zu erfinden, vom Modell abzudriften oder Entscheidungen zu produzieren, die nur deshalb existieren, weil ihm der Name für etwas fehlte. Weniger Phantom-Entscheidungen. Weniger Erschöpfung. Mehr tragfähige Stunden. Es ist der billigste, am stärksten unterschätzte Hebel im gesamten Stack.

Wie das in der Praxis aussieht: In einer Billing-Codebase, mit der ich gearbeitet habe, bedeutete das Wort „Subscription" je nach Gesprächspartner drei verschiedene Dinge — das Stripe-Objekt, unseren internen Vertragsdatensatz und den kundenseitigen Plan. Jede Agent-Session diskutierte aufs Neue, was gemeint war — manchmal mit Code als Ergebnis, der alle drei vermischte. Eine zweiseitige `UBIQUITOUS_LANGUAGE.md`, die festschrieb *Subscription = das Stripe-Objekt; Contract = unser interner Datensatz; Plan = die Marketing-Stufe*, hat eine ganze Klasse von Phantom-Entscheidungen über Nacht eliminiert. Keine besseren Prompts. Kein klügeres Modell. Ein Glossar.

Das verändert auch, was der Engineer-Operator und der neue Junior eigentlich *produzieren*. Das hochwirksame Artefakt ist nicht mehr der API-Endpunkt, sondern das Glossar, das Architecture Decision Record, die explizite Benennung der Domäne. **Es wird wichtiger, ein gutes Glossar zu schreiben, als einen API-Endpunkt zu bauen.** Code ist der billige Teil geworden. Bedeutung ist der teure.

Infrastructure as Code haben wir akzeptiert. Policy as Code haben wir akzeptiert. KaC ist das nächste Mitglied dieser Familie:

- **IaC** — Infrastruktur wird reproduzierbar.
- **CaC** — Konfiguration wird auditierbar.
- **PaC** — Governance wird durchsetzbar.
- **KaC** — Domänenverständnis wird zwischen Menschen und Agenten geteilt — und versioniert wie alles andere.

Wenn du dieses Quartal nichts anderes machst, mach das eine: Nimm dir eine Woche Zeit und schreib das Glossar, das deiner Codebase schon immer gefehlt hat. Leg es als `UBIQUITOUS_LANGUAGE.md` ins Repo. Verlinke es in deinen Agent-Prompts. Und beobachte, wie deine Entscheidungszahlen sinken.

Wenn du Gründer oder Team-Lead in Schicht 1 oder Schicht 2 bist, ist der kluge Schritt nicht, abzuwarten, bis sich der Staub gelegt hat. Der kluge Schritt ist, dein Team jetzt rund um Entscheidungskapazität zu bauen, für Urteilsvermögen statt für Durchsatz einzustellen — und endlich das Knowledge as Code zu schreiben, das dein Repo schon immer gebraucht hat.

**Bedeutung war immer der teure Teil. Bau dein Team darum herum.**
