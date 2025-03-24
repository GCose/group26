/**===================================================
* Website Name: Aftermath Blog
* Created: February 28, 2025 
* Last Updated: March 28, 2025 
* Author: Goodness Adewuyi
===================================================*/

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the blog functionality
    initializeBlog();

    // Check if we have any stored blog posts from the blog builder
    loadStoredBlogPosts();
});

/**=======================
 * Initialize Blog Page
 =======================*/
function initializeBlog() {
    // Initialize filter buttons
    initializeFilterButtons();

    // Initialize search functionality
    initializeSearch();

    // Initialize newsletter form
    initializeNewsletterForm();

    // Load more button functionality
    initializeLoadMore();
}

/**==============================
 * Filter Buttons Functionality
 ==============================*/
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter__button');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get the selected category
            const selectedCategory = this.getAttribute('data-category');

            // Filter the blog posts based on the selected category
            filterBlogPosts(selectedCategory);
        });
    });
}

/**=========================
 * Search Functionality
 =========================*/
function initializeSearch() {
    const searchForm = document.querySelector('.blog__search-form');
    const searchInput = document.getElementById('blogSearch');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const searchTerm = searchInput.value.trim().toLowerCase();

            if (searchTerm) {
                searchBlogPosts(searchTerm);
            } else {
                // If search is empty, reset to show all posts
                resetBlogPosts();
            }
        });

        // Live search as user types (optional)
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.trim().toLowerCase();

            if (searchTerm.length >= 3) {
                searchBlogPosts(searchTerm);
            } else if (searchTerm.length === 0) {
                resetBlogPosts();
            }
        });
    }
}

/**============================
 * Newsletter Form Handling
 ============================*/
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter__form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (isValidEmail(email)) {
                // Simulate successful subscription
                this.innerHTML = `
                    <div class="form__success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank You!</h3>
                        <p>You've been successfully subscribed to our newsletter.</p>
                    </div>
                `;

                // In a real scenario, you would send this to your backend
                console.log('Newsletter subscription:', email);
            } else {
                // Show error for invalid email
                showFormError(emailInput, 'Please enter a valid email address');
            }
        });
    }
}

/**============================
 * Load More Functionality
 ============================*/
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            loadMorePosts();
        });
    }
}

/**======================
 * Blog Data Management
 ======================*/

// Sample blog posts data for now (this would come from an API or database)
let blogPosts = [
    {
        id: 1,
        title: 'How to Prepare Your Service Business for Natural Disaster Season',
        excerpt: 'Essential steps to ensure your business can respond effectively to increased service demands during natural disaster season.',
        category: 'operations',
        author: 'Michael Rodriguez',
        authorImage: './assets/img/clients.jpg',
        image: './assets/img/hero/hero.jpg',
        date: 'March 18, 2025',
        readTime: '7 min read',
        featured: false
    },
    {
        id: 2,
        title: 'Implementing an Effective CRM System for Your Home Services Business',
        excerpt: 'A comprehensive guide to selecting and implementing the right CRM solution to manage customer relationships and drive growth.',
        category: 'technology',
        author: 'Emma Thompson',
        authorImage: './assets/img/clients.jpg',
        image: './assets/img/hero/hero2.jpg',
        date: 'March 16, 2025',
        readTime: '9 min read',
        featured: false
    },
    {
        id: 3,
        title: 'Local SEO Strategies for Home Service Providers in 2025',
        excerpt: 'Discover the latest local SEO techniques to help your business rank higher in local search results and attract more customers.',
        category: 'marketing',
        author: 'David Chen',
        authorImage: './assets/img/clients.jpg',
        image: './assets/img/hero/hero3.jpeg',
        date: 'March 12, 2025',
        readTime: '11 min read',
        featured: false
    },
    {
        id: 4,
        title: 'Building a Resilient Team for Your Growing Restoration Business',
        excerpt: 'Learn effective strategies for hiring, training, and retaining top talent in the competitive home services industry.',
        category: 'business-growth',
        author: 'Sophia Martinez',
        authorImage: './assets/img/clients.jpg',
        image: './assets/img/hero/hero4.jpg',
        date: 'March 10, 2025',
        readTime: '8 min read',
        featured: false
    },
    {
        id: 5,
        title: 'Pricing Strategies That Maximize Profit Without Losing Customers',
        excerpt: 'Explore effective pricing models and strategies that can help increase your margins while maintaining customer satisfaction.',
        category: 'business-growth',
        author: 'James Wilson',
        authorImage: './assets/img/clients.jpg',
        image: './assets/img/hero/hero.jpg',
        date: 'March 8, 2025',
        readTime: '10 min read',
        featured: false
    },
    {
        id: 6,
        title: 'The Benefits of Equipment Automation in Debris Removal Operations',
        excerpt: 'How investing in automated equipment can streamline your operations, reduce labor costs, and improve service quality.',
        category: 'technology',
        author: 'Sarah Chen',
        authorImage: './assets/img/clients.jpg',
        image: './assets/img/hero/hero.jpg',
        date: 'March 5, 2025',
        readTime: '6 min read',
        featured: false
    }
];

// Track which posts are currently displayed
let currentPage = 1;
const postsPerPage = 6;
let currentCategory = 'all';
let currentSearchTerm = '';

/**========================
 * Render Blog Posts Grid
 ========================*/
function renderBlogPosts(posts, append = false) {
    const blogPostsGrid = document.getElementById('blogPostsGrid');

    if (!blogPostsGrid) return;

    // Clear existing posts if not appending
    if (!append) {
        blogPostsGrid.innerHTML = '';
    }

    // If no posts to display
    if (posts.length === 0) {
        blogPostsGrid.innerHTML = `
            <div class="no-posts-message">
                <i class="fas fa-search"></i>
                <h3>No Posts Found</h3>
                <p>We couldn't find any posts matching your criteria. Please try a different search term or category.</p>
            </div>
        `;
        return;
    }

    // Create blog post elements
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'blog__post';
        postElement.setAttribute('data-category', post.category);
        postElement.setAttribute('data-id', post.id);

        postElement.innerHTML = `
            <div class="blog__post-image">
                <img src="${post.image}" alt="${post.title}" />
                <div class="post__category">${getCategoryName(post.category)}</div>
            </div>
            <div class="blog__post__content">
                <div class="post__meta">
                    <span class="post__date"><i class="far fa-calendar"></i> ${post.date}</span>
                    <span class="post__read-time"><i class="far fa-clock"></i> ${post.readTime}</span>
                </div>
                <h3 class="post__title">${post.title}</h3>
                <p class="post__excerpt">${post.excerpt}</p>
                <div class="post__footer">
                    <a href="#" class="post__link">Read Article <i class="fas fa-arrow-right"></i></a>
                    <div class="post__author">
                        <img src="${post.authorImage}" alt="${post.author}" />
                        <span>${post.author}</span>
                    </div>
                </div>
            </div>
        `;

        blogPostsGrid.appendChild(postElement);
    });

    // Handle load more button visibility
    updateLoadMoreButton();
}

/**========================
 * Filter Blog Posts
 ========================*/
function filterBlogPosts(category) {
    currentCategory = category;
    currentPage = 1;

    let filteredPosts;

    if (category === 'all') {
        filteredPosts = blogPosts;
    } else {
        filteredPosts = blogPosts.filter(post => post.category === category);
    }

    // If there's an active search, apply that filter too
    if (currentSearchTerm) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(currentSearchTerm) ||
            post.excerpt.toLowerCase().includes(currentSearchTerm) ||
            post.author.toLowerCase().includes(currentSearchTerm)
        );
    }

    // Get posts for current page
    const postsToShow = filteredPosts.slice(0, postsPerPage);

    // Render the filtered posts
    renderBlogPosts(postsToShow);

    // Scroll to the blog posts section
    const blogPostsSection = document.getElementById('blog-posts');
    if (blogPostsSection) {
        blogPostsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**=====================
 * Search Blog Posts
 =====================*/
function searchBlogPosts(searchTerm) {
    currentSearchTerm = searchTerm;
    currentPage = 1;

    // Filter posts by search term
    let searchResults = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm)
    );

    // If there's an active category filter, apply that too
    if (currentCategory !== 'all') {
        searchResults = searchResults.filter(post => post.category === currentCategory);
    }

    // Get posts for current page
    const postsToShow = searchResults.slice(0, postsPerPage);

    // Render the search results
    renderBlogPosts(postsToShow);

    // Scroll to the blog posts section
    const blogPostsSection = document.getElementById('blog-posts');
    if (blogPostsSection) {
        blogPostsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**===================
 * Reset Blog Posts
 ===================*/
function resetBlogPosts() {
    currentSearchTerm = '';
    currentPage = 1;

    let postsToShow;

    if (currentCategory === 'all') {
        postsToShow = blogPosts.slice(0, postsPerPage);
    } else {
        const filteredPosts = blogPosts.filter(post => post.category === currentCategory);
        postsToShow = filteredPosts.slice(0, postsPerPage);
    }

    renderBlogPosts(postsToShow);
}

/**===================
 * Load More Posts
 ===================*/
function loadMorePosts() {
    currentPage++;

    let filteredPosts;

    // Filter by category if needed
    if (currentCategory === 'all') {
        filteredPosts = blogPosts;
    } else {
        filteredPosts = blogPosts.filter(post => post.category === currentCategory);
    }

    // Filter by search term if needed
    if (currentSearchTerm) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(currentSearchTerm) ||
            post.excerpt.toLowerCase().includes(currentSearchTerm) ||
            post.author.toLowerCase().includes(currentSearchTerm)
        );
    }

    // Calculate start and end indexes
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = currentPage * postsPerPage;

    // Get posts for current page
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    // Render the additional posts
    renderBlogPosts(postsToShow, true);
}

/**=====================
 * Helper Functions
 =====================*/

// Get readable category name
function getCategoryName(categorySlug) {
    const categoryMap = {
        'business-growth': 'Business Growth',
        'technology': 'Technology',
        'marketing': 'Marketing',
        'operations': 'Operations'
    };

    return categoryMap[categorySlug] || categorySlug;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form error
function showFormError(inputElement, message) {
    // Remove any existing error messages
    const existingError = inputElement.parentElement.querySelector('.form__error');
    if (existingError) {
        existingError.remove();
    }

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    errorElement.textContent = message;

    // Add error class to input
    inputElement.classList.add('input--error');

    // Insert error message after input
    inputElement.parentElement.insertBefore(errorElement, inputElement.nextSibling);

    // Remove error after a while
    setTimeout(() => {
        errorElement.remove();
        inputElement.classList.remove('input--error');
    }, 3000);
}

// Update load more button visibility
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    let filteredPosts;

    // Filter by category if needed
    if (currentCategory === 'all') {
        filteredPosts = blogPosts;
    } else {
        filteredPosts = blogPosts.filter(post => post.category === currentCategory);
    }

    // Filter by search term if needed
    if (currentSearchTerm) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(currentSearchTerm) ||
            post.excerpt.toLowerCase().includes(currentSearchTerm) ||
            post.author.toLowerCase().includes(currentSearchTerm)
        );
    }

    // Hide button if all posts are already displayed
    if (currentPage * postsPerPage >= filteredPosts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

/**=====================================
 * Integration with the Blog Builder
 =====================================*/
// Load blog posts from localStorage (added by blog builder)
function loadStoredBlogPosts() {
    const storedPosts = localStorage.getItem('aftermathBlogPosts');

    if (storedPosts) {
        try {
            const parsedPosts = JSON.parse(storedPosts);

            // Add the stored posts to our blog posts array
            if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
                // Add new posts to the beginning of the array
                blogPosts = [...parsedPosts, ...blogPosts];

                // Re-render blog posts
                resetBlogPosts();
            }
        } catch (error) {
            console.error('Error parsing stored blog posts:', error);
        }
    }
}

// Initialize blog posts on page load
document.addEventListener('DOMContentLoaded', function () {
    // Initial render of blog posts
    renderBlogPosts(blogPosts.slice(0, postsPerPage));
});