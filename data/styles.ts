export type StickerStyle = {
  id: string;
  name: string;
  group: 'cute' | 'meme' | 'art' | 'trend' | 'minimal' | 'pet';
  description: string;
  prompt: string;
};

export const STYLES: StickerStyle[] = [
  { id:'chibi', name:'치비', group:'cute', description:'큰 머리, 작은 몸, 귀여운 비율', prompt:'cute chibi sticker, big head, small body, kawaii, clean white outline, transparent background, expressive face' },
  { id:'korean-messenger', name:'한국 메신저풍', group:'cute', description:'둥글고 단순한 대화용 스티커 감성', prompt:'simple rounded character, soft color palette, minimal facial features, cute korean messenger sticker style, clean outline, transparent background' },
  { id:'line-mascot', name:'마스코트풍', group:'cute', description:'굵은 외곽선과 또렷한 감정 표현', prompt:'bold outline cute mascot, high contrast, funny expression, sticker pack style, transparent background' },
  { id:'webtoon', name:'웹툰', group:'art', description:'한국 웹툰 느낌의 과장된 표정', prompt:'korean webtoon character, comic expression, dramatic emotion, clean sticker format, transparent background' },
  { id:'toy-3d', name:'3D 피규어', group:'trend', description:'말랑한 장난감 피규어 같은 질감', prompt:'3d toy character, cute vinyl figure, soft lighting, rounded shape, high detail, transparent background' },
  { id:'meme-reaction', name:'밈 반응짤', group:'meme', description:'SNS 댓글에 쓰기 좋은 과장 반응', prompt:'funny meme sticker, reaction image, exaggerated facial expression, absurd humor, transparent background' },
  { id:'pet-kawaii', name:'반려동물', group:'pet', description:'강아지/고양이 등 동물 이미지에 적합', prompt:'cute pet sticker, kawaii animal, expressive face, clean sticker cut, transparent background' },
  { id:'japanese-kawaii', name:'일본 카와이', group:'cute', description:'파스텔과 귀여운 마스코트 느낌', prompt:'japanese mascot, super cute, pastel colors, kawaii sticker, transparent background' },
  { id:'flat-emoji', name:'플랫 이모지', group:'minimal', description:'심플한 벡터 이모지 느낌', prompt:'flat design, simple emoji character, clean vector look, minimal details, transparent background' },
  { id:'kpop-fandom', name:'K-팬덤', group:'trend', description:'응원봉, 반짝임, 팬덤 감성', prompt:'kpop fan sticker, cute cheering pose, sparkles, fandom expression, transparent background' },
  { id:'doodle', name:'끄적끄적 낙서', group:'meme', description:'일부러 대충 그린 듯한 매력', prompt:'hand drawn doodle, rough sketch, messy lines, simple expression, intentionally careless funny sticker, transparent background' },
  { id:'child-crayon', name:'그림일기', group:'art', description:'크레파스와 어린이 그림 같은 순수함', prompt:'child drawing style, crayon illustration, cute and innocent, imperfect coloring, transparent background' },
  { id:'stickman', name:'막대인간', group:'meme', description:'단순하지만 밈으로 쓰기 쉬운 스타일', prompt:'stickman character, simple black lines, funny pose, reaction sticker, transparent background' },
  { id:'ugly-cute', name:'B급 병맛', group:'meme', description:'못생겼는데 귀여운 개성파', prompt:'weird funny character, ugly cute, absurd humor, intentionally awkward proportions, transparent background' },
  { id:'pixel', name:'픽셀 아트', group:'trend', description:'8비트 게임 감성', prompt:'pixel art character, 8 bit game style, retro sticker, cute animation frame, transparent background' },
  { id:'paper-cutout', name:'종이 오려붙이기', group:'art', description:'수제 콜라주 질감', prompt:'paper cutout art, handmade collage, layered paper texture, cute sticker, transparent background' },
  { id:'clay', name:'클레이 인형', group:'trend', description:'찰흙으로 만든 듯한 따뜻한 질감', prompt:'clay character, handcrafted toy, cute sculpture, soft texture, transparent background' },
  { id:'watercolor', name:'수채화', group:'art', description:'부드러운 색감과 감성적인 붓터치', prompt:'watercolor illustration, soft brush strokes, pastel colors, cute character sticker, transparent background' },
  { id:'glitch', name:'AI 글리치', group:'trend', description:'디지털 노이즈와 미래적 분위기', prompt:'glitch art character, digital distortion, cyber aesthetic, sticker design, transparent background' },
  { id:'graffiti', name:'그래피티', group:'trend', description:'스프레이 페인트와 스트릿 감성', prompt:'graffiti sticker character, spray paint texture, street art style, bold outlines, transparent background' }
];
