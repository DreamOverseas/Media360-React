import React, { useEffect, useState } from 'react';

const WeChatBlocker = () => {
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('micromessenger')) {
      setIsWeChat(true);

      // ✅ 禁止滚动
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';

      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.width = '100%';
    }

    return () => {
      // ✅ 恢复滚动
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';

      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
    };
  }, []);

  if (!isWeChat) return null;

  return (
    <div style={{
      position: 'fixed',
      zIndex: 9999,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#fff',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '20%', 
      textAlign: 'center',
      padding: '20px',
    }}>
      <img
        src="/browser_open.png"
        alt="请在浏览器中打开"
        style={{ maxWidth: '80%', borderRadius: '8px' }}
      />
      <p style={{ marginTop: '20px', fontSize: '18px', lineHeight: '1.6' }}>
        请点击右上角「···」<br />
        选择「在浏览器中打开」
      </p>
    </div>
  );
};

export default WeChatBlocker;