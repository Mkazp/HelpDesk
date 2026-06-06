import type { HTMLAttributes } from 'react';
import { cn } from '../../lib';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

export function Skeleton({ className, width, height, radius, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(styles.skeleton, className)}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
