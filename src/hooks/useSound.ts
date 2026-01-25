import { useCallback } from 'react';

export function useSound(soundUrl: string) {
  const play = useCallback(() => {
    const audio = new Audio(soundUrl);
    audio.volume = 0.2;
    audio.play().catch(e => console.error('Audio play failed', e));
  }, [soundUrl]);

  return [play];
}
