# Tārā — Indian astronomy

A local, interactive textbook for understanding Indian astronomy through geometry. Built with React, TypeScript, Vite, and SVG.

## Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

```bash
npm run build       # Type-check and create dist/
npm run preview     # Serve the production build
npm test            # Astronomical calculations and boundary cases
npm run test:e2e    # Browser interactions and responsive layouts
```

The browser tests require Chromium: `npx playwright install chromium`.

## Explorations

1. **Longitude:** drag the Sun and Moon, measure geocentric ecliptic longitude, tilt the plane to explore latitude, switch the reference zero, and compare Earth-centered and Sun-centered origins.
2. **Tithi:** directed longitude difference, the 30 tithis, phase landmarks, exact interval boundaries, and sunrise sampling of unequal tithi intervals.
3. **Nakṣatra and rāśi:** selectable nakṣatra and rāśi sectors, the 108 pādas, all 27 stations and their stellar associations, and proportional Viṃśottarī daśā balance.
4. **Lunar months:** synchronized geocentric and heliocentric diagrams, sidereal and synodic returns, and seasonal drift in a twelve-month lunar calendar.
5. **Eclipses:** an inclined lunar path, ascending and descending nodes, and longitude versus latitude alignment.
6. **Pañcāṅga:** computed pañcāṅga limbs, month-name associations, historical layers, and a linked reading list.

The guide offers short steps and scene-setting experiments. Every diagram handle also supports keyboard input: arrows change longitude by 1°, Shift + arrow by 10°. Number fields provide exact control. Scene state is saved in local storage; “Copy this view” encodes it in the URL. Clear a saved scene using Reset, or open `/?scene={}` for the initial scene. No backend or account is required. Fonts and their OFL licenses are bundled locally.

## Model conventions

This is a teaching model, not a dated ephemeris or festival calculator.

- Main positions are Earth-centered directions in a conventional sidereal frame. Distances and body sizes are schematic.
- Tropical longitude adds an illustrative 24° ayanāṃśa. This is not a current value for a named convention. Sidereal sector boundaries remain fixed when the displayed longitude zero changes.
- Tithi uses `(moon − sun) mod 360`, split into 30 half-open 12° intervals. Exactly 180° begins the first waning tithi; Pūrṇimā is the interval immediately before it.
- Nakṣatras span 360/27 degrees; pādas span 360/108 degrees. Numerical tolerances prevent floating-point errors at exact rational boundaries.
- The lunar latitude model is `atan(tan(inclination) × sin(longitude − ascendingNode))`, with inclination 5.145°. The tilted diagram projects that geometry; the unrolled strip expands the latitude scale.
- The 3D smaller Sun–Moon separation is distinct from the directed longitude difference. Tithi depends on the latter.
- Phase portraits use the coplanar, distant-Sun approximation `(1 − cos Δλ) / 2`, with diagrammatic orientation.
- Animated motion uses a 27.32166-day mean sidereal lunar month and 365.25636-day sidereal year. The synodic month is derived from their relative rates. Seasonal drift uses a 365.2422-day tropical year.
- The month clock begins at an imagined new Moon and keeps all its views synchronized. Other chapters preserve the manually selected Sun and Moon when navigating.
- Tithi sunrise diagrams use invented interval lengths to demonstrate sampling. Actual calendar dates require accurate ephemerides, a location, sunrise calculations, and regional conventions.
- Historical associations and dates have variants and uncertainties. Source links and model notes are available in the interface. The optional daśā calculation describes a traditional rule without asserting predictive validity.

## Code map

- `src/astronomy.ts`: pure calculations and traditional station data.
- `src/content.ts`: guided lessons, history, and sources.
- `src/components/SkyDiagram.tsx`: interactive SVG and Moon phases.
- `src/components/CoordinateAtlas.tsx`: observer-origin comparison.
- `src/components/LessonDetails.tsx`: deeper interactive explorations.
- `src/App.tsx`: scene state, navigation, controls, and reference dialog.
- `src/styles.css`: responsive paper theme.
- `tests/exploration.spec.ts`: browser interaction tests.

## Vedic passages

“Read passages” connects the lessons to eight excerpts from the Ṛgveda, Taittirīya Saṃhitā, and Vedāṅga Jyotiṣa. The reader stays beside the diagram on desktop and opens as a modal sheet on mobile. Sanskrit is typeset in locally bundled Shobhika 1.05, with source accent marks retained, optional IAST, English paraphrases, and precise source-page links. The two Jyotiṣa excerpts retain their edition’s unaccented notation.

Opening a passage pauses animation and preserves the scene. Copying a view includes the passage; closing returns to the guide. All excerpts are also available in Notes & sources → Vedic passages.

See [Passage text and typography](docs/PASSAGE_SOURCES.md) for checked sources, font handling, and validation limits, and [the original design plan](docs/VEDIC_PASSAGES_PLAN.md) for the broader passage map. The font audit script uses the optional development dependency `fonttools[woff]`; the site itself needs no Python dependencies.
