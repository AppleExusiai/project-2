# ⚡ 快速开始指南

## 🎯 系统现状

✅ **已完成和验证的功能**：
- Node.js + Express服务器正常运行
- SQLite数据库已初始化，包含7个表
- 所有认证路由（注册、登录、登出、检查状态）
- 所有内容路由（案例、知识、问卷）
- 用户管理系统
- 密码加密（bcryptjs）
- JWT和Session认证
- 完整的前端UI页面
- 响应式CSS设计
- JavaScript表单验证
- CORS跨域支持

---

## 🚀 90秒快速启动

### 1️⃣ 启动服务器（已在运行）
```bash
cd /workspaces/project-2
npm start
```

### 2️⃣ 打开浏览器
访问：`http://localhost:3000`

### 3️⃣ 快速测试

**主页**: 
```
http://localhost:3000
```

**注册新用户**:
```
http://localhost:3000/register
```

使用示例数据：
- 用户名: `testuser123`
- 邮箱: `test123@example.com`
- 密码: `password123`

**登录**:
```
http://localhost:3000/login
```

使用刚注册的用户名和密码登录

**查看仪表板**:
```
http://localhost:3000/dashboard
```

**诊断注册问题**（如果有问题）:
```
http://localhost:3000/test-registration.html
```

---

## ✅ 验证系统工作

### 测试清单

- [ ] 访问首页，显示正常
- [ ] 打开注册页面，表单正常
- [ ] 注册新用户，收到成功消息
- [ ] 使用新用户登录，进入仪表板
- [ ] 查看诈骗案例
- [ ] 查看知识学习模块
- [ ] 访问个人中心
- [ ] 点击登出，返回首页

---

## 🔍 如果"无法创建用户"

**常见原因和解决方案**：

1. **用户名或邮箱已被注册**
   - 使用不同的用户名
   - 检查数据库中是否已存在

2. **表单验证失败**
   - 用户名必须是3-16个字符
   - 只能包含字母、数字、下划线
   - 邮箱格式必须有效
   - 密码最少6位

3. **服务器未运行**
   - 运行 `npm start`
   - 检查是否有错误信息

4. **网络连接问题**
   - 检查API_BASE_URL在common.js中是否正确
   - 确认http://localhost:3000可访问

**使用诊断工具**：
访问 `http://localhost:3000/test-registration.html`
- 测试服务器连接
- 测试API端点
- 验证表单
- 尝试直接注册

---

## 📚 详细文档

- **完整使用指南**: [PLATFORM_GUIDE.md](PLATFORM_GUIDE.md)
- **故障排除**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **原始README**: [README.md](README.md)

---

## 🔧 服务器命令

```bash
# 启动服务器（开发模式）
npm start

# 查看package.json
cat package.json

# 查看npm依赖
npm list

# 检查数据库
sqlite3 db/fraud_prevention.db ".tables"

# 查看用户
sqlite3 db/fraud_prevention.db "SELECT username, email FROM users;"
```

---

## 📱 API示例

### 注册API
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myuser",
    "email": "my@example.com",
    "password": "pass123456",
    "confirmPassword": "pass123456"
  }'
```

### 登录API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myuser",
    "password": "pass123456"
  }'
```

### 检查认证
```bash
curl http://localhost:3000/api/auth/check
```

---

## 💡 关键特性

### 安全功能
- ✅ bcryptjs密码加密
- ✅ JWT令牌认证
- ✅ Session管理
- ✅ CORS保护
- ✅ 邮箱格式验证
- ✅ 用户名/邮箱唯一性检查

### 功能模块
- ✅ 用户注册/登录
- ✅ 诈骗案例库
- ✅ 知识学习系统
- ✅ 防诈骗问卷
- ✅ 个人资料管理
- ✅ 学习进度追踪

### 开发特性  
- ✅ 详细服务器日志
- ✅ 前端表单验证
- ✅ 后端数据验证
- ✅ 错误处理和反馈
- ✅ 诊断工具页面

---

## 🧪 当前测试数据

数据库中已有的用户（用于测试）：

| 用户名 | 邮箱 | 密码 |
|--------|------|------|
| testuser | test@example.com | - |
| user2 | user2@example.com | - |
| test_user | testuser@example.com | - |
| newuser | newuser@test.com | password123 |

*注：可以使用这些用户测试登录（需要知道密码）或删除后创建新用户*

---

## 📋 平台特色

🎓 **教育导向**
- 针对高校学生的防诈骗教育
- 真实案例学习
- 互动式问卷

🛡️ **安全优先**
- 用户数据加密
- 安全认证流程
- CORS和XSS防护

📊 **数据追踪**
- 学习进度记录
- 问卷完成统计
- 用户活动日志

🌐 **完全离线**
- SQLite本地数据库
- 无外部依赖
- 完全独立运行

---

## 🎓 使用案例

### 学生
1. 注册账户
2. 浏览真实诈骗案例
3. 学习防诈骗知识
4. 参与问卷调查
5. 查看学习进度

### 教师/管理员
1. 部署平台
2. 初始化数据库和课程内容
3. 监控学生参与度
4. 更新案例和知识库

### 技术人员
1. 自定义平台
2. 添加新功能
3. 集成其他系统
4. 部署到生产环境

---

## 📞 下一步

1. **立即体验**: 访问 `http://localhost:3000`
2. **遇到问题**: 查看 `TROUBLESHOOTING.md`
3. **了解更多**: 阅读 `PLATFORM_GUIDE.md`
4. **自定义平台**: 修改数据库内容和样式

---

## ✨ 改进建议

未来可添加的功能：
- 📧 邮件通知
- 📱 移动应用版本
- 🤖 AI驱动的个性化推荐
- 📊 高级分析仪表板
- 🏆 成就徽章系统
- 👥 社区讨论功能
- 🔍 高级搜索功能
- 🎬 视频内容支持

---

**快速链接**:
- 🏠 [首页](http://localhost:3000)
- 📝 [注册](http://localhost:3000/register)
- 🔑 [登录](http://localhost:3000/login)
- 🧪 [诊断工具](http://localhost:3000/test-registration.html)

**版本**: 1.0.0 ✓ 完整
**状态**: 生产就绪 ✓
**最后更新**: 2026-04-08
