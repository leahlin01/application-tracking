# RBAC 系统测试指南

## 系统概述

本系统实现了完整的基于角色的访问控制(RBAC)，包含以下角色：

- **学生 (STUDENT)**: 管理自己的申请和个人资料
- **家长 (PARENT)**: 查看申请和添加备注
- **老师 (TEACHER)**: 查看和更新申请、学生信息
- **管理员 (ADMIN)**: 拥有所有权限

## 测试流程

### 1. 启动系统

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 测试未登录状态

1. 访问 `http://localhost:3000`
2. 应该自动重定向到 `/welcome` 页面
3. 验证无法访问主页面内容

### 3. 测试用户注册

1. 访问 `/role-selection` 选择角色
2. 点击"继续注册"进入注册页面
3. 测试不同角色的注册流程

#### 学生注册测试

- 选择学生角色
- 填写邮箱和密码
- 可选择填写学生 ID
- 验证注册成功并自动登录

#### 家长注册测试

- 选择家长角色
- 填写邮箱和密码
- 验证注册成功并自动登录

#### 老师注册测试

- 选择老师角色
- 填写邮箱和密码
- 验证注册成功并自动登录

#### 管理员注册测试

- 选择管理员角色
- 填写邮箱和密码
- 验证注册成功并自动登录

### 4. 测试用户登录

1. 访问 `/auth` 页面
2. 使用已注册的账户登录
3. 验证登录成功后重定向到主页

### 5. 测试权限控制

#### 学生权限测试

1. 使用学生账户登录
2. 验证可以：
   - 查看自己的申请列表
   - 创建新申请
   - 更新自己的申请
   - 删除自己的申请
3. 验证无法：
   - 查看其他学生的申请
   - 访问管理员功能

#### 家长权限测试

1. 使用家长账户登录
2. 验证可以：
   - 查看申请列表（只读）
   - 为申请添加备注
   - 编辑自己的备注
   - 删除自己的备注
3. 验证无法：
   - 修改申请内容
   - 删除申请

#### 老师权限测试

1. 使用老师账户登录
2. 验证可以：
   - 查看申请列表
   - 更新申请状态
   - 查看学生信息
3. 验证无法：
   - 删除申请
   - 访问管理员功能

#### 管理员权限测试

1. 使用管理员账户登录
2. 验证可以：
   - 访问所有功能
   - 初始化示例数据
   - 查看所有用户数据

### 6. 测试 API 端点

#### 认证端点

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","password":"password123","role":"STUDENT"}'
```

#### 学生端点

```bash
# 获取申请列表
curl -X GET http://localhost:3000/api/student/applications \
  -H "Authorization: Bearer YOUR_TOKEN"

# 创建申请
curl -X POST http://localhost:3000/api/student/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"universityId":"uni123","applicationType":"REGULAR_DECISION","deadline":"2024-12-31"}'
```

#### 家长端点

```bash
# 获取申请列表
curl -X GET http://localhost:3000/api/parent/applications \
  -H "Authorization: Bearer YOUR_TOKEN"

# 创建备注
curl -X POST http://localhost:3000/api/parent/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"applicationId":"app123","content":"这是一个备注"}'
```

### 7. 测试权限中间件

1. 访问 `/test-permissions` 页面
2. 使用不同角色账户测试各种权限
3. 验证权限检查是否正确工作

### 8. 测试前端组件

#### 认证组件

- 登录表单
- 注册表单
- 认证提供者
- 受保护的路由

#### 功能组件

- 申请列表
- 申请表单
- 家长备注表单
- 导航组件

### 9. 测试错误处理

#### 认证错误

- 无效的邮箱/密码
- 过期的 JWT token
- 无效的 token 格式

#### 权限错误

- 访问未授权的资源
- 执行未授权的操作
- 角色权限不足

#### 输入验证错误

- 空字段
- 无效的邮箱格式
- 密码长度不足

### 10. 测试数据持久化

1. 创建测试数据
2. 刷新页面验证数据保持
3. 测试数据库连接

## 预期结果

### 成功场景

- 用户注册和登录成功
- 权限控制正确工作
- 数据正确保存和读取
- 前端组件正常渲染

### 失败场景

- 未登录用户被重定向到欢迎页面
- 权限不足时显示 403 错误
- 输入验证错误时显示相应提示
- 网络错误时显示友好提示

## 常见问题

### 1. 数据库连接问题

- 检查 `.env` 文件中的 `DATABASE_URL`
- 确保 PostgreSQL 服务正在运行
- 运行 `npx prisma db push` 创建表

### 2. JWT token 问题

- 检查 `.env` 文件中的 `JWT_SECRET`
- 确保 token 格式正确
- 验证 token 是否过期

### 3. 权限检查问题

- 检查用户角色是否正确设置
- 验证权限配置是否正确
- 检查中间件是否正确应用

### 4. 前端路由问题

- 确保所有页面组件都存在
- 检查路由配置是否正确
- 验证权限保护是否正确应用

## 性能测试

### 1. 响应时间

- API 响应时间 < 200ms
- 页面加载时间 < 2s
- 组件渲染时间 < 100ms

### 2. 并发测试

- 支持 10 个并发用户
- 数据库查询优化
- 前端状态管理

### 3. 内存使用

- 检查内存泄漏
- 优化组件重渲染
- 清理定时器和事件监听器

## 安全测试

### 1. 认证安全

- JWT token 安全性
- 密码加密存储
- 会话管理

### 2. 授权安全

- 角色权限验证
- 资源访问控制
- 输入验证和清理

### 3. 数据安全

- SQL 注入防护
- XSS 攻击防护
- CSRF 攻击防护

## 总结

通过以上测试，可以验证 RBAC 系统的完整性和正确性。系统应该能够：

1. 正确识别和验证用户身份
2. 根据用户角色分配相应权限
3. 保护敏感资源和操作
4. 提供良好的用户体验
5. 支持未来的功能扩展

如果测试中发现任何问题，请检查相应的代码实现和配置，确保系统按照设计要求正常工作。
