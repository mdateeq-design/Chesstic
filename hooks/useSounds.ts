import { useContext, useMemo } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { sounds, SoundEffect } from '../audio/sounds';

// Memoize audio objects to avoid creating them on every call
const audioCache: { [key in SoundEffect]?: HTMLAudioElement } = {};

export const useSounds = () => {
  const { isSoundEnabled } = useContext(SettingsContext);

  const playSound = (soundName: SoundEffect) => {
    if (!isSoundEnabled) return;

    if (!audioCache[soundName]) {
      audioCache[soundName] = new Audio(sounds[soundName]);
    }
    
    const audio = audioCache[soundName];
    if (audio) {
      audio.currentTime = 0; // Rewind to start
      audio.play().catch(error => console.error(`Error playing sound: ${soundName}`, error));
    }
  };

  return { playSound };
};
