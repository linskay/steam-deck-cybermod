import { useEffect, useRef } from 'react';

export const useGamepadNavigation = () => {
  const lastPressed = useRef<Record<number, number>>({});

  useEffect(() => {
    let animationFrameId: number;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) return;

      for (const gp of gamepads) {
        if (!gp) continue;

        // D-pad indices vary, but usually buttons 12-15
        const buttons = [
          { key: 'ArrowUp', pressed: gp.buttons[12]?.pressed },
          { key: 'ArrowDown', pressed: gp.buttons[13]?.pressed },
          { key: 'ArrowLeft', pressed: gp.buttons[14]?.pressed },
          { key: 'ArrowRight', pressed: gp.buttons[15]?.pressed },
          { key: 'Enter', pressed: gp.buttons[0]?.pressed }, // Button A
        ];

        buttons.forEach((btn, index) => {
          if (btn.pressed && !lastPressed.current[index]) {
            // Dispatch keyboard event to trigger standard focus navigation
            window.dispatchEvent(new KeyboardEvent('keydown', { key: btn.key }));
          }
          lastPressed.current[index] = btn.pressed ? 1 : 0;
        });
      }
      animationFrameId = requestAnimationFrame(pollGamepad);
    };

    pollGamepad();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
};
