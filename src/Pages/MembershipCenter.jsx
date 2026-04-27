import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../Css/MemberCenter.css';
import { MemberPointMarket } from 'oneclub-member-shop';
import DetailUpdateBtn from '../Components/DetailUpdateBtn';
import MembershipSale from '../Components/MemberSale';
import MemberPointTopupBtn from '../Components/MemberPointTopupBtn';
import News from '../Components/News.jsx';
import AnnualBooking from '../Components/AnnualBooking.jsx';
import MembershipManual from '../Components/MembershipManual.jsx';

const MemberCenter = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    const CMSEndpoint = import.meta.env.VITE_CMS_ENDPOINT;
    const CMSApiKey = import.meta.env.VITE_CMS_TOKEN;

    useEffect(() => {
        async function fetchAndSetUserData() {
            // Attempt to get the 'user' from a cookie
            const userCookie = Cookies.get('user');
            if (userCookie) {
                setUser(JSON.parse(userCookie));
            } else {
                navigate('/');
                return;
            }

            const apiUrl = `https://api.do360.com/api/one-club-memberships?filters[Email][$eq]=${JSON.parse(userCookie).email}`;

            try {
                // Make the API call to fetch the user data
                const userRes = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CMSApiKey}`
                    }
                });

                // If the API call is successful, update the user cookie
                if (userRes.ok) {
                    const userData = await userRes.json();
                    updateUserCookie(userData.data[0]);
                } else {
                    // If response is not successful, clean up cookies and navigate to the home page
                    Cookies.remove("user");
                    Cookies.remove("AuthToken");
                    navigate("/");
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Cookies.remove("user");
                // Cookies.remove("AuthToken");
                // navigate("/");
            } finally {
                setLoading(false);
            }
        }

        // Call the asynchronous function defined inside the effect
        fetchAndSetUserData();
    }, [navigate]);


    const updateUserCookie = (userdata) => {
        const existingCookie = JSON.parse(Cookies.get('user') || '{}');
        const memberCookie = {
            ...existingCookie,
            name: userdata.Name || existingCookie.name,
            email: userdata.Email || existingCookie.email,
            number: userdata.MembershipNumber || 'N/A',
            address: userdata.Address || 'Not Specified',
            phone: userdata.Phone || 'Not Specified',
            referee: userdata.Referee || 'Not Specified',
            currentStatus: userdata.CurrentStatus || 'N/A',
            occupation: userdata.Occupation || 'Not Specified',
            membershipClass: userdata.MembershipClass || 'N/A',
            exp: userdata.ExpiryDate || 'N/A',
            point: userdata.Point ?? 0,
            discountPoint: userdata.DiscountPoint ?? 0,
            loyaltyPoint: userdata.LoyaltyPoint ?? 0,
            legalName: userdata.LegalName || 'Not Specified',
        };
        Cookies.set('user', JSON.stringify(memberCookie));
        setUser(memberCookie);
    }

    if (!user) {
        return null;
    }

    return (
        <Container className="my-5 member-center">
            <h1 className="text-center mb-4">{t("membership_center")} <MembershipManual className='!text-left' manual="membership_center" /></h1>    
            <Card className="shadow">
                {loading ?
                    <Card.Body>
                        Updating with your details...
                    </Card.Body>
                    :
                    <Card.Body>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("update_detail.name")}</Col>
                            <Col sm={3}>{user.name || 'N/A'}</Col>
                            <Col sm={3} className="text-muted">{t("membership_legal_name")}</Col>
                            <Col sm={3}>{user.legalName || 'N/A'}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("membership_num")}</Col>
                            <Col sm={3}>{user.number === 'N/A' ? t('membership_issuing') : user.number}</Col>
                            <Col sm={3} className="text-muted">{t("membership_class")}</Col>
                            <Col sm={3}>{user.membershipClass || 'N/A'}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("email")}</Col>
                            <Col sm={3}>{user.email || 'N/A'}</Col>
                            <Col sm={3} className="text-muted">{t("membership_phone")}</Col>
                            <Col sm={3}>{user.phone || 'N/A'}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("membership_address")}</Col>
                            <Col sm={9}>{user.address || 'N/A'}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("membership_occupation")}</Col>
                            <Col sm={3}>{user.occupation || 'N/A'}</Col>
                            <Col sm={3} className="text-muted">{t("membership_referee")}</Col>
                            <Col sm={3}>{user.referee || 'N/A'}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("membership_current_status")}</Col>
                            <Col sm={3}>{user.currentStatus || 'N/A'}</Col>
                            <Col sm={3} className="text-muted">{t("membership_exp")}</Col>
                            <Col sm={3}>{user.exp || 'N/A'}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("membership_point")}</Col>
                            <Col sm={3}>{user.point ?? 0}</Col>
                            <Col sm={3} className="text-muted">{t("membership_discount")}</Col>
                            <Col sm={3}>{user.discountPoint ?? 0}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={3} className="text-muted">{t("membership_loyalty_point")}</Col>
                            <Col sm={3}>{user.loyaltyPoint ?? 0}</Col>
                            <Col sm={3} className="text-muted">{t("membership_total_point")}</Col>
                            <Col sm={3}><b>{(user.point ?? 0) + (user.discountPoint ?? 0) + (user.loyaltyPoint ?? 0)}</b></Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={12} className='flex justify-end'>
                                <DetailUpdateBtn />
                            </Col>
                        </Row>
                    </Card.Body>
                }
            </Card>

            <br />
            <MemberPointMarket
                cmsEndpoint={import.meta.env.VITE_CMS_ENDPOINT}
                cmsApiKey={import.meta.env.VITE_CMS_TOKEN}
                couponEndpoint={import.meta.env.VITE_COUPON_SYS_ENDPOINT}
                emailEndpoint={import.meta.env.VITE_EMAIL_API_ENDPOINT}
            />

        </Container>
    );
};

export default MemberCenter;