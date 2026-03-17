class Engine {
    constructor() {
        this.listeners = new Set();
        this.isRunning = false;
        this.lastTime = 0;
        this.rafId = null;
        this._tick = this._tick.bind(this);
    }

    add(cb) {
        this.listeners.add(cb);
        this._start();
    }

    remove(cb) {
        this.listeners.delete(cb);
        if (this.listeners.size === 0) {
            this._stop();
        }
    }

    _start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame(this._tick);
    }

    _stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    _tick(now) {
        if (!this.isRunning) return;

        const delta = now - this.lastTime;
        this.lastTime = now;

        const cbs = Array.from(this.listeners);
        for (const cb of cbs) {
            cb(now, delta);
        }

        this.rafId = requestAnimationFrame(this._tick);
    }
}

export const engine = new Engine();
