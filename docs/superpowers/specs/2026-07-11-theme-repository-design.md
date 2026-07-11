# ACbaidu 主题仓库整合与发布设计

## 目标

将 Google 两套独立 Less 主题整合进单主线 Git 仓库，新建公开 GitHub 仓库 `ac-baidu-themes`，通过 GitHub Raw URL 供 ACbaidu 加载。后续更新只需推送 `master`。

## 仓库结构

保留：

- `google-glass.less`：现有 Google 液态玻璃主题。
- `apple-glass.less`：Apple 烟熏液态玻璃主题。
- `test/theme-contract.test.js`：Google 主题契约测试。
- `test/apple-theme-contract.test.js`：Apple 主题契约测试。
- 两套主题的最终桌面、移动截图及必要参考图。
- `docs/superpowers/specs/` 与 `docs/superpowers/plans/` 中对应设计和实施记录。

删除未形成交付价值的调试产物：Chrome trace、中间截图、基线截图、已被最终截图替代的过程截图。

## Git 策略

- 将 `google-glass-theme` 合并进 `master`。
- 保留单一长期分支 `master`。
- 整合和验证完成后提交一次聚焦变更。
- 新建公开 GitHub 仓库 `ac-baidu-themes`，配置为 `origin`，推送 `master`。
- 推送成功后删除本地已合并功能分支及其独立 worktree；不保留长期分支。

## 发布接口

ACbaidu 加载地址使用：

```text
https://raw.githubusercontent.com/psympsym/ac-baidu-themes/master/google-glass.less
https://raw.githubusercontent.com/psympsym/ac-baidu-themes/master/apple-glass.less
```

Raw URL 跟随 `master`。GitHub CDN 可能存在短暂缓存；更新后通过强制刷新或等待缓存失效获取最新内容。

## ACbaidu 配置

在 ACbaidu Google 自定义样式页中，将目标主题的样式表加载地址设为对应 Raw URL并保存。不得同时重复注入远程主题与同内容内联 Less，避免规则重复。当前启用 Apple 主题时使用 `apple-glass.less` URL；Google 主题 URL作为可切换资源保留。

## 验证

1. 两套契约测试退出码均为 `0`。
2. 两个 Raw URL 返回完整 Less，含各自唯一主题令牌。
3. ACbaidu 保存远程地址后刷新，真实 Google 页面计算样式显示 Apple 主题令牌及玻璃效果。
4. 桌面 `1440 × 1000`、窄屏 `500 × 844` 均无横向溢出、重叠、内容隐藏或截断。
5. 仓库仅保留 `master` 作为长期分支；工作区无未提交发布资源。

## 失败处理

- GitHub 身份未登录：停止远程创建，报告认证缺口；本地整合和测试不回退。
- Raw URL 尚未传播：直接读取 URL 核验，稍后刷新；不得改用不稳定临时地址。
- ACbaidu 远程加载失败：保留当前已工作的内联样式，修正 URL 或缓存问题后再切换，避免丢失可用配置。
