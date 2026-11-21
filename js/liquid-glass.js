/* ==========================================================================
   Eva & Wahid — Liquid Glass Interactive Controller
   ========================================================================== */

(function () {
    'use strict';

    /* 1. Sticky Header Scroll State & Back-to-Top */
    const header = document.getElementById('site-header');
    const backTop = document.getElementById('back-to-top');
    const navLinks = Array.from(document.querySelectorAll('#mainmenu a[href^="#"]'));
    const sections = navLinks
        .map((link) => {
            const target = document.querySelector(link.getAttribute('href'));
            return target ? { link, target } : null;
        })
        .filter(Boolean);

    function handleScroll() {
        const y = window.scrollY || window.pageYOffset;
        if (header) {
            header.classList.toggle('is-scrolled', y > 36);
        }
        if (backTop) {
            backTop.classList.toggle('is-visible', y > 420);
        }

        let current = sections[0];
        const offset = y + 180;
        for (const item of sections) {
            if (item.target.offsetTop <= offset) {
                current = item;
            }
        }
        navLinks.forEach((a) => {
            if (a.parentElement) {
                a.parentElement.classList.remove('active');
            }
        });
        if (current && current.link.parentElement) {
            current.link.parentElement.classList.add('active');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backTop) {
        backTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* 2. Mobile Navigation Drawer */
    const menuBtn = document.getElementById('menu-btn');
    const navEl = document.getElementById('site-nav');

    if (menuBtn && navEl) {
        menuBtn.addEventListener('click', () => {
            const expanded = navEl.classList.toggle('is-open');
            menuBtn.setAttribute('aria-expanded', String(expanded));
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navEl.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* 3. Hero Full-Viewport Slider */
    const slides = Array.from(document.querySelectorAll('.lg-hero-slide'));
    const dots = Array.from(document.querySelectorAll('.lg-slide-dot'));
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let slideIndex = 0;
    let slideTimer = null;

    function goToSlide(idx) {
        if (!slides.length) return;
        slideIndex = (idx + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('is-active', i === slideIndex));
        dots.forEach((d, i) => {
            d.classList.toggle('is-active', i === slideIndex);
            d.setAttribute('aria-pressed', String(i === slideIndex));
        });
    }

    function startSlider() {
        if (slideTimer) clearInterval(slideTimer);
        if (slides.length > 1) {
            slideTimer = setInterval(() => goToSlide(slideIndex + 1), 5500);
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(slideIndex - 1);
            startSlider();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(slideIndex + 1);
            startSlider();
        });
    }
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            startSlider();
        });
    });
    startSlider();

    /* 4. Anniversary Countdown (Next August 21 Love Anniversary) */
    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-mins');
    const elSecs = document.getElementById('cd-secs');
    const elNote = document.getElementById('cd-note');

    function getNextAnniversary() {
        const now = new Date();
        let year = now.getFullYear();
        let target = new Date(year, 7, 21, 10, 0, 0); // August 21, 10:00 AM
        if (target.getTime() <= now.getTime()) {
            year += 1;
            target = new Date(year, 7, 21, 10, 0, 0);
        }
        return target;
    }

    function updateCountdown() {
        if (!elDays || !elHours || !elMins || !elSecs) return;
        const now = new Date();
        const target = getNextAnniversary();
        const diff = Math.max(0, target.getTime() - now.getTime());

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        elDays.textContent = String(days).padStart(2, '0');
        elHours.textContent = String(hours).padStart(2, '0');
        elMins.textContent = String(mins).padStart(2, '0');
        elSecs.textContent = String(secs).padStart(2, '0');

        if (elNote) {
            elNote.textContent = 'পরবর্তী বার্ষিকী: ২১ অগাস্ট ' + target.getFullYear();
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* 5. Family Directory Tabs */
    const tabBtns = Array.from(document.querySelectorAll('.lg-tab-btn'));
    const tabPanels = Array.from(document.querySelectorAll('.lg-tab-panel'));

    tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            tabBtns.forEach((b) => {
                const active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-selected', String(active));
            });
            tabPanels.forEach((panel) => {
                panel.classList.toggle('is-active', panel.id === targetId);
            });
        });
    });

    /* 6. Liquid Glass Image Lightbox Modal */
    const lightbox = document.getElementById('lg-lightbox');
    const lightboxImg = document.getElementById('lg-lightbox-img');
    const lightboxCaption = document.getElementById('lg-lightbox-caption');
    const lightboxClose = document.getElementById('lg-lightbox-close');
    const triggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));

    function openLightbox(src, caption) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = caption || 'Photo preview';
        if (lightboxCaption) {
            lightboxCaption.textContent = caption || '';
        }
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const src = trigger.getAttribute('data-lightbox-src');
            const caption = trigger.getAttribute('data-lightbox-caption') || '';
            if (src) openLightbox(src, caption);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });

    /* 7. Scroll Reveal Animation */
    const revealEls = Array.from(document.querySelectorAll('.lg-reveal'));
    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
        );
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }
})();
