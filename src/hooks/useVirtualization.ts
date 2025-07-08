import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  scrollOffset?: number;
}

interface VirtualizedItem<T> {
  index: number;
  data: T;
  style: React.CSSProperties;
}

export const useVirtualization = <T>(
  items: T[],
  config: VirtualizationConfig
) => {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    scrollOffset = 0
  } = config;

  const [scrollTop, setScrollTop] = useState(scrollOffset);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemCount + overscan * 2
  );

  const visibleItems: VirtualizedItem<T>[] = useMemo(() => {
    const result: VirtualizedItem<T>[] = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        index: i,
        data: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }
    
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!scrollElementRef.current) return;

    let scrollTo: number;
    
    switch (align) {
      case 'center':
        scrollTo = index * itemHeight - containerHeight / 2 + itemHeight / 2;
        break;
      case 'end':
        scrollTo = index * itemHeight - containerHeight + itemHeight;
        break;
      default:
        scrollTo = index * itemHeight;
    }

    scrollElementRef.current.scrollTo({
      top: Math.max(0, Math.min(scrollTo, totalHeight - containerHeight)),
      behavior: 'smooth'
    });
  }, [itemHeight, containerHeight, totalHeight]);

  const getItemOffset = useCallback((index: number) => {
    return index * itemHeight;
  }, [itemHeight]);

  return {
    visibleItems,
    totalHeight,
    containerProps: {
      ref: scrollElementRef,
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative' as const,
      },
    },
    scrollToIndex,
    getItemOffset,
    scrollTop,
  };
};

// Hook for dynamic item heights (more complex but flexible)
export const useDynamicVirtualization = <T>(
  items: T[],
  estimatedItemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const measurementCache = useRef<Map<number, number>>(new Map());

  const getItemHeight = useCallback((index: number) => {
    return itemHeights.get(index) ?? estimatedItemHeight;
  }, [itemHeights, estimatedItemHeight]);

  const getItemOffset = useCallback((index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  }, [getItemHeight]);

  const getTotalHeight = useCallback(() => {
    return getItemOffset(items.length) + (itemHeights.get(items.length - 1) ?? estimatedItemHeight);
  }, [getItemOffset, items.length, itemHeights, estimatedItemHeight]);

  const findStartIndex = useCallback(() => {
    let index = 0;
    let offset = 0;
    
    while (index < items.length && offset < scrollTop) {
      offset += getItemHeight(index);
      index++;
    }
    
    return Math.max(0, index - 1 - overscan);
  }, [items.length, scrollTop, getItemHeight, overscan]);

  const findEndIndex = useCallback(() => {
    const startIndex = findStartIndex();
    let index = startIndex;
    let offset = getItemOffset(startIndex);
    
    while (index < items.length && offset < scrollTop + containerHeight) {
      offset += getItemHeight(index);
      index++;
    }
    
    return Math.min(items.length - 1, index + overscan);
  }, [findStartIndex, getItemOffset, items.length, scrollTop, containerHeight, getItemHeight, overscan]);

  const visibleItems: VirtualizedItem<T>[] = useMemo(() => {
    const startIndex = findStartIndex();
    const endIndex = findEndIndex();
    const result: VirtualizedItem<T>[] = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        index: i,
        data: items[i],
        style: {
          position: 'absolute',
          top: getItemOffset(i),
          left: 0,
          right: 0,
          height: getItemHeight(i),
        },
      });
    }
    
    return result;
  }, [items, findStartIndex, findEndIndex, getItemOffset, getItemHeight]);

  const setItemHeight = useCallback((index: number, height: number) => {
    setItemHeights(prev => {
      if (prev.get(index) === height) return prev;
      const newMap = new Map(prev);
      newMap.set(index, height);
      return newMap;
    });
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight: getTotalHeight(),
    containerProps: {
      ref: scrollElementRef,
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative' as const,
      },
    },
    setItemHeight,
    getItemHeight,
    getItemOffset,
    scrollTop,
  };
};