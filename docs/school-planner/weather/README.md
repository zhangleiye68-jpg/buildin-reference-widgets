# 俄语天气

入口：<https://zhangleiye68-jpg.github.io/buildin-reference-widgets/school-planner/weather/>

默认保留洛杉矶、摄氏、五日预报、浅色文字及透明底色。支持 `lat`、`lon`、`city`、`tz` 设置坐标、俄语城市显示名和 IANA 时区。`forecast_days=7` 启用七日，其他值维持五日；七日自然宽度 484px，整体随 iframe 等比缩放。`theme=light` 为浅色页面使用深色文字，`greyscale=1` 显示灰度天气图标。

数据由 Open-Meteo 提供，当前温度与预报随服务更新，十五分钟刷新；最近一小时内的缓存可用于短暂断网，过十五分钟明确显示“数据已过时”。无数据时显示“Нет данных”，不生成温度。缓存键包含坐标、时区和预报天数，五日与七日互不混用。

这不是 Indify 的数据服务：保留相同坐标、摄氏单位、七日数量和灰度图标时，来源、预报模型、刷新节奏与实时数值仍可能不同。不迁移第三方账号或自定义按钮，不连接 Buildin 数据库。天气数据归属通过组件中的 Open-Meteo 链接标明。
