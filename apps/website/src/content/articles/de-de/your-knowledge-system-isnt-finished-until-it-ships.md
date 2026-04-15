---
title: "Ein Wissenssystem ist erst dann fertig, wenn es liefert"
category: "shipping-with-ai"
subline: "Ein zweites Gehirn, das sich selbst makellos pflegt und nichts hervorbringt, ist ein Museum"
abstract: "Andrej Karpathy hat gerade veröffentlicht, wie er sein persönliches Wissenssystem von einem LLM pflegen lässt. Die meisten Leser:innen werden daraus das Falsche bauen — ein sauberes Wiki, das nichts produziert. Der Schritt, über den niemand schreibt: dein zweites Gehirn mit einem Agenten zu verdrahten, der für dich produziert — während du bei den Teilen bleibst, die ein System dir nicht abnehmen kann. Output ist delegierbar. Outcome nicht. Das ist die Grenze."
type: "article"
tags: ["KI-Schreiben", "Wissensmanagement", "Agenten", "Workflow", "Handwerk"]
author: "sebastian-heitmann"
headerImage: "../../../assets/articles/knowledge-systems-header.png"
headerDetailImage: "../../../assets/articles/knowledge-systems-detail.png"
publishedAt: 2026-04-15
authorship: "ai-assisted"
aiTranslated: true
draft: false
displayFrontpage: true
---

Andrej Karpathy — Mitgründer von OpenAI, früherer KI-Chef bei Tesla und Urheber der Deep-Learning-Erklärvideos, die inzwischen ein großer Teil der Tech-Welt gesehen hat — hat vor Kurzem [veröffentlicht](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), wie er sein persönliches Wissenssystem von einem LLM pflegen lässt.

Die meisten, die diesen Gist lesen, werden daraus das Falsche ableiten. Sie werden den nächsten Monat damit verbringen, ihre Notizen zu strukturieren, Ingestion-Skripte aufzusetzen, dem LLM beim Querverweisen ihrer Dokumente zuzusehen und das dabei entstehende, sich selbst fortschreibende Artefakt zu bewundern — um dann stehen zu bleiben. Denn das Organisieren von Wissen fühlt sich nach Fortschritt an, und ein sauberes Wiki wirkt wie etwas Greifbares.

**Ist es aber nicht.**

Ein zweites Gehirn, das sich selbst makellos pflegt und dabei nichts hervorbringt, ist ein Museum. Der eigentlich entscheidende Schritt besteht darin, dieses System mit einem Agenten zu verdrahten, der aus den gesammelten und destillierten Substanz Neues kreiert — während du weiterhin die Entscheidungen triffst, die ein System dir nicht abnehmen kann.

## Das System, das alle bauen, hört einen Schritt zu früh auf

Wer online schreibt, Produkte baut oder mit Denken sein Geld verdient, sollte Karpathys Gist lesen. Er skizziert darin ein Muster, mit dem sich Notizen, Wiki, Recherche und Referenzen von einem LLM pflegen lassen — sauber verknüpft, quervernetzt und aktuell gehalten, ohne den menschlichen Pflegeaufwand, an dem klassische Systeme dieses Typs sonst am Ende meist scheitern. Das LLM zieht neue Quellen ein, synthetisiert Querverweise, markiert Widersprüche und hält veraltete Aussagen auf. Du kuratierst und stellst Fragen. Die Maschine übernimmt die mühselige Kleinarbeit. Seine Beschreibung des Systems als „persistent, compounding artifact" trifft genau das richtige mentale Modell — ein Wissensbestand, der sich akkumuliert, statt bei jeder Abfrage neu rekonstruiert zu werden. Das Muster ist scharf, und er ist die richtige Person, um es zu schärfen.

Ich selbst nutze Tiago Fortes CODE-Methode — capture, organise, distil, express — um mein eigenes Wissenssystem aufzusetzen. Auch das funktioniert. Erfassen ist leicht. Organisieren ist, wenn man sich einmal für eine Struktur entschieden hat, leichter als man denkt. Destillieren wird zur Übung, die zur Gewohnheit reift. Ausdrücken — also das *express* — ist der Teil, der sich nie wirklich automatisieren lässt, weil in ihm das Handwerk steckt, und Handwerk lässt sich nicht in ein System pressen.

Beide Muster hören am selben Punkt auf. Sie behandeln das LLM als unermüdlichen Bibliothekar — erfassen, ordnen, warten — und überlassen dem Menschen das Problem, was damit eigentlich geschehen soll. Die Annahme dahinter lautet: Sobald das Wissen sauber genug ist, kommt der Output von allein. Das stimmt nicht. Ein unermüdlicher Bibliothekar verschafft dir ein besser sortiertes Regal. Ein unermüdlicher Produzent verschafft dir Arbeit, die in der Welt sichtbar wird. Das sind zwei verschiedene Systeme, und die meisten bauen das erste, obwohl die Hebelwirkung im zweiten liegt.

Output ist ein eigenständiges Problem, und ein sauberes Wiki ist nicht dasselbe wie ein Agent, der mit deiner Stimme, deinen Strukturpräferenzen und deinen redaktionellen Maßstäben neue Inhalte schafft. Das ist der dritte Schritt.

Destilliertes Wissen in einen Agenten zu überführen, der für dich produziert — nicht ein Wiki, das auf Abfragen wartet, sondern ein System, das dein Denken in das übersetzt, was der Moment verlangt. Einen Beitrag. Ein Review. Eine Antwort. Ein Framework, das auf ein frisches Problem angewandt wird. Genau darüber spricht gerade niemand, und genau das ist der Schritt, der aus einem zweiten Gehirn statt eines interessanten Privatprojekts ein Werkzeug macht, das verändert, wie du arbeitest.

## KI liefert Output — nicht Outcome

Das ist das ganze Argument. Alles Weitere ist Detail.

Mit *Output* meine ich das, was eine KI produziert: einen 1.200-Wörter-Beitrag in deiner Stimme, einen destillierten Thread für eine zeichenbegrenzte Plattform, einen überarbeiteten Einstieg, ein kritisches Review, das benennt, was einem Entwurf fehlt. Mit *Outcome* meine ich, ob der Text tatsächlich ankommt — ob er die richtige Person erreicht, ob er die richtige Idee für diesen Moment ist, ob die Argumentation trägt, wenn sie jemand mit gegenteiliger Meinung liest. Der größte Teil des Diskurses über KI-gestütztes Schreiben verwechselt die beiden Größen. Sobald ein Werkzeug plausiblen Text produziert, heißt es: „Schreiben ist gelöst." Gemeint ist der Output, übersehen wird der Outcome.

Konkret sieht das so aus: Ich habe ein Claude-Code-Plugin gebaut, das jeden Schritt meines Online-Schreibens übernimmt — bis auf den Teil, an dem ich entscheide, ob es den Text überhaupt wert ist und ob er am Ende ankommt. Das Plugin erarbeitet den Zweck meines Schreibens und erschafft eine Landkarte meines inhaltlichen Territoriums. Es erforscht meine Ideen so lange, bis sie Substanz haben, strukturiert Beiträge entlang bewährter Frameworks, bewertet sie nach sechs Qualitätsdimensionen und destilliert Langformate in Mikro-Posts für zeichenbegrenzte Plattformen.

Die Konfiguration besteht aus zwei Dateien. Die eine deklariert meinen Zweck — Motivation, Zielgruppe, Kategorie, Perspektive, Stil, Vision. Die andere kartiert meine Content-Buckets: welche Themen zu mir passen, und für wen ich schreibe. Jede Skill im Plugin liest diese Dateien. Jede Review-Runde prüft gegen sie. Was früher Tage brauchte, dauert jetzt Stunden.

Auf Output-Ebene ist das gut. Auf Outcome-Ebene bleibt die Frage, ob der Beitrag das Richtige ist, im richtigen Ton, im richtigen Moment, für die richtigen Leser:innen. Keine Konfigurationsdatei kann mir das beantworten.

Ein konkretes Beispiel dafür, wie diese Lücke aussieht: Die rate-Skill hat kürzlich einen meiner Texte auf Glaubwürdigkeit schlecht bewertet — sie hielt die zitierte Quelle für erfunden. Die Quelle war nicht erfunden. Der Agent war lediglich misstrauisch: Das Zitat passte zu exakt zur Argumentation, die Autorität war zu gut angebunden, und das Ganze wirkte zu bequem, um echt zu sein. Er lag falsch.

Um das aber zu wissen, musste ich eingreifen, die Quelle prüfen, die Referenz bestätigen und entscheiden, was ich mit dem Befund anfange. Der Agent lieferte einen sauberen Output — einen strukturierten Glaubwürdigkeitswert mit spezifischer Begründung. Der Outcome — ob die Behauptung tatsächlich trägt, ob die Quelle tatsächlich echt ist, ob das meine Argumentation stärker oder schwächer macht — lag bei mir.

Das ist das Muster im Kleinen. Der Agent operiert auf dem, was er sieht. Der Outcome sitzt im Kontext, auf den er keinen Zugriff hat.

Man könnte meinen, diese Grenze verschiebe sich, sobald die Modelle besser werden. Tut sie nicht, weil es an dieser Stelle nicht um Leistungsfähigkeit geht. Auch ein perfektes Modell kann nicht wissen, was ich heute glaube und letzten Monat noch nicht geglaubt habe. Es kann nicht wissen, welcher meiner fünf Entwurfsgedanken mich gerade wirklich trägt und welcher nur aus reiner Routine in der Pipeline gelandet ist, weil er am Tag der Planung vernünftig aussah. Modelle werden im Produzieren besser werden.

Das verändert nicht, welche Entscheidungen bei mir liegen.

Das Plugin ersetzt mein Urteil nicht. Es komprimiert mein Urteil — Stimme, Frameworks, Review-Kriterien, Zielgruppendefinitionen — in eine Form, die ein Agent ausführen kann. Das Denken liegt vorn, in Dateien. Die Ausführung liegt hinten, und der Agent erledigt sie sauber. Ob ein konkreter Text dann aber die Outcome-Schwelle überspringt, entscheidet sich weiterhin an meinem Schreibtisch.

Diesen Text schreibe ich gerade mit genau diesem Plugin. Es hat die Struktur gefunden, die Behauptungen gegen meinen Zweck geprüft, die Punkte markiert, die zwei Jobs gleichzeitig erledigten oder die flach waren. Was es mir nicht sagen konnte: ob du heute genau diesen Text lesen solltest — oder lieber einen anderen.

**Output ist delegierbar. Outcome nicht. Das ist die Grenze.**

## Ich könnte mehr automatisieren. Ich tue es bewusst nicht.

Das ist der Teil, der sich schwer aussprechen lässt.

Nichts hindert einen Agenten daran, zu entscheiden, worüber ich als Nächstes schreiben sollte. Die Werkzeuge existieren, um meinen Kalender zu scannen, die Branchen-Diskussionen zu verfolgen, die mich interessieren, Themen nach Relevanz gegen meine Content-Buckets zu ranken und mir ein priorisiertes Wochen-Briefing in die Hand zu drücken. Ich könnte einen Agenten meine Ideen wählen lassen, meinen Publikationsrhythmus takten lassen und bis zur Freigabe ohne meine Beteiligung entwerfen lassen. Die Technik ist da. Ich will sie nicht. Die Richtung ist der Teil, den ich nicht abgebe — nicht weil ein Agent es nicht könnte, sondern weil der eigentliche Sinn des Online-Schreibens darin besteht, zu sagen, was *ich* denke, und das Auslagern der Frage, *worüber ich denke*, in dieser Rechnung eine merkwürdige Entscheidung wäre.

Genau an dieser Stelle trenne ich mich vom maximalistischen Automatisierungsargument.

Die Frage ist nicht, *was* ich automatisieren kann. Die Frage ist, was ich automatisieren *sollte*. Sobald man diese Linie zieht, hört das zweite Gehirn auf, ein Produktivitätsprojekt zu sein, und wird zu einer handwerklichen Entscheidung: Welche Teile der Arbeit bleiben meine, und warum. Die Antwort fällt bei jedem:r anders aus. Bei mir bleiben Richtung, Meinung und Outcome. Alles andere darf in Konfigurationsdateien komprimiert und an einen Agenten übergeben werden.

Der Test, den ich an jedem Schritt meines Workflows anlege, lautet: Wenn ich das automatisiere, trägt der Output dann weniger von mir? Nicht weniger Stimme — Stimme lässt sich komprimieren, und Konfiguration erfasst sie sauber. Sondern weniger von meinem *Wählen*. Weniger von meinem Ringen mit der Frage, was überhaupt sagenswert ist. Lautet die Antwort Ja, bleibt es bei mir, auch wenn der Effizienzgewinn real wäre.

Der Grund, online zu schreiben, besteht darin, zu sagen, was man denkt. Einen Agenten aussuchen zu lassen, worüber man denkt, heißt, die Recherche des Agenten zu veröffentlichen, verkleidet in der eigenen Stimme. Dafür gibt es ein Wort, aber es ist nicht *Autorschaft*.

## Die neue Schleife: KI-Output als kreativer Auslöser

Das gängige Modell lautet: *KI entwirft, Mensch überarbeitet.* Das ist nicht das Modell, das funktioniert.

Das Modell, das funktioniert, lautet: KI produziert, KI macht sichtbar, was fehlt, der Mensch erzeugt das, was die Lücke füllt. Der Output der KI ist ein Auslöser für den kreativen Prozess, nicht dessen Ersatz.

Wie sieht diese Schleife konkret aus? Die rate-Skill läuft über einen Entwurf und liefert eine Bewertung entlang von sechs Dimensionen — Thesenklarheit, Originalität, Struktur und Fluss, Glaubwürdigkeit, sprachliche Qualität und Positionierung. Sie gibt nicht bloß Zahlen aus. Sie benennt, was schwach ist und warum: ein Punkt, der zwei Jobs gleichzeitig erledigt; ein Einstieg, der ein Versprechen gibt, das der Text nicht einlöst; eine Behauptung ohne Stütze; ein Abschnitt, der strukturell korrekt, aber emotional flach ist. Die Diagnose ist spezifisch genug, um daran arbeiten zu können.

Was der Agent nicht tun kann, ist den Zug, der die Diagnose beantwortet, selbst zu machen. Er kann mir sagen, dass ein Abschnitt flach ist. Er kann den ursprünglichen Satz nicht produzieren, der diesen Abschnitt wieder zum Leben erweckt. Er kann mir sagen, dass eine Argumentation in ihrer Glaubwürdigkeit dünn ist. Er kann mir nicht sagen, welche meiner realen Erfahrungen sie stärken würde, denn er kennt meine realen Erfahrungen nicht — nur die komprimierte Version von mir, die in der Konfiguration lebt. Diese Maßnahmen gehören mir. Nach der Diagnose ist die leere Seite keine leere Seite mehr. Sie ist eine sehr konkrete Frage mit meinem Namen darauf.

Dasselbe Muster greift früher, in der Ideenphase. Die explore-idea-Skill stellt mir Fragen zu einem Thema. Die Fragen, die treffen, sind jene, die etwas an die Oberfläche bringen, das ich noch nicht benannt hatte — einen halb bedachten Blickwinkel, einen Widerspruch, dem ich ausgewichen war, eine Geschichte, von der ich nicht dachte, dass sie hineingehört. Der Agent hat die Frage erzeugt. Die Antwort kam von mir, weil sie ohnehin schon irgendwo in mir lag — die Frage war lediglich der richtige Anreiz, um sie hervorzuholen.

Das ist eine andere Erfahrung als das Redigieren eines Entwurfs. Sie kommt dem näher, dass der Agent auf dem Pfad vorausläuft und die Stellen markiert, an denen ein Mensch gehen muss. Die Aufmerksamkeit wird genau auf die Teile gerichtet, die Urteil, Geschichte oder Meinung verlangen. Der Rest ist erledigt, während ich an diesen Teilen gearbeitet habe.

Ich habe auch die andere Variante ausprobiert — den Agenten ohne die Enthülle-und-Erzeuge-Schleife bis zum fertigen Text durchlaufen lassen. Was dabei herauskommt, ist technisch sauber. Es ist auch flach. Was einen Text interessant macht, ist ein konkreter Mensch, der sich an einem konkreten Problem abarbeitet — und ein Agent, der jede Unebenheit glattschleift, schleift genau diese Spur mit ab. Ein sauberer Entwurf ohne jede Unebenheit ist gewöhnlich ein Text, in dem nichts übrigbleibt, was in Erinnerung bliebe.

**KI ersetzt die kreative Arbeit nicht. Sie zeigt, wo sie zu leisten ist.**

Genau das verändert die Ökonomie des Schreibens. Aus Stunden des Erzeugens plus Stunden des Nachschärfens werden Minuten des Erzeugens, ein Zyklus der Diagnose und anschließend die kreative Entscheidung, in der die eigentliche Arbeit schon immer steckte — die Züge, die mir gehören und niemandem sonst. Das System beschleunigt nicht das Denken. Es hört nur auf, mein Denken für alles andere zu verbrauchen.

## Das System bauen — das Handwerk behalten

Wenn du Karpathys Gist gelesen hast und Ideen daraus ziehst, sieht die Version, die ich bauen würde, so aus:

Bau das Wiki. Mach die Forte-Destillation. Lass das LLM deinen Wissensbestand pflegen. All das hat echten Wert — aber keines davon ist die Ziellinie. Das Wiki ist ein Input. Was du auf der anderen Seite davon haben willst, ist ein Agent, der dein destilliertes Wissen in das übersetzt, was der Moment verlangt — kein generischer Assistent, sondern ein System, das auf deinen Zweck, deine Stimme, dein inhaltliches Territorium und deine Review-Kriterien ausgerichtet ist.

Komprimiere die Teile, die sich komprimieren lassen. Stimme. Frameworks. Strukturpräferenzen. Review-Checklisten. Alles, was das *Wie* deiner Arbeit ausmacht, nicht das *Was*, an dem du arbeitest. Leg das in Konfigurationsdateien, die der Agent bei jedem Lauf liest, damit das System ausgerichtet bleibt, ohne dass du es jedes Mal neu erklären musst.

Behalte die Teile, die dir gehören müssen. Richtung. Meinung. Outcome. Das sind die Teile, in denen der Sinn der Arbeit steckt, und sie auszulagern bedeutet, dass alles, was du veröffentlichst, nur noch ein Schatten dessen ist, was es hätte sein können.

Behandle den Output des Agenten als Anstoß für deine kreative Arbeit, nicht als deren Ersatz. Der Agent, der dir die Diagnose stellt, erweist dir einen Dienst; der Zug, der am Ende trägt, bleibt deiner.

Schließlich: Optimiere nicht auf die falsche Kennzahl. Die verführerische Größe ist, wie viel der Arbeit der Agent übernimmt. Die richtige Größe ist, um wie viel besser das Ergebnis wird, wenn du die Linie gut gezogen hast. Ein Agent, der 95 Prozent der Arbeit übernimmt und 70 Prozent der Qualität liefert, ist schlechter als ein Agent, der 70 Prozent der Arbeit übernimmt und 110 Prozent der Qualität liefert. Die zweite Variante ist die, auf die du bauen solltest — auch dann, wenn der Agent dabei weniger tut, als er könnte.

## Dein Beitrag ist deine Sichtweise

Was dem Automatisierungsdiskurs entgeht, ist Folgendes: Was Leser:innen aus einer KI ziehen können, können sie aus jeder KI ziehen. Was sie ausschließlich aus dir ziehen können, ist deine Meinung, deine Sichtweise, dein spezifischer Blick auf das, was vor ihnen liegt. Das ist der Beitrag, den du als Einzelne:r leistest — nicht die Recherche, nicht die Struktur, nicht der Rhythmus der Prosa. Die Haltung. Die Position. Die spezifische Art, wie du die Dinge siehst.

Je glatter die KI wird, desto mehr wiegt genau das. Jeder Output wird poliert. Jeder Entwurf wird kompetent. Jeder Text liest sich, als hätte ihn jemand geschrieben, der sein Handwerk versteht. In einer Welt, in der das die Grundlinie ist, entscheidet sich das Auseinandertreten der Texte an allem, was das System nicht aus sich selbst erzeugen kann:

- **Wessen Richtung dahintersteht** — worüber jemand geschrieben hat und warum gerade jetzt und nicht später.
- **Wessen Meinung darin steckt** — die eingeschlagene Position, nicht die neutrale Übersicht jeder denkbaren Perspektive.
- **Welchen Outcome jemand angestrebt hat** — die konkreten Leser:innen, der konkrete Moment, die konkrete Wirkung, für die der Text gebaut wurde.
- **Aus welcher Erfahrung der Text schöpft** — das gelebte Detail, das keine Konfigurationsdatei abbilden kann.
- **Wessen Urteil sich in den Korrekturen zeigt** — die Züge, die auf die Diagnose des Agenten antworten, gemacht von jemandem, der weiß, welche Züge tragen.

Jeder Punkt auf dieser Liste gehört dir. Jeder Punkt ist es, der einen Text in einer Welt, in der die Mechanik gratis geworden ist, überhaupt noch lesenswert macht.

Fortes Methode kann dein Denken ordnen. Karpathys Muster kann es pflegen. Der Agent kann es rendern. Was niemand außer dir tun kann, ist zu entscheiden, was du denkst und warum es zählt.

Bewundere das zweite Gehirn weniger. Verdrahte es mit etwas, das liefert. Und erinnere dich dann an die Gestalt dessen, was du da gebaut hast: Das System erzeugt keinen Wert. Es multipliziert deinen. Das Wiki, der Agent, der Output — all das ist Hebel auf das, was du an die Spitze des Stapels bringst. Bring deine Sichtweise, dein Urteil, deine spezifische Art zu sehen, dann verstärkt das System all das. Bringst du nichts, verstärkt es nichts.

Du bist der Multiplikator. Alles andere ist nur der Koeffizient.
