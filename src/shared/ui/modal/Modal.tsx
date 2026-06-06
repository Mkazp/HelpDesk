import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import { cn } from '../../lib';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, title, description, children, onClose, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose} role="presentation">
      <section
        className={cn(styles.modal, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Закрыть
          </Button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </section>
    </div>,
    document.body,
  );
}
