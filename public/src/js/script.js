// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeScrollProgress();
    initializeParticles();
    initializeAnimations();
    initializeTestimonials();
    initializeContactForm();
    initializeBackToTop();
    initializeSmoothScrolling();

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// ===== LOADING SCREEN =====
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');

    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'visible';
        }, 500);
    }, 2000);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
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
}

// ===== SCROLL PROGRESS =====
function initializeScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
    });
}

// ===== PARTICLES BACKGROUND =====
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#007bff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#007bff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Spiral logo animation
    const spiralLogo = document.querySelector('.spiral-logo');
    if (spiralLogo) {
        spiralLogo.addEventListener('mouseenter', () => {
            spiralLogo.style.transform = 'scale(1.1) rotate(360deg)';
            spiralLogo.style.transition = 'transform 0.8s ease-in-out';
        });

        spiralLogo.addEventListener('mouseleave', () => {
            spiralLogo.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Project cards hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

}

// Parallax effect for hero section
function updateHeroFade() {
    const heroSection = document.querySelector('.hero');
    const aboutSection = document.getElementById('about');

    if (!heroSection || !aboutSection) {
        return;
    }

    const aboutTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // Define o ponto em que o fade deve começar. 
    // Ex: 0.8 significa que o fade começa quando a seção 'about' está a 80% da altura da tela de distância.
    const fadeStart = windowHeight * 0.8;

    // Define a rapidez do fade. Um valor menor torna o fade mais rápido.
    const fadeDuration = windowHeight * 0.6;

    if (aboutTop < fadeStart) {
        // Calcula a opacidade. O valor diminui de 1 para 0 à medida que a seção 'about' sobe.
        const opacity = Math.max(0, aboutTop / fadeDuration);
        heroSection.style.opacity = opacity;
    } else {
        // Garante que a opacidade seja 1 se a rolagem estiver antes do ponto de início do fade.
        heroSection.style.opacity = 1;
    }
}

// ===== TESTIMONIALS CAROUSEL =====
function initializeTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const carouselDots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (testimonialCards.length === 0) return;

    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });

        // Remove active class from all dots
        carouselDots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current testimonial
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }

        // Activate current dot
        if (carouselDots[index]) {
            carouselDots[index].classList.add('active');
        }
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }

    // Dot navigation
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    // Auto-play carousel
    setInterval(nextTestimonial, 5000);

    // Initialize first testimonial
    showTestimonial(0);
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();

        // Remove existing error styling
        field.classList.remove('error');

        // Validate required fields
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Este campo é obrigatório');
            return false;
        }

        // Validate email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Por favor, insira um e-mail válido');
                return false;
            }
        }

        // Validate phone
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Por favor, insira um telefone válido');
                return false;
            }
        }

        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff4757';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';

        field.parentNode.appendChild(errorDiv);
    }

    function clearErrors(e) {
        const field = e.target;
        field.classList.remove('error');

        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        // Check privacy checkbox
        const privacyCheckbox = document.getElementById('privacy');
        if (!privacyCheckbox.checked) {
            showFieldError(privacyCheckbox, 'Você deve aceitar os termos de privacidade');
            isValid = false;
        }

        if (isValid) {
            submitForm();
        }
    });

    // Lista dos seus domínios de produção
    const productionHostnames = ['geonai.tech', 'geonai.ai', 'geonai.com.br'];

    // Verifica se o hostname atual está na lista de produção
    const isProduction = productionHostnames.includes(window.location.hostname);

    const API_URL = isProduction
        ? 'https://site-geonai.vercel.app/api/send-email' // URL de Produção
        : 'http://localhost:3000/send-email';             // URL de Desenvolvimento Local


    async function submitForm() {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        const name = contactForm.querySelector('#name')?.value || '';
        const email = contactForm.querySelector('#email')?.value || '';
        const company = contactForm.querySelector('#company')?.value || '';
        const position = contactForm.querySelector('#position')?.value || '';
        const messageEl = contactForm.querySelector('#message') || contactForm.querySelector('textarea[name="message"]');
        const message = messageEl?.value || '';

        try {
            const resp = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, company, position, message })
            });
            const data = await resp.json();
            if (resp.ok) {
                showSuccessMessage();
                contactForm.reset();
            } else {
                // mostra erros de validação vindos do backend
                const errMsg = data.error || (data.errors ? data.errors.map(e => e.msg).join(', ') : 'Erro ao enviar');
                alert(errMsg);
            }
        } catch (err) {
            console.error(err);
            alert('Erro de rede. Tente novamente mais tarde.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    function showSuccessMessage() {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Mensagem Enviada com Sucesso!</h3>
                <p>Obrigado pelo seu interesse. Nossa equipe entrará em contato em breve.</p>
                <button class="btn btn-primary close-modal">Fechar</button>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: #0A1128;
            padding: 3rem;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            border: 1px solid #007bff;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        const successIcon = modal.querySelector('.success-icon');
        successIcon.style.cssText = `
            font-size: 3rem;
            color: #28a745;
            margin-bottom: 1rem;
        `;

        document.body.appendChild(modal);

        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== PRIVACY POLICY MODAL =====
    const privacyModal = document.getElementById('privacyModal');
    const closeModalBtn = privacyModal.querySelector('.close-modal');
    const privacyCheckbox = document.getElementById('privacy');

    // Ao clicar no texto do checkbox, abrir modal
    const privacyLabel = document.getElementById('privacy-link');
    if (privacyLabel) {
        privacyLabel.addEventListener('click', (e) => {
            e.preventDefault(); // Evita marcar/desmarcar
            privacyModal.style.display = 'block';
        });
    }

    // Fechar modal ao clicar no botão X
    closeModalBtn.addEventListener('click', () => {
        privacyModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora do conteúdo
    window.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
    });

}

// ===== FOOTER MODALS =====
const privacyFooterLink = document.querySelector('.footer-privacy');
const termsFooterLink = document.querySelector('.footer-terms');

const termsModal = document.getElementById('termsModal');
const privacyModalFooter = document.getElementById('privacyModal');

function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Eventos para abrir
if (privacyFooterLink) {
    privacyFooterLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(privacyModalFooter);
    });
}

if (termsFooterLink) {
    termsFooterLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(termsModal);
    });
}

// Eventos para fechar (botão X)
document.querySelectorAll('.privacy-modal .close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(btn.closest('.privacy-modal'));
    });
});

// Fechar ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('privacy-modal')) {
        closeModal(e.target);
    }
});

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .project-card, .team-member, .value-item');
    animateElements.forEach(el => observer.observe(el));
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations and effects
    updateScrollProgress();
    updateActiveNavigation();
    updateBackToTopVisibility();
    updateHeroFade(); // Adicione esta linha
}, 16); // ~60fps

function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function updateBackToTopVisibility() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

// Replace default scroll event listener
window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation support
document.addEventListener('keydown', function (e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.success-modal');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }

    // Enter key for button activation
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Focus management for mobile menu
function manageFocus() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            // Focus first menu item when menu opens
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    });
}

// Initialize focus management
manageFocus();

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Promise rejection handler
window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===== BROWSER COMPATIBILITY =====

// Check for required features
function checkBrowserSupport() {
    const requiredFeatures = [
        'querySelector',
        'addEventListener',
        'classList',
        'requestAnimationFrame'
    ];

    const unsupportedFeatures = requiredFeatures.filter(feature => {
        return !(feature in document || feature in window || feature in Element.prototype);
    });

    if (unsupportedFeatures.length > 0) {
        console.warn('Some features may not work in this browser:', unsupportedFeatures);
        // You could show a browser upgrade message here
    }
}

checkBrowserSupport();

// ===== INITIALIZATION =====

// Ensure everything is loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIntersectionObserver);
} else {
    initializeIntersectionObserver();
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeTestimonials,
        initializeContactForm,
        debounce,
        throttle
    };
}

// ===== MOUSE FOLLOWER EFFECT =====
document.addEventListener('DOMContentLoaded', function () {
    // Criar elemento seguidor do mouse
    const mouseFollower = document.createElement('div');
    mouseFollower.className = 'mouse-follower';
    document.body.appendChild(mouseFollower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    // Capturar posição do mouse
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animação fluida do seguidor
    function animateFollower() {
        // Efeito de "água" - movimento suave e atrasado
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        mouseFollower.style.left = followerX + 'px';
        mouseFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // Efeito de hover em elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card, .team-member');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            mouseFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            mouseFollower.style.opacity = '0.9';
        });

        element.addEventListener('mouseleave', function () {
            mouseFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            mouseFollower.style.opacity = '0.7';
        });
    });
});


// ===== MOUSE FOLLOWER EFFECT =====
document.addEventListener("DOMContentLoaded", function () {
    // Criar elemento seguidor do mouse
    const mouseFollower = document.createElement("div");
    mouseFollower.className = "mouse-follower";
    document.body.appendChild(mouseFollower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    // Capturar posição do mouse
    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animação fluida do seguidor
    function animateFollower() {
        // Efeito de "água" - movimento suave e atrasado
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        mouseFollower.style.left = followerX + "px";
        mouseFollower.style.top = followerY + "px";

        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // Efeito de hover em elementos interativos
    const interactiveElements = document.querySelectorAll("a, button, .service-card, .project-card, .team-member");

    interactiveElements.forEach(element => {
        element.addEventListener("mouseenter", function () {
            mouseFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
            mouseFollower.style.opacity = "0.9";
        });

        element.addEventListener("mouseleave", function () {
            mouseFollower.style.transform = "translate(-50%, -50%) scale(1)";
            mouseFollower.style.opacity = "0.7";
        });
    });
});


