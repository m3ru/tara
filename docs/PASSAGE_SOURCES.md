# Passage text and typography

Implemented 10 September 2026. This first corpus contains eight excerpts from the Ṛgveda, Taittirīya Saṃhitā, and the Yajus recension of Vedāṅga Jyotiṣa. It does not claim source coverage for every modern calculation in the app.

## Reading behavior

“Read passages” opens a reader next to the diagram on desktop and a modal sheet at widths up to 1000 px. Sanskrit is visible alongside the English meaning; IAST is optional, and that preference is remembered. Opening pauses animation without changing positions. Reading survives dragging a body into another station. Closing restores the guide, scroll position, and opening control where it still exists.

The selected Kṛttikā or Rohiṇī detail has its own passage link. The other lesson links offer relevant excerpts without claiming that their modern formulas occur in the quoted text. All eight are also accessible through Notes & sources → Vedic passages. “Copy this view” includes the passage and current scene.

## Collation record

The Sanskrit quotations are stored directly in `src/passages.ts`. They are not generated from the IAST or inferred from an English explanation. Source PDFs were downloaded and their relevant pages visually inspected. Their text was compared with the accented transcriptions below. This is an implementation collation record, not a certification by a recitation specialist or a new critical edition.

| App identifier   | Quotation                                                   | Source checked                                                                                                                                                                                                                                                  |
| ---------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ts-krittika`    | Taittirīya Saṃhitā 4.4.10, opening through _jyotiṣe tvā_    | [Accented PDF, p. 177 / printed p. 176](https://sanskritdocuments.org/doc_veda/taittirIyasamhitA.pdf#page=177); [Muralidhara B. A.’s transcription](https://sanskritdocuments.org/doc_veda/taittirIyasamhitA.html).                                             |
| `ts-rohini`      | The first Rohiṇī–Prajāpati clause in 4.4.10                 | Same page. Kept separate from the later Rohiṇī–Indra clause.                                                                                                                                                                                                    |
| `ts-seasons`     | 4.4.11, the six seasonal pairs, ending before _agner antaḥ_ | [Accented PDF, p. 178 / printed p. 177](https://sanskritdocuments.org/doc_veda/taittirIyasamhitA.pdf#page=178); same transcription.                                                                                                                             |
| `rv-months`      | Ṛgveda 1.25.8                                               | [Maṇḍala 1 PDF, p. 17](https://sanskritdocuments.org/mirrors/rigveda/pdf/r01.pdf#page=17); [accented verse in Wikisource](https://sa.wikisource.org/wiki/ऋग्वेदः_सूक्तं_१.२५).                                                                                  |
| `rv-obscuration` | Ṛgveda 5.40.5                                               | [Maṇḍala 5 PDF, p. 19](https://sanskritdocuments.org/mirrors/rigveda/pdf/r05.pdf#page=19); [accented verse in Wikisource](https://sa.wikisource.org/wiki/ऋग्वेदः_सूक्तं_५.४०).                                                                                  |
| `rv-renewal`     | Ṛgveda 10.85.19                                             | [Maṇḍala 10 PDF, p. 52](https://sanskritdocuments.org/mirrors/rigveda/pdf/r10.pdf#page=52); [accented verse in Wikisource](https://sa.wikisource.org/wiki/ऋग्वेदः_सूक्तं_१०.८५).                                                                                |
| `vj-year`        | Yajus 28                                                    | Sastry/Sarma, _Vedāṅga Jyotiṣa of Lagadha_, INSA 1985: [Part B, §II.1, Text 11, printed pp. 38–39](https://wiswo.org/books/_resources/book-reference-pdfs/Sastry-1985-Vedanga-Jyotisa.pdf#page=42); Part A’s Sanskrit with variants, printed p. 29 / PDF p. 33. |
| `vj-months`      | Yajus 31ab                                                  | Same edition: [Part B, §III.1, Text 15, printed pp. 41–42](https://wiswo.org/books/_resources/book-reference-pdfs/Sastry-1985-Vedanga-Jyotisa.pdf#page=45); Part A’s Sanskrit with variants, printed p. 30 / PDF p. 34.                                         |

The Saṃhitā sandhi and accent sequences are retained. Line wrapping is responsive; verse numerals move into the citation. Prose excerpts have no added daṇḍa or invented final pause. Wikisource’s surrounding Sāyaṇa commentary is not included as Vedic verse.

For the two Vedāṅga Jyotiṣa excerpts, Devanāgarī follows the reconstructed reading printed in Part B’s Roman transliteration. The reader explicitly identifies that editorial choice and links Part A’s variant readings. These verses are unaccented in this edition: they have not been supplied with invented svaras. Their Yajus numbering is edition-specific.

IAST is an independently checked reading aid without accent notation, labelled as such. It occasionally separates sandhi for readability; it must never be used to regenerate or replace the accented Sanskrit quotation.

English meanings are new, short Tārā paraphrases, visibly identified as paraphrases. They were checked with [Keith’s Taittirīya translation](https://sacred-texts.com/book/the-yajur-veda-taittiriya-sanhita/read/kanda-iv), Griffith’s corresponding Ṛgveda hymns, and the Sastry/Sarma edition. The app does not reproduce the latter’s modern translation. A separate connection paragraph identifies the narrower relevance of each passage.

## Font and shaping

The app bundles **Shobhika 1.05 Regular**, developed under the Science and Heritage Initiative at IIT Bombay. The font’s authors explicitly describe support for Vedic accents, complex Sanskrit conjuncts, and Roman transliteration. [Project documentation](https://github.com/Sandhi-IITBombay/Shobhika), [v1.05 release](https://github.com/Sandhi-IITBombay/Shobhika/releases/tag/v1.05).

The original release OTF was converted to WOFF2 without subsetting or dropping OpenType tables. The full font and its SIL OFL 1.1 license are served locally. See `public/fonts/OFL-Shobhika.txt`.

Rendering rules:

- Use the original Unicode sequences, including U+0951, U+0952, and U+1CDA where present. Their interpretation follows the source tradition; Unicode character names alone are not a guide to recitation.
- Keep whole shaping runs intact. No spans around accents, CSS underlines, manually positioned marks, letter spacing, or synthetic font weights.
- Use `lang="sa-Deva"`, a regular font weight, natural word boundaries, and a line height of 2.15 with vertical padding. Never break a conjunct to fit a narrow column.
- Wait for the actual font before showing Sanskrit. A failed download offers retry and the source page instead of silently showing a system font.
- A font changes presentation, not the source’s accent convention. The Vedic quotations and unaccented Jyotiṣa excerpts keep their respective notation.

The font audit found **52 distinct Sanskrit/mark code points in the source module, all covered**, with GSUB, GPOS, and GDEF intact. `scripts/check_vedic_font.py` repeats the coverage check using FontTools. Browser tests query Chromium’s actual glyph-font usage, rather than merely checking the CSS family name.

## Validation and limits

The browser suite checks all eight quotations for exact stored-text preservation, Shobhika glyph use without system fallback, and word overflow on desktop and at 390 px. It also covers focus restoration, mobile modality, responsive transitions, scene preservation, animation pause, related passages, shared URLs, font failure/retry, and automated WCAG A/AA checks.

Screenshots of the actual browser rendering were inspected against the source pages. Particular checks included the Ṛgveda accent sequences, Taittirīya double svarita, repha and conjunct placement, and marks above/below adjacent lines.

Validation here is on Linux Chromium. WebKit was downloaded, but its host libraries are unavailable in this environment, so Safari rendering has not been claimed as tested. There is no claim of universal rendering perfection across operating systems or of expert recitation review.

The Atharvaveda candidates from the initial plan remain research leads. They are not published in this first corpus because an appropriately collated accented witness is still needed. The modern 12° tithi equation is not presented as a quotation from the currently selected early passages.
