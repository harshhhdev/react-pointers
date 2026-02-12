import { ReactNode, ComponentType } from "react";

export type CursorVariantName = string;

export interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: string;
}

export interface CursorComponentProps {
  x: number;
  y: number;
  isHidden: boolean;
  variant: CursorVariantName;
  meta?: Record<string, any>;
  targetRect?: TargetRect | null;
}

export type CursorComponent = ComponentType<CursorComponentProps>;

export interface CursorVariantMap {
  [key: CursorVariantName]: CursorComponent;
}

export interface CursorConfig {
  enabled?: boolean;
  trailing?: number;
  reducedMotionRespect?: boolean;
  disableOnTouch?: boolean;
  cursorClassName?: string;
}

export interface CursorProviderProps {
  variants: CursorVariantMap;
  config?: CursorConfig;
  children: ReactNode;
}

export interface CursorTargetProps {
  variant: CursorVariantName;
  children: ReactNode;
  disabled?: boolean;
  meta?: Record<string, any>;
}

export interface PushVariantOptions {
  timeout?: number;
  meta?: Record<string, any>;
}

export interface CursorContextValue {
  variant: CursorVariantName;
  setVariant: (variant: CursorVariantName, meta?: Record<string, any>) => void;
  pushVariant: (
    variant: CursorVariantName,
    options?: PushVariantOptions
  ) => void;
  popVariant: () => void;
  setVariantComponent: (
    variant: CursorVariantName,
    component: CursorComponent
  ) => void;
  setMeta: (meta: Record<string, any>) => void;
  setTargetElement: (element: Element | null) => void;
  isEnabled: boolean;
}

export interface CursorState {
  x: number;
  y: number;
  variant: CursorVariantName;
  isHidden: boolean;
  meta: Record<string, any>;
  targetRect: TargetRect | null;
}

export type CursorVariantStack = Array<{
  variant: CursorVariantName;
  meta?: Record<string, any>;
  timeoutId?: number;
}>;
