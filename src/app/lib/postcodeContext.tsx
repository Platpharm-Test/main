import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { PostcodeResult } from './kakaoPostcode';

interface PostcodeContextValue {
  pendingResult: PostcodeResult | null;
  setPendingResult: (r: PostcodeResult | null) => void;
}

const PostcodeContext = createContext<PostcodeContextValue | null>(null);

export function PostcodeProvider({ children }: { children: ReactNode }) {
  const [pendingResult, setPendingResultState] = useState<PostcodeResult | null>(null);
  const setPendingResult = useCallback((r: PostcodeResult | null) => setPendingResultState(r), []);
  return (
    <PostcodeContext.Provider value={{ pendingResult, setPendingResult }}>
      {children}
    </PostcodeContext.Provider>
  );
}

export function usePostcode() {
  const ctx = useContext(PostcodeContext);
  if (!ctx) throw new Error('usePostcode must be used within PostcodeProvider');
  return ctx;
}
