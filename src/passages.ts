export type Passage = {
  id: string
  title: string
  citation: string
  tradition: string
  sanskrit: string
  iast: string
  accented: boolean
  meaning: string
  connection: string
  context: string
  terms: [string, string][]
  source: { label: string; url: string }
  witness?: { label: string; url: string }
  translationSource: { label: string; url: string }
  editorialNote: string
}

const tsPdf = 'https://sanskritdocuments.org/doc_veda/taittirIyasamhitA.pdf'
const tsHtml = 'https://sanskritdocuments.org/doc_veda/taittirIyasamhitA.html'
const keith = {
  label: 'A. B. Keith · Taittirīya Saṃhitā, kāṇḍa IV',
  url: 'https://sacred-texts.com/book/the-yajur-veda-taittiriya-sanhita/read/kanda-iv',
}
const vjPdf =
  'https://wiswo.org/books/_resources/book-reference-pdfs/Sastry-1985-Vedanga-Jyotisa.pdf'
const vjEdition = 'T. S. Kuppanna Sastry / K. V. Sarma · INSA, 1985'
const wiki = (title: string) => `https://sa.wikisource.org/wiki/${encodeURIComponent(title)}`

// Quoted Sanskrit is source text, not generated from the explanations or the IAST.
// Preserve combining marks, sandhi, and source-specific accent conventions.
// See docs/PASSAGE_SOURCES.md for collation and rendering checks.
export const passages: Passage[] = [
  {
    id: 'ts-krittika',
    title: 'Kṛttikā and Agni',
    citation: 'Taittirīya Saṃhitā 4.4.10 · opening',
    tradition: 'Kṛṣṇa Yajurveda · Taittirīya · Saṃhitā text',
    sanskrit:
      'कृत्ति॑का॒ नक्ष॑त्रम॒ग्निर्दे॒वता॒ग्ने रुचः॑ स्थ प्र॒जाप॑तेर्धा॒तुः सोम॑स्य॒र्चे त्वा॑ रु॒चे त्वा᳚ द्यु॒ते त्वा॑ भा॒से त्वा॒ ज्योति॑षे त्वा',
    iast: 'kṛttikā nakṣatram agnir devatāgne rucaḥ stha prajāpater dhātuḥ somasyarce tvā ruce tvā dyute tvā bhāse tvā jyotiṣe tvā',
    accented: true,
    meaning:
      'Kṛttikā is the nakṣatra; Agni is the deity. You are the radiances of Agni, Prajāpati, Dhātṛ, and Soma. For praise, radiance, brilliance, shining, and light, you are taken.',
    connection:
      'This directly connects the name Kṛttikā with a nakṣatra and Agni. The Pleiades identification and the wheel’s equal 13°20′ sector are separate astronomical information; this passage does not specify those boundaries.',
    context:
      'A formula in the ritual placement of the fire altar’s bricks. A longer list of stations and their deities follows, beginning with Kṛttikā rather than the wheel’s Aśvinī.',
    terms: [
      ['nakṣatra', 'A named station in this list.'],
      ['devatā', 'The deity associated with it.'],
    ],
    source: { label: 'Accented Sanskrit · PDF p. 177, printed p. 176', url: `${tsPdf}#page=177` },
    witness: { label: 'Sanskrit transcription · Muralidhara B. A.', url: tsHtml },
    translationSource: keith,
    editorialNote:
      'Continuous excerpt from 4.4.10, before Rohiṇī. The sandhi in devatāgne and somasyarce is retained. No pause or accent has been invented at the excerpt’s end.',
  },
  {
    id: 'ts-rohini',
    title: 'Rohiṇī and Prajāpati',
    citation: 'Taittirīya Saṃhitā 4.4.10 · Rohiṇī clause',
    tradition: 'Kṛṣṇa Yajurveda · Taittirīya · Saṃhitā text',
    sanskrit: 'रोहि॒णी नक्ष॑त्रं प्र॒जाप॑तिर्दे॒वता॑',
    iast: 'rohiṇī nakṣatraṃ prajāpatir devatā',
    accented: true,
    meaning: 'Rohiṇī is the nakṣatra; Prajāpati is the deity.',
    connection:
      'This is the list’s Rohiṇī–Prajāpati pairing. It attests the name and association. The Aldebaran identification, angular boundaries, and pādas displayed in the tool are additional information.',
    context:
      'The first Rohiṇī clause in the list, immediately after the opening Kṛttikā formula. The passage later uses Rohiṇī again with Indra; preserving the textual location matters.',
    terms: [
      ['Rohiṇī', 'The station named in this clause.'],
      ['Prajāpati', 'Its named deity here.'],
    ],
    source: { label: 'Accented Sanskrit · PDF p. 177, printed p. 176', url: `${tsPdf}#page=177` },
    witness: { label: 'Sanskrit transcription · Muralidhara B. A.', url: tsHtml },
    translationSource: keith,
    editorialNote:
      'A clause excerpt, not the entire anuvāka. The accent marks follow the accented source; no final daṇḍa has been added.',
  },
  {
    id: 'rv-renewal',
    title: 'The Moon’s renewal',
    citation: 'Ṛgveda 10.85.19',
    tradition: 'Ṛgveda · Śākala · Saṃhitā text',
    sanskrit:
      'नवो॑नवो भवति॒ जाय॑मा॒नोऽह्नां॑ के॒तुरु॒षसा॑मे॒त्यग्र॑म् ।\nभा॒गं दे॒वेभ्यो॒ वि द॑धात्या॒यन्प्र च॒न्द्रमा॑स्तिरते दी॒र्घमायुः॑ ॥',
    iast: 'navonavo bhavati jāyamāno ’hnāṃ ketur uṣasām ety agram |\nbhāgaṃ devebhyo vi dadhāty āyan pra candramās tirate dīrgham āyuḥ ||',
    accented: true,
    meaning:
      'Born again and again, he becomes ever new. As the sign of the days he goes before the dawns. Coming, he assigns the gods their share; the Moon extends a long life.',
    connection:
      'The repeated renewal is a useful companion to the phase cycle. The verse names Candramas, the Moon. It does not define a tithi as a 12° longitude interval; that is the mathematical definition used by the diagram.',
    context:
      'This verse occurs in the Sūryā wedding hymn. Its lunar imagery belongs to that poetic and ritual setting.',
    terms: [
      ['Candramas', 'The Moon.'],
      ['ketu', 'A sign or marker here; not the descending lunar node.'],
    ],
    source: {
      label: 'Accented Sanskrit · maṇḍala 10, PDF p. 52',
      url: 'https://sanskritdocuments.org/mirrors/rigveda/pdf/r10.pdf#page=52',
    },
    witness: {
      label: 'Accented Sanskrit transcription · Wikisource',
      url: wiki('ऋग्वेदः_सूक्तं_१०.८५'),
    },
    translationSource: {
      label: 'R. T. H. Griffith · hymn 10.85',
      url: 'https://sacred-texts.com/hin/rigveda/rv10085.htm',
    },
    editorialNote:
      'Verse text only; the surrounding commentary on the transcription page is not part of the quotation. Verse numbering is displayed in the citation.',
  },
  {
    id: 'rv-months',
    title: 'Twelve months and an additional month',
    citation: 'Ṛgveda 1.25.8',
    tradition: 'Ṛgveda · Śākala · Saṃhitā text',
    sanskrit: 'वेद॑ मा॒सो धृ॒तव्र॑तो॒ द्वाद॑श प्र॒जाव॑तः ।\nवेदा॒ य उ॑प॒जाय॑ते ॥',
    iast: 'veda māso dhṛtavrato dvādaśa prajāvataḥ |\nvedā ya upajāyate ||',
    accented: true,
    meaning:
      'Firm in his ordinances, he knows the twelve months with their offspring; he knows the one that is born in addition.',
    connection:
      'The hymn addresses Varuṇa. Its additional month is relevant to intercalation. Compare the lunar and seasonal years in the tool; the verse does not prescribe the later solar-ingress rule for inserting an adhikamāsa.',
    context:
      'A hymn praising Varuṇa’s knowledge and ordering of the world. The adjacent verses describe paths of birds, ships, and wind.',
    terms: [
      ['māsa', 'Month.'],
      ['upajāyate', 'Is born or arises in addition.'],
    ],
    source: {
      label: 'Accented Sanskrit · maṇḍala 1, PDF p. 17',
      url: 'https://sanskritdocuments.org/mirrors/rigveda/pdf/r01.pdf#page=17',
    },
    witness: {
      label: 'Accented Sanskrit transcription · Wikisource',
      url: wiki('ऋग्वेदः_सूक्तं_१.२५'),
    },
    translationSource: {
      label: 'R. T. H. Griffith · hymn 1.25',
      url: 'https://sacred-texts.com/hin/rigveda/rv01025.htm',
    },
    editorialNote:
      'The Sanskrit does not use the word adhikamāsa here. That term in the connection paragraph explains the calendrical relationship; it is not inserted into the verse.',
  },
  {
    id: 'ts-seasons',
    title: 'Month pairs and seasons',
    citation: 'Taittirīya Saṃhitā 4.4.11 · opening',
    tradition: 'Kṛṣṇa Yajurveda · Taittirīya · Saṃhitā text',
    sanskrit:
      'मधु॑श्च॒ माध॑वश्च॒ वास॑न्तिकावृ॒तू शु॒क्रश्च॒ शुचि॑श्च॒ ग्रैष्मा॑वृ॒तू नभ॑श्च नभ॒स्य॑श्च॒ वार्षि॑कावृ॒तू इ॒षश्चो॒र्जश्च॑ शार॒दावृ॒तू सह॑श्च सह॒स्य॑श्च॒ हैम॑न्तिकावृ॒तू तप॑श्च तप॒स्य॑श्च शैशि॒रावृ॒तू',
    iast: 'madhuś ca mādhavaś ca vāsantikāv ṛtū śukraś ca śuciś ca graiṣmāv ṛtū nabhaś ca nabhasyaś ca vārṣikāv ṛtū iṣaś corjaś ca śāradāv ṛtū sahaś ca sahasyaś ca haimantikāv ṛtū tapaś ca tapasyaś ca śaiśirāv ṛtū',
    accented: true,
    meaning:
      'Madhu and Mādhava belong to spring; Śukra and Śuci to summer; Nabhas and Nabhasya to the rains; Iṣa and Ūrj to autumn; Sahas and Sahasya to winter; Tapas and Tapasya to the cool season.',
    connection:
      'This connects a sequence of twelve month names with six seasons. These are the names used in this passage. The app’s Caitra–Citrā pairs belong to a different naming scheme.',
    context: 'The seasonal formula follows the nakṣatra list in the fire-altar material.',
    terms: [['ṛtu', 'Season; the verse groups them in pairs of months.']],
    source: { label: 'Accented Sanskrit · PDF p. 178, printed p. 177', url: `${tsPdf}#page=178` },
    witness: { label: 'Sanskrit transcription · Muralidhara B. A.', url: tsHtml },
    translationSource: keith,
    editorialNote:
      'Continuous opening excerpt, ending before agner antaḥ. Its sandhi and accents are preserved. English month names use their conventional citation forms.',
  },
  {
    id: 'rv-obscuration',
    title: 'The Sun obscured',
    citation: 'Ṛgveda 5.40.5',
    tradition: 'Ṛgveda · Śākala · Saṃhitā text',
    sanskrit:
      'यत्त्वा॑ सूर्य॒ स्व॑र्भानु॒स्तम॒सावि॑ध्यदासु॒रः ।\nअक्षे॑त्रवि॒द्यथा॑ मु॒ग्धो भुव॑नान्यदीधयुः ॥',
    iast: 'yat tvā sūrya svarbhānus tamasāvidhyad āsuraḥ |\nakṣetravid yathā mugdho bhuvanāny adīdhayuḥ ||',
    accented: true,
    meaning:
      'When Svarbhānu, the Asura, struck you, Sun, with darkness, the creatures looked about bewildered, like someone who does not know the terrain.',
    connection:
      'A poetic account of solar obscuration, relevant to the eclipse lesson. It supplies neither a node calculation nor the equation of Svarbhānu with the two points labelled Rāhu and Ketu in the diagram.',
    context:
      'In the following verses, Atri is associated with finding the concealed Sun. Read the full hymn for that continuation.',
    terms: [
      ['Sūrya', 'The Sun.'],
      ['tamas', 'Darkness.'],
      ['Svarbhānu', 'The named agent of obscuration in this account.'],
    ],
    source: {
      label: 'Accented Sanskrit · maṇḍala 5, PDF p. 19',
      url: 'https://sanskritdocuments.org/mirrors/rigveda/pdf/r05.pdf#page=19',
    },
    witness: {
      label: 'Accented Sanskrit transcription · Wikisource',
      url: wiki('ऋग्वेदः_सूक्तं_५.४०'),
    },
    translationSource: {
      label: 'R. T. H. Griffith · hymn 5.40',
      url: 'https://sacred-texts.com/hin/rigveda/rv05040.htm',
    },
    editorialNote:
      'Only verse 5 is quoted. No date or historical eclipse identification is inferred.',
  },
  {
    id: 'vj-year',
    title: 'The five-year yuga',
    citation: 'Vedāṅga Jyotiṣa · Yajus 28',
    tradition: 'Yājuṣa Jyotiṣa · reconstructed text, Part B',
    sanskrit:
      'त्रिशत्यह्नां सषष्टिरब्दः षट् चर्तवोऽयने ।\nमासा द्वादश सूर्याः स्युरेतत्पञ्चगुणं युगम् ॥',
    iast: 'triśatyahnāṃ saṣaṣṭir abdaḥ ṣaṭ cartavo ’yane |\nmāsā dvādaśa sūryāḥ syur etat pañcaguṇaṃ yugam ||',
    accented: false,
    meaning:
      'The year has 366 days, six seasons, two ayanas, and twelve solar months. Five such years form a yuga.',
    connection:
      'This is a calendrical model: 5 × 366 = 1,830 days. The app’s modern mean year is different; its motion has not been changed to fit this verse.',
    context: 'A numerical framework for organizing the Sun–Moon calendar.',
    terms: [
      ['yuga', 'A five-year cycle here.'],
      ['ayana', 'A half-year course of the Sun.'],
    ],
    source: { label: `${vjEdition} · printed pp. 38–39`, url: `${vjPdf}#page=42` },
    witness: { label: 'Sanskrit with variant readings · printed p. 29', url: `${vjPdf}#page=33` },
    translationSource: {
      label: 'Sastry / Sarma · Part B, §II.1, Text 11',
      url: `${vjPdf}#page=42`,
    },
    editorialNote:
      'Devanāgarī follows the reconstructed reading in Part B’s transliteration, rather than silently choosing among Part A’s variants. This edition prints these verses without Vedic accent notation; none has been added.',
  },
  {
    id: 'vj-months',
    title: '62 phase cycles, 67 stellar circuits',
    citation: 'Vedāṅga Jyotiṣa · Yajus 31ab',
    tradition: 'Yājuṣa Jyotiṣa · reconstructed text, Part B',
    sanskrit: 'सावनेन्दुस्तृमासानां षष्टिः सैकाद्विसप्तिका ।',
    iast: 'sāvanendus tṛmāsānāṃ ṣaṣṭiḥ saikādvisaptikā |',
    accented: false,
    meaning:
      'In the yuga there are 61 civil months, 62 lunar phase months, and 67 stellar lunar months.',
    connection:
      'Compare the two lunar returns in the diagram. This verse counts them across a five-year scheme. It does not state the modern 12° tithi formula.',
    context:
      'The verse continues with relationships among civil and solar month lengths; only its first half is quoted here.',
    terms: [
      ['sāvana', 'A civil measure based on successive sunrises.'],
      ['indu', 'The Moon; here, lunar phase months.'],
      ['tṛ / stṛ', 'The stellar term in this edition’s reading.'],
    ],
    source: { label: `${vjEdition} · printed pp. 41–42`, url: `${vjPdf}#page=45` },
    witness: { label: 'Sanskrit with variant readings · printed p. 30', url: `${vjPdf}#page=34` },
    translationSource: {
      label: 'Sastry / Sarma · Part B, §III.1, Text 15',
      url: `${vjPdf}#page=46`,
    },
    editorialNote:
      'First half of Yajus 31, using Part B’s reconstructed reading. The text and numbering belong to this edition. Its unaccented notation is preserved.',
  },
]

export const passageById = new Map(passages.map((p) => [p.id, p]))

export const topicPassages: string[][] = [
  [],
  ['rv-renewal', 'vj-months'],
  ['ts-krittika', 'ts-rohini'],
  ['vj-months', 'vj-year', 'rv-months'],
  ['rv-obscuration'],
  ['ts-seasons', 'rv-months', 'vj-year'],
]

export function stationPassages(index: number): string[] {
  return index === 2 ? ['ts-krittika'] : index === 3 ? ['ts-rohini'] : []
}

export type OpenPassage = (id: string, collection: string[]) => void
