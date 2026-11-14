// author: Khoa Phan <https://www.pldkhoa.dev>
// Adapted for high-performance React 19 + Framer Motion in portfolio

"use client";

import React, {
  createContext,
  useContext,
  useRef,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface StackingCardsProps
  extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  scrollOptions?: UseScrollOptions;
  scaleMultiplier?: number;
  totalCards: number;
}

interface StackingCardItemProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  index: number;
  topPosition?: string;
}

const StackingCardsContext = createContext<{
  progress: MotionValue<number>;
  scaleMultiplier?: number;
  totalCards?: number;
} | null>(null);

export const useStackingCardsContext = () => {
  const context = useContext(StackingCardsContext);
  if (!context) {
    throw new Error("StackingCardItem must be used within StackingCards");
  }
  return context;
};

export default function StackingCards({
  children,
  className,
  scrollOptions,
  scaleMultiplier = 0.03,
  totalCards,
  ...props
}: StackingCardsProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
    ...scrollOptions,
  });

  return (
    <StackingCardsContext.Provider
      value={{ progress: scrollYProgress, scaleMultiplier, totalCards }}
    >
      <div className={cn("relative", className)} ref={targetRef} {...props}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  );
}

export const StackingCardItem = ({
  index,
  topPosition,
  className,
  children,
  style,
  ...props
}: StackingCardItemProps) => {
  const {
    progress,
    scaleMultiplier,
    totalCards = 0,
  } = useStackingCardsContext();

  const shouldReduceMotion = useReducedMotion();

  // Progressive scaling: earlier cards scale down more as subsequent cards arrive
  const scaleTo = shouldReduceMotion 
    ? 1 
    : 1 - (totalCards - index) * (scaleMultiplier ?? 0.03);

  const rangeScale = [index * (1 / totalCards), 1];
  const scale = useTransform(progress, rangeScale, [1, scaleTo]);

  // Default sticky top position with offset accounting for sticky navbar
  const top = topPosition ?? `calc(84px + ${index * 26}px)`;

  return (
    <div
      className={cn("sticky", className)}
      style={{
        top: 0,
        zIndex: 10 + index,
        ...style,
      }}
      {...props}
    >
      <motion.div
        className="origin-top relative will-change-transform"
        style={{
          top,
          scale: shouldReduceMotion ? 1 : scale,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
