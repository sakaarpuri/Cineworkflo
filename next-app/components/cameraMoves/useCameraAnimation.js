import { useRef, useCallback, useEffect } from 'react';

// Easing function from original HTML
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

/**
 * Custom hook for camera move animations
 * Ported from the HTML makeCard() function
 * 
 * @param {Object} options
 * @param {string} options.stageId - ID of the stage element
 * @param {string} options.hintId - ID of the hint element
 * @param {Function} options.animateFn - Animation callback (p, ts) => void
 * @param {Function} options.resetFn - Reset callback () => void
 * @param {number} options.runs - Number of animation runs (default: 2)
 * @param {number} options.duration - Duration per run in ms (default: 3400)
 */
export function useCameraAnimation({
  stageRef,
  hintRef,
  animateFn,
  resetFn,
  runs = 2,
  duration = 3400
}) {
  const animRef = useRef(null);
  const startTimeRef = useRef(null);
  const runCountRef = useRef(0);
  const isRunningRef = useRef(false);

  const tick = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

    // Call the move-specific animation function
    animateFn(progress, timestamp);

    if (progress < 1) {
      animRef.current = requestAnimationFrame(tick);
    } else {
      runCountRef.current++;
      startTimeRef.current = null;
      
      if (runCountRef.current < runs) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        // Animation complete
        isRunningRef.current = false;
        if (hintRef.current) {
          hintRef.current.classList.remove('camera-move-card__hint--hidden');
        }
        if (resetFn) resetFn();
      }
    }
  }, [animateFn, resetFn, duration, runs]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    
    if (hintRef.current) {
      hintRef.current.classList.add('camera-move-card__hint--hidden');
    }
    
    runCountRef.current = 0;
    startTimeRef.current = null;
    animRef.current = requestAnimationFrame(tick);
  }, [tick, hintRef]);

  const stop = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }
    isRunningRef.current = false;
    
    if (hintRef.current) {
      hintRef.current.classList.remove('camera-move-card__hint--hidden');
    }
    
    if (resetFn) resetFn();
  }, [resetFn, hintRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, isRunning: () => isRunningRef.current };
}

export { easeInOut };
