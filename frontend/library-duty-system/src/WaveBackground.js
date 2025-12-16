import { useEffect, useRef } from 'react';

const WaveBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const extraWidth = 100;

    // Store dimensions in refs that can be updated
    let width = window.innerWidth;
    let height = window.innerHeight * 0.5;
    let particles = [];
    let waveRibbons = [];

    // Initialize canvas size
    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight * 0.5;
      canvas.width = width + extraWidth * 2;
      canvas.height = height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(extraWidth, 0);
    };

    // Particle class with wave motion
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.life = Math.random() * 100;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.life += 0.5;
        this.y += Math.sin(this.x * 0.01 + this.life * 0.02) * 0.3;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Flowing ribbon wave class
    class WaveRibbon {
      constructor(baseYRatio, amplitude, speed, opacity, slope, thickness) {
        this.baseYRatio = baseYRatio; // Store as ratio for responsive
        this.amplitude = amplitude;
        this.speed = speed;
        this.opacity = opacity;
        this.slopeBase = slope;
        this.thickness = thickness;
        this.offset = Math.random() * Math.PI * 2;
        this.secondaryOffset = Math.random() * Math.PI;
      }

      update() {
        this.offset += this.speed;
        this.secondaryOffset += this.speed * 0.7;
      }

      draw() {
        const baseY = height * this.baseYRatio;
        const slope = this.slopeBase;
        const topPath = [];
        const bottomPath = [];

        for (let x = -200; x <= width + 200; x += 3) {
          const angleOffset = (x - width / 2) * slope;
          const primaryWave = Math.sin(x * 0.008 + this.offset) * this.amplitude;
          const secondaryWave = Math.sin(x * 0.015 - this.secondaryOffset) * (this.amplitude * 0.4);
          const tertiaryWave = Math.cos(x * 0.012 + this.offset * 0.8) * (this.amplitude * 0.25);

          const centerY = baseY + angleOffset + primaryWave + secondaryWave + tertiaryWave;

          topPath.push({ x, y: centerY - this.thickness / 2 });
          bottomPath.push({ x, y: centerY + this.thickness / 2 });
        }

        const gradient = ctx.createLinearGradient(0, baseY - this.thickness, 0, baseY + this.thickness);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.25})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.95})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity * 0.25})`);

        ctx.save();
        ctx.beginPath();
        topPath.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        bottomPath.reverse().forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();

        ctx.shadowBlur = 35;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.55})`;
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.shadowBlur = 20;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.75})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        topPath.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        ctx.restore();
      }
    }

    // Create particles - count based on screen size
    const createParticles = () => {
      particles = [];
      // More particles for larger screens (1 particle per 10000 pixels, min 50, max 200)
      const particleCount = Math.min(200, Math.max(50, Math.floor((width * height) / 10000)));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Create wave ribbons with responsive ratios
    const createWaveRibbons = () => {
      waveRibbons = [];
      const ribbonCount = 3;
      const baseSlope = -0.15;
      for (let i = 0; i < ribbonCount; i++) {
        waveRibbons.push(new WaveRibbon(
          0.55 + (i - 1) * 0.08,  // baseY as ratio - more concentrated
          20 + i * 6,             // amplitude
          0.008 + i * 0.005,      // speed
          0.28 - i * 0.05,        // opacity
          baseSlope - i * 0.018,  // slope
          60 + i * 18             // thickness
        ));
      }
    };

    // Draw connections
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(-extraWidth, 0, width + extraWidth * 2, height);

      waveRibbons.forEach(ribbon => {
        ribbon.update();
        ribbon.draw();
      });

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      drawConnections();

      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const oldWidth = width;
        const oldHeight = height;
        initCanvas();
        
        // Scale particles proportionally to new dimensions
        particles.forEach(p => {
          // Scale position proportionally
          p.x = (p.x / oldWidth) * width;
          p.y = (p.y / oldHeight) * height;
          
          // Add some randomness to fill gaps on larger screens
          if (width > oldWidth) {
            p.x += (Math.random() - 0.5) * (width - oldWidth) * 0.5;
          }
          if (height > oldHeight) {
            p.y += (Math.random() - 0.5) * (height - oldHeight) * 0.5;
          }
          
          // Keep within bounds
          p.x = Math.max(0, Math.min(p.x, width));
          p.y = Math.max(0, Math.min(p.y, height));
        });

        // Add extra particles if screen got much bigger
        const targetCount = Math.floor((width * height) / 10000);
        while (particles.length < targetCount && particles.length < 200) {
          particles.push(new Particle());
        }
      }, 100);
    };

    // Initialize
    initCanvas();
    createParticles();
    createWaveRibbons();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '-100px',
        width: 'calc(100% + 200px)',
        height: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default WaveBackground;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
