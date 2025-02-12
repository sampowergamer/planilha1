export class StatementsManager {
  constructor() {
    this.statements = [];
  }

  initializePage() {
    this.renderStatementsPage();
    this.setupStatementActions();
  }

  renderStatementsPage() {
    const statementsContainer = document.createElement('div');
    statementsContainer.id = 'statementsPage';
    statementsContainer.classList.add('page-view');
    statementsContainer.innerHTML = `
      <h2>Extratos Financeiros</h2>
      
      <div class="statement-filters">
        <select id="statementMonthFilter">
          <option value="">Todos os Meses</option>
          <option value="1">Janeiro</option>
          <option value="2">Fevereiro</option>
          <option value="3">Março</option>
          <option value="4">Abril</option>
          <option value="5">Maio</option>
          <option value="6">Junho</option>
          <option value="7">Julho</option>
          <option value="8">Agosto</option>
          <option value="9">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
        
        <select id="statementTypeFilter">
          <option value="">Todos os Tipos</option>
          <option value="income">Ganhos</option>
          <option value="expense">Despesas</option>
        </select>
        
        <button id="exportStatementsBtn">Exportar Extratos</button>
      </div>

      <div id="statementsList" class="statements-list">
        <!-- Statements will be dynamically populated here -->
      </div>

      <button id="addStatementBtn" class="add-statement-btn">Adicionar Transação</button>
      <button id="returnFromStatements" class="return-btn">Voltar ao Dashboard</button>

      <!-- Add Statement Modal -->
      <div id="addStatementModal" class="modal">
        <div class="modal-content">
          <h3>Adicionar Nova Transação</h3>
          <form id="addStatementForm">
            <input type="date" id="statementDate" required>
            <input type="text" id="statementDescription" placeholder="Descrição" required>
            <select id="statementType" required>
              <option value="income">Ganho</option>
              <option value="expense">Despesa</option>
            </select>
            <input type="number" id="statementAmount" placeholder="Valor" step="0.01" required>
            <select id="statementCategory" required>
              <option value="">Selecione a Categoria</option>
              <option value="food">Alimentação</option>
              <option value="transport">Transporte</option>
              <option value="leisure">Lazer</option>
              <option value="housing">Moradia</option>
              <option value="other">Outros</option>
            </select>
            <button type="submit">Salvar Transação</button>
          </form>
        </div>
      </div>
    `;

    // Replace or append to dashboard content
    const existingPage = document.getElementById('statementsPage');
    if (existingPage) {
      existingPage.replaceWith(statementsContainer);
    } else {
      document.querySelector('.dashboard-content').appendChild(statementsContainer);
    }

    this.loadStatements();
    this.renderStatementsList();
  }

  setupStatementActions() {
    const monthFilter = document.getElementById('statementMonthFilter');
    const typeFilter = document.getElementById('statementTypeFilter');
    const addStatementBtn = document.getElementById('addStatementBtn');
    const addStatementModal = document.getElementById('addStatementModal');
    const addStatementForm = document.getElementById('addStatementForm');
    const exportStatementsBtn = document.getElementById('exportStatementsBtn');

    monthFilter.addEventListener('change', () => this.filterStatements());
    typeFilter.addEventListener('change', () => this.filterStatements());

    addStatementBtn.addEventListener('click', () => {
      addStatementModal.style.display = 'block';
    });

    addStatementForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addNewStatement();
      addStatementModal.style.display = 'none';
    });

    exportStatementsBtn.addEventListener('click', () => this.exportStatements());

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      const addStatementModal = document.getElementById('addStatementModal');
      if (e.target === addStatementModal) {
        addStatementModal.style.display = 'none';
      }
    });
  }

  addNewStatement() {
    const statement = {
      id: Date.now(),
      date: document.getElementById('statementDate').value,
      description: document.getElementById('statementDescription').value,
      type: document.getElementById('statementType').value,
      amount: parseFloat(document.getElementById('statementAmount').value),
      category: document.getElementById('statementCategory').value
    };

    this.statements.push(statement);
    this.saveStatements();
    this.renderStatementsList();
  }

  saveStatements() {
    localStorage.setItem('financialStatements', JSON.stringify(this.statements));
  }

  loadStatements() {
    const savedStatements = localStorage.getItem('financialStatements');
    this.statements = savedStatements ? JSON.parse(savedStatements) : [];
  }

  filterStatements() {
    const monthFilter = document.getElementById('statementMonthFilter').value;
    const typeFilter = document.getElementById('statementTypeFilter').value;

    const filteredStatements = this.statements.filter(statement => {
      const matchMonth = !monthFilter || 
        new Date(statement.date).getMonth() + 1 === parseInt(monthFilter);
      const matchType = !typeFilter || statement.type === typeFilter;
      return matchMonth && matchType;
    });

    this.renderStatementsList(filteredStatements);
  }

  renderStatementsList(statementsToRender = this.statements) {
    const statementsList = document.getElementById('statementsList');
    statementsList.innerHTML = '';

    statementsToRender.forEach(statement => {
      const statementElement = document.createElement('div');
      statementElement.classList.add('statement-item', statement.type);
      statementElement.innerHTML = `
        <div class="statement-details">
          <span class="date">${new Date(statement.date).toLocaleDateString()}</span>
          <span class="description">${statement.description}</span>
          <span class="amount ${statement.type}">
            ${statement.type === 'income' ? '+' : '-'} R$ ${statement.amount.toFixed(2)}
          </span>
          <span class="category">${statement.category}</span>
          <button class="delete-statement-btn" data-id="${statement.id}">Excluir</button>
        </div>
      `;
      statementsList.appendChild(statementElement);
    });

    this.setupStatementDeletionListeners();
  }

  setupStatementDeletionListeners() {
    const deleteButtons = document.querySelectorAll('.delete-statement-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const statementId = parseInt(e.target.dataset.id);
        this.deleteStatement(statementId);
      });
    });
  }

  deleteStatement(statementId) {
    this.statements = this.statements.filter(statement => statement.id !== statementId);
    this.saveStatements();
    this.renderStatementsList();
  }

  exportStatements() {
    // Basic export functionality (would typically use a library in a real app)
    const statementsCSV = this.statements.map(statement => 
      `${statement.date},${statement.description},${statement.type},${statement.amount},${statement.category}`
    ).join('\n');

    const blob = new Blob([statementsCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'extratos_financeiros.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}