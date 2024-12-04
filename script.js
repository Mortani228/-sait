document.getElementById('register-form').onsubmit = async function(event) {
    event.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const message = await response.text();
    alert(message);
}

document.getElementById('login-form').onsubmit = async function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role); // Сохраняем роль
        localStorage.setItem('email', email); // Сохраняем email
        alert('Успешный вход!');
        updateUI(); // Обновляем интерфейс
    } else {
        alert('Ошибка входа');
    }
}

// Функции для открытия и закрытия модальных окон
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.getElementById('login-button').onclick = function() {
    document.getElementById('login-modal').style.display = 'block';
}

document.getElementById('register-button').onclick = function() {
    document.getElementById('register-modal').style.display = 'block';
}

// Закрытие модальных окон при клике вне
window.onclick = function(event) {
    const modalLogin = document.getElementById('login-modal');
    const modalRegister = document.getElementById('register-modal');
    if (event.target === modalLogin || event.target === modalRegister) {
        modalLogin.style.display = "none";
        modalRegister.style.display = "none";
    }
}

// Показать текущего пользователя
function displayCurrentUser() {
    /*const userRole = localStorage.getItem('role');*/
    const token = localStorage.getItem('token');
    const currentUser = document.getElementById('current-user');

    if (token) {
        // Декодируем токен, чтобы получить email или id пользователя
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUser.innerText = `Вошел как: ${payload.email}`;
    } else {
        currentUser.innerText = '';
    }
}

// Функция выхода
document.getElementById('logout-button').onclick = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email'); // Удаляем email при выходе
    updateUI(); // Обновляем интерфейс
};

// Вызовем updateUI при загрузке страницы
window.onload = function() {
    updateUI(); // Проверяем состояние аутентификации и обновляем интерфейс
};

function updateUI() {
    const userInfoElement = document.getElementById('user-info');
    const authButtons = document.getElementById('auth-buttons');
    const logoutContainer = document.getElementById('logout-container');

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
        // Показываем информацию о пользователе
        const email = localStorage.getItem('email'); // Предполагается, что вы сохраняете email
        userInfoElement.textContent = `Вошли как: ${email}`;
        userInfoElement.style.display = 'block';

        // Скрываем кнопки входа/регистрации
        authButtons.style.display = 'none';
        logoutContainer.style.display = 'block';
    } else {
        // Если пользователь не вошел, показываем кнопки входа и скрываем информацию
        userInfoElement.style.display = 'none';
        authButtons.style.display = 'flex';
        logoutContainer.style.display = 'none';
    }
}

const slides = document.querySelectorAll('.slider-item');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length; // Переключаемся на следующий слайд
    showSlide(currentSlide);
}

// Запуск слайдера каждые 10 секунд
setInterval(nextSlide, 10000);

// Изначально показываем первый слайд
showSlide(currentSlide);