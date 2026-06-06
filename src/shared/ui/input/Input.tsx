import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input id={inputId} className={cn(styles.input, error && styles.error, className)} {...props} />
      {error ? <span className={styles.message}>{error}</span> : null}
    </label>
  );
}
