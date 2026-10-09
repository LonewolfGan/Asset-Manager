import { useState, useRef, useCallback } from 'react';

export interface LoupePosition {
  x: number;
  y: number;
  relX: number;
  relY: number;
}

export function useImageUpscaleLoupe() {
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<LoupePosition | null>(null);
  const stageImageRef = useRef<HTMLImageElement | null>(null);

  const toggleLoupe = useCallback(() => {
    setIsLoupeActive((prev) => {
      const next = !prev;
      if (!next) {
        setLoupePos(null);
      }
      return next;
    });
  }, []);

  const resetLoupe = useCallback(() => {
    setIsLoupeActive(false);
    setLoupePos(null);
  }, []);

  const handleStagePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isLoupeActive || !stageImageRef.current) return;
      const imgRect = stageImageRef.current.getBoundingClientRect();
      const x = e.clientX - imgRect.left;
      const y = e.clientY - imgRect.top;

      if (x >= 0 && x <= imgRect.width && y >= 0 && y <= imgRect.height) {
        setLoupePos({
          x: e.clientX,
          y: e.clientY,
          relX: x / imgRect.width,
          relY: y / imgRect.height,
        });
      } else {
        setLoupePos(null);
      }
    },
    [isLoupeActive]
  );

  const handleStagePointerLeave = useCallback(() => {
    setLoupePos(null);
  }, []);

  return {
    isLoupeActive,
    loupePos,
    stageImageRef,
    toggleLoupe,
    resetLoupe,
    handleStagePointerMove,
    handleStagePointerLeave,
  };
}
