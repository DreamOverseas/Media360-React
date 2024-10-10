import React, { useEffect, useRef, useState } from 'react';
import "../css/Advertisement.css";

const NewsTicker = ({ ads }) => {
    const tickerRef = useRef(null);
    const newsContainerRef = useRef(null);
    const [duplicatedItems, setDuplicatedItems] = useState([]);
    let scrollInterval; // Define scrollInterval here so it's accessible

    // Only displays ads with News Text
    const filteredNews = ads.filter(newsItem => newsItem.attributes.NewsText !== null);

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
            setDuplicatedItems((prev) => [...prev, ...filteredNews]);
            newsContentHeight = newsContainer.scrollHeight;
        }

        // Function to start scrolling
        const startScroll = () => {
            // Clear any existing intervals before starting a new one
            if (scrollInterval) {
                clearInterval(scrollInterval);
            }
            scrollInterval = setInterval(() => {
                ticker.scrollTop += 1;

                if (ticker.scrollTop >= newsContainer.scrollHeight / 2) {
                    ticker.scrollTop = 0;
                }
            }, 50); // Adjust scrolling speed here (The larger the slower)
        };

        startScroll(); // Start scrolling initially

        // Pause scrolling on hover
        const pauseScroll = () => clearInterval(scrollInterval);

        // Resume scrolling when mouse leaves
        const resumeScroll = () => startScroll();

        ticker.addEventListener('mouseover', pauseScroll);
        ticker.addEventListener('mouseout', resumeScroll);

        // Cleanup on component unmount
        return () => {
            clearInterval(scrollInterval); // Clear interval on component unmount
            ticker.removeEventListener('mouseover', pauseScroll);
            ticker.removeEventListener('mouseout', resumeScroll);
        };
    }, [duplicatedItems, filteredNews]);

    return (
        <div className="news-ticker-wrapper">
            <h2 className="news-title">Latest News</h2>
            <div className="news-ticker-container" ref={tickerRef}>
                <div className="news-ticker" ref={newsContainerRef}>
                    {duplicatedItems.concat(duplicatedItems).map((item, index) => (
                        <div className="news-item" key={index}>
                            {item.attributes.NewsText}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
