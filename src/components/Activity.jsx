import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Pagination, Container, Modal, Form, InputGroup } from 'react-bootstrap';
import Cookies from "js-cookie";

const Activity = () => {

    const [WtcActivities, setWtcActivities] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseProduct, setPurchaseProduct] = useState(null);
    const [currDeduction, setCurrDeduction] = useState(0);
    const [loadingPurchase, setLoadingPurchase] = useState(false);

    // const maxDeduction = useMemo(() => {
    //   return purchaseProduct ? Math.min(purchaseProduct.WtcActivityPrice, purchaseProduct.WtcActivityPrice) : 0;
    // }, [purchaseProduct]);

    // useEffect(() => {
    //   if (WtcActivities != null)
    //     console.log(WtcActivities)
    // },[WtcActivities])

    const location = useLocation();
    const navigate = useNavigate();

    const handleCardClick = (product) => {

      const userCookie = Cookies.get("user");
      
      if (product.WtcActivityPrice > 0){
        if (!userCookie) {
          if (userCookie.is_member){
  
          }
        }
      }
      setSelectedProduct(product);
      setShowModal(true);
      navigate(`?activityId=${product.documentId}`);
    };

    const handleModalClose = () => {
      setSelectedProduct(null);
      setShowModal(false);
      // Clear the URL parameter when closing modal
      navigate(location.pathname, { replace: true });
    };

    // Function for handling deduction changes
    // const handleDeductionChange = (value) => {
    //   let newValue = Number(value);
    //   if (newValue > maxDeduction) {
    //     alert(`最大抵扣 ${maxDeduction}`);
    //     newValue = maxDeduction;
    //   }
    //   if (newValue < 0) newValue = 0;
    //   setCurrDeduction(newValue);
    // };

    // Function for updating user points
    // const updateUserPoints = async () => {
    //   const endpoint = import.meta.env.VITE_CMS_ENDPOINT;
    //   const apiKey = import.meta.env.VITE_CMS_TOKEN;

    //   const currUser = JSON.parse(Cookies.get('user'));
    //   const userQueryUrl = `${endpoint}/api/ww-memberships?filters[Email][$eq]=${currUser.email}`;

    //   try {
    //     const userResponse = await fetch(userQueryUrl, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${apiKey}`
    //       }
    //     });
    //     const userData = await userResponse.json();

    //     if (userResponse.ok && userData.data && userData.data.length > 0) {
    //       const userRecord = userData.data[0];
    //       const documentId = userRecord.documentId;
    //       const oldPoints = userRecord.Point;
    //       const oldDiscountPoint = userRecord.DiscountPoint;

    //       const newPoints = oldPoints - (purchaseProduct.WtcActivityPrice - currDeduction);
    //       const newDiscountPoints = oldDiscountPoint - currDeduction;

    //       const updatePayload = {
    //         data: {
    //           Point: newPoints,
    //           DiscountPoint: newDiscountPoints
    //         }
    //       };

    //       const updateResponse = await fetch(`${endpoint}/api/ww-memberships/${documentId}`, {
    //         method: "PUT",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": `Bearer ${apiKey}`
    //         },
    //         body: JSON.stringify(updatePayload)
    //       });

    //       if (updateResponse.ok) {
    //         console.log("Updated successfully");
    //       } else {
    //         const updateError = await updateResponse.json();
    //         console.log("Error updating user info:", updateError.message);
    //       }

    //       // Update Cookie
    //       Cookies.set('user', JSON.stringify({
    //         ...currUser,
    //         point: newPoints,
    //         discount_p: newDiscountPoints,
    //       }), { expires: 7 });
    //     } else {
    //       console.log("User not found or error fetching user data");
    //     }
    //   } catch (error) {
    //     console.log("Error updating user info:", error);
    //   }
    // };

    // Function for purchase confirmation
    // const confirmPurchaseNow = async (selectedProduct, e) => {
    //   setLoadingPurchase(true);
      
    //   try {
    //     // Just create the attendance record - sendConfirmationEmail will handle the coupon
    //     await createAttendMember(selectedProduct, e);
        
    //     // Update user points after successful registration
    //     await updateUserPoints();
        
    //     console.log("Purchased successfully.");
    //     setLoadingPurchase(false);
    //     setCurrDeduction(0);
    //     setShowPurchaseModal(false);
    //     setShowSuccessModal(true);
        
    //   } catch (error) {
    //     console.error('Error in confirmPurchaseNow():', error);
    //     alert('系统错误，请稍后再试');
    //     setLoadingPurchase(false);
    //     setCurrDeduction(0);
    //   }
    // };

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const activityId = params.get("activityId");

      if (activityId && WtcActivities.length > 0) {
        const matched = WtcActivities.find(p => p.documentId === activityId);
        if (matched) {
          setSelectedProduct(matched);
          setShowModal(true);
        }
      }
    }, [location.search, WtcActivities]);

    useEffect(() => {
      const fetchActivities = async () => {
          const endpoint = import.meta.env.VITE_STRAPI_HOST;
          const apiKey = import.meta.env.VITE_CMS_TOKEN;
      
          const url = `${endpoint}/api/wtc-activities?populate=ww_memberships&populate=member_product.Icon`;
      
          try {
              const response = await fetch(url, {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${apiKey}`
                  }
              });
              const data = await response.json();
      
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const tepActivities = data.data
                  .filter(entry => {
                      const activityDate = new Date(entry.WtcActivityDate);
                      return activityDate >= today && entry.DOWebsite;
                  })
                  .map(entry => ({
                      documentId: entry.documentId,
                      WtcActivityTitle: entry.WtcActivityTitle,
                      WtcActivityDate: entry.WtcActivityDate,
                      WtcActivityDescription: entry.WtcActivityDescription,
                      WtcActivityPrice: entry.WtcActivityPrice,
                      ww_memberships: entry.ww_memberships ? (
                      Array.isArray(entry.ww_memberships) 
                          ? entry.ww_memberships.map(member => ({
                              firstName: member.FirstName,
                              lastName: member.LastName,
                            }))
                          : [{
                              firstName: entry.ww_memberships.FirstName,
                              lastName: entry.ww_memberships.LastName,
                            }]
                      ) : [],
                      member_product: entry.member_product? {
                          name: entry.member_product.Name,
                          icon: entry.member_product.Icon,
                      }: null,
                  }));
              setWtcActivities(tepActivities);

          } catch (error) {
              console.error('Error fetching disabled dates:', error);
          }
      };
  
      fetchActivities();
    }, []);

    const pageSize = 6;


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(WtcActivities.length / pageSize);
    const paginatedProducts = WtcActivities.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (pageNumber) => {
        // Ensure pageNumber is within bounds
        const newPage = Math.max(1, Math.min(totalPages, pageNumber));
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const createAttendMember = async (selectedProduct, e) => {
      e.preventDefault();
      
      const endpoint = import.meta.env.VITE_CMS_ENDPOINT;
      const apiKey = import.meta.env.VITE_CMS_TOKEN;
      
      try {
        // First, get basic activity data with the correct populate parameter
        const getResponse = await fetch(`${endpoint}/api/wtc-activities/${selectedProduct.documentId}?populate=wtc_attender`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        });
        
        if (!getResponse.ok) {
          throw new Error('无法获取活动信息');
        }

        const activityData = await getResponse.json();
        
        // Prepare the new attendee data
        const newAttender = {
          firstName,
          lastName,
          email,
          contact: contact || null,
          from: "360"
        };
        
        // Create a clean array of existing attenders with only the fields we need
        let existingAttenders = [];
        
        if (activityData.data && activityData.data.wtc_attender) {
          existingAttenders = activityData.data.wtc_attender.map(att => ({
            firstName: att.firstName,
            lastName: att.lastName,
            email: att.email,
            contact: att.contact,
            from: att.from
          }));
        }
        
        // Update the activity with the new attendee
        const updateResponse = await fetch(`${endpoint}/api/wtc-activities/${selectedProduct.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            data: {
              wtc_attender: [
                ...existingAttenders,
                newAttender
              ]
            }
          })
        });
        
        const result = await updateResponse.json();
        
        if (updateResponse.ok) {
          // Send confirmation email
          await sendConfirmationEmail(selectedProduct, newAttender);

          // Reset form fields
          setFirstName('');
          setLastName('');
          setEmail('');
          setContact('');
        } else {
          alert(`报名失败: ${result.error?.message || '请稍后再试'}`);
        }
      } catch (error) {
        console.error('报名提交错误:', error);
        alert('系统错误，请稍后再试');
      }
    };

    const processPurchase = async (selectedProduct, e) => {
      // Form validation first - regardless of price
      if (!firstName || !lastName || !email) {
        alert('请填写必要信息（姓名和邮箱）');
        return;
      }
    
      if (selectedProduct.WtcActivityPrice == 0) {
        try {
          await createAttendMember(selectedProduct, e);
          setShowSuccessModal(true);
          handleModalClose();
        } catch (error) {
          console.error('Registration error:', error);
          // Error handling is already in createAttendMember
        }
      } else {
        setPurchaseProduct(selectedProduct);
        setShowPurchaseModal(true);
        handleModalClose();
      } 
    }

    // Function for sending confirmation emails
    const sendConfirmationEmail = async (activity, attendee) => {
      const couponSysEndpoint = import.meta.env.VITE_COUPON_SYS_ENDPOINT;
      const emailApiEndpoint = import.meta.env.VITE_EMAIL_API_ENDPOINT;
      
      // Create expiry date (1 year from now, same as MemberPointMarket)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
      // Create coupon payload for activity confirmation
      const couponPayload = {
        title: activity.WtcActivityTitle,
        description: activity.WtcActivityDescription || "活动确认",
        expiry: expiryDate.toISOString(),
        assigned_from: "WTC",
        assigned_to: `${attendee.firstName} ${attendee.lastName}`,
        email: attendee.email,
        contact: attendee.contact,
      };
    
      try {
        // First, create the coupon to get QR code data
        const couponResponse = await fetch(`${couponSysEndpoint}/create-active-coupon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(couponPayload),
          mode: 'cors',
          credentials: 'include'
        });
        const couponData = await couponResponse.json();
    
        if (couponResponse.ok && couponData.couponStatus === "active") {
          const QRdata = couponData.QRdata;
          
          // Now send email with QR code data
          const emailPayload = {
            name: `${attendee.firstName} ${attendee.lastName}`,
            email: attendee.email,
            data: QRdata,
            title: activity.WtcActivityTitle,
            date: activity.WtcActivityDate
          };
    
          const emailResponse = await fetch(`${emailApiEndpoint}/wco/event_distribute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
            mode: 'cors',
            credentials: 'include'
          });
    
          if (emailResponse.ok) {
            console.log("Confirmation email sent successfully");
          } else {
            const emailError = await emailResponse.json();
            console.log("Email API error:", emailError.message);
            console.log("Full email error response:", emailError);
          }
        } else {
          console.log("Coupon system error:", couponData.message);
        }
      } catch (error) {
        console.log("Error sending confirmation email:", error);
        console.log("Error details:", error.message, error.stack);
      }
    };

  return (
    <Container className="my-4">
      <h1 className="text-3xl font-bold text-center !my-10">参加活动</h1>
      {/* Product grid for current page */}
      <Row>
        {paginatedProducts.map(product => {
          const { WtcActivityTitle, WtcActivityDate, WtcActivityPrice, ww_memberships, member_product, id } = product;
          const iconUrl = member_product.icon?.url
            ? `${import.meta.env.VITE_STRAPI_HOST}${member_product.icon.url}`
            : '';

          return (
            <Col md={4} key={id} className="mb-4">
              <Card>
                <Card.Body
                  onClick={() => handleCardClick(product)}
                  style={{ cursor: 'pointer' }}
                >
                  
                    <Card.Title className="overflow-hidden text-center flex items-center justify-center">{WtcActivityTitle}</Card.Title>
                    
                    <Card.Text className="h-12 overflow-hidden text-center flex items-center justify-center"> {WtcActivityDate + " " + member_product.name} </Card.Text>

                    <Card.Text className="overflow-hidden text-center flex items-center justify-center"> 
                        {"由 " + (Array.isArray(ww_memberships) && ww_memberships.length > 0 
                            ? ww_memberships.map(member => `${member.firstName} ${member.lastName}`).join(", ")
                            : "未知主办方") + " 主办"} 
                    </Card.Text>

                    {iconUrl && (
                        <Card.Img
                        variant="top"
                        src={iconUrl}
                        alt={member_product.icon.id}
                        className="mb-3"
                        style={{ objectFit: 'cover', height: '200px' }}
                        />
                    )}

                    <div className="text-center justify-content-center">
                      {WtcActivityPrice > 0 ? "仅供会员" : "免费参加！"}
                    </div>
                </Card.Body>

                <Card.Footer>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleCardClick(product)}
                  >
                    参加
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      {selectedProduct && (
        <Modal size="lg" show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title className='ms-auto'>{selectedProduct.WtcActivityTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='relative w-2/3 top-0 gap-2 mx-auto'>
                  {selectedProduct.member_product.icon && (
                    <img
                        src={`${import.meta.env.VITE_STRAPI_HOST}${selectedProduct.member_product.icon.url}`}
                        alt={selectedProduct.member_product.Name}
                        className="img-fluid mb-3"
                    />
                  )}
                  <div dangerouslySetInnerHTML={{__html: selectedProduct.WtcActivityDescription || "暂无简介"}}/>
              </div>
              {/* Form */}

              <div className="space-y-4 mb-4">

                <div>
                  <label className="block font-medium">名（First Name）*</label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2`}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">姓（Last Name）*</label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2`}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">电子邮箱（Email）*</label>
                  <input
                    type="email"
                    className={`w-full border rounded px-3 py-2`}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">联系电话（Phone）</label>
                  <input
                    type="tel"
                    className={`w-full border rounded px-3 py-2`}
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    className="w-100"
                    onClick={(e) => processPurchase(selectedProduct, e)}
                >
                    参加
                </Button>
            </Modal.Footer>
        </Modal> 
    )}

    {showSuccessModal && (
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>报名成功</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle" style={{ fontSize: '3rem', color: 'green' }}></i>
          <p className="mt-3">报名成功！确认邮件将会发送到您的邮箱。</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="w-100"
            onClick={() => setShowSuccessModal(false)}
          >
            确定
          </Button>
        </Modal.Footer>
      </Modal>
    )}

      {/* {purchaseProduct && (
        <Modal
          show={showPurchaseModal}
          onHide={() => {
            setShowPurchaseModal(false);
            setPurchaseProduct(null);
            setCurrDeduction(0);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>购买活动门票</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>活动：{purchaseProduct.WtcActivityTitle}</p>
            <p>价格：{purchaseProduct.WtcActivityPrice} 会员点数</p>
            {(() => {
              const userData = JSON.parse(Cookies.get('user'));
              const cookiePoints = userData.point || 0;
              const cookieDiscountPoints = userData.discount_p || 0;
              return (
                <>
                  <p>
                    余额：{cookiePoints} → <b>{cookiePoints - purchaseProduct.WtcActivityPrice + currDeduction}</b>
                  </p>
                  <p>
                    折扣点数：{cookieDiscountPoints} → <b>{cookieDiscountPoints - currDeduction}</b>
                  </p>
                  <hr />
                  {maxDeduction > 0 ? (
                    <Form.Group>
                      <Row className='d-flex'>
                        <Col md={7}>
                          <Form.Label>折扣点数 ({currDeduction}/{maxDeduction})</Form.Label>
                        </Col>
                        <Col md={5}>
                          <Row>
                            <InputGroup>
                              <Form.Control
                                type="number"
                                value={currDeduction}
                                onChange={(e) => handleDeductionChange(e.target.value)}
                              />
                              <Button
                                variant="dark"
                                onClick={() => handleDeductionChange(Math.min(maxDeduction, cookieDiscountPoints))}
                              >
                                Max
                              </Button>
                            </InputGroup>
                          </Row>
                        </Col>
                      </Row>
                      <Form.Control
                        type="range"
                        min="0"
                        max={maxDeduction}
                        value={currDeduction}
                        onChange={(e) => handleDeductionChange(e.target.value)}
                        className="deduction-range"
                      />
                    </Form.Group>
                  ) : (<></>)}
                </>
              );
            })()}
          </Modal.Body>
          <Modal.Footer>
            {(() => {
              const cookiePoints = JSON.parse(Cookies.get('user')).point || 0;
              const cookieDiscountPoint = JSON.parse(Cookies.get('user')).discount_p || 0;
              const sufficientPoints = cookiePoints >= (purchaseProduct.WtcActivityPrice - currDeduction);
              const sufficientDiscountPoint = (cookieDiscountPoint - currDeduction) >= 0;
              return (
                <Button
                  variant={(sufficientPoints && sufficientDiscountPoint) ? "primary" : "secondary"}
                  className="w-100"
                  disabled={!(sufficientPoints && sufficientDiscountPoint)}
                  onClick={(e) => confirmPurchaseNow(purchaseProduct, e)}
                >
                  {(sufficientPoints && sufficientDiscountPoint) ?
                    (loadingPurchase ? `正在购买` : `购买`)
                    :
                    (sufficientPoints ? `折扣点不足` : `会员点不足`)}
                </Button>
              );
            })()}
          </Modal.Footer>
        </Modal>
      )} */}

      <Pagination className="justify-content-center">
        {/* 1. Prev */}
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {/* 2. ALL your page‑number buttons */}
        {Array.from({ length: totalPages }, (_, idx) => {
          const page = idx + 1;
          return (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Pagination.Item>
          );
        })}

        {/* 3. Next */}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

    </Container>
  );
};

export default Activity;