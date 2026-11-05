# 简洁月历

复用 httIsHere / Tina Huang 的 Apache-2.0 月历，保留原有日期高亮和两种周起始顺序。

- 俄语：`calendar.html?sw=1&dd=0&lang=ru`
- 英语：`calendar.html?sw=1&dd=0`；省略 `lang` 时行为不变。
- `sw=1` 从周日开始；省略 `sw` 从周一开始。
- `dd=1` 或 `black=true` 使用深色模式。
- `fit=1` 在窄容器中按原有规则缩放。

日历使用浏览器当前本地日期，不连接 Buildin 数据库。语言只影响月份和星期标签，不改变日期、周起始顺序、尺寸或主题。

来源、修改说明及字体许可见 [NOTICE.md](NOTICE.md)。
