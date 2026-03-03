import { cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type ReactElement } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const styles: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-obsidian font-bold hover:bg-gold-light focus-visible:ring-gold/50',
  secondary:
    'bg-white/5 text-ivory border border-white/10 hover:bg-white/10 hover:border-white/20 focus-visible:ring-white/20',
  outline:
    'bg-transparent text-gold border border-gold/60 hover:bg-gold/10 hover:border-gold focus-visible:ring-gold/40',
  ghost:
    'bg-transparent text-ivory hover:bg-white/5 hover:text-gold focus-visible:ring-gold/30',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs tracking-wider uppercase',
  md: 'h-11 px-6 text-sm tracking-wider uppercase',
  lg: 'h-12 px-7 text-sm tracking-wider uppercase',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', asChild = false, children, ...props }, ref) => {
    const mergedClassName = cn(
      'inline-flex items-center justify-center rounded-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
      styles[variant],
      sizes[size],
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<any>;
      return cloneElement(child, {
        className: cn(child.props?.className, mergedClassName),
        ...props,
      });
    }

    return (
      <button ref={ref} type={type} className={mergedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
