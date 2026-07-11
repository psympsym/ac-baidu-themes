# Google 毛玻璃搜索主题实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可由 AC-baidu/Less.js 直接编译导入的 Google 搜索结果页毛玻璃主题。

**Architecture:** 单个 `google-glass.less` 承载主题变量、明暗配色、页面背景、组件卡片及响应式网格。单个 Node.js 自检脚本编译 Less，并以断言验证关键兼容性与可访问性契约；不接触页面 DOM，不引入运行时脚本或远程资源。

**Tech Stack:** Less.js、CSS Grid、CSS media queries、Node.js 标准库

## Global Constraints

- 仅作用于 Google 搜索结果页。
- 自动跟随 `prefers-color-scheme` 明暗模式。
- 使用纯 CSS 渐变光斑、毛玻璃卡片、宽屏双栏；小于 `900px` 回退单栏。
- 不隐藏、删除、重排模块内部内容。
- 不请求远程图片、字体、脚本或其他资源。
- `backdrop-filter` 不可用时必须保持可读。
- 键盘焦点可见；尊重 `prefers-reduced-motion`。
- 交付单个可直接导入 AC-baidu 的 `.less` 文件。

---

### Task 1: 可编译的主题视觉基础

**Files:**
- Create: `google-glass.less`
- Create: `test/theme-contract.test.js`

**Interfaces:**
- Consumes: AC-baidu 提供的 Less.js 编译环境；页面根节点 `html`、`body`。
- Produces: 可独立编译的 `google-glass.less`；测试脚本入口 `node test/theme-contract.test.js`。

- [ ] **Step 1: 编写失败的编译及基础契约测试**

```js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const source = fs.readFileSync('google-glass.less', 'utf8');
assert.match(source, /@glass-blur:\s*18px/);
assert.match(source, /prefers-color-scheme:\s*dark/);
assert.doesNotMatch(source, /url\s*\(/i);

const css = execFileSync('npx', ['--no-install', 'lessc', 'google-glass.less'], {
  encoding: 'utf8',
});
assert.match(css, /radial-gradient/);
assert.match(css, /backdrop-filter:\s*blur\(18px\)/);
console.log('theme contract ok');
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node test/theme-contract.test.js`

Expected: FAIL，错误包含 `ENOENT`，因为 `google-glass.less` 尚不存在。

- [ ] **Step 3: 编写最小视觉基础**

创建 `google-glass.less`：

```less
@glass-blur: 18px;
@radius: 16px;
@gap: 20px;
@breakpoint: 900px;
@wide-breakpoint: 1200px;

:root {
  --page: #eef3ff;
  --orb-a: rgba(91, 124, 255, 0.42);
  --orb-b: rgba(181, 105, 255, 0.34);
  --glass: rgba(255, 255, 255, 0.68);
  --glass-solid: rgba(247, 249, 255, 0.96);
  --line: rgba(69, 84, 120, 0.18);
  --text: #202124;
  --muted: #5f6368;
  --link: #1558d6;
  --focus: #2f6fed;
  --shadow: 0 18px 50px rgba(48, 63, 105, 0.16);
}

@media (prefers-color-scheme: dark) {
  :root {
    --page: #09101f;
    --orb-a: rgba(42, 112, 255, 0.38);
    --orb-b: rgba(156, 78, 255, 0.32);
    --glass: rgba(18, 27, 48, 0.7);
    --glass-solid: rgba(14, 22, 39, 0.96);
    --line: rgba(196, 211, 255, 0.16);
    --text: #e8eaed;
    --muted: #bdc1c6;
    --link: #8ab4f8;
    --focus: #a8c7fa;
    --shadow: 0 20px 56px rgba(0, 0, 0, 0.36);
  }
}

html,
body {
  color: var(--text) !important;
  background-color: var(--page) !important;
  background-image:
    radial-gradient(circle at 12% 8%, var(--orb-a), transparent 34rem),
    radial-gradient(circle at 88% 22%, var(--orb-b), transparent 38rem) !important;
  background-attachment: fixed !important;
}
```

- [ ] **Step 4: 运行测试并确认通过**

Run: `node test/theme-contract.test.js`

Expected: PASS，输出 `theme contract ok`。

- [ ] **Step 5: 提交视觉基础**

```bash
git add google-glass.less test/theme-contract.test.js
git commit -m "feat: add Google glass theme foundation"
```

---

### Task 2: 搜索组件卡片化与可访问状态

**Files:**
- Modify: `google-glass.less`
- Modify: `test/theme-contract.test.js`

**Interfaces:**
- Consumes: Task 1 的 CSS 变量与 `@glass-blur`、`@radius`、`@gap`。
- Produces: `.glass-panel()` Less mixin；搜索栏、结果容器、知识面板与分页的统一玻璃外观。

- [ ] **Step 1: 扩充失败的组件契约测试**

在 `execFileSync` 之后、最终日志之前加入：

```js
assert.match(css, /\.RNNXgb[^{]*\{[^}]*background:\s*var\(--glass\)/s);
assert.match(css, /\.g[^{]*\{[^}]*border:\s*1px solid var\(--line\)/s);
assert.match(css, /focus-visible/);
assert.match(css, /@supports not \(\(backdrop-filter:\s*blur\(1px\)\)\)/);
assert.doesNotMatch(css, /display:\s*none/);
assert.doesNotMatch(css, /visibility:\s*hidden/);
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node test/theme-contract.test.js`

Expected: FAIL，首个缺失契约为 `.RNNXgb` 玻璃背景。

- [ ] **Step 3: 实现卡片、搜索栏、焦点及降级样式**

追加到 `google-glass.less`：

```less
.glass-panel() {
  color: var(--text) !important;
  background: var(--glass) !important;
  border: 1px solid var(--line) !important;
  border-radius: @radius !important;
  box-shadow: var(--shadow) !important;
  backdrop-filter: blur(@glass-blur) saturate(135%);
  -webkit-backdrop-filter: blur(@glass-blur) saturate(135%);
}

#searchform {
  background: var(--glass-solid) !important;
  border-bottom: 1px solid var(--line) !important;
  backdrop-filter: blur(@glass-blur);
  -webkit-backdrop-filter: blur(@glass-blur);
}

.RNNXgb,
.g,
.MjjYud,
.kp-wholepage,
.ULSxyf,
#botstuff {
  .glass-panel();
}

.RNNXgb {
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.RNNXgb:focus-within {
  border-color: var(--focus) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 24%, transparent) !important;
}

.g,
.MjjYud,
.ULSxyf,
#botstuff {
  padding: 18px 20px !important;
  margin-bottom: @gap !important;
}

body,
.g,
.MjjYud,
.kp-wholepage,
.ULSxyf {
  color: var(--text) !important;
}

a,
a:visited {
  color: var(--link);
}

:where(a, button, input, textarea, select, [tabindex]):focus-visible {
  outline: 3px solid var(--focus) !important;
  outline-offset: 3px !important;
}

@supports not ((backdrop-filter: blur(1px))) {
  .RNNXgb,
  .g,
  .MjjYud,
  .kp-wholepage,
  .ULSxyf,
  #botstuff {
    background: var(--glass-solid) !important;
  }
}
```

- [ ] **Step 4: 运行测试并确认通过**

Run: `node test/theme-contract.test.js`

Expected: PASS，输出 `theme contract ok`。

- [ ] **Step 5: 提交组件样式**

```bash
git add google-glass.less test/theme-contract.test.js
git commit -m "feat: style Google search modules as glass panels"
```

---

### Task 3: 宽屏双栏与响应式回退

**Files:**
- Modify: `google-glass.less`
- Modify: `test/theme-contract.test.js`

**Interfaces:**
- Consumes: Google 结果主容器 `#rso`；Task 2 的卡片样式。
- Produces: `≥ 900px` 双栏、`≥ 1200px` 宽间距、`< 900px` 单栏布局；富媒体内部结构保持不变。

- [ ] **Step 1: 扩充失败的布局契约测试**

在最终日志之前加入：

```js
assert.match(css, /@media \(min-width:\s*900px\)/);
assert.match(css, /#rso[^{]*\{[^}]*display:\s*grid/s);
assert.match(css, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
assert.match(css, /@media \(min-width:\s*1200px\)/);
assert.match(css, /@media \(max-width:\s*899px\)/);
assert.match(css, /overflow-x:\s*clip/);
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node test/theme-contract.test.js`

Expected: FAIL，缺少 `@media (min-width: 900px)`。

- [ ] **Step 3: 实现双栏和移动回退**

追加到 `google-glass.less`：

```less
body {
  overflow-x: clip;
}

#center_col,
#rcnt,
#rso {
  max-width: none !important;
}

@media (min-width: @breakpoint) {
  #center_col {
    width: min(100%, 1500px) !important;
    margin-inline: auto !important;
  }

  #rso {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: @gap;
    align-items: start;
  }

  #rso > * {
    min-width: 0;
    margin: 0 !important;
  }
}

@media (min-width: @wide-breakpoint) {
  #rso {
    gap: 24px;
  }
}

@media (max-width: (@breakpoint - 1px)) {
  #center_col,
  #rcnt,
  #rso {
    width: auto !important;
    min-width: 0 !important;
    margin-inline: 0 !important;
  }

  #rso {
    display: block !important;
  }
}
```

- [ ] **Step 4: 运行测试并确认通过**

Run: `node test/theme-contract.test.js`

Expected: PASS，输出 `theme contract ok`。

- [ ] **Step 5: 提交响应式布局**

```bash
git add google-glass.less test/theme-contract.test.js
git commit -m "feat: add responsive two-column search layout"
```

---

### Task 4: 动效偏好与完整验收

**Files:**
- Modify: `google-glass.less`
- Modify: `test/theme-contract.test.js`

**Interfaces:**
- Consumes: Task 1–3 的完整 Less 主题。
- Produces: 减少动态效果规则；最终可编译、无远程资源、无内容隐藏的主题交付物。

- [ ] **Step 1: 扩充失败的最终契约测试**

在最终日志之前加入：

```js
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.match(css, /transition-duration:\s*0\.01ms/);
assert.doesNotMatch(css, /@import/i);
assert.doesNotMatch(css, /position:\s*fixed/);
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node test/theme-contract.test.js`

Expected: FAIL，缺少 `prefers-reduced-motion: reduce`。

- [ ] **Step 3: 添加减少动态效果规则**

追加到 `google-glass.less`：

```less
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 4: 执行最终自动验收**

Run: `node test/theme-contract.test.js`

Expected: PASS，输出 `theme contract ok`。

Run: `npx --no-install lessc google-glass.less /tmp/google-glass.css`

Expected: exit 0，生成可用 CSS，无 Less 编译错误。

- [ ] **Step 5: 执行浏览器手工验收**

在 AC-baidu 中导入 `google-glass.less`，打开 Google 搜索结果页，逐项检查：

1. 视口 `1440px`，浅色：双栏、模块完整、搜索栏焦点可见。
2. 视口 `1440px`，深色：正文、链接、边框清晰。
3. 视口 `1024px`：双栏无重叠、无横向滚动。
4. 视口 `390px`：单栏回退、无横向滚动。
5. 普通结果、广告、图片、视频、新闻、相关搜索、知识面板、分页均未隐藏。
6. 浏览器禁用 `backdrop-filter`：卡片改用高不透明度背景，文字仍可读。

Expected: 六项全部通过。

- [ ] **Step 6: 提交最终主题**

```bash
git add google-glass.less test/theme-contract.test.js
git commit -m "feat: finish accessible Google glass theme"
```
