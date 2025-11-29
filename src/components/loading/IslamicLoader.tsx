"use client";

import { useEffect } from 'react';

/**
 * IslamicLoader - Simple spinning loader
 * Clean circular spinner with brand colors
 */

export default function IslamicLoader() {
  useEffect(() => {
    // Scroll to top when loader appears
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Brand colors - emerald/green gradient
  const brandColors = [
    '#041613', '#092f2d', '#0a3f3d', '#0a5350', '#0f766e', 
    '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', 
    '#ecfdf5', '#ecfdf5'
  ];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm" 
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 animate-spin-slow" style={{ transformOrigin: 'center' }}>
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 360) / 12;
            const radian = (angle * Math.PI) / 180;
            const radius = 28;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            const color = brandColors[Math.floor((i / 12) * (brandColors.length - 1))];
            
            return (
              <div
                key={i}
                className="absolute"
              style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
              }}
              >
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                  <path
                    d="M5 0C5 0 10 5 10 9C10 13 5 18 5 18C5 18 0 13 0 9C0 5 5 0 5 0Z"
                    fill={color}
                    opacity="0.85"
                  />
                </svg>
              </div>
            );
          })}
          </div>
      </div>
    </div>
  );
}

