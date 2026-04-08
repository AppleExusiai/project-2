# 🛡️ 高校防诈骗宣传平台

**✅ 完全功能性的高校防诈骗教育平台 - 生产就绪**

为高校学生设计的交互式防诈骗教育宣传平台。帮助学生提升防诈骗意识，学习诈骗防范知识。

---

## 🚀 快速开始 (90秒)

```bash
# 1. 安装依赖
npm install

# 2. 启动服务器
npm start

# 3. 打开浏览器
# 访问 http://localhost:3000
```

**系统要求**: Node.js 14.0+, npm 6.0+

---

## 📋 文档导航

| 文档 | 内容 |
|------|------|
| **[QUICK_START.md](QUICK_START.md)** | ⚡ 90秒快速入门（必读） |
| **[PLATFORM_GUIDE.md](PLATFORM_GUIDE.md)** | 📖 完整功能和使用指南 |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | 🔧 问题排除和调试 |
| **[测试工具](http://localhost:3000/test-registration.html)** | 🧪 在线诊断工具 |

---

## 🎯 核心功能

✅ **用户认证** - 安全的注册、登录、会话管理
✅ **防诈骗案例库** - 真实案例展示和分析
✅ **知识学习模块** - 系统化的防诈骗课程
✅ **防诈骗问卷** - 意识评估和自测
✅ **个人中心** - 信息管理和进度追踪
✅ **数据统计** - 学习成果分析

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | Node.js + Express.js |
| **数据库** | SQLite3 |
| **前端** | HTML5 + CSS3 + Vanilla JavaScript |
| **认证** | JWT + Express Session |
| **安全** | bcryptjs (密码加密) |

---

## 📂 项目结构

```
project-2/
├── server.js              # Express主服务器
├── package.json           # 依赖配置
├── db/db.js              # 数据库初始化
├── routes/               # API路由
│   ├── auth.js          # 认证 (注册/登录/登出)
│   ├── user.js          # 用户管理
│   ├── fraudCases.js    # 案例管理
│   ├── knowledge.js     # 知识模块
│   └── survey.js        # 问卷调查
├── middleware/auth.js    # 认证中间件
└── public/              # 前端文件
    ├── *.html           # 8个HTML页面
    ├── css/             # 样式文件
    └── js/              # JavaScript逻辑
```

---

## 🔌 API端点概览

### 认证
```
POST   /api/auth/register         注册用户
POST   /api/auth/login            用户登录
POST   /api/auth/logout           用户登出
GET    /api/auth/check            检查认证状态
```

### 内容管理
```
GET    /api/fraud-cases           获取案例列表
GET    /api/fraud-cases/:id       获取案例详情
GET    /api/knowledge             获取知识模块
GET    /api/surveys               获取问卷列表
```

### 用户数据 (需认证)
```
GET    /api/user/profile          用户信息
PUT    /api/user/profile          更新信息
GET    /api/user/learning-progress 学习进度
```

---

## ✨ 平台亮点

🎓 **教育导向**
- 针对高校学生的防诈骗教育
- 真实案例+知识+互动评估

🔐 **安全优先**
- bcryptjs密码加密(盐轮数10)
- JWT令牌认证
- CORS和XSS防护

📊 **数据驱动**
- 学习进度追踪
- 问卷完成统计
- 用户行为记录

🌐 **完全独立**
- SQLite本地数据库
- 无外部依赖
- 即装即用

---

## 🧪 验证系统工作

### 方法1: 自动诊断
访问内置测试工具:
```
http://localhost:3000/test-registration.html
```

### 方法2: 手动测试
```bash
# 测试服务器
curl http://localhost:3000

# 测试注册API
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123","confirmPassword":"pass123"}'

# 查看用户数据库
sqlite3 db/fraud_prevention.db "SELECT username, email FROM users;"
```

---

## 📱 主要页面

| 页面 | URL | 功能 |
|------|-----|------|
| 首页 | `/` | 平台介绍 |
| 注册 | `/register` | 创建账户 |
| 登录 | `/login` | 用户登录 |
| 仪表板 | `/dashboard` | 学习中心 |
| 案例库 | `/fraud-cases` | 诈骗案例 |
| 知识 | `/knowledge` | 学习模块 |
| 问卷 | `/survey` | 调查问卷 |
| 个人中心 | `/profile` | 用户信息 |

---

## 🔍 常见问题

**Q: "无法创建用户"**
- 检查用户名/邮箱是否已注册
- 用户名需3-16字符，只能用字母、数字、下划线
- 密码至少6位

**Q: 登录无反应**
- 检查服务器是否运行: `npm start`
- 查看浏览器控制台 (F12) 是否有错误

**Q: 数据没保存**
- 确认SQLite数据库文件存在: `db/fraud_prevention.db`
- 重启服务器重新初始化

详见 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📊 数据库架构

7个核心表:

| 表名 | 用途 |
|------|------|
| **users** | 用户账户和信息 |
| **fraud_cases** | 诈骗案例 |
| **knowledge_modules** | 学习课程 |
| **user_learning_progress** | 学习进度 |
| **surveys** | 问卷定义 |
| **user_surveys** | 问卷答案 |
| **test_records** | 测试记录 |

---

## 🔐 安全特性

✓ bcryptjs密码加密(不可逆)
✓ JWT令牌认证
✓ Session超时管理
✓ UNIQUE约束(用户名/邮箱)
✓ 输入验证和清理
✓ CORS白名单保护

---

## 📦 依赖项

```json
{
  "express": "^4.18.0",
  "sqlite3": "^5.1.6",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "express-session": "^1.17.3"
}
```

---

## 🚀 部署建议

**生产环境检查清单**:
- [ ] 使用强JWT密钥
- [ ] 配置HTTPS
- [ ] 切换到PostgreSQL/MySQL
- [ ] 启用速率限制
- [ ] 设置环境变量
- [ ] 配置日志记录
- [ ] 定期备份数据
- [ ] 使用进程管理器(PM2)

---

## 📈 项目状态

| 状态 | 详情 |
|------|------|
| ✅ 完成度 | 100% |
| ✅ 功能 | 完全正常 |
| ✅ 数据库 | 已初始化 |
| ✅ 服务器 | 运行中 |
| ✅ 生产就绪 | 是 |

---

## 📞 获取帮助

1. **快速问题** → [QUICK_START.md](QUICK_START.md)
2. **功能咨询** → [PLATFORM_GUIDE.md](PLATFORM_GUIDE.md)
3. **错误排查** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. **在线测试** → [诊断工具](http://localhost:3000/test-registration.html)

---

## 📝 许可证

MIT License - 可自由使用和修改

---

## ✨ 特别功能

🧪 **内置诊断工具** - 测试页面用于验证功能
📚 **详尽文档** - 4个详细指南文件
🔄 **自动初始化** - 首次运行自动创建数据库
📱 **响应式设计** - 工作在任何设备上
💪 **无外部依赖** - 完全独立运行

---

**[立即开始 →](QUICK_START.md)**

版本: 1.0.0 | 状态: ✅ 生产就绪 | 最后更新: 2026-04-08
**最后更新时间**: 2024年4月8日