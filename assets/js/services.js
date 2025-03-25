/**===================================================
* Website Name: Group26Consult - Services Page
* Created: March 25, 2025
* Last Updated: March 25, 2025
* Author: Goodness Adewuyi
===================================================*/

/**=================================
 * Animate stats values counting up
 =================================*/
function animateStats() {
    const statsElements = document.querySelectorAll('.stats__value');

    if (!statsElements.length) return;

    // Set up Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const valueText = el.textContent;
                const isPercentage = valueText.includes('%');
                let value;

                // Parse the value properly
                if (isPercentage) {
                    value = parseFloat(valueText.replace('%', ''));
                } else {
                    value = parseFloat(valueText);
                }

                // Skip if already animated or not a valid number
                if (el.classList.contains('animated') || isNaN(value)) return;

                // Mark as animated
                el.classList.add('animated');

                // Determine suffix based on format
                const suffix = isPercentage ? '%' : '';

                // Animation settings
                const duration = 2000; // Animation duration in ms
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);

                // Start at 0
                let frame = 0;
                el.textContent = '0' + suffix;

                // Perform counting animation
                const counter = setInterval(() => {
                    frame++;
                    const progress = frame / totalFrames;
                    // Use easeOutQuad for smoother animation
                    const easing = -progress * (progress - 2);
                    const currentValue = (value * easing).toFixed(value % 1 === 0 ? 0 : 1);

                    if (frame === totalFrames) {
                        clearInterval(counter);
                        el.textContent = valueText; // Reset to original text to ensure accuracy
                    } else {
                        el.textContent = currentValue + suffix;
                    }
                }, frameDuration);

                // Stop observing this element
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Start observing each stats element
    statsElements.forEach(el => {
        observer.observe(el);
    });
}

/**=======================================
 * Animate tech particles in hero section
 =======================================*/
function animateTechParticles() {
    const particles = document.querySelectorAll('.tech-particle');
    if (!particles.length) return;

    // Add additional animation effects
    particles.forEach(particle => {
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(1.2) rotate(10deg)';
        });

        particle.addEventListener('mouseleave', () => {
            particle.style.transform = '';
        });
    });
}

/**====================================
 * Image hover zoom effect
 ====================================*/
function initImageZoomEffects() {
    const containers = document.querySelectorAll('.visual__container');

    containers.forEach(container => {
        const img = container.querySelector('img');
        if (!img) return;

        container.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
        });

        container.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

/**=======================================
 * Animate service cards with staggered delay
 =======================================*/
function animateServiceCards() {
    const cards = document.querySelectorAll('.service__card');
    if (!cards.length) return;

    // Create a staggered animation effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

/**======================================
 * Parallax scroll effect for hero image
 ======================================*/
function initParallaxScroll() {
    const heroImage = document.querySelector('.services-hero__visual');
    if (!heroImage) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.services-hero').offsetHeight;
        const scrollPercent = Math.min(scrollY / heroHeight, 1);

        // Create subtle parallax effect on scroll
        const image = heroImage.querySelector('img');
        if (image) {
            image.style.transform = `translateY(${scrollPercent * 50}px)`;
        }

        // Move tech particles on scroll
        const particles = document.querySelectorAll('.tech-particle');
        particles.forEach((particle, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            particle.style.transform = `translateY(${scrollPercent * 30 * direction}px)`;
        });
    });
}

/**==================================
 * Initialize Services Page Scripts
 ==================================*/
function initializeServicesPage() {
    animateStats();
    animateTechParticles();
    initImageZoomEffects();
    animateServiceCards();
    initParallaxScroll();

    // Initialize AOS manually if needed
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: false
        });
    }
    console.log('Services page scripts initialized');
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeServicesPage);