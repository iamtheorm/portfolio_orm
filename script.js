// Initialize elements on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initFormHandler();
    initButtonGlow();
});

/* ===== Navigation Scrolling & Active States ===== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!navbar) return;

    // Smooth scroll behavior for same-page hash links (if any remain)
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

    // Update active nav link based on URL pathname
    function updateActiveNav() {
        const path = window.location.pathname;
        let page = path.split('/').pop();
        if (page === '' || page === '/') {
            page = 'index.html';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (page === href) {
                link.classList.add('active');
            }
        });
    }

    // Shrink / darken the floating pill navbar slightly on scroll
    function handleNavbarScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // trigger once on load
    updateActiveNav();   // set active menu item
}

/* ===== Button Click Glow Effect ===== */
function initButtonGlow() {
    const clickableElements = document.querySelectorAll(
        '.btn, .social-dock-item, .mobile-social-item, .nav-menu a, .contact-form button, .project-link'
    );
    
    clickableElements.forEach(element => {
        element.addEventListener('click', () => {
            // Remove first if already present
            element.classList.remove('glow-active');
            // Force redraw/reflow to reset keyframe animation
            void element.offsetWidth;
            // Add glow active class
            element.classList.add('glow-active');
            
            // Remove after animation finishes (600ms matching CSS duration)
            setTimeout(() => {
                element.classList.remove('glow-active');
            }, 600);
        });
    });
}

/* ===== Viewport Scroll Reveal Observer ===== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // trigger animation once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => {
        revealObserver.observe(el);
    });
}

/* ===== Contact Form Submission ===== */
function initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showToast('please fill in all fields.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('please enter a valid email address.', 'error');
            return;
        }
        
        // Display toast message in lowercase style to match reference aesthetics
        showToast(`thank you for your message, ${name.toLowerCase()}! i'll get back to you soon.`, 'success');
        
        contactForm.reset();
    });
}

/* ===== Toast Notification Helper ===== */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '80px'; // positioned above the mobile social bar
    toast.style.right = '24px';
    toast.style.padding = '0.75rem 1.5rem';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'monospace';
    toast.style.fontSize = '0.8rem';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.border = '1px solid rgba(246, 237, 220, 0.15)';
    
    if (type === 'success') {
        toast.style.background = 'rgba(7, 10, 24, 0.95)';
        toast.style.color = '#f4cd67';
        toast.style.borderColor = 'rgba(244, 205, 103, 0.3)';
    } else {
        toast.style.background = 'rgba(239, 68, 68, 0.95)';
        toast.style.color = 'white';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 50);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}
