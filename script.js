/* ============================================
   YV Royal Hotel — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Preloader =====
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });
    // Fallback: hide preloader after 3s even if resources slow
    setTimeout(() => preloader.classList.add('hidden'), 3500);

    // ===== Set default dates for booking bar =====
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    if (checkinInput) checkinInput.value = formatDate(today);
    if (checkoutInput) checkoutInput.value = formatDate(tomorrow);

    function formatDate(d) {
        return d.toISOString().split('T')[0];
    }

    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Active Nav Link =====
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        let current = '';

        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ===== Mobile Navigation =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
        document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('mobile-active');
            document.body.style.overflow = '';
        });
    });

    // ===== Scroll Reveal Animation =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== Counter Animation =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.4 });

    if (statNumbers.length > 0) {
        counterObserver.observe(statNumbers[0].closest('.stats-bar'));
    }

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString() + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString() + '+';
                }
            };
            updateCounter();
        });
    }

    // ===== Testimonials Slider =====
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');

    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        const totalSlides = cards.length;

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots();
        }

        function updateDots() {
            dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentSlide);
            });
        }

        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
            goToSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
            goToSlide(currentSlide);
        });

        // Auto-play testimonials
        let autoPlay = setInterval(() => {
            currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
            goToSlide(currentSlide);
        }, 5000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
                goToSlide(currentSlide);
            }, 5000);
        });

        // Swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextBtn.click();
                else prevBtn.click();
            }
        });
    }

    // ===== Lightbox =====
    window.openLightbox = function (el) {
        const img = el.querySelector('img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close lightbox on overlay click
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeLightbox();
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ===== Check Availability Button =====
    const checkAvailBtn = document.getElementById('checkAvailability');
    if (checkAvailBtn) {
        checkAvailBtn.addEventListener('click', () => {
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const guests = document.getElementById('guests').value;
            const roomtype = document.getElementById('roomtype').value;

            if (!checkin || !checkout) {
                showNotification('Please select check-in and check-out dates.', 'warning');
                return;
            }

            if (new Date(checkout) <= new Date(checkin)) {
                showNotification('Check-out date must be after check-in date.', 'warning');
                return;
            }

            showNotification(
                `Checking availability for ${roomtype} — ${guests} from ${checkin} to ${checkout}. Our team will contact you shortly!`,
                'success'
            );
        });
    }

    // ===== Contact Form =====
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fname = document.getElementById('fname').value.trim();
            const email = document.getElementById('email').value.trim();

            if (!fname || !email) {
                showNotification('Please fill in all required fields.', 'warning');
                return;
            }

            showNotification(
                `Thank you, ${fname}! Your message has been sent successfully. We'll get back to you within 24 hours.`,
                'success'
            );
            enquiryForm.reset();
        });
    }

    // ===== Newsletter =====
    const newsletterBtn = document.getElementById('newsletterBtn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput.value.trim();

            if (!email || !email.includes('@')) {
                showNotification('Please enter a valid email address.', 'warning');
                return;
            }

            showNotification('Welcome to the YV Royal family! You\'ll receive our exclusive offers soon.', 'success');
            emailInput.value = '';
        });
    }

    // ===== Notification System =====
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
      <div class="notification-inner">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        <p>${message}</p>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '30px',
            zIndex: '10001',
            maxWidth: '420px',
            animation: 'slideInRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards'
        });

        const inner = notification.querySelector('.notification-inner');
        Object.assign(inner.style, {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '20px 24px',
            background: type === 'success'
                ? 'linear-gradient(135deg, rgba(46,106,106,0.95), rgba(20,20,30,0.95))'
                : 'linear-gradient(135deg, rgba(122,46,61,0.95), rgba(20,20,30,0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid ' + (type === 'success' ? 'rgba(46,106,106,0.5)' : 'rgba(122,46,61,0.5)'),
            color: '#f5f0e8',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        });

        const icon = notification.querySelector('.notification-inner > i');
        icon.style.color = type === 'success' ? '#5ecfcf' : '#e8807a';
        icon.style.fontSize = '1.2rem';
        icon.style.marginTop = '2px';

        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: '#9a9aad',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginLeft: 'auto',
            flexShrink: '0'
        });

        document.body.appendChild(notification);

        // Auto-remove after 6 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards';
                setTimeout(() => notification.remove(), 500);
            }
        }, 6000);
    }

    // Add notification keyframes
    const notifStyle = document.createElement('style');
    notifStyle.textContent = `
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(100px); }
    }
  `;
    document.head.appendChild(notifStyle);

    // ===== Smooth scroll for all anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== Parallax-like effect for hero on scroll =====
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroBg.style.transform = `scale(${1.05 + scrollY * 0.0003}) translateY(${scrollY * 0.3}px)`;
            }
        });
    }

    // ===== Keyboard accessibility for Book Now buttons in cards =====
    document.querySelectorAll('.room-card-footer .btn-outline').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });


    // ===== Floating Chat Widget Toggle =====
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatButton');
    const chatClose = document.getElementById('chatClose');
    const chatWindow = document.getElementById('chatWindow');
    const conciergeLink = document.querySelector('a[href="#chatbot"]');

    if (chatButton && chatWindow) {
        chatButton.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        // Open chat window when navigation link is clicked
        if (conciergeLink) {
            conciergeLink.addEventListener('click', (e) => {
                e.preventDefault();
                chatWindow.classList.add('active');
            });
        }

        // Close chat window when clicking outside
        document.addEventListener('click', (e) => {
            if (chatWidget && !chatWidget.contains(e.target) && chatWindow.classList.contains('active')) {
                chatWindow.classList.remove('active');
            }
        });
    }
});

