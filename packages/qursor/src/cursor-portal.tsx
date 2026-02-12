"use client";

import { useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import type { CursorState, CursorVariantMap, CursorConfig } from "./types";

interface CursorPortalProps {
  state: CursorState;
  variants: CursorVariantMap;
  config: Required<CursorConfig>;
  isEnabled: boolean;
  isMounted: boolean;
}

export function CursorPortal({
  state,
  variants,
  config,
  isEnabled,
  isMounted,
}: CursorPortalProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>();

  const VariantComponent = useMemo(
    () => variants[state.variant],
    [variants, state.variant]
  );

  useEffect(() => {
    if (!isMounted || !isEnabled || !elementRef.current) return;

    const element = elementRef.current;

    const updatePosition = () => {
      if (!element) return;

      element.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      element.style.opacity = state.isHidden ? "0" : "1";
    };

    const scheduleUpdate = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    scheduleUpdate();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [state.x, state.y, state.isHidden, isEnabled, isMounted]);

  if (!isMounted || !isEnabled || !VariantComponent) {
    return null;
  }

  const portalContent = (
    <div
      ref={elementRef}
      className={`cursor-portal ${config.cursorClassName}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
        transition: state.isHidden ? "opacity 0.2s ease" : "none",
      }}
    >
      <VariantComponent
        x={state.x}
        y={state.y}
        isHidden={state.isHidden}
        variant={state.variant}
        meta={state.meta}
        targetRect={state.targetRect}
      />
    </div>
  );

  return createPortal(portalContent, document.body);
}
