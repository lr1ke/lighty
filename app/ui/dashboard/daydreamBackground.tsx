'use client';

import React, { useEffect, useRef } from 'react';

const DaydreamBackground: React.FC = () => {
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

    // Create floating bubbles
    const bubbles: { x: number; y: number; radius: number; color: string; speed: number; opacity: number }[] = [];
    const bubbleCount = 8;
    
    const colors = ['#5CE8D6', '#FF6B91', '#A2EEFF', '#E87FBC', '#7BE0D6'];

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.2 + 0.1
      });
    }

    // Create light rays
    const rays: { x: number; width: number; speed: number; opacity: number }[] = [];
    const rayCount = 5;
    
    for (let i = 0; i < rayCount; i++) {
      rays.push({
        x: Math.random() * canvas.width,
        width: Math.random() * 100 + 50,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.1 + 0.05
      });
    }

    // Animation loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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
          ray.opacity = Math.random() * 0.1 + 0.05;
        }
      });
      
      // Draw bubbles with soft gradient
      bubbles.forEach(bubble => {
        const gradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, bubble.radius
        );
        
        // Get color without # and convert to RGB
        const hexToRgb = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return { r, g, b };
        };
        
        const rgb = hexToRgb(bubble.color);
        
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bubble.opacity})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Move bubbles
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(time + bubble.y * 0.05) * 0.5;
        
        // Reset bubbles that go off screen
        if (bubble.y < -bubble.radius) {
          bubble.y = canvas.height + bubble.radius;
          bubble.x = Math.random() * canvas.width;
          bubble.radius = Math.random() * 30 + 10;
        }
      });
      
      // Occasionally draw a small cloud
      if (Math.random() < 0.005) {
        const cloudX = Math.random() * canvas.width;
        const cloudY = Math.random() * (canvas.height / 2);
        const cloudSize = Math.random() * 30 + 20;
        
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
        ctx.arc(cloudX + cloudSize * 0.6, cloudY - cloudSize * 0.2, cloudSize * 0.7, 0, Math.PI * 2);
        ctx.arc(cloudX - cloudSize * 0.6, cloudY - cloudSize * 0.1, cloudSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
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
      style={{ opacity: 0.7 }}
    />
  );
};

export default DaydreamBackground;