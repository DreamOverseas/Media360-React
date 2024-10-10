import React, { useEffect, useRef, useState } from 'react';
import "../css/Advertisement.css";

const newsItems = [
  'Breaking: Stock Market Hits Record High',
  'Weather Update: Heavy Rain Expected Tomorrow',
  'Tech News: New AI Breakthrough Announced',
  'Sports: Local Team Wins Championship',
  'World News: New International Trade Deal Signed',
];

const NewsTicker = () => {
    const tickerRef = useRef(null);
    const newsContainerRef = useRef(null);
    const [duplicatedItems, setDuplicatedItems] = useState([]);

    useEffect(() => {
        const ticker = tickerRef.current;
        const newsContainer = newsContainerRef.current;

        // validation
        if (!ticker || !newsContainer) return;

        const tickerHeight = ticker.clientHeight;
        let newsContentHeight = newsContainer.scrollHeight;

        // Duplicate news items enough times to ensure scrolling
        let duplicateTimes = 1;
        const maxDuplicates = 20; // Safety limit (Meh if infinitely looped)
        while (newsContentHeight < tickerHeight * 2 && duplicateTimes < maxDuplicates) {
            duplicateTimes++;
            setDuplicatedItems((prev) => [...prev, ...newsItems]);
            newsContentHeight = newsContainer.scrollHeight;
        }

        let scrollInterval;
        const startScroll = () => {
            scrollInterval = setInterval(() => {
                ticker.scrollTop += 1;

                if (ticker.scrollTop >= newsContainer.scrollHeight / 2) {
                    ticker.scrollTop = 0;
                }
            }, 50); // Adjust scrolling speed here~ (The larger the slower)
        };

        startScroll();

        // Pause scrolling on hover
        ticker.addEventListener('mouseover', () => clearInterval(scrollInterval));
        ticker.addEventListener('mouseout', startScroll);

        // Cleanup on component unmount
        return () => clearInterval(scrollInterval);
    }, [duplicatedItems]);

    return (
        <div className="news-ticker-wrapper">
            <h2 className="news-title">Latest News</h2>
            <div className="news-ticker-container" ref={tickerRef}>
                <div className="news-ticker" ref={newsContainerRef}>
                    {duplicatedItems.concat(duplicatedItems).map((item, index) => (
                        <div className="news-item" key={index}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
