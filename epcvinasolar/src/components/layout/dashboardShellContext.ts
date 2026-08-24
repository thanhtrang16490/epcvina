import { createContext, useContext } from 'react';

export const ScrollContext = createContext<{
  isHeaderVisible: boolean;
  scrollY: number;
}>({
  isHeaderVisible: true,
  scrollY: 0,
});

export const useScrollContext = () => useContext(ScrollContext);
