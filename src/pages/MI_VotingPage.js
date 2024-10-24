import React from 'react';

const MIVoting = () => {
    return (
        <div style={styles.votingPage}>
            <iframe 
                src="https://www.missinternational.world/Index/votenow.html"
                title="Embedded Page"
                style={styles.miWebsite}
            ></iframe>
        </div>
    );
};

const styles = {
    votingPage: {
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: 'url("/homepage/bg_clear.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miWebsite: {
        width: '40vw',
        height: '100vh',
        overflow: 'auto',
        border: 'none',
        borderRadius: '10px', 
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
        display: 'block',
    }
};

export default MIVoting;
