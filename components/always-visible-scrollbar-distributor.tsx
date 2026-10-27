'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CustomScrollbarProps {
  children: ReactNode;
  className?: string;
  containerHeight?: string | number;
  trackClassName?: string;
  thumbClassName?: string;
}

export function CustomScrollbar({
  children,
  className,
  containerHeight = '600px',
  trackClassName,
  thumbClassName,
}: CustomScrollbarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollThumbHeight, setScrollThumbHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      const progress = totalScroll > 0 ? scrollTop / totalScroll : 0;

      const thumbHeight = Math.max((clientHeight / scrollHeight) * 100, 30);
      setScrollThumbHeight(thumbHeight);
      setScrollProgress(Math.min(progress, 1));
    };

    // Set initial thumb height
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const container = scrollContainerRef.current;
    const track = scrollTrackRef.current;
    if (!container || !track) return;

    const handleMouseMove = (e: MouseEvent) => {
      const trackRect = track.getBoundingClientRect();
      const thumbPosition = e.clientY - trackRect.top;
      const trackHeight = trackRect.height;
      const percentage = Math.max(0, Math.min(1, thumbPosition / trackHeight));

      const { scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      container.scrollTop = percentage * totalScroll;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const trackRect = track.getBoundingClientRect();
      const thumbPosition = e.touches[0]!.clientY - trackRect.top;
      const trackHeight = trackRect.height;
      const percentage = Math.max(0, Math.min(1, thumbPosition / trackHeight));

      const { scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      container.scrollTop = percentage * totalScroll;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const trackHeightPx =
  typeof containerHeight === 'number'
    ? containerHeight
    : scrollTrackRef.current?.clientHeight || 0;

  const thumbHeightPx = (scrollThumbHeight / 100) * trackHeightPx;
  const maxThumbPosition = trackHeightPx - thumbHeightPx;
  const scrollThumbPosition = scrollProgress * maxThumbPosition;
  const heightValue = typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight;

  return (
    <div className="relative" style={{ maxHeight: heightValue }}>
      <div
        ref={scrollContainerRef}
        className={cn(
          `overflow-y-scroll ${scrollThumbHeight !== 100 && 'pr-3.5'}`,
          className
        )}
        style={{
          maxHeight: heightValue,
          scrollbarWidth: 'none',
        }}
      >
        {children}
      </div>

      {/* Custom Scrollbar Track and Thumb */}
      {scrollThumbHeight !== 100 &&
        <div
          ref={scrollTrackRef}
          className={cn(
            'absolute top-0 right-0 w-2 bg-secondary/30 rounded-full cursor-pointer pointer-events-auto',
            trackClassName
          )}
          style={{ height: heightValue, zIndex: 0 }}
        >
          <div
            className={cn(
              'w-full bg-foreground rounded-full transition-all',
              isDragging ? '' : 'duration-75',
              thumbClassName
            )}
            style={{
              height: `${scrollThumbHeight}%`,
              transform: `translateY(${scrollThumbPosition}px)`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </div>
      }
    </div>
  );
}
