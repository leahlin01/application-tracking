# 部署到 Vercel 指南

## 前置要求

1. 确保你有 Vercel 账户
2. 确保你的项目在 GitHub、GitLab 或 Bitbucket 上
3. 确保你有 PostgreSQL 数据库（可以使用 Vercel Postgres、Supabase、Neon 等）

## 部署步骤

### 1. 准备数据库

由于项目使用 PostgreSQL，你需要：

- 使用 Vercel Postgres（推荐）
- 或使用其他 PostgreSQL 服务（Supabase、Neon、Railway 等）

### 2. 在 Vercel 上部署

#### 方法 1：通过 Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. 配置项目设置：
   - Framework Preset: Next.js
   - Root Directory: `./` (默认)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### 方法 2：通过 Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. 数据库迁移

部署后，需要运行数据库迁移：

```bash
# 在Vercel函数中运行
npx prisma migrate deploy
npx prisma generate
```

### 5. 验证部署

1. 访问你的 Vercel 域名
2. 检查应用是否正常运行
3. 测试数据库连接
4. 测试用户注册/登录功能

## 常见问题

### 构建失败

- 检查 Node.js 版本（推荐 18.x 或 20.x）
- 确保所有依赖都正确安装
- 检查 TypeScript 和 ESLint 错误

### 数据库连接问题

- 确保 DATABASE_URL 正确
- 检查数据库是否允许外部连接
- 验证数据库凭据

### 环境变量问题

- 确保所有必需的环境变量都已设置
- 检查环境变量名称是否正确
- 重启部署以应用新的环境变量

## 推荐配置

### Vercel Postgres

如果使用 Vercel Postgres：

1. 在 Vercel Dashboard 中创建 Postgres 数据库
2. 自动获取 DATABASE_URL
3. 在项目设置中链接数据库

### 自定义域名

1. 在 Vercel 项目设置中添加自定义域名
2. 更新 DNS 记录
3. 配置 SSL 证书

## 监控和维护

- 使用 Vercel Analytics 监控性能
- 设置错误通知
- 定期检查数据库性能
- 监控 API 使用情况
