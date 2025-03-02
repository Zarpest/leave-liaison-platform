
import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 0.5,
  className 
}: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className
}: SlideInProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 20, opacity: 0 };
      case "down":
        return { y: -20, opacity: 0 };
      case "left":
        return { x: 20, opacity: 0 };
      case "right":
        return { x: -20, opacity: 0 };
      default:
        return { y: 20, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerChildrenProps {
  children: React.ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export const StaggerChildren = ({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className
}: StaggerChildrenProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
