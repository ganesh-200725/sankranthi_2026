// Beautiful AI + Modern Elements Background - Elegant Tech Fusion
const canvas = document.getElementById('village-background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// AI Particles (Enhanced Neural Network Style)
const particles = [];
const particleCount = 70;
const connectionDistance = 140;

// Modern Floating Elements
const floatingShapes = [];
const shapeCount = 15;

// Enhanced Particle class with more beautiful effects
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 3 + 1.5;
        this.baseColor = Math.random() > 0.5 ?
            `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 200}, 255, ${Math.random() * 0.4 + 0.4})` :
            `rgba(${Math.random() * 50 + 200}, ${Math.random() * 50 + 150}, ${Math.random() * 50 + 200}, ${Math.random() * 0.4 + 0.4})`;
        this.color = this.baseColor;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        // Bounce off edges with smooth transition
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Create pulsing effect
        const pulseOpacity = 0.3 + Math.sin(this.pulse) * 0.2;
        this.color = this.baseColor.replace(/[\d.]+\)$/,
            pulseOpacity.toFixed(2) + ')');
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add subtle glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color.replace('rgba', 'rgb').replace(/, [\d.]+\)$/, ')');
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Modern Floating Shape class
class FloatingShape {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 20 + 15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.008;
        this.shapeType = Math.floor(Math.random() * 4); // 0: circle, 1: hexagon, 2: diamond, 3: star
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 200}, 0.15)`;
        this.glowColor = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 200}, 0.05)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw shape with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.glowColor;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color.replace('0.15', '0.3');
        ctx.lineWidth = 1;

        switch(this.shapeType) {
            case 0: // Circle
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 1: // Hexagon
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = Math.cos(angle) * this.size;
                    const y = Math.sin(angle) * this.size;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 2: // Diamond
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 3: // Star
                ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5;
                    const radius = i % 2 === 0 ? this.size : this.size * 0.5;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
        }

        ctx.restore();
        ctx.shadowBlur = 0;
    }
}

function initElements() {
    // Initialize enhanced AI particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Initialize modern floating shapes
    for (let i = 0; i < shapeCount; i++) {
        floatingShapes.push(new FloatingShape());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = (1 - (distance / connectionDistance)) * 0.4;
                const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity})`);
                gradient.addColorStop(1, `rgba(255, 100, 150, ${opacity})`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function drawBeautifulBackground() {
    // Create stunning gradient background
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, '#0a0a0f'); // Deep dark center
    gradient.addColorStop(0.3, '#1a1a2e'); // Dark blue
    gradient.addColorStop(0.6, '#16213e'); // Medium blue
    gradient.addColorStop(0.8, '#0f3460'); // Lighter blue
    gradient.addColorStop(1, '#1a1a2e'); // Back to dark

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle overlay gradient for depth
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    overlayGradient.addColorStop(0, 'rgba(0, 212, 255, 0.03)');
    overlayGradient.addColorStop(0.5, 'rgba(255, 100, 150, 0.02)');
    overlayGradient.addColorStop(1, 'rgba(100, 200, 255, 0.03)');

    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    drawBeautifulBackground();

    // Draw modern floating shapes first (background layer)
    floatingShapes.forEach(shape => {
        shape.update();
        shape.draw();
    });

    // Draw AI particles and connections (foreground layer)
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    connectParticles();

    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    floatingShapes.length = 0;
    initElements();
});

// Initialize and start animation
initElements();
animate();