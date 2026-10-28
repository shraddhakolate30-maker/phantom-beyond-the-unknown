import { useMemo } from 'react';
import { useAtmosphere } from '../context/AtmosphereContext';

// Real, license-free photography from Pexels (attributed in README).
// Haunted Victorian mansion at night with fog — atmospheric and cinematic.
const MANSION_IMG =
  'https://images.pexels.com/photos/775667/pexels-photo-775667.jpeg?auto=compress&cs=tinysrgb&w=1600';

/**
 * Cinematic atmospheric background used across every page.
 *
 * Layers (back to front):
 *   1. Almost-black gradient base (midnight-blue → charcoal → black)
 *   2. Haunted mansion photograph, darkened and color-graded toward cold blue/violet
 *   3. Full moon with a soft glow
 *   4. Drifting fog layers (animated, blurred)
 *   5. Distant ghost silhouettes (slow, faint)
 *   6. Floating dust particles
 *   7. Candlelight flicker vignette
 *   8. Edge vignette
 *
 * Respects reduced-motion and the per-effect toggles.
 */
export function AtmosphereBackground() {
  const { settings } = useAtmosphere();

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 20 + Math.random() * 30,
        delay: Math.random() * -35,
        size: 1.2 + Math.random() * 2.8,
        opacity: 0.15 + Math.random() * 0.45,
      })),
    [],
  );

  const ghosts = useMemo(
    () => [
      { left: '18%', top: '54%', delay: '0s', duration: '24s', scale: 0.9 },
      { left: '68%', top: '58%', delay: '8s', duration: '30s', scale: 1.1 },
      { left: '44%', top: '52%', delay: '14s', duration: '28s', scale: 0.7 },
    ],
    [],
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-midnight-950" aria-hidden="true">
      {/* 1. Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnightblue-950 via-midnight-950 to-black" />

      {/* 2. Haunted mansion photograph, darkened and color-graded */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${MANSION_IMG}")`,
          filter: 'brightness(0.32) contrast(1.15) saturate(0.55) hue-rotate(190deg)',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 55%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 55%, black 40%, transparent 85%)',
        }}
      />
      {/* Cold color grade overlay to tie the photo into the palette */}
      <div
        className="absolute inset-0 mix-blend-color"
        style={{
          background: 'linear-gradient(180deg, rgba(10,21,48,0.5), rgba(18,12,29,0.4) 50%, rgba(5,3,8,0.7))',
        }}
      />
      {/* Bottom fade so the mansion meets the ground fog */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-midnight-950/80 to-transparent" />

      {/* 3. Full moon */}
      <div
        className="absolute right-[8%] top-[10%] h-28 w-28 rounded-full animate-pulse-glow"
        style={{
          background:
            'radial-gradient(circle at 38% 35%, #fff8e6, #e8e6f2 38%, #bfb8d8 62%, transparent 72%)',
          boxShadow:
            '0 0 70px 24px rgba(232,230,242,0.16), 0 0 140px 50px rgba(197,192,221,0.08), inset -8px -10px 24px rgba(74,63,115,0.3)',
        }}
      />
      {/* Moonlight wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 88% 14%, rgba(197,192,221,0.10), transparent 65%)',
        }}
      />

      {/* 4. Drifting fog layers */}
      {settings.fogEnabled && (
        <>
          <div
            className="absolute inset-x-[-25%] bottom-0 h-[60%] animate-fog-drift-slow opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 25% 100%, rgba(42,37,64,0.7), transparent 70%), radial-gradient(ellipse at 70% 100%, rgba(58,52,88,0.55), transparent 65%), radial-gradient(ellipse at 50% 100%, rgba(36,28,61,0.6), transparent 75%)',
              filter: 'blur(24px)',
            }}
          />
          <div
            className="absolute inset-x-[-25%] bottom-0 h-[45%] animate-fog-drift opacity-50"
            style={{
              background: 'radial-gradient(ellipse at 60% 100%, rgba(36,28,61,0.7), transparent 70%)',
              filter: 'blur(32px)',
            }}
          />
          <div
            className="absolute inset-x-[-25%] bottom-0 h-[30%] animate-fog-drift-rev opacity-40"
            style={{
              background: 'radial-gradient(ellipse at 40% 100%, rgba(50,40,80,0.5), transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </>
      )}

      {/* 5. Distant ghost silhouettes — faint, slow-moving figures */}
      {settings.particlesEnabled && !settings.reducedMotion && (
        <div className="absolute inset-0">
          {ghosts.map((g, i) => (
            <div
              key={i}
              className="absolute animate-ghost-walk"
              style={{
                left: g.left,
                top: g.top,
                animationDelay: g.delay,
                animationDuration: g.duration,
                transform: `scale(${g.scale})`,
              }}
            >
              <svg width="34" height="58" viewBox="0 0 34 58" fill="none">
                <path
                  d="M17 2c-6 0-11 5-11 12v32c0 2 1.5 3 3 2.5 1.5-.5 2.5-1 4-1s2.5.5 4 1 2.5-.5 4-1 2.5.5 4 1 3-.5 3-2.5V14c0-7-5-12-11-12z"
                  fill="rgba(197,192,221,0.12)"
                  style={{ filter: 'blur(1.5px)' }}
                />
                <ellipse cx="13" cy="20" rx="1.8" ry="2.6" fill="rgba(10,7,18,0.5)" />
                <ellipse cx="21" cy="20" rx="1.8" ry="2.6" fill="rgba(10,7,18,0.5)" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 6. Floating dust / spirit particles */}
      {settings.particlesEnabled && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute bottom-0 rounded-full bg-midnight-100 animate-float-up"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                boxShadow: '0 0 8px rgba(197,192,221,0.45)',
              }}
            />
          ))}
        </div>
      )}

      {/* 7. Candlelight flicker near the bottom */}
      {settings.candlelightEnabled && (
        <div
          className="absolute inset-0 animate-flicker-fast"
          style={{
            background: 'radial-gradient(ellipse 85% 60% at 50% 100%, rgba(255,176,51,0.06), transparent 55%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 8. Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
