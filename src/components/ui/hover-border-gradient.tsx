
import React from 'react';
import { cn } from '@/lib/utils';

interface HoverBorderGradientProps {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
  onClick?: () => void;
  href?: string;
}

export const HoverBorderGradient: React.FC<HoverBorderGradientProps> = ({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  ...props
}) => {
  return (
    <Tag
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        containerClassName
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,transparent_50%,hsl(var(--primary))_100%)]" />
      <span
        className={cn(
          "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-background px-6 py-1 text-sm font-medium text-foreground backdrop-blur-3xl hover:bg-background/80 transition-colors",
          className
        )}
      >
        {children}
      </span>
    </Tag>
  );
};
