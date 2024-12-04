let editingPostId = null; // Переменная для хранения ID редактируемого поста

async function loadPosts() {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    const response = await fetch('http://localhost:3000/forum', {
        headers: {
            'Authorization': `Bearer ${token}` // Передаем токен в заголовках
        }
    });
    const posts = await response.json();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Очищаем контейнер перед загрузкой новых постов

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `<strong>${post.username}</strong> (${new Date(post.createdAt).toLocaleString()}): <p>${post.content}</p>`;

        // Проверка на роль пользователя
        const userRole = localStorage.getItem('role');
        if (userRole === 'admin') {
            postDiv.innerHTML += `
                <button onclick="editPost('${post._id}', '${post.username}', '${post.content}')">Редактировать</button>
                <button onclick="deletePost('${post._id}')">Удалить</button>
            `;
        }

        postsContainer.appendChild(postDiv); // Добавляем пост в контейнер
    });
}

// Функция для редактирования поста
async function editPost(postId, username, content) {
    editingPostId = postId; // Сохраняем ID поста, который редактируем
    document.getElementById('username').value = username; // Заполняем поля формы
    document.getElementById('content').value = content;
}

// Функция для создания или обновления поста
document.getElementById('post-form').onsubmit = async function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const username = document.getElementById('username').value;
    const content = document.getElementById('content').value;

    if (!username.trim() || content.trim().length < 5) {
        alert("Пожалуйста, заполните поля корректно.");
        return;
    }

    const postData = { username, content };

    let response;
    if (editingPostId) {
        // Если редактируем пост
        response = await fetch(`http://localhost:3000/forum/${editingPostId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(postData)
        });
        editingPostId = null; // Сбрасываем ID после редактирования
    } else {
        // Создаем новый пост
        response = await fetch('http://localhost:3000/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(postData)
        });
    }

    const message = await response.text();
    alert(message);
    loadPosts(); // Обновить список постов
}

// Функция для удаления поста
async function deletePost(postId) {
    const response = await fetch(`http://localhost:3000/forum/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const message = await response.text();
    alert(message);
    loadPosts(); // Обновить список постов
}

// Загрузка постов при загрузке страницы
window.onload = loadPosts;
