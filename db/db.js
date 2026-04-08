const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'fraud_prevention.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库表
function initDB() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 用户表
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          real_name TEXT,
          student_id TEXT,
          phone TEXT,
          college TEXT,
          major TEXT,
          avatar_url TEXT DEFAULT 'default_avatar.jpg',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 防诈骗案例表
      db.run(`
        CREATE TABLE IF NOT EXISTS fraud_cases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          case_type TEXT NOT NULL,
          severity TEXT,
          prevention_tips TEXT,
          statistics TEXT,
          images TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 知识学习模块
      db.run(`
        CREATE TABLE IF NOT EXISTS knowledge_modules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          content TEXT NOT NULL,
          duration INTEGER,
          level TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 用户学习进度
      db.run(`
        CREATE TABLE IF NOT EXISTS user_learning_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          module_id INTEGER NOT NULL,
          completed INTEGER DEFAULT 0,
          progress INTEGER DEFAULT 0,
          completed_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (module_id) REFERENCES knowledge_modules(id)
        )
      `);

      // 问卷调查
      db.run(`
        CREATE TABLE IF NOT EXISTS surveys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          questions TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 用户问卷答卷
      db.run(`
        CREATE TABLE IF NOT EXISTS user_surveys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          survey_id INTEGER NOT NULL,
          answers TEXT NOT NULL,
          score INTEGER,
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (survey_id) REFERENCES surveys(id)
        )
      `);

      // 用户测试记录
      db.run(`
        CREATE TABLE IF NOT EXISTS test_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          test_type TEXT NOT NULL,
          questions TEXT NOT NULL,
          answers TEXT NOT NULL,
          score INTEGER NOT NULL,
          passed INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('数据库表初始化成功');
          insertSampleData();
          resolve();
        }
      });
    });
  });
}

// 插入示例数据
function insertSampleData() {
  // 插入防诈骗案例
  db.run(`
    INSERT OR IGNORE INTO fraud_cases (title, description, case_type, severity, prevention_tips, statistics)
    VALUES 
    ('冒充辅导员诈骗学费', '骗子冒充学生辅导员，声称需要补交学费、杂费等，要求学生转账', '冒充诈骗', '高', '学校不会通过QQ、微信等非官方渠道要求学生转账支付费用', '已有300+起案例'),
    ('兼职刷单诈骗', '通过招聘平台发布虚假兼职信息，要求学生先支付押金或培训费', '兼职诈骗', '中', '正规兼职不需要支付任何费用，不要相信高薪快速兼职', '已有150+起案例'),
    ('赌博和博彩诈骗', '通过各类APP推荐赌博应用，承诺高收益，实际上属于非法赌博', '网络诈骗', '高', '远离任何形式的赌博，不要相信一夜暴富的承诺', '已有200+起案例'),
    ('贷款诈骗', '声称可以提供快速贷款，要求支付手续费或保证金', '贷款诈骗', '高', '正规贷款机构不会在放款前要求支付费用', '已有100+起案例'),
    ('购物诈骗', '通过虚假商城或二手平台出售商品，收款后不发货', '网络诈骗', '中', '在正规平台购物，使用平台担保交易功能', '已有250+起案例')
  `);

  // 插入知识学习模块
  db.run(`
    INSERT OR IGNORE INTO knowledge_modules (title, category, content, duration, level)
    VALUES 
    ('识别常见诈骗手法', '基础知识', '学习如何识别常见的诈骗方式和套路', 15, '初级'),
    ('网络安全基础', '网络安全', '了解网络安全的基本常识和防护方法', 20, '初级'),
    ('个人信息保护', '隐私保护', '学习如何保护自己的个人信息和隐私', 15, '初级'),
    ('支付安全指南', '支付安全', '掌握各类支付方式的安全使用方法', 20, '中级'),
    ('心理学与诈骗防御', '心理学', '了解诈骗分子的心理技巧和防御方法', 25, '中级'),
    ('法律知识普及', '法律知识', '了解与诈骗相关的法律责任和处罚', 20, '高级')
  `);

  // 插入问卷调查
  db.run(`
    INSERT OR IGNORE INTO surveys (title, description, questions)
    VALUES 
    ('防诈骗意识调查', '了解你对诈骗的认知程度', '[{"id":1,"question":"你收到过诈骗短信或电话吗？","options":["从未","偶尔","频繁"]},{"id":2,"question":"你对诈骗的防范意识评分","options":["很低","一般","高","非常高"]},{"id":3,"question":"你认为最容易被诈骗的是","options":["赚钱类","消费类","冒充类","感情类"]}]')
  `);
}

module.exports = {
  db,
  initDB
};
