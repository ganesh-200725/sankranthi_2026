import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    hue: number;
    alpha: number;
    pulseSpeed: number;
}

interface GradientOrb {
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
    hue: number;
    initialX: number;
    initialY: number;
}

export function AIBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const orbsRef = useRef<GradientOrb[]>([]);
    const animationFrameRef = useRef<number>();
    const timeRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const particleCount = 60; // Reduced for cleaner look
        const orbCount = 3;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
            initOrbs();
        };

        const createParticle = (): Particle => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 1,
            hue: Math.random() * 40 + 260, // Violet/Purple range (260-300)
            alpha: Math.random() * 0.3 + 0.15,
            pulseSpeed: Math.random() * 0.02 + 0.01,
        });

        // Re-creating createParticle to use proper alpha
        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(createParticle());
            }
        };

        const createOrb = (): GradientOrb => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            return {
                x,
                y,
                initialX: x,
                initialY: y,
                radius: Math.random() * 400 + 300,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                hue: Math.random() * 40 + 260, // Violet/Purple hue
            };
        };

        const initOrbs = () => {
            orbsRef.current = [];
            for (let i = 0; i < orbCount; i++) {
                orbsRef.current.push(createOrb());
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) - 0.5,
                y: (e.clientY / window.innerHeight) - 0.5,
            };
        };

        const drawGradientMesh = (time: number) => {
            // Clear canvas to keep it transparent so CSS background shows
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Subtle animated orbs in background
            orbsRef.current.forEach((orb) => {
                orb.initialX += orb.vx;
                orb.initialY += orb.vy;

                orb.x = orb.initialX + mouseRef.current.x * 80;
                orb.y = orb.initialY + mouseRef.current.y * 80;

                if (orb.initialX < -orb.radius) orb.vx *= -1;
                if (orb.initialX > canvas.width + orb.radius) orb.vx *= -1;
                if (orb.initialY < -orb.radius) orb.vy *= -1;
                if (orb.initialY > canvas.height + orb.radius) orb.vy *= -1;

                const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
                gradient.addColorStop(0, `hsla(${orb.hue}, 70%, 50%, 0.04)`);
                gradient.addColorStop(0.5, `hsla(${orb.hue}, 60%, 40%, 0.02)`);
                gradient.addColorStop(1, `hsla(${orb.hue}, 50%, 30%, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });

            ctx.strokeStyle = `hsla(270, 90%, 65%, 0.06)`; // Violet lines
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                const waveOffset = time * 0.0008 + i * Math.PI / 1.5;
                const parallaxX = mouseRef.current.x * (30 + i * 30);
                const parallaxY = mouseRef.current.y * (15 + i * 15);

                for (let x = -100; x <= canvas.width + 100; x += 20) {
                    const y = canvas.height / 1.8 +
                        Math.sin(x * 0.002 + waveOffset) * 70 +
                        Math.sin(x * 0.0015 + waveOffset * 0.8) * 50 +
                        (i * 120) + parallaxY;
                    if (x === -100) {
                        ctx.moveTo(x + parallaxX, y);
                    } else {
                        ctx.lineTo(x + parallaxX, y);
                    }
                }
                ctx.stroke();
            }
        };

        const updateParticle = (particle: Particle, time: number) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < -20) particle.x = canvas.width + 20;
            if (particle.x > canvas.width + 20) particle.x = -20;
            if (particle.y < -20) particle.y = canvas.height + 20;
            if (particle.y > canvas.height + 20) particle.y = -20;

            particle.alpha = 0.3 + Math.sin(time * particle.pulseSpeed) * 0.5;
        };

        const drawParticle = (particle: Particle) => {
            const px = mouseRef.current.x * 40;
            const py = mouseRef.current.y * 40;

            const drawX = particle.x + px;
            const drawY = particle.y + py;

            ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            ctx.beginPath();
            ctx.arc(drawX, drawY, particle.size, 0, Math.PI * 2);
            ctx.fill();

            const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, particle.size * 6);
            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 65%, ${particle.alpha * 0.5})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 55%, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(drawX, drawY, particle.size * 6, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawConnectionLines = () => {
            const particles = particlesRef.current;
            const maxDistance = 150;
            const px = mouseRef.current.x * 40;
            const py = mouseRef.current.y * 40;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x + px, particles[i].y + py);
                        ctx.lineTo(particles[j].x + px, particles[j].y + py);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            timeRef.current += 1;
            drawGradientMesh(timeRef.current);
            drawConnectionLines();

            particlesRef.current.forEach((particle) => {
                updateParticle(particle, timeRef.current);
                drawParticle(particle);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="ai-background"
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
