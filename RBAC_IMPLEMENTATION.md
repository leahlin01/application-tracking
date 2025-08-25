# 基于角色的访问控制 (RBAC) 系统实现

## 概述

本系统实现了完整的基于角色的访问控制系统，支持学生、家长、老师和管理员四种角色，每种角色都有不同的权限和访问范围。

## 系统架构

### 1. 数据库设计

#### 用户表 (users)

- `id`: 用户唯一标识
- `email`: 用户邮箱（唯一）
- `password`: 加密后的密码
- `role`: 用户角色 (STUDENT, PARENT, TEACHER, ADMIN)
- `studentId`: 关联的学生 ID（仅学生角色）
- `createdAt`, `updatedAt`: 时间戳

#### 学生表 (students)

- 包含学生的基本信息：姓名、邮箱、毕业年份、GPA、考试成绩等
- 与用户表通过 `studentId` 关联

#### 申请表 (applications)

- 记录学生的大学申请信息
- 包含申请状态、截止日期、决策结果等

#### 家长备注表 (parentNotes)

- 允许家长为申请添加备注
- 包含备注内容、创建时间等

### 2. 权限系统

#### 角色权限矩阵

| 角色   | 申请管理      | 个人资料      | 家长备注      | 学生管理 | 系统管理 |
| ------ | ------------- | ------------- | ------------- | -------- | -------- |
| 学生   | CRUD (自己的) | 读写 (自己的) | -             | -        | -        |
| 家长   | 只读          | -             | CRUD (自己的) | -        | -        |
| 老师   | 读写          | -             | -             | 读写     | -        |
| 管理员 | 全部          | 全部          | 全部          | 全部     | 全部     |

#### 权限配置

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    { resource: 'applications', action: 'create' },
    {
      resource: 'applications',
      action: 'read',
      conditions: { studentId: 'self' },
    },
    {
      resource: 'applications',
      action: 'update',
      conditions: { studentId: 'self' },
    },
    {
      resource: 'applications',
      action: 'delete',
      conditions: { studentId: 'self' },
    },
    { resource: 'profile', action: 'read', conditions: { studentId: 'self' } },
    {
      resource: 'profile',
      action: 'update',
      conditions: { studentId: 'self' },
    },
  ],
  [UserRole.PARENT]: [
    {
      resource: 'applications',
      action: 'read',
      conditions: { studentId: 'children' },
    },
    { resource: 'parentNotes', action: 'create' },
    {
      resource: 'parentNotes',
      action: 'read',
      conditions: { parentId: 'self' },
    },
    {
      resource: 'parentNotes',
      action: 'update',
      conditions: { parentId: 'self' },
    },
    {
      resource: 'parentNotes',
      action: 'delete',
      conditions: { parentId: 'self' },
    },
  ],
  [UserRole.TEACHER]: [
    { resource: 'applications', action: 'read' },
    { resource: 'applications', action: 'update' },
    { resource: 'students', action: 'read' },
    { resource: 'students', action: 'update' },
  ],
  [UserRole.ADMIN]: [{ resource: '*', action: '*' }],
};
```

### 3. API 设计

#### 认证端点

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

#### 学生端点

- `GET /api/student/applications` - 获取申请列表
- `POST /api/student/applications` - 创建新申请
- `PUT /api/student/applications/[id]` - 更新申请
- `DELETE /api/student/applications/[id]` - 删除申请

#### 家长端点

- `GET /api/parent/applications` - 查看申请列表（只读）
- `GET /api/parent/notes` - 获取备注列表
- `POST /api/parent/notes` - 创建备注
- `PUT /api/parent/notes/[id]` - 更新备注
- `DELETE /api/parent/notes/[id]` - 删除备注

### 4. 安全特性

#### JWT 认证

- 使用 JWT token 进行身份验证
- Token 包含用户 ID、邮箱、角色等信息
- 支持 token 过期和刷新

#### 密码安全

- 使用 bcrypt 进行密码加密
- 密码强度要求：最少 6 个字符
- 密码验证和确认

#### 输入验证

- 所有 API 端点都进行输入验证
- 防止 SQL 注入和 XSS 攻击
- 角色权限验证

#### 授权中间件

```typescript
export const requirePermission = (resource: string, action: string) => {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, resource, action)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return null; // 继续处理请求
  };
};
```

### 5. 前端组件

#### 认证组件

- `AuthProvider`: 认证上下文提供者
- `LoginForm`: 登录表单
- `RegisterForm`: 注册表单
- `ProtectedRoute`: 受保护的路由组件

#### 权限控制

```typescript
// 受保护的路由示例
<ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.ADMIN]}>
  <StudentDashboard />
</ProtectedRoute>
```

### 6. 可扩展性设计

#### 未来角色扩展

系统设计支持轻松添加新角色：

1. 在 `UserRole` 枚举中添加新角色
2. 在 `ROLE_PERMISSIONS` 中定义新角色的权限
3. 创建相应的 API 端点
4. 更新前端组件

#### 权限粒度控制

- 支持基于资源的权限控制
- 支持基于操作的权限控制
- 支持基于条件的权限控制（如只能访问自己的数据）

#### 数据库扩展

- 支持家长-学生关联表
- 支持角色-权限关联表
- 支持动态权限配置

## 部署说明

### 环境变量

```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
```

### 数据库迁移

```bash
npx prisma db push
npx prisma generate
```

### 启动应用

```bash
npm run dev
```

## 测试用例

### 1. 学生权限测试

- 学生只能查看和修改自己的申请
- 学生无法访问其他学生的数据
- 学生可以管理自己的个人资料

### 2. 家长权限测试

- 家长可以查看申请列表（只读）
- 家长可以添加、编辑、删除自己的备注
- 家长无法修改申请内容

### 3. 老师权限测试

- 老师可以查看和更新申请
- 老师可以查看和更新学生信息
- 老师无法删除数据

### 4. 管理员权限测试

- 管理员拥有所有权限
- 管理员可以管理所有用户和数据
- 管理员可以查看系统日志

## 安全考虑

1. **输入验证**: 所有用户输入都经过验证
2. **SQL 注入防护**: 使用 Prisma ORM 防止 SQL 注入
3. **XSS 防护**: 前端组件使用安全的 HTML 渲染
4. **CSRF 防护**: 使用 JWT token 进行认证
5. **权限最小化**: 用户只能访问必要的资源
6. **审计日志**: 记录所有重要操作（可扩展）

## 性能优化

1. **数据库索引**: 在常用查询字段上建立索引
2. **缓存策略**: 可以添加 Redis 缓存用户会话
3. **分页查询**: 大量数据使用分页加载
4. **懒加载**: 关联数据按需加载

## 监控和日志

1. **错误监控**: 记录所有 API 错误
2. **性能监控**: 监控 API 响应时间
3. **用户行为**: 记录用户操作日志
4. **安全事件**: 记录权限验证失败等安全事件

## 总结

本 RBAC 系统实现了：

✅ **当前功能**

- 学生：完整的申请 CRUD 权限和个人资料管理
- 家长：申请只读权限和备注管理能力
- 基于 JWT 的身份验证
- 细粒度的权限控制

✅ **未来扩展性**

- 清晰的权限架构设计
- 支持新角色添加
- 灵活的权限配置
- 可扩展的数据库设计

✅ **安全特性**

- 输入验证和授权
- 密码加密存储
- 基于角色的访问控制
- 安全的 API 设计

该系统为大学申请跟踪提供了一个安全、可扩展的基础架构，能够满足当前需求并为未来扩展做好准备。
