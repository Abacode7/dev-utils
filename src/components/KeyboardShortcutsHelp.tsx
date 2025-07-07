import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';
import { Icons } from '../styles/icons';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface ShortcutInfo {
  keys: string[];
  description: string;
  category: string;
}

const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: ShortcutInfo[] = [
    { keys: ['Ctrl', 'C'], description: 'Copy content', category: 'General' },
    { keys: ['Ctrl', 'V'], description: 'Paste content', category: 'General' },
    { keys: ['Ctrl', 'S'], description: 'Save/Download', category: 'General' },
    { keys: ['Ctrl', 'A'], description: 'Select all', category: 'General' },
    { keys: ['Escape'], description: 'Close dialogs', category: 'General' },
    { keys: ['Tab'], description: 'Navigate fields', category: 'Navigation' },
    { keys: ['Shift', 'Tab'], description: 'Navigate backwards', category: 'Navigation' },
    { keys: ['Ctrl', 'F'], description: 'Find in content', category: 'Search' },
    { keys: ['F1'], description: 'Show this help', category: 'Help' },
  ];

  useKeyboardShortcuts([
    {
      key: 'F1',
      callback: () => setIsOpen(true),
      description: 'Show keyboard shortcuts',
    },
    {
      key: 'Escape',
      callback: () => setIsOpen(false),
      description: 'Close help dialog',
    },
  ]);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutInfo[]>);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
        aria-label="Show keyboard shortcuts (F1)"
      >
        <Icons.Info size={18} />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-surface-overlay z-modal flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Keyboard Shortcuts</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Close shortcuts help"
          >
            <Icons.X size={18} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-surface-secondary"
                  >
                    <span className="text-text-secondary">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="px-2 py-1 bg-surface-tertiary text-text-primary text-xs font-mono rounded border border-border-primary">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-text-tertiary">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-border-primary">
            <p className="text-sm text-text-tertiary text-center">
              Press <kbd className="px-2 py-1 bg-surface-tertiary text-text-primary text-xs font-mono rounded border border-border-primary">F1</kbd> to show this help or{' '}
              <kbd className="px-2 py-1 bg-surface-tertiary text-text-primary text-xs font-mono rounded border border-border-primary">Escape</kbd> to close
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyboardShortcutsHelp;