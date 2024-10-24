import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

const MIVoting = () => {
    const url = "https://www.missinternational.world/Index/votenow.html";
    const [refreshInterval, setRefreshInterval] = useState(0);
    const [key, setKey] = useState(0);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
    const [isControlPanelVisible, setIsControlPanelVisible] = useState(true);
    const [hideTimeout, setHideTimeout] = useState(null);

    useEffect(() => {
        if (!autoRefreshEnabled) return;

        const intervalId = setInterval(() => {
            setKey(prevKey => prevKey + 1);
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [refreshInterval, autoRefreshEnabled]);

    const handleRefreshIntervalChange = (event) => {
        const value = Number(event.target.value);
        if (value === 0) {
            setAutoRefreshEnabled(false);
        } else {
            setAutoRefreshEnabled(true);
        }
        setRefreshInterval(value);
    };

    const handleForceRefresh = () => {
        setKey(prevKey => prevKey + 1);
    };
    
    const showControlPanel = () => {
        setIsControlPanelVisible(true);
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            setHideTimeout(null);
        }
    };

    const hideControlPanel = () => {
        const timeout = setTimeout(() => {
            setIsControlPanelVisible(false);
        }, 2000);
        setHideTimeout(timeout);
    };
    return (
        <div style={styles.votingPage}>
            <iframe
                src={url}
                title="Embedded Page"
                key={key}
                style={styles.miWebsite}
            ></iframe>

            <div style={{
                    ...styles.refreshControlPanel, 
                    opacity: isControlPanelVisible ? 1 : 0,
                    transition: 'opacity 0.5s',
                }}
                onMouseEnter={showControlPanel}
                onMouseLeave={hideControlPanel}
            >
                <Form.Group controlId="refreshSpeed">
                    <Form.Label>刷新间隔：</Form.Label>
                    <Form.Control
                        as="select"
                        value={refreshInterval}
                        onChange={handleRefreshIntervalChange}
                    >
                        <option value={0}>手动刷新</option>
                        <option value={5000}>每5s</option>
                        <option value={10000}>每10s</option>
                        <option value={30000}>每30s</option>
                    </Form.Control>
                </Form.Group>
                <Button 
                    variant="primary" 
                    style={styles.refreshButton} 
                    onClick={handleForceRefresh}
                >
                    现在刷新！
                </Button>
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
    },
    refreshButton: {
        marginTop: '10px',
        width: '90%',
    }
};

export default MIVoting;
