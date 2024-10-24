import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

const MIVoting = () => {
    const [refreshInterval, setRefreshInterval] = useState(5000);
    const [key, setKey] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setKey(prevKey => prevKey + 1);
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [refreshInterval]);

    const handleRefreshIntervalChange = (event) => {
        setRefreshInterval(Number(event.target.value));
    };

    return (
        <div style={styles.votingPage}>
            <iframe
                src="https://www.missinternational.world/Index/votenow.html"
                title="Embedded Page"
                key={key}
                style={styles.miWebsite}
            ></iframe>

            <div style={styles.refreshControlPanel}>
                <Form.Group controlId="refreshSpeed">
                    <Form.Label>刷新间隔：</Form.Label>
                    <Form.Control
                        as="select"
                        value={refreshInterval}
                        onChange={handleRefreshIntervalChange}
                    >
                        <option value={2000}>每2s</option>
                        <option value={5000}>每5s</option>
                        <option value={10000}>每10s</option>
                        <option value={30000}>每30s</option>
                    </Form.Control>
                </Form.Group>
                {/* <Button onClick={}>
                    现在刷新
                </Button> */}
            </div>
        </div>
    );
};

const styles = {
    votingPage: {
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: 'url("/mi_bg.png")',
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
    },
    refreshControlPanel: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
    }
};

export default MIVoting;
