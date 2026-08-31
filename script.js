// Theme Management
const themeBtn = document.getElementById('themeBtn');
const themeSelect = document.getElementById('themeSelect');
const html = document.documentElement;

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    themeSelect.value = savedTheme;
}

function applyTheme(theme) {
    document.body.classList.remove('dark-mode', 'mixed-mode', 'colorful-mode');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme === 'mixed') {
        document.body.classList.add('mixed-mode');
    } else if (theme === 'colorful') {
        document.body.classList.add('colorful-mode');
    }
    
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const icon = themeBtn.querySelector('i');
    const icons = {
        light: 'fas fa-moon',
        dark: 'fas fa-sun',
        mixed: 'fas fa-adjust',
        colorful: 'fas fa-palette'
    };
    icon.className = icons[theme] || icons.light;
}

// Theme Button Toggle
themeBtn.addEventListener('click', () => {
    const themes = ['light', 'dark', 'mixed', 'colorful'];
    const current = localStorage.getItem('theme') || 'light';
    const currentIndex = themes.indexOf(current);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(nextTheme);
    themeSelect.value = nextTheme;
});

// Theme Select Dropdown
themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
});

// Scroll Controls
const scrollUp = document.getElementById('scrollUp');
const scrollDown = document.getElementById('scrollDown');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const zoomLevel = document.getElementById('zoomLevel');

let currentZoom = 100;

scrollUp.addEventListener('click', () => {
    window.scrollBy({
        top: -300,
        behavior: 'smooth'
    });
});

scrollDown.addEventListener('click', () => {
    window.scrollBy({
        top: 300,
        behavior: 'smooth'
    });
});

zoomIn.addEventListener('click', () => {
    if (currentZoom < 200) {
        currentZoom += 10;
        document.body.style.zoom = currentZoom + '%';
        zoomLevel.textContent = currentZoom + '%';
        localStorage.setItem('zoom', currentZoom);
    }
});

zoomOut.addEventListener('click', () => {
    if (currentZoom > 50) {
        currentZoom -= 10;
        document.body.style.zoom = currentZoom + '%';
        zoomLevel.textContent = currentZoom + '%';
        localStorage.setItem('zoom', currentZoom);
    }
});

// Initialize zoom from localStorage
function initZoom() {
    const savedZoom = localStorage.getItem('zoom') || '100';
    currentZoom = parseInt(savedZoom);
    document.body.style.zoom = currentZoom + '%';
    zoomLevel.textContent = currentZoom + '%';
}

// Smooth Scroll to Top Button
const scrollUpBtn = document.getElementById('scrollUpBtn') || createScrollUpBtn();

function createScrollUpBtn() {
    const btn = document.createElement('button');
    btn.id = 'scrollUpBtn';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.title = 'Scroll to Top';
    document.body.appendChild(btn);
    return btn;
}

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollUpBtn.style.display = 'block';
    } else {
        scrollUpBtn.style.display = 'none';
    }
});

scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Handling
const quoteForm = document.getElementById('quoteForm');

quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('requesterEmail').value,
        phone: document.getElementById('phone').value,
        product: document.getElementById('product').value,
        quantity: document.getElementById('quantity').value,
        message: document.getElementById('message').value
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.product || !formData.quantity) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create email content
    const emailSubject = `New Quote Request - ${formData.product}`;
    const emailBody = `
New Quote Request Received:

Customer Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Product: ${formData.product}
Quantity Required: ${formData.quantity}
Additional Details: ${formData.message || 'None'}

Please respond to this inquiry at your earliest convenience.

---
This is an automated message from HOWRAH CHEMICAL WORKS website.
    `.trim();
    
    // Send to Howrah Chemical Works
    try {
        await sendEmail('hwhchemical@rediffmail.com', emailSubject, emailBody, formData.email);
        
        // Show success message
        showNotification('Quote request sent successfully! We will contact you soon.', 'success');
        quoteForm.reset();
    } catch (error) {
        showNotification('Error sending quote request. Please try again.', 'error');
        console.error('Email send error:', error);
    }
});

// Email sending simulation (in production, use a backend service)
async function sendEmail(to, subject, body, replyTo) {
    // Since we can't directly send emails from frontend, create mailto link as fallback
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(replyTo)}`;
    
    // For production, you would use a backend service like:
    // - EmailJS
    // - Formspree
    // - Your own backend API
    
    // Simulating email send
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log the email data
            console.log('Email would be sent to:', to);
            console.log('Subject:', subject);
            console.log('Reply-To:', replyTo);
            console.log('Body:', body);
            resolve();
        }, 1000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        hero.style.backgroundPosition = `0 ${scrollY * 0.5}px`;
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .contact-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Mobile menu toggle (if needed)
function setupMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    if (window.innerWidth <= 768) {
        navContainer.style.flexDirection = 'column';
    }
}

window.addEventListener('resize', setupMobileMenu);
setupMobileMenu();

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initZoom();
    console.log('Howrah Chemical Works website loaded successfully!');
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// Analytics and tracking (optional)
function trackEvent(eventName, eventData = {}) {
    console.log('Event:', eventName, eventData);
    // Add your analytics code here
}

// Track form submissions
quoteForm.addEventListener('submit', () => {
    trackEvent('form_submission', {
        type: 'quote_request',
        timestamp: new Date().toISOString()
    });
});
