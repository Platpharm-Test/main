const CHOSEONG = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ',
  'ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

/** 한글 문자 → 초성, 비한글은 그대로 반환 */
function getChoseong(ch: string): string {
  const code = ch.charCodeAt(0);
  if (code >= 0xAC00 && code <= 0xD7A3) {
    return CHOSEONG[Math.floor((code - 0xAC00) / 588)];
  }
  return ch;
}

/** 쿼리가 순수 초성(자음)으로만 이루어져 있는지 */
function isChoseongOnly(str: string): boolean {
  return [...str].every((ch) => CHOSEONG.includes(ch));
}

/**
 * 초성 검색을 지원하는 문자열 매칭.
 * - 쿼리가 자음만이면: target 각 글자의 초성을 추출해 연속 매칭
 * - 그 외: 일반 includes 매칭
 */
export function matchSearch(target: string, query: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // 일반 매칭 먼저
  if (t.includes(q)) return true;

  // 초성 매칭: 쿼리가 자음으로만 이루어진 경우
  if (isChoseongOnly(query)) {
    const targetChoseongs = [...target].map(getChoseong);
    // target 내에서 연속된 초성 시퀀스가 query와 일치하는 위치 찾기
    const qLen = query.length;
    const tLen = targetChoseongs.length;
    for (let i = 0; i <= tLen - qLen; i++) {
      let match = true;
      for (let j = 0; j < qLen; j++) {
        if (targetChoseongs[i + j] !== query[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }

  return false;
}
