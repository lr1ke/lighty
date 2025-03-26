// 'use client'

// import React, { useEffect, useState } from 'react';

// const StarryBackground: React.FC = () => {
//   const [stars, setStars] = useState<{x: number, y: number, size: number, delay: number}[]>([]);

//   useEffect(() => {
//     const generateStars = () => {
//       const starCount = 200; // Increased for better coverage
//       const newStars = Array.from({length: starCount}, () => ({
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: Math.random() * 2,
//         delay: Math.random() * 3
//       }));
//       setStars(newStars);
//     };

//     generateStars();
//   }, []);

//   return (
//     <div 
//       className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden" 
//       style={{
//         background: 'radial-gradient(ellipse at center, rgba(15,15,35,0.9) 0%, rgba(10,10,25,1) 100%)',
//         backgroundSize: '100% 100%',
//         zIndex: 0
//       }}
//     >
//       {stars.map((star, index) => (
//         <div 
//           key={index} 
//           className="absolute bg-white rounded-full animate-twinkle" 
//           style={{
//             width: `${star.size}px`, 
//             height: `${star.size}px`, 
//             left: `${star.x}%`, 
//             top: `${star.y}%`,
//             animationDelay: `${star.delay}s`
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default StarryBackground;

// 'use client'

// import React from 'react';

// interface StarryBackgroundProps {
//   className?: string;
// }

// const StarryBackground: React.FC<StarryBackgroundProps> = ({ className = '' }) => {
//   const stars = Array.from({length: 50}, (_, index) => ({
//     x: Math.random() * 100,
//     y: Math.random() * 100,
//     size: Math.random() * 3 + 1, // Increased size range from 1 to 4 pixels
//     delay: Math.random() * 2
//   }));

//   return (
//     <div 
//       className={`absolute inset-0 opacity-30 pointer-events-none overflow-hidden rounded-b-lg ${className}`}
//       style={{
//         background: 'radial-gradient(ellipse at center, rgba(15,15,35,0.6) 0%, rgba(10,10,25,0.8) 100%)',
//         zIndex: 0
//       }}
//     >
//       {stars.map((star, index) => (
//         <div 
//           key={index} 
//           className="absolute bg-white/80 rounded-full animate-twinkle" 
//           style={{
//             width: `${star.size}px`, 
//             height: `${star.size}px`, 
//             left: `${star.x}%`, 
//             top: `${star.y}%`,
//             animationDelay: `${star.delay}s`
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default StarryBackground;

'use client'

import React from 'react';

interface StarryBackgroundProps {
  className?: string;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ className = '' }) => {
  const stars = Array.from({length: 50}, (_, index) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2, // Increased size range from 2-6 pixels
    brightness: Math.random() * 0.7 + 0.3,
    delay: Math.random() * 3
  }));

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden rounded-b-lg ${className}`}
      style={{
        zIndex: 0
      }}
    >
      {stars.map((star, index) => (
        <div 
          key={index} 
          className="absolute rounded-full animate-twinkle" 
          style={{
            width: `${star.size}px`, 
            height: `${star.size}px`, 
            left: `${star.x}%`, 
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            backgroundColor: `rgba(255, 255, 255, ${star.brightness})`,
            boxShadow: `0 0 ${star.size * 1.5}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;