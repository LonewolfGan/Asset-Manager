import { useState, useCallback, useRef, useEffect } from 'react';

const MAX_PASSWORD_HISTORY = 50;

export interface PasswordHistoryState {
  stack: string[];
  index: number;
}

export interface UsePasswordHistoryReturn {
  currentPassword: string;
  canUndo: boolean;
  canRedo: boolean;
  historyList: string[];
  pushPassword: (pwd: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  clearHistory: () => void;
}

export function usePasswordHistory(initialPassword = ''): UsePasswordHistoryReturn {
  const [state, setState] = useState<PasswordHistoryState>(() => ({
    stack: initialPassword ? [initialPassword] : [],
    index: initialPassword ? 0 : -1,
  }));

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const pushPassword = useCallback((pwd: string) => {
    if (!pwd) return;

    const { stack, index } = stateRef.current;
    const current = index >= 0 ? stack[index] : null;
    if (current === pwd) return;

    const trimmed = stack.slice(0, index + 1);
    const nextStack = [...trimmed, pwd];

    if (nextStack.length > MAX_PASSWORD_HISTORY) {
      nextStack.shift();
    }

    const nextState: PasswordHistoryState = {
      stack: nextStack,
      index: nextStack.length - 1,
    };
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const undo = useCallback((): string | null => {
    const { stack, index } = stateRef.current;
    if (index <= 0) return null;

    const targetIndex = index - 1;
    const targetPwd = stack[targetIndex] ?? null;

    const nextState: PasswordHistoryState = {
      stack,
      index: targetIndex,
    };
    stateRef.current = nextState;
    setState(nextState);
    return targetPwd;
  }, []);

  const redo = useCallback((): string | null => {
    const { stack, index } = stateRef.current;
    if (index >= stack.length - 1) return null;

    const targetIndex = index + 1;
    const targetPwd = stack[targetIndex] ?? null;

    const nextState: PasswordHistoryState = {
      stack,
      index: targetIndex,
    };
    stateRef.current = nextState;
    setState(nextState);
    return targetPwd;
  }, []);

  const clearHistory = useCallback(() => {
    const { stack, index } = stateRef.current;
    const current = index >= 0 ? stack[index] : '';
    const nextState: PasswordHistoryState = current
      ? { stack: [current], index: 0 }
      : { stack: [], index: -1 };

    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const currentPassword = state.index >= 0 ? state.stack[state.index] ?? '' : '';
  const canUndo = state.index > 0;
  const canRedo = state.index >= 0 && state.index < state.stack.length - 1;
  const historyList = [...state.stack].reverse();

  return {
    currentPassword,
    canUndo,
    canRedo,
    historyList,
    pushPassword,
    undo,
    redo,
    clearHistory,
  };
}
