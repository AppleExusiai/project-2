const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { db } = require('../db/db');

// 获取所有防诈骗案例
router.get('/', (req, res) => {
  const { type, severity, page = 1, limit = 10 } = req.query;
  
  let query = 'SELECT * FROM fraud_cases WHERE 1=1';
  const params = [];

  if (type) {
    query += ' AND case_type = ?';
    params.push(type);
  }

  if (severity) {
    query += ' AND severity = ?';
    params.push(severity);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  db.all(query, params, (err, cases) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM fraud_cases WHERE 1=1';
    const countParams = [];
    if (type) {
      countQuery += ' AND case_type = ?';
      countParams.push(type);
    }
    if (severity) {
      countQuery += ' AND severity = ?';
      countParams.push(severity);
    }

    db.get(countQuery, countParams, (err, result) => {
      res.json({
        data: cases,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    });
  });
});

// 获取单个案例详情
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM fraud_cases WHERE id = ?', [id], (err, fraudCase) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    if (!fraudCase) {
      return res.status(404).json({ error: '案例不存在' });
    }

    res.json({ fraudCase });
  });
});

// 获取案例统计
router.get('/stats/overview', (req, res) => {
  db.all('SELECT case_type, COUNT(*) as count FROM fraud_cases GROUP BY case_type', (err, typeStats) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    db.all('SELECT severity, COUNT(*) as count FROM fraud_cases GROUP BY severity', (err, severityStats) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      db.get('SELECT COUNT(*) as total FROM fraud_cases', (err, totalCount) => {
        res.json({
          totalCases: totalCount.total,
          byType: typeStats || [],
          bySeverity: severityStats || []
        });
      });
    });
  });
});

module.exports = router;
