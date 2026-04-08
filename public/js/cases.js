// 防诈骗案例页面JavaScript

let allCases = [];
let currentPage = 1;
const pageSize = 6;
let filteredCases = [];

document.addEventListener('DOMContentLoaded', () => {
  initCasesPage();
});

async function initCasesPage() {
  updateNavBar();
  await loadCases();
  setupEventListeners();
}

// 加载案例
async function loadCases() {
  try {
    const response = await fetch(`${API_BASE_URL}/fraud-cases?limit=100`);
    const data = await response.json();

    allCases = data.data;
    filteredCases = allCases;

    // 初始化筛选器
    initializeFilters();
    displayCases();
  } catch (error) {
    console.error('加载案例失败:', error);
  }
}

// 初始化筛选器
function initializeFilters() {
  const types = new Set();
  const severities = new Set();

  allCases.forEach(fraudCase => {
    types.add(fraudCase.case_type);
    severities.add(fraudCase.severity);
  });

  // 初始化案例类型筛选
  const typeFilters = document.getElementById('typeFilters');
  typeFilters.innerHTML = '<label class="checkbox-item"><input type="checkbox" value="all" checked><span>全部诈骗类型</span></label>';

  types.forEach(type => {
    const label = document.createElement('label');
    label.className = 'checkbox-item';
    label.innerHTML = `
      <input type="checkbox" value="${type}">
      <span>${type}</span>
    `;
    typeFilters.appendChild(label);
  });

  // 初始化风险等级筛选
  const severityFilters = document.getElementById('severityFilters');
  severityFilters.innerHTML = '<label class="checkbox-item"><input type="checkbox" value="all" checked><span>全部等级</span></label>';

  severities.forEach(severity => {
    const label = document.createElement('label');
    label.className = 'checkbox-item';
    label.innerHTML = `
      <input type="checkbox" value="${severity}">
      <span>风险等级: ${severity}</span>
    `;
    severityFilters.appendChild(label);
  });
}

// 显示案例
function displayCases() {
  const casesList = document.getElementById('casesList');
  casesList.innerHTML = '';

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageCases = filteredCases.slice(start, end);

  if (pageCases.length === 0) {
    casesList.innerHTML = '<div class="empty-message">未找到匹配的案例</div>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  pageCases.forEach(fraudCase => {
    const card = createCaseCard(fraudCase);
    casesList.appendChild(card);
  });

  // 更新分页
  updatePagination();
}

// 创建案例卡片
function createCaseCard(fraudCase) {
  const card = document.createElement('div');
  card.className = 'case-list-item';

  const severityColor = {
    '高': '#e74c3c',
    '中': '#f39c12',
    '低': '#27ae60'
  };

  const color = severityColor[fraudCase.severity] || '#3498db';

  card.innerHTML = `
    <div class="case-item-header">
      <h3>${fraudCase.title}</h3>
      <span class="case-badge" style="background-color: ${color};">${fraudCase.severity}</span>
    </div>
    <p class="case-item-description">${fraudCase.description}</p>
    <div class="case-item-meta">
      <span class="meta-tag">${fraudCase.case_type}</span>
      <span class="meta-stats">${fraudCase.statistics || '已记录'}</span>
    </div>
    <div class="case-item-footer">
      <button class="btn btn-small btn-outline view-case-btn" data-id="${fraudCase.id}">查看详情</button>
    </div>
  `;

  return card;
}

// 更新分页
function updatePagination() {
  const totalPages = Math.ceil(filteredCases.length / pageSize);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  // 上一页
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '← 上一页';
    prevBtn.onclick = () => {
      currentPage--;
      displayCases();
      window.scrollTo(0, 0);
    };
    pagination.appendChild(prevBtn);
  }

  // 页码
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.onclick = () => {
      currentPage = i;
      displayCases();
      window.scrollTo(0, 0);
    };
    pagination.appendChild(pageBtn);
  }

  // 下一页
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '下一页 →';
    nextBtn.onclick = () => {
      currentPage++;
      displayCases();
      window.scrollTo(0, 0);
    };
    pagination.appendChild(nextBtn);
  }
}

// 设置事件监听
function setupEventListeners() {
  // 筛选事件
  const typeCheckboxes = document.querySelectorAll('#typeFilters input');
  const severityCheckboxes = document.querySelectorAll('#severityFilters input');

  typeCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  severityCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

  // 搜索事件
  document.getElementById('searchBtn').addEventListener('click', handleSearch);
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // 排序事件
  document.getElementById('sortSelect').addEventListener('change', handleSort);

  // 查看详情按钮
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-case-btn')) {
      const caseId = e.target.dataset.id;
      showCaseDetail(caseId);
    }
  });

  // 关闭模态框
  document.querySelector('.close').addEventListener('click', closeCaseModal);
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('caseModal');
    if (e.target === modal) {
      closeCaseModal();
    }
  });
}

// 应用筛选
function applyFilters() {
  const selectedTypes = Array.from(document.querySelectorAll('#typeFilters input:checked')).map(cb => cb.value);
  const selectedSeverities = Array.from(document.querySelectorAll('#severityFilters input:checked')).map(cb => cb.value);

  // 处理"全部"选项
  const hasAll = selectedTypes.includes('all') && selectedSeverities.includes('all');

  filteredCases = allCases.filter(fraudCase => {
    const typeMatch = !selectedTypes.includes('all') ? selectedTypes.includes(fraudCase.case_type) : true;
    const severityMatch = !selectedSeverities.includes('all') ? selectedSeverities.includes(fraudCase.severity) : true;
    return typeMatch && severityMatch;
  });

  currentPage = 1;
  displayCases();
}

// 处理搜索
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();

  filteredCases = allCases.filter(fraudCase =>
    fraudCase.title.toLowerCase().includes(query) ||
    fraudCase.description.toLowerCase().includes(query)
  );

  currentPage = 1;
  displayCases();
}

// 处理排序
function handleSort() {
  const sortValue = document.getElementById('sortSelect').value;

  switch (sortValue) {
    case 'newest':
      filteredCases.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'oldest':
      filteredCases.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'severity':
      const severityOrder = { '高': 1, '中': 2, '低': 3 };
      filteredCases.sort((a, b) => (severityOrder[a.severity] || 999) - (severityOrder[b.severity] || 999));
      break;
  }

  currentPage = 1;
  displayCases();
}

// 显示案例详情
async function showCaseDetail(caseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/fraud-cases/${caseId}`);
    const data = await response.json();
    const fraudCase = data.fraudCase;

    const severityColor = {
      '高': '#e74c3c',
      '中': '#f39c12',
      '低': '#27ae60'
    };

    const color = severityColor[fraudCase.severity] || '#3498db';

    const modal = document.getElementById('caseModal');
    const detail = document.getElementById('caseDetail');

    detail.innerHTML = `
      <h2>${fraudCase.title}</h2>
      <div class="case-meta">
        <span class="badge" style="background-color: ${color}; color: white;">风险等级: ${fraudCase.severity}</span>
        <span class="badge">${fraudCase.case_type}</span>
      </div>
      
      <div class="case-section">
        <h3>案例描述</h3>
        <p>${fraudCase.description}</p>
      </div>

      <div class="case-section">
        <h3>防范建议</h3>
        <p>${fraudCase.prevention_tips}</p>
      </div>

      ${fraudCase.statistics ? `
      <div class="case-section">
        <h3>统计信息</h3>
        <p>${fraudCase.statistics}</p>
      </div>
      ` : ''}
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('加载案例详情失败:', error);
  }
}

// 关闭案例模态框
function closeCaseModal() {
  document.getElementById('caseModal').style.display = 'none';
}
