// Daum / Kakao 우편번호 서비스 스크립트 로더.
// https://postcode.map.daum.net/guide

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: PostcodeResult) => void;
        onclose?: (state: string) => void;
        width?: string | number;
        height?: string | number;
      }) => {
        open: () => void;
        embed: (element: HTMLElement, options?: { autoClose?: boolean }) => void;
      };
    };
  }
}

const SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

let loader: Promise<void> | null = null;

export function loadPostcodeScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window is not available'));
  }
  if (window.daum?.Postcode) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Postcode script failed to load')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Postcode script failed to load'));
    document.head.appendChild(script);
  });
  return loader;
}

export interface PostcodeResult {
  zonecode: string;
  address: string;
  addressType: 'R' | 'J';
  roadAddress: string;
  jibunAddress: string;
  buildingName?: string;
  bname?: string;
  sido?: string;
  sigungu?: string;
  userSelectedType?: 'R' | 'J';
}
