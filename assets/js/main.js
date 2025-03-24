/**===================================================
* Website Name: Aftermath 
* Created: January 17, 2025 
* Last Updated: January 26, 2025 
* Author: Goodness Adewuyi
===================================================*/

/**=====================================
 * Initialize AOS (Animate On Scroll)
 =====================================*/
function initializeAOS() {
    AOS.init({
        duration: 1500,
        once: false,
        offset: 100
    });
}

/**=======================
 * Navbar scroll effect
 =======================*/
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**===========================
 * Navigation Menu Toggle
 ===========================*/
function initializeNavMenuToggle() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu');
            navToggle.classList.remove('active');
        }
    });
}

/**==================================
 * Touch support for card flipping
 ==================================*/
function enableCardFlipping() {
    const processSteps = document.querySelectorAll('.step');
    processSteps.forEach(step => {
        step.addEventListener('touchstart', function (e) {
            e.preventDefault();
            this.classList.toggle('flipped');
        });
    });
}

/**======================
 * Testimonials Slider
 ======================*/
function initializeTestimonialsSlider() {
    const track = document.querySelector('.testimonials__track');
    const cards = document.querySelectorAll('.testimonial__card');
    const prevBtn = document.querySelector('.nav__btn.prev');
    const nextBtn = document.querySelector('.nav__btn.next');
    let currentIndex = 0;

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 32;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % (cards.length - 2);
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + (cards.length - 2)) % (cards.length - 2);
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);
    updateSlider(); // Initial update
}

/**===========================
 * Form submission handling
 ===========================*/
function handleFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            console.log('Form submitted:', data);

            alert('Thank you for your message. We will get back to you soon!');

            // Reset form
            this.reset();
        });
    }
}

/**============================================
 * Intersection observer for stats animation
 ============================================*/
function initializeStatsObserver() {
    const stats = document.querySelectorAll('.stat__number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        stat.style.opacity = 0;
        stat.style.transform = 'translateY(20px)';
        observer.observe(stat);
    });
}

/**=======================
 * Initialize All Scripts
 =======================*/
function initializeScripts() {
    initializeAOS();
    handleNavbarScroll();
    initializeNavMenuToggle();
    enableCardFlipping();
    initializeTestimonialsSlider();
    handleFormSubmission();
    initializeStatsObserver();
}

// Call the initialization function
document.addEventListener('DOMContentLoaded', initializeScripts);
