import { engine } from './engine.js';
import { easings } from '../utils/easing.js';

export class Tween {
    constructor(options) {
        this.startValue = options.from;
        this.endValue = options.to;
        this.duration = options.duration;
        this.delay = options.delay || 0;
        this.onUpdate = options.onUpdate;
        this.onComplete = options.onComplete;
        this.playing = false;
        this.startTime = -1;

        if (typeof options.ease === 'string' && easings[options.ease]) {
            this.easeFn = easings[options.ease];
        } else if (typeof options.ease === 'function') {
            this.easeFn = options.ease;
        } else {
            this.easeFn = easings['easeOutQuad'];
        }
    }

    play() {
        if (this.playing) return;
        this.playing = true;
        this.startTime = performance.now() + this.delay;
        engine.add(this.update);
    }

    stop() {
        if (!this.playing) return;
        this.playing = false;
        engine.remove(this.update);
    }

    update = (now) => {
        if (now < this.startTime) return;

        let elapsed = now - this.startTime;
        let progress = Math.min(elapsed / this.duration, 1);

        let eProgress = this.easeFn(progress);
        let value = this.startValue + (this.endValue - this.startValue) * eProgress;

        this.onUpdate(value);

        if (progress === 1) {
            this.stop();
            if (this.onComplete) this.onComplete();
        }
    };
}
