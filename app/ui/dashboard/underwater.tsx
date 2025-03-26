'use client'

import React from 'react';

const UnderwaterBackground: React.FC = () => {
  const bubbles = Array.from({length: 150}, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3,
    delay: Math.random() * 2,
    duration: Math.random() * 5 + 3
  }));

  return (
    <div 
      className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden" 
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0,50,80,0.6), rgba(0,15,30,0.9))',
        backgroundSize: '100% 100%',
        zIndex: 0,
        filter: 'blur(1px)'
      }}
    >
      {bubbles.map((bubble, i) => (
        <div 
          key={i} 
          className="absolute bg-teal-500 rounded-full opacity-10 animate-float" 
          style={{
            width: `${bubble.size}px`, 
            height: `${bubble.size}px`, 
            left: `${bubble.x}%`, 
            top: `${bubble.y}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`
          }}
        />
      ))}
    </div>
  );
};

export default UnderwaterBackground;