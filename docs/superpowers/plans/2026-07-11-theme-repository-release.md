# ACbaidu Theme Repository Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Google 两套 Less 主题整合到公开 GitHub 仓库 `psympsym/ac-baidu-themes` 的单一 `master` 分支，并让 ACbaidu 从 GitHub Raw URL 加载 Apple 主题。

**Architecture:** 先把已完成的 `google-glass-theme` 历史合并进 `master`，再筛选 Apple 主题及最终证据进入版本控制。GitHub Raw 文件作为稳定发布接口；ACbaidu 只保存远程地址，真实 Google 页面完成端到端验证。

**Tech Stack:** Git、GitHub CLI、Less/CSS、Node.js 标准库测试、ACbaidu、Chrome DevTools。

## Global Constraints

- 长期分支仅 `master`。
- GitHub 仓库名固定为 `ac-baidu-themes`，所有者为 `psympsym`，可见性为 public。
- 保留 `google-glass.less`、`apple-glass.less`、两套契约测试、必要设计/计划文档、参考图与最终截图。
- 删除 Chrome trace、中间截图、基线截图及被最终截图替代的过程截图。
- 不修改两套主题的视觉行为。
- ACbaidu 不得同时重复注入远程主题与同内容内联 Less。
- 远程切换失败时保留当前可工作的内联主题，避免配置丢失。

---

### Task 1: 合并 Google 主题分支

**Files:**
- Add via merge: `google-glass.less`
- Add via merge: `test/theme-contract.test.js`

**Interfaces:**
- Consumes: 本地分支 `google-glass-theme` 的完整提交历史。
- Produces: `master` 上可测试的 Google 主题源码和契约测试。

- [ ] **Step 1: 合并功能分支**

Run: `git merge --no-ff google-glass-theme -m "merge: integrate Google glass theme"`
Expected: merge succeeds; `google-glass.less` and `test/theme-contract.test.js` exist on `master`.

- [ ] **Step 2: 运行 Google 契约测试**

Run: `node test/theme-contract.test.js`
Expected: exit code `0` and success output from the contract test.

### Task 2: 整合 Apple 主题与发布资源

**Files:**
- Add: `apple-glass.less`
- Add: `test/apple-theme-contract.test.js`
- Add: `apple-design-reference.webp`
- Add: `apple-glass-desktop.webp`
- Add: `apple-glass-mobile.webp`
- Add: `docs/superpowers/specs/2026-07-11-apple-glass-theme-design.md`
- Add: `docs/superpowers/plans/2026-07-11-apple-glass-theme.md`
- Remove from workspace: `developers-chrome-trace.json.json.gz`
- Remove from workspace: `google-liquid-glass-baseline.webp`
- Remove from workspace: `google-liquid-glass-final.jpeg`
- Remove from workspace: `google-liquid-glass-final.webp`
- Remove from workspace: `google-apple-design-fixed.webp`
- Remove from workspace: `google-glass-theme-final.webp`
- Remove from workspace: `google-theme-layout-fix.webp`
- Remove from workspace: `google-theme-current.webp`

**Interfaces:**
- Consumes: 已在 ACbaidu 和真实 Google 页面验证的 Apple 主题产物。
- Produces: 最小、可复验的仓库发布资源集。

- [ ] **Step 1: 删除非交付调试资源**

Delete only the listed trace and intermediate image files. Do not delete the three Apple deliverable images.
Expected: directory contains no trace or superseded screenshots listed above.

- [ ] **Step 2: 运行 Apple 契约测试**

Run: `node test/apple-theme-contract.test.js`
Expected: exit code `0`; output ends with `apple theme contract ok`.

- [ ] **Step 3: 提交整合资源**

Run:

```bash
git add apple-glass.less test/apple-theme-contract.test.js \
  apple-design-reference.webp apple-glass-desktop.webp apple-glass-mobile.webp \
  docs/superpowers/specs/2026-07-11-apple-glass-theme-design.md \
  docs/superpowers/plans/2026-07-11-apple-glass-theme.md
git commit -m "feat: add Apple glass Google theme"
```

Expected: focused commit containing only Apple deliverables.

### Task 3: 创建并推送公开仓库

**Files:**
- Modify Git metadata: remote `origin`.

**Interfaces:**
- Consumes: 已整合并通过契约测试的 `master`。
- Produces: `https://github.com/psympsym/ac-baidu-themes` 和两个公开 Raw URL。

- [ ] **Step 1: 创建 GitHub 仓库并推送**

Run: `gh repo create psympsym/ac-baidu-themes --public --source=. --remote=origin --push`
Expected: repository URL is printed; `master` tracks `origin/master`.

- [ ] **Step 2: 验证 Raw 资源**

Read:

```text
https://raw.githubusercontent.com/psympsym/ac-baidu-themes/master/google-glass.less
https://raw.githubusercontent.com/psympsym/ac-baidu-themes/master/apple-glass.less
```

Expected: Google source contains its theme root token; Apple source contains `--apple-page: #060914` and the mobile `#cnt` fix.

### Task 4: 配置 ACbaidu 远程加载

**Files:**
- External state: `https://ac-baidu.tujidu.com/pages/custom/#google`

**Interfaces:**
- Consumes: Apple Raw URL `https://raw.githubusercontent.com/psympsym/ac-baidu-themes/master/apple-glass.less`.
- Produces: ACbaidu 持久保存的远程样式地址，真实 Google 页面加载该资源。

- [ ] **Step 1: 定位 Google 样式加载地址控件**

Open ACbaidu custom page, inspect the latest accessibility snapshot and current form values. Identify the Google theme remote stylesheet URL input by label or surrounding text; never guess an element index.
Expected: exact input and existing value observed.

- [ ] **Step 2: 保存 Apple Raw URL**

Fill the remote stylesheet URL input with:

```text
https://raw.githubusercontent.com/psympsym/ac-baidu-themes/master/apple-glass.less
```

Trigger the page’s normal save action. Preserve the existing inline Less until the remote URL has been proven to load.
Expected: save completes without console error; refresh shows the same URL persisted.

### Task 5: 端到端验证与单分支收尾

**Files:**
- Update: `apple-glass-desktop.webp`
- Update: `apple-glass-mobile.webp`
- Git metadata: remove merged worktree and local feature branch after verification.

**Interfaces:**
- Consumes: ACbaidu 的持久远程配置、公开 Raw Apple 主题。
- Produces: 桌面与移动验证证据、仅保留 `master` 的本地仓库。

- [ ] **Step 1: 验证桌面 Google 页面**

Open a real Google results page at `1440 × 1000`; refresh after ACbaidu save. Check computed `--apple-page`, `html` background, `.RNNXgb` blur/radius, one visible result card’s background/radius, visible result count, and `document.documentElement.scrollWidth - document.documentElement.clientWidth`.
Expected: Apple token is `#060914`; glass styles are active; results remain visible; overflow equals `0`.

- [ ] **Step 2: 验证窄屏 Google 页面**

Resize to `500 × 844`; refresh. Check `#cnt`, `#rcnt`, `#center_col`, `#rso`, one result card, and horizontal overflow.
Expected: content containers retain positive width, result card fits viewport, overflow equals `0`, no visible overlap or truncation.

- [ ] **Step 3: 更新最终截图**

Capture desktop to `apple-glass-desktop.webp` and narrow screen to `apple-glass-mobile.webp`.
Expected: both files decode successfully and show the remotely loaded theme.

- [ ] **Step 4: 运行两套契约测试**

Run: `node test/theme-contract.test.js && node test/apple-theme-contract.test.js`
Expected: exit code `0`; both contract success messages present.

- [ ] **Step 5: 提交最终远程验证证据**

Run:

```bash
git add apple-glass-desktop.webp apple-glass-mobile.webp
git commit -m "test: verify remote Apple theme loading"
git push origin master
```

Expected: push succeeds; GitHub `master` contains current screenshots.

- [ ] **Step 6: 清理已合并功能分支**

Inspect the `google-glass-theme` worktree path, remove that worktree, then delete local branch `google-glass-theme`. Do not delete `master` or the current worktree.
Expected: `git branch` lists only `master`; remote lists only `origin/master`.
