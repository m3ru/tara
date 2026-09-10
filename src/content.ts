export const lessons = [
  {
    short: 'Longitude',
    title: 'Geocentric ecliptic longitude',
    steps: [
      {
        title: 'Earth-centered sightlines',
        body: 'Geocentric means “Earth-centered.” Each ray begins at Earth’s center and points toward a body. Imagine extending it all the way to a distant circle of sky.',
        task: 'Drag the Moon around Earth. Follow its blue sightline.',
        action: 'Set the scene',
      },
      {
        title: 'The zero direction',
        body: 'Longitude, λ (“lambda”), is an angle around the ecliptic from an agreed zero direction. Viewed from the north side of this plane, increasing longitude runs counterclockwise.',
        task: 'Place the Moon at 90°. It is a quarter-turn from zero.',
        action: 'Show a quarter-turn',
      },
      {
        title: 'Longitude and latitude',
        body: 'The ecliptic is Earth’s orbital plane extended into the sky. Tilt the view: longitude is measured in this plane; latitude, β, measures how far above or below it a body appears.',
        task: 'Tilt the diagram. Change lunar latitude without changing longitude.',
        action: 'Tilt the plane',
      },
      {
        title: 'Sun–Moon longitude difference',
        body: 'The Sun and Moon each have a longitude measured from the same zero. The Moon’s eastward lead over the Sun is their longitude difference, wrapped into 0–360°.',
        task: 'The green arc begins at the Sun and ends at the Moon. This is the angle we will use for tithi.',
        action: 'Show their difference',
      },
    ],
  },
  {
    short: 'Tithi',
    title: 'Tithi and lunar phase',
    steps: [
      {
        title: 'Measuring from the Sun',
        body: 'Tithi follows the Moon’s eastward lead over the Sun. Every additional 12° begins another tithi. The 30 divisions turn with the Sun; they are not fixed to the stellar background.',
        task: 'Drag the Sun. Watch all 30 tithi boundaries turn with it.',
        action: 'Start at new Moon',
      },
      {
        title: 'Tithi boundaries',
        body: 'Tithi 1 spans 0° up to 12°; tithi 2 spans 12° up to 24°. At exactly 180°, the full-Moon instant, the waxing half ends and the first waning tithi begins.',
        task: 'Select any cell below, or step through a 12° boundary.',
        action: 'Approach full Moon',
      },
      {
        title: 'Waxing and waning',
        body: 'A 270° eastward lead is a waning Moon, even though its smaller separation from the Sun is 90°. Tithi needs a directed 0–360° difference, not just the smaller angle.',
        task: 'Compare first quarter with last quarter. Both are half lit.',
        action: 'Show last quarter',
      },
    ],
  },
  {
    short: 'Nakṣatra & rāśi',
    title: 'Nakṣatras, rāśis, and pādas',
    steps: [
      {
        title: 'The 27 nakṣatras',
        body: 'In the equal-sector system, a nakṣatra is 13°20′ of sidereal longitude. Early lunar stations were associated with stars and star groups; the geometric grid is a mathematical regularization.',
        task: 'Choose a nakṣatra on the wheel or in the list below.',
        action: 'Find Rohiṇī',
      },
      {
        title: 'The 12 rāśis',
        body: 'A rāśi spans 30°. Its boundary need not coincide with a nakṣatra boundary. The same Moon belongs to one interval on each ruler.',
        task: 'Turn on both grids. Look where a sign boundary cuts a nakṣatra.',
        action: 'Compare both grids',
      },
      {
        title: 'The four pādas',
        body: 'Each pāda spans 3°20′. There are 108 around the circle: four per nakṣatra and nine per rāśi. This same angular unit underlies the navāṃśa division.',
        task: 'Turn on pādas. Move the Moon through one station in four steps.',
        action: 'Reveal the quarters',
      },
    ],
  },
  {
    short: 'Lunar months',
    title: 'Sidereal and synodic months',
    steps: [
      {
        title: 'Mean lunar and solar motion',
        body: 'Begin at an imagined new Moon. The Moon advances about 13.176° per day against the stars. The Sun’s geocentric direction advances about 0.986° per day as Earth orbits the Sun.',
        task: 'Play the model and follow the two hands.',
        action: 'Start the clocks',
      },
      {
        title: 'The sidereal month',
        body: 'After 27.32 days, the Moon completes one turn in the stellar frame. But the Sun has moved about 27°. The Moon must keep going to regain the same phase.',
        task: 'Jump to one sidereal month. Notice the gap.',
        action: 'After 27.32 days',
      },
      {
        title: 'The synodic month',
        body: 'After about 29.53 days, their directions align again: one synodic month. Real orbital speeds vary; these are mean periods in a deliberately uniform model.',
        task: 'Jump to one synodic month, then compare the calendar years below.',
        action: 'After 29.53 days',
      },
    ],
  },
  {
    short: 'Eclipses',
    title: 'Lunar nodes and eclipses',
    steps: [
      {
        title: 'Orbital inclination',
        body: 'The Moon’s orbital plane is inclined by about 5.145° to the ecliptic. Equal Sun–Moon longitude gives new Moon, but a latitude offset can let the Moon miss the Sun.',
        task: 'Keep new Moon selected. Move the ascending node away from the Sun.',
        action: 'A new Moon that misses',
      },
      {
        title: 'Rāhu and Ketu',
        body: 'At the ascending node, Rāhu, the Moon crosses from south to north of the ecliptic. At the descending node, Ketu, it crosses from north to south. These are geometric points.',
        task: 'Place new Moon at a node: the two directions now align in latitude too.',
        action: 'Align at Rāhu',
      },
      {
        title: 'Lunar eclipses',
        body: 'At full Moon the Moon is opposite the Sun. Near a node it can enter Earth’s shadow. Eclipse size, timing, and visibility also depend on distances and the observer’s location.',
        task: 'Put full Moon at the opposite node and inspect the side view.',
        action: 'Full Moon at Ketu',
      },
    ],
  },
  {
    short: 'Pañcāṅga',
    title: 'Pañcāṅga and lunar months',
    steps: [
      {
        title: 'The five limbs',
        body: 'A pañcāṅga combines tithi, weekday, nakṣatra, yoga, and karaṇa. Four use celestial longitude; weekday requires a calendar date. Together they organize traditional timekeeping.',
        task: 'Change the Sun or Moon in the diagram. Follow the four computed limbs below.',
        action: 'Explore the five limbs',
      },
      {
        title: 'Lunar month names',
        body: 'Lunar month names are traditionally associated with full-Moon nakṣatras. These are broad naming relationships, not a rule that every full Moon must fall in its namesake sector.',
        task: 'Explore the month-name pairs below, then read about intercalation.',
        action: 'See the month names',
      },
      {
        title: 'Historical context',
        body: 'Vedic ritual timekeeping, mathematical astronomy, and later horoscopy overlap, but developed across different periods. Dates and routes of transmission remain subjects of scholarship.',
        task: 'Read the historical context below.',
        action: 'Historical context',
      },
    ],
  },
]

export const sources = [
  {
    title: 'Astronomical Almanac glossary',
    author: 'US Naval Observatory',
    topic: 'Coordinate origins, reference planes, and definitions',
    url: 'https://aa.usno.navy.mil/faq/asa_glossary',
  },
  {
    title: 'Eclipses and the Moon’s Orbit',
    author: 'Fred Espenak · NASA',
    topic: 'Lunar periods, orbital inclination, and nodes',
    url: 'https://eclipse.gsfc.nasa.gov/SEhelp/moonorbit.html',
  },
  {
    title: 'Rashtriya Panchang',
    author: 'India Meteorological Department',
    topic: 'Modern Indian calendar practice and calculated longitudes',
    url: 'https://mausam.imd.gov.in/responsive/rashtriyPanchang.php',
  },
  {
    title: 'Main Characteristics and Achievements of Ancient Indian Astronomy',
    author: 'K. S. Shukla · 1987',
    topic: 'Start here for the historical orientation',
    url: 'https://www.cambridge.org/core/journals/international-astronomical-union-colloquium/article/main-characteristics-and-achievements-of-ancient-indian-astronomy-in-historical-perspective/D38A1C4013A70D04FF55963CD0D14FF7',
  },
  {
    title: 'The Asterisms',
    author: 'A. K. Chakravarty · 1987',
    topic: 'Stars, identifying landmarks, and equal arcs; early dating proposals require caution',
    url: 'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/999C82CB30A46B5B7DA52730B7CD04ED/S0252921100105810a.pdf/asterisms.pdf',
  },
  {
    title: 'Mathematics in India',
    author: 'Kim Plofker · 2009',
    topic: 'The long view of mathematics in its astronomical setting · opening chapter',
    url: 'https://assets.press.princeton.edu/chapters/s8835.pdf',
  },
  {
    title: 'Astronomy and Astrology in India and Iran',
    author: 'David Pingree · 1963',
    topic: 'An influential account of transmission; read alongside later revisions',
    url: 'https://penelope.uchicago.edu/Thayer/E/Journals/ISIS/54/2/Astronomy_and_Astrology_in_India_and_Iran%2A.html',
  },
  {
    title: 'The Date and Nature of Sphujidhvaja’s Yavanajātaka Reconsidered',
    author: 'Bill M. Mak · 2013',
    topic: 'Why the transmission story and exact dates are less settled than once claimed',
    url: 'https://hssa-journal.org/index.php/hssa/article/view/7',
  },
]

export const historicalLayers = [
  {
    era: '2nd–1st millennium BCE',
    title: 'Stars, seasons, ritual time',
    body: 'Vedic texts connect celestial observation to ritual timing. Nakṣatras carry stellar, calendrical, and divine associations. Lists of 27 and 28 belong to this older background.',
    terms: 'Nakṣatra · Sun · Moon · ritual',
    source: 3,
  },
  {
    era: 'First millennium BCE · dating disputed',
    title: 'A computable lunisolar cycle',
    body: 'The Vedāṅga Jyotiṣa organizes a five-year yuga: 1,830 civil days, 62 synodic months, and 67 sidereal lunar circuits. These are parameters of a calendrical scheme, not exact modern orbital periods.',
    terms: 'Tithi · five-year yuga · intercalation',
    source: 3,
  },
  {
    era: 'Centuries around the start of the Common Era',
    title: 'An exchange of astral techniques',
    body: 'Indian traditions encountered Babylonian and Hellenistic techniques, including the twelve-sign zodiac and horoscopy, and transformed them. Individual texts and routes of transmission resist a single tidy chronology.',
    terms: 'Rāśi · ascendant · horoscopy',
    source: 6,
  },
  {
    era: '499–628 CE and beyond',
    title: 'Mathematical astronomy flourishes',
    body: 'Āryabhaṭa’s Āryabhaṭīya (499), Varāhamihira’s Pañcasiddhāntikā (around 550), and Brahmagupta’s Brāhmasphuṭasiddhānta (628) exemplify a computational tradition of planetary positions, trigonometry, and eclipses.',
    terms: 'Gaṇita · planetary models · eclipses',
    source: 5,
  },
  {
    era: 'Medieval and later traditions',
    title: 'Many branches of jyotiṣa',
    body: 'Gaṇita concerns mathematical astronomy; horā concerns horoscopy; saṃhitā covers a broad range of astral and omen literature. Modern “Vedic astrology” combines material from many historical layers.',
    terms: 'Gaṇita · horā · saṃhitā',
    source: 5,
  },
]

export const monthPairs = [
  ['Caitra', 'Citrā', 13],
  ['Vaiśākha', 'Viśākhā', 15],
  ['Jyeṣṭha', 'Jyeṣṭhā', 17],
  ['Āṣāḍha', 'Pūrvā / Uttarāṣāḍhā', 19],
  ['Śrāvaṇa', 'Śravaṇa', 21],
  ['Bhādrapada', 'Pūrvā / Uttarabhādrapadā', 24],
  ['Āśvina', 'Aśvinī', 0],
  ['Kārttika', 'Kṛttikā', 2],
  ['Mārgaśīrṣa', 'Mṛgaśīrṣa', 4],
  ['Pauṣa', 'Puṣya', 7],
  ['Māgha', 'Maghā', 9],
  ['Phālguna', 'Pūrvā / Uttaraphalgunī', 10],
] as const
