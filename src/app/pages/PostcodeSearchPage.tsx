import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { loadPostcodeScript } from '../lib/kakaoPostcode';
import { usePostcode } from '../lib/postcodeContext';

export default function PostcodeSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPendingResult } = usePostcode();
  const embedRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const completedRef = useRef(false);

  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  const goBack = () => {
    if (returnTo) navigate(returnTo, { replace: true });
    else navigate(-1);
  };

  useEffect(() => {
    let cancelled = false;
    loadPostcodeScript()
      .then(() => {
        if (cancelled || !embedRef.current || !window.daum?.Postcode) return;
        embedRef.current.innerHTML = '';
        new window.daum.Postcode({
          oncomplete: (data) => {
            if (completedRef.current) return;
            completedRef.current = true;
            setPendingResult(data);
            // 상태 커밋 후 다음 tick에 이전 페이지로 복귀
            setTimeout(() => {
              if (returnTo) navigate(returnTo, { replace: true });
              else navigate(-1);
            }, 0);
          },
          width: '100%',
          height: '100%',
        }).embed(embedRef.current);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[postcode] load failed:', err);
        if (!cancelled) {
          setLoading(false);
          alert('우편번호 서비스를 불러오지 못했습니다.');
          navigate(-1);
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-5 h-14 border-b border-[#F1F3F5] shrink-0 bg-white z-10">
        <h1 className="text-base font-bold text-[#212529]">우편번호 찾기</h1>
        <button
          onClick={() => navigate(-1)}
          aria-label="닫기"
          className="w-9 h-9 -mr-2 rounded-lg flex items-center justify-center text-[#495057] hover:bg-[#F1F3F5] cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
      </header>
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[#868E96] z-10 pointer-events-none">
            우편번호 서비스를 불러오는 중…
          </div>
        )}
        <div ref={embedRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
