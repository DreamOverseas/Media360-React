import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const MIVoting = () => {
    const url = "https://www.missinternational.world/Index/votelive.html"; // page that changes lively
    const [refreshInterval, setRefreshInterval] = useState(0);
    const [key, setKey] = useState(0);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
    const [isControlPanelVisible, setIsControlPanelVisible] = useState(false);
    const [hideTimeout, setHideTimeout] = useState(null);

    // BETA Function: Test if user opened on WeChat
    const [showModal, setShowModal] = useState(false);
    const [secondModal, setSecondModal] = useState(false);
    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes('micromessenger')) {
            setShowModal(true);
        }
    }, []);

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
        }, 500);
        setHideTimeout(timeout);
    };


    return (
        <div style={styles.votingPage}>
            <div style={styles.miPageContainer}>
                <iframe
                    id="miFrame" 
                    src={url}
                    title="Embedded Page"
                    key={key}
                    style={styles.miWebsite}
                ></iframe>
            </div>

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

            {/* BETA: For WeChat browser FaNs */}
            <Modal show={showModal} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <Modal.Title>请使用浏览器打开</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    您正在使用微信内置浏览器打开此页面。请您点击右上角菜单并选择“在浏览器中打开”以获得完整的浏览体验。
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="alert" onClick={() => setSecondModal(true)}>
                        不听不听，仍要进入
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={secondModal} keyboard={false} centered>
                <Modal.Header>
                    <Modal.Title>Nooooooope。</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    为什么一定要微信呢？相信我，它配不上您！请点击右上角菜单并选择“在浏览器中打开”。
                </Modal.Body>
            </Modal>

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
    miPageContainer: {
        position: 'relative',
        width: '755px',
        height: '755px',
        overflow: 'hidden',
        bordeRadius: '50%',
        clipPath: 'circle(50% at 50% 50%)',
    },
    miWebsite: {
        width: '40vw',
        height: '100vh',
        overflow: 'auto',
        border: 'none',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
        display: 'block',
        transform: "translateY(-140px) translateX(-45px)",
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
