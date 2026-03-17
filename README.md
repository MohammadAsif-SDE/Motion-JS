# Motion.js ✨

> A zero-dependency, ultra-lightweight, chainable animation library for modern web applications.

Motion.js makes it dead simple to add smooth, performant animations to any DOM element — with both a **JavaScript API** and **declarative HTML attributes**.

## Quick Start

Include Motion.js via ES module:

```html
<script type="module" src="./src/index.js"></script>
```

### Declarative (Zero JS!)

Add `data-motion` attributes to your HTML:

```html
<h1 data-motion="fade-in-up">Hello World</h1>
<p data-motion="fade-in-down" data-delay="0.2">Subtitle here</p>
```

Supported values: `fade-in`, `fade-in-up`, `fade-in-down`

### JavaScript API

```js
import { motion } from './src/index.js';

// Simple animation
motion('#my-element').animate({ opacity: 1, translateY: 0 }, {
  duration: 600,
  ease: 'easeOutBack'
});

// Chaining (sequential)
motion('#cube')
  .animate({ scale: 1.2, rotate: 90 }, { duration: 500, ease: 'easeOutExpo' })
  .then({ scale: 1, rotate: 360 }, { duration: 800, ease: 'easeOutBounce' });

// Stagger multiple elements (auto 100ms between each)
motion('.grid-box').animate({ opacity: 1, scale: 1 }, {
  duration: 600,
  ease: 'easeOutBack'
});
```

## API Reference

### `motion(target)`

Creates a new motion instance. Accepts:
- CSS selector string (`'.class'`, `'#id'`)
- `HTMLElement`
- `NodeList`
- `HTMLElement[]`

### `.animate(properties, options)`

| Property | Type | Description |
|----------|------|-------------|
| `opacity` | number | Element opacity (0-1) |
| `translateX` | number | Horizontal translation (px) |
| `translateY` | number | Vertical translation (px) |
| `scale` | number | Scale factor |
| `rotate` | number | Rotation (degrees) |

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | number | 600 | Duration in ms |
| `delay` | number | 0 | Delay in ms |
| `ease` | string | `'easeOutQuad'` | Easing function |

### `.then(properties, options)`

Chain sequential animations after the previous one completes.

## Available Easings

`linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeInExpo`, `easeOutExpo`, `easeInOutExpo`, `easeOutBack`, `easeOutElastic`, `easeOutBounce`

## Architecture

| Module | Description |
|--------|-------------|
| `core/engine.js` | Single `requestAnimationFrame` loop manager |
| `core/tween.js` | Value interpolation with easing |
| `utils/easing.js` | 13 standard easing functions |
| `dom/adapter.js` | DOM property reader/writer with transform composition |
| `index.js` | Public API (`motion()`, `initDataMotion()`) |

## License

MIT
