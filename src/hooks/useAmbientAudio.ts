import { useEffect, useRef } from 'react';
import { useAtmosphere } from '../context/AtmosphereContext';

/**
 * Ambient audio synthesized entirely in-browser with the Web Audio API.
 *
 * No external or copyrighted audio asset is required. We build a layered
 * haunted ambience from several independent sources mixed together:
 *
 *   - A deep low drone (two detuned sawtooth oscillators through a lowpass
 *     filter) — the room tone.
 *   - A sub-bass swell (slow LFO on a sine) — slow breathing pressure.
 *   - Filtered white-noise wind with a slow LFO on the filter cutoff —
 *     drifting air.
 *   - Occasional "whisper" bursts (very short filtered noise pings with
 *     random timing) — distant, unintelligible voices.
 *
 * The mix is balanced so that at the default volume it is clearly audible
 * but never harsh. All layers are gentle, sustained, and loop seamlessly.
 *
 * Browsers block autoplay until the user interacts with the page, so audio
 * only starts after the visitor presses the play control.
 */
export function useAmbientAudio() {
  const { settings } = useAtmosphere();
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);
  const whisperTimerRef = useRef<number | null>(null);

  const ensureGraph = () => {
    if (ctxRef.current) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // --- Low drone: two detuned sawtooths through a lowpass ---
    const droneA = ctx.createOscillator();
    droneA.type = 'sawtooth';
    droneA.frequency.value = 55; // A1
    const droneB = ctx.createOscillator();
    droneB.type = 'sawtooth';
    droneB.frequency.value = 55.6; // detuned for slow beating
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 180;
    droneFilter.Q.value = 1.2;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.16;
    droneA.connect(droneFilter);
    droneB.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);

    // --- Sub-bass swell ---
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 27.5; // A0
    const subGain = ctx.createGain();
    subGain.gain.value = 0.18;
    const subLfo = ctx.createOscillator();
    subLfo.type = 'sine';
    subLfo.frequency.value = 0.06;
    const subLfoGain = ctx.createGain();
    subLfoGain.gain.value = 0.12;
    subLfo.connect(subLfoGain);
    subLfoGain.connect(subGain.gain);
    sub.connect(subGain);
    subGain.connect(master);

    // --- Wind: brown-ish noise through a moving lowpass ---
    const bufferSize = 4 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Simple leaky integrator -> brown noise (deeper, less hissy)
      last = (last + 0.02 * white) / 1.02;
      noiseData[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 500;
    noiseFilter.Q.value = 0.6;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.22;
    // Slow LFO modulates the filter cutoff for a "wind ebb and flow"
    const windLfo = ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.045;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 220;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(noiseFilter.frequency);
    // And a gentle gain LFO so the wind swells
    const windGainLfo = ctx.createOscillator();
    windGainLfo.type = 'sine';
    windGainLfo.frequency.value = 0.08;
    const windGainLfoGain = ctx.createGain();
    windGainLfoGain.gain.value = 0.08;
    windGainLfo.connect(windGainLfoGain);
    windGainLfoGain.connect(noiseGain.gain);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    // --- Whisper pings: short filtered noise bursts at random intervals ---
    const makeWhisper = () => {
      if (!ctxRef.current) return;
      const c = ctxRef.current;
      const len = Math.floor(c.sampleRate * (0.6 + Math.random() * 0.8));
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const env = Math.sin((Math.PI * i) / len); // fade in/out
        d[i] = (Math.random() * 2 - 1) * env * 0.5;
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 800 + Math.random() * 1200;
      bp.Q.value = 6;
      const g = c.createGain();
      g.gain.value = 0.06;
      const pan = c.createStereoPanner();
      pan.pan.value = Math.random() * 1.4 - 0.7;
      src.connect(bp);
      bp.connect(g);
      g.connect(pan);
      pan.connect(master);
      src.start();
      src.onended = () => {
        try { src.disconnect(); bp.disconnect(); g.disconnect(); pan.disconnect(); } catch { /* ignore */ }
      };
      // schedule next
      whisperTimerRef.current = window.setTimeout(makeWhisper, 4000 + Math.random() * 9000);
    };

    // Start everything
    droneA.start();
    droneB.start();
    sub.start();
    subLfo.start();
    noise.start();
    windLfo.start();
    windGainLfo.start();
    whisperTimerRef.current = window.setTimeout(makeWhisper, 5000);

    nodesRef.current = {
      stop: () => {
        if (whisperTimerRef.current !== null) {
          clearTimeout(whisperTimerRef.current);
          whisperTimerRef.current = null;
        }
        try {
          droneA.stop();
          droneB.stop();
          sub.stop();
          subLfo.stop();
          noise.stop();
          windLfo.stop();
          windGainLfo.stop();
          ctx.close();
        } catch {
          /* already closed */
        }
      },
    };
    ctxRef.current = ctx;
    masterRef.current = master;
  };

  // Respond to settings changes
  useEffect(() => {
    if (settings.audioEnabled) {
      ensureGraph();
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (ctx && master) {
        if (ctx.state === 'suspended') void ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        // Smooth ramp to target volume
        master.gain.linearRampToValueAtTime(settings.audioVolume, ctx.currentTime + 0.6);
      }
    } else {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      }
    }
  }, [settings.audioEnabled, settings.audioVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      ctxRef.current = null;
      masterRef.current = null;
      nodesRef.current = null;
    };
  }, []);
}
