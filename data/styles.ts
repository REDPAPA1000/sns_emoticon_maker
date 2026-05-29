export type StickerStyle = {
  id: string;
  name: string;
  group: 'cute' | 'meme' | 'art' | 'trend' | 'minimal' | 'pet';
  description: string;
  bestFor: string;
  sampleImage: string;
  prompt: string;
};

export const STYLES: StickerStyle[] = [
  {
    id: 'chibi',
    name: 'Chibi',
    group: 'cute',
    description: 'Big head, small body, bright cute proportions.',
    bestFor: 'People, idols, characters',
    sampleImage: '/samples/styles/chibi.svg',
    prompt: 'cute chibi sticker, big head, small body, kawaii, clean white outline, transparent background, expressive face'
  },
  {
    id: 'korean-messenger',
    name: 'K-Messenger',
    group: 'cute',
    description: 'Soft rounded messenger sticker with simple emotion.',
    bestFor: 'Daily chat reactions',
    sampleImage: '/samples/styles/korean-messenger.svg',
    prompt: 'simple rounded character, soft color palette, minimal facial features, cute korean messenger sticker style, clean outline, transparent background'
  },
  {
    id: 'line-mascot',
    name: 'Mascot',
    group: 'cute',
    description: 'Bold mascot look with clear outline and readable pose.',
    bestFor: 'Brand-like sticker sets',
    sampleImage: '/samples/styles/line-mascot.svg',
    prompt: 'bold outline cute mascot, high contrast, funny expression, sticker pack style, transparent background'
  },
  {
    id: 'webtoon',
    name: 'Webtoon',
    group: 'art',
    description: 'Comic-panel expression with dramatic Korean webtoon energy.',
    bestFor: 'Strong emotion scenes',
    sampleImage: '/samples/styles/webtoon.svg',
    prompt: 'korean webtoon character, comic expression, dramatic emotion, clean sticker format, transparent background'
  },
  {
    id: 'toy-3d',
    name: '3D Toy',
    group: 'trend',
    description: 'Glossy toy figure with soft lighting and rounded depth.',
    bestFor: 'Trendy profile stickers',
    sampleImage: '/samples/styles/toy-3d.svg',
    prompt: '3d toy character, cute vinyl figure, soft lighting, rounded shape, high detail, transparent background'
  },
  {
    id: 'meme-reaction',
    name: 'Meme Reaction',
    group: 'meme',
    description: 'Exaggerated reaction image for humorous replies.',
    bestFor: 'SNS comments and jokes',
    sampleImage: '/samples/styles/meme-reaction.svg',
    prompt: 'funny meme sticker, reaction image, exaggerated facial expression, absurd humor, transparent background'
  },
  {
    id: 'pet-kawaii',
    name: 'Pet Kawaii',
    group: 'pet',
    description: 'Soft animal-focused sticker with cute expression.',
    bestFor: 'Dogs, cats, pet photos',
    sampleImage: '/samples/styles/pet-kawaii.svg',
    prompt: 'cute pet sticker, kawaii animal, expressive face, clean sticker cut, transparent background'
  },
  {
    id: 'flat-emoji',
    name: 'Flat Emoji',
    group: 'minimal',
    description: 'Simple flat vector style with clear emoji readability.',
    bestFor: 'Small icons and quick reactions',
    sampleImage: '/samples/styles/flat-emoji.svg',
    prompt: 'flat design, simple emoji character, clean vector look, minimal details, transparent background'
  },
  {
    id: 'kpop-fandom',
    name: 'K-Pop Fandom',
    group: 'trend',
    description: 'Cheering pose, sparkles, and fan-sign energy.',
    bestFor: 'Fan accounts and support sets',
    sampleImage: '/samples/styles/kpop-fandom.svg',
    prompt: 'kpop fan sticker, cute cheering pose, sparkles, fandom expression, transparent background'
  },
  {
    id: 'doodle',
    name: 'Doodle',
    group: 'meme',
    description: 'Loose hand-drawn lines with casual charm.',
    bestFor: 'Low-effort funny stickers',
    sampleImage: '/samples/styles/doodle.svg',
    prompt: 'hand drawn doodle, rough sketch, messy lines, simple expression, intentionally careless funny sticker, transparent background'
  },
  {
    id: 'child-crayon',
    name: 'Crayon',
    group: 'art',
    description: 'Childlike crayon texture with imperfect coloring.',
    bestFor: 'Warm, playful concepts',
    sampleImage: '/samples/styles/child-crayon.svg',
    prompt: 'child drawing style, crayon illustration, cute and innocent, imperfect coloring, transparent background'
  },
  {
    id: 'stickman',
    name: 'Stickman',
    group: 'meme',
    description: 'Minimal stick figure pose with readable action.',
    bestFor: 'Fast reaction sets',
    sampleImage: '/samples/styles/stickman.svg',
    prompt: 'stickman character, simple black lines, funny pose, reaction sticker, transparent background'
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    group: 'trend',
    description: 'Retro game-like pixel sticker with blocky details.',
    bestFor: 'Gaming and retro themes',
    sampleImage: '/samples/styles/pixel.svg',
    prompt: 'pixel art character, 8 bit game style, retro sticker, cute animation frame, transparent background'
  },
  {
    id: 'paper-cutout',
    name: 'Paper Cutout',
    group: 'art',
    description: 'Layered paper collage with handmade depth.',
    bestFor: 'Crafty, editorial stickers',
    sampleImage: '/samples/styles/paper-cutout.svg',
    prompt: 'paper cutout art, handmade collage, layered paper texture, cute sticker, transparent background'
  },
  {
    id: 'clay',
    name: 'Clay',
    group: 'trend',
    description: 'Soft clay sculpture look with tactile texture.',
    bestFor: 'Cute object and mascot sets',
    sampleImage: '/samples/styles/clay.svg',
    prompt: 'clay character, handcrafted toy, cute sculpture, soft texture, transparent background'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    group: 'art',
    description: 'Soft brush edges and gentle translucent color.',
    bestFor: 'Calm emotional stickers',
    sampleImage: '/samples/styles/watercolor.svg',
    prompt: 'watercolor illustration, soft brush strokes, pastel colors, cute character sticker, transparent background'
  },
  {
    id: 'glitch',
    name: 'AI Glitch',
    group: 'trend',
    description: 'Digital distortion with cyber-style accents.',
    bestFor: 'Tech and future mood',
    sampleImage: '/samples/styles/glitch.svg',
    prompt: 'glitch art character, digital distortion, cyber aesthetic, sticker design, transparent background'
  },
  {
    id: 'graffiti',
    name: 'Graffiti',
    group: 'trend',
    description: 'Street-art outline, spray texture, and energetic color.',
    bestFor: 'Bold social posts',
    sampleImage: '/samples/styles/graffiti.svg',
    prompt: 'graffiti sticker character, spray paint texture, street art style, bold outlines, transparent background'
  }
];
