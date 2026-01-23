'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeroImageSliderProps {
  title: string;
  subtitle: string;
}

export function HeroImageSlider({ title, subtitle }: HeroImageSliderProps) {
  const childrenImages = [1, 2, 3, 4, 5, 6, 7, 8];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % childrenImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [childrenImages.length]);

  return (
    <div className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white overflow-hidden">
      {/* Image slider background */}
      <div className="absolute inset-0">
        {childrenImages.map((num, idx) => (
          <div
            key={num}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: idx === currentIndex ? 1 : 0,
            }}
          >
            <Image
              src={`/children/${num}.jpg`}
              alt={`Hero image ${num}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">{title}</h1>
        <p className="text-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
          {subtitle}
        </p>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {childrenImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
