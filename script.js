// Функция для прокрутки вверх
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать или скрыть кнопку возврата вверх
window.onscroll = function() {
    const backToTopButton = document.getElementById('back-to-top');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = 'block'; // Показываем кнопку
    } else {
        backToTopButton.style.display = 'none'; // Скрываем кнопку
    }
};
