// src/components/SquarePaymentButton.jsx
import React from "react";

const SquarePaymentButton = ({ url, text = "Pay now" }) => {
  // If no URL is provided, fall back to the one provided in the prompt
  const checkoutUrl = url || "https://square.link/u/7ghUEtOs?src=embed";

  const showCheckoutWindow = (e) => {
    e.preventDefault();

    const title = "Square Payment Links";

    // Some platforms embed in an iframe, so we want to top window to calculate sizes correctly
    const topWindow = window.top ? window.top : window;

    // Fixes dual-screen position
    const dualScreenLeft =
      topWindow.screenLeft !== undefined ? topWindow.screenLeft : topWindow.screenX;
    const dualScreenTop =
      topWindow.screenTop !== undefined ? topWindow.screenTop : topWindow.screenY;

    const width = topWindow.innerWidth
      ? topWindow.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = topWindow.innerHeight
      ? topWindow.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const h = height * 0.75;
    const w = 500;

    const systemZoom = width / topWindow.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    const newWindow = window.open(
      checkoutUrl,
      title,
      `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`
    );

    if (window.focus && newWindow) newWindow.focus();
  };

  return (
    <div
      style={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "259px",
        background: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "-2px 10px 5px rgba(0, 0, 0, 0)",
        borderRadius: "10px",
        fontFamily: "SQ Market, Helvetica, Arial, sans-serif",
        marginBottom: "20px" // Added for spacing in layouts
      }}
    >
      <div style={{ padding: "20px" }}>
        <a
          target="_blank"
          href={checkoutUrl}
          onClick={showCheckoutWindow}
          style={{
            display: "inline-block",
            fontSize: "18px",
            lineHeight: "48px",
            height: "48px",
            color: "#ffffff",
            minWidth: "212px",
            backgroundColor: "#006aff",
            textAlign: "center",
            boxShadow: "0 0 0 1px rgba(0,0,0,.1) inset",
            borderRadius: "6px",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {text}
        </a>
      </div>
    </div>
  );
};

export default SquarePaymentButton;