// Modern Web Development - Enhanced JavaScript
class ModernWebsite {
    constructor() {
        this.init();
        this.setupIntersectionObserver();
        this.setupParallax();
        this.setupSmoothScrolling();
        this.setupDynamicNavbar();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
            this.setupBlog();
            this.setupContact();
            this.setupAnimations();
            this.setupMicroInteractions();
        });
    }

    // Enhanced Navigation with modern interactions
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Add body scroll lock
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Enhanced smooth scrolling with easing
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    // Smooth scroll with custom easing
                    this.smoothScrollTo(offsetTop, 1000);

                    // Update active link with animation
                    this.updateActiveLink(link);
                }
            });
        });
    }

    // Custom smooth scroll with easing
    smoothScrollTo(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        let startTime = null;

        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    // Update active navigation link
    updateActiveLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.transform = 'translateY(0)';
        });
        activeLink.classList.add('active');
        activeLink.style.transform = 'translateY(-2px)';
    }

    // Enhanced Blog functionality
    setupBlog() {
        const addPostBtn = document.getElementById('add-post-btn');
        const addPostForm = document.getElementById('add-post-form');
        const blogForm = document.getElementById('blog-form');
        const cancelPostBtn = document.getElementById('cancel-post');

        if (addPostBtn && addPostForm) {
            addPostBtn.addEventListener('click', () => {
                addPostForm.classList.toggle('hidden');
                if (!addPostForm.classList.contains('hidden')) {
                    // Animate form appearance
                    addPostForm.style.opacity = '0';
                    addPostForm.style.transform = 'translateY(-20px)';
                    
                    requestAnimationFrame(() => {
                        addPostForm.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        addPostForm.style.opacity = '1';
                        addPostForm.style.transform = 'translateY(0)';
                        
                        // Focus with delay for better UX
                        setTimeout(() => {
                            document.getElementById('post-title').focus();
                        }, 200);
                    });
                }
            });
        }

        if (cancelPostBtn && addPostForm) {
            cancelPostBtn.addEventListener('click', () => {
                // Animate form disappearance
                addPostForm.style.transition = 'all 0.3s ease';
                addPostForm.style.opacity = '0';
                addPostForm.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    addPostForm.classList.add('hidden');
                    blogForm.reset();
                    addPostForm.style.transform = 'translateY(0)';
                }, 300);
            });
        }

        if (blogForm) {
            blogForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const title = document.getElementById('post-title').value.trim();
                const content = document.getElementById('post-content').value.trim();

                if (title && content) {
                    this.addBlogPost(title, content);
                    blogForm.reset();
                    
                    // Hide form with animation
                    addPostForm.style.transition = 'all 0.3s ease';
                    addPostForm.style.opacity = '0';
                    addPostForm.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        addPostForm.classList.add('hidden');
                        addPostForm.style.transform = 'translateY(0)';
                        
                        // Show success feedback
                        this.showNotification('Post dodany pomyślnie! 🎉', 'success');
                    }, 300);
                }
            });
        }

        // Load saved posts
        this.loadBlogPosts();
    }

    // Enhanced blog post creation
    addBlogPost(title, content) {
        const blogPosts = document.getElementById('blog-posts');
        const currentDate = new Date().toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const postElement = document.createElement('article');
        postElement.className = 'blog-post';
        postElement.style.opacity = '0';
        postElement.style.transform = 'translateY(30px)';
        
        postElement.innerHTML = `
            <h3>${this.escapeHtml(title)}</h3>
            <p class="post-date">${currentDate}</p>
            <p>${this.escapeHtml(content)}</p>
            <button class="delete-post" onclick="website.deletePost(this)">Usuń post</button>
        `;

        // Add with animation
        blogPosts.insertBefore(postElement, blogPosts.firstChild);
        
        requestAnimationFrame(() => {
            postElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            postElement.style.opacity = '1';
            postElement.style.transform = 'translateY(0)';
        });

        this.saveBlogPosts();
    }

    // Enhanced post deletion
    deletePost(button) {
        if (confirm('Czy na pewno chcesz usunąć ten post?')) {
            const post = button.closest('.blog-post');
            
            // Animate removal
            post.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            post.style.opacity = '0';
            post.style.transform = 'translateY(-30px) scale(0.95)';
            
            setTimeout(() => {
                post.remove();
                this.saveBlogPosts();
                this.showNotification('Post usunięty', 'info');
            }, 400);
        }
    }

    // Enhanced contact form
    setupContact() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            // Add floating label effect
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
                
                // Real-time validation
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
            });

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                let isValid = true;
                inputs.forEach(input => {
                    if (!this.validateField(input)) {
                        isValid = false;
                    }
                });

                if (isValid) {
                    // Animate button
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    
                    submitBtn.textContent = 'Wysyłanie...';
                    submitBtn.disabled = true;
                    
                    // Simulate sending
                    setTimeout(() => {
                        submitBtn.textContent = '✓ Wysłano!';
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            contactForm.reset();
                            this.showNotification('Wiadomość wysłana! Dziękuję za kontakt. 📧', 'success');
                        }, 2000);
                    }, 1000);
                } else {
                    this.showNotification('Proszę wypełnić wszystkie pola poprawnie', 'error');
                }
            });
        }
    }

    // Field validation
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        } else {
            isValid = value.length > 0;
        }

        if (isValid) {
            field.style.borderColor = 'rgba(226, 110, 53, 0.3)';
            field.style.boxShadow = '0 0 0 4px rgba(226, 110, 53, 0.1)';
        } else {
            field.style.borderColor = '#ff4757';
            field.style.boxShadow = '0 0 0 4px rgba(255, 71, 87, 0.1)';
        }

        return isValid;
    }

    // Advanced scroll-based animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Different animations based on element type
                    if (element.classList.contains('offer-card')) {
                        this.animateOfferCard(element);
                    } else if (element.classList.contains('credential')) {
                        this.animateCredential(element);
                    } else if (element.classList.contains('contact-item')) {
                        this.animateContactItem(element);
                    } else {
                        this.animateGeneric(element);
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.offer-card, .blog-post, .credential, .contact-item, .methodology'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // Specific animations for different elements
    animateOfferCard(element) {
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
    }

    animateCredential(element) {
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    }

    animateContactItem(element) {
        element.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0) scale(1)';
    }

    animateGeneric(element) {
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    // Parallax effect for hero section
    setupParallax() {
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.placeholder-image');
        
        if (hero && heroImage) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                heroImage.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0002})`;
            });
        }
    }

    // Dynamic navbar behavior
    setupDynamicNavbar() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            // Add background opacity based on scroll
            const opacity = Math.min(scrollTop / 100, 0.95);
            navbar.style.background = `rgba(255, 252, 245, ${opacity})`;
            
            lastScrollTop = scrollTop;
        });
    }

    // Micro-interactions
    setupMicroInteractions() {
        // Button ripple effect
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });

        // Card tilt effect
        const cards = document.querySelectorAll('.offer-card, .blog-post');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.tiltCard(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Input focus effects
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = 'translateY(0)';
            });
        });
    }

    // Ripple effect for buttons
    createRipple(event, button) {
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);

        // Add ripple styles
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 600ms linear;
                background-color: rgba(255, 255, 255, 0.7);
                pointer-events: none;
            }
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        if (!document.querySelector('#ripple-styles')) {
            style.id = 'ripple-styles';
            document.head.appendChild(style);
        }
    }

    // Card tilt effect
    tiltCard(event, card) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    // Modern notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Notification styles
        const styles = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
        `;
        
        const bgColors = {
            success: 'linear-gradient(135deg, #00b894, #00a085)',
            error: 'linear-gradient(135deg, #ff4757, #ff3838)',
            info: 'linear-gradient(135deg, #0984e3, #6c5ce7)'
        };
        
        notification.style.cssText = styles;
        notification.style.background = bgColors[type] || bgColors.info;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
    }

    // Utility functions
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    saveBlogPosts() {
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

    loadBlogPosts() {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            const posts = JSON.parse(savedPosts);
            const blogPosts = document.getElementById('blog-posts');
            
            if (blogPosts) {
                // Clear existing posts except welcome post
                const welcomePost = blogPosts.querySelector('.blog-post');
                const welcomePostData = welcomePost ? {
                    title: welcomePost.querySelector('h3').textContent,
                    date: welcomePost.querySelector('.post-date').textContent,
                    content: welcomePost.querySelector('p:not(.post-date)').textContent
                } : null;
                
                blogPosts.innerHTML = '';
                
                // Add saved posts
                posts.forEach(post => {
                    this.createPostElement(post, blogPosts);
                });
                
                // Add welcome post back if no saved posts
                if (posts.length === 0 && welcomePostData) {
                    this.createPostElement(welcomePostData, blogPosts);
                }
            }
        }
    }

    createPostElement(post, container) {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
            <h3>${this.escapeHtml(post.title)}</h3>
            <p class="post-date">${post.date}</p>
            <p>${this.escapeHtml(post.content)}</p>
            ${post.title !== 'Witaj w naszym blogu językowym!' ? 
                '<button class="delete-post" onclick="website.deletePost(this)">Usuń post</button>' : 
                ''
            }
        `;
        container.appendChild(postElement);
    }

    // Smooth scrolling for all anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    this.smoothScrollTo(offsetTop, 800);
                }
            });
        });
    }

    // Performance optimization
    setupAnimations() {
        // Use requestAnimationFrame for smooth animations
        const animateOnScroll = () => {
            // Update scroll-based animations here
            requestAnimationFrame(animateOnScroll);
        };
        
        // Only start if user hasn't requested reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestAnimationFrame(animateOnScroll);
        }
    }
}

// Initialize the modern website
const website = new ModernWebsite();

// Export for global access
window.website = website;