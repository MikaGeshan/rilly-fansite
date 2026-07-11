import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "spinner" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  label?: string;
}

export function Loading({
  className,
  variant = "dots",
  size = "md",
  fullScreen = false,
  label,
  ...props
}: LoadingProps) {
  // Size classes
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.15
      }
    },
    end: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const dotVariants = {
    start: {
      y: "0%"
    },
    end: {
      y: "100%"
    }
  };
  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const
  };

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return (
          <div className="relative flex items-center justify-center">
            {/* Spinning gradient ring */}
            <div
              className={cn(
                "rounded-full border-2 border-transparent animate-spin",
                sizeClasses[size]
              )}
              style={{
                borderTopColor: "#ec4899", // pink-500
                borderRightColor: "#f59e0b", // amber-500
                borderBottomColor: "#fde68a", // amber-200
              }}
            />
          </div>
        );
      
      case "pulse":
        return (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={cn(
              "rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 blur-sm",
              sizeClasses[size]
            )}
            style={{
              boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)"
            }}
          />
        );

      case "dots":
      default:
        // Set individual dot sizes
        const dotSize = size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4";
        return (
          <motion.div
            variants={containerVariants}
            initial="start"
            animate="end"
            className="flex items-center gap-2"
          >
            <motion.span
              variants={dotVariants}
              transition={dotTransition}
              className={cn("rounded-full bg-pink-500", dotSize)}
            />
            <motion.span
              variants={dotVariants}
              transition={dotTransition}
              className={cn("rounded-full bg-amber-400", dotSize)}
            />
            <motion.span
              variants={dotVariants}
              transition={dotTransition}
              className={cn("rounded-full bg-pink-300", dotSize)}
            />
          </motion.div>
        );
    }
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
      {...props}
    >
      {renderLoader()}
      {label && (
        <span
          className={cn(
            "font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500 animate-pulse",
            {
              "text-[10px]": size === "sm",
              "text-xs": size === "md",
              "text-sm": size === "lg"
            }
          )}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
