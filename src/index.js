import { DomAdapter } from './dom/adapter.js';

export class MotionInstance {
    constructor(target) {
        if (typeof target === 'string') {
            this.elements = Array.from(document.querySelectorAll(target));
        } else if (target instanceof HTMLElement) {
            this.elements = [target];
        } else if (target instanceof NodeList) {
            this.elements = Array.from(target);
        } else {
            this.elements = target;
        }
        this.queue = [];
        this.isProcessing = false;
    }

    animate(properties, options = {}) {
        const task = async () => {
            const promises = [];

            this.elements.forEach((el, index) => {
                const adapter = new DomAdapter(el);
                const elementDelay = (options.delay || 0) + (index * 100);

                for (const [prop, val] of Object.entries(properties)) {
                    promises.push(
                        adapter.animateProperty(prop, val, {
                            duration: options.duration || 600,
                            delay: elementDelay,
                            ease: options.ease
                        })
                    );
                }
            });

            await Promise.all(promises);
        };

        this.queue.push(task);
        if (!this.isProcessing) this.processQueue();

        return this;
    }

    then(properties, options = {}) {
        return this.animate(properties, options);
    }

    async processQueue() {
        this.isProcessing = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) await task();
        }
        this.isProcessing = false;
    }
}

export function motion(target) {
    return new MotionInstance(target);
}

// Auto-init for data-motion attributes. 
// Uses a check for document.readyState to handle both pre- and post-DOMContentLoaded loading.
export function initDataMotion() {
    if (typeof window === 'undefined') return;

    function run() {
        const elements = document.querySelectorAll('[data-motion]');
        elements.forEach(el => {
            const motionType = el.getAttribute('data-motion');
            const delay = parseFloat(el.getAttribute('data-delay') || '0') * 1000;

            // Set initial hidden state
            if (motionType && motionType.includes('fade')) {
                el.style.opacity = '0';
            }
            if (motionType === 'fade-in-up') {
                el.style.transform = 'translateY(30px)';
            }
            if (motionType === 'fade-in-down') {
                el.style.transform = 'translateY(-30px)';
            }

            // Trigger animation on next frame to allow layout paint
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (motionType === 'fade-in-up' || motionType === 'fade-in-down') {
                        motion(el).animate(
                            { opacity: 1, translateY: 0 },
                            { duration: 800, delay, ease: 'easeOutBack' }
                        );
                    } else if (motionType === 'fade-in') {
                        motion(el).animate(
                            { opacity: 1 },
                            { duration: 800, delay, ease: 'easeOutQuad' }
                        );
                    }
                });
            });
        });
    }

    // If DOM is already loaded (module scripts run deferred), run immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
}

initDataMotion();
