"use client";

import type { CursorContextValue } from "./types";

interface AttributeManager {
  init: (cursorContext: CursorContextValue) => void;
  cleanup: () => void;
}

let isInitialized = false;
let currentContext: CursorContextValue | null = null;
let variantStack: string[] = [];

const handleMouseEnter = (e: Event) => {
  if (!currentContext) return;

  const target = e.target as Element;
  const variant = target.getAttribute("data-cursor");
  const metaAttr = target.getAttribute("data-cursor-meta");

  if (variant) {
    let meta: Record<string, any> = {};

    if (metaAttr) {
      try {
        meta = JSON.parse(metaAttr);
      } catch {
        console.warn("Invalid JSON in data-cursor-meta attribute");
      }
    }

    currentContext.setTargetElement(target);
    variantStack.push(currentContext.variant);
    currentContext.setVariant(variant, meta);
  }
};

const handleMouseLeave = (e: Event) => {
  if (!currentContext) return;

  const target = e.target as Element;
  const variant = target.getAttribute("data-cursor");

  if (variant && variantStack.length > 0) {
    currentContext.setTargetElement(null);
    const previousVariant = variantStack.pop();
    if (previousVariant) {
      currentContext.setVariant(previousVariant);
    }
  }
};

const handleFocus = (e: Event) => {
  const target = e.target as Element;
  if (target.hasAttribute("data-cursor")) {
    handleMouseEnter(e);
  }
};

const handleBlur = (e: Event) => {
  const target = e.target as Element;
  if (target.hasAttribute("data-cursor")) {
    handleMouseLeave(e);
  }
};

export const createAttributeManager = (): AttributeManager => {
  return {
    init: (cursorContext: CursorContextValue) => {
      if (isInitialized) {
        currentContext = cursorContext;
        return;
      }

      currentContext = cursorContext;

      document.addEventListener("mouseover", (e) => {
        const target = e.target as Element;
        if (target.hasAttribute("data-cursor")) {
          handleMouseEnter(e);
        }
      });

      document.addEventListener("mouseout", (e) => {
        const target = e.target as Element;
        if (target.hasAttribute("data-cursor")) {
          handleMouseLeave(e);
        }
      });

      document.addEventListener("focusin", handleFocus);
      document.addEventListener("focusout", handleBlur);

      isInitialized = true;
    },

    cleanup: () => {
      if (!isInitialized) return;

      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);

      currentContext = null;
      variantStack = [];
      isInitialized = false;
    },
  };
};

export const attributeManager = createAttributeManager();
