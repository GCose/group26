/**=========================================
* Website Name: Aftermath Blog Builder
* Created: March 19, 2025
* Last Updated: March 19, 2025
* Author: Goodness Adewuyi
=========================================*/

/**==============================
 * Blog Builder Functionality
 ==============================*/

// Global variables
let quillEditor;
let currentPost = {
    id: generateUniqueId(),
    title: '',
    content: '',
    excerpt: '',
    author: '',
    authorImage: './assets/img/blog/author-default.jpg',
    image: './assets/img/blog/featured-placeholder.jpg',
    category: 'business-growth',
    date: formatDate(new Date()),
    readTime: '5 min read',
    featured: false
};

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeBlogBuilder();
    checkForExistingPost();
});

/**============================
 * Initialize Blog Builder
 ============================*/
function initializeBlogBuilder() {
    initializeEditor();
    initializeTabs();
    initializeImageUpload();
    initializePreviewSync();
    initializeActions();
    initializeModal();
    initializeNotifications();
}

/**==========================
 * Initialize Editor
 ==========================*/
function initializeEditor() {
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
    ];

    // Initialize Quill editor
    quillEditor = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Start writing your blog post...',
        theme: 'snow'
    });

    // Handle editor content changes
    quillEditor.on('text-change', function () {
        // Update currentPost content
        currentPost.content = quillEditor.root.innerHTML;

        // Update preview
        updatePreview();
    });

    // Handle title input changes
    const titleInput = document.getElementById('postTitle');
    if (titleInput) {
        titleInput.addEventListener('input', function () {
            currentPost.title = this.value;

            // Update preview
            updatePreview();
        });
    }
}

/**=================
 * Initialize Tabs
 =================*/
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.builder__tab');
    const tabPanels = document.querySelectorAll('.builder__panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding panel
            const targetPanel = document.getElementById(`${this.getAttribute('data-tab')}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');

                // If switching to preview tab, ensure preview is updated
                if (this.getAttribute('data-tab') === 'preview') {
                    updatePreview();
                }
            }
        });
    });
}

/**============================
 * Initialize Image Upload
 ============================*/
function initializeImageUpload() {
    const imageUploadInput = document.getElementById('featuredImageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImage');

    if (imageUploadInput && imagePreview && removeImageBtn) {
        // Handle image upload
        imageUploadInput.addEventListener('change', function (e) {
            const file = e.target.files[0];

            if (file) {
                // Check if file is an image
                if (!file.type.match('image.*')) {
                    showNotification('Error', 'Please select an image file.', 'error');
                    return;
                }

                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Error', 'Image size should be less than 5MB.', 'error');
                    return;
                }

                // Convert to data URL and update preview
                const reader = new FileReader();

                reader.onload = function (fileEvent) {
                    const dataUrl = fileEvent.target.result;

                    // Update preview image
                    imagePreview.src = dataUrl;

                    // Update current post image
                    currentPost.image = dataUrl;

                    // Update preview
                    updatePreview();
                };

                reader.readAsDataURL(file);
            }
        });

        // Handle image removal
        removeImageBtn.addEventListener('click', function () {
            // Reset to placeholder
            imagePreview.src = './assets/img/blog/featured-placeholder.jpg';
            currentPost.image = './assets/img/blog/featured-placeholder.jpg';

            // Clear file input
            imageUploadInput.value = '';

            // Update preview
            updatePreview();
        });
    }
}

/**============================
 * Initialize Preview Sync
 ============================*/
function initializePreviewSync() {
    // Handle settings changes
    const authorInput = document.getElementById('postAuthor');
    const categorySelect = document.getElementById('postCategory');
    const excerptInput = document.getElementById('postExcerpt');
    const readTimeInput = document.getElementById('postReadTime');

    if (authorInput) {
        authorInput.addEventListener('input', function () {
            currentPost.author = this.value;
            updatePreview();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            currentPost.category = this.value;
            updatePreview();
        });
    }

    if (excerptInput) {
        excerptInput.addEventListener('input', function () {
            currentPost.excerpt = this.value;
            updatePreview();
        });
    }

    if (readTimeInput) {
        readTimeInput.addEventListener('input', function () {
            currentPost.readTime = `${this.value} min read`;
            updatePreview();
        });
    }
}

/**=================
 * Update Preview
 =================*/
function updatePreview() {
    // Update preview title
    const previewTitle = document.getElementById('previewTitle');
    if (previewTitle) {
        previewTitle.textContent = currentPost.title || 'Your Post Title';
    }

    // Update preview date
    const previewDate = document.getElementById('previewDate');
    if (previewDate) {
        previewDate.textContent = currentPost.date;
    }

    // Update preview author
    const previewAuthor = document.getElementById('previewAuthor');
    if (previewAuthor) {
        previewAuthor.textContent = currentPost.author || 'Your Name';
    }

    // Update preview category
    const previewCategory = document.getElementById('previewCategory');
    if (previewCategory) {
        previewCategory.textContent = getCategoryName(currentPost.category);
    }

    // Update preview image
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = currentPost.image;
    }

    // Update preview content
    const previewContent = document.getElementById('previewContent');
    if (previewContent) {
        previewContent.innerHTML = currentPost.content || '<p>Your content will appear here as you type in the editor panel.</p>';
    }

    // Update modal preview elements
    updateModalPreview();
}

/**==========================
 * Update Modal Preview
 ==========================*/
function updateModalPreview() {
    const modalPreviewTitle = document.getElementById('modalPreviewTitle');
    const modalPreviewExcerpt = document.getElementById('modalPreviewExcerpt');
    const modalPreviewImage = document.getElementById('modalPreviewImage');

    if (modalPreviewTitle) {
        modalPreviewTitle.textContent = currentPost.title || 'Your Post Title';
    }

    if (modalPreviewExcerpt) {
        modalPreviewExcerpt.textContent = currentPost.excerpt || 'Your post excerpt will appear here.';
    }

    if (modalPreviewImage) {
        modalPreviewImage.src = currentPost.image;
    }
}

/**=============================
 * Initialize Action Buttons
 =============================*/
function initializeActions() {
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const publishBtn = document.getElementById('publishBtn');

    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function () {
            savePost(false);
        });
    }

    if (publishBtn) {
        publishBtn.addEventListener('click', function () {
            // Show publish confirmation modal
            const publishModal = document.getElementById('publishModal');
            if (publishModal) {
                publishModal.classList.add('active');
            }
        });
    }
}

/**========================
 * Initialize Modal
 ========================*/
function initializeModal() {
    const publishModal = document.getElementById('publishModal');
    const closeModalBtn = document.querySelector('.modal__close');
    const cancelPublishBtn = document.getElementById('cancelPublishBtn');
    const confirmPublishBtn = document.getElementById('confirmPublishBtn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            publishModal.classList.remove('active');
        });
    }

    if (cancelPublishBtn) {
        cancelPublishBtn.addEventListener('click', function () {
            publishModal.classList.remove('active');
        });
    }

    if (confirmPublishBtn) {
        confirmPublishBtn.addEventListener('click', function () {
            // Close modal
            publishModal.classList.remove('active');

            // Save and publish the post
            savePost(true);
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === publishModal) {
            publishModal.classList.remove('active');
        }
    });
}

/**===============================
 * Initialize Notifications
 ===============================*/
function initializeNotifications() {
    const notification = document.getElementById('notification');
    const closeNotificationBtn = document.querySelector('.notification__close');

    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', function () {
            notification.classList.remove('show');
        });
    }
}

/**====================
 * Save Post Logic
 ====================*/
function savePost(isPublished) {
    // Validate post before saving
    if (!validatePost()) {
        return;
    }

    // Complete current post object
    currentPost.title = document.getElementById('postTitle').value;
    currentPost.content = quillEditor.root.innerHTML;
    currentPost.excerpt = document.getElementById('postExcerpt').value;
    currentPost.author = document.getElementById('postAuthor').value;
    currentPost.category = document.getElementById('postCategory').value;
    currentPost.readTime = `${document.getElementById('postReadTime').value} min read`;
    currentPost.published = isPublished;

    // Get existing posts from localStorage
    let savedPosts = localStorage.getItem('aftermathBlogPosts');
    let postsArray = [];

    if (savedPosts) {
        try {
            postsArray = JSON.parse(savedPosts);
        } catch (error) {
            console.error('Error parsing saved posts:', error);
        }
    }

    // Check if post exists already (for updating)
    const existingPostIndex = postsArray.findIndex(post => post.id === currentPost.id);

    if (existingPostIndex !== -1) {
        // Update existing post
        postsArray[existingPostIndex] = currentPost;
    } else {
        // Add new post
        postsArray.unshift(currentPost);
    }

    // Save back to localStorage
    localStorage.setItem('aftermathBlogPosts', JSON.stringify(postsArray));

    // Show success notification
    if (isPublished) {
        showNotification('Success!', 'Your blog post has been published successfully.', 'success');

        // Redirect to blog page after a short delay
        setTimeout(() => {
            window.location.href = 'blog.html';
        }, 2000);
    } else {
        showNotification('Saved!', 'Your draft has been saved successfully.', 'success');
    }
}

/**=======================
 * Validate Post Form
 =======================*/
function validatePost() {
    // Check for required fields
    const title = document.getElementById('postTitle').value.trim();
    const content = quillEditor.root.innerHTML.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const author = document.getElementById('postAuthor').value.trim();

    let isValid = true;
    let errorMessage = '';

    if (!title) {
        isValid = false;
        errorMessage = 'Please enter a post title.';
    } else if (!content || content === '<p><br></p>') {
        isValid = false;
        errorMessage = 'Please add some content to your post.';
    } else if (!excerpt) {
        isValid = false;
        errorMessage = 'Please add an excerpt/summary for your post.';
    } else if (!author) {
        isValid = false;
        errorMessage = 'Please enter an author name.';
    }

    if (!isValid) {
        showNotification('Error', errorMessage, 'error');
    }

    return isValid;
}

/**============================
 * Show Notification
 ============================*/
function showNotification(title, message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationIcon = document.querySelector('.notification__icon i');

    if (notification && notificationTitle && notificationMessage) {
        // Set notification content
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;

        // Reset classes
        notification.classList.remove('success', 'error', 'warning');

        // Set icon based on type
        if (type === 'error') {
            notification.classList.add('error');
            notificationIcon.className = 'fas fa-times-circle';
        } else if (type === 'warning') {
            notification.classList.add('warning');
            notificationIcon.className = 'fas fa-exclamation-triangle';
        } else {
            notification.classList.add('success');
            notificationIcon.className = 'fas fa-check-circle';
        }

        // Show notification
        notification.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

/**================================
 * Check for Existing Post
 ================================*/
function checkForExistingPost() {
    // Check URL for edit parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('edit');

    if (postId) {
        // Try to find post in localStorage
        const savedPosts = localStorage.getItem('aftermathBlogPosts');

        if (savedPosts) {
            try {
                const postsArray = JSON.parse(savedPosts);
                const postToEdit = postsArray.find(post => post.id === postId);

                if (postToEdit) {
                    // Load post data into form
                    loadPostForEditing(postToEdit);
                }
            } catch (error) {
                console.error('Error loading post for editing:', error);
            }
        }
    }
}

/**============================
 * Load Post for Editing
 ============================*/
function loadPostForEditing(post) {
    // Update current post object
    currentPost = post;

    // Fill form fields
    document.getElementById('postTitle').value = post.title || '';
    document.getElementById('postAuthor').value = post.author || '';
    document.getElementById('postCategory').value = post.category || 'business-growth';
    document.getElementById('postExcerpt').value = post.excerpt || '';
    document.getElementById('postReadTime').value = parseInt(post.readTime) || 5;

    // Set image preview
    if (post.image) {
        document.getElementById('imagePreview').src = post.image;
    }

    // Set editor content
    if (quillEditor && post.content) {
        quillEditor.root.innerHTML = post.content;
    }

    // Update preview
    updatePreview();

    // Show notification
    showNotification('Post Loaded', 'The selected post has been loaded for editing.', 'success');
}

/**====================
 * Helper Functions
 ====================*/

// Generate unique ID for posts
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Format date for post display
function formatDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

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