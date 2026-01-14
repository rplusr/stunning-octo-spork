// Animation Studio - Interactive Animation Designer for AI Agents
// State management
const state = {
    componentType: 'button',
    animationType: 'fadeIn',
    duration: 600,
    delay: 0,
    easing: 'ease',
    customBezier: [0.25, 0.1, 0.25, 1],
    isLooping: false,
    isPlaying: false
};

// Component templates
const components = {
    button: {
        html: '<button class="component-button">Click Me</button>',
        name: 'Button'
    },
    card: {
        html: '<div class="component-card"><h3>Card Title</h3><p>This is a sample card component with some descriptive text.</p></div>',
        name: 'Card'
    },
    modal: {
        html: '<div class="component-modal"><h3>Modal Dialog</h3><p>This is a modal dialog box that appears over the main content.</p></div>',
        name: 'Modal'
    },
    notification: {
        html: '<div class="component-notification"><h4>Notification</h4><p>Your action was successful!</p></div>',
        name: 'Notification'
    },
    badge: {
        html: '<span class="component-badge">New</span>',
        name: 'Badge'
    }
};

// Animation definitions
const animations = {
    fadeIn: {
        name: 'Fade In',
        keyframes: {
            from: { opacity: 0 },
            to: { opacity: 1 }
        }
    },
    fadeOut: {
        name: 'Fade Out',
        keyframes: {
            from: { opacity: 1 },
            to: { opacity: 0 }
        }
    },
    slideInUp: {
        name: 'Slide In Up',
        keyframes: {
            from: { transform: 'translateY(30px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 }
        }
    },
    slideInDown: {
        name: 'Slide In Down',
        keyframes: {
            from: { transform: 'translateY(-30px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 }
        }
    },
    slideInLeft: {
        name: 'Slide In Left',
        keyframes: {
            from: { transform: 'translateX(-30px)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 }
        }
    },
    slideInRight: {
        name: 'Slide In Right',
        keyframes: {
            from: { transform: 'translateX(30px)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 }
        }
    },
    scaleIn: {
        name: 'Scale In',
        keyframes: {
            from: { transform: 'scale(0.8)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 }
        }
    },
    scaleOut: {
        name: 'Scale Out',
        keyframes: {
            from: { transform: 'scale(1)', opacity: 1 },
            to: { transform: 'scale(0.8)', opacity: 0 }
        }
    },
    rotateIn: {
        name: 'Rotate In',
        keyframes: {
            from: { transform: 'rotate(-180deg) scale(0.8)', opacity: 0 },
            to: { transform: 'rotate(0) scale(1)', opacity: 1 }
        }
    },
    bounceIn: {
        name: 'Bounce In',
        keyframes: {
            '0%': { transform: 'scale(0.3)', opacity: 0 },
            '50%': { transform: 'scale(1.05)', opacity: 1 },
            '70%': { transform: 'scale(0.9)' },
            '100%': { transform: 'scale(1)' }
        }
    },
    shake: {
        name: 'Shake',
        keyframes: {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
        }
    }
};

// Easing presets
const easingPresets = {
    ease: 'ease',
    linear: 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    custom: null // Will use customBezier
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeControls();
    initializeBezierEditor();
    updatePreview();
    updateExports();
});

// Initialize controls
function initializeControls() {
    // Component type
    document.getElementById('componentType').addEventListener('change', (e) => {
        state.componentType = e.target.value;
        updateComponent();
        playAnimation();
    });

    // Animation type
    document.getElementById('animationType').addEventListener('change', (e) => {
        state.animationType = e.target.value;
        updatePreview();
        updateExports();
        playAnimation();
    });

    // Duration
    document.getElementById('duration').addEventListener('input', (e) => {
        state.duration = parseInt(e.target.value);
        document.getElementById('durationValue').textContent = state.duration;
        updatePreview();
        updateExports();
    });

    // Delay
    document.getElementById('delay').addEventListener('input', (e) => {
        state.delay = parseInt(e.target.value);
        document.getElementById('delayValue').textContent = state.delay;
        updatePreview();
        updateExports();
    });

    // Easing presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.easing = e.target.dataset.easing;

            if (state.easing === 'custom') {
                document.getElementById('bezierEditorSection').style.display = 'block';
                drawBezierCurve();
            } else {
                document.getElementById('bezierEditorSection').style.display = 'none';
            }

            updatePreview();
            updateExports();
        });
    });

    // Play button
    document.getElementById('playBtn').addEventListener('click', () => {
        playAnimation();
    });

    // Loop button
    document.getElementById('loopBtn').addEventListener('click', () => {
        state.isLooping = !state.isLooping;
        const loopBtn = document.getElementById('loopBtn');
        loopBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 2V8M21 8H15M21 8L18 5.5C16.5 4 14.5 3 12 3C7 3 3 7 3 12C3 17 7 21 12 21C16 21 19.5 18.5 21 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Loop: ${state.isLooping ? 'On' : 'Off'}
        `;
    });

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.dataset.target;
            const content = document.getElementById(targetId).textContent;

            navigator.clipboard.writeText(content).then(() => {
                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                e.target.classList.add('copied');

                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // Bezier inputs
    ['p1x', 'p1y', 'p2x', 'p2y'].forEach((id, index) => {
        document.getElementById(id).addEventListener('input', (e) => {
            state.customBezier[index] = parseFloat(e.target.value);
            drawBezierCurve();
            updatePreview();
            updateExports();
        });
    });
}

// Update component
function updateComponent() {
    const previewComponent = document.getElementById('previewComponent');
    previewComponent.innerHTML = components[state.componentType].html;
}

// Play animation
function playAnimation() {
    const previewComponent = document.getElementById('previewComponent');
    const element = previewComponent.firstElementChild;

    // Remove animation
    element.style.animation = 'none';

    // Trigger reflow
    void element.offsetWidth;

    // Get easing
    let easingValue = easingPresets[state.easing];
    if (state.easing === 'custom') {
        easingValue = `cubic-bezier(${state.customBezier.join(', ')})`;
    }

    // Apply animation
    const animationName = `anim-${state.animationType}`;
    const iteration = state.isLooping ? 'infinite' : '1';
    element.style.animation = `${animationName} ${state.duration}ms ${easingValue} ${state.delay}ms ${iteration}`;
}

// Update preview
function updatePreview() {
    // Inject keyframes
    let styleElement = document.getElementById('dynamic-keyframes');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-keyframes';
        document.head.appendChild(styleElement);
    }

    const animation = animations[state.animationType];
    let keyframesCSS = `@keyframes anim-${state.animationType} {\n`;

    for (const [key, value] of Object.entries(animation.keyframes)) {
        keyframesCSS += `  ${key} {\n`;
        for (const [prop, val] of Object.entries(value)) {
            keyframesCSS += `    ${prop}: ${val};\n`;
        }
        keyframesCSS += `  }\n`;
    }

    keyframesCSS += '}';
    styleElement.textContent = keyframesCSS;
}

// Initialize Bezier Editor
function initializeBezierEditor() {
    const canvas = document.getElementById('bezierCanvas');
    const ctx = canvas.getContext('2d');
    let dragging = null;

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;

        // Check if clicking near a control point
        const p1 = { x: state.customBezier[0], y: state.customBezier[1] };
        const p2 = { x: state.customBezier[2], y: state.customBezier[3] };

        const dist1 = Math.sqrt(Math.pow(x - p1.x, 2) + Math.pow(y - p1.y, 2));
        const dist2 = Math.sqrt(Math.pow(x - p2.x, 2) + Math.pow(y - p2.y, 2));

        if (dist1 < 0.08) {
            dragging = 'p1';
        } else if (dist2 < 0.08) {
            dragging = 'p2';
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!dragging) return;

        const rect = canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width;
        let y = 1 - (e.clientY - rect.top) / rect.height;

        // Clamp x between 0 and 1
        x = Math.max(0, Math.min(1, x));

        if (dragging === 'p1') {
            state.customBezier[0] = x;
            state.customBezier[1] = y;
            document.getElementById('p1x').value = x.toFixed(2);
            document.getElementById('p1y').value = y.toFixed(2);
        } else if (dragging === 'p2') {
            state.customBezier[2] = x;
            state.customBezier[3] = y;
            document.getElementById('p2x').value = x.toFixed(2);
            document.getElementById('p2y').value = y.toFixed(2);
        }

        drawBezierCurve();
        updatePreview();
        updateExports();
    });

    canvas.addEventListener('mouseup', () => {
        dragging = null;
    });

    canvas.addEventListener('mouseleave', () => {
        dragging = null;
    });
}

// Draw Bezier Curve
function drawBezierCurve() {
    const canvas = document.getElementById('bezierCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = 20;

    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();

    // Draw bezier curve
    const [p1x, p1y, p2x, p2y] = state.customBezier;

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let t = 0; t <= 1; t += 0.01) {
        const x = cubicBezier(t, 0, p1x, p2x, 1);
        const y = cubicBezier(t, 0, p1y, p2y, 1);

        const canvasX = padding + x * (w - 2 * padding);
        const canvasY = h - padding - y * (h - 2 * padding);

        if (t === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Draw control points
    const drawPoint = (x, y, label) => {
        const canvasX = padding + x * (w - 2 * padding);
        const canvasY = h - padding - y * (h - 2 * padding);

        // Line from endpoint to control point
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        if (label === 'P1') {
            ctx.moveTo(padding, h - padding);
        } else {
            ctx.moveTo(w - padding, padding);
        }
        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Control point
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    drawPoint(p1x, p1y, 'P1');
    drawPoint(p2x, p2y, 'P2');
}

// Cubic bezier calculation
function cubicBezier(t, p0, p1, p2, p3) {
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    return p0 * mt3 + 3 * p1 * mt2 * t + 3 * p2 * mt * t2 + p3 * t3;
}

// Update exports
function updateExports() {
    updateCSSExport();
    updateJSExport();
    updateAIPromptExport();
}

// Generate CSS export
function updateCSSExport() {
    const animation = animations[state.animationType];
    let easingValue = easingPresets[state.easing];
    if (state.easing === 'custom') {
        easingValue = `cubic-bezier(${state.customBezier.join(', ')})`;
    }

    let css = `/* ${animation.name} Animation */\n`;
    css += `@keyframes ${state.animationType} {\n`;

    for (const [key, value] of Object.entries(animation.keyframes)) {
        css += `  ${key} {\n`;
        for (const [prop, val] of Object.entries(value)) {
            css += `    ${prop}: ${val};\n`;
        }
        css += `  }\n`;
    }

    css += `}\n\n`;
    css += `.animated-element {\n`;
    css += `  animation: ${state.animationType} ${state.duration}ms ${easingValue}`;
    if (state.delay > 0) {
        css += ` ${state.delay}ms`;
    }
    css += `;\n`;
    css += `}\n`;

    document.getElementById('cssCode').textContent = css;
}

// Generate JavaScript export
function updateJSExport() {
    const animation = animations[state.animationType];
    let easingValue = easingPresets[state.easing];
    if (state.easing === 'custom') {
        easingValue = `cubic-bezier(${state.customBezier.join(', ')})`;
    }

    let js = `// ${animation.name} Animation\n`;
    js += `const element = document.querySelector('.your-element');\n\n`;
    js += `element.style.animation = '${state.animationType} ${state.duration}ms ${easingValue}`;
    if (state.delay > 0) {
        js += ` ${state.delay}ms`;
    }
    js += `';\n\n`;
    js += `// Or using Web Animations API\n`;
    js += `element.animate(${JSON.stringify(Object.values(animation.keyframes), null, 2)}, {\n`;
    js += `  duration: ${state.duration},\n`;
    js += `  delay: ${state.delay},\n`;
    js += `  easing: '${easingValue}',\n`;
    js += `  fill: 'forwards'\n`;
    js += `});\n`;

    document.getElementById('jsCode').textContent = js;
}

// Generate AI prompt export
function updateAIPromptExport() {
    const animation = animations[state.animationType];
    const component = components[state.componentType];
    let easingValue = easingPresets[state.easing];
    if (state.easing === 'custom') {
        easingValue = `cubic-bezier(${state.customBezier.join(', ')})`;
    }

    let prompt = `Implement a ${animation.name.toLowerCase()} animation for ${component.name.toLowerCase()} components with the following exact specifications:\n\n`;

    prompt += `ANIMATION DETAILS:\n`;
    prompt += `- Name: ${state.animationType}\n`;
    prompt += `- Type: ${animation.name}\n`;
    prompt += `- Duration: ${state.duration}ms\n`;
    if (state.delay > 0) {
        prompt += `- Delay: ${state.delay}ms\n`;
    }
    prompt += `- Easing: ${easingValue}\n`;
    if (state.easing === 'custom') {
        prompt += `  (Control points: P1(${state.customBezier[0]}, ${state.customBezier[1]}), P2(${state.customBezier[2]}, ${state.customBezier[3]}))\n`;
    }
    prompt += `\n`;

    prompt += `KEYFRAMES:\n`;
    for (const [key, value] of Object.entries(animation.keyframes)) {
        prompt += `${key}:\n`;
        for (const [prop, val] of Object.entries(value)) {
            prompt += `  ${prop}: ${val}\n`;
        }
    }
    prompt += `\n`;

    prompt += `IMPLEMENTATION REQUIREMENTS:\n`;
    prompt += `1. Create a CSS @keyframes animation named "${state.animationType}"\n`;
    prompt += `2. Apply this animation to all ${component.name.toLowerCase()} components\n`;
    prompt += `3. Use the exact timing function: ${easingValue}\n`;
    prompt += `4. The animation should feel smooth and polished\n`;
    prompt += `5. Ensure the animation works across all modern browsers\n`;
    prompt += `\n`;

    prompt += `FEEL:\n`;
    prompt += `The animation should feel ${getAnimationFeel(state.animationType, state.duration, state.easing)}.\n`;

    document.getElementById('aiPrompt').textContent = prompt;
}

// Get animation feel description
function getAnimationFeel(type, duration, easing) {
    const speed = duration < 300 ? 'snappy and quick' : duration < 700 ? 'smooth and balanced' : 'slow and deliberate';
    const easingFeel = {
        'ease': 'natural and organic',
        'linear': 'mechanical and consistent',
        'ease-in': 'gradually accelerating',
        'ease-out': 'gradually decelerating',
        'ease-in-out': 'smooth with acceleration at both ends',
        'custom': 'with a custom timing curve'
    };

    return `${speed}, ${easingFeel[easing] || 'with custom easing'}`;
}
