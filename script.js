let newsList = [];

function loadNews() {
    const tbody = document.querySelector('#news-table tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading...</td></tr>';
    }

    fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news')
        .then(response => response.json())
        .then(data => {
            newsList = data;
            renderNews();
        });
}

function renderNews() {
    const tbody = document.querySelector('#news-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        newsList.forEach(news => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${news.id}</td>
                <td>${news.title}</td>
                <td>${news.category}</td>
                <td>${news.likes}</td>
                <td>${news.dateUpdated}</td>
                <td>${news.dateCreated}</td>
                <td>
                    <button class="delete-btn" onclick="deleteNews(${news.id}, this)">Delete</button>
                    <button class="update-btn" onclick="toUpdate(${news.id})">Update</button>
                </td>
            `;
        });
    }
}

function deleteNews(id, button) {
    const row = button.closest('tr');
    row.style.transition = 'opacity 0.5s';
    row.style.opacity = '0';

    setTimeout(() => {
        fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(() => {
            loadNews();
        });
    }, 500);
}

function toUpdate(id) {
    window.location.href = `updatenews.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', function() {
    loadNews();

    const createForm = document.getElementById('news-form');
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const newsData = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                editorFirstName: formData.get('editor-firstname'),
                editorLastName: formData.get('editor-lastname')
            };

            fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newsData),
            })
            .then(response => response.json())
            .then(() => {
                window.location.href = 'index.html';
            });
        });
    }

    const updateForm = document.getElementById('update-news-form');
    if (updateForm) {
        const urlData = new URLSearchParams(window.location.search);
        const newsId = urlData.get('id');
        
        if (newsId) {
            fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${newsId}`)
                .then(response => response.json())
                .then(news => {
                    document.getElementById('title').value = news.title;
                    document.getElementById('description').value = news.description;
                    document.getElementById('category').value = news.category;
                    document.getElementById('editor-firstname').value = news.editorFirstName;
                    document.getElementById('editor-lastname').value = news.editorLastName;
                });
        }

        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const newsData = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                editorFirstName: formData.get('editor-firstname'),
                editorLastName: formData.get('editor-lastname')
            };

            fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${newsId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newsData),
            })
            .then(response => response.json())
            .then(() => {
                window.location.href = 'index.html';
            });
        });
    }
});