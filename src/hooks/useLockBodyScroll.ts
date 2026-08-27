import { useEffect } from 'react';

/**
 * Custom hook that locks body scrolling when a modal or overlay is active,
 * and always restores normal body scrolling on close or unmount.
 *
 * @param isLocked - Boolean indicating whether scrolling should be locked
 */
export function useLockBodyScroll(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return;
    }

    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply scroll lock
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    // Always restore normal body scrolling on cleanup
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
}

