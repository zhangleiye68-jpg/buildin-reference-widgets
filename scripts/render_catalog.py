#!/usr/bin/env python3
"""Render the human-readable index from the component registry, using stdlib only."""
import collections,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'docs/catalog'
data=json.loads((BASE/'components.json').read_text())
items=data['components'];assets=data['assets']
statuses={'ready':'可用','sample':'含示例内容','needs-review':'待复核','retired':'已停用参考','unavailable':'当前不可用','reference':'内部占位'}
owners={'self':'自制','community':'社区源码','external':'第三方引用'}
lines=['# Buildin 统一组件库','',f'更新：{data["updated_at"]} · {len(items)} 个组件 · {len(assets)} 项素材','',
       '[打开可搜索的图文目录](https://zhangleiye68-jpg.github.io/buildin-reference-widgets/catalog/) · [读取完整 JSON](components.json)','',
       '以后添加模板，先从本库选择；没有合适的，再寻找新的公开来源，并把新选中的组件补充回来。自制组件使用 GitHub Pages 固定地址。','',
       '预览均为组件默认状态，使用说明包含语言、尺寸、参数、来源、许可、外部依赖和已知限制。已失效链接保留作参考，不用于新模板。','']
for category in dict.fromkeys(x['category']for x in items+assets):
    lines+=['## '+category,'']
    for e in [x for x in items+assets if x['category']==category]:
        lines += [f'### {e["name"]} · {e["language"]}','',
                  f'![{e["name"]}默认预览]({e["preview"]})','',
                  f'{owners[e["ownership"]]} · {statuses[e["status"]]} · 建议 {e["recommended_size"]["width"]} × {e["recommended_size"]["height"]} px','',
                  e['description'],'',f'[打开组件或素材]({e["embed_url"]}) · [原始来源]({e["source_url"]})'+(f' · [源码]({e["code_url"]})'if e['code_url']else''),'',
                  '嵌入／素材地址：','', '```text',e['embed_url'],'```','']
        if e['notes']:lines += ['- '+n for n in e['notes']]+['']
        lines += ['许可：'+e['license']['label']+(f' · [许可与归属]({e["license"]["url"]})'if e['license']['url']else''),'',f'目录 ID：`{e["id"]}`','']
(BASE/'README.md').write_text('\n'.join(lines)+'\n')
counts=collections.Counter(x['category']for x in items+assets)
main=['# Buildin 统一组件库','',
      '**[打开图文检索目录 →](https://zhangleiye68-jpg.github.io/buildin-reference-widgets/catalog/)**','',
      f'当前收录 **{len(items)} 个组件**和 **{len(assets)} 项图片／动图／视频素材**。自制组件源码、可嵌入地址、默认状态预览、公开社区来源及使用限制集中维护在这里。','',
      '## 以后制作模板的顺序','',
      '1. 先查看 [图文目录](https://zhangleiye68-jpg.github.io/buildin-reference-widgets/catalog/) 或 [组件 JSON](docs/catalog/components.json)，按用途、语言、尺寸和状态选择。',
      '2. 使用条目的完整嵌入地址，保留需要的语言、主题和配置参数。检查示例内容、依赖及本地保存方式。',
      '3. 本库没有合适的组件，再去网上寻找；选定后补回本库的链接、来源、预览和使用说明。',
      '4. 新做的自制组件全部发布到 GitHub Pages，使用固定地址，不使用 ChatGPT 临时域名。','',
      '## 分类','', '| 用途 | 条目 |','| --- | --- |']
main += [f'| {k} | {v} |'for k,v in counts.items()]
main += ['', '## 可以从哪里调用','',
         '- [可搜索的图文目录](https://zhangleiye68-jpg.github.io/buildin-reference-widgets/catalog/)：看参考图、筛选并复制地址。',
         '- [完整 Markdown 目录](docs/catalog/README.md)：在 GitHub 中直接浏览。',
         '- [结构化索引](docs/catalog/components.json)：供后续模板任务检索，包含来源、参数、尺寸、预览、状态、依赖及替代项。',
         '- [完整素材清单](docs/catalog/assets-manifest.json)：检索仓库中全部图片、动图和视频，不局限于首页精选素材。',
         '- [之前模板的动态素材](docs/catalog/DYNAMIC-MEDIA.md)：查看 GIF、循环视频的尺寸、时长、帧数和原文件地址。',
         '- [新增条目示例](docs/catalog/entry-template.json)：添加条目时参考。','',
         '## 源码与来源','',
         '自制组件的源码和静态资源保留在 `docs/`；已有其他 GitHub 仓库中的自制组件通过目录中的源码链接统一定位。社区月历已收录在 [community/httishere-calendar](docs/community/httishere-calendar/)，保留 Apache-2.0 与字体许可，并说明本地改动。',
         '简洁月历现可添加 `lang=ru` 显示俄语月份和星期；原有英语默认、窄栏适配、主题及周起始参数继续可用。',
         '新增 [模板俄语适配入口](docs/template-ru/)，一个地址支持计时、问候钟、月历和日期进度等 11 种模式，保留原模板配置。',
         '[经典组件俄语变体](docs/community/httishere-ru/) 收录另外 15 个独立入口，保留来源的周定位、日期高亮、倒数日、季度与多事件进度、引用轮播和翻页时钟行为。',
         '[俄语专注倒计时](docs/focus-timer-ru/) 提供默认 60 秒和五档预设，支持窄栏、暂停继续与复位。',
         '[可配置本地面板](docs/cozy-study/README.md) 支持简洁月历、双块数字钟和平滑模拟钟；[兼容时间进度](docs/school-planner/time-progress/LEGACY.md) 独立保留按分钟、日序与寿命计算的规则。',
         '[俄语天气](docs/school-planner/weather/README.md) 保留默认五日，可选七日与浅色页面配色；七日模式支持窄至 77px 的纵向布局，数据来自 Open-Meteo。',
         '第三方服务若没有确认再分发许可，收录的是嵌入入口、来源和界面参考，不复制服务实现、音乐文件或私人模板数据。各条目单独标注许可与依赖，不把整个仓库统一宣称为同一种开源许可。','',
         '## 维护','',
         '修改 `docs/catalog/components.json` 后执行：','',
         '```sh','python3 scripts/render_catalog.py','python3 scripts/validate_catalog.py','```','',
         '新增组件同时提供默认状态 PNG 预览；预览不得包含私人模板、账号资料或个人保存的计数。页面可达和预览加载不代表所有交互都已测试，功能验证范围应写入条目。保留现有组件路径；仅调整目录不会修改已使用的 Buildin 页面。','',
         f'目录更新：{data["updated_at"]}。']
(ROOT/'README.md').write_text('\n'.join(main)+'\n')
print(f'Rendered {len(items)} components and {len(assets)} assets')
