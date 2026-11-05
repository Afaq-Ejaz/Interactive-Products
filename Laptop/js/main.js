/* ═══════════════════════════════════════════════════════════
   CM Punjab e-Youth Initiative 2025 — Interactive Explorer
   Main JavaScript — GSAP ScrollTrigger Animations
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Register GSAP Plugin ───────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // ─── Preloader ──────────────────────────────────────────
    function initPreloader() {
        var preloader = document.getElementById('preloader');
        if (!preloader) return;

        // Wait for hero image to load, then dismiss
        var heroImg = document.querySelector('.hero-laptop-img');
        function dismiss() {
            setTimeout(function () {
                preloader.classList.add('hidden');
                // Start hero entrance after preloader fades
                setTimeout(animateHeroEntrance, 400);
            }, 600);
        }

        if (heroImg && !heroImg.complete) {
            heroImg.addEventListener('load', dismiss);
            // Fallback: dismiss after 3s even if image fails
            setTimeout(dismiss, 3000);
        } else {
            dismiss();
        }
    }


    // ─── Progress Bar ───────────────────────────────────────
    function initProgressBar() {
        gsap.to('#progress-bar', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }


    // ═══════════════════════════════════════════════════════
    // ACT 1 — HERO
    // ═══════════════════════════════════════════════════════

    function animateHeroEntrance() {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero-badge', {
            y: -20, opacity: 0, duration: 0.8
        })
        .from('.hero-title .title-line', {
            y: 60, opacity: 0, duration: 0.9, stagger: 0.12
        }, '-=0.4')
        .from('.hero-subtitle', {
            y: 30, opacity: 0, duration: 0.8
        }, '-=0.4')
        .from('.hero-laptop-img', {
            y: 50, opacity: 0, scale: 0.92, duration: 1.1, ease: 'power2.out'
        }, '-=0.7')
        .from('.hero-laptop-reflection', {
            opacity: 0, duration: 0.6
        }, '-=0.4')
        .from('.scroll-indicator', {
            opacity: 0, y: 10, duration: 0.6
        }, '-=0.2');
    }

    function initHeroFloat() {
        // Gentle idle float for the laptop image
        gsap.to('.hero-laptop-img', {
            y: -12,
            duration: 3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    function initHeroParallax() {
        // Parallax: as user scrolls past hero, content drifts up
        gsap.to('.hero-content', {
            y: -100,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#act-1',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.hero-laptop-wrapper', {
            y: -60,
            scale: 0.88,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: '#act-1',
                start: '60% top',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.scroll-indicator', {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#act-1',
                start: '10% top',
                end: '30% top',
                scrub: 1
            }
        });
    }


    // ═══════════════════════════════════════════════════════
    // ACT 2 — LID STORY
    // ═══════════════════════════════════════════════════════

    function initLidStory() {
        // Laptop image entrance
        gsap.from('.lid-laptop-img', {
            scale: 0.82,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#act-2',
                start: 'top 75%',
                end: 'top 30%',
                scrub: 1
            }
        });

        // Glass card entrance
        gsap.from('.glass-card', {
            x: -60,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#act-2',
                start: 'top 65%',
                end: 'top 25%',
                scrub: 1
            }
        });

        // Hotspots stagger in
        gsap.from('.hotspot', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: 'back.out(2)',
            scrollTrigger: {
                trigger: '#act-2',
                start: 'top 40%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    function initHotspots() {
        var hotspots = document.querySelectorAll('.hotspot');

        hotspots.forEach(function (hotspot) {
            var btn = hotspot.querySelector('.hotspot-btn');
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var isActive = hotspot.classList.contains('active');

                // Close all first
                hotspots.forEach(function (h) { h.classList.remove('active'); });

                // Toggle clicked
                if (!isActive) {
                    hotspot.classList.add('active');
                }
            });
        });

        // Click outside closes all
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.hotspot')) {
                hotspots.forEach(function (h) { h.classList.remove('active'); });
            }
        });
    }


    // ═══════════════════════════════════════════════════════
    // ACT 3 — THE REVEAL
    // ═══════════════════════════════════════════════════════

    function initReveal() {
        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#act-3',
                start: 'top 70%',
                end: 'center center',
                scrub: 1
            }
        });

        // Screen folds open from top
        tl.from('.css-laptop-screen', {
            rotateX: -70,
            opacity: 0,
            transformOrigin: 'bottom center',
            duration: 1.2,
            ease: 'power2.out'
        })
        // Base slides up
        .from('.css-laptop-base', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, 0.15)
        // Hinge
        .from('.css-laptop-hinge', {
            scaleX: 0.5,
            opacity: 0,
            duration: 0.6
        }, 0.1)
        // Screen text fades in
        .from('.screen-text', {
            opacity: 0,
            y: 15,
            duration: 0.5
        }, 0.7)
        // Shadow appears
        .from('.css-laptop-shadow', {
            opacity: 0,
            scaleX: 0.5,
            duration: 0.6
        }, 0.4);

        // Text content
        gsap.from('.reveal-heading', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#act-3',
                start: 'top 60%',
                end: 'top 30%',
                scrub: 1
            }
        });

        gsap.from('.reveal-text .section-body', {
            y: 35,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#act-3',
                start: 'top 50%',
                end: 'top 20%',
                scrub: 1
            }
        });
    }


    // ═══════════════════════════════════════════════════════
    // ACT 4 — SPEC DEEP DIVE
    // ═══════════════════════════════════════════════════════

    function initSpecs() {
        // Header
        gsap.from('.specs-header', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#act-4',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });

        // Cards stagger
        gsap.from('.spec-card', {
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.specs-grid',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        // Spec bars animate width
        ScrollTrigger.create({
            trigger: '.specs-grid',
            start: 'top 55%',
            onEnter: function () { animateSpecBars(true); },
            onLeaveBack: function () { animateSpecBars(false); }
        });

        // OS Badge
        gsap.from('.os-badge', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            scrollTrigger: {
                trigger: '.os-badge',
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    function animateSpecBars(show) {
        var bars = document.querySelectorAll('.spec-bar-fill');
        bars.forEach(function (bar) {
            var target = show ? bar.getAttribute('data-width') + '%' : '0%';
            bar.style.width = target;
        });
    }


    // ═══════════════════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════════════════

    function initFooter() {
        gsap.from('#footer .footer-divider', {
            scaleX: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#footer',
                start: 'top 92%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('#footer .footer-brand, #footer .footer-meta', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '#footer',
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        });
    }


    // ═══════════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════════

    function init() {
        initPreloader();
        initProgressBar();
        initHeroFloat();
        initHeroParallax();
        initLidStory();
        initHotspots();
        initReveal();
        initSpecs();
        initFooter();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

