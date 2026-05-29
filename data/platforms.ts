export type PlatformPreset = { id:string; name:string; size:string; export:string; note:string; };
export const PLATFORMS: PlatformPreset[] = [
  { id:'kakao', name:'카카오톡', size:'360 x 360', export:'PNG/GIF ZIP', note:'제출용 세트 제작 보조. 최종 심사는 카카오 이모티콘 스튜디오에서 진행.' },
  { id:'telegram', name:'텔레그램', size:'512 기준', export:'PNG/WEBP ZIP', note:'스티커팩 제작용 이미지로 내보내기.' },
  { id:'whatsapp', name:'왓츠앱', size:'512 x 512', export:'WEBP/PNG ZIP', note:'스티커 앱 또는 변환 도구에 넣기 쉬운 구성.' },
  { id:'discord', name:'디스코드', size:'320 x 320', export:'PNG/APNG ZIP', note:'서버 이모지/스티커 업로드용.' },
  { id:'line', name:'LINE', size:'PNG 세트', export:'PNG ZIP', note:'LINE Creators Market 제출 준비용.' },
  { id:'instagram', name:'인스타그램', size:'투명 GIF/PNG', export:'GIF/PNG ZIP', note:'스토리 스티커, 릴스, 게시물 반응 이미지용.' }
];
