import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full bg-obsidian border border-white/10 rounded-sm px-4 py-3 text-ivory text-base outline-none transition-colors',
        'focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/25',
        'placeholder:text-ash',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;

