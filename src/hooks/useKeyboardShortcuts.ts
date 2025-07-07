import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          metaKey = false,
          shiftKey = false,
          altKey = false,
          callback,
        } = shortcut;

        const isMatch =
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === ctrlKey &&
          event.metaKey === metaKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey;

        if (isMatch) {
          event.preventDefault();
          callback();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Common keyboard shortcuts
export const commonShortcuts = {
  copy: { key: 'c', ctrlKey: true, metaKey: true, description: 'Copy' },
  paste: { key: 'v', ctrlKey: true, metaKey: true, description: 'Paste' },
  save: { key: 's', ctrlKey: true, metaKey: true, description: 'Save' },
  undo: { key: 'z', ctrlKey: true, metaKey: true, description: 'Undo' },
  redo: { key: 'y', ctrlKey: true, metaKey: true, description: 'Redo' },
  find: { key: 'f', ctrlKey: true, metaKey: true, description: 'Find' },
  selectAll: { key: 'a', ctrlKey: true, metaKey: true, description: 'Select All' },
  escape: { key: 'Escape', description: 'Escape' },
  enter: { key: 'Enter', description: 'Enter' },
  tab: { key: 'Tab', description: 'Tab' },
  space: { key: ' ', description: 'Space' },
};