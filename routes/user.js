const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { db } = require('../db/db');

// 获取用户信息
router.get('/profile', requireAuth, (req, res) => {
  const userId = req.userId;

  db.get(
    'SELECT id, username, email, real_name, student_id, phone, college, major, avatar_url, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }

      res.json({ user });
    }
  );
});

// 更新用户信息
router.put('/profile', requireAuth, (req, res) => {
  const userId = req.userId;
  const { real_name, phone, college, major, avatar_url } = req.body;

  db.run(
    `UPDATE users SET real_name = ?, phone = ?, college = ?, major = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [real_name, phone, college, major, avatar_url, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: '更新失败' });
      }

      res.json({ message: '个人信息更新成功' });
    }
  );
});

// 修改密码
router.post('/change-password', requireAuth, (req, res) => {
  const userId = req.userId;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: '所有字段为必填项' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: '新密码输入不一致' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: '新密码长度至少为6位' });
  }

  db.get('SELECT password FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: '查询失败' });
    }

    const bcrypt = require('bcryptjs');
    const passwordMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: '旧密码不正确' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: '密码修改失败' });
        }

        res.json({ message: '密码修改成功' });
      }
    );
  });
});

// 获取用户学习统计
router.get('/stats', requireAuth, (req, res) => {
  const userId = req.userId;

  db.all(
    'SELECT * FROM user_learning_progress WHERE user_id = ?',
    [userId],
    (err, progress) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      const completedCount = progress.filter(p => p.completed === 1).length;
      const totalCount = progress.length;
      const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      db.all(
        'SELECT COUNT(*) as count FROM test_records WHERE user_id = ?',
        [userId],
        (err, testCount) => {
          db.all(
            'SELECT COUNT(*) as count FROM user_surveys WHERE user_id = ?',
            [userId],
            (err, surveyCount) => {
              res.json({
                learningProgress: {
                  completed: completedCount,
                  total: totalCount,
                  rate: completionRate
                },
                testCount: testCount[0]?.count || 0,
                surveyCount: surveyCount[0]?.count || 0
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
