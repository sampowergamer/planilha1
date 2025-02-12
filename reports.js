export class ReportsManager {
  constructor() {
    this.initializeReportsPage();
  }

  initializeReportsPage() {
    this.setupYearSelector();
    this.generateAnnualReport();
    this.setupExportButtons();
  }

  setupYearSelector() {
    const yearSelector = document.getElementById('reportYearSelector');
    const currentYear = new Date().getFullYear();

    // Populate year selector with recent years
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      option.selected = i === currentYear;
      yearSelector.appendChild(option);
    }

    yearSelector.addEventListener('change', () => this.generateAnnualReport());
  }

  generateAnnualReport() {
    const selectedYear = document.getElementById('reportYearSelector').value;
    const reportContainer = document.getElementById('annualReportContainer');

    const reportData = this.compileAnnualReportData(selectedYear);

    reportContainer.innerHTML = `
      <div class="annual-report-summary">
        <h2>Relatório Financeiro - ${selectedYear}</h2>
        <div class="report-highlights">
          <div class="highlight-card">
            <h3>Total de Receitas</h3>
            <p>R$ ${reportData.totalIncome.toFixed(2)}</p>
          </div>
          <div class="highlight-card">
            <h3>Total de Despesas</h3>
            <p>R$ ${reportData.totalExpenses.toFixed(2)}</p>
          </div>
          <div class="highlight-card">
            <h3>Saldo Anual</h3>
            <p>R$ ${reportData.annualBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div class="monthly-breakdown">
        <h3>Detalhamento Mensal</h3>
        <table>
          <thead>
            <tr>
              <th>Mês</th>
              <th>Receitas</th>
              <th>Despesas</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderMonthlyBreakdown(reportData.monthlyData)}
          </tbody>
        </table>
      </div>

      <div class="expense-categories">
        <h3>Distribuição de Gastos por Categoria</h3>
        <canvas id="expenseCategoriesChart"></canvas>
      </div>
    `;

    this.renderExpenseCategoriesChart(reportData.categoryExpenses);
  }

  compileAnnualReportData(year) {
    // Simulated data compilation - in real scenario, this would come from stored transactions
    return {
      totalIncome: 75000,
      totalExpenses: 65000,
      annualBalance: 10000,
      monthlyData: [
        { month: 'Janeiro', income: 6250, expenses: 5420, balance: 830 },
        { month: 'Fevereiro', income: 6100, expenses: 5600, balance: 500 },
        // Add other months...
      ],
      categoryExpenses: {
        'Alimentação': 15000,
        'Moradia': 12000,
        'Transporte': 8000,
        'Lazer': 5000,
        'Outros': 4000
      }
    };
  }

  renderMonthlyBreakdown(monthlyData) {
    return monthlyData.map(month => `
      <tr>
        <td>${month.month}</td>
        <td>R$ ${month.income.toFixed(2)}</td>
        <td>R$ ${month.expenses.toFixed(2)}</td>
        <td>R$ ${month.balance.toFixed(2)}</td>
      </tr>
    `).join('');
  }

  renderExpenseCategoriesChart(categoryExpenses) {
    const ctx = document.getElementById('expenseCategoriesChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(categoryExpenses),
        datasets: [{
          data: Object.values(categoryExpenses),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', 
            '#4BC0C0', '#9966FF'
          ]
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Distribuição de Gastos por Categoria'
        }
      }
    });
  }

  setupExportButtons() {
    const exportPdfBtn = document.getElementById('exportReportPdfBtn');
    const exportExcelBtn = document.getElementById('exportReportExcelBtn');

    exportPdfBtn.addEventListener('click', () => this.exportReport('pdf'));
    exportExcelBtn.addEventListener('click', () => this.exportReport('excel'));
  }

  exportReport(format) {
    // Placeholder for export functionality
    alert(`Exportando relatório em formato ${format}`);
  }
}