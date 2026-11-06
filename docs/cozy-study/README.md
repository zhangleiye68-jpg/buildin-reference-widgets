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

## 可配置俄语入口

原有默认地址保持不变。`lang=ru&variant=minimal` 启用透明、简洁样式：

- `widget=calendar`：周一开始、本地日期、35或42格、非本月淡化，只有左右翻月和标题回今天；日格不可选择。保留本地跨午夜刷新，无农历或节假日数据。`week_color`、`hover_color`、`today_background`、`nav_color`、`title_color`、`date_color` 对应星期、悬停、今天、箭头、标题和日期数字配色；`dark_background` 为系统深色背景。
- `widget=digital-clock`：本地24小时HH、mm两块、俄语星期和日期，无秒和AM/PM；每秒更新。`foreground`、`local_background`、`dark_background` 配置文字及系统深浅背景。
- `widget=clock&smooth=1&seconds_dial=1&digital=1&digital_seconds=0&show_date=0`：平滑模拟指针、秒针及HH:mm读数，每50毫秒更新。`indicators=1` 保留12个小时刻度（简洁变体不显示数字或小刻度）；`foreground`、`clock_face`、`background` 为指针、表盘与页面配色。使用访客浏览器当地时间，不固定为任何城市。

HEX配色参数须URL编码。不读取服务账号，不保存状态，不连接Buildin数据库。以上为独立实现的通用显示，不分发第三方专有源码或私人实例配置。

简洁月历实际预览：[PNG](../catalog/previews/cozy-minimal-calendar.png)；数字钟实际预览：[PNG](../catalog/previews/local-digital-clock-ru.png)。

简洁平滑指针钟实际预览：[PNG](../catalog/previews/cozy-minimal-clock.png)，12小时刻度、无数字与小刻度。
