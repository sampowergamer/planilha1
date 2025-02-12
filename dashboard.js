export class DashboardManager {
  constructor() {
    this.initializeDashboardCharts();
    this.updateDashboardMetrics();
  }

  initializeDashboardCharts() {
    // Initialize dashboard charts using Chart.js
    this.createExpensesByCategoryChart();
    this.createMonthlyTransactionsChart();
    this.createBalanceProgressChart();
  }

  createExpensesByCategoryChart() {
    const ctx = document.getElementById('expensesByCategoryChart').getContext('2d');
    const expenses = financialTracker.transactions.filter(t => t.type === 'Despesa');
    const categoryTotals = expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [{
          data: Object.values(categoryTotals),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#E7E9ED'
          ]
        }]
      }
    });
  }

  createMonthlyTransactionsChart() {
    const ctx = document.getElementById('monthlyTransactionsChart').getContext('2d');
    const monthlyData = financialTracker.transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).getMonth();
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      if (transaction.type === 'Ganho') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += Math.abs(transaction.amount);
      }
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'Ganhos',
            data: Array.from({length: 12}, (_, i) => monthlyData[i]?.income || 0),
            backgroundColor: '#4CAF50'
          },
          {
            label: 'Despesas',
            data: Array.from({length: 12}, (_, i) => monthlyData[i]?.expense || 0),
            backgroundColor: '#F44336'
          }
        ]
      }
    });
  }

  createBalanceProgressChart() {
    const ctx = document.getElementById('balanceProgressChart').getContext('2d');
    const balancedTransactions = financialTracker.calculateBalance();
    const monthlyBalances = balancedTransactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).getMonth();
      acc[month] = transaction.balance;
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Saldo Mensal',
          data: Array.from({length: 12}, (_, i) => monthlyBalances[i] || 0),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });
  }

  updateDashboardMetrics() {
    // Update total income, expenses, and current balance
    this.updateTotalIncome();
    this.updateTotalExpenses();
    this.updateCurrentBalance();
    this.updateCreditCardBalance();
  }

  updateTotalIncome() {
    const balancedTransactions = financialTracker.calculateBalance();
    const totalIncome = balancedTransactions
      .filter(t => t.type === 'Ganho')
      .reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('totalIncome').textContent = `R$ ${totalIncome.toFixed(2)}`;
  }

  updateTotalExpenses() {
    const balancedTransactions = financialTracker.calculateBalance();
    const totalExpenses = Math.abs(balancedTransactions
      .filter(t => t.type === 'Despesa')
      .reduce((sum, t) => sum + t.amount, 0));
    document.getElementById('totalExpenses').textContent = `R$ ${totalExpenses.toFixed(2)}`;
  }

  updateCurrentBalance() {
    const balancedTransactions = financialTracker.calculateBalance();
    const currentBalance = balancedTransactions.length > 0 
      ? balancedTransactions[balancedTransactions.length - 1].balance 
      : 0;
    document.getElementById('currentBalance').textContent = `R$ ${currentBalance.toFixed(2)}`;
  }

  updateCreditCardBalance() {
    const creditCardBalance = financialTracker.transactions
      .filter(t => t.category === 'Cartão de Crédito')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    document.getElementById('creditCardBalance').textContent = `R$ ${creditCardBalance.toFixed(2)}`;
  }
}