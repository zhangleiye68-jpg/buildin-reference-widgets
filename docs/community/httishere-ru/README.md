# httIsHere legacy widget variants in Russian

These are the variants that are not already covered by the catalogued `template-ru` and simple-calendar components. They retain the Apache-licensed source behavior, with Russian display labels. Attribution and dependency licenses are in [NOTICE.md](NOTICE.md).

Base: `https://zhangleiye68-jpg.github.io/buildin-reference-widgets/community/httishere-ru/`

| File | Function and constraints |
| --- | --- |
| `v3-month.html` | Source month grid highlighting every elapsed date, with configured font/highlight color and week start. |
| `calendarByWeek.html` | Month calendar with the original `start`/`end` or `date_range` highlight, including the original adjacent-month behavior; Monday start. |
| `days-matter.html` | Square event card; absolute day difference rounded up, target midnight. Requires `day`; optional `name`. |
| `days-matter2.html` | Outlined event card with the same midnight/ceiling algorithm. Requires `day`; optional `name`. |
| `new-blue-week.html` | Current week's dates, today highlight and year's percentage; `sw` and original theme/color config retained. |
| `new-highlight-week.html` | Dates for the week containing `s` (or configured `day`), otherwise this week; retains week-start option. |
| `progress.html` | Original year/week bars, date, and live clock. |
| `quarterly-progress.html` | Original year bar and quarter milestones; preserves `year`, including past/future handling. |
| `quote3.html` | Plain quotation; preserves original text/content and color config, with a Cyrillic-capable system font and separate quote-mark space. |
| `quote-EN.html` | Decorative quotation variant; Russian text uses a Cyrillic-capable system font. |
| `quote.html` | Raised/embossed quotation variant. |
| `swiper.html` | Original two-image quotation carousel, Russian captions, five-second autoplay and one-second transition; original remote source images retained; a solid background keeps captions readable if the images are unavailable. |
| `v203-mul-days-matter.html` | Multiple configured target dates and progress bars; retains `tasks`, `created`, and original floor rounding. |
| `v220-rotate-clock.html` | Animated 24-hour flip clock including seconds, date, and weekday. |
| `v230-countdown-p.html` | Absolute difference shown as days/hours/minutes, retaining original minute refresh. |

Keep all original query parameters, especially `e`, dates, `s`, `start`, `end`, `year`, `sw`, `dd`, colors and `vv`. The optional `ru_name` and `ru_text` parameters replace display text only. `ru_tasks` is a JSON array of translated task names with exactly the same length/order as the original configured task list; dates and creation time are untouched. URL-encode display values. Do not publish private instance URLs in a catalog.

The components do not save personal state and do not synchronize Buildin data. Previews use generic source defaults or explicitly labelled demo dates. A fixed historical date remains historical after translation. This set does not replace author visitor counters, remote random-quote feeds, weather services, or unreadable legacy configurations.
