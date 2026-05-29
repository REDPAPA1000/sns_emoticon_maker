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
    description: '작고 가볍게 쓰는 미니 이모티콘형 캐릭터.',
    bestFor: '일상 대화',
    sampleImage: '/samples/styles/mini-character.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'small mini emoticon character, compact cute proportions, simple silhouette, clean transparent background, optimized for KakaoTalk chat'
  },
  {
    id: 'soft-animal',
    name: '말랑 동물',
    group: 'animal',
    description: '햄스터, 강아지, 고양이처럼 호감도 높은 동물형.',
    bestFor: '반려동물 사진',
    sampleImage: '/samples/styles/soft-animal.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'soft cute animal sticker, round friendly face, warm Korean messenger emoticon style, expressive pose, transparent background'
  },
  {
    id: 'small-gray-cat',
    name: '회색 고양이',
    group: 'animal',
    description: '무심하고 귀여운 고양이 리액션 스타일.',
    bestFor: '시크한 반응',
    sampleImage: '/samples/styles/small-gray-cat.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'small gray cat sticker, calm deadpan expression, cute but dry humor, clean outline, transparent background'
  },
  {
    id: 'hamster-reaction',
    name: '햄스터 리액션',
    group: 'animal',
    description: '표정이 잘 보이는 둥근 햄스터 리액션.',
    bestFor: '귀여운 감정표현',
    sampleImage: '/samples/styles/hamster-reaction.svg',
    referenceUrl: 'https://e.kakao.com/item/hot',
    prompt: 'round hamster reaction sticker, chubby cheeks, exaggerated cute emotion, Korean chat sticker style, transparent background'
  },
  {
    id: 'yellow-dog',
    name: '누렁이 감성',
    group: 'animal',
    description: '친근한 강아지 캐릭터형 생활 이모티콘.',
    bestFor: '친구 대화',
    sampleImage: '/samples/styles/yellow-dog.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'friendly yellow dog character sticker, simple cute face, casual Korean emoticon style, daily chat expression, transparent background'
  },
  {
    id: 'polite-message',
    name: '공손 메시지',
    group: 'message',
    description: '감사, 확인, 부탁처럼 문구가 중심인 스타일.',
    bestFor: '직장/가족 대화',
    sampleImage: '/samples/styles/polite-message.svg',
    referenceUrl: 'https://e.kakao.com/item/hot',
    prompt: 'polite Korean message sticker, cute character holding readable text sign, clean typography, warm tone, transparent background'
  },
  {
    id: 'work-life',
    name: '사회생활',
    group: 'daily',
    description: '회사, 학교, 단톡방에서 쓰기 좋은 현실 리액션.',
    bestFor: '업무/단체방',
    sampleImage: '/samples/styles/work-life.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'office life reaction sticker, tired but cute character, polite social expression, Korean workplace chat humor, transparent background'
  },
  {
    id: 'couple-heart',
    name: '커플 하트',
    group: 'daily',
    description: '사랑, 애정, 삐짐을 말랑하게 표현하는 커플형.',
    bestFor: '커플 대화',
    sampleImage: '/samples/styles/couple-heart.svg',
    referenceUrl: 'https://e.kakao.com/t/true-love',
    prompt: 'cute couple sticker, soft heart mood, affectionate Korean chat emoticon, rounded characters, transparent background'
  },
  {
    id: 'meme-jjal',
    name: '짤 반응',
    group: 'reaction',
    description: '과장된 표정과 짧은 문구로 바로 쓰는 짤 스타일.',
    bestFor: '친구방/댓글',
    sampleImage: '/samples/styles/meme-jjal.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'Korean meme reaction sticker, exaggerated funny expression, short readable Korean caption, clean sticker cutout, transparent background'
  },
  {
    id: 'big-text',
    name: '큰글씨 톡',
    group: 'message',
    description: '큰 문구와 작은 캐릭터를 결합한 즉답형.',
    bestFor: '축하/답장',
    sampleImage: '/samples/styles/big-text.svg',
    referenceUrl: 'https://e.kakao.com/style/group/12?sort=HOT&t_obj=search_style',
    prompt: 'large Korean text sticker, bold readable lettering, small cute accent character, KakaoTalk big emoticon style, transparent background'
  },
  {
    id: 'hand-drawn-talk',
    name: '낙서톡',
    group: 'reaction',
    description: '일부러 가볍게 그린 듯한 친근한 손그림.',
    bestFor: '가벼운 농담',
    sampleImage: '/samples/styles/hand-drawn-talk.svg',
    referenceUrl: 'https://e.kakao.com/style/group/12?sort=HOT&t_obj=search_style',
    prompt: 'casual hand drawn Korean doodle sticker, friendly messy lines, readable expression, transparent background'
  },
  {
    id: 'idol-fan',
    name: '팬덤 응원',
    group: 'fan',
    description: '응원봉, 반짝임, 축하 문구가 있는 팬덤형.',
    bestFor: '덕질/응원',
    sampleImage: '/samples/styles/idol-fan.svg',
    referenceUrl: 'https://e.kakao.com/search',
    prompt: 'K-pop fandom cheering sticker, cute character with lightstick, sparkles, supportive Korean caption, transparent background'
  }
];
