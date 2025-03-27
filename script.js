// DOM Elements
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeBtns = document.querySelectorAll('.close');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const contactForm = document.getElementById('contactForm');
const pricingButtons = document.querySelectorAll('.pricing-button');

// Mobile Navigation
burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Modal Event Listeners
loginBtn.addEventListener('click', () => openModal(loginModal));
showSignup.addEventListener('click', () => {
    closeModal(loginModal);
    openModal(signupModal);
});
showLogin.addEventListener('click', () => {
    closeModal(signupModal);
    openModal(loginModal);
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(loginModal);
        closeModal(signupModal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
    if (e.target === signupModal) closeModal(signupModal);
});

// Form Validation
function showError(input, message) {
    const formControl = input.parentElement;
    const error = formControl.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    if (!formControl.querySelector('.error-message')) {
        formControl.appendChild(error);
    }
    input.classList.add('error');
}

function showSuccess(input) {
    const formControl = input.parentElement;
    const error = formControl.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.classList.remove('error');
}

// Login Form Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]');
    const password = loginForm.querySelector('input[type="password"]');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } else {
            showError(email, data.message);
            showError(password, data.message);
        }
    } catch (error) {
        showError(email, 'An error occurred. Please try again.');
        showError(password, 'An error occurred. Please try again.');
    }
});

// Signup Form Handler
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = signupForm.querySelector('input[type="text"]');
    const email = signupForm.querySelector('input[type="email"]');
    const password = signupForm.querySelector('input[type="password"]');
    const plan = signupForm.querySelector('select');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,
                plan: plan.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } else {
            showError(name, data.message);
            showError(email, data.message);
            showError(password, data.message);
            showError(plan, data.message);
        }
    } catch (error) {
        showError(name, 'An error occurred. Please try again.');
        showError(email, 'An error occurred. Please try again.');
        showError(password, 'An error occurred. Please try again.');
        showError(plan, 'An error occurred. Please try again.');
    }
});

// Contact Form Handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('input[type="text"]');
    const email = contactForm.querySelector('input[type="email"]');
    const plan = contactForm.querySelector('select');
    const message = contactForm.querySelector('textarea');

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                plan: plan.value,
                message: message.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess(name);
            showSuccess(email);
            showSuccess(plan);
            showSuccess(message);
            contactForm.reset();
            alert('Message sent successfully!');
        } else {
            showError(name, data.message);
            showError(email, data.message);
            showError(plan, data.message);
            showError(message, data.message);
        }
    } catch (error) {
        showError(name, 'An error occurred. Please try again.');
        showError(email, 'An error occurred. Please try again.');
        showError(plan, 'An error occurred. Please try again.');
        showError(message, 'An error occurred. Please try again.');
    }
});

// Pricing Button Handlers
pricingButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const plan = button.dataset.plan;
        if (plan) {
            const planSelect = signupForm.querySelector('select');
            planSelect.value = plan;
            closeModal(loginModal);
            openModal(signupModal);
        }
    });
});

// Smooth Scrolling
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

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .pricing-card, .enterprise-feature').forEach(el => {
    observer.observe(el);
});

// Intersection Observer for Scroll Animations
const observerOptionsScroll = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observerScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Unobserve after animation
            observerScroll.unobserve(entry.target);
        }
    });
}, observerOptionsScroll);

// Observe all sections and feature cards
document.querySelectorAll('section, .feature-card, .enterprise-feature').forEach(element => {
    observerScroll.observe(element);
});

// Navbar Background Change on Scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add loading animation to images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
});