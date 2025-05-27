// Cart functionality
let cart = [];

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to hardcoded products if JSON fails
        const fallbackProducts = [
            { id: 1, name: 'Essential Tee', subtitle: 'Premium Cotton', price: 89.99, image: 'essential-tee.jpg' },
            { id: 2, name: 'Statement Tee', subtitle: 'Limited Edition', price: 89.99, image: 'statement-tee.jpg' },
            { id: 3, name: 'Classic Tee', subtitle: 'Signature Cut', price: 89.99, image: 'classic-tee.jpg' },
            { id: 4, name: 'Archive Tee', subtitle: 'Heavyweight', price: 89.99, image: 'archive-tee.jpg' }
        ];
        displayProducts(fallbackProducts);
    }
}

// Display products on the page
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <div class="product-logo">${getProductLogo(product.id)}</div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-subtitle">${product.subtitle}</p>
            <p class="product-price">$${product.price}</p>
            <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price})">
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Get product logo based on ID
function getProductLogo(id) {
    const logos = {
        1: 'H<br>O<br>N<br>E<br>S<br>T<br>.',
        2: 'HONEST.<br><span style="font-size: 0.5em; opacity: 0.6;">EST.2025</span><br><span style="font-size: 0.4em; font-style: italic;">noli prohibere<br>inevitabilis</span>',
        3: 'HONEST.',
        4: 'H<br>O<br>N<br>E<br>S<br>T'
    };
    return logos[id] || 'HONEST.';
}

// Add item to cart
function addToCart(name, price) {
    const item = { name, price, id: Date.now() };
    cart.push(item);
    updateCart();
    showAddToCartFeedback(event.target);
    
    // Analytics tracking (if needed)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: price,
            items: [{
                item_id: name.toLowerCase().replace(/\s+/g, '-'),
                item_name: name,
                price: price,
                quantity: 1
            }]
        });
    }
}

// Show visual feedback when item is added to cart
function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added';
    button.style.background = '#fff';
    button.style.color = '#000';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'transparent';
        button.style.color = '#fff';
    }, 1000);
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartCount) cartCount.textContent = cart.length;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotal) cartTotal.textContent = total.toFixed(2);

    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.9rem; opacity: 0.6;">$${item.price}</div>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 0.5rem; cursor: pointer; font-size: 0.8rem;">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Save cart to localStorage
    saveCartToStorage();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('honest-cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('honest-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        cart = [];
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
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
}

// Close cart when clicking outside
function initCartCloseOnOutsideClick() {
    document.addEventListener('click', function(e) {
        const cart = document.getElementById('cart-sidebar');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (cart && cartBtn && !cart.contains(e.target) && !cartBtn.contains(e.target) && cart.classList.contains('open')) {
            cart.classList.remove('open');
        }
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const speed = scrolled * 0.5;
        hero.style.transform = `translateY(${speed}px)`;
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
    `;
    
    if (nav && navMenu) {
        nav.insertBefore(mobileToggle, navMenu);
        
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });
    }
}

// Form submission handler
function handleFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent!';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            this.reset();
        }, 3000);
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe product cards and other elements
    document.querySelectorAll('.product-card, .about-content, .footer-section').forEach(el => {
        observer.observe(el);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    loadProducts();
    initSmoothScrolling();
    initCartCloseOnOutsideClick();
    initParallaxEffect();
    initMobileMenu();
    handleFormSubmission();
    initScrollAnimations();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close cart with Escape key
    if (e.key === 'Escape') {
        const cart = document.getElementById('cart-sidebar');
        if (cart && cart.classList.contains('open')) {
            cart.classList.remove('open');
        }
    }
});

// Export functions for use in HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
