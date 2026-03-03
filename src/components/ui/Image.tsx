import { useEffect, useMemo, useState, type ImgHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  maxWidth?: number;
}

function isUnsplash(src?: string) {
  if (!src) return false;
  try {
    const url = new URL(src);
    return url.hostname === 'images.unsplash.com';
  } catch {
    return false;
  }
}

function buildUnsplashUrl(src: string, width: number, quality: number) {
  const url = new URL(src);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  return url.toString();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Image({ 
  src, 
  alt, 
  className, 
  containerClassName,
  fallbackSrc = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
  priority = false,
  sizes = "100vw",
  quality = 72,
  maxWidth = 1280,
  ...props 
}: ImageProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const isMenuLocal = Boolean(src && src.startsWith('/images/menu/') && src.endsWith('.png'));
  const webpSrc = isMenuLocal ? src!.replace(/\.png$/, '.webp') : undefined;
  const avifSrc = isMenuLocal ? src!.replace(/\.png$/, '.avif') : undefined;

  const normalizedQuality = clamp(quality, 45, 85);
  const normalizedMaxWidth = clamp(maxWidth, 320, 2560);
  const isUnsplashSrc = useMemo(() => isUnsplash(src), [src]);
  const srcSet = useMemo(() => {
    if (!src || !isUnsplashSrc) return undefined;
    const widthsBase = [320, 480, 640, 800, 1024, 1280, 1600, 1920, 2560];
    const widths = widthsBase.filter((w) => w <= normalizedMaxWidth);
    if (widths.length === 0) widths.push(normalizedMaxWidth);
    return widths.map((w) => `${buildUnsplashUrl(src, w, normalizedQuality)} ${w}w`).join(', ');
  }, [src, isUnsplashSrc, normalizedMaxWidth, normalizedQuality]);

  const optimizedSrc = useMemo(() => {
    if (!src) return src;
    if (!isUnsplashSrc) return src;
    const preferred = priority ? 1600 : 800;
    const w = clamp(preferred, 320, normalizedMaxWidth);
    return buildUnsplashUrl(src, w, normalizedQuality);
  }, [src, isUnsplashSrc, normalizedMaxWidth, normalizedQuality, priority]);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setCurrentSrc(optimizedSrc);
  }, [optimizedSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
      if (currentSrc !== src && src) {
        setCurrentSrc(src);
        setHasError(false);
        setIsLoading(true);
        return;
      }
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden bg-charcoal", containerClassName)}>
      {/* Loading Skeleton */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-white/5 animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal text-ash z-0">
          <ImageOff size={24} className="mb-2 opacity-50" />
          <span className="text-[10px] uppercase tracking-widest">{t('image_unavailable')}</span>
        </div>
      )}

      {/* The Image */}
      {isMenuLocal ? (
        <picture>
          {avifSrc ? <source srcSet={avifSrc} type="image/avif" /> : null}
          {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
          <motion.img
            src={currentSrc}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              isLoading ? "opacity-0" : "opacity-100",
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            referrerPolicy="no-referrer"
            loading={priority ? "eager" : "lazy"}
            sizes={sizes}
            srcSet={srcSet}
            {...props}
          />
        </picture>
      ) : (
        <motion.img
          src={currentSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          referrerPolicy="no-referrer"
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          srcSet={srcSet}
          {...props}
        />
      )}
    </div>
  );
}
