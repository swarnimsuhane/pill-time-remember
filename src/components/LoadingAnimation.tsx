
import React from 'react';
import { Clock, Pill } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pill-teal via-pill-light to-pill-teal flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative animate-glow-pulse">
            <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Clock className="w-16 h-16 text-pill-navy animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute top-6 right-6 animate-bounce">
              <div className="w-8 h-16 bg-gradient-to-t from-pill-red to-white rounded-full border-2 border-pill-navy"></div>
            </div>
          </div>
        </div>

        {/* Title Animation */}
        <div className="overflow-hidden">
          <h1 className="text-6xl font-bold text-pill-navy mb-4 font-montserrat animate-slide-up">
            PILL TIME
          </h1>
        </div>

        {/* Slogan Animation */}
        <div className="overflow-hidden">
          <p className="text-xl text-pill-navy/80 font-medium animate-slide-up" style={{ animationDelay: '0.5s' }}>
            We Remember, So You Can Feel Better.
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-pill-navy rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-pill-navy rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-pill-navy rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
