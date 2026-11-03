# School planner widgets

Production files migrated from our existing School Planner widget site on 2026-11-03. The existing behavior, locale options, query parameters, and local-storage keys are preserved.

Use stable GitHub Pages URLs under `https://zhangleiye68-jpg.github.io/buildin-reference-widgets/school-planner/`.

- `date.html?view=date&locale=ru` — date card
- `reader.html?view=reader&locale=ru` — reading counter
- `banner.html?view=banner` — pond video
- `dashboard.html?view=dashboard` — combined study dashboard
- `flip-clock/?locale=ru` — dark flip clock
- `green-flip-clock/?locale=ru` — green flip clock
- `goals/read/`, `goals/drink/`, `goals/exercise/` — independent goal counters
- `time-progress/?locale=ru` — time progress
- `weather/?locale=ru&theme=dark` — weather

The individual HTML entry points avoid multiple Buildin embeds sharing one query-only URL path. Third-party asset notices are retained in `goals/THIRD-PARTY-NOTICES.md` and `goals/assets/`.

Counts and preferences are stored in the viewer's browser. A hosting-domain change does not automatically transfer another browser's local storage. No user state is committed to this repository.
