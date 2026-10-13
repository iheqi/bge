# BGE 官网 Demo（bge）

Vue 3 + Element Plus + Vite 的官网 Demo，纯静态、无后端：页面数据基本是组件内 mock，只有少量记录（钱包地址、银行卡）存在 localStorage。构建产物由 GitHub Pages 托管（push main 触发部署）。

## 验证尺度

按改动类型选最小档位，不做全量回归：

| 改动类型 | 验证要求 |
| --- | --- |
| 文案 / 样式 / 布局微调 | `npm run build` + 用 Playwright MCP 打开受影响页面截图看一眼 |
| 组件交互（弹窗、表单、提交、切换、跳转） | `npm run build` + 用 Playwright MCP 真实点击驱动这条流程，读页面结果确认 |
| 语言包 / i18n 相关 | 额外跑 `npm run test:i18n`，只看失败清单有没有**新增**（见"已知基线"） |
| 文档 / 注释 | 不用验证 |

- Playwright MCP 已在项目级配好（`.mcp.json`，走本机 Chrome）。**不要**再手写 CDP / 无头 Chrome 脚本。新会话第一次用到时会提示信任该项目级 MCP，允许即可。
- 只驱动改动涉及的页面，未改动的页面最多截图确认没被波及。
- 交付或提交前 `npm run build` 必须通过。

## 已知基线（不是回归，不用去"修"）

- `npm run test:i18n` 固定有 **23 条失败**（Home / Report / Kyc / UserCenter 等页面的 mock 数据没有英文文案），退出码恒为 1。判断标准是失败清单是否新增。
- `npm run format:check` 固定有 **22 个文件失败**（历史遗留风格），不要顺手全量格式化。
- 仓库没有单元测试；`scripts/check-i18n.mjs`、`scripts/check-currency.mjs` 是两个可运行的校验脚本。

## 本地开发

- 开发服务器常在 http://localhost:5173/bge/（用户自己起的）。需要另起时用 `npm run dev`，5173 被占用会自动顺延到 5174 等。
- 路由在 `src/App.vue` 里按 pathname 匹配；新增页面要在那里加分支，`vite.config.js` 的插件会扫描源码中出现的 `/bge/hk/zh-CN/...` 链接并自动生成静态入口页。
- 多语言：中文文案在 `src/locales/zh-CN.json`，新增 key 必须同时补 `zh-TW.json` 和 `en.json`（三个包的 key 集合要一致，校验脚本会检查）。
