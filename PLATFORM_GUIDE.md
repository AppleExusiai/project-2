# 🛡️ 高校防诈骗宣传平台 - 完整使用指南

## 概述

这是一个功能完整的高校防诈骗教育平台，提供诈骗案例学习、知识提升和用户参与功能。

**技术栈**:
- 后端：Node.js + Express.js
- 数据库：SQLite3
- 前端：HTML5 + CSS3 + Vanilla JavaScript
- 认证：JWT + Session

---

## 📥 安装与启动

### 1. 安装依赖
```bash
npm install
```

**已安装的核心包**:
- `express` - Web框架
- `sqlite3` - 数据库
- `bcryptjs` - 密码加密
- `jsonwebtoken` - JWT认证
- `cors` - 跨域请求
- `express-session` - 会话管理

### 2. 启动服务器
```bash
npm start
# 或
node server.js
```

服务器将在以下地址启动：
```
http://localhost:3000
```

---

## 🌐 平台页面导航

### 登录前可访问的页面

| 页面 | URL | 功能 |
|------|-----|------|
| 首页 | `/` | 平台介绍，欢迎信息 |
| 注册 | `/register` | 创建新账户 |
| 登录 | `/login` | 用户登录 |
| 案例展示 | `/fraud-cases` | 查看诈骗案例（部分需登录） |
| 知识库 | `/knowledge` | 浏览学习模块（部分需登录） |
| 测试工具 | `/test-registration.html` | 诊断注册问题 |

### 登录后可访问的页面

| 页面 | URL | 功能 |
|------|-----|------|
| 仪表板 | `/dashboard` | 个人仪表板，统计信息 |
| 防诈骗案例 | `/fraud-cases` | 查看完整的案例列表 |
| 知识学习 | `/knowledge` | 学习防诈骗知识 |
| 问卷调查 | `/survey` | 参与防诈骗调查 |
| 个人中心 | `/profile` | 查看和编辑个人信息 |

---

## 👤 用户注册流程

### 第一步：访问注册页面
打开浏览器，访问：
```
http://localhost:3000/register
```

### 第二步：填写注册信息

**必填项**:
- **用户名**: 3-16个字符，只能包含大小写字母、数字和下划线
  - ✅ 有效: `user_123`, `TestUser`, `admin123`
  - ❌ 无效: `user@123`, `用户`, `a`, `verylongusernamethatexceedsthemaximum`

- **邮箱**: 有效的邮箱格式
  - ✅ 有效: `student@university.edu`, `user123@example.com`
  - ❌ 无效: `invalid-email`, `user@`, `@example.com`

- **密码**: 至少6个字符
  - ✅ 有效: `pass123`, `MySecure2024`, `防诈@123abc`
  - 建议使用大小写字母、数字和特殊字符的组合

- **确认密码**: 必须与密码完全相同

**可选项**:
- 真实姓名
- 学号
- 所在学院
- 专业

### 第三步：同意条款

勾选"我已阅读并同意《服务条款》和《隐私政策》"

### 第四步：提交

点击"创建账户"按钮。

### 第五步：登录

- 注册成功后，会自动跳转到登录页面
- 使用刚注册的用户名和密码登录
- 可选：勾选"记住我"便于下次登录

---

## 🔐 用户认证系统

### 登录流程

1. 输入用户名（或邮箱）和密码
2. 系统验证凭证
3. 密码使用bcryptjs验证（安全比对）
4. 成功后返回JWT令牌和用户信息
5. 令牌存储在localStorage中
6. 跳转到个人仪表板

### 登出

在右上角点击用户菜单 → "登出"，会：
- 清除本地存储的令牌
- 清除会话数据
- 跳转主页

### 安全特性

✅ 密码使用bcryptjs加密（盐轮数：10）
✅ 支持JWT令牌认证
✅ CORS保护
✅ 未认证用户自动重定向
✅ 会话超时管理

---

## 📚 平台主要功能

### 1️⃣ 诈骗案例库

**访问**: `/fraud-cases`

**功能**:
- 查看真实诈骗案例
- 按类型筛选（电信诈骗、校园诈骗等）
- 查看案例详情和防范建议
- 了解常见诈骗手段

**案例类型**: 
- 🎓 校园贷诈骗
- 📱 兼职刷单诈骗
- 💳 支付宝转账诈骗
- 👨‍💼 冒充老师诈骗
- 📞 以及更多...

### 2️⃣ 知识学习

**访问**: `/knowledge`

**功能**:
- 学习防诈骗知识
- 追踪学习进度
- 针对不同欺诈类型的教育资料
- 最佳实践和安全建议

**学习模块**:
1. 基础防诈常识
2. 识别常见诈骗手段
3. 遭遇诈骗时的应对
4. 个人信息保护
5. 事件报告和求助

### 3️⃣ 防诈骗问卷

**访问**: `/survey`

**功能**:
- 参与防诈骗意识调查
- 评估个人安全知识
- 提供反馈意见
- 获取个性化建议

### 4️⃣ 个人中心

**访问**: `/profile`

**功能**:
- 查看个人信息
- 编辑个人资料
- 更改头像
- 查看学习历史
- 查看完成的问卷

---

## 🗄️ 数据库结构

### 用户表 (users)
```
id: 用户ID（主键）
username: 用户名（唯一）
email: 邮箱（唯一）
password: 加密密码
real_name: 真实姓名
student_id: 学号
phone: 电话
college: 学院
major: 专业
avatar_url: 头像URL
created_at: 创建时间
updated_at: 更新时间
```

### 诈骗案例表 (fraud_cases)
```
id: 案例ID
title: 案例标题
description: 详细描述
case_type: 诈骗类型
severity: 严重程度
prevention_tips: 防范建议
statistics: 统计信息
images: 图片URL
```

### 知识模块表 (knowledge_modules)
```
id: 模块ID
title: 模块标题
description: 模块描述
content: 内容
category: 分类
difficulty_level: 难度级别
created_at: 创建时间
```

### 用户学习进度表 (user_learning_progress)
```
id: 进度ID
user_id: 用户ID
module_id: 模块ID
completion_status: 完成状态
progress_percentage: 进度百分比
last_accessed: 最后访问时间
```

### 问卷表 (surveys)
```
id: 问卷ID
title: 问卷标题
description: 描述
questions: 问题JSON
created_at: 创建时间
```

### 用户问卷表 (user_surveys)
```
id: 记录ID
user_id: 用户ID
survey_id: 问卷ID
answers: 答案JSON
score: 得分
completion_date: 完成日期
```

---

## 🔌 API 端点

### 认证接口

| 方法 | 端点 | 功能 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/auth/check` | 检查认证状态 |

### 用户接口

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/user/profile` | 获取用户信息 |
| PUT | `/api/user/profile` | 更新用户信息 |
| GET | `/api/user/learning-progress` | 获取学习进度 |

### 案例接口

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/fraud-cases` | 获取所有案例 |
| GET | `/api/fraud-cases/:id` | 获取单个案例 |
| GET | `/api/fraud-cases/type/:type` | 按类型筛选 |

### 知识接口

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/knowledge` | 获取所有模块 |
| GET | `/api/knowledge/:id` | 获取单个模块 |
| POST | `/api/knowledge/progress` | 更新学习进度 |

### 问卷接口

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/surveys` | 获取所有问卷 |
| POST | `/api/surveys/submit` | 提交问卷答案 |
| GET | `/api/surveys/results/:surveyId` | 获取问卷结果 |

---

## 🧪 测试和调试

### 运行诊断工具

访问专门的测试页面：
```
http://localhost:3000/test-registration.html
```

功能：
- ✓ 测试服务器连接
- ✓ 测试API端点
- ✓ 验证表单输入
- ✓ 直接尝试注册
- ✓ 检查数据库状态

### 使用浏览器开发工具

按 `F12` 打开开发工具：

**Console 选项卡** - 查看日志和错误
**Network 选项卡** - 监控API请求
**Storage 选项卡** - 查看localStorage中的token

### 命令行调试

查看服务器日志：
```bash
npm start
```

查看数据库内容：
```bash
sqlite3 /workspaces/project-2/db/fraud_prevention.db ".tables"
```

---

## 📦 项目结构

```
project-2/
├── server.js              # Express主服务器
├── package.json           # 项目依赖
├── db/
│   └── db.js             # 数据库初始化
├── routes/
│   ├── auth.js           # 认证路由
│   ├── user.js           # 用户路由
│   ├── fraudCases.js     # 案例路由
│   ├── knowledge.js      # 知识路由
│   └── survey.js         # 问卷路由
├── middleware/
│   └── auth.js           # 认证中间件
├── public/
│   ├── index.html        # 首页
│   ├── register.html     # 注册页
│   ├── login.html        # 登录页
│   ├── dashboard.html    # 仪表板
│   ├── fraud-cases.html  # 案例页
│   ├── knowledge.html    # 知识页
│   ├── survey.html       # 问卷页
│   ├── profile.html      # 个人中心
│   ├── test-registration.html  # 测试工具
│   ├── css/              # 样式文件
│   └── js/               # JavaScript文件
└── TROUBLESHOOTING.md    # 故障排除指南
```

---

## ⚙️ 环境配置

### 环境变量（可选）

创建 `.env` 文件：
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
DATABASE_PATH=./db/fraud_prevention.db
```

### 修改配置

编辑 `server.js` 中的配置：
```javascript
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key';  // 改为强密钥
```

---

## 🚀 部署建议

### 生产环境检查清单

- [ ] 使用强JWT密钥
- [ ] 启用HTTPS
- [ ] 配置生产数据库（SQLite → PostgreSQL/MySQL）
- [ ] 设置环境变量
- [ ] 启用错误日志
- [ ] 配置CORS白名单
- [ ] 实现速率限制
- [ ] 使用进程管理器（PM2）
- [ ] 配置CDN和缓存
- [ ] 定期备份数据库

---

## 📞 支持和反馈

如遇到问题，请：

1. 查阅 `TROUBLESHOOTING.md`
2. 使用诊断工具 `/test-registration.html`
3. 检查服务器日志
4. 查看浏览器控制台错误

---

**平台版本**: 1.0.0
**最后更新**: 2026-04-08
**许可证**: MIT
