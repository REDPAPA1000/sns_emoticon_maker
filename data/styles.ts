export type StickerStyle = {
  id: string;
  name: string;
  group: 'market' | 'animal' | 'message' | 'reaction' | 'daily' | 'fan';
  description: string;
  bestFor: string;
  sampleImage: string;
  referenceUrl: string;
  prompt: string;
};

export const STYLES: StickerStyle[] = [
  {
    id: 'mini-character',
    name: '미니 캐릭터',
    group: 'market',
    description: '작고 가볍게 쓰는 데일리 메신저 캐릭터 스타일',
    bestFor: '일상 대화',
    sampleImage: '/samples/styles/mini-character.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'small mini emoticon character, compact cute proportions, simple silhouette, clean transparent background, optimized for KakaoTalk chat'
  },
  {
    id: 'soft-animal',
    name: '말랑 동물',
    group: 'animal',
    description: '강아지, 고양이, 반려동물 사진에 잘 맞는 부드러운 스타일',
    bestFor: '반려동물',
    sampleImage: '/samples/styles/soft-animal.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'soft cute animal sticker, round friendly face, warm Korean messenger emoticon style, expressive pose, transparent background'
  },
  {
    id: 'hamster-reaction',
    name: '햄스터 반응',
    group: 'animal',
    description: '볼이 통통하고 감정 표현이 큰 귀여운 반응형 스타일',
    bestFor: '감정 표현',
    sampleImage: '/samples/styles/hamster-reaction.svg',
    referenceUrl: 'https://e.kakao.com/item/hot',
    prompt: 'round hamster reaction sticker, chubby cheeks, exaggerated cute emotion, Korean chat sticker style, transparent background'
  },
  {
    id: 'yellow-dog',
    name: '노란 강아지',
    group: 'animal',
    description: '친근하고 밝은 강아지형 생활 이모티콘 스타일',
    bestFor: '친구 대화',
    sampleImage: '/samples/styles/yellow-dog.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'friendly yellow dog character sticker, simple cute face, casual Korean emoticon style, daily chat expression, transparent background'
  },
  {
    id: 'polite-message',
    name: '공손 메시지',
    group: 'message',
    description: '감사, 확인, 사과처럼 문구가 중심인 실용 스타일',
    bestFor: '가족/업무',
    sampleImage: '/samples/styles/polite-message.svg',
    referenceUrl: 'https://e.kakao.com/item/hot',
    prompt: 'polite Korean message sticker, cute character holding readable text sign, clean typography, warm tone, transparent background'
  },
  {
    id: 'big-text',
    name: '큰 글자',
    group: 'message',
    description: '짧은 문구가 먼저 보이는 즉답형 메신저 스타일',
    bestFor: '축하/확인',
    sampleImage: '/samples/styles/big-text.svg',
    referenceUrl: 'https://e.kakao.com/style/group/12?sort=HOT&t_obj=search_style',
    prompt: 'large Korean text sticker, bold readable lettering, small cute accent character, KakaoTalk big emoticon style, transparent background'
  },
  {
    id: 'hand-drawn-talk',
    name: '손그림 톡',
    group: 'reaction',
    description: '가볍게 그린 듯한 친근한 낙서형 반응 스타일',
    bestFor: '가벼운 답장',
    sampleImage: '/samples/styles/hand-drawn-talk.svg',
    referenceUrl: 'https://e.kakao.com/style/group/12?sort=HOT&t_obj=search_style',
    prompt: 'casual hand drawn Korean doodle sticker, friendly messy lines, readable expression, transparent background'
  },
  {
    id: 'meme-jjal',
    name: '짤 반응',
    group: 'reaction',
    description: '과장된 표정과 짧은 문구로 바로 쓰는 리액션 스타일',
    bestFor: '친구방 반응',
    sampleImage: '/samples/styles/meme-jjal.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'Korean meme reaction sticker, exaggerated funny expression, short readable Korean caption, clean sticker cutout, transparent background'
  },
  {
    id: 'work-life',
    name: '회사생활',
    group: 'daily',
    description: '회사, 학교, 단톡방에서 쓰기 좋은 현실 반응 스타일',
    bestFor: '업무/단체방',
    sampleImage: '/samples/styles/work-life.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'office life reaction sticker, tired but cute character, polite social expression, Korean workplace chat humor, transparent background'
  },
  {
    id: 'couple-heart',
    name: '커플 하트',
    group: 'daily',
    description: '애정, 고마움, 응원을 말랑하게 표현하는 스타일',
    bestFor: '커플 대화',
    sampleImage: '/samples/styles/couple-heart.svg',
    referenceUrl: 'https://e.kakao.com/t/true-love',
    prompt: 'cute couple sticker, soft heart mood, affectionate Korean chat emoticon, rounded characters, transparent background'
  },
  {
    id: 'line-mascot',
    name: '라인 마스코트',
    group: 'market',
    description: '선명한 윤곽과 큰 표정의 글로벌 메신저형 스타일',
    bestFor: 'LINE용',
    sampleImage: '/samples/styles/line-mascot.svg',
    referenceUrl: 'https://store.line.me/stickershop',
    prompt: 'clean mascot sticker for LINE messenger, bold outline, expressive face, readable Korean caption, transparent background'
  },
  {
    id: 'idol-fan',
    name: '응원봉 팬덤',
    group: 'fan',
    description: '축하, 응원, 감탄 문구에 어울리는 밝은 팬덤 스타일',
    bestFor: '응원/축하',
    sampleImage: '/samples/styles/idol-fan.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'K-pop fandom cheering sticker, cute character with lightstick, sparkles, supportive Korean caption, transparent background'
  }
];
