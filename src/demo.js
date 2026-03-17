import { motion } from './index.js';

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════ STAGGER GRID SETUP ═══════════════════
    const grid = document.getElementById('stagger-grid');
    if (grid) {
        for (let i = 0; i < 12; i++) {
            const div = document.createElement('div');
            div.className = 'grid-box';
            div.textContent = (i + 1).toString();
            div.style.opacity = '0';
            div.style.transform = 'scale(0.5)';
            grid.appendChild(div);
        }
    }

    // ═══════════════════ CUBE DEMO ═══════════════════
    const btnCube = document.getElementById('btn-animate-demo');
    const cubePlayground = document.getElementById('demo-cube-playground');
    const cubeHero = document.getElementById('demo-cube');

    if (btnCube) {
        btnCube.addEventListener('click', () => {
            const cube = cubePlayground || cubeHero;
            if (!cube) return;

            motion(cube)
                .animate({ scale: 1.2, rotate: 90 }, { duration: 500, ease: 'easeOutExpo' })
                .then({ scale: 0.8, rotate: 180 }, { duration: 400, ease: 'easeInOutQuad' })
                .then({ scale: 1, rotate: 360 }, { duration: 800, ease: 'easeOutBounce' });
        });
    }

    // ═══════════════════ STAGGER DEMO ═══════════════════
    const btnStagger = document.getElementById('btn-stagger-demo');
    const btnStaggerReset = document.getElementById('btn-stagger-reset');

    if (btnStagger) {
        btnStagger.addEventListener('click', () => {
            motion('.grid-box').animate(
                { opacity: 1, scale: 1 },
                { duration: 600, ease: 'easeOutBack', delay: 0 }
            );
        });
    }

    if (btnStaggerReset) {
        btnStaggerReset.addEventListener('click', () => {
            document.querySelectorAll('.grid-box').forEach(box => {
                box.style.opacity = '0';
                box.style.transform = 'scale(0.5)';
            });
        });
    }

    // ═══════════════════ EASING COMPARISON DEMO ═══════════════════
    const btnEasing = document.getElementById('btn-easing-demo');
    const btnEasingReset = document.getElementById('btn-easing-reset');

    if (btnEasing) {
        btnEasing.addEventListener('click', () => {
            const trackWidth = document.querySelector('.easing-track');
            if (!trackWidth) return;
            const maxX = trackWidth.offsetWidth - 36; // ball width + padding

            motion('#ball-quad').animate(
                { translateX: maxX },
                { duration: 1200, ease: 'easeOutQuad' }
            );

            motion('#ball-bounce').animate(
                { translateX: maxX },
                { duration: 1200, ease: 'easeOutBounce' }
            );

            motion('#ball-elastic').animate(
                { translateX: maxX },
                { duration: 1200, ease: 'easeOutElastic' }
            );
        });
    }

    if (btnEasingReset) {
        btnEasingReset.addEventListener('click', () => {
            document.querySelectorAll('.easing-ball').forEach(ball => {
                ball.style.transform = 'translateX(0px)';
            });
        });
    }
});
