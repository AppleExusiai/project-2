const jwt = require('jsonwebtoken');

// 简单的会话验证中间件
const requireAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token && !req.session.userId) {
    return res.status(401).json({ error: '未授权,请先登录' });
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, 'your_secret_key_change_this');
      req.userId = decoded.id;
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({ error: '令牌无效' });
    }
  } else {
    req.userId = req.session.userId;
  }

  next();
};

module.exports = {
  requireAuth
};
