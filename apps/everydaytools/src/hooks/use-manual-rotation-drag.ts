import React, { useState, useRef } from 'react';
import { calcManualRotationDelta } from '@/lib/flip-rotate-format-logic';

export function useManualRotationDrag(
  rotation: number,
  onRotationChange: (next: number) => void
) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDraggingRotation, setIsDraggingRotation] = useState<boolean>(false);
  const dragStartRef = useRef<{
    centerX: number;
    centerY: number;
    startPointerAngle: number;
    startRotation: number;
  } | null>(null);

  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startPointerAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    dragStartRef.current = {
      centerX,
      centerY,
      startPointerAngle,
      startRotation: rotation,
    };
    setIsDraggingRotation(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleRotatePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRotation || !dragStartRef.current) return;
    const { centerX, centerY, startPointerAngle, startRotation } =
      dragStartRef.current;
    const currentAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const normalized = calcManualRotationDelta(
      startRotation,
      startPointerAngle,
      currentAngle,
      e.shiftKey
    );
    onRotationChange(normalized);
  };

  const handleRotatePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRotation) {
      setIsDraggingRotation(false);
      dragStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return {
    imgRef,
    isDraggingRotation,
    handleRotatePointerDown,
    handleRotatePointerMove,
    handleRotatePointerUp,
  };
}
