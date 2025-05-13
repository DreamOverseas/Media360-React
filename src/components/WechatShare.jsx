import { useEffect } from 'react';
export default function WechatShare({ title, desc, link, imgUrl }) {
  useEffect(() => {
    function onBridgeReady() {
      // 朋友圈分享
      WeixinJSBridge.on('menu:share:timeline', () => {
        WeixinJSBridge.invoke('shareTimeline', {
          title,
          link,
          img_url: imgUrl,
        });
      });
      // 好友分享
      WeixinJSBridge.on('menu:share:appmessage', () => {
        WeixinJSBridge.invoke('sendAppMessage', {
          title,
          desc,
          link,
          img_url: imgUrl,
        });
      });
    }

    if (typeof WeixinJSBridge === 'undefined') {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else {
      onBridgeReady();
    }

    // 可选：在组件卸载时，移除事件监听
    return () => {
      if (typeof WeixinJSBridge !== 'undefined') {
        WeixinJSBridge.off('menu:share:timeline');
        WeixinJSBridge.off('menu:share:appmessage');
      } else {
        document.removeEventListener('WeixinJSBridgeReady', onBridgeReady);
      }
    };
  }, [title, desc, link, imgUrl]);

  // 该组件无需渲染任何 DOM
  return null;
}