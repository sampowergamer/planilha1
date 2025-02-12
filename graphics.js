export class GraphicsManager {
  constructor() {
    this.initializeChartFilters();
  }

  initializePage() {
    this.createDynamicBarChart();
    this.createDynamicPieChart();
  }

  initializeChartFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    periodFilter.addEventListener('change', () => this.updateCharts());
    categoryFilter.addEventListener('change', () => this.updateCharts());
  }

  createDynamicBarChart() {
    const ctx = document.getElementById('dynamicBarChart').getContext('2d');
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Ganhos',
            data: [5000, 5500, 6000, 5200, 5800, 6200],
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          },
          {
            label: 'Despesas',
            data: [4000, 4500, 4200, 4600, 4300, 4800],
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Comparação Mensal de Ganhos e Despesas'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  createDynamicPieChart() {
    const ctx = document.getElementById('dynamicPieChart').getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Alimentação', 'Transporte', 'Lazer', 'Moradia', 'Outros'],
        datasets: [{
          data: [30, 20, 15, 25, 10],
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
          text: 'Distribuição de Gastos'
        }
      }
    });
  }

  updateCharts() {
    const period = document.getElementById('periodFilter').value;
    const category = document.getElementById('categoryFilter').value;

    // Placeholder for dynamic chart update logic
    console.log(`Updating charts: Period - ${period}, Category - ${category}`);
    
    // In a real application, this would fetch and filter data based on selections
    this.barChart.data.datasets[0].data = this.getFilteredData(period, category, 'income');
    this.barChart.data.datasets[1].data = this.getFilteredData(period, category, 'expense');
    this.barChart.update();

    this.pieChart.data.datasets[0].data = this.getFilteredPieData(category);
    this.pieChart.update();
  }

  getFilteredData(period, category, type) {
    // Placeholder method - would be replaced with actual data filtering
    const baseData = type === 'income' 
      ? [5000, 5500, 6000, 5200, 5800, 6200]
      : [4000, 4500, 4200, 4600, 4300, 4800];

    // Simple filtering logic
    switch(period) {
      case 'quarterly':
        return baseData.slice(0, 3);
      case 'annual':
        return new Array(12).fill(baseData[0]);
      default:
        return baseData;
    }
  }

  getFilteredPieData(category) {
    // Placeholder method for pie chart data filtering
    const baseData = [30, 20, 15, 25, 10];
    
    switch(category) {
      case 'food':
        return [baseData[0], 0, 0, 0, 0];
      case 'transport':
        return [0, baseData[1], 0, 0, 0];
      default:
        return baseData;
    }
  }

  exportChart(format) {
    // Placeholder for chart export functionality
    alert(`Exportando gráfico em formato ${format}`);
  }
}