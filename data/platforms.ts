export type PlatformPreset = {
  id: string;
  name: string;
  width: number;
  height: number;
  size: string;
  export: string;
  note: string;
};

export const PLATFORMS: PlatformPreset[] = [
  { id:'kakao', name:'카카오톡', width:360, height:360, size:'360 x 360', export:'PNG ZIP', note:'카카오 이모티콘 스튜디오 제출 준비용. 최종 심사는 카카오에서 진행.' },
  { id:'telegram', name:'텔레그램', width:512, height:512, size:'512 x 512', export:'PNG ZIP', note:'텔레그램 스티커팩 업로드 준비용.' },
  { id:'whatsapp', name:'왓츠앱', width:512, height:512, size:'512 x 512', export:'PNG ZIP', note:'왓츠앱 스티커 앱 또는 변환 도구에 넣기 쉬운 구성.' },
  { id:'discord', name:'디스코드', width:320, height:320, size:'320 x 320', export:'PNG ZIP', note:'디스코드 서버 이모지/스티커 업로드용.' },
  { id:'line', name:'LINE', width:370, height:320, size:'370 x 320', export:'PNG ZIP', note:'LINE Creators Market 제출 준비용.' },
  { id:'instagram', name:'인스타그램', width:512, height:512, size:'512 x 512', export:'PNG ZIP', note:'스토리 스티커, 릴스, 게시물 반응 이미지용.' }
];
