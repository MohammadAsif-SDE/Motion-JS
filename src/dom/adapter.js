import { Tween } from '../core/tween.js';

// Per-element transform state tracker
const transformState = new WeakMap();

function getTransformState(el) {
    if (!transformState.has(el)) {
        transformState.set(el, {});
    }
    return transformState.get(el);
}

function applyTransforms(el) {
    const state = getTransformState(el);
    const parts = [];
    if (state.translateX !== undefined) parts.push(`translateX(${state.translateX}px)`);
    if (state.translateY !== undefined) parts.push(`translateY(${state.translateY}px)`);
    if (state.scale !== undefined) parts.push(`scale(${state.scale})`);
    if (state.rotate !== undefined) parts.push(`rotate(${state.rotate}deg)`);
    if (state.skewX !== undefined) parts.push(`skewX(${state.skewX}deg)`);
    if (state.skewY !== undefined) parts.push(`skewY(${state.skewY}deg)`);
    el.style.transform = parts.join(' ');
}

export class DomAdapter {
    constructor(element) {
        this.element = element;
    }

    parseValue(val) {
        if (typeof val === 'number') return { num: val, unit: '' };
        if (typeof val !== 'string') return { num: Number(val) || 0, unit: '' };

        if (val.startsWith('#') || val.startsWith('rgb')) {
            return { num: 0, unit: val };
        }

        const match = val.match(/^(-?\d+\.?\d*)(.*)$/);
        if (match) {
            return { num: parseFloat(match[1]), unit: match[2] };
        }
        return { num: parseFloat(val) || 0, unit: '' };
    }

    getComputedValue(prop) {
        return window.getComputedStyle(this.element).getPropertyValue(prop);
    }

    animateProperty(prop, targetValue, options) {
        return new Promise((resolve) => {
            const TRANSFORM_PROPS = ['translateX', 'translateY', 'scale', 'rotate', 'skewX', 'skewY'];
            const isTransform = TRANSFORM_PROPS.includes(prop);

            let startNum;

            if (isTransform) {
                const state = getTransformState(this.element);
                if (state[prop] !== undefined) {
                    startNum = state[prop];
                } else {
                    startNum = (prop === 'scale') ? 1 : 0;
                    state[prop] = startNum; // Initialize state
                }
            } else {
                const currentValueStr = this.getComputedValue(prop);
                startNum = this.parseValue(currentValueStr).num;
            }

            const endNum = this.parseValue(targetValue).num;

            const tween = new Tween({
                from: startNum,
                to: endNum,
                duration: options.duration || 1000,
                delay: options.delay || 0,
                ease: options.ease,
                onUpdate: (val) => {
                    if (isTransform) {
                        const state = getTransformState(this.element);
                        state[prop] = val;
                        applyTransforms(this.element);
                    } else {
                        // For opacity, no unit needed
                        if (prop === 'opacity') {
                            this.element.style.opacity = val;
                        } else {
                            this.element.style.setProperty(prop, `${val}px`);
                        }
                    }
                },
                onComplete: resolve
            });

            tween.play();
        });
    }
}
