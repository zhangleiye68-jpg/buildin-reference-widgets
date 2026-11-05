# 模板俄语适配组件

一个独立入口提供 11 种俄语组件。用于保留旧模板的功能、日期参数和周起始方式，不连接 Buildin 数据库，不读取账号，也不与其他计时器共享状态。

基础地址：`https://zhangleiye68-jpg.github.io/buildin-reference-widgets/template-ru/`

| widget 参数 | 用途 | 默认预览 |
| --- | --- | --- |
| `timer` | 25 分钟倒数；Старт 开始，Стоп 重置为 25:00；可输入自定义分钟 | [PNG](../catalog/previews/template-ru.png) |
| `clock` | 随时段改变的俄语问候、俄语日期与含秒时钟；保留 12 小时 AM/PM 格式 | [PNG](../catalog/previews/template-ru-clock.png) |
| `calendar-purple` | 紫色月历、当日圆点与当前周高亮 | [PNG](../catalog/previews/template-ru-calendar-purple.png) |
| `calendar-background` | 背景月历与当日大日期 | [PNG](../catalog/previews/template-ru-calendar-background.png) |
| `progress` | 年、月、周三条时间进度及当前时钟 | [PNG](../catalog/previews/template-ru-progress.png) |
| `progress-vertical` | 年、月、周三条纵向进度 | [PNG](../catalog/previews/template-ru-progress-vertical.png) |
| `range` | 自定义日期范围进度，保留结束日 23:59 规则 | [PNG](../catalog/previews/template-ru-range.png) |
| `countdown` | 指定事件日期的剩余天数／当日／已过去天数 | [PNG](../catalog/previews/template-ru-countdown.png) |
| `day` | 俄语星期、日期、当前时间与当日进度 | [PNG](../catalog/previews/template-ru-day.png) |
| `week` | 周一起始，累计高亮到今天的七个星期格 | [PNG](../catalog/previews/template-ru-week.png) |
| `holidays` | 原模板固定的 2025 年中国节假日及日期范围，名称和状态改为俄语 | [PNG](../catalog/previews/template-ru-holidays.png) |

例如：`?widget=timer&lang=ru&compact=1`。省略 `widget` 时为计时器。此独立入口默认为俄语，其他已有组件的默认行为没有改变。

## 参数与兼容范围

- 旧模板的 `e` 配置可原样保留。只按公开前端格式解码 JSON，取日期、名称、颜色等允许字段；从不执行其中的字符串。
- `font_color`、`bg_color` 保留配色；`dd=1` 或原配置的 `black` 启用深色，显式 `dd=0` 优先保留浅色。
- 月历保留 `sw`／原配置 `monday` 所决定的周起始；省略时周一起始。
- 倒数卡保留 `day`；范围进度保留 `start`、`end` 或原 `date_range`。
- `ru_name` 只覆盖面向用户的俄语名称，不改原配置中的名称、日期或其他参数。
- 界面随容器宽度适配；`compact=1` 可在迁移地址中保留为紧凑模式标记。

时间进度使用原模板的整日计算方式：周日为 7/7，月份使用当前日序号；倒数卡保留原来的向零取整规则。旧式日历保留原模板的闰年判断，而不是另换计算规则。节假日模式明确保留 2025 年的中国日程，不会自动换成其他年份或俄罗斯假期。

预览使用通用默认设置，不含私人模板正文、原加密参数、个人事件或账号资料。背景月历和配置的倒数背景仍引用作者公开 HTTPS 图片，没有把原图片文件复制入库。

源码与归属见 [NOTICE.md](NOTICE.md)。
