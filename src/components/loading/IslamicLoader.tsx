"use client";

import { useEffect } from 'react';

/**
 * IslamicLoader - Beautiful Islamic sound wave pattern
 * Elegant wave design inspired by Islamic geometric patterns
 */

export default function IslamicLoader() {
  useEffect(() => {
    // Scroll to top when loader appears
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center space-x-2.5">
        {/* Beautiful white sound wave pattern - Elegant and clean */}
        {[
          { id: 'wave-1', height: 20, delay: 0 },
          { id: 'wave-2', height: 36, delay: 100 },
          { id: 'wave-3', height: 52, delay: 200 },
          { id: 'wave-4', height: 64, delay: 300 },
          { id: 'wave-5', height: 72, delay: 400 },
          { id: 'wave-6', height: 64, delay: 500 },
          { id: 'wave-7', height: 52, delay: 600 },
          { id: 'wave-8', height: 36, delay: 700 },
          { id: 'wave-9', height: 20, delay: 800 },
        ].map((wave) => (
          <div
            key={wave.id}
            className="relative rounded-full animate-loading-wave"
            style={{
              width: '4px',
              height: `${wave.height}px`,
              animationDelay: `${wave.delay}ms`,
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.9))',
              boxShadow: `
                0 0 20px rgba(255, 255, 255, 0.6),
                0 0 10px rgba(255, 255, 255, 0.4),
                inset 0 0 15px rgba(255, 255, 255, 0.3),
                inset 0 -3px 10px rgba(255, 255, 255, 0.2)
              `,
              filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
            }}
          >
            {/* Inner glow effect */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to top, rgba(255, 255, 255, 0.2), transparent, rgba(255, 255, 255, 0.4))',
                filter: 'blur(1px)'
              }}
            ></div>
            
            {/* Top highlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-3 rounded-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent)',
                filter: 'blur(2px)'
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

