# 多语言维护

- `zh-CN.json`：简体中文；`zh-TW.json`：繁体中文（香港用语）；`en.json`：英文。
- 静态模板使用 `$t(key)`；新增键请使用有意义的名称，并同时更新三个语言包。
- 现有数据数组使用 `tr(value)` 展示翻译。`source-keys.json` 将原始文案映射到语言键，避免更改消息分类、筛选条件或已保存的数据。
- 表格默认单元格使用 `formatCell`；自定义插槽使用 `tr(value)`。
- `LanguageSwitcher.vue` 提供语言入口。语言存储在 `bge-locale`，切换不改变 URL 或当前业务状态。
- Element Plus 语言通过根组件的 `el-config-provider` 同步切换。
- 繁体初稿使用 OpenCC 香港词汇转换，语言包为独立静态文件，可直接人工修订，无运行时转换依赖。
- `npm run test:i18n` 校验语言包完整性、三语言渲染、语言保存和业务数据保持不变；浏览器视觉和鼠标交互需要另行验证。
