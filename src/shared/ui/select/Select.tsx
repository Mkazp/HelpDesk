import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  className,
  label,
  error,
  options,
  placeholder,
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className={styles.field} htmlFor={selectId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.wrapper}>
        <select id={selectId} className={cn(styles.select, error && styles.error, className)} {...props}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
      </div>
      {error ? <span className={styles.message}>{error}</span> : null}
    </label>
  );
}
