# httIsHere legacy widget variants in Russian

These are the variants that are not already covered by the catalogued `template-ru` and simple-calendar components. They retain the Apache-licensed source behavior, with Russian display labels. Attribution and dependency licenses are in [NOTICE.md](NOTICE.md).

Base: `https://zhangleiye68-jpg.github.io/buildin-reference-widgets/community/httishere-ru/`

| File | Function and constraints | Generic preview |
| --- | --- | --- |
| `v3-month.html` | Source month grid highlighting every elapsed date, with configured font/highlight color and week start. | [PNG](../../catalog/previews/httishere-ru-v3-month.png) |
| `calendarByWeek.html` | Month calendar with the original `start`/`end` or `date_range` highlight, including the original adjacent-month behavior; Monday start. | [PNG](../../catalog/previews/httishere-ru-calendarByWeek.png) |
| `days-matter.html` | Square event card; absolute day difference rounded up, target midnight. Requires `day`; optional `name`. | [PNG](../../catalog/previews/httishere-ru-days-matter.png) |
| `days-matter2.html` | Outlined event card with the same midnight/ceiling algorithm. Requires `day`; optional `name`. | [PNG](../../catalog/previews/httishere-ru-days-matter2.png) |
| `new-blue-week.html` | Current week's dates, today highlight and year's percentage; `sw` and original theme/color config retained. | [PNG](../../catalog/previews/httishere-ru-new-blue-week.png) |
| `new-highlight-week.html` | Dates for the week containing `s` (or configured `day`), otherwise this week; retains week-start option. | [PNG](../../catalog/previews/httishere-ru-new-highlight-week.png) |
| `progress.html` | Original year/week bars, date, and live clock. | [PNG](../../catalog/previews/httishere-ru-progress.png) |
| `quarterly-progress.html` | Original year bar and quarter milestones; preserves `year`, including past/future handling. | [PNG](../../catalog/previews/httishere-ru-quarterly-progress.png) |
| `quote3.html` | Plain quotation; preserves original text/content and color config, with a Cyrillic-capable system font and separate quote-mark space. | [PNG](../../catalog/previews/httishere-ru-quote3.png) |
| `quote-EN.html` | Decorative quotation variant; Russian text uses a Cyrillic-capable system font. | [PNG](../../catalog/previews/httishere-ru-quote-EN.png) |
| `quote.html` | Raised/embossed quotation variant. | [PNG](../../catalog/previews/httishere-ru-quote.png) |
| `swiper.html` | Original two-image quotation carousel, Russian captions, five-second autoplay and one-second transition; original remote source images retained; a solid background keeps captions readable if the images are unavailable. | [PNG](../../catalog/previews/httishere-ru-swiper.png) |
| `v203-mul-days-matter.html` | Multiple configured target dates and progress bars; retains `tasks`, `created`, and original floor rounding. | [PNG](../../catalog/previews/httishere-ru-v203-mul-days-matter.png) |
| `v220-rotate-clock.html` | Animated 24-hour flip clock including seconds, date, and weekday. | [PNG](../../catalog/previews/httishere-ru-v220-rotate-clock.png) |
| `v230-countdown-p.html` | Absolute difference shown as days/hours/minutes, retaining original minute refresh. | [PNG](../../catalog/previews/httishere-ru-v230-countdown-p.png) |

Keep all original query parameters, especially `e`, dates, `s`, `start`, `end`, `year`, `sw`, `dd`, colors and `vv`. The optional `ru_name` and `ru_text` parameters replace display text only. `ru_tasks` is a JSON array of translated task names with exactly the same length/order as the original configured task list; dates and creation time are untouched. URL-encode display values. Do not publish private instance URLs in a catalog.

The components do not save personal state and do not synchronize Buildin data. Previews use generic source defaults or explicitly labelled demo dates. A fixed historical date remains historical after translation. This set does not replace author visitor counters, remote random-quote feeds, weather services, or unreadable legacy configurations.
