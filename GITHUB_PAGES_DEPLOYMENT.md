# GitHub Pages 部署指南

## 项目概述
这是一个基于 Next.js 的静态网站项目，已配置为可以部署到 GitHub Pages。

## 部署步骤

### 1. 推送代码到 GitHub
确保你的代码已经推送到 GitHub 仓库的 `main` 分支：

```bash
git add .
git commit -m "准备部署到 GitHub Pages"
git push origin main
```

### 2. 启用 GitHub Pages
1. 进入你的 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages** 选项
4. 在 **Source** 部分选择 **GitHub Actions**

### 3. 自动部署
一旦你启用了 GitHub Pages 并选择了 GitHub Actions 作为源，每次推送到 `main` 分支时，GitHub Actions 会自动：

1. 检出代码
2. 安装依赖
3. 构建 Next.js 应用
4. 部署到 GitHub Pages

### 4. 访问你的网站
部署完成后，你的网站将在以下地址可用：
```
https://[你的用户名].github.io/[仓库名称]
```

## 项目配置说明

### Next.js 配置 (next.config.mjs)
项目已正确配置为静态导出：
- `output: 'export'` - 启用静态导出
- `images: { unoptimized: true }` - 禁用图片优化（GitHub Pages 要求）

### GitHub Actions 工作流 (.github/workflows/deploy.yaml)
工作流配置包括：
- 自动检测包管理器（npm/yarn）
- Node.js 20 环境设置
- 缓存优化
- 自动构建和部署

## 手动触发部署
你也可以手动触发部署：
1. 进入 GitHub 仓库的 **Actions** 标签
2. 选择 "Deploy Next.js site to Pages" 工作流
3. 点击 **Run workflow** 按钮

## 故障排除

### 常见问题
1. **部署失败**: 检查 Actions 标签中的错误日志
2. **404 错误**: 确保 GitHub Pages 已正确启用
3. **样式丢失**: 确认 `next.config.mjs` 中的配置正确

### 检查部署状态
- 在 **Actions** 标签中查看工作流运行状态
- 绿色勾号表示部署成功
- 红色 X 表示部署失败，点击查看详细错误

## 注意事项
- 首次部署可能需要几分钟时间
- GitHub Pages 有时需要额外时间来传播更改
- 确保仓库是公开的（除非你有 GitHub Pro）

## 项目结构
```
├── .github/workflows/deploy.yaml  # GitHub Actions 配置
├── next.config.mjs               # Next.js 配置
├── package.json                  # 项目依赖
├── src/                         # 源代码
└── public/                      # 静态资源
```