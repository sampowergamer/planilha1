export class LoginManager {
  constructor() {
    this.initializeLoginForm();
    this.preventUnauthorizedAccess();
  }

  initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (this.validateLogin(username, password)) {
        this.handleSuccessfulLogin();
      } else {
        loginError.textContent = 'Usuário ou senha inválidos';
      }
    });
  }

  validateLogin(username, password) {
    return username === 'samuca12' && password === 'Emsamuca120822';
  }

  handleSuccessfulLogin() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.querySelector('.main-app-container').style.display = 'flex';
  }

  preventUnauthorizedAccess() {
    // Prevent browser back/refresh without login
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
  }
}