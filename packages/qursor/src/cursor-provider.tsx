"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { CursorPortal } from "./cursor-portal";
import { attributeManager } from "./attributes";
import type {
  CursorProviderProps,
  CursorContextValue,
  CursorState,
  CursorVariantStack,
  CursorComponent,
  CursorVariantMap,
  CursorConfig,
  PushVariantOptions,
  TargetRect,
} from "./types";

const CursorContext = createContext<CursorContextValue | null>(null);

const DEFAULT_CONFIG: Required<CursorConfig> = {
  enabled: true,
  trailing: 0,
  reducedMotionRespect: true,
  disableOnTouch: true,
  cursorClassName: "",
};

const DEFAULT_VARIANT = "default";

export function CursorProvider({
  variants,
  config = {},
  children,
}: CursorProviderProps) {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  const [isMounted, setIsMounted] = useState(false);
  const [isEnabled, setIsEnabled] = useState(finalConfig.enabled);
  const [variantMap, setVariantMap] = useState<CursorVariantMap>(variants);

  const stateRef = useRef<CursorState>({
    x: 0,
    y: 0,
    variant: DEFAULT_VARIANT,
    isHidden: true,
    meta: {},
    targetRect: null,
  });

  const [currentState, setCurrentState] = useState<CursorState>(
    stateRef.current
  );
  const variantStackRef = useRef<CursorVariantStack>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const isInputFocusedRef = useRef(false);
  const targetElementRef = useRef<Element | null>(null);
  const targetBorderRadiusRef = useRef<string>("");

  useEffect(() => {
    setIsMounted(true);

    if (finalConfig.reducedMotionRespect && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsEnabled(false);
        return;
      }

      const handleChange = (e: MediaQueryListEvent) => {
        setIsEnabled(!e.matches && finalConfig.enabled);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [finalConfig.reducedMotionRespect, finalConfig.enabled]);

  useEffect(() => {
    if (!finalConfig.disableOnTouch) return;

    const handleTouchStart = () => setIsEnabled(false);
    const handleMouseMove = () => setIsEnabled(finalConfig.enabled);

    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsEnabled(false);
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [finalConfig.disableOnTouch, finalConfig.enabled]);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as Element;
      const isInput = target.matches("input, textarea, [contenteditable]");
      isInputFocusedRef.current = isInput;

      if (isInput) {
        updateState({ isHidden: true });
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as Element;
      if (
        !relatedTarget ||
        !relatedTarget.matches("input, textarea, [contenteditable]")
      ) {
        isInputFocusedRef.current = false;
        updateState({ isHidden: false });
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const updateState = useCallback((updates: Partial<CursorState>) => {
    stateRef.current = { ...stateRef.current, ...updates };
    setCurrentState({ ...stateRef.current });
  }, []);

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  const animatePosition = useCallback(() => {
    if (!isEnabled || isInputFocusedRef.current) return;

    const state = stateRef.current;
    const target = targetPositionRef.current;

    // Refresh target rect if tracking an element
    let targetRect: TargetRect | null = null;
    if (targetElementRef.current) {
      const rect = targetElementRef.current.getBoundingClientRect();
      targetRect = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        borderRadius: targetBorderRadiusRef.current,
      };
    }

    if (finalConfig.trailing > 0) {
      const newX = lerp(state.x, target.x, finalConfig.trailing);
      const newY = lerp(state.y, target.y, finalConfig.trailing);

      updateState({ x: newX, y: newY, targetRect });

      if (Math.abs(newX - target.x) > 0.5 || Math.abs(newY - target.y) > 0.5) {
        rafRef.current = requestAnimationFrame(animatePosition);
      }
    } else {
      updateState({ x: target.x, y: target.y, targetRect });
    }
  }, [isEnabled, finalConfig.trailing, lerp, updateState]);

  useEffect(() => {
    if (!isMounted || !isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY };

      if (stateRef.current.isHidden && !isInputFocusedRef.current) {
        updateState({ isHidden: false });
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(animatePosition);
    };

    const handleMouseLeave = () => {
      updateState({ isHidden: true });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMounted, isEnabled, animatePosition, updateState]);

  useEffect(() => {
    if (!isMounted) return;

    const htmlElement = document.documentElement;
    const className = "cursor-none";

    if (isEnabled) {
      htmlElement.classList.add(className);
    } else {
      htmlElement.classList.remove(className);
    }

    return () => {
      htmlElement.classList.remove(className);
    };
  }, [isMounted, isEnabled]);

  const setVariant = useCallback(
    (variant: string, meta?: Record<string, any>) => {
      updateState({ variant, meta: meta || {} });
    },
    [updateState]
  );

  const pushVariant = useCallback(
    (variant: string, options?: PushVariantOptions) => {
      const { timeout, meta } = options || {};

      const existingIndex = variantStackRef.current.findIndex(
        (item) => item.variant === variant
      );
      if (existingIndex !== -1) {
        const existing = variantStackRef.current[existingIndex];
        if (existing && existing.timeoutId) {
          clearTimeout(existing.timeoutId);
        }
        variantStackRef.current.splice(existingIndex, 1);
      }

      variantStackRef.current.push({
        variant: stateRef.current.variant,
        meta: stateRef.current.meta,
      });

      updateState({ variant, meta: meta || {} });

      if (timeout && timeout > 0) {
        const timeoutId = window.setTimeout(() => {
          popVariant();
        }, timeout);

        const stackItem =
          variantStackRef.current[variantStackRef.current.length - 1];
        if (stackItem) {
          stackItem.timeoutId = timeoutId;
        }
      }
    },
    [updateState]
  );

  const popVariant = useCallback(() => {
    const previous = variantStackRef.current.pop();
    if (previous) {
      if (previous.timeoutId) {
        clearTimeout(previous.timeoutId);
      }
      updateState({ variant: previous.variant, meta: previous.meta || {} });
    }
  }, [updateState]);

  const setVariantComponent = useCallback(
    (variant: string, component: CursorComponent) => {
      setVariantMap((prev) => ({ ...prev, [variant]: component }));
    },
    []
  );

  const setMeta = useCallback(
    (meta: Record<string, any>) => {
      updateState({ meta });
    },
    [updateState]
  );

  const setTargetElement = useCallback(
    (element: Element | null) => {
      targetElementRef.current = element;
      if (element) {
        const rect = element.getBoundingClientRect();
        const computed = getComputedStyle(element);
        targetBorderRadiusRef.current = computed.borderRadius;
        updateState({
          targetRect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            borderRadius: computed.borderRadius,
          },
        });
      } else {
        targetBorderRadiusRef.current = "";
        updateState({ targetRect: null });
      }
    },
    [updateState]
  );

  const contextValue = useMemo<CursorContextValue>(
    () => ({
      variant: currentState.variant,
      setVariant,
      pushVariant,
      popVariant,
      setVariantComponent,
      setMeta,
      setTargetElement,
      isEnabled,
    }),
    [
      currentState.variant,
      setVariant,
      pushVariant,
      popVariant,
      setVariantComponent,
      setMeta,
      setTargetElement,
      isEnabled,
    ]
  );

  useEffect(() => {
    if (isMounted && isEnabled) {
      attributeManager.init(contextValue);
    }

    return () => {
      if (!isEnabled) {
        attributeManager.cleanup();
      }
    };
  }, [contextValue, isMounted, isEnabled]);

  return (
    <CursorContext.Provider value={contextValue}>
      {children}
      <CursorPortal
        state={currentState}
        variants={variantMap}
        config={finalConfig}
        isEnabled={isEnabled}
        isMounted={isMounted}
      />
    </CursorContext.Provider>
  );
}

export const useCursor = (): CursorContextValue => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
