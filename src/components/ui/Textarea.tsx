import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full bg-obsidian border border-white/10 rounded-sm px-4 py-3 text-ivory text-base outline-none transition-colors resize-none',
        'focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/25',
        'placeholder:text-ash',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;

