// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Blog functionality
    const addPostBtn = document.getElementById('add-post-btn');
    const addPostForm = document.getElementById('add-post-form');
    const blogForm = document.getElementById('blog-form');
    const cancelPostBtn = document.getElementById('cancel-post');
    const blogPosts = document.getElementById('blog-posts');
    
    // Show/hide add post form
    if (addPostBtn && addPostForm) {
        addPostBtn.addEventListener('click', function() {
            addPostForm.classList.toggle('hidden');
            if (!addPostForm.classList.contains('hidden')) {
                document.getElementById('post-title').focus();
            }
        });
    }
    
    if (cancelPostBtn && addPostForm) {
        cancelPostBtn.addEventListener('click', function() {
            addPostForm.classList.add('hidden');
            blogForm.reset();
        });
    }
    
    // Handle blog post submission
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('post-title').value.trim();
            const content = document.getElementById('post-content').value.trim();
            
            if (title && content) {
                addBlogPost(title, content);
                blogForm.reset();
                addPostForm.classList.add('hidden');
            }
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation and feedback
            const formData = new FormData(contactForm);
            const inputs = contactForm.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                alert('Dziękuję za wiadomość! Odpowiem tak szybko, jak to możliwe.');
                contactForm.reset();
            } else {
                alert('Proszę wypełnić wszystkie pola formularza.');
            }
        });
    }
    
    // Scroll-based navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

// Function to add new blog post
function addBlogPost(title, content) {
    const blogPosts = document.getElementById('blog-posts');
    const currentDate = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const postHTML = `
        <article class="blog-post">
            <h3>${escapeHtml(title)}</h3>
            <p class="post-date">${currentDate}</p>
            <p>${escapeHtml(content)}</p>
            <button class="delete-post" onclick="deletePost(this)">Usuń post</button>
        </article>
    `;
    
    // Add new post at the beginning
    blogPosts.insertAdjacentHTML('afterbegin', postHTML);
    
    // Save to localStorage
    saveBlogPosts();
}

// Function to delete blog post
function deletePost(button) {
    if (confirm('Czy na pewno chcesz usunąć ten post?')) {
        const post = button.closest('.blog-post');
        post.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
            post.remove();
            saveBlogPosts();
        }, 300);
    }
}

// Function to save blog posts to localStorage
function saveBlogPosts() {
    const posts = [];
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        const title = post.querySelector('h3').textContent;
        const date = post.querySelector('.post-date').textContent;
        const content = post.querySelector('p:not(.post-date)').textContent;
        
        posts.push({ title, date, content });
    });
    
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Function to load blog posts from localStorage
function loadBlogPosts() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const blogPosts = document.getElementById('blog-posts');
        
        // Clear existing posts except the welcome post
        const welcomePost = blogPosts.querySelector('.blog-post');
        blogPosts.innerHTML = '';
        
        // Add saved posts
        posts.forEach(post => {
            const postHTML = `
                <article class="blog-post">
                    <h3>${escapeHtml(post.title)}</h3>
                    <p class="post-date">${post.date}</p>
                    <p>${escapeHtml(post.content)}</p>
                    <button class="delete-post" onclick="deletePost(this)">Usuń post</button>
                </article>
            `;
            blogPosts.insertAdjacentHTML('beforeend', postHTML);
        });
        
        // Add welcome post back if no saved posts
        if (posts.length === 0 && welcomePost) {
            blogPosts.appendChild(welcomePost);
        }
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Load saved blog posts when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadBlogPosts, 100);
});

// Smooth reveal animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.offer-card, .blog-post, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS for delete button
const style = document.createElement('style');
style.textContent = `
    .delete-post {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-top: 1rem;
        transition: background-color 0.3s ease;
    }
    
    .delete-post:hover {
        background-color: #c0392b;
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);