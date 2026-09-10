# Connecting the diagrams to Vedic passages

Status: design proposal, 9 September 2026. The interface cleanup is implemented; the passage reader is not implemented yet.

## The experience

Keep the diagram and its scientific explanation as the main experience. Add a quiet **Passages** link beneath a relevant explanation or selected nakṣatra. It opens a reading panel beside the diagram, in the space currently occupied by the guide. Closing it returns to the same guide step and scene.

This makes the relationship concrete: explore a concept, encounter its Sanskrit name, then read a particular passage and understand exactly how it relates. The reader should also be enjoyable as a short piece of reading, with enough surrounding context to make the passage intelligible.

Use the existing paper background, serif headings, and restrained green accents. A thin rule and a precise citation provide enough visual distinction. No scripture carousel, quotation banners, or extra markers scattered across the wheel.

### Example: selecting Kṛttikā

The station detail keeps its astronomical information. Beneath it appears:

**Passages · Taittirīya Saṃhitā 4.4.10 · Atharvaveda 19.7.2**

Opening the first reference produces this reading structure:

```text
← Back to Kṛttikā

Taittirīya Saṃhitā 4.4.10a
Kṛttikā and Agni

[A checked English translation of the relevant passage]

Sanskrit & transliteration                         ▾

Connection to the diagram
The passage names Kṛttikā as a nakṣatra and pairs
it with Agni. The equal angular sector displayed
here is a separate mathematical convention.

[Optional surrounding passage]

A. B. Keith · edition and location · Open source ↗
```

The bracketed lines above are placeholders, not quotations. The connection paragraph is our explanatory prose. The source explicitly gives the Kṛttikā–Agni pairing; it does not give the modern sector width in this passage. [Keith’s translation, 4.4.10](https://sacred-texts.com/book/the-yajur-veda-taittiriya-sanhita/read/kanda-iv)

Default reading order: English first, with Devanāgarī and IAST together in one expandable section. This is provisional pending the reading-preference question already sent. Remember that preference across passages.

### Interaction details

- On desktop, keep the diagram usable while the reader is open. Its width and typography should support sustained reading without squeezing the diagram.
- On mobile, use a full-height reading sheet with an explicit close control. Preserve the underlying diagram, scroll position, and guide step.
- Opening a passage preserves all celestial positions. Pause an active animation so the context remains stable; let the user resume explicitly.
- Moving the Moon must not replace the passage mid-sentence. Keep the selected passage open until the user chooses another.
- Offer **Show in diagram** only when it explains a specific textual relationship. If it changes the scene, provide **Restore my scene**. A deity association alone does not need an action button.
- Let the reader expand a small amount of surrounding text and follow a link to the full edition. Keep edition details and textual notes under a single disclosure when they are lengthy.
- Display Sanskrit terms beside their English explanation where useful. Explain contextual meanings, especially Soma; do not label every modern coordinate term with a supposedly Vedic equivalent.

## Which texts belong here

Start with the Vedic Saṃhitās and the Ṛk and Yajus recensions of Vedāṅga Jyotiṣa. Treat those recensions as separately identified texts with edition-specific verse numbers.

If a concept needs a Brāhmaṇa passage, identify that textual layer explicitly and explain its relevance. No automatic expansion into Purāṇas, siddhāntas, horoscopic manuals, or later commentaries to fill a coverage gap. Modern scientific references can remain in the existing references area; the passage reader has the narrower corpus requested.

The reader must distinguish three kinds of connection in plain prose:

| Relationship                  | What the reader should learn                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A name or association appears | The text names this station, deity, or calendrical term.                                                     |
| A computational rule appears  | The text gives a specific operation or numerical relationship, reconstructed according to the named edition. |
| A related account appears     | The text describes a phenomenon or ritual context relevant to the lesson.                                    |

Do not turn these into badges everywhere. Use them internally to write an accurate “Connection to the diagram” paragraph.

A named station is not automatically an attestation of its modern star identification, exact boundaries, pādas, or daśā ruler. An occurrence of _yoga_ is not automatically the pañcāṅga longitude-sum quantity. A solar obscuration account is not automatically a theory of the lunar nodes.

## Initial passage map

These are research leads with explicit verification status. English passages in the linked editions below have been inspected, except for the Vedāṅga Jyotiṣa row. Sanskrit transcription, translation alignment, and edition page references still need checking before publication. The summaries are paraphrases, not translations to ship in the app.

| Concept in the tool                               | Passage and source                                                                                                                                                                   | Useful connection and limit                                                                                                                                                                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kṛttikā, Rohiṇī, and other station names          | [Atharvaveda, Śaunaka 19.7.2–5; Whitney/Lanman](https://en.wikisource.org/wiki/Atharva-Veda_Samhita/Book_XIX/Hymn_7)                                                                 | Invocations name a sequence of stations. Verse 2 is a good first entry for Kṛttikā and Rohiṇī. Preserve the text’s names and variants; do not silently rewrite the list into the modern wheel.                                                        |
| Abhijit and variation in station lists            | [Atharvaveda, Śaunaka 19.7.4](https://en.wikisource.org/wiki/Atharva-Veda_Samhita/Book_XIX/Hymn_7) and [19.8.2](https://en.wikisource.org/wiki/Atharva-Veda_Samhita/Book_XIX/Hymn_8) | The former names Abhijit; the latter explicitly refers to twenty-eight. Whitney’s rendering of “twenty-eight” in 19.7.1 involves an emendation, so prefer 19.8.2 for the explicit count and retain textual notes.                                     |
| Nakṣatra–deity associations                       | [Taittirīya Saṃhitā 4.4.10; Keith](https://sacred-texts.com/book/the-yajur-veda-taittiriya-sanhita/read/kanda-iv)                                                                    | A ritual list directly pairs stations and deities, including Kṛttikā–Agni and Rohiṇī–Prajāpati. Retain this list’s own wording and order. It is not a source for every association in later tables.                                                   |
| Months and intercalation                          | [Ṛgveda 1.25.8; Griffith](https://sacred-texts.com/hin/rigveda/rv01025.htm)                                                                                                          | Varuṇa knows the twelve months and an additional one. Useful early calendrical context; the verse does not state the modern solar-ingress rule for an intercalary month.                                                                              |
| Recurrent lunar renewal                           | [Ṛgveda 10.85.18–19; Griffith](https://sacred-texts.com/hin/rigveda/rv10085.htm)                                                                                                     | Language of repeated lunar renewal can accompany the phase-cycle lesson. Do not present it as the 12° definition of tithi.                                                                                                                            |
| Months and seasons                                | [Taittirīya Saṃhitā 4.4.11a–f; Keith](https://sacred-texts.com/book/the-yajur-veda-taittiriya-sanhita/read/kanda-iv)                                                                 | Pairs of named months are associated with seasons. Show the names used in this passage; this is not the Caitra–Citrā naming table currently in the app.                                                                                               |
| Sun–Moon calendar, tithi, and the five-year cycle | [Vedāṅga Jyotiṣa of Lagadha, Sastry/Sarma, INSA 1985; edition record](https://books.google.co.in/books?hl=en&id=K84MAAAAIAAJ)                                                        | Priority for the next research pass. The edition has been located, but exact passages, recension correspondences, and verse numbering are **not yet verified**. Do not publish guessed citations or insert modern longitude algebra as a translation. |
| Solar obscuration                                 | [Ṛgveda 5.40.5–9; Griffith](https://sacred-texts.com/hin/rigveda/rv05040.htm)                                                                                                        | The Svarbhānu/Atri account belongs alongside the eclipse lesson as textual context. These verses do not themselves establish the displayed ascending/descending-node calculation or a specific historical eclipse date.                               |

Two editorial checks deserve attention early:

- In [the Wilson translation page for Ṛgveda 1.25.8](https://www.wisdomlib.org/hinduism/book/rig-veda-english-translation/d/doc829165.html), the explicit identification with _adhikamāsa_ appears in the separately presented Sāyaṇa commentary. Keep that interpretation distinct from the verse, and avoid importing the commentary into the pilot corpus.
- In [Whitney’s discussion of Atharvaveda 19.8.2](https://en.wikisource.org/wiki/Atharva-Veda_Samhita/Book_XIX/Hymn_8), _yoga_ has a contextual interpretation concerning acquisition. A vocabulary search alone would create a misleading link to the app’s pañcāṅga yoga calculator.

### Coverage gaps are acceptable

Do not attach a passage to every control. Until suitable scoped evidence is verified, leave modern longitude notation, rāśi divisions, pādas, ayanāṃśa, the present five-limb combination, and Viṃśottarī timing without direct passage links. This is a statement about the proposed corpus and verification work, not a claim that a search has established their absence from all early literature.

Keep the modern explanation usable. Where a related passage is available, explain its narrower connection inside the reader. Avoid repeated historical disclaimers in the diagram itself.

## Text and translation handling

Each published passage needs the work, recension, exact locator, edition, and translator. Preserve editorial brackets and distinguish the base text, translation, commentary, and our explanation. Online transcriptions are useful discovery sources; check quotations against an edition or scan before shipping them.

Use a reusable published translation where its rights permit, or an explicitly credited and checked new translation. A modern critical edition can inform verification without reproducing its copyrighted translation. Do not manufacture quotations or silently replace difficult wording with a modern astronomical claim.

For Sanskrit, retain a checked source transcription and its accent marks where available. Display normalization and IAST conversion must be traceable. Use a Devanāgarī font that renders Vedic marks correctly; check it visually on desktop and mobile. Explain only the few words needed for the passage rather than adding a dictionary interface.

Store historical names separately from modern display names. An alias such as Śraviṣṭhā/Dhaniṣṭhā needs a checked mapping, not a blanket text substitution. A passage beginning its list with Kṛttikā should retain that order even though the app’s equal-sector wheel begins with Aśvinī.

## Implementation outline

Keep this as a small addition to the existing React app:

- Add stable concept identifiers to the relevant entries in `src/content.ts` and the nakṣatra detail data. Link concepts to passages explicitly; avoid keyword matching.
- Put editions, passages, and concept links in a small typed module, initially `src/passages.ts`. Passage records hold source text, translation, provenance, and verification status. Concept links hold the supported relationship and any limits, because one passage can connect to several lessons differently.
- Add `src/components/PassageReader.tsx`, using the existing typography and disclosure patterns. Store the open passage separately from the astronomical `Scene` in `App.tsx`.
- Reuse the existing scene update path for any justified diagram action. Keep the previous scene for restoration; opening and closing the reader must not reset it.
- Add an optional passage identifier to shared URLs once the reader works. Existing scene links should continue to open unchanged. Unverified records remain excluded from the rendered corpus.

No database, remote text generation, full-text search, or new top-level navigation is needed for the first version.

## Build order and completion criteria

1. **Verify a small corpus.** Start with Kṛttikā and Rohiṇī in the two station lists, one lunar-renewal passage, and the calendrical material. Resolve the Vedāṅga Jyotiṣa verse references before claiming tithi coverage. Aim for roughly eight focused excerpts, with shared passages reused across station entries.
2. **Build one complete reading interaction.** Kṛttikā is the first example: exact citation, English, Sanskrit/IAST, a concise connection paragraph, surrounding context, and an edition link. Check the desktop panel and mobile sheet before expanding coverage.
3. **Add calendar links.** Connect verified Vedāṅga Jyotiṣa rules to tithi and lunar-month explanations, explicitly separating its numerical model from the app’s modern mean periods. Add the other checked entries without multiplying controls.
4. **Review the full reading path.** The user can move from science to Sanskrit term to primary passage and return to the same experiment. Check textual accuracy as well as interface behavior.

Acceptance checks:

- Every quotation resolves to a precise passage and named edition; base text and later interpretation remain distinguishable.
- Every connection states only what its passage supports. Modern numerical conventions remain identified as such.
- The diagram remains stable when opening or closing a source; selecting a new station does not interrupt reading.
- Keyboard focus, close behavior, mobile scrolling, script rendering, and shared links work. The reader passes the existing accessibility checks.
- The interface remains as quiet as the cleaned-up version. Source access adds useful depth without another layer of slogans, panels, or repetitive buttons.
