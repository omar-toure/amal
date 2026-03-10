"use client";

import { useEffect } from 'react';

export default function DevHider() {
  useEffect(() => {
    const hideDevTool = () => {
      // Common Next.js dev elements
      const selectors = [
        'nextjs-portal',
        'nextjs-dev-overlay',
        '#nextjs-dev-overlay',
        '.nextjs-dev-overlay',
        '[data-nextjs-toast]',
        '[data-nextjs-dialog-overlay]',
        '[data-nextjs-dialog-container]',
        '[data-nextjs-indicator]',
        '#__next-build-watcher'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.style) {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            el.style.visibility = 'hidden';
          }
        });
      });
    };

    // Run once
    hideDevTool();

    // Run periodically as Next.js might re-inject it on errors
    const interval = setInterval(hideDevTool, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}
