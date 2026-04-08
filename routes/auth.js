const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/db');

// 注册接口
router.post('/register', (req, res) => {
  const { username, email, password, confirmPassword, real_name, student_id, college, major } = req.body;

  // 验证输入
  if (!username || !email || !password) {
    return res.status(400).json({ error: '用户名、邮箱和密码为必填项' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: '两次输入的密码不一致' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: '密码长度至少为6位' });
  }

  // 检查邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '邮箱格式不正确' });
  }

  // 加密密码
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 保存到数据库
  db.run(
    `INSERT INTO users (username, email, password, real_name, student_id, college, major) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [username, email, hashedPassword, real_name, student_id, college, major],
    (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: '用户名或邮箱已被注册' });
        }
        return res.status(500).json({ error: '注册失败' });
      }

      res.status(201).json({ 
        message: '注册成功，请登录',
        username: username 
      });
    }
  );
});

// 登录接口
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码为必填项' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, username],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      if (!user) {
        return res.status(401).json({ error: '用户名不存在' });
      }

      // 验证密码
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: '密码不正确' });
      }

      // 创建 JWT 令牌
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        'your_secret_key_change_this',
        { expiresIn: '7d' }
      );

      // 保存到session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };

      // 设置cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 * 7 // 7天
      });

      res.json({
        message: '登录成功',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          real_name: user.real_name,
          college: user.college,
          avatar_url: user.avatar_url
        }
      });
    }
  );
});

// 登出接口
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: '登出失败' });
    }

    res.clearCookie('token');
    res.json({ message: '登出成功' });
  });
});

// 检查登录状态
router.get('/check', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      isLoggedIn: true,
      user: req.session.user
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

module.exports = router;
