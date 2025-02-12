document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const cardsPerPage = 3;
    let currentPage = 1;

    function showPage(page) {
        const startIndex = (page - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;

        cards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });

        pageInfo.textContent = `Página ${page} de ${Math.ceil(cards.length / cardsPerPage)}`;
    }

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(cards.length / cardsPerPage)) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Inicializa a primeira página
    showPage(currentPage);

    // Simulação de integração com Open Finance
    const connectButton = document.getElementById('connect-open-finance');
    connectButton.addEventListener('click', () => {
        alert('Conectando ao Open Finance...');
        // Aqui você pode adicionar a lógica real de integração com Open Finance
    });
});