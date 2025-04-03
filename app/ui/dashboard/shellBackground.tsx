'use client';

import React, { useEffect, useRef } from 'react';

const ShellBackground: React.FC = () => {
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

    // Create soft shell shapes - fewer shells
    const shells: { 
      x: number; 
      y: number; 
      size: number; 
      rotation: number; 
      color: string; 
      type: number;
      opacity: number;
    }[] = [];
    
    const shellCount = 6; // Reduced from 8
    const shellColors = ['#E9B44C', '#C84A20', '#E6D6AC', '#C9A648', '#8B3E2F', '#D98E73'];
    
    for (let i = 0; i < shellCount; i++) {
      shells.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10, // Larger size for softer appearance
        rotation: Math.random() * Math.PI * 2,
        color: shellColors[Math.floor(Math.random() * shellColors.length)],
        type: Math.floor(Math.random() * 3), // 0: soft blob, 1: oval, 2: circular
        opacity: Math.random() * 0.15 + 0.05 // More subtle
      });
    }

    // Create sand particles - softer and more blurred
    const sandParticles: { 
      x: number; 
      y: number; 
      size: number; 
      color: string;
    }[] = [];
    
    const particleCount = 40; // Reduced from 60
    const sandColors = ['#E6D6AC', '#D9C89C', '#C9B88C', '#E9B44C'];
    
    for (let i = 0; i < particleCount; i++) {
      sandParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1, // Larger size for softer appearance
        color: sandColors[Math.floor(Math.random() * sandColors.length)]
      });
    }

    // Animation loop - slower time increment
    let animationFrameId: number;
    let time = 0;

    // Draw soft blob instead of spiral
    const drawSoftBlob = (x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Create a soft, blob-like shape
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`); // Fully transparent at the edges
      
      ctx.beginPath();
      // Draw a slightly irregular circle for organic feel
      const points = 8;
      const irregularity = 0.2; // How irregular the shape is
      
      for (let i = 0; i <= points; i++) {
        const angle = (Math.PI * 2 / points) * i;
        const radius = size * (1 + Math.sin(angle * 3) * irregularity);
        const pointX = radius * Math.cos(angle);
        const pointY = radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    };
    
    // Draw soft oval instead of clam
    const drawSoftOval = (x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Create a soft, oval gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
      gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`); // Fully transparent at the edges
      
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.5, size, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    };
    
    // Draw soft circle instead of nautilus
    const drawSoftCircle = (x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Create a soft, circular gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`); // Fully transparent at the edges
      
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add a subtle swirl hint
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.6, 0, Math.PI * 1.5);
      ctx.strokeStyle = `${color}${Math.floor((opacity * 0.3) * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = size / 10;
      ctx.stroke();
      
      ctx.restore();
    };

    const animate = () => {
      time += 0.004; // Even slower animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply a slight blur effect to the entire canvas
      // Note: This is commented out because it can affect performance
      // ctx.filter = 'blur(1px)';
      
      // Draw sand particles as soft glows
      sandParticles.forEach(particle => {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        
        gradient.addColorStop(0, `${particle.color}20`); // Very subtle at center
        gradient.addColorStop(1, `${particle.color}00`); // Transparent at edges
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Slightly move particles for a shimmering effect - very subtle
        particle.x += Math.sin(time + particle.y * 0.03) * 0.08;
        particle.y += Math.cos(time + particle.x * 0.03) * 0.08;
        
        // Keep particles within bounds
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Draw shells as soft shapes
      shells.forEach(shell => {
        // Draw different shell types as soft shapes
        if (shell.type === 0) {
          drawSoftBlob(shell.x, shell.y, shell.size, shell.rotation + time * 0.03, shell.color, shell.opacity);
        } else if (shell.type === 1) {
          drawSoftOval(shell.x, shell.y, shell.size, shell.rotation, shell.color, shell.opacity);
        } else {
          drawSoftCircle(shell.x, shell.y, shell.size, shell.rotation + time * 0.01, shell.color, shell.opacity);
        }
        
        // Very slowly move shells
        shell.x += Math.sin(time + shell.y * 0.02) * 0.08;
        shell.y += Math.cos(time + shell.x * 0.02) * 0.08;
        
        // Keep shells within bounds
        if (shell.x < 0) shell.x = canvas.width;
        if (shell.x > canvas.width) shell.x = 0;
        if (shell.y < 0) shell.y = canvas.height;
        if (shell.y > canvas.height) shell.y = 0;
      });
      
      // Occasionally add a new soft shape - very infrequent
      if (Math.random() < 0.001 && shells.length < 10) {
        shells.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 10,
          rotation: Math.random() * Math.PI * 2,
          color: shellColors[Math.floor(Math.random() * shellColors.length)],
          type: Math.floor(Math.random() * 3),
          opacity: Math.random() * 0.15 + 0.05
        });
      }
      
      // Reset the filter
      // ctx.filter = 'none';
      
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
      style={{ opacity: 0.5, filter: 'blur(2px)' }} // Added blur filter and reduced opacity
    />
  );
};

export default ShellBackground;