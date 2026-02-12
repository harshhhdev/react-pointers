"use client";

import { useRef, useCallback } from "react";
import { useCursor } from "./cursor-provider";
import type { CursorTargetProps } from "./types";

export function CursorTarget({
  variant,
  children,
  disabled = false,
  meta,
}: CursorTargetProps) {
  const { pushVariant, popVariant, setTargetElement } = useCursor();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const getTargetElement = useCallback((): Element | null => {
    if (!wrapperRef.current) return null;
    // With display: contents, the span has no box.
    // The first child element is the actual interactive element.
    return wrapperRef.current.firstElementChild || null;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    const targetEl = getTargetElement();
    if (targetEl) {
      setTargetElement(targetEl);
    }

    pushVariant(variant, { meta });
  }, [disabled, variant, meta, pushVariant, setTargetElement, getTargetElement]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;

    setTargetElement(null);
    popVariant();
  }, [disabled, popVariant, setTargetElement]);

  const handleFocus = useCallback(() => {
    if (disabled) return;
    handleMouseEnter();
  }, [disabled, handleMouseEnter]);

  const handleBlur = useCallback(() => {
    if (disabled) return;
    handleMouseLeave();
  }, [disabled, handleMouseLeave]);

  return (
    <span
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{ display: "contents" }}
    >
      {children}
    </span>
  );
}
