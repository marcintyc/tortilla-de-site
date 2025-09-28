// Funkcja do przełączania sekcji
function showSection(sectionId) {
    // Ukryj wszystkie sekcje
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Pokaż wybraną sekcję
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Zaktualizuj aktywny link w nawigacji
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Obsługa nawigacji
document.addEventListener('DOMContentLoaded', function() {
    // Obsługa kliknięć w linki nawigacji
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href');
            showSection(targetSection);
            
            // Zamknij menu mobilne po kliknięciu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Obsługa menu mobilnego
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Obsługa formularza dodawania wpisu
    const togglePostFormBtn = document.getElementById('togglePostForm');
    const postForm = document.getElementById('postForm');
    const cancelPostBtn = document.getElementById('cancelPost');
    
    togglePostFormBtn.addEventListener('click', function() {
        postForm.classList.toggle('hidden');
        togglePostFormBtn.classList.toggle('hidden');
    });
    
    cancelPostBtn.addEventListener('click', function() {
        postForm.classList.add('hidden');
        togglePostFormBtn.classList.remove('hidden');
        postForm.reset();
    });
    
    // Obsługa wysyłania formularza
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Pobierz dane z formularza
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const author = document.getElementById('postAuthor').value;
        const date = new Date().toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Utwórz nowy wpis
        const newPost = document.createElement('article');
        newPost.className = 'blog-post';
        newPost.innerHTML = `
            <h3 class="post-title">${escapeHtml(title)}</h3>
            <div class="post-meta">
                <span class="post-author">${escapeHtml(author)}</span>
                <span class="post-date">${date}</span>
            </div>
            <div class="post-content">
                <p>${escapeHtml(content).replace(/\n/g, '</p><p>')}</p>
            </div>
        `;
        
        // Dodaj wpis na początek listy
        const blogPosts = document.getElementById('blogPosts');
        blogPosts.insertBefore(newPost, blogPosts.firstChild);
        
        // Zapisz wpis w localStorage
        savePostToLocalStorage({
            title: title,
            content: content,
            author: author,
            date: date
        });
        
        // Zresetuj formularz i ukryj go
        postForm.reset();
        postForm.classList.add('hidden');
        togglePostFormBtn.classList.remove('hidden');
        
        // Pokaż komunikat sukcesu
        showNotification('Wpis został dodany!');
    });
    
    // Obsługa formularza kontaktowego
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Pokaż komunikat
        showNotification('Wiadomość została wysłana! Skontaktuję się z Tobą wkrótce.');
        
        // Zresetuj formularz
        contactForm.reset();
    });
    
    // Wczytaj zapisane wpisy przy starcie
    loadSavedPosts();
});

// Funkcja do escapowania HTML (bezpieczeństwo)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Funkcja do zapisywania wpisu w localStorage
function savePostToLocalStorage(post) {
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.unshift(post);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Funkcja do wczytywania zapisanych wpisów
function loadSavedPosts() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const blogPosts = document.getElementById('blogPosts');
    
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-meta">
                <span class="post-author">${escapeHtml(post.author)}</span>
                <span class="post-date">${post.date}</span>
            </div>
            <div class="post-content">
                <p>${escapeHtml(post.content).replace(/\n/g, '</p><p>')}</p>
            </div>
        `;
        blogPosts.appendChild(postElement);
    });
}

// Funkcja do pokazywania powiadomień
function showNotification(message) {
    // Utwórz element powiadomienia
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #E26E35;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    // Dodaj animację CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Dodaj powiadomienie do strony
    document.body.appendChild(notification);
    
    // Usuń powiadomienie po 3 sekundach
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Dodaj płynne przewijanie
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});