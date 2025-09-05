import { useEffect, useState } from "react";
import QRCode from "qrcode";

function QRDisplay({ hash, className }) {
    const [qrUrl, setQrUrl] = useState("");

    useEffect(() => {
        if (!hash) return;
        QRCode.toDataURL(hash, { width: 256, margin: 1 })
            .then(setQrUrl)
            .catch(console.error);
    }, [hash]);

    return qrUrl ? <img src={qrUrl} alt="QR Code" className={className} /> : null;
}

export default QRDisplay;
