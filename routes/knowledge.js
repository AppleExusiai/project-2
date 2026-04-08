const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { db } = require('../db/db');

// 获取所有知识模块
router.get('/modules', (req, res) => {
  const { category, level, page = 1, limit = 10 } = req.query;
  
  let query = 'SELECT * FROM knowledge_modules WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (level) {
    query += ' AND level = ?';
    params.push(level);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  db.all(query, params, (err, modules) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM knowledge_modules WHERE 1=1';
    const countParams = [];
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (level) {
      countQuery += ' AND level = ?';
      countParams.push(level);
    }

    db.get(countQuery, countParams, (err, result) => {
      res.json({
        data: modules,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    });
  });
});

// 获取单个知识模块详情
router.get('/modules/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM knowledge_modules WHERE id = ?', [id], (err, module) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    if (!module) {
      return res.status(404).json({ error: '模块不存在' });
    }

    res.json({ module });
  });
});

// 获取用户的学习进度
router.get('/progress', requireAuth, (req, res) => {
  const userId = req.userId;

  db.all(
    `SELECT ulp.*, km.title, km.category, km.duration, km.level 
     FROM user_learning_progress ulp 
     JOIN knowledge_modules km ON ulp.module_id = km.id
     WHERE ulp.user_id = ? 
     ORDER BY ulp.created_at DESC`,
    [userId],
    (err, progress) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      res.json({ progress });
    }
  );
});

// 更新学习进度
router.post('/progress/:moduleId', requireAuth, (req, res) => {
  const userId = req.userId;
  const moduleId = req.params.moduleId;
  const { progress, completed } = req.body;

  // 检查是否已经有记录
  db.get(
    'SELECT * FROM user_learning_progress WHERE user_id = ? AND module_id = ?',
    [userId, moduleId],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      const completedValue = completed ? 1 : 0;
      const completedAt = completed ? new Date().toISOString() : null;

      if (existing) {
        // 更新现有记录
        db.run(
          `UPDATE user_learning_progress 
           SET progress = ?, completed = ?, completed_at = ?
           WHERE user_id = ? AND module_id = ?`,
          [progress || existing.progress, completedValue, completedAt, userId, moduleId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: '更新失败' });
            }
            res.json({ message: '学习进度已更新' });
          }
        );
      } else {
        // 创建新记录
        db.run(
          `INSERT INTO user_learning_progress (user_id, module_id, progress, completed, completed_at)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, moduleId, progress || 0, completedValue, completedAt],
          (err) => {
            if (err) {
              return res.status(500).json({ error: '创建失败' });
            }
            res.json({ message: '学习进度已保存' });
          }
        );
      }
    }
  );
});

// 获取学习统计
router.get('/stats/overview', (req, res) => {
  db.all('SELECT category, COUNT(*) as count FROM knowledge_modules GROUP BY category', (err, categoryStats) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    db.all('SELECT level, COUNT(*) as count FROM knowledge_modules GROUP BY level', (err, levelStats) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      db.get('SELECT COUNT(*) as total FROM knowledge_modules', (err, totalCount) => {
        res.json({
          totalModules: totalCount.total,
          byCategory: categoryStats || [],
          byLevel: levelStats || []
        });
      });
    });
  });
});

module.exports = router;
