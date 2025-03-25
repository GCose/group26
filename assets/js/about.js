/**===================================================
* Website Name: Aftermath - About Page
* Created: March 25, 2025
* Last Updated: March 25, 2025
* Author: Goodness Adewuyo
===================================================*/

/**==============================
 * Animate stats count on scroll
 ==============================*/
function animateStats() {
    const statsElements = document.querySelectorAll('.stats__value');

    if (!statsElements.length) return;

    // Set up Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const value = parseFloat(el.textContent);

                // Skip if already animated
                if (el.classList.contains('animated')) return;

                // Mark as animated
                el.classList.add('animated');

                // Handle percentage or number
                const isPercentage = el.textContent.includes('%');
                const suffix = isPercentage ? '%' : 'x';
                const duration = 2000; // Animation duration in ms
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);

                // Perform counting animation
                let frame = 0;
                el.textContent = '0' + (isPercentage ? '%' : 'x');

                const counter = setInterval(() => {
                    frame++;
                    const progress = frame / totalFrames;
                    const currentValue = Math.round(value * progress * 10) / 10;

                    if (frame === totalFrames) {
                        clearInterval(counter);
                        el.textContent = value + suffix;
                    } else {
                        el.textContent = currentValue + suffix;
                    }
                }, frameDuration);

                // Stop observing this element
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.5
    });

    // Start observing each stats element
    statsElements.forEach(el => {
        observer.observe(el);
    });
}

/**==========================================
 * Enhanced parallax effect for vision & mission cards
 ==========================================*/
function initParallaxCards() {
    const cards = document.querySelectorAll('.vision-mission__card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Apply subtle 3D rotation effect
            card.style.transform = `
                perspective(1000px) 
                rotateX(${y * -5}deg) 
                rotateY(${x * 5}deg) 
                translateZ(10px)
            `;

            // Animate card icon
            const icon = card.querySelector('.card__icon');
            if (icon) {
                icon.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
            }
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';

            const icon = card.querySelector('.card__icon');
            if (icon) {
                icon.style.transform = 'translate(0, 0)';
            }
        });
    });
}

/**=======================
 * Initialize About Page Scripts
 =======================*/
function initializeAboutPage() {
    animateStats();
    initParallaxCards();

    // Reveal animations for specific about page sections
    AOS.refresh();
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeAboutPage);