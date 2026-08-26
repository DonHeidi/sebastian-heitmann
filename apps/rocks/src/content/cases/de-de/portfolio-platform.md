---
title: 'sebastian-heitmann.dev — Website und Cloud-Plattform'
summary: 'Eine zweisprachige Website, deren eigentliches Produkt die Plattform dahinter ist: ein vollständig terraformter Scaleway-Stack mit CDN, Serverless Functions, DNS und Transaktions-E-Mail, von einer frischen Maschine aus mit drei Befehlen wiederherstellbar.'
kind: 'case-study'
role: 'Design, Entwicklung und Betrieb'
stack: ['Astro', 'TypeScript', 'Tailwind v4', 'Bun', 'Terraform', 'Scaleway']
cover: ../../../assets/cover-art-sparks-crew.png
showcase:
  desktop: ../../../assets/portfolio-platform-desktop.png
  tablet: ../../../assets/portfolio-platform-tablet.png
  phone: ../../../assets/portfolio-platform-phone.png
startDate: 2026-05-01
links:
  - label: 'Live-Website'
    url: 'https://www.sebastian-heitmann.dev'
featured: true
draft: false
---

## Der Aufbau

sebastian-heitmann.dev ist das Zuhause meiner Beratungspraxis: eine zweisprachige (Englisch/Deutsch) Website, gebaut mit Astro in einem präzisen Schweizer Designsystem, mit der Startseite, den Leistungen und meinen Texten. An der Oberfläche ist die Seite bewusst zurückhaltend. Die Fallstudie ist alles darunter.

Eine Seite, die technisches Urteilsvermögen bewirbt, sollte eine Prüfung ihres eigenen Fundaments überstehen. Die Vorgabe war deshalb einfach: Jeder Teil der Plattform ist Code, nichts Sensibles liegt je auf der Platte, und eine frische Maschine kommt mit drei Befehlen von `git clone` zu einem laufenden Produktivsystem. Kein Klicken in der Konsole, kein handgepflegter Sonderzustand, kein "das habe ich mal eingerichtet und weiß nicht mehr wie".

## Die Ziele

- **Eine digitale Visitenkarte.** Ein kanonischer, stets aktueller Ort, der sagt, wer ich bin, was ich mache und wie man mich erreicht.
- **Auffindbar über die sozialen Netzwerke hinaus.** Kunden sollen mich über die Suche finden, nicht nur über Feeds. SEO ist ein erstrangiges Ziel, kein Nachgedanke.
- **Unabhängig von sozialen Netzwerken.** Eigene Domain, eigene Inhalte, eigenes Publikum. Kein Algorithmus und keine AGB einer Plattform zwischen mir und den Menschen, mit denen ich arbeite.
- **EU-Souveränität und Datenschutz.** Gehostet bei einem europäischen Anbieter, Daten bleiben in der EU, und eine Seite, die Besucher respektiert, statt sie zu verfolgen.

## Das Ergebnis

Eine Plattform, die sich aus dem Nichts mit drei Befehlen wiederherstellen lässt, mit einem Befehl deployt, im Betrieb praktisch nichts kostet und eine DNS-Migration im laufenden Betrieb ohne eine Minute Mail-Ausfall überstanden hat. Die Website obendrauf ist der uninteressanteste Teil, und genau das ist der Punkt.

Eine Front ist noch offen: SEO. Die technische Arbeit ist erledigt, aber Sichtbarkeit in der Suche lässt sich nicht deployen; sie validiert sich im Takt der Suchmaschinen, über Wochen. Diese Geschichte geht unten weiter.

## Was gebaut wurde

- Eine zweisprachige (Englisch/Deutsch) Website mit Locale-Routing, hreflang-Alternates und einer einmaligen Sprachweiche beim ersten Besuch.
- Ein wachsender Blog: Essays über Software, KI-Einführung und das Führen einer Praxis, veröffentlicht als zweisprachige Content Collection, deutsche Fassungen folgen den englischen Originalen.
- Eigene Landingpages für die drei Leistungsbereiche (Webentwicklung, technisches Projektmanagement, KI-Prozessautomatisierung) und eine CV-Seite.
- Ein Kontaktformular auf Basis einer Serverless Function, die über Scaleway Transactional Email von einer verifizierten Absenderdomain versendet.
- Ein Theme für hell, dunkel und Systemvorgabe mit dreistufigem Umschalter.
- Die vollständige Cloud-Plattform als Terraform: Object Storage mit CDN davor, die komplette DNS-Zone inklusive produktiver Microsoft-365-Mail-Records, die Transaktions-E-Mail-Domain, zwei Serverless Functions und projektbezogenes IAM.
- Eine Secrets-Pipeline (varlock-Schemata, die aus Proton Pass auflösen) und zwei idempotente Deploy-Skripte, sodass jede Maschine mit Vault-Zugang bauen und ausliefern kann.

## Die prägenden Entscheidungen

**Erst statisch, Islands zuletzt.** Die Seite liefert fast kein JavaScript aus. Astro rendert alles zur Build-Zeit; React existiert nur als Templating-Schicht im Build. Der einzige echte Backend-Bedarf, das Kontaktformular, wurde eine Scaleway Serverless Function, die mit der Transactional-Email-API spricht. Ohne laufenden Server kostet die Plattform im Ruhezustand die Domain plus Rundungsfehler: Storage im Megabyte-Bereich, ein CDN im Pauschaltarif und Functions, die pro Aufruf innerhalb des kostenlosen Kontingents abrechnen.

**EU-Hosting, ein Anbieter.** Scaleway hostet alles: Object Storage für die statischen Dateien, Edge Services als CDN, Serverless Functions für Formular und Apex-Weiterleitung, Domains and DNS für die Zone, Transactional Email für die Zustellung. Ein Terraform-Provider, eine Rechnung, EU-Datenhaltung von Haus aus.

**Secrets, die die Platte nie berühren.** Die Konfiguration beschreibt ein eingechecktes varlock-Schema pro Workspace; sensible Werte lösen zur Laufzeit über eine CLI-Sitzung aus Proton Pass auf. Es gibt keine `.env`, die leaken kann, und keine Zugangsdatei, die nach einem Laptop-Ausfall rotiert werden müsste. Den API-Key der Mail-Function erzeugt Terraform sogar selbst, sodass dieses Geheimnis nur im State und in der Umgebung der Function existiert.

## Was beim Soundcheck brach

Der ehrliche Teil jeder Plattform-Geschichte ist die Stelle, an der sie sich gewehrt hat.

**DNS-Umzug unter laufendem Postfach.** Die Zone musste von GoDaddys Nameservern zu Scaleway wechseln, ohne die Microsoft-365-Mail auf derselben Domain fallen zu lassen. Die Registrierung blieb, nur das Hosting zog um. Der Wechsel lief nach einem geschriebenen, umkehrbaren Runbook: erst jeden Record in Terraform nachbauen, gegen einen Live-Abgleich prüfen, dann die Nameserver umstellen und die TTLs beobachten, mit der alten Zone als Rückweg. Die Mail hat nicht einmal gezuckt.

**Das Apex-Problem.** Edge Services kann keine nackte Apex-Domain ausliefern, und DNS verbietet dort einen CNAME. Die Lösung ist eine winzige Serverless Function, die das TLS-Zertifikat des Apex hält und alles per 301 auf `www` weiterleitet, unter Erhalt von Pfad und Query. Kaltstarts würden diese Weiterleitung träge machen, also hält ein Cron im kostenlosen Kontingent sie alle fünf Minuten warm. Kosten: null.

**Das CDN, das nicht purgen wollte.** Cache-Invalidierung wurde ihrem Ruf gerecht: Purge-Anfragen meldeten Erfolg, während weiter veraltete Dateien ausgeliefert wurden. Statt gegen das CDN zu kämpfen, macht die Deploy-Pipeline das Purgen überflüssig. Jedes Asset wird unter einem inhaltsgehashten Dateinamen mit unveränderlicher Ein-Jahres-Cache-Regel ausgeliefert, HTML ist `no-cache` und wird bei jedem Aufruf per ETag revalidiert. Deploys sind sofort sichtbar, und nichts kann veralten, mit oder ohne Purge.

**Die Suchmaschinen, laufend.** Die noch offene Front ist SEO. Eine zweisprachige Seite vervielfacht die Wege, auf denen Indexierung still schiefgehen kann, und meine ging sie: hreflang- und Canonical-Angaben, die plausibel aussahen, Seiten aber aus dem Index hielten. Die Korrekturen und Prüfungen stehen; was bleibt, ist der Teil, den kein Entwickler beschleunigen kann. Suchmaschinen validieren Änderungen in ihrem eigenen Takt, crawlen und bewerten über Wochen neu, und der einzig ehrliche Weg ist derselbe, auf dem die restliche Plattform läuft: den Mechanismus korrigieren und dann gegen die Daten prüfen, wie sie in der Search Console eintreffen, nicht gegen die Hoffnung.

## Deep Dive: die Plattform

![Architektur: ein Terraform-Graph verwaltet DNS, CDN, Functions und Mail; Anfragen laufen vom Apex über www und CDN zum Object Storage, das Kontaktformular über eine Serverless Function zur Transaktions-E-Mail](../../../assets/diagrams/dev-platform.svg)

Der Terraform-Graph verwaltet das Scaleway-Projekt selbst und alles darin: den Storage-Bucket mit Website-Hosting, die Edge-Services-Pipeline (Plan, DNS-Stage, Cache-Stage, Backend-Stage), die vollständige DNS-Zone inklusive der Microsoft-365-Records, die Transaktions-E-Mail-Domain mit ihren DKIM-Records, beide Serverless Functions und einen projektbezogenen IAM-Key, der beim Apply für die Mail-Function erzeugt wird.

Der State liegt in einem Scaleway-Object-Storage-Bucket mit S3-nativem Locking, ganz ohne DynamoDB-Ersatz. Die S3-API von Scaleway hat eine Kante, die man kennen sollte: Um ein Nicht-Standard-Projekt anzusprechen, muss man sich als `ACCESS_KEY@PROJECT_ID` authentifizieren, was nirgends prominent dokumentiert ist und einen Nachmittag gekostet hat.

Die Deploy-Skripte sind zwei idempotente Bun/Bash-Einstiegspunkte: eines wendet die Infrastruktur an, eines baut und synchronisiert die Website. Der Sync setzt Cache-Header pro Objekt beim Upload, entfernt verwaiste, mehrere Megabyte große Quellbilder, die Astros Bildpipeline sonst ins Bundle durchreichen würde, und bricht ab, wenn das gebaute HTML einen Function-Endpunkt referenziert, der von Terraforms Output abweicht. Der Build ist über Maschinen hinweg bytegleich, was aus "hat der Deploy etwas geändert" eine Prüfsummenfrage macht.

## Verwandt

- [sebastian-heitmann.rocks](/de-de/cases/rocks-portfolio/): die Portfolio-Seite, gebaut auf demselben Plattform-Muster, nur wird das Design dort laut.
- [--v8-asterisk](/de-de/cases/v8-asterisk/): das Designsystem, auf dem beide Seiten laufen, ausgeliefert als shadcn-Registry. Die .rocks-Seite verbiegt es zu ihrer Punk-Variante v8-wildcard.
