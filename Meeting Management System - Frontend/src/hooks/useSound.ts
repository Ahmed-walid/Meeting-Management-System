import { useCallback } from 'react';
import useSound from 'use-sound';

const moveSound = '/sounds/move.mp3';
const addSound = '/sounds/add.mp3';

export function useMeetingSound() {
  const [playMove] = useSound(moveSound);
  const [playAdd] = useSound(addSound);

  const playMoveSound = useCallback(() => {
    playMove();
  }, [playMove]);

  const playAddSound = useCallback(() => {
    playAdd();
  }, [playAdd]);

  return { playMoveSound, playAddSound };
}