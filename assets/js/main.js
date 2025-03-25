/**===================================================
* Website Name: Group26Consult 
* Created: January 17, 2025 
* Last Updated: March 28, 2025 
* Author: Goodness Adewuyi 
===================================================*/

/**=====================================
 * Initialize AOS (Animate On Scroll)
 =====================================*/
function initializeAOS() {
    AOS.init({
        duration: 1200,
        once: false,
        offset: 100,
        easing: 'ease-out-cubic'
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

    if (!navMenu || !navToggle) return;

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

    // Close menu when clicking on a menu item
    const navLinks = document.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            navToggle.classList.remove('active');
        });
    });
}

/**==================================
 * Touch support for card flipping
 ==================================*/
function enableCardFlipping() {
    const processCards = document.querySelectorAll('.step__card');

    processCards.forEach(card => {
        card.addEventListener('touchstart', function (e) {
            // Prevent default only for cards to enable touch flipping
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const cardInner = this.querySelector('.card__inner');
                cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
            }
        });
    });
}

/**===========================
 * Features Tabs Functionality
 ===========================*/
function initializeFeaturesTabs() {
    const tabControls = document.querySelectorAll('.tab__control');
    const tabPanels = document.querySelectorAll('.tab__panel');

    if (tabControls.length === 0 || tabPanels.length === 0) return;

    tabControls.forEach(control => {
        control.addEventListener('click', () => {
            // Removes active class from all controls
            tabControls.forEach(c => c.classList.remove('active'));

            // Adds active class to clicked control
            control.classList.add('active');

            // Gets target tab
            const targetTab = control.getAttribute('data-tab');

            // Hides all panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Shows target panel
            document.getElementById(targetTab).classList.add('active');

            // Refreshes AOS animations
            if (typeof AOS !== 'undefined') {
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            }
        });
    });

    // Adds hover effect for feature items
    const featureItems = document.querySelectorAll('.panel__features li');

    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.feature__icon');
            if (icon) {
                icon.style.transform = 'rotate(-10deg)';
            }
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.feature__icon');
            if (icon) {
                icon.style.transform = 'none';
            }
        });
    });

    // Add image parallax effect
    const panelImages = document.querySelectorAll('.panel__image');

    panelImages.forEach(imageContainer => {
        const image = imageContainer.querySelector('img');

        if (!image) return;

        imageContainer.addEventListener('mousemove', (e) => {
            const rect = imageContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            // Subtle parallax effect
            image.style.transform = `scale(1.05) translate(${(x - 0.5) * -10}px, ${(y - 0.5) * -10}px)`;
        });

        imageContainer.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });
    });
}

/**===========================
 * Services Tab Functionality
 ===========================*/
function initializeServicesTabs() {
    const serviceNavItems = document.querySelectorAll('.service__nav-item');
    const serviceDetails = document.querySelectorAll('.service__detail');

    if (serviceNavItems.length === 0 || serviceDetails.length === 0) return;

    serviceNavItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            // Removes active class from all nav items
            serviceNavItems.forEach(item => item.classList.remove('active'));

            // Adds active class to clicked nav item
            navItem.classList.add('active');

            // Gets target service
            const targetService = navItem.getAttribute('data-service');

            // Hides all service details
            serviceDetails.forEach(detail => {
                detail.classList.remove('active');
            });

            // Shows target service detail
            document.getElementById(`${targetService}-service`).classList.add('active');

            // Refreshes AOS animations
            if (typeof AOS !== 'undefined') {
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            }
        });
    });
}

/**=================================
 * Animate background particles
 =================================*/
function animateParticles() {
    const particles = document.querySelectorAll('.particle');

    if (particles.length === 0) return;

    particles.forEach(particle => {
        setInterval(() => {
            const randomX = Math.random() * 30 - 15;
            const randomY = Math.random() * 30 - 15;

            particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3);
    });
}

/**=========================
 * Reveal sections on load
 =========================*/
function revealSections() {
    // Array of section selectors to animate
    const sectionSelectors = [
        '.hero__text',
        '.hero__visual',
        '.challenges__content',
        '.solutions__content',
        '.features__content',
        '.services__grid',
        '.benefits__content',
        '.process__timeline'
    ];

    // Adds animation classes to elements
    sectionSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
    });

    // Reveals elements with staggered timing
    setTimeout(() => {
        sectionSelectors.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200 * index);
            }
        });
    }, 500);
}

/**=======================
 * Initialize All Scripts
 =======================*/
function initializeScripts() {
    initializeAOS();
    handleNavbarScroll();
    initializeNavMenuToggle();
    initializeFeaturesTabs();
    initializeServicesTabs();
    enableCardFlipping();
    animateParticles();
    revealSections();
}

// Calls the initialization function
document.addEventListener('DOMContentLoaded', initializeScripts);