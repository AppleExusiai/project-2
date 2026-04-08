// 首页JavaScript

document.addEventListener('DOMContentLoaded', () => {
  loadHomePageData();
  setupEventListeners();
});

// 加载首页数据
async function loadHomePageData() {
  try {
    // 加载防诈骗案例
    await loadCases();

    // 加载统计数据
    await loadStats();
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// 加载防诈骗案例
async function loadCases() {
  try {
    const response = await fetch(`${API_BASE_URL}/fraud-cases?limit=6`);
    const data = await response.json();

    const casesGrid = document.getElementById('casesGrid');
    if (!casesGrid) return;

    casesGrid.innerHTML = '';

    data.data.forEach(fraudCase => {
      const caseCard = createCaseCard(fraudCase);
      casesGrid.appendChild(caseCard);
    });
  } catch (error) {
    console.error('加载案例失败:', error);
  }
}

// 创建案例卡片
function createCaseCard(fraudCase) {
  const card = document.createElement('div');
  card.className = 'case-card';
  
  const severityColor = {
    '高': '#e74c3c',
    '中': '#f39c12',
    '低': '#27ae60'
  };

  const severityText = fraudCase.severity || '中';
  const color = severityColor[severityText] || '#3498db';

  card.innerHTML = `
    <div class="case-header">
      <h3>${fraudCase.title}</h3>
      <span class="case-type" style="background-color: ${color};">${fraudCase.case_type}</span>
    </div>
    <p class="case-description">${fraudCase.description.substring(0, 100)}...</p>
    <div class="case-footer">
      <div class="case-info">
        <span class="case-severity">风险等级: <strong style="color: ${color};">${severityText}</strong></span>
      </div>
      <a href="/cases#${fraudCase.id}" class="btn btn-small btn-outline">查看详情</a>
    </div>
  `;

  return card;
}

// 加载统计数据
async function loadStats() {
  try {
    const [casesStats, knowledgeStats] = await Promise.all([
      fetch(`${API_BASE_URL}/fraud-cases/stats/overview`).then(r => r.json()),
      fetch(`${API_BASE_URL}/knowledge/stats/overview`).then(r => r.json())
    ]);

    document.getElementById('totalCases').textContent = casesStats.totalCases || 0;
    document.getElementById('totalModules').textContent = knowledgeStats.totalModules || 0;
    
    // 获取用户数（示例数据）
    document.getElementById('totalUsers').textContent = '1000+';
    document.getElementById('userCount').textContent = Math.floor(Math.random() * 100 + 50);
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
}

// 设置事件监听器
function setupEventListeners() {
  // 案例筛选
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', handleCaseFilter);
  });

  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// 处理案例筛选
async function handleCaseFilter(e) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');

  const type = e.target.dataset.type;
  const casesGrid = document.getElementById('casesGrid');
  
  try {
    let url = `${API_BASE_URL}/fraud-cases?limit=6`;
    if (type !== 'all') {
      url += `&type=${encodeURIComponent(type)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    casesGrid.innerHTML = '';
    data.data.forEach(fraudCase => {
      const caseCard = createCaseCard(fraudCase);
      casesGrid.appendChild(caseCard);
    });
  } catch (error) {
    console.error('筛选案例失败:', error);
  }
}
