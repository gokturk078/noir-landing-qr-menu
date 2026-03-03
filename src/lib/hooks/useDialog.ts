import { RefObject, useEffect, useRef } from 'react';

function getFocusableElements(container: HTMLElement) {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(container.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
}

export function useDialog({
  isOpen,
  onClose,
  containerRef,
  initialFocusRef,
  lockScroll = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement>;
  initialFocusRef?: RefObject<HTMLElement>;
  lockScroll?: boolean;
}) {
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const previousOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = 'hidden';

    const focusTarget = initialFocusRef?.current || getFocusableElements(container)[0] || container;
    window.setTimeout(() => focusTarget.focus?.(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!active || active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!active || active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      if (lockScroll) document.body.style.overflow = previousOverflow;
      lastActiveElementRef.current?.focus?.();
      lastActiveElementRef.current = null;
    };
  }, [containerRef, initialFocusRef, isOpen, lockScroll, onClose]);
}

