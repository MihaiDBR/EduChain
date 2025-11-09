'use client';

import * as React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  requiresTyping?: boolean;
  typingText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  requiresTyping = false,
  typingText = 'DELETE',
}: ConfirmDialogProps) {
  const [typedText, setTypedText] = React.useState('');

  const variantStyles = {
    danger: {
      icon: 'text-red-500',
      button: 'bg-red-500 hover:bg-red-600 text-white',
      border: 'border-red-500/30',
    },
    warning: {
      icon: 'text-yellow-500',
      button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      border: 'border-yellow-500/30',
    },
    info: {
      icon: 'text-primary',
      button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      border: 'border-primary/30',
    },
  };

  const style = variantStyles[variant];

  const canConfirm = !requiresTyping || typedText === typingText;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
      setTypedText('');
      onClose();
    }
  };

  const handleClose = () => {
    setTypedText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative liquid-glass rounded-3xl p-8 max-w-md w-full border-2 shadow-2xl animate-scale-in',
          style.border
        )}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center ring-2', style.icon, style.border)}>
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-4">
          {title}
        </h2>

        {/* Message */}
        <p className="text-muted-foreground text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Typing confirmation */}
        {requiresTyping && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Type <span className="font-bold text-primary">{typingText}</span> to confirm:
            </label>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder={typingText}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-border/50 hover:bg-muted"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={cn('flex-1', style.button)}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
