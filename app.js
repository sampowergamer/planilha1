import { LoginManager } from './login.js';
import { DashboardManager } from './dashboard.js';
import { GraphicsManager } from './graphics.js';
import { CreditCardManager } from './credit-cards.js';
import { StatementsManager } from './statements.js';
import { GoalsManager } from './goals.js';
import { ReportsManager } from './reports.js';

class FinancialTracker {
  constructor() {
    this.loginManager = new LoginManager();
    this.dashboardManager = new DashboardManager();
    this.graphicsManager = new GraphicsManager();
    this.creditCardManager = new CreditCardManager();
    this.statementsManager = new StatementsManager();
    this.goalsManager = new GoalsManager();
    this.reportsManager = new ReportsManager();

    this.initializeNavigation();
    this.initializeThemeToggle();
    this.initializeLogout();
    this.setupPageNavigation();
  }

  setupPageNavigation() {
    const navigationButtons = [
      { id: 'graphicsBtn', pageId: 'graphicsPage', manager: this.graphicsManager },
      { id: 'cardsBtn', pageId: 'cardsPage', manager: this.creditCardManager },
      { id: 'statementsBtn', pageId: 'statementsPage', manager: this.statementsManager },
      { id: 'goalsBtn', pageId: 'goalsPage', manager: this.goalsManager },
      { id: 'reportsBtn', pageId: 'reportsPage', manager: this.reportsManager }
    ];

    navigationButtons.forEach(btn => {
      const button = document.getElementById(btn.id);
      const page = document.getElementById(btn.pageId);
      const returnButton = page?.querySelector('.return-btn');

      button?.addEventListener('click', () => {
        this.hideAllPages();
        page.style.display = 'block';
        btn.manager.initializePage?.();
      });

      returnButton?.addEventListener('click', () => {
        this.hideAllPages();
        document.querySelector('.dashboard-main-view').style.display = 'block';
      });
    });
  }

  hideAllPages() {
    const pages = document.querySelectorAll('.page-view, .dashboard-main-view');
    pages.forEach(page => page.style.display = 'none');
  }

  initializeNavigation() {
    // Removed as it seems to be redundant with the setupPageNavigation function
  }

  initializeThemeToggle() {
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');

    lightThemeBtn.addEventListener('click', () => {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    });

    darkThemeBtn.addEventListener('click', () => {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }

  initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
      this.loginManager.logout();
    });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const financialTracker = new FinancialTracker();
});

export { FinancialTracker };