import { cn } from '@/lib/utils';

export default function SectionHeader({
  kicker,
  title,
  description,
  align = 'center',
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const isCenter = align === 'center';

  return (
    <div className={cn(isCenter ? 'text-center' : 'text-left', className)}>
      {kicker ? (
        <span className="font-accent text-gold text-xs sm:text-sm tracking-[0.22em] uppercase block mb-3">
          {kicker}
        </span>
      ) : null}
      <h2 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-ivory leading-tight">
        {title}
      </h2>
      {description ? (
        <p className={cn('font-body text-silver leading-relaxed mt-4', isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

