chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'make-sns-emoticon',
    title: '이 이미지로 SNS 이모티콘 만들기',
    contexts: ['image']
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== 'make-sns-emoticon') return;
  const appUrl = 'https://YOUR-VERCEL-APP.vercel.app';
  const url = `${appUrl}?imageUrl=${encodeURIComponent(info.srcUrl || '')}`;
  chrome.tabs.create({ url });
});
