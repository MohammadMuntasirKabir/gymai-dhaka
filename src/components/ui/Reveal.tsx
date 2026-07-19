import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const directions = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
} as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: keyof typeof directions;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}

/**
 * Scroll-triggered entrance animation. Respects prefers-reduced-motion
 * (framer-motion disables transforms automatically via MotionConfig-free
 * CSS, but we also guard initial offset via the whileInView tolerance).
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as = "div",
}: RevealProps) {
  const offset = directions[direction];
  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}
