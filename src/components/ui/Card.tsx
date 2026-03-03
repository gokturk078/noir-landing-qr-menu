import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('bg-charcoal/50 border border-white/5 rounded-sm', className)}
      {...props}
    />
  );
});

Card.displayName = 'Card';

export default Card;

