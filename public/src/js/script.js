// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeHeaderScroll(); 
    initializeScrollProgress();
    initializeParticles();
    initializeAnimations();
    initializeTestimonials();
    initializeBackToTop();
    initializeSmoothScrolling();
});

// ===== LOADING SCREEN =====
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Verifica se o elemento existe antes de manipular
    if (!loadingScreen) {
        document.body.style.overflow = 'visible';
        return;
    }

    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'visible';
        }, 500);
    }, 2000);
}

// ===== HEADER SCROLL EFFECT =====
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const scrollThreshold = 50; // Distância em pixels para ativar o efeito

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Executa uma vez no carregamento para verificar a posição inicial
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Verifica se os elementos existem
    if (!hamburger || !navMenu) return;

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
    const particlesContainer = document.getElementById('particles-js');
    
    // Verifica se o container e a biblioteca existem
    if (!particlesContainer || typeof particlesJS === 'undefined') return;
    
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

// ===== AI CHAT INTERACTION =====
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        initializeAiChat();
    }
};

function initializeAiChat() {
    const N8N_WEBHOOK_URL = 'https://site-geonai.vercel.app/api/chat';

    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const chatWindow = document.getElementById('chat-window');
    const submitBtn = document.getElementById('chat-submit-btn');
    const micBtn = document.getElementById('mic-btn');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = true; // <-- MUDANÇA 1: HABILITA TRANSCRIÇÃO EM TEMPO REAL
        recognition.maxAlternatives = 1;

        micBtn.addEventListener('click', () => {
            const placeholder = document.getElementById('chat-placeholder');
            if (placeholder) {
                placeholder.remove();
                chatWindow.classList.add('first-message-sent');
            }

            try {
                recognition.start();
                micBtn.classList.add('listening');
                input.placeholder = 'Ouvindo... Fale agora.';
            } catch (err) {
                console.error("Erro ao iniciar gravação (provavelmente já estava ativa):", err);
            }
        });

        // MUDANÇA 2: 'onresult' agora atualiza o input em tempo real
        recognition.onresult = (event) => {
            let interim_transcript = '';
            let final_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript_piece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final_transcript += transcript_piece;
                } else {
                    interim_transcript += transcript_piece;
                }
            }
            // Mostra o texto em tempo real no input
            input.value = final_transcript + interim_transcript;
        };

        // MUDANÇA 3: 'onend' agora é responsável por enviar o formulário
        recognition.onend = () => {
            micBtn.classList.remove('listening');
            input.placeholder = 'Envie uma mensagem para Lia...';

            // Dispara o 'submit' QUANDO o usuário para de falar
            if (input.value.trim()) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        };

        recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de fala:', event.error);
            micBtn.classList.remove('listening');
            if(event.error === 'no-speech') {
                input.placeholder = 'Não ouvi nada. Tente novamente.';
            } else if (event.error === 'not-allowed') {
                input.placeholder = 'Microfone bloqueado. Habilite nas configurações.';
            } else {
                input.placeholder = 'Erro ao ouvir. Tente novamente.';
            }
        };

    } else {
        console.warn('Web Speech API não suportada neste navegador.');
        micBtn.style.display = 'none';
    }
    // --- FIM DA MODIFICAÇÃO (SPEECH-TO-TEXT) ---

    // 1. Tenta buscar um ID de sessão já existente no navegador
    let sessionId = localStorage.getItem('geon_chat_session_id');

    // 2. Se não existir, cria um novo e salva
    if (!sessionId) {
        try {
            // crypto.randomUUID() é o método moderno, seguro e universal
            sessionId = crypto.randomUUID(); 
            localStorage.setItem('geon_chat_session_id', sessionId);
        } catch (err) {
            console.error("Erro ao gerar sessionId:", err);
            // Fallback simples para navegadores muito antigos
            sessionId = 'fallback-' + Date.now() + '-' + Math.random().toString(36).substring(2);
            localStorage.setItem('geon_chat_session_id', sessionId);
        }
    }
    // Agora, a variável 'sessionId' tem um ID único para este usuário.

    // --- FIM DA MODIFICAÇÃO PARA SESSION ID ---

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Impede o recarregamento da página

        // 1. Encontra e remove o placeholder assim que o usuário interage
        const placeholder = document.getElementById('chat-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const userMessage = input.value.trim();

        if (userMessage === '') return;

        // 1. Adiciona a mensagem do usuário à tela
        addMessageToChat('user', userMessage);
        input.value = '';
        submitBtn.disabled = true;

        // 2. Adiciona um indicador de "digitando..."
        addMessageToChat('ai', '...');

        try {
            // 3. Envia a mensagem E O ID DA SESSÃO para o n8n
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: sessionId // <-- ID DA SESSÃO ENVIADO AQUI
                })
            });

            if (!response.ok) {
                // Se a resposta não for OK (ex: 404, 500), lança um erro
                throw new Error('A resposta do servidor não foi OK.');
            }

            const data = await response.json();
            const aiReply = data.reply || 'Desculpe, não consegui processar sua resposta. Tente novamente.';

            // 4. Remove o "digitando..." e adiciona a resposta da IA
            if (chatWindow.lastChild) {
                chatWindow.removeChild(chatWindow.lastChild); // Remove o "..."
            }
            addMessageToChat('ai', aiReply);

        } catch (error) {
            console.error('Erro ao contatar o webhook:', error);
            if (chatWindow.lastChild) {
                chatWindow.removeChild(chatWindow.lastChild); // Remove o "..."
            }
            // Mensagem de erro amigável para o usuário
            addMessageToChat('ai', 'Ocorreu um erro de conexão. Por favor, tente novamente mais tarde.');
        } finally {
            // Reabilita o botão de envio aconteça o que acontecer
            submitBtn.disabled = false;
        }
    });

    /**
     * Adiciona uma nova bolha de chat na janela
     * @param {'user' | 'ai'} sender - Quem enviou a mensagem
     * @param {string} text - O conteúdo da mensagem
     */
function addMessageToChat(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;

    let avatarHTML = '';
    if (sender === 'ai') {
        avatarHTML = '<img src="./src/img/LIA_GEON.png" alt="Lia">';
    } else {
        avatarHTML = '<i class="fas fa-user"></i>';
    }

    // --- MUDANÇA 7: LÓGICA DA ANIMAÇÃO DE "DIGITANDO" ---
    
    let contentHTML = '';
    
    // Se for a IA e o texto for '...', substitui pelo animado
    if (sender === 'ai' && text === '...') {
        contentHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        // Adiciona um ID para facilitar a remoção
        messageDiv.id = "typing-indicator-message"; 
    } else {
        // Caso contrário, usa o parágrafo normal
        contentHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatarHTML} 
        </div>
        ${contentHTML}
    `;
    // --- FIM DA MODIFICAÇÃO ---
    
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; 
}
}

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