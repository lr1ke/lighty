'use client'

import React, { useEffect, useRef } from 'react';

const StarryBackground: React.FC = () => {
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

    // Create soft stars - with increased visibility but much slower movement
    const stars: { 
      x: number; 
      y: number; 
      size: number; 
      opacity: number;
      twinkleSpeed: number;
    }[] = [];
    
    const starCount = 40;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.3 + 0.15,
        twinkleSpeed: Math.random() * 0.002 + 0.001 // Much slower twinkle
      });
    }

    // Create soft nebula clouds with increased visibility but much slower movement
    const nebulae: { 
      x: number; 
      y: number; 
      width: number;
      height: number;
      color: string;
      opacity: number;
    }[] = [];
    
    const nebulaCount = 5;
    const nebulaColors = ['#E9B44C', '#C84A20', '#E6D6AC', '#C9A648', '#8B3E2F'];
    
    for (let i = 0; i < nebulaCount; i++) {
      nebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 200 + 100,
        height: Math.random() * 150 + 50,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        opacity: Math.random() * 0.12 + 0.08
      });
    }

    // Create soft distant galaxies with increased visibility but much slower movement
    const galaxies: { 
      x: number; 
      y: number; 
      size: number;
      rotation: number;
      color: string;
      opacity: number;
    }[] = [];
    
    const galaxyCount = 3;
    const galaxyColors = ['#E9B44C', '#C84A20', '#E6D6AC'];
    
    for (let i = 0; i < galaxyCount; i++) {
      galaxies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        color: galaxyColors[Math.floor(Math.random() * galaxyColors.length)],
        opacity: Math.random() * 0.15 + 0.1
      });
    }

    // Animation loop - extremely slow time increment for meditation
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.0005; // Extremely slow animation (reduced by 75%)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background - darker for better contrast
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(8, 8, 18, 1)');
      gradient.addColorStop(1, 'rgba(15, 8, 25, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebulae as soft glows with increased visibility but much slower movement
      nebulae.forEach(nebula => {
        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, Math.max(nebula.width, nebula.height) / 2
        );
        
        // Convert opacity to hex with increased visibility
        const opacityHex = Math.floor(nebula.opacity * 255).toString(16).padStart(2, '0');
        
        nebulaGradient.addColorStop(0, `${nebula.color}${opacityHex}`);
        nebulaGradient.addColorStop(1, `${nebula.color}00`); // Transparent at edges
        
        ctx.beginPath();
        ctx.ellipse(
          nebula.x, nebula.y, 
          nebula.width / 2, nebula.height / 2, 
          0, 0, Math.PI * 2
        );
        ctx.fillStyle = nebulaGradient;
        ctx.fill();
        
        // Extremely slowly move nebulae
        nebula.x += Math.sin(time + nebula.y * 0.005) * 0.01; // Much slower movement
        nebula.y += Math.cos(time + nebula.x * 0.005) * 0.01; // Much slower movement
        
        // Keep nebulae within bounds
        if (nebula.x < -nebula.width/2) nebula.x = canvas.width + nebula.width/2;
        if (nebula.x > canvas.width + nebula.width/2) nebula.x = -nebula.width/2;
        if (nebula.y < -nebula.height/2) nebula.y = canvas.height + nebula.height/2;
        if (nebula.y > canvas.height + nebula.height/2) nebula.y = -nebula.height/2;
      });
      
      // Draw galaxies as soft spirals with increased visibility but much slower rotation
      galaxies.forEach(galaxy => {
        ctx.save();
        ctx.translate(galaxy.x, galaxy.y);
        ctx.rotate(galaxy.rotation + time * 0.002); // Much slower rotation
        
        // Convert opacity to hex with increased visibility
        const opacityHex = Math.floor(galaxy.opacity * 255).toString(16).padStart(2, '0');
        const spiralOpacityHex = Math.floor((galaxy.opacity * 0.7) * 255).toString(16).padStart(2, '0');
        
        const galaxyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
        galaxyGradient.addColorStop(0, `${galaxy.color}${opacityHex}`);
        galaxyGradient.addColorStop(1, `${galaxy.color}00`); // Transparent at edges
        
        // Draw a soft ellipse for the galaxy
        ctx.beginPath();
        ctx.ellipse(0, 0, galaxy.size, galaxy.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = galaxyGradient;
        ctx.fill();
        
        // Add a spiral hint with increased visibility
        ctx.beginPath();
        ctx.arc(0, 0, galaxy.size * 0.7, 0, Math.PI * 1.5);
        ctx.strokeStyle = `${galaxy.color}${spiralOpacityHex}`;
        ctx.lineWidth = galaxy.size / 15;
        ctx.stroke();
        
        ctx.restore();
      });
      
      // Draw stars with increased visibility but much slower twinkle and movement
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 10) * 0.2 + 0.8; // Reduced twinkle range for more stability
        
        const starGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size
        );
        
        // Increased brightness at the center
        starGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * twinkle * 2})`);
        starGradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * twinkle})`);
        starGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = starGradient;
        ctx.fill();
        
        // Extremely slightly move stars
        star.x += Math.sin(time + star.y * 0.005) * 0.005; // Much slower movement
        star.y += Math.cos(time + star.x * 0.005) * 0.005; // Much slower movement
        
        // Keep stars within bounds
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
      
      // Add a few brighter stars for better visibility - these are fixed in place for stability
      for (let i = 0; i < 10; i++) {
        // Use deterministic positions based on time for very slow drift
        const angle = (Math.PI * 2 / 10) * i + time * 0.001;
        const distance = canvas.height * 0.3 + Math.sin(time * 0.0003 + i) * canvas.height * 0.1;
        
        const x = canvas.width / 2 + Math.cos(angle) * distance;
        const y = canvas.height / 2 + Math.sin(angle) * distance;
        const size = 2 + Math.sin(time * 0.0007 + i * 0.5) * 0.5;
        
        const brightStarGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        brightStarGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        brightStarGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        brightStarGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = brightStarGradient;
        ctx.fill();
      }
      
      // Very rarely add a shooting star - much less frequent for meditation
      if (Math.random() < 0.0003) { // Reduced frequency by 70%
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * (canvas.height / 3);
        const length = Math.random() * 100 + 50;
        const angle = Math.PI / 4 + Math.random() * (Math.PI / 4); // Downward angle
        
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
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
      style={{ opacity: 0.7, filter: 'blur(2px)' }}
    />
  );
};

export default StarryBackground;