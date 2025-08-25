# 大学申请管理平台

一个帮助高中生追踪大学申请进度的现代化 Web 应用。

## 功能特性

### 核心功能

- **大学搜索与筛选**: 支持按地理位置、专业、排名、录取率等条件搜索大学
- **申请追踪**: 管理申请状态、截止日期和决定结果
- **进度可视化**: 直观显示申请管道的进度
- **截止日期管理**: 即将到期的视觉警报和自动状态更新
- **申请要求清单**: 追踪每所大学的申请要求

### 申请类型支持

- 提前决定 (Early Decision)
- 提前行动 (Early Action)
- 常规决定 (Regular Decision)
- 滚动录取 (Rolling Admission)

### 状态工作流

- 未开始 → 进行中 → 已提交 → 审核中 → 决定（录取/拒绝/候补）

## 技术栈

- **数据库**: PostgreSQL
- **后端**: Next.js API routes
- **前端**: React/Next.js + TypeScript
- **样式**: Tailwind CSS
- **ORM**: Prisma

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 设置数据库

1. 确保你有 PostgreSQL 数据库运行
2. 创建`.env`文件并配置数据库连接：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/application_tracking"
```

### 3. 初始化数据库

```bash
# 生成Prisma客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 创建种子数据（可选）
curl -X POST http://localhost:3000/api/seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── applications/  # 申请相关API
│   │   ├── universities/  # 大学相关API
│   │   ├── students/      # 学生相关API
│   │   └── seed/          # 种子数据API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── Dashboard.tsx      # 仪表板组件
│   ├── UniversitySearch.tsx # 大学搜索组件
│   ├── ApplicationList.tsx # 申请列表组件
│   └── ApplicationForm.tsx # 申请表单组件
├── lib/                   # 工具库
│   └── prisma.ts         # Prisma客户端
└── types/                # TypeScript类型定义
    └── index.ts          # 接口和枚举定义
```

## 数据库模型

### 主要实体

- **Student**: 学生信息（GPA、SAT/ACT 分数、目标专业等）
- **University**: 大学信息（排名、录取率、申请系统等）
- **Application**: 申请记录（状态、截止日期、决定等）
- **ApplicationRequirement**: 申请要求（论文、推荐信、成绩单等）

### 关系

- 一个学生可以有多个申请
- 一个大学可以有多个申请
- 一个申请可以有多个要求

## API 端点

### 大学相关

- `GET /api/universities` - 获取大学列表（支持搜索和筛选）
- `POST /api/universities` - 创建新大学

### 申请相关

- `GET /api/applications` - 获取申请列表
- `POST /api/applications` - 创建新申请
- `GET /api/applications/[id]` - 获取申请详情
- `PUT /api/applications/[id]` - 更新申请
- `DELETE /api/applications/[id]` - 删除申请

### 学生相关

- `GET /api/students` - 获取学生列表
- `POST /api/students` - 创建新学生

### 数据初始化

- `POST /api/seed` - 创建示例数据

## 使用指南

1. **初始化数据**: 点击页面右上角的"初始化示例数据"按钮
2. **搜索大学**: 使用搜索框和筛选选项找到心仪的大学
3. **添加申请**: 点击大学卡片添加申请，设置申请类型和截止日期
4. **追踪进度**: 在申请列表中查看和更新申请状态
5. **查看统计**: 在左侧仪表板查看申请进度和统计信息

## 开发指南

### 添加新功能

1. 在`prisma/schema.prisma`中定义数据模型
2. 运行`npx prisma migrate dev`更新数据库
3. 创建相应的 API 路由
4. 添加前端组件和类型定义

### 代码规范

- 使用 TypeScript 进行类型安全开发
- 遵循 React Hooks 最佳实践
- 使用 Tailwind CSS 进行样式设计
- 保持组件的小型和可复用性

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（数据库连接等）
4. 部署应用

### 数据库部署

推荐使用以下服务：

- [Supabase](https://supabase.com/) - 开源 PostgreSQL 服务
- [PlanetScale](https://planetscale.com/) - MySQL 兼容服务
- [Railway](https://railway.app/) - 全栈部署平台

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License
