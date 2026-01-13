(() => {
    "use strict";

    const onReady = (fn) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    };

    onReady(() => {
        initCustomCursor();
        initScrollReveal();
        initHeroCanvas();
        initTiltEffect();
        initScrollProgress();
        initAnchorGuard();
        initBackToTopButton();
        initThemeToggle();
    });

    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) return;

        const revealElements = document.querySelectorAll('.reveal-up');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px' // Trigger a little after it enters viewport
        });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    function initCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        if (!cursorDot || !cursorOutline) return;

        window.addEventListener('mousemove', e => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        const interactiveElements = document.querySelectorAll('a, button, .work-card, .status-card, .equip-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
        });

        document.body.addEventListener('mouseleave', () => {
            cursorDot.classList.add('cursor-hidden');
            cursorOutline.classList.add('cursor-hidden');
        });

        document.body.addEventListener('mouseenter', () => {
            cursorDot.classList.remove('cursor-hidden');
            cursorOutline.classList.remove('cursor-hidden');
        });
    }

    function initThemeToggle() {
        const themeToggleButton = document.getElementById('theme-toggle');
        if (!themeToggleButton) return;

        const currentTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggleButton.textContent = '🌙';
        } else if (currentTheme === 'dark') {
            document.body.classList.remove('light-mode');
            themeToggleButton.textContent = '☀️';
        } else if (prefersDark) {
            document.body.classList.remove('light-mode');
            themeToggleButton.textContent = '☀️';
        } else {
             document.body.classList.add('light-mode');
            themeToggleButton.textContent = '🌙';
        }


        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
                themeToggleButton.textContent = '🌙';
            } else {
                themeToggleButton.textContent = '☀️';
            }
            localStorage.setItem('theme', theme);
        });
    }

    function initBackToTopButton() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, { passive: true });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function initHeroCanvas() {
        const canvas = document.getElementById("hero-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationFrameId = null;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            spawnParticles();
        };

        const spawnParticles = () => {
            particles = Array.from({ length: 60 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                a: Math.random()
            }));
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                ctx.beginPath();
                ctx.fillStyle = `rgba(255,255,255,${p.a})`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                p.x = (p.x + p.dx + canvas.width) % canvas.width;
                p.y = (p.y + p.dy + canvas.height) % canvas.height;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                render();
            }
        };

        window.addEventListener("resize", resize, { passive: true });
        document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
        
        resize();
        render();
    }

    function initTiltEffect() {
        const cards = document.querySelectorAll(
            ".work-card, .status-card, .equip-card"
        );
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener("mousemove", e => {
                card.style.transition = 'none';
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform =
                    `perspective(1000px)
                     rotateX(${-y * 12}deg)
                     rotateY(${x * 12}deg)
                     translateY(-8px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Even more slowly
                card.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
            });
        });
    }

    function initScrollProgress() {
        const line = document.getElementById("scroll-line");
        if (!line) return;

        const update = () => {
            const doc = document.documentElement;
            const percent =
                (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
            line.style.width = `${percent}%`;
        };

        window.addEventListener("scroll", update, { passive: true });
    }

    function initAnchorGuard() {
        document.querySelectorAll("a[href='#']").forEach(a => {
            a.addEventListener("click", e => e.preventDefault());
        });
    }
})();
