# 高校防诈骗宣传平台

一个为高校学生设计的防诈骗教育宣传平台，帮助学生提升防诈骗意识，学习诈骗防范知识。

## 🎯 项目功能

### 核心功能
- ✅ **用户认证系统** - 完整的注册和登录功能
- ✅ **防诈骗案例库** - 真实诈骗案例展示和分析
- ✅ **知识学习模块** - 系统的防诈骗知识课程
- ✅ **问卷调查** - 防诈骗意识问卷和评分
- ✅ **个人中心** - 用户信息管理和学习进度追踪
- ✅ **数据统计** - 学习成果统计分析

## 🚀 快速开始

### 系统要求
- Node.js 14.0+
- npm 或 yarn

### 安装步骤

1. **进入项目目录**
```bash
cd /workspaces/project-2
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
npm start
```

4. **访问应用**
打开浏览器访问 `http://localhost:3000`

## 📁 项目结构

```
project-2/
├── public/                    # 前端文件
│   ├── index.html            # 首页
│   ├── login.html            # 登录页
│   ├── register.html         # 注册页
│   ├── dashboard.html        # 学习中心
│   ├── cases.html            # 案例库
│   ├── knowledge.html        # 知识学习
│   ├── survey.html           # 问卷调查
│   ├── profile.html          # 个人中心
│   ├── css/                  # 样式文件
│   └── js/                   # JavaScript文件
├── routes/                    # API路由
│   ├── auth.js              # 认证路由（注册、登录）
│   ├── user.js              # 用户路由
│   ├── fraudCases.js        # 防诈骗案例路由
│   ├── knowledge.js         # 知识学习路由
│   └── survey.js            # 问卷调查路由
├── middleware/               # 中间件
│   └── auth.js              # 认证中间件
├── db/                        # 数据库
│   └── db.js                # 数据库初始化
├── server.js                 # 主服务器文件
└── package.json              # 项目配置
```

## 🔐 用户认证

### 注册功能
- 用户名、邮箱、密码必填
- 支持学生信息填写（可选）
- 密码加密存储

### 登录功能
- 支持用户名或邮箱登录
- JWT令牌认证
- Session会话管理

## 📚 防诈骗案例库

包含以下诈骗类型的真实案例：
- **冒充诈骗** - 冒充辅导员、教务处等
- **兼职诈骗** - 虚假兼职招聘
- **网络诈骗** - 赌博、购物等
- **贷款诈骗** - 虚假贷款服务
- **其他诈骗** - 其他典型诈骗方式

## 📖 知识学习模块

分三个难度等级的课程：
- **初级课程** - 识别常见诈骗手法、网络安全基础
- **中级课程** - 支付安全、心理学防御
- **高级课程** - 法律知识、综合防御技能

## 📋 问卷调查

- 防诈骗意识调查问卷
- 自动计分和评估
- 学习建议提供

## 👤 个人中心功能

- 👤 **基本信息** - 修改个人资料和头像
- 🔒 **密码管理** - 修改登录密码
- ⚙️ **隐私设置** - 个性化设置选项
- 📊 **学习统计** - 查看学习进度和成绩

## 🛠 API 端点

### 认证API
```
POST /api/auth/register      - 用户注册
POST /api/auth/login         - 用户登录
POST /api/auth/logout        - 用户登出
GET  /api/auth/check         - 检查登录状态
```

### 用户API
```
GET  /api/user/profile       - 获取用户信息
PUT  /api/user/profile       - 更新用户信息
POST /api/user/change-password - 修改密码
GET  /api/user/stats         - 获取用户统计
```

### 防诈骗案例API
```
GET  /api/fraud-cases        - 获取案例列表
GET  /api/fraud-cases/:id    - 获取案例详情
GET  /api/fraud-cases/stats/overview - 案例统计
```

### 知识学习API
```
GET  /api/knowledge/modules  - 获取课程列表
GET  /api/knowledge/modules/:id - 获取课程详情
GET  /api/knowledge/progress - 获取学习进度
POST /api/knowledge/progress/:moduleId - 更新进度
```

### 问卷调查API
```
GET  /api/survey/list        - 获取问卷列表
GET  /api/survey/:id         - 获取问卷详情
POST /api/survey/submit      - 提交问卷
GET  /api/survey/user/records - 获取用户答卷记录
```

## 🗄 数据库结构

使用SQLite数据库，包含以下表：
- **users** - 用户表
- **fraud_cases** - 防诈骗案例表
- **knowledge_modules** - 知识课程表
- **user_learning_progress** - 用户学习进度表
- **surveys** - 问卷表
- **user_surveys** - 用户问卷答卷表
- **test_records** - 用户测试记录表

## 🎨 前端技术

- HTML5
- CSS3（响应式设计）
- Vanilla JavaScript（无框架依赖）
- RESTful API

## ⚙️ 后端技术

- **框架**: Express.js
- **数据库**: SQLite3
- **认证**: JWT + Session
- **加密**: bcryptjs

## 📝 使用说明

### 首页
- 平台简介和数据统计
- 防诈骗案例展示
- 知识学习入口
- 问卷调查邀请

### 案例库
- 按诈骗类型筛选
- 按风险等级排序
- 案例详情查看
- 防范建议提示

### 知识学习
- 课程列表展示
- 学习进度跟踪
- 难度分级学习
- 学习统计分析

### 问卷调查
- 多选题问卷
- 自动评分系统
- 防诈骗意识评估
- 个性化建议

### 学习中心（仪表板）
- 学习概览统计
- 推荐课程展示
- 学习进度可视化
- 测试和问卷记录

## 📄 许可证

MIT License

---

**版本**: 1.0.0
**最后更新时间**: 2024年4月8日