export class GoalsManager {
  constructor() {
    this.goals = [];
  }

  initializePage() {
    this.renderGoalsPage();
    this.setupGoalActions();
  }

  renderGoalsPage() {
    const goalsContainer = document.createElement('div');
    goalsContainer.id = 'goalsPage';
    goalsContainer.classList.add('page-view');
    goalsContainer.innerHTML = `
      <h2>Metas Financeiras</h2>
      
      <div class="goals-summary">
        <div class="total-goals-progress">
          <h3>Progresso Geral das Metas</h3>
          <div class="progress-bar">
            <div id="overallGoalProgress" class="progress"></div>
          </div>
          <span id="overallGoalProgressText">0%</span>
        </div>
      </div>

      <div id="goalsList" class="goals-list">
        <!-- Goals will be dynamically populated here -->
      </div>

      <button id="addGoalBtn" class="add-goal-btn">Adicionar Nova Meta</button>
      <button id="returnFromGoals" class="return-btn">Voltar ao Dashboard</button>

      <!-- Add Goal Modal -->
      <div id="addGoalModal" class="modal">
        <div class="modal-content">
          <h3>Adicionar Nova Meta Financeira</h3>
          <form id="addGoalForm">
            <input type="text" id="goalTitle" placeholder="Título da Meta" required>
            <input type="number" id="goalTargetAmount" placeholder="Valor da Meta" step="0.01" required>
            <input type="date" id="goalDeadline" required>
            <select id="goalCategory" required>
              <option value="">Selecione a Categoria</option>
              <option value="savings">Economia</option>
              <option value="investment">Investimento</option>
              <option value="debt-reduction">Redução de Dívidas</option>
              <option value="purchase">Compra Específica</option>
            </select>
            <button type="submit">Criar Meta</button>
          </form>
        </div>
      </div>

      <!-- Update Goal Progress Modal -->
      <div id="updateGoalProgressModal" class="modal">
        <div class="modal-content">
          <h3>Atualizar Progresso da Meta</h3>
          <form id="updateGoalProgressForm">
            <input type="hidden" id="updateGoalId">
            <input type="number" id="progressAmount" placeholder="Valor Adicionado" step="0.01" required>
            <button type="submit">Atualizar</button>
          </form>
        </div>
      </div>
    `;

    // Replace or append to dashboard content
    const existingPage = document.getElementById('goalsPage');
    if (existingPage) {
      existingPage.replaceWith(goalsContainer);
    } else {
      document.querySelector('.dashboard-content').appendChild(goalsContainer);
    }

    this.loadGoals();
    this.renderGoalsList();
  }

  setupGoalActions() {
    const addGoalBtn = document.getElementById('addGoalBtn');
    const addGoalModal = document.getElementById('addGoalModal');
    const addGoalForm = document.getElementById('addGoalForm');
    const updateGoalProgressForm = document.getElementById('updateGoalProgressForm');

    addGoalBtn.addEventListener('click', () => {
      addGoalModal.style.display = 'block';
    });

    addGoalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addNewGoal();
      addGoalModal.style.display = 'none';
    });

    updateGoalProgressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.updateGoalProgress();
      document.getElementById('updateGoalProgressModal').style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      const addGoalModal = document.getElementById('addGoalModal');
      const updateGoalProgressModal = document.getElementById('updateGoalProgressModal');
      
      if (e.target === addGoalModal) {
        addGoalModal.style.display = 'none';
      }
      if (e.target === updateGoalProgressModal) {
        updateGoalProgressModal.style.display = 'none';
      }
    });
  }

  addNewGoal() {
    const goal = {
      id: Date.now(),
      title: document.getElementById('goalTitle').value,
      targetAmount: parseFloat(document.getElementById('goalTargetAmount').value),
      deadline: document.getElementById('goalDeadline').value,
      category: document.getElementById('goalCategory').value,
      currentAmount: 0,
      progress: 0
    };

    this.goals.push(goal);
    this.saveGoals();
    this.renderGoalsList();
  }

  renderGoalsList() {
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = '';

    this.goals.forEach(goal => {
      const goalElement = document.createElement('div');
      goalElement.classList.add('goal-item');
      goalElement.innerHTML = `
        <div class="goal-header">
          <h3>${goal.title}</h3>
          <span class="goal-category">${this.getCategoryLabel(goal.category)}</span>
        </div>
        <div class="goal-details">
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress" style="width: ${goal.progress}%"></div>
            </div>
            <span class="progress-text">${goal.progress.toFixed(2)}%</span>
          </div>
          <div class="goal-amounts">
            <span>Meta: R$ ${goal.targetAmount.toFixed(2)}</span>
            <span>Atual: R$ ${goal.currentAmount.toFixed(2)}</span>
          </div>
          <div class="goal-deadline">
            <span>Prazo: ${new Date(goal.deadline).toLocaleDateString()}</span>
          </div>
          <div class="goal-actions">
            <button class="update-goal-btn" data-id="${goal.id}">Atualizar</button>
            <button class="delete-goal-btn" data-id="${goal.id}">Excluir</button>
          </div>
        </div>
      `;
      goalsList.appendChild(goalElement);
    });

    this.setupGoalActionListeners();
    this.updateOverallGoalProgress();
  }

  setupGoalActionListeners() {
    const updateButtons = document.querySelectorAll('.update-goal-btn');
    const deleteButtons = document.querySelectorAll('.delete-goal-btn');

    updateButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const goalId = parseInt(e.target.dataset.id);
        this.prepareGoalProgressUpdate(goalId);
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const goalId = parseInt(e.target.dataset.id);
        this.deleteGoal(goalId);
      });
    });
  }

  prepareGoalProgressUpdate(goalId) {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      document.getElementById('updateGoalId').value = goalId;
      document.getElementById('updateGoalProgressModal').style.display = 'block';
    }
  }

  updateGoalProgress() {
    const goalId = parseInt(document.getElementById('updateGoalId').value);
    const progressAmount = parseFloat(document.getElementById('progressAmount').value);

    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount += progressAmount;
      goal.progress = (goal.currentAmount / goal.targetAmount) * 100;
      
      // Ensure progress doesn't exceed 100%
      goal.progress = Math.min(goal.progress, 100);
      
      this.saveGoals();
      this.renderGoalsList();
    }
  }

  deleteGoal(goalId) {
    this.goals = this.goals.filter(goal => goal.id !== goalId);
    this.saveGoals();
    this.renderGoalsList();
  }

  saveGoals() {
    localStorage.setItem('financialGoals', JSON.stringify(this.goals));
  }

  loadGoals() {
    const savedGoals = localStorage.getItem('financialGoals');
    this.goals = savedGoals ? JSON.parse(savedGoals) : [];
  }

  updateOverallGoalProgress() {
    if (this.goals.length === 0) {
      document.getElementById('overallGoalProgress').style.width = '0%';
      document.getElementById('overallGoalProgressText').textContent = '0%';
      return;
    }

    const totalProgress = this.goals.reduce((sum, goal) => sum + goal.progress, 0);
    const overallProgress = totalProgress / this.goals.length;

    document.getElementById('overallGoalProgress').style.width = `${overallProgress}%`;
    document.getElementById('overallGoalProgressText').textContent = `${overallProgress.toFixed(2)}%`;
  }

  getCategoryLabel(category) {
    const categories = {
      'savings': 'Economia',
      'investment': 'Investimento',
      'debt-reduction': 'Redução de Dívidas',
      'purchase': 'Compra Específica'
    };
    return categories[category] || category;
  }
}