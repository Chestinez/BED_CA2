import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { getRankBackground } from '../../utils/assetManager';

const RankBackground = ({ rankId, children, animated = true }) => {
  const backgroundRef = useRef();
  const starsRef = useRef();
  const nebulaRef = useRef();
  const particlesRef = useRef();

  useEffect(() => {
    if (!animated) return;

    const ctx = gsap.context(() => {
      // Floating stars animation
      gsap.to('.floating-star', {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        rotation: 'random(-180, 180)',
        duration: 'random(3, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: 'random'
        }
      });

      // Nebula glow pulse
      gsap.to('.nebula-glow', {
        opacity: 'random(0.3, 0.8)',
        scale: 'random(0.95, 1.05)',
        duration: 'random(4, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Particle drift
      gsap.to('.space-particle', {
        x: 'random(-100, 100)',
        y: 'random(-50, 50)',
        opacity: 'random(0.2, 0.7)',
        duration: 'random(8, 15)',
        repeat: -1,
        yoyo: true,
        ease: 'none',
        stagger: {
          amount: 5,
          from: 'random'
        }
      });

      // Rank-specific animations
      if (rankId >= 5) {
        // Advanced rank effects
        gsap.to('.advanced-effect', {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
        });
      }
    }, backgroundRef);

    return () => ctx.revert();
  }, [rankId, animated]);

  const backgroundImage = getRankBackground(rankId);

  const generateStars = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="floating-star"
        style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
          zIndex: 1
        }}
      />
    ));
  };

  const generateParticles = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="space-particle"
        style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 0.5}px`,
          height: `${Math.random() * 2 + 0.5}px`,
          backgroundColor: getRankColor(rankId),
          borderRadius: '50%',
          opacity: 0.4,
          zIndex: 1
        }}
      />
    ));
  };

  const getRankColor = (rankId) => {
    const colors = {
      1: '#87CEEB', // Sky blue for Recruit
      2: '#4169E1', // Royal blue for Pilot
      3: '#9370DB', // Medium purple for Commander
      4: '#FF6347', // Tomato for Admiral
      5: '#FFD700', // Gold for Fleet-Admiral
      6: '#FF1493'  // Deep pink for Big-Boss
    };
    return colors[rankId] || '#87CEEB';
  };

  return (
    <div
      ref={backgroundRef}
      className="rank-background"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}
    >
      {/* Background overlay for better text readability */}
      <div
        className="background-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      />

      {/* Animated Stars */}
      {animated && (
        <div ref={starsRef} className="stars-layer">
          {generateStars(50)}
        </div>
      )}

      {/* Nebula Glow Effects */}
      {animated && rankId >= 3 && (
        <div
          ref={nebulaRef}
          className="nebula-glow"
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${getRankColor(rankId)}33 0%, transparent 70%)`,
            borderRadius: '50%',
            zIndex: 1
          }}
        />
      )}

      {/* Floating Particles */}
      {animated && (
        <div ref={particlesRef} className="particles-layer">
          {generateParticles(30)}
        </div>
      )}

      {/* Advanced Rank Effects */}
      {animated && rankId >= 5 && (
        <div
          className="advanced-effect"
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            border: `2px solid ${getRankColor(rankId)}`,
            borderRadius: '50%',
            opacity: 0.3,
            zIndex: 1
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>

      {/* CSS for additional effects */}
      <style jsx>{`
        .rank-background {
          transition: all 0.5s ease-in-out;
        }

        .floating-star {
          filter: blur(0.5px);
        }

        .space-particle {
          filter: blur(1px);
        }

        .nebula-glow {
          filter: blur(20px);
        }

        .advanced-effect {
          filter: blur(1px);
        }

        /* Rank-specific glows */
        .rank-background[data-rank="5"] {
          box-shadow: inset 0 0 100px rgba(255, 215, 0, 0.1);
        }

        .rank-background[data-rank="6"] {
          box-shadow: inset 0 0 100px rgba(255, 20, 147, 0.1);
        }
      `}</style>
    </div>
  );
};

export default RankBackground;