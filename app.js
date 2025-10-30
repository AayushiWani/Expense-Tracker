// Global State
let currentUser = null;
let users = [
  { id: 1, email: 'demo@expense.com', password: 'demo123', name: 'Demo User' }
];
let transactions = [];
let budgets = {};
let transactionIdCounter = 1;
let userIdCounter = 2;

// Categories
const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
const expenseCategories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Groceries', 'Other'];

// Default budgets
const defaultBudgets = {
  'Food & Dining': 500,
  'Transportation': 300,
  'Shopping': 400,
  'Bills & Utilities': 600,
  'Entertainment': 200,
  'Healthcare': 300,
  'Education': 500,
  'Travel': 1000,
  'Groceries': 600,
  'Other': 300
};

// Category Icons
const categoryIcons = {
  'Salary': '💼',
  'Freelance': '💻',
  'Investment': '📈',
  'Business': '🏢',
  'Gift': '🎁',
  'Food & Dining': '🍽️',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Bills & Utilities': '💡',
  'Entertainment': '🎬',
  'Healthcare': '🏥',
  'Education': '📚',
  'Travel': '✈️',
  'Groceries': '🛒',
  'Other': '📌'
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Initialize app
function init() {
  initializeSampleData();
  setupEventListeners();
  showPage('login');
}

// Initialize sample data
function initializeSampleData() {
  const sampleTransactions = [
    { type: 'income', category: 'Salary', amount: 5000, date: '2025-10-01', notes: 'Monthly salary' },
    { type: 'expense', category: 'Food & Dining', amount: 45.50, date: '2025-10-15', notes: 'Dinner at restaurant' },
    { type: 'expense', category: 'Transportation', amount: 30, date: '2025-10-16', notes: 'Uber rides' },
    { type: 'income', category: 'Freelance', amount: 800, date: '2025-10-10', notes: 'Web design project' },
    { type: 'expense', category: 'Shopping', amount: 120, date: '2025-10-18', notes: 'Clothes shopping' },
    { type: 'expense', category: 'Bills & Utilities', amount: 150, date: '2025-10-05', notes: 'Electricity bill' },
    { type: 'expense', category: 'Entertainment', amount: 25, date: '2025-10-20', notes: 'Movie tickets' },
    { type: 'expense', category: 'Groceries', amount: 200, date: '2025-10-12', notes: 'Weekly groceries' },
    { type: 'expense', category: 'Healthcare', amount: 80, date: '2025-10-08', notes: 'Medical checkup' },
    { type: 'income', category: 'Investment', amount: 150, date: '2025-10-22', notes: 'Stock dividends' },
    { type: 'expense', category: 'Food & Dining', amount: 32.75, date: '2025-09-28', notes: 'Lunch meeting' },
    { type: 'expense', category: 'Transportation', amount: 50, date: '2025-09-25', notes: 'Gas station' },
    { type: 'income', category: 'Salary', amount: 5000, date: '2025-09-01', notes: 'Monthly salary' },
    { type: 'expense', category: 'Entertainment', amount: 60, date: '2025-09-15', notes: 'Concert tickets' },
    { type: 'expense', category: 'Shopping', amount: 200, date: '2025-08-20', notes: 'Electronics' }
  ];

  sampleTransactions.forEach(trans => {
    transactions.push({
      id: transactionIdCounter++,
      userId: 1,
      type: trans.type,
      category: trans.category,
      amount: trans.amount,
      date: trans.date,
      notes: trans.notes,
      timestamp: new Date(trans.date)
    });
  });

  // Initialize budgets for demo user
  budgets[1] = { ...defaultBudgets };
}

// Setup event listeners
function setupEventListeners() {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('demoLoginBtn').addEventListener('click', handleDemoLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.dataset.page;
      showPage(page);
    });
  });

  // FAB
  document.getElementById('fabBtn').addEventListener('click', () => showPage('add-transaction'));

  // Transaction form
  document.getElementById('transactionForm').addEventListener('submit', handleAddTransaction);
  document.getElementById('cancelTransactionBtn').addEventListener('click', () => showPage('dashboard'));
  
  // Type toggle
  document.querySelectorAll('.type-toggle__btn').forEach(btn => {
    btn.addEventListener('click', handleTypeToggle);
  });

  // Filters
  document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
  document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

  // Export
  document.getElementById('exportBtn').addEventListener('click', exportTransactions);

  // Modal handlers
  document.getElementById('confirmCancelBtn').addEventListener('click', () => hideModal('confirmModal'));
  document.getElementById('editCancelBtn').addEventListener('click', () => hideModal('editModal'));
  document.getElementById('editTransactionForm').addEventListener('submit', handleEditTransaction);
  document.getElementById('editTransactionType').addEventListener('change', updateEditCategoryOptions);
}

// Authentication
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    showToast('Login successful!', 'success');
    showPage('dashboard');
    errorEl.textContent = '';
  } else {
    errorEl.textContent = 'Invalid email or password';
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const errorEl = document.getElementById('registerError');

  // Validation
  if (!validateEmail(email)) {
    errorEl.textContent = 'Please enter a valid email address';
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters';
    return;
  }

  if (password !== confirmPassword) {
    errorEl.textContent = 'Passwords do not match';
    return;
  }

  if (users.find(u => u.email === email)) {
    errorEl.textContent = 'Email already registered';
    return;
  }

  // Create user
  const newUser = {
    id: userIdCounter++,
    email,
    password,
    name
  };
  users.push(newUser);
  budgets[newUser.id] = { ...defaultBudgets };

  currentUser = newUser;
  showToast('Registration successful!', 'success');
  showPage('dashboard');
  errorEl.textContent = '';
}

function handleDemoLogin() {
  document.getElementById('loginEmail').value = 'demo@expense.com';
  document.getElementById('loginPassword').value = 'demo123';
  document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

function handleLogout() {
  currentUser = null;
  showPage('login');
  showToast('Logged out successfully', 'success');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Page Navigation
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  
  // Show selected page
  const pageMap = {
    'login': 'loginPage',
    'dashboard': 'dashboardPage',
    'add-transaction': 'addTransactionPage',
    'budgets': 'budgetsPage',
    'history': 'historyPage'
  };

  const pageElement = document.getElementById(pageMap[pageName]);
  if (pageElement) {
    pageElement.classList.add('active');
  }

  // Update navigation
  const nav = document.getElementById('mainNav');
  if (pageName === 'login') {
    nav.style.display = 'none';
  } else {
    nav.style.display = 'block';
    document.getElementById('userName').textContent = currentUser?.name || '';
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageName) {
        link.classList.add('active');
      }
    });
  }

  // Load page-specific content
  if (pageName === 'dashboard') {
    loadDashboard();
  } else if (pageName === 'add-transaction') {
    loadAddTransactionPage();
  } else if (pageName === 'budgets') {
    loadBudgetsPage();
  } else if (pageName === 'history') {
    loadHistoryPage();
  }
}

// Dashboard
function loadDashboard() {
  const userTransactions = getUserTransactions();
  
  // Calculate summary
  const totalIncome = userTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = userTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Update summary cards
  document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
  document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('currentBalance').textContent = formatCurrency(balance);
  document.getElementById('savingsRate').textContent = savingsRate + '%';

  // Render charts
  renderPieChart(userTransactions);
  renderBarChart(userTransactions);
  renderLineChart(userTransactions);

  // Render recent transactions
  renderRecentTransactions(userTransactions);
}

function renderPieChart(userTransactions) {
  const canvas = document.getElementById('pieChart');
  const ctx = canvas.getContext('2d');
  const legend = document.getElementById('pieChartLegend');
  
  // Calculate expenses by category
  const expensesByCategory = {};
  userTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });

  const categories = Object.keys(expensesByCategory);
  const values = Object.values(expensesByCategory);
  const total = values.reduce((sum, val) => sum + val, 0);

  if (total === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'var(--color-text-secondary)';
    ctx.textAlign = 'center';
    ctx.fillText('No expense data', canvas.width / 2, canvas.height / 2);
    legend.innerHTML = '';
    return;
  }

  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;

  let currentAngle = -Math.PI / 2;

  categories.forEach((category, index) => {
    const sliceAngle = (values[index] / total) * 2 * Math.PI;
    
    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = chartColors[index % chartColors.length];
    ctx.fill();

    currentAngle += sliceAngle;
  });

  // Render legend
  legend.innerHTML = categories.map((category, index) => {
    const percentage = ((values[index] / total) * 100).toFixed(1);
    return `
      <div class="legend-item">
        <div class="legend-color" style="background-color: ${chartColors[index % chartColors.length]}"></div>
        <span>${category} (${percentage}%)</span>
      </div>
    `;
  }).join('');
}

function renderBarChart(userTransactions) {
  const canvas = document.getElementById('barChart');
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  // Get last 6 months data
  const months = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      label: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      month: date.getMonth()
    });
  }

  const data = months.map(m => {
    const monthTransactions = userTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === m.month && tDate.getFullYear() === m.year;
    });

    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return { label: m.label, income, expense };
  });

  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expense)), 1);
  const padding = 40;
  const chartHeight = canvas.height - padding * 2;
  const chartWidth = canvas.width - padding * 2;
  const barWidth = chartWidth / (data.length * 2.5);

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bars
  data.forEach((item, index) => {
    const x = padding + (index * (chartWidth / data.length));
    const incomeHeight = (item.income / maxValue) * chartHeight;
    const expenseHeight = (item.expense / maxValue) * chartHeight;

    // Income bar
    ctx.fillStyle = chartColors[0];
    ctx.fillRect(x, canvas.height - padding - incomeHeight, barWidth, incomeHeight);

    // Expense bar
    ctx.fillStyle = chartColors[2];
    ctx.fillRect(x + barWidth + 5, canvas.height - padding - expenseHeight, barWidth, expenseHeight);

    // Label
    ctx.fillStyle = 'var(--color-text)';
    ctx.textAlign = 'center';
    ctx.font = '12px sans-serif';
    ctx.fillText(item.label, x + barWidth, canvas.height - padding + 20);
  });

  // Draw legend
  ctx.fillStyle = chartColors[0];
  ctx.fillRect(padding, 10, 15, 15);
  ctx.fillStyle = 'var(--color-text)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Income', padding + 20, 22);

  ctx.fillStyle = chartColors[2];
  ctx.fillRect(padding + 100, 10, 15, 15);
  ctx.fillStyle = 'var(--color-text)';
  ctx.fillText('Expense', padding + 120, 22);
}

function renderLineChart(userTransactions) {
  const canvas = document.getElementById('lineChart');
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  // Get last 30 days spending
  const days = [];
  const currentDate = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      label: date.getDate()
    });
  }

  const data = days.map(d => {
    const dayExpenses = userTransactions
      .filter(t => t.type === 'expense' && t.date === d.date)
      .reduce((sum, t) => sum + t.amount, 0);
    return { label: d.label, value: dayExpenses };
  });

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = 40;
  const chartHeight = canvas.height - padding * 2;
  const chartWidth = canvas.width - padding * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = chartColors[0];
  ctx.lineWidth = 2;

  data.forEach((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = canvas.height - padding - (point.value / maxValue) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw points
  data.forEach((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = canvas.height - padding - (point.value / maxValue) * chartHeight;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = chartColors[0];
    ctx.fill();
  });

  // Draw axis labels (every 5 days)
  ctx.fillStyle = 'var(--color-text)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  data.forEach((point, index) => {
    if (index % 5 === 0) {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      ctx.fillText(point.label, x, canvas.height - padding + 20);
    }
  });
}

function renderRecentTransactions(userTransactions) {
  const container = document.getElementById('recentTransactions');
  const recent = userTransactions.slice(0, 10);

  if (recent.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📊</div><div class="empty-state__text">No transactions yet</div></div>';
    return;
  }

  container.innerHTML = recent.map(transaction => `
    <div class="transaction-item">
      <div class="transaction-icon">${categoryIcons[transaction.category] || '📌'}</div>
      <div class="transaction-details">
        <div class="transaction-category">${transaction.category}</div>
        <div class="transaction-notes">${transaction.notes}</div>
      </div>
      <div class="transaction-date">${formatDate(transaction.date)}</div>
      <div class="transaction-amount transaction-amount--${transaction.type}">
        ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
      </div>
    </div>
  `).join('');
}

// Add Transaction Page
function loadAddTransactionPage() {
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('transactionDate').value = today;
  
  // Update category options based on current type
  updateCategoryOptions('expense');
  
  // Reset form
  document.getElementById('transactionForm').reset();
  document.getElementById('transactionDate').value = today;
  document.getElementById('transactionError').textContent = '';
}

function handleTypeToggle(e) {
  const type = e.target.dataset.type;
  
  // Update button states
  document.querySelectorAll('.type-toggle__btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  
  // Update category options
  updateCategoryOptions(type);
}

function updateCategoryOptions(type) {
  const select = document.getElementById('transactionCategory');
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  
  select.innerHTML = '<option value="">Select a category</option>' +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function handleAddTransaction(e) {
  e.preventDefault();
  
  const type = document.querySelector('.type-toggle__btn.active').dataset.type;
  const category = document.getElementById('transactionCategory').value;
  const amount = parseFloat(document.getElementById('transactionAmount').value);
  const date = document.getElementById('transactionDate').value;
  const notes = document.getElementById('transactionNotes').value;
  const errorEl = document.getElementById('transactionError');

  // Validation
  if (!category) {
    errorEl.textContent = 'Please select a category';
    return;
  }

  if (!amount || amount <= 0) {
    errorEl.textContent = 'Please enter a valid amount';
    return;
  }

  if (!date) {
    errorEl.textContent = 'Please select a date';
    return;
  }

  // Create transaction
  const transaction = {
    id: transactionIdCounter++,
    userId: currentUser.id,
    type,
    category,
    amount,
    date,
    notes,
    timestamp: new Date(date)
  };

  transactions.push(transaction);
  showToast('Transaction added successfully!', 'success');
  showPage('dashboard');
}

// Budgets Page
function loadBudgetsPage() {
  // Display current month
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('currentMonthDisplay').textContent = currentMonth;

  // Get user budgets
  const userBudgets = budgets[currentUser.id] || {};
  
  // Calculate spending for current month
  const currentDate = new Date();
  const monthTransactions = getUserTransactions().filter(t => {
    const tDate = new Date(t.date);
    return t.type === 'expense' && 
           tDate.getMonth() === currentDate.getMonth() && 
           tDate.getFullYear() === currentDate.getFullYear();
  });

  const spendingByCategory = {};
  monthTransactions.forEach(t => {
    spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
  });

  // Calculate totals
  const totalBudget = Object.values(userBudgets).reduce((sum, val) => sum + val, 0);
  const totalSpent = Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0);
  const totalRemaining = totalBudget - totalSpent;

  // Update overview
  document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);
  document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
  document.getElementById('totalRemaining').textContent = formatCurrency(totalRemaining);
  
  const progressBar = document.getElementById('budgetProgressBar');
  const progressPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  progressBar.style.width = Math.min(progressPercent, 100) + '%';
  progressBar.className = 'progress-bar__fill';
  if (progressPercent >= 90) progressBar.classList.add('danger');
  else if (progressPercent >= 70) progressBar.classList.add('warning');

  // Render category budgets
  const container = document.getElementById('categoryBudgets');
  container.innerHTML = expenseCategories.map(category => {
    const budget = userBudgets[category] || 0;
    const spent = spendingByCategory[category] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    let statusClass = '';
    if (percentage >= 90) statusClass = 'danger';
    else if (percentage >= 70) statusClass = 'warning';

    return `
      <div class="budget-card">
        <div class="budget-card__header">
          <div class="budget-card__icon">${categoryIcons[category]}</div>
          <div class="budget-card__title">${category}</div>
        </div>
        <div class="budget-card__input">
          <span>$</span>
          <input type="number" 
                 class="form-control" 
                 value="${budget}" 
                 min="0" 
                 step="10"
                 data-category="${category}"
                 onchange="updateBudget('${category}', this.value)">
        </div>
        <div class="budget-card__stats">
          <span class="budget-card__spent">Spent: ${formatCurrency(spent)}</span>
          <span class="budget-card__percentage ${statusClass}">${percentage.toFixed(0)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar__fill ${statusClass}" style="width: ${Math.min(percentage, 100)}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function updateBudget(category, value) {
  const budget = parseFloat(value) || 0;
  if (!budgets[currentUser.id]) {
    budgets[currentUser.id] = {};
  }
  budgets[currentUser.id][category] = budget;
  showToast('Budget updated!', 'success');
  loadBudgetsPage();
}

// History Page
let currentFilters = {};
let currentPage = 1;
const itemsPerPage = 20;

function loadHistoryPage() {
  // Populate filter options
  const categoryFilter = document.getElementById('filterCategory');
  const allCategories = [...incomeCategories, ...expenseCategories];
  categoryFilter.innerHTML = '<option value="">All Categories</option>' +
    allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  // Clear filters
  currentFilters = {};
  currentPage = 1;
  
  renderTransactionsTable();
}

function applyFilters() {
  currentFilters = {
    fromDate: document.getElementById('filterFromDate').value,
    toDate: document.getElementById('filterToDate').value,
    category: document.getElementById('filterCategory').value,
    type: document.getElementById('filterType').value,
    search: document.getElementById('filterSearch').value.toLowerCase()
  };
  currentPage = 1;
  renderTransactionsTable();
}

function clearFilters() {
  document.getElementById('filterFromDate').value = '';
  document.getElementById('filterToDate').value = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('filterSearch').value = '';
  currentFilters = {};
  currentPage = 1;
  renderTransactionsTable();
}

function getFilteredTransactions() {
  let filtered = getUserTransactions();

  if (currentFilters.fromDate) {
    filtered = filtered.filter(t => t.date >= currentFilters.fromDate);
  }
  if (currentFilters.toDate) {
    filtered = filtered.filter(t => t.date <= currentFilters.toDate);
  }
  if (currentFilters.category) {
    filtered = filtered.filter(t => t.category === currentFilters.category);
  }
  if (currentFilters.type) {
    filtered = filtered.filter(t => t.type === currentFilters.type);
  }
  if (currentFilters.search) {
    filtered = filtered.filter(t => t.notes.toLowerCase().includes(currentFilters.search));
  }

  return filtered;
}

function renderTransactionsTable() {
  const filtered = getFilteredTransactions();
  
  // Update stats
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  document.getElementById('statTotalTransactions').textContent = filtered.length;
  document.getElementById('statTotalIncome').textContent = formatCurrency(totalIncome);
  document.getElementById('statTotalExpenses').textContent = formatCurrency(totalExpenses);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageTransactions = filtered.slice(startIndex, endIndex);

  // Render table
  const container = document.getElementById('transactionsTable');
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📭</div><div class="empty-state__text">No transactions found</div></div>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${pageTransactions.map(transaction => `
          <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${categoryIcons[transaction.category]} ${transaction.category}</td>
            <td>${transaction.notes}</td>
            <td><span class="status status--${transaction.type === 'income' ? 'success' : 'error'}">${transaction.type}</span></td>
            <td class="transaction-amount--${transaction.type}">
              ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </td>
            <td class="table-actions">
              <button class="icon-btn" onclick="editTransaction(${transaction.id})" title="Edit">✏️</button>
              <button class="icon-btn" onclick="deleteTransaction(${transaction.id})" title="Delete">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Render pagination
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  const buttons = [];
  
  // Previous button
  buttons.push(`<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      buttons.push(`<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      buttons.push('<span>...</span>');
    }
  }
  
  // Next button
  buttons.push(`<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`);
  
  container.innerHTML = buttons.join('');
}

function changePage(page) {
  const filtered = getFilteredTransactions();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderTransactionsTable();
}

function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  document.getElementById('editTransactionId').value = transaction.id;
  document.getElementById('editTransactionType').value = transaction.type;
  document.getElementById('editTransactionAmount').value = transaction.amount;
  document.getElementById('editTransactionDate').value = transaction.date;
  document.getElementById('editTransactionNotes').value = transaction.notes;
  
  updateEditCategoryOptions();
  document.getElementById('editTransactionCategory').value = transaction.category;
  
  showModal('editModal');
}

function updateEditCategoryOptions() {
  const type = document.getElementById('editTransactionType').value;
  const select = document.getElementById('editTransactionCategory');
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  
  select.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function handleEditTransaction(e) {
  e.preventDefault();
  
  const id = parseInt(document.getElementById('editTransactionId').value);
  const transaction = transactions.find(t => t.id === id);
  
  if (transaction) {
    transaction.type = document.getElementById('editTransactionType').value;
    transaction.category = document.getElementById('editTransactionCategory').value;
    transaction.amount = parseFloat(document.getElementById('editTransactionAmount').value);
    transaction.date = document.getElementById('editTransactionDate').value;
    transaction.notes = document.getElementById('editTransactionNotes').value;
    transaction.timestamp = new Date(transaction.date);
    
    showToast('Transaction updated!', 'success');
    hideModal('editModal');
    renderTransactionsTable();
  }
}

function deleteTransaction(id) {
  showConfirm(
    'Delete Transaction',
    'Are you sure you want to delete this transaction?',
    () => {
      const index = transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        transactions.splice(index, 1);
        showToast('Transaction deleted!', 'success');
        renderTransactionsTable();
      }
    }
  );
}

function exportTransactions() {
  const filtered = getFilteredTransactions();
  
  if (filtered.length === 0) {
    showToast('No transactions to export', 'error');
    return;
  }

  // Create CSV content
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Notes'];
  const rows = filtered.map(t => [
    t.date,
    t.type,
    t.category,
    t.amount,
    t.notes.replace(/,/g, ';')
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  
  // Simulate download
  console.log('CSV Export:\n', csv);
  showToast('Transactions exported! (Check console)', 'success');
}

// Utility Functions
function getUserTransactions() {
  return transactions
    .filter(t => t.userId === currentUser?.id)
    .sort((a, b) => b.timestamp - a.timestamp);
}

function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + type;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
}

function showConfirm(title, message, onConfirm) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  
  const confirmBtn = document.getElementById('confirmOkBtn');
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  
  newConfirmBtn.addEventListener('click', () => {
    onConfirm();
    hideModal('confirmModal');
  });
  
  showModal('confirmModal');
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', init);