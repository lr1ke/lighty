'use client'

import React, { useEffect, useRef } from 'react';

const UnderwaterBackground: React.FC = () => {
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

    // Create soft bubbles - fewer and larger
    const bubbles: { 
      x: number; 
      y: number; 
      size: number; 
      speed: number;
      opacity: number;
    }[] = [];
    
    const bubbleCount = 15; // Reduced from 20
    
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 3, // Larger size for softer appearance
        speed: Math.random() * 0.3 + 0.1, // Slower speed
        opacity: Math.random() * 0.15 + 0.05 // More subtle
      });
    }

    // Create underwater glows - fewer and larger
    const glows: { 
      x: number; 
      y: number; 
      size: number; 
      color: string;
      speed: number;
      angle: number;
    }[] = [];
    
    const glowCount = 10; // Reduced from 15
    const glowColors = ['#8ED6FF', '#00A3E0', '#0077B6', '#48CAE4'];
    
    for (let i = 0; i < glowCount; i++) {
      glows.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 5, // Much larger for softer glow
        color: glowColors[Math.floor(Math.random() * glowColors.length)],
        speed: Math.random() * 0.15 + 0.05, // Slower speed
        angle: Math.random() * Math.PI * 2
      });
    }

    // Create soft light rays - fewer and wider
    const rays: { 
      x: number; 
      width: number; 
      speed: number;
      opacity: number;
    }[] = [];
    
    const rayCount = 3; // Same as before
    
    for (let i = 0; i < rayCount; i++) {
      rays.push({
        x: Math.random() * canvas.width,
        width: Math.random() * 150 + 100, // Wider rays
        speed: Math.random() * 0.08 + 0.02, // Slower speed
        opacity: Math.random() * 0.06 + 0.02 // More subtle
      });
    }

    // Animation loop - slower time increment
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.003; // Even slower animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 50, 80, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 15, 30, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw soft light rays
      rays.forEach(ray => {
        const rayGradient = ctx.createLinearGradient(ray.x, 0, ray.x + ray.width, 0);
        rayGradient.addColorStop(0, `rgba(173, 216, 230, 0)`);
        rayGradient.addColorStop(0.5, `rgba(173, 216, 230, ${ray.opacity})`);
        rayGradient.addColorStop(1, `rgba(173, 216, 230, 0)`);
        
        ctx.fillStyle = rayGradient;
        ctx.fillRect(ray.x, 0, ray.width, canvas.height);
        
        // Move rays very slowly
        ray.x += ray.speed;
        
        // Reset rays that go off screen
        if (ray.x > canvas.width) {
          ray.x = -ray.width;
          ray.width = Math.random() * 150 + 100;
          ray.opacity = Math.random() * 0.06 + 0.02;
        }
      });
      
      // Draw underwater glows
      glows.forEach(glow => {
        const glowGradient = ctx.createRadialGradient(
          glow.x, glow.y, 0,
          glow.x, glow.y, glow.size
        );
        
        glowGradient.addColorStop(0, `${glow.color}20`); // Very subtle at center
        glowGradient.addColorStop(1, `${glow.color}00`); // Transparent at edges
        
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.size, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        // Move glows very slowly
        glow.x += Math.cos(glow.angle) * glow.speed;
        glow.y += Math.sin(glow.angle) * glow.speed;
        
        // Slightly change direction - very subtle
        glow.angle += (Math.random() - 0.5) * 0.03;
        
        // Keep glows within bounds
        if (glow.x < 0) glow.x = canvas.width;
        if (glow.x > canvas.width) glow.x = 0;
        if (glow.y < 0) glow.y = canvas.height;
        if (glow.y > canvas.height) glow.y = 0;
      });
      
      // Draw soft bubbles
      bubbles.forEach(bubble => {
        // Create a soft, glowing bubble
        const bubbleGradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, bubble.size
        );
        
        bubbleGradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 1.5})`);
        bubbleGradient.addColorStop(0.6, `rgba(255, 255, 255, ${bubble.opacity})`);
        bubbleGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = bubbleGradient;
        ctx.fill();
        
        // Move bubbles upward with very slight wobble
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(time + bubble.y * 0.03) * 0.15;
        
        // Reset bubbles that go off screen
        if (bubble.y < -bubble.size) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
          bubble.size = Math.random() * 8 + 3;
          bubble.speed = Math.random() * 0.3 + 0.1;
        }
      });
      
      // Occasionally add a soft seaweed glow - very infrequent
      if (Math.random() < 0.001) {
        const seaweedX = Math.random() * canvas.width;
        const seaweedHeight = Math.random() * 70 + 50;
        const seaweedWidth = Math.random() * 30 + 20;
        
        // Create a soft, glowing seaweed shape
        const seaweedGradient = ctx.createRadialGradient(
          seaweedX, canvas.height - seaweedHeight/2, 0,
          seaweedX, canvas.height - seaweedHeight/2, seaweedHeight/2
        );
        
        seaweedGradient.addColorStop(0, 'rgba(0, 128, 0, 0.1)');
        seaweedGradient.addColorStop(1, 'rgba(0, 128, 0, 0)');
        
        ctx.beginPath();
        ctx.ellipse(seaweedX, canvas.height - seaweedHeight/2, seaweedWidth/2, seaweedHeight/2, 0, 0, Math.PI * 2);
        ctx.fillStyle = seaweedGradient;
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
      style={{ opacity: 0.5, filter: 'blur(3px)' }} // Added blur filter and reduced opacity
    />
  );
};

export default UnderwaterBackground;