'use client';

import React, { useEffect, useRef } from 'react';

const DreamyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create floating orbs - fewer orbs
    const orbs: { 
      x: number; 
      y: number; 
      radius: number; 
      color: string; 
      speed: number; 
      opacity: number 
    }[] = [];
    
    const orbCount = 6; // Reduced from original
    const colors = ['#5CE8D6', '#FF6B91', '#A2EEFF', '#E87FBC'];
    
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.2 + 0.1, // Slower speed
        opacity: Math.random() * 0.15 + 0.05 // More subtle
      });
    }

    // Create stars - fewer stars
    const stars: { 
      x: number; 
      y: number; 
      size: number; 
      opacity: number;
      twinkleSpeed: number;
    }[] = [];
    
    const starCount = 40; // Reduced from original
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.01 + 0.005 // Slower twinkle
      });
    }

    // Create light rays - fewer rays
    const rays: { 
      x: number; 
      width: number; 
      speed: number; 
      opacity: number 
    }[] = [];
    
    const rayCount = 3; // Reduced from original
    
    for (let i = 0; i < rayCount; i++) {
      rays.push({
        x: Math.random() * canvas.width,
        width: Math.random() * 100 + 50,
        speed: Math.random() * 0.1 + 0.05, // Slower speed
        opacity: Math.random() * 0.08 + 0.02 // More subtle
      });
    }

    // Animation loop - slower time increment
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.005; // Reduced for slower animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, 'rgba(26, 26, 46, 1)');
      bgGradient.addColorStop(1, 'rgba(20, 20, 35, 1)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars with subtle twinkling
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 10) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });
      
      // Draw light rays
      rays.forEach(ray => {
        const gradient = ctx.createLinearGradient(ray.x, 0, ray.x + ray.width, 0);
        gradient.addColorStop(0, `rgba(92, 232, 214, 0)`);
        gradient.addColorStop(0.5, `rgba(92, 232, 214, ${ray.opacity})`);
        gradient.addColorStop(1, `rgba(92, 232, 214, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(ray.x, 0, ray.width, canvas.height);
        
        // Move rays
        ray.x += ray.speed;
        
        // Reset rays that go off screen
        if (ray.x > canvas.width) {
          ray.x = -ray.width;
          ray.width = Math.random() * 100 + 50;
          ray.opacity = Math.random() * 0.08 + 0.02;
        }
      });
      
      // Draw orbs with soft gradient
      orbs.forEach(orb => {
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        
        // Get color without # and convert to RGB
        const hexToRgb = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return { r, g, b };
        };
        
        const rgb = hexToRgb(orb.color);
        
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${orb.opacity})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Move orbs - more subtle movement
        orb.y -= orb.speed;
        orb.x += Math.sin(time + orb.y * 0.03) * 0.3; // Reduced wobble
        
        // Reset orbs that go off screen
        if (orb.y < -orb.radius) {
          orb.y = canvas.height + orb.radius;
          orb.x = Math.random() * canvas.width;
          orb.radius = Math.random() * 30 + 15;
          orb.color = colors[Math.floor(Math.random() * colors.length)];
        }
      });
      
      // Occasionally draw classical architecture silhouettes - less frequent
      if (Math.random() < 0.001) { // Reduced frequency
        const columnX = Math.random() * canvas.width;
        const columnHeight = Math.random() * 100 + 50;
        const columnWidth = 10;
        
        // Draw column
        ctx.beginPath();
        ctx.rect(columnX, canvas.height - columnHeight, columnWidth, columnHeight);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // More subtle
        ctx.fill();
        
        // Draw column capital
        ctx.beginPath();
        ctx.rect(columnX - 5, canvas.height - columnHeight - 10, columnWidth + 10, 10);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // More subtle
        ctx.fill();
        
        // Draw column base
        ctx.beginPath();
        ctx.rect(columnX - 5, canvas.height - 10, columnWidth + 10, 10);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // More subtle
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }} // Slightly reduced opacity
    />
  );
};

export default DreamyBackground;