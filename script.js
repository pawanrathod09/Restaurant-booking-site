// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Menu Category Switching
const menuButtons = document.querySelectorAll('.menu-btn');
const menuCategories = document.querySelectorAll('.menu-category');

menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and categories
        menuButtons.forEach(btn => btn.classList.remove('active'));
        menuCategories.forEach(category => category.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding category
        const targetCategory = button.getAttribute('data-category');
        document.getElementById(targetCategory).classList.add('active');
    });
});

// Booking Form Validation and Submission
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const bookingData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        guests: formData.get('guests'),
        date: formData.get('date'),
        time: formData.get('time'),
        specialRequests: formData.get('special-requests')
    };
    
    // Validate form
    if (validateBookingForm(bookingData)) {
        // Simulate booking submission
        submitBooking(bookingData);
    }
});

function validateBookingForm(data) {
    let isValid = true;
    const errors = [];
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
        isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
        errors.push('Please enter a valid 10-digit Indian phone number');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
    }
    
    // Guests validation
    if (!data.guests) {
        errors.push('Please select number of guests');
        isValid = false;
    }
    
    // Date validation
    if (!data.date) {
        errors.push('Please select a date');
        isValid = false;
    } else {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('Please select a future date');
            isValid = false;
        }
    }
    
    // Time validation
    if (!data.time) {
        errors.push('Please select a time');
        isValid = false;
    }
    
    // Show errors if any
    if (!isValid) {
        showNotification(errors.join('<br>'), 'error');
    }
    
    return isValid;
}

function submitBooking(data) {
    // Show loading state
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification(`
            <strong>Booking Confirmed!</strong><br>
            Thank you ${data.name}! Your table for ${data.guests} people has been booked for ${formatDate(data.date)} at ${formatTime(data.time)}.<br>
            We'll send a confirmation to ${data.email}.
        `, 'success');
        
        // Reset form
        bookingForm.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scrolling for navigation links
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


const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}


window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);


document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});


const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in');
    }
    
    const timeSelect = document.getElementById('time');
    if (timeSelect) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        
        const timeOptions = Array.from(timeSelect.options).slice(1); 
        for (let option of timeOptions) {
            const [hour, minute] = option.value.split(':').map(Number);
            if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
                option.selected = true;
                break;
            }
        }
    }
});


function openWhatsApp() {
    const phoneNumber = '918459540146';
    const message = 'Hi! I would like to make a reservation at Spice Garden, Yavatmal.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}


document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp();
    });
});

// Add phone number click handler
document.querySelectorAll('.contact-item').forEach(item => {
    if (item.textContent.includes('+91')) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.open('tel:+918459540146');
        });
    }
});

// Add email click handler
document.querySelectorAll('.contact-item').forEach(item => {
    if (item.textContent.includes('@')) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.open('mailto:info@spicegarden-yavatmal.com');
        });
    }
});
