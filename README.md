# Buildin 统一组件库

**[打开图文检索目录 →](https://zhangleiye68-jpg.github.io/buildin-reference-widgets/catalog/)**

当前收录 **50 个组件**和 **11 项封面／装饰素材**。自制组件源码、可嵌入地址、默认状态预览、公开社区来源及使用限制集中维护在这里。

## 以后制作模板的顺序

1. 先查看 [图文目录](https://zhangleiye68-jpg.github.io/buildin-reference-widgets/catalog/) 或 [组件 JSON](docs/catalog/components.json)，按用途、语言、尺寸和状态选择。
2. 使用条目的完整嵌入地址，保留需要的语言、主题和配置参数。检查示例内容、依赖及本地保存方式。
3. 本库没有合适的组件，再去网上寻找；选定后补回本库的链接、来源、预览和使用说明。
4. 新做的自制组件全部发布到 GitHub Pages，使用固定地址，不使用 ChatGPT 临时域名。

## 分类

| 用途 | 条目 |
| --- | --- |
| 日期与时钟 | 11 |
| 日历 | 4 |
| 天气 | 1 |
| 专注与计时 | 7 |
| 进度 | 6 |
| 习惯与阅读计数 | 6 |
| 任务与学习面板 | 4 |
| 音乐与白噪声 | 8 |
| 植物与动物 | 2 |
| 封面与装饰 | 12 |

## 可以从哪里调用

- [可搜索的图文目录](https://zhangleiye68-jpg.github.io/buildin-reference-widgets/catalog/)：看参考图、筛选并复制地址。
- [完整 Markdown 目录](docs/catalog/README.md)：在 GitHub 中直接浏览。
- [结构化索引](docs/catalog/components.json)：供后续模板任务检索，包含来源、参数、尺寸、预览、状态、依赖及替代项。
- [完整素材清单](docs/catalog/assets-manifest.json)：检索仓库中全部图片、动图和视频，不局限于首页精选素材。
- [新增条目示例](docs/catalog/entry-template.json)：添加条目时参考。

## 源码与来源

自制组件的源码和静态资源保留在 `docs/`；已有其他 GitHub 仓库中的自制组件通过目录中的源码链接统一定位。社区月历已收录在 [community/httishere-calendar](docs/community/httishere-calendar/)，保留 Apache-2.0 与字体许可，并说明本地改动。
简洁月历现可添加 `lang=ru` 显示俄语月份和星期；原有英语默认、窄栏适配、主题及周起始参数继续可用。
新增 [模板俄语适配入口](docs/template-ru/)，一个地址支持计时、问候钟、月历和日期进度等 11 种模式，保留原模板配置。
第三方服务若没有确认再分发许可，收录的是嵌入入口、来源和界面参考，不复制服务实现、音乐文件或私人模板数据。各条目单独标注许可与依赖，不把整个仓库统一宣称为同一种开源许可。

## 维护

修改 `docs/catalog/components.json` 后执行：

```sh
python3 scripts/render_catalog.py
python3 scripts/validate_catalog.py
```

新增组件同时提供默认状态 PNG 预览；预览不得包含私人模板、账号资料或个人保存的计数。页面可达和预览加载不代表所有交互都已测试，功能验证范围应写入条目。保留现有组件路径；仅调整目录不会修改已使用的 Buildin 页面。

目录更新：2026-11-05。
