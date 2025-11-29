// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic'
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typing effect for hero subtitle
function typeWriter(element, words, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
    if (!element) return;
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let currentSpeed = isDeleting ? deleteSpeed : typeSpeed;
        
        if (!isDeleting && charIndex === currentWord.length) {
            currentSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        setTimeout(type, currentSpeed);
    }
    
    type();
}

// Initialize typing effect
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    typeWriter(heroSubtitle, [
        'Analista de Inteligencia Comercial',
        'Especialista en Visualización de Datos',
        'Business Intelligence Analyst',
        'Data-Driven Decision Maker'
    ], 80, 40, 2000);
}

// Project tabs functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding content
        const tabId = button.getAttribute('data-tab');
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // Re-trigger AOS animations for newly visible content
            AOS.refresh();
        }
    });
});

// Carousel functionality
class ProjectCarousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) {
            console.log(`Carousel ${carouselId} not found`);
            return;
        }
        
        this.track = this.carousel.querySelector('.carousel-track');
        this.cards = Array.from(this.track.querySelectorAll('.project-card'));
        this.prevBtn = document.querySelector(`.carousel-prev[data-carousel="${carouselId}"]`);
        this.nextBtn = document.querySelector(`.carousel-next[data-carousel="${carouselId}"]`);
        
        if (this.cards.length === 0) {
            console.log(`No cards found in ${carouselId}`);
            return;
        }
        
        console.log(`Carousel ${carouselId} initialized with ${this.cards.length} cards`);
        
        this.currentIndex = 0;
        this.visibleCards = this.getVisibleCards();
        
        this.init();
    }
    
    getVisibleCards() {
        const width = window.innerWidth;
        if (width >= 1200) return Math.min(3, this.cards.length);
        if (width >= 768) return Math.min(2, this.cards.length);
        return 1;
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Prev clicked');
                this.prev();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next clicked');
                this.next();
            });
        }
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldVisible = this.visibleCards;
                this.visibleCards = this.getVisibleCards();
                if (oldVisible !== this.visibleCards) {
                    this.currentIndex = 0;
                    this.updateCarousel();
                }
            }, 100);
        });
        
        // Initial update
        setTimeout(() => this.updateCarousel(), 100);
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
            console.log(`Current index: ${this.currentIndex}`);
        }
    }
    
    next() {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
            console.log(`Current index: ${this.currentIndex}`);
        }
    }
    
    updateCarousel() {
        if (this.cards.length === 0) return;
        
        // Get actual card width and gap from computed styles
        const firstCard = this.cards[0];
        const cardWidth = firstCard.offsetWidth;
        const trackStyle = window.getComputedStyle(this.track);
        const gap = parseFloat(trackStyle.gap) || 24;
        
        // Calculate translation
        const translateX = -(this.currentIndex * (cardWidth + gap));
        this.track.style.transform = `translateX(${translateX}px)`;
        
        console.log(`Translate: ${translateX}px, Card width: ${cardWidth}px, Gap: ${gap}px`);
        
        this.updateButtons();
    }
    
    updateButtons() {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= maxIndex || this.cards.length <= this.visibleCards;
        }
    }
}

// Initialize carousels after everything is loaded
let biCarousel, devCarousel;

function initCarousels() {
    console.log('Initializing carousels...');
    biCarousel = new ProjectCarousel('bi-carousel');
    devCarousel = new ProjectCarousel('dev-carousel');
}

// Try multiple initialization points to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}

// Also initialize after AOS
setTimeout(initCarousels, 500);

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validation
    if (!name || !email || !subject || !message) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Success message
    showNotification(`¡Gracias ${name}! Tu mensaje ha sido enviado. Me pondré en contacto pronto.`, 'success');
    
    // Reset form
    contactForm.reset();
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '-400px',
        zIndex: '9999',
        maxWidth: '400px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        transition: 'right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        background: type === 'success' 
            ? 'linear-gradient(135deg, #10b981, #059669)' 
            : 'linear-gradient(135deg, #ef4444, #dc2626)'
    });
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.right = '20px';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Skill bars animation on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// Parallax effect for hero orbs
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const xMove = (x - 0.5) * speed;
        const yMove = (y - 0.5) * speed;
        
        orb.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });
});

// Intersection Observer for fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements
document.querySelectorAll('.project-card, .project-featured, .skill-item').forEach(el => {
    fadeObserver.observe(el);
});

// Prevent empty link clicks - but only for navigation links
document.querySelectorAll('a[href="#"]:not(.btn-link):not(.btn):not(.project-btn)').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// Add loading state to buttons
document.querySelectorAll('.btn, .btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#' || this.type === 'submit') {
            return;
        }
        
        if (!this.classList.contains('loading')) {
            const originalText = this.innerHTML;
            this.classList.add('loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = originalText;
            }, 1000);
        }
    });
});

// Smooth page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Close mobile menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                if (!isNaN(target)) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Add hover effect to project cards
document.querySelectorAll('.project-card, .project-featured').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Cursor effect (optional, for desktop only)
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #2563eb;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale cursor on interactive elements
    document.querySelectorAll('a, button, .btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#8b5cf6';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#2563eb';
        });
    });
}

// Console message
console.log('%c👋 ¡Hola! ', 'background: linear-gradient(135deg, #2563eb, #8b5cf6); color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;');
console.log('%c¿Interesado en trabajar juntos? Contáctame!', 'color: #2563eb; font-size: 14px;');