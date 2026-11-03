# Cozy study widgets

Small, dependency-free calendar and analog clock for narrow Buildin or Notion
columns. These widgets use the viewer's device date and time; they do not
connect to a database, create reminders, store events, require an account, or
call an external API.

- Calendar: `https://zhangleiye68-jpg.github.io/buildin-reference-widgets/cozy-study/?widget=calendar`
- Clock: `https://zhangleiye68-jpg.github.io/buildin-reference-widgets/cozy-study/?widget=clock`
- Add `lang=ru` for Russian month/day names, buttons, dates, and accessible labels.
  Without this parameter the existing English interface is unchanged.
- Optional `theme=light` or `theme=dark`; without it, follow the embedded color scheme.

The calendar starts on Monday, highlights today, supports month navigation,
date selection, and a Today button. It handles all six calendar rows and
Gregorian leap years using native Date arithmetic. The clock includes hour,
minute, and second hands. The display refreshes across midnight and tab
visibility changes. English is the default; Russian uses the same layout and
device time. No template or account data is sent to this site.

Recommended embed heights: 320 pixels for the calendar and 340 pixels for the
clock. Both fit columns down to 160 pixels wide. MIT licensed; see LICENSE.
