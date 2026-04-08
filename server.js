const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const { initDB } = require('./db/db');

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const fraudCasesRoutes = require('./routes/fraudCases');
const knowledgeRoutes = require('./routes/knowledge');
const surveyRoutes = require('./routes/survey');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Session配置
app.use(session({
  secret: 'your_secret_key_change_this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // 开发环境设置为false，生产环境改为true
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/fraud-cases', fraudCasesRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/survey', surveyRoutes);

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 其他页面路由
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/cases', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cases.html'));
});

app.get('/knowledge', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'knowledge.html'));
});

app.get('/survey', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'survey.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '页面不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 初始化数据库并启动服务器
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('高校防诈骗宣传平台已启动');
  });
}).catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});

module.exports = app;
