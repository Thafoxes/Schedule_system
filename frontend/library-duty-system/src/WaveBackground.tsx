import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  size: number;
  life: number;
  opacity: number;
  reset(): void;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface WaveRibbon {
  baseYRatio: number;
  amplitude: number;
  speed: number;
  opacity: number;
  slopeBase: number;
  thickness: number;
  offset: number;
  secondaryOffset: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;
}


const WaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const extraWidth = 100;

    // Store dimensions in refs that can be updated
    let width = window.innerWidth;
    let height = window.innerHeight * 0.5;
    let particles: Particle[] = [];
    let waveRibbons: WaveRibbon[] = [];

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
    class ParticleClass implements Particle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      size: number = 0;
      life: number = 0;
      opacity: number = 0;

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

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Flowing ribbon wave class
    class WaveRibbonClass implements WaveRibbon {
      baseYRatio: number;
      amplitude: number;
      speed: number;
      opacity: number;
      slopeBase: number;
      thickness: number;
      offset: number;
      secondaryOffset: number;

      constructor(baseYRatio: number, amplitude: number, speed: number, opacity: number, slope: number, thickness: number) {
        this.baseYRatio = baseYRatio;
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

      draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        const baseY = height * this.baseYRatio;
        const slope = this.slopeBase;
        const topPath: { x: number; y: number }[] = [];
        const bottomPath: { x: number; y: number }[] = [];

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
      const particleCount = Math.min(200, Math.max(50, Math.floor((width * height) / 10000)));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new ParticleClass());
      }
    };

    // Create wave ribbons with responsive ratios
    const createWaveRibbons = () => {
      waveRibbons = [];
      const ribbonCount = 3;
      const baseSlope = -0.15;
      for (let i = 0; i < ribbonCount; i++) {
        waveRibbons.push(new WaveRibbonClass(
          0.55 + (i - 1) * 0.08,
          20 + i * 6,
          0.008 + i * 0.005,
          0.28 - i * 0.05,
          baseSlope - i * 0.018,
          60 + i * 18
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
        ribbon.draw(ctx, width, height);
      });

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      drawConnections();

      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const oldWidth = width;
        const oldHeight = height;
        initCanvas();
        
        particles.forEach(p => {
          p.x = (p.x / oldWidth) * width;
          p.y = (p.y / oldHeight) * height;
          
          if (width > oldWidth) {
            p.x += (Math.random() - 0.5) * (width - oldWidth) * 0.5;
          }
          if (height > oldHeight) {
            p.y += (Math.random() - 0.5) * (height - oldHeight) * 0.5;
          }
          
          p.x = Math.max(0, Math.min(p.x, width));
          p.y = Math.max(0, Math.min(p.y, height));
        });

        const targetCount = Math.floor((width * height) / 10000);
        while (particles.length < targetCount && particles.length < 200) {
          particles.push(new ParticleClass());
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

