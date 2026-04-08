// 仪表板页面JavaScript

let currentUserId = null;

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

async function initDashboard() {
  // 检查登录状态
  const status = await checkAuthStatus();
  if (!status.isLoggedIn) {
    window.location.href = '/login';
    return;
  }

  currentUserId = status.user.id;
  updateNavBar();

  // 加载数据
  await loadStats();
  await loadRecommendedModules();
  await loadLearningProgress();

  // 设置菜单点击事件
  setupMenuEvents();
}

// 设置菜单点击事件
function setupMenuEvents() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      if (section) {
        showSection(section);
      }
    });
  });
}

// 显示指定部分
function showSection(sectionId) {
  // 隐藏所有部分
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(s => s.classList.remove('active'));

  // 更新菜单
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(m => m.classList.remove('active'));
  document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

  // 显示选中部分
  document.getElementById(sectionId)?.classList.add('active');
}

// 加载统计数据
async function loadStats() {
  try {
    const data = await apiRequest('/user/stats');

    document.getElementById('completedModules').textContent = data.learningProgress.completed;
    document.getElementById('completionRate').textContent = data.learningProgress.rate + '%';
    document.getElementById('testCount').textContent = data.testCount;
    document.getElementById('surveyCount').textContent = data.surveyCount;

    // 更新进度条
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = data.learningProgress.rate + '%';
    document.getElementById('progressText').textContent = data.learningProgress.completed;
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
}

// 加载推荐模块
async function loadRecommendedModules() {
  try {
    const data = await fetch(`${API_BASE_URL}/knowledge/modules?limit=3`).then(r => r.json());

    const container = document.getElementById('recommendedModules');
    if (!container) return;

    container.innerHTML = '';
    data.data.forEach(module => {
      const card = createModuleCard(module);
      container.appendChild(card);
    });
  } catch (error) {
    console.error('加载推荐模块失败:', error);
  }
}

// 创建模块卡片
function createModuleCard(module) {
  const card = document.createElement('div');
  card.className = 'module-card';

  const levelColors = {
    '初级': '#2ecc71',
    '中级': '#f39c12',
    '高级': '#e74c3c'
  };

  const color = levelColors[module.level] || '#3498db';

  card.innerHTML = `
    <div class="module-header">
      <h4>${module.title}</h4>
      <span class="module-level" style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
        ${module.level}
      </span>
    </div>
    <p class="module-category">${module.category}</p>
    <div class="module-footer">
      <span>⏱️ ${module.duration || 0}分钟</span>
      <a href="/knowledge#${module.id}" class="btn btn-small btn-primary">学习</a>
    </div>
  `;

  return card;
}

// 加载学习进度
async function loadLearningProgress() {
  try {
    const data = await apiRequest('/knowledge/progress');

    const container = document.getElementById('learningList');
    if (!container) return;

    if (!data.progress || data.progress.length === 0) {
      container.innerHTML = '<div class="empty-message">暂无学习记录</div>';
      return;
    }

    container.innerHTML = '';
    data.progress.forEach(progress => {
      const item = createProgressItem(progress);
      container.appendChild(item);
    });
  } catch (error) {
    console.error('加载学习进度失败:', error);
  }
}

// 创建进度项
function createProgressItem(progress) {
  const item = document.createElement('div');
  item.className = 'progress-item';

  const completedClass = progress.completed === 1 ? 'completed' : '';

  item.innerHTML = `
    <div class="progress-info">
      <h4>${progress.title}</h4>
      <p>${progress.category} · ${progress.duration || 0}分钟</p>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progress.progress || 0}%"></div>
    </div>
    <div class="progress-meta">
      <span>${progress.progress || 0}%</span>
      ${progress.completed === 1 ? '<span class="badge badge-success">✓ 已完成</span>' : ''}
    </div>
  `;

  return item;
}

// 加载测试记录
async function loadTestRecords() {
  try {
    // 模拟加载测试记录
    const records = [];
    const tbody = document.getElementById('testsTableBody');
    
    if (!tbody) return;

    if (records.length === 0) {
      document.getElementById('testsEmpty').style.display = 'block';
    } else {
      document.getElementById('testsEmpty').style.display = 'none';
      tbody.innerHTML = '';
      records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.type}</td>
          <td>${formatDate(record.date)}</td>
          <td>${record.score}</td>
          <td>${record.passed ? '✓ 通过' : '✗ 未通过'}</td>
          <td><a href="#">查看</a></td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('加载测试记录失败:', error);
  }
}

// 加载问卷记录
async function loadSurveyRecords() {
  try {
    const data = await apiRequest('/survey/user/records');
    const tbody = document.getElementById('surveysTableBody');
    
    if (!tbody) return;

    if (!data.records || data.records.length === 0) {
      document.getElementById('surveysEmpty').style.display = 'block';
    } else {
      document.getElementById('surveysEmpty').style.display = 'none';
      tbody.innerHTML = '';
      data.records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.title}</td>
          <td>${formatDate(record.completed_at)}</td>
          <td>${record.score}分</td>
          <td><a href="/survey#${record.survey_id}">查看</a></td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('加载问卷记录失败:', error);
  }
}

// 监听部分显示
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.target.classList.contains('active')) {
      const sectionId = mutation.target.id;
      if (sectionId === 'tests') {
        loadTestRecords();
      } else if (sectionId === 'surveys') {
        loadSurveyRecords();
      }
    }
  });
});

document.querySelectorAll('.dashboard-section').forEach(section => {
  observer.observe(section, { attributes: true, attributeOldValue: true });
});
