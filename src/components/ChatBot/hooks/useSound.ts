import { useCallback } from 'react';

const MESSAGE_SOUND = new Audio('/message.mp3');
const ERROR_SOUND = new Audio('/error.mp3');

export function useSound() {
  const playMessageSound = useCallback(() => {
    MESSAGE_SOUND.play().catch(() => {
      // Silently fail if audio playback is not allowed
    });
  }, []);

  const playErrorSound = useCallback(() => {
    ERROR_SOUND.play().catch(() => {
      // Silently fail if audio playback is not allowed
    });
  }, []);

  return {
    playMessageSound,
    playErrorSound
  };
}