const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { db } = require('../db/db');

// 获取所有问卷
router.get('/list', (req, res) => {
  db.all('SELECT * FROM surveys ORDER BY created_at DESC', (err, surveys) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    res.json({ surveys });
  });
});

// 获取单个问卷详情
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM surveys WHERE id = ?', [id], (err, survey) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    if (!survey) {
      return res.status(404).json({ error: '问卷不存在' });
    }

    // 解析questions JSON
    try {
      survey.questions = JSON.parse(survey.questions);
    } catch (e) {
      survey.questions = [];
    }

    res.json({ survey });
  });
});

// 提交问卷答案
router.post('/submit', requireAuth, (req, res) => {
  const userId = req.userId;
  const { surveyId, answers } = req.body;

  if (!surveyId || !answers) {
    return res.status(400).json({ error: '问卷ID和答案为必填项' });
  }

  // 验证问卷是否存在
  db.get('SELECT * FROM surveys WHERE id = ?', [surveyId], (err, survey) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    if (!survey) {
      return res.status(404).json({ error: '问卷不存在' });
    }

    // 计算得分（简单示例：根据答案数量计算）
    const score = Math.round((Object.keys(answers).length / JSON.parse(survey.questions).length) * 100);

    db.run(
      `INSERT INTO user_surveys (user_id, survey_id, answers, score)
       VALUES (?, ?, ?, ?)`,
      [userId, surveyId, JSON.stringify(answers), score],
      (err) => {
        if (err) {
          return res.status(500).json({ error: '提交失败' });
        }

        res.json({
          message: '问卷提交成功',
          score: score
        });
      }
    );
  });
});

// 获取用户的问卷回答记录
router.get('/user/records', requireAuth, (req, res) => {
  const userId = req.userId;

  db.all(
    `SELECT us.*, s.title FROM user_surveys us
     JOIN surveys s ON us.survey_id = s.id
     WHERE us.user_id = ?
     ORDER BY us.completed_at DESC`,
    [userId],
    (err, records) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      res.json({ records });
    }
  );
});

// 检查用户是否已回答某个问卷
router.get('/user/check/:surveyId', requireAuth, (req, res) => {
  const userId = req.userId;
  const surveyId = req.params.surveyId;

  db.get(
    'SELECT * FROM user_surveys WHERE user_id = ? AND survey_id = ?',
    [userId, surveyId],
    (err, record) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      res.json({
        hasCompleted: !!record,
        record: record || null
      });
    }
  );
});

// 获取问卷统计信息
router.get('/stats/:surveyId', (req, res) => {
  const surveyId = req.params.surveyId;

  db.get(
    'SELECT COUNT(*) as total_responses, AVG(score) as avg_score FROM user_surveys WHERE survey_id = ?',
    [surveyId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: '查询失败' });
      }

      res.json(stats);
    }
  );
});

module.exports = router;
