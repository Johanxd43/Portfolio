import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSound } from '../useSound';

describe('useSound', () => {
  let playMock: ReturnType<typeof vi.fn>;
  let audioConstructorMock: ReturnType<typeof vi.fn>;
  let volumeSetterMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    playMock = vi.fn().mockResolvedValue(undefined);
    volumeSetterMock = vi.fn();

    audioConstructorMock = vi.fn().mockImplementation(function(this: any, url: string) {
      this.url = url;
      this.play = playMock;
      Object.defineProperty(this, 'volume', {
        set: volumeSetterMock,
        configurable: true
      });
    });

    vi.stubGlobal('Audio', audioConstructorMock);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should initialize Audio with correct URL, set volume, and call play on trigger', async () => {
    const { result } = renderHook(() => useSound('test-sound.mp3'));

    await act(async () => {
      result.current[0]();
    });

    expect(audioConstructorMock).toHaveBeenCalledWith('test-sound.mp3');
    expect(volumeSetterMock).toHaveBeenCalledWith(0.2);
    expect(playMock).toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log an error if play() rejects', async () => {
    const mockError = new Error('play rejected');
    playMock.mockRejectedValue(mockError);

    const { result } = renderHook(() => useSound('error-sound.mp3'));

    await act(async () => {
      result.current[0]();
      // wait a tick for the promise catch block to execute
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(audioConstructorMock).toHaveBeenCalledWith('error-sound.mp3');
    expect(playMock).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Audio play failed', mockError);
  });
});
