# Apple 液态玻璃搜索主题 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新建可由 ACbaidu/Less.js 直接应用的 `apple-glass.less`，在真实 Google 搜索页实现并闭环校准 WWDC25 深色烟熏液态玻璃风格。

**Architecture:** 单个 Less 文件承载视觉令牌、玻璃 mixin、Google 稳定容器覆写、响应式及降级规则。单个 Node.js 标准库自检脚本验证源码契约，并在可用 Less 编译器下编译。最终通过 ACbaidu UI 保存启用，在真实 Google 搜索页截图检查并迭代。

**Tech Stack:** Less.js、CSS、Node.js 标准库、Chrome、ACbaidu

## Global Constraints

- 新主题文件名固定为 `apple-glass.less`；不修改或覆盖现有 Google 主题。
- 仅改变 Google 搜索页视觉；不隐藏、删除、过滤或重排搜索内容。
- 深海军蓝背景、炭灰烟熏玻璃、局部灰白高光、短深阴影、Apple 蓝交互态。
- 不使用紫蓝霓虹大渐变、倾斜海报拼贴、远程图片、字体或脚本。
- 保留 Google 原始单列结果流及知识面板布局。
- 桌面与移动端无横向滚动、重叠或截断。
- 明确 `:focus-visible`；尊重 `prefers-reduced-motion`。
- 同时支持 `backdrop-filter`、`-webkit-backdrop-filter` 及高不透明降级。
- 以 ACbaidu 中真实保存启用、Google 搜索页真实渲染截图作为端到端验收。

---

### Task 1: 主题契约与烟熏玻璃基础

**Files:**
- Create: `apple-glass.less`
- Create: `test/apple-theme-contract.test.js`

**Interfaces:**
- Consumes: ACbaidu 的 Less.js 编译环境；Google 搜索页 `html`、`body`、`#searchform`。
- Produces: 可独立导入的 `apple-glass.less`；验证入口 `node test/apple-theme-contract.test.js`。

- [ ] **Step 1: 写入失败契约测试**

测试读取 `apple-glass.less`，断言固定令牌、无远程资源、无隐藏规则；若本地存在 `lessc`，额外执行编译。

- [ ] **Step 2: 运行并确认缺少主题文件**

Run: `node test/apple-theme-contract.test.js`
Expected: FAIL，包含 `ENOENT` 或缺少 `apple-glass.less`。

- [ ] **Step 3: 写入最小主题基础**

定义：

```less
@glass-blur: 24px;
@panel-radius: 22px;
@control-radius: 999px;
@mobile-breakpoint: 900px;

:root {
  --apple-page: #060914;
  --apple-page-raised: #0b1222;
  --apple-glass: rgba(18, 24, 38, 0.64);
  --apple-glass-solid: rgba(13, 18, 30, 0.96);
  --apple-highlight: rgba(255, 255, 255, 0.16);
  --apple-edge: rgba(151, 181, 232, 0.14);
  --apple-text: #f5f7fb;
  --apple-muted: #aeb7c8;
  --apple-blue: #0a84ff;
}
```

页面背景仅使用低对比冷黑环境光；不得形成霓虹光斑。

- [ ] **Step 4: 运行契约测试**

Run: `node test/apple-theme-contract.test.js`
Expected: PASS，输出 `apple theme contract ok`；若无 `lessc`，输出明确的编译跳过说明后仍完成源码契约。

---

### Task 2: Google 结果容器与 Apple 控件语言

**Files:**
- Modify: `apple-glass.less`
- Modify: `test/apple-theme-contract.test.js`

**Interfaces:**
- Consumes: Task 1 的视觉令牌。
- Produces: `.apple-glass-panel()` mixin；搜索栏、结果卡、知识面板、富媒体和分页样式。

- [ ] **Step 1: 扩充失败契约**

断言编译输出或源码包含：

```text
.apple-glass-panel
#searchform
.RNNXgb
.MjjYud
.kp-wholepage
#botstuff
focus-visible
@supports not
-webkit-backdrop-filter
```

同时断言不存在 `display: none`、`visibility: hidden`、负万像素位移。

- [ ] **Step 2: 运行并确认首个组件契约失败**

Run: `node test/apple-theme-contract.test.js`
Expected: FAIL，指出缺少 `.apple-glass-panel` 或搜索容器规则。

- [ ] **Step 3: 实现组件样式**

Mixin 使用半透明炭灰背景、`1px` 冷白边、内高光、短深阴影、`24px` 模糊。顶部搜索区使用更实的玻璃背景。普通结果、富媒体外层、知识面板、相关搜索和分页只改外层，不改内部布局。导航、筛选项、分页按钮使用胶囊圆角；Apple 蓝只用于链接、选中和焦点。

- [ ] **Step 4: 实现状态与降级**

加入：

```less
:where(a, button, input, textarea, select, [tabindex]):focus-visible {
  outline: 3px solid var(--apple-blue) !important;
  outline-offset: 3px !important;
}

@supports not ((backdrop-filter: blur(1px))) {
  /* 所有玻璃容器使用 --apple-glass-solid */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: 运行契约测试**

Run: `node test/apple-theme-contract.test.js`
Expected: PASS。

---

### Task 3: 响应式与静态视觉验证

**Files:**
- Modify: `apple-glass.less`
- Modify: `test/apple-theme-contract.test.js`

**Interfaces:**
- Consumes: Task 2 的组件规则。
- Produces: `<900px` 和 `<600px` 的安全回退；静态契约覆盖。

- [ ] **Step 1: 添加失败响应式契约**

断言存在 `@media (max-width: 899px)`、`@media (max-width: 599px)`、`overflow-x: clip`，并禁止主题为结果容器设置双栏网格。

- [ ] **Step 2: 运行并确认失败**

Run: `node test/apple-theme-contract.test.js`
Expected: FAIL，指出缺少移动断点。

- [ ] **Step 3: 实现移动规则**

`<900px` 减少页面间距、卡片内边距、圆角；`<600px` 清除固定宽度和最小宽度。保持 Google 原始结果顺序，禁止横向滚动。

- [ ] **Step 4: 运行契约测试**

Run: `node test/apple-theme-contract.test.js`
Expected: PASS。

---

### Task 4: ACbaidu 真实应用与视觉闭环

**Files:**
- Modify: `apple-glass.less`（仅在真实渲染发现问题时）
- Produce: 最终 Google 搜索页截图文件

**Interfaces:**
- Consumes: Task 3 通过契约的 `apple-glass.less`。
- Produces: ACbaidu 中已保存启用的独立 Apple 主题；真实 Google 页面视觉证据。

- [ ] **Step 1: 定位 ACbaidu 管理界面**

使用 `orca-ide computer list-apps/list-windows/get-app-state` 检查 Chrome 窗口、标签及扩展 UI。若可访问性树不足，连接 Chrome 调试协议并检查真实标签。

- [ ] **Step 2: 导入并启用主题**

在 ACbaidu 新建独立主题，名称使用 `Apple Glass`；粘贴 `apple-glass.less` 全文，保存并启用。不得覆盖已有 Google 主题。

- [ ] **Step 3: 打开真实 Google 搜索页并截图**

使用稳定查询覆盖普通结果和至少一种富媒体模块。记录桌面宽屏截图；检查主题是否实际注入，而非仅在编辑器预览。

- [ ] **Step 4: 校对第一轮视觉**

逐项检查：

```text
低照度冷黑背景
炭灰烟熏玻璃而非紫蓝霓虹
局部灰白高光和短深阴影
搜索框/按钮胶囊
Apple 蓝仅用于交互态
文字清晰、模块完整、无溢出
```

- [ ] **Step 5: 迭代并重新应用**

发现问题时只修改对应选择器或令牌；重新粘贴保存、刷新页面、截图。每轮以实际像素检查，不用静态 HTML 替代。

- [ ] **Step 6: 验证桌面与窄屏**

桌面验证结果流、知识面板或富媒体、分页；窄屏验证单列、无横向滚动、搜索输入可用。验证键盘焦点可见。

- [ ] **Step 7: 运行最终契约与保留证据**

Run: `node test/apple-theme-contract.test.js`
Expected: PASS，输出 `apple theme contract ok`。

保存最终截图到仓库根目录，使用描述性文件名如 `apple-glass-final.webp`；截图必须来自真实 ACbaidu 注入后的 Google 页面。
