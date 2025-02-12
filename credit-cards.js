export class CreditCardManager {
  constructor() {
    this.cards = [];
  }

  initializePage() {
    this.renderCardsPage();
    this.setupCardActions();
  }

  renderCardsPage() {
    const cardsContainer = document.createElement('div');
    cardsContainer.id = 'cardsPage';
    cardsContainer.classList.add('page-view');
    cardsContainer.innerHTML = `
      <h2>Cartões de Crédito</h2>
      <div id="cardsList" class="cards-list"></div>
      <button id="addNewCardBtn" class="add-card-btn">Adicionar Novo Cartão</button>
      <button id="returnFromCards" class="return-btn">Voltar ao Dashboard</button>
      
      <div id="cardDetailsModal" class="modal">
        <div class="modal-content">
          <h3>Detalhes do Cartão</h3>
          <form id="cardDetailsForm">
            <input type="text" id="cardName" placeholder="Nome do Cartão" required>
            <input type="text" id="cardNumber" placeholder="Número do Cartão" required>
            <input type="number" id="cardLimit" placeholder="Limite" required>
            <input type="date" id="cardDueDate" placeholder="Data de Vencimento" required>
            <input type="file" id="cardImageUpload" accept="image/*">
            <button type="submit">Salvar Cartão</button>
          </form>
        </div>
      </div>
    `;

    // Replace the existing page or append to the dashboard
    const existingPage = document.getElementById('cardsPage');
    if (existingPage) {
      existingPage.replaceWith(cardsContainer);
    } else {
      document.querySelector('.dashboard-content').appendChild(cardsContainer);
    }

    this.loadSavedCards();
  }

  setupCardActions() {
    const addCardBtn = document.getElementById('addNewCardBtn');
    const cardDetailsModal = document.getElementById('cardDetailsModal');
    const cardDetailsForm = document.getElementById('cardDetailsForm');

    addCardBtn.addEventListener('click', () => {
      cardDetailsModal.style.display = 'block';
    });

    cardDetailsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addNewCard();
      cardDetailsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === cardDetailsModal) {
        cardDetailsModal.style.display = 'none';
      }
    });
  }

  addNewCard() {
    const card = {
      id: Date.now(),
      name: document.getElementById('cardName').value,
      number: document.getElementById('cardNumber').value,
      limit: parseFloat(document.getElementById('cardLimit').value),
      dueDate: document.getElementById('cardDueDate').value
    };

    // Handle card image upload
    const cardImageUpload = document.getElementById('cardImageUpload');
    if (cardImageUpload.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        card.image = e.target.result;
        this.saveCard(card);
      };
      reader.readAsDataURL(cardImageUpload.files[0]);
    } else {
      this.saveCard(card);
    }
  }

  saveCard(card) {
    this.cards.push(card);
    localStorage.setItem('creditCards', JSON.stringify(this.cards));
    this.renderCardsList();
  }

  loadSavedCards() {
    const savedCards = localStorage.getItem('creditCards');
    this.cards = savedCards ? JSON.parse(savedCards) : [];
    this.renderCardsList();
  }

  renderCardsList() {
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = '';

    this.cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card-item');
      cardElement.innerHTML = `
        <div class="card-details">
          <h3>${card.name}</h3>
          <p>Número: ${card.number}</p>
          <p>Limite: R$ ${card.limit.toFixed(2)}</p>
          <p>Vencimento: ${card.dueDate}</p>
          ${card.image ? `<img src="${card.image}" alt="Cartão" class="card-image">` : ''}
          <button class="delete-card-btn" data-id="${card.id}">Excluir</button>
        </div>
      `;
      
      cardsList.appendChild(cardElement);
    });

    this.setupCardDeletionListeners();
  }

  setupCardDeletionListeners() {
    const deleteButtons = document.querySelectorAll('.delete-card-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cardId = parseInt(e.target.dataset.id);
        this.deleteCard(cardId);
      });
    });
  }

  deleteCard(cardId) {
    this.cards = this.cards.filter(card => card.id !== cardId);
    localStorage.setItem('creditCards', JSON.stringify(this.cards));
    this.renderCardsList();
  }

  calculateCardBalance() {
    return this.cards.reduce((total, card) => total + card.limit, 0);
  }
}