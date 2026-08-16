import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Compass, Mountain, Sparkles } from 'lucide-react';

interface TunnelTransitionProps {
  active: boolean;
  onComplete: () => void;
}

export const TunnelTransition: React.FC<TunnelTransitionProps> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const portalGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1. Swirling Emerald & Golden Energy Strands
    const numStrands = 140;
    const strands: Array<{
      angle: number;
      radius: number;
      speed: number;
      angularSpeed: number;
      length: number;
      color: string;
      width: number;
    }> = [];

    const strandColors = ['#10b981', '#34d399', '#059669', '#dfb15b', '#e5c07b', '#f5f1e8', '#22c55e'];

    for (let i = 0; i < numStrands; i++) {
      strands.push({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * (Math.max(width, height) * 0.7),
        speed: 3 + Math.random() * 9,
        angularSpeed: (0.015 + Math.random() * 0.035) * (Math.random() > 0.5 ? 1 : -1),
        length: 20 + Math.random() * 70,
        color: strandColors[Math.floor(Math.random() * strandColors.length)],
        width: 1 + Math.random() * 2.2,
      });
    }

    // 2. Glowing Forest Spores & Floating Dust Particles
    const numSpores = 90;
    const spores: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    for (let i = 0; i < numSpores; i++) {
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: -0.8 - Math.random() * 2.5,
        size: 1 + Math.random() * 2.8,
        alpha: 0.2 + Math.random() * 0.8,
        color: Math.random() > 0.4 ? '#dfb15b' : '#34d399',
      });
    }

    // 3. Wind-blown Leaves & Pine Needles Swirling in Vortex
    const numLeaves = 35;
    const leaves: Array<{
      angle: number;
      radius: number;
      speed: number;
      rotation: number;
      rotSpeed: number;
      size: number;
      color: string;
    }> = [];

    const leafColors = ['#2d5a3f', '#3b6b4e', '#dfb15b', '#c59b27', '#4a7c59'];

    for (let i = 0; i < numLeaves; i++) {
      leaves.push({
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * (Math.max(width, height) * 0.6),
        speed: 2 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.04 + Math.random() * 0.08,
        size: 5 + Math.random() * 9,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
      });
    }

    const startTime = Date.now();
    const duration = 2500; // 2.5s duration

    const render = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Deep forest background with subtle motion blur trail
      ctx.fillStyle = 'rgba(7, 14, 10, 0.28)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Sunbeams / Mountain Light Rays radiating from center
      const numRays = 12;
      ctx.save();
      for (let r = 0; r < numRays; r++) {
        const rayAngle = (r * (Math.PI * 2) / numRays) + elapsed * 0.0003;
        const rayLength = Math.max(width, height) * 0.9;
        const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, rayLength);
        grad.addColorStop(0, `rgba(223, 177, 91, ${0.18 * (1 + progress)})`);
        grad.addColorStop(0.5, `rgba(52, 211, 153, ${0.08 * (1 + progress)})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, rayLength, rayAngle - 0.12, rayAngle + 0.12);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // Render Energy Strands (Spiral Warp)
      strands.forEach((s) => {
        s.angle += s.angularSpeed * (1 + progress * 2.5);
        s.radius -= s.speed * (1 + progress * 3.5);

        if (s.radius < 15) {
          s.radius = Math.max(width, height) * 0.75;
          s.angle = Math.random() * Math.PI * 2;
        }

        const x1 = centerX + Math.cos(s.angle) * s.radius;
        const y1 = centerY + Math.sin(s.angle) * s.radius;
        const tailAngle = s.angle - s.angularSpeed * 3;
        const tailRadius = s.radius + s.length * (1 + progress * 1.5);
        const x2 = centerX + Math.cos(tailAngle) * tailRadius;
        const y2 = centerY + Math.sin(tailAngle) * tailRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width * (1 + progress);
        ctx.shadowBlur = 10 * (1 + progress);
        ctx.shadowColor = s.color;
        ctx.stroke();
      });

      // Render Swirling Forest Leaves
      leaves.forEach((l) => {
        l.angle += 0.025 * (1 + progress * 2);
        l.radius -= l.speed * (1 + progress * 2);
        l.rotation += l.rotSpeed;

        if (l.radius < 20) {
          l.radius = Math.max(width, height) * 0.65;
        }

        const lx = centerX + Math.cos(l.angle) * l.radius;
        const ly = centerY + Math.sin(l.angle) * l.radius;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(l.rotation);
        ctx.beginPath();
        // Leaf shape (almond curve)
        ctx.ellipse(0, 0, l.size, l.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = l.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
        ctx.fill();
        ctx.restore();
      });

      // Render Glowing Forest Spores & Dust
      spores.forEach((p) => {
        p.x += p.vx * (1 + progress);
        p.y += p.vy * (1 + progress);

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    // GSAP Portal Entrance Bloom & Seamless Dismissal
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    });

    if (portalGlowRef.current) {
      gsap.fromTo(
        portalGlowRef.current,
        { scale: 0.8, opacity: 0.5 },
        { scale: 1.4, opacity: 1, duration: 2.2, ease: 'power2.inOut' }
      );
    }

    const timer = setTimeout(() => {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        },
      });
    }, duration);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070e0a] pointer-events-auto"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Central Nature Journey Portal Glow */}
      <div
        ref={portalGlowRef}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <div className="relative flex items-center justify-center">
          {/* Swirling Portal Ring Glow */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#dfb15b] via-emerald-400 to-[#10b981] blur-2xl animate-pulse opacity-80" />
          <div className="absolute w-20 h-20 rounded-full border-2 border-[#dfb15b]/60 animate-spin" />
          <Mountain className="absolute w-8 h-8 text-[#fffdfa] drop-shadow-[0_0_12px_#34d399]" />
        </div>

        <p className="mt-8 text-xl sm:text-2xl font-bold tracking-widest text-[#fffdfa] uppercase font-mono drop-shadow-[0_0_25px_rgba(223,177,91,0.85)]">
          Entering Mountain Journey Grid...
        </p>
        <span className="text-xs text-emerald-300/90 font-mono mt-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>Synchronizing Alpine Sentinel & OSM Telemetry</span>
        </span>
      </div>
    </div>
  );
};
