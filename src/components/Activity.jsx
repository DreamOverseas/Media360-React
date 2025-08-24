import axios from "axios";
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Pagination, Container, Modal, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import MerchantRegistrationForm from '../Forms/MerchantRegistrationForm';
import InfluencerRegistrationForm from'../Forms/InfluencerRegistrationForm';
import Cookies from "js-cookie";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const API_KEY_UPLOAD = import.meta.env.VITE_API_KEY_REGISTRATION_UPLOAD
const MERCHANT_UPLOAD_EMAIL_NOTIFY = import.meta.env.VITE_360_MEDIA_WHDS_BIZ_UPLOAD_NOTIFICATION;
const INF_UPLOAD_EMAIL_NOTIFY = import.meta.env.VITE_360_MEDIA_WHDS_INF_UPLOAD_NOTIFICATION;

const Activity = () => {

    const [WtcActivities, setWtcActivities] = useState([])
    const [Activities, setActivities] = useState([])
    const [allActivities, setAllActivities] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("merchant");

    

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showSuccessSubmissionModal, setShowSuccessSubmissionModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleUpload = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    // const [purchaseProduct, setPurchaseProduct] = useState(null);
    // const [currDeduction, setCurrDeduction] = useState(0);
    // const [loadingPurchase, setLoadingPurchase] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const handleCardClick = (product) => {

      const userCookie = Cookies.get("user");
      
      if (product.WtcActivityPrice > 0 || product.ActivityPrice > 0){
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

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const activityId = params.get("activityId");

      if (activityId && allActivities.length > 0) {
        const matched = allActivities.find(p => p.documentId === activityId);
        if (matched) {
          setSelectedProduct(matched);
          setShowModal(true);
        }
      }
    }, [location.search, allActivities]);

    
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
                      type: 'wtc',
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
              console.error('Error fetching WTC activities:', error);
          }
      };
  
      fetchActivities();
    }, []);




    
    useEffect(() => {
      const fetchRegularActivities = async () => {
          const endpoint = import.meta.env.VITE_STRAPI_HOST;
          const apiKey = import.meta.env.VITE_CMS_TOKEN;
      
          const url = `${endpoint}/api/activities?populate=*`;
      
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

              const regularActivities = data.data
                  .filter(entry => {
                      const activityDate = new Date(entry.ActivityDate);
                      return activityDate >= today && entry.publishedAt;
                  })
                  .map(entry => ({
                      documentId: entry.documentId,
                      ActivityTitle: entry.ActivityTitle,
                      ActivityDate: entry.ActivityDate,
                      ActivityDescription: entry.ActivityDescription,
                      ActivityPrice: entry.ActivityPrice || 0,
                      type: 'regular',
                      organizer: entry.organizer ? {
                          firstName: entry.organizer.FirstName,
                          lastName: entry.organizer.LastName,
                      } : null,
                      ActivityIcon: entry.ActivityIcon,
                  }));
              setActivities(regularActivities);

          } catch (error) {
              console.error('Error fetching regular activities:', error);
          }
      };
  
      fetchRegularActivities();
    }, []);

    useEffect(() => {
      const merged = [...WtcActivities, ...Activities].sort((a, b) => {
        const dateA = new Date(a.WtcActivityDate || a.ActivityDate);
        const dateB = new Date(b.WtcActivityDate || b.ActivityDate);
        return dateA - dateB;
      });
      setAllActivities(merged);
    }, [WtcActivities, Activities]);

    const pageSize = 6;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(allActivities.length / pageSize);
    const paginatedProducts = allActivities.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (pageNumber) => {
        // Ensure pageNumber is within bounds
        const newPage = Math.max(1, Math.min(totalPages, pageNumber));
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    
    const createWtcAttendMember = async (selectedProduct, e) => {
      e.preventDefault();
      
      const endpoint = import.meta.env.VITE_STRAPI_HOST;
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
          await sendWtcConfirmationEmail(selectedProduct, newAttender);

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
    
      const activityPrice = selectedProduct.WtcActivityPrice || selectedProduct.ActivityPrice || 0;
      
      if (activityPrice == 0) {
        try {
          if (selectedProduct.type === 'wtc') {
            await createWtcAttendMember(selectedProduct, e);
          }
          setShowSuccessModal(true);
          handleModalClose();
        } catch (error) {
          console.error('Registration error:', error);
          // Error handling is already in individual functions
        }
      } else {
        setPurchaseProduct(selectedProduct);
        setShowPurchaseModal(true);
        handleModalClose();
      } 
    }

    const sendWtcConfirmationEmail = async (activity, attendee) => {
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


    
    const handleMerchantRegistrationSubmit = async (formData) => {
    
      setLoading(true);

      const uploadFiles = async (files) => {
        if (!files || files.length === 0) return { urls: [], ids: [] };
      
        const uploadPromises = files.map(async (file) => {
          const formDataToUpload = new FormData();
          formDataToUpload.append("files", file);
      
          try {
            const uploadResponse = await fetch(`${BACKEND_HOST}/api/upload`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${API_KEY_UPLOAD}`,
              },
              body: formDataToUpload,
            });
      
            const uploadResult = await uploadResponse.json();
            if (uploadResponse.ok && uploadResult.length > 0) {
              return { url: uploadResult[0].url, id: uploadResult[0].id };
            } else {
              console.error("Upload failed:", uploadResult);
              return null;
            }
          } catch (error) {
            console.error("Error during file upload:", error);
            return null;
          }
        });
      
        const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
      
        return {
          urls: uploadedFiles.map((f) => f.url),
          ids: uploadedFiles.map((f) => f.id),
        };
      };
    
      const [businessLicenseData, productImageData] = await Promise.all([
        uploadFiles(formData.businessLicense),
        uploadFiles(formData.productImages),
      ]);
  
      const cleanData = (data) =>
        Object.fromEntries(Object.entries(data).filter(([_, value]) => value && value.length > 0));
  
      const finalFormData = cleanData({
        Company_Name: formData.companyName,
        Business_License: businessLicenseData.ids,
        Industry_Category: formData.industryCategory,
        Contact_Person_First_Name: formData.contactPersonFirstName,
        Contact_Person_Last_Name: formData.contactPersonLastName,
        Email: formData.email,
        Phone: formData.phone,
        Company_Description: formData.companyDescription,
        Company_Website: formData.companyWebsite,
        Product_Description: formData.productDescription,
        Product_Images: productImageData.ids,
        Target_Audience: formData.targetAudience,
        Marketing_Budget: formData.marketingBudget,
        Campaign_Goals: formData.campaignGoals,
        Additional_Requirements: formData.additionalRequirements,
        From: formData.from
      });
  
      try {
        const response = await fetch(`${BACKEND_HOST}/api/influencer-contest-merchant-registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY_UPLOAD}`,
          },
          body: JSON.stringify({data: finalFormData}),
        });
  
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        const firstName = finalFormData.Contact_Person_First_Name;
        const lastName = finalFormData.Contact_Person_Last_Name;
        const name = firstName + " " + lastName;
        const email = finalFormData.Email;
        try {
          await axios.post(MERCHANT_UPLOAD_EMAIL_NOTIFY, {
            name,
            email
          });
        } catch (error) {
          alert(`${error}, Email not sent... But you are recorded if no other errors occured!`);
        }
        setShowSuccessSubmissionModal(true);
      } 
    } catch (error) {
      console.error('Error during form submission:', error);
      setShowErrorModal(true);
    } 

    handleClose();
    setLoading(false);
  };


  const handleInfluencerRegistrationSubmit = async (formData) => {
    
      setLoading(true);

      const uploadFiles = async (files) => {
        if (!files || files.length === 0) return { urls: [], ids: [] };
      
        const uploadPromises = files.map(async (file) => {
          const formDataToUpload = new FormData();
          formDataToUpload.append("files", file);
      
          try {
            const uploadResponse = await fetch(`${BACKEND_HOST}/api/upload`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${API_KEY_UPLOAD}`,
              },
              body: formDataToUpload,
            });
      
            const uploadResult = await uploadResponse.json();
            if (uploadResponse.ok && uploadResult.length > 0) {
              return { url: uploadResult[0].url, id: uploadResult[0].id };
            } else {
              console.error("Upload failed:", uploadResult);
              return null;
            }
          } catch (error) {
            console.error("Error during file upload:", error);
            return null;
          }
        });
      
        const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
      
        return {
          urls: uploadedFiles.map((f) => f.url),
          ids: uploadedFiles.map((f) => f.id),
        };
      };

      
      const portfolioFilesData = await uploadFiles(formData.portfolioFiles);
      const personalImagesData = await uploadFiles(formData.personalImages);

      const cleanData = (data) =>
        Object.fromEntries(Object.entries(data).filter(([_, value]) => {
          
          if (Array.isArray(value) && value.length === 0) {
            return false;
          }
          
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          
          if (typeof value === 'boolean') {
            return true;
          }
          
          if (value === null || value === undefined) {
            return false;
          }
          
          return value && value.toString().trim().length > 0;
        }));

      const finalFormData = cleanData({
        
        Name: formData.name,
        Gender: formData.gender,
        Age: formData.age ? parseInt(formData.age) : null,
        Phone: formData.phone,
        Email: formData.email,
        Location: formData.location,
        
        
        Social_Media: formData.socialMedia,
        Content_Categories: formData.contentCategories,
        Past_Collaborations: formData.pastCollaborations,
        Portfolio_Links: formData.portfolioLinks,
        Portfolio_Files: portfolioFilesData.ids,
        Personal_Introduction: formData.personalIntroduction,
        Personal_Images:personalImagesData.ids,
        
        
        Preferred_Product_Categories: formData.preferredProductCategories,
        Accepted_Promotion_Formats: formData.acceptedPromotionFormats,
        Agree_To_Rules: formData.agreeToRules,
        Allow_Content_Usage: formData.allowContentUsage,
        
        From: formData.from
      });

      try {
        const response = await fetch(`${BACKEND_HOST}/api/influencer-contest-registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY_UPLOAD}`,
          },
          body: JSON.stringify({data: finalFormData}),
        });

        const result = await response.json();
        console.log(result);
        
        if (response.ok) {
          const name = finalFormData.Name;
          const email = finalFormData.Email;
          
          try {
            await axios.post(INF_UPLOAD_EMAIL_NOTIFY, {
              name,
              email
            });
          } catch (error) {
            alert(`${error}, Email not sent... But you are recorded if no other errors occurred!`);
          }
          
          setShowSuccessSubmissionModal(true);
        } 
      } catch (error) {
        console.error('Error during form submission:', error);
        setShowErrorModal(true);
      } 

      handleClose();
      setLoading(false);
  };


  const renderSuccessModal = () => (
    <Modal show={showSuccessSubmissionModal} onHide={() => setShowSuccessSubmissionModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>提交成功</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="success">您的资料已成功上传！</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => setShowSuccessSubmissionModal(false)}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderErrorModal = () => (
    <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>提交失败</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="danger">资料提交失败，请检查网络或稍后重试！</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => handleUpload()}>
          重试
        </Button>
        <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );
  

    
    const getActivityTitle = (product) => {
      return product.WtcActivityTitle || product.ActivityTitle || '未命名活动';
    };

    
    const getActivityDate = (product) => {
      return product.WtcActivityDate || product.ActivityDate || '';
    };

    
    const getActivityPrice = (product) => {
      return product.WtcActivityPrice || product.ActivityPrice || 0;
    };

    
    const getActivityDescription = (product) => {
      return product.WtcActivityDescription || product.ActivityDescription || '';
    };

    
    const getOrganizerInfo = (product) => {
      if (product.type === 'wtc') {
        return Array.isArray(product.ww_memberships) && product.ww_memberships.length > 0 
          ? product.ww_memberships.map(member => `${member.firstName} ${member.lastName}`).join(", ")
          : "未知主办方";
      } else {
        return product.organizer 
          ? `${product.organizer.firstName} ${product.organizer.lastName}`
          : "未知主办方";
      }
    };

    
    const getActivityIcon = (product) => {
      if (product.type === 'wtc') {
        return product.member_product?.icon?.url
          ? `${import.meta.env.VITE_STRAPI_HOST}${product.member_product.icon.url}`
          : '';
      } else {
        return product.ActivityIcon?.url
          ? `${import.meta.env.VITE_STRAPI_HOST}${product.ActivityIcon.url}`
          : '';
      }
    };

    
    const getProductName = (product) => {
      if (product.type === 'wtc') {
        return product.member_product?.name || '';
      } else {
        return '';
      }
    };

  return (
    <>
    {paginatedProducts.length > 0 && (
    <Container className="my-4">
      <h1 className="text-3xl font-bold text-center !my-10">参加活动</h1>
      {/* Product grid for current page */}
      <Row>
        {paginatedProducts.map(product => {
          const title = getActivityTitle(product);
          const date = getActivityDate(product);
          const price = getActivityPrice(product);
          const organizer = getOrganizerInfo(product);
          const iconUrl = getActivityIcon(product);
          const productName = getProductName(product);

          return (
            <Col md={4} key={product.documentId} className="mb-4">
              <Card>
                <Card.Body
                  onClick={() => handleCardClick(product)}
                  style={{ cursor: 'pointer' }}
                >
                  
                    <Card.Title className="overflow-hidden text-center flex items-center justify-center">
                      {title}
                      {product.type === 'wtc' && (
                        <span className="badge bg-primary ms-2 text-xs">WTC</span>
                      )}
                    </Card.Title>
                    
                    <Card.Text className="h-12 overflow-hidden text-center flex items-center justify-center"> 
                      {date + (productName ? " " + productName : "")} 
                    </Card.Text>

                    <Card.Text className="overflow-hidden text-center flex items-center justify-center"> 
                        {"由 " + organizer + " 主办"} 
                    </Card.Text>

                    {iconUrl && (
                        <Card.Img
                        variant="top"
                        src={iconUrl}
                        alt="Activity Icon"
                        className="mb-3"
                        style={{ objectFit: 'cover', height: '200px' }}
                        />
                    )}

                    <div className="text-center justify-content-center">
                      {price > 0 ? "仅供会员" : "免费参加！"}
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



      {selectedProduct && selectedProduct.type == "wtc" && (
        <Modal size="lg" show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title className='ms-auto'>{getActivityTitle(selectedProduct)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='relative w-2/3 top-0 gap-2 mx-auto'>
                  {getActivityIcon(selectedProduct) && (
                    <img
                        src={getActivityIcon(selectedProduct)}
                        alt="Activity"
                        className="img-fluid mb-3"
                    />
                  )}
                  <div dangerouslySetInnerHTML={{__html: getActivityDescription(selectedProduct) || "暂无简介"}}/>
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


    {selectedProduct && selectedProduct.type == "regular" && (
      <>
        <Modal size="lg" show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title className='ms-auto'>{getActivityTitle(selectedProduct)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='relative w-2/3 top-0 gap-2 mx-auto'>
                  {getActivityIcon(selectedProduct) && (
                    <img
                        src={getActivityIcon(selectedProduct)}
                        alt="Activity"
                        className="img-fluid mb-3"
                    />
                  )}
                  <div dangerouslySetInnerHTML={{__html: getActivityDescription(selectedProduct) || "暂无简介"}}/>
              </div>
              <div className="container mt-4">
                <Tabs
                  id="registration-tabs"
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                >
                  <Tab eventKey="merchant" title="商家/赞助商注册">
                    {loading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" size="lg" />
                        <p className="mt-3">正在上传，请稍候...</p>
                      </div>
                    ) : (
                      <MerchantRegistrationForm onSubmit={handleMerchantRegistrationSubmit} />
                    )}
                  </Tab>
                  
                  <Tab eventKey="influencer" title="网红达人注册">
                    {loading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" size="lg" />
                        <p className="mt-3">正在上传，请稍候...</p>
                      </div>
                    ) : (
                      <InfluencerRegistrationForm onSubmit={handleInfluencerRegistrationSubmit} />
                    )}
                  </Tab>
                </Tabs>
              </div>
              
            </Modal.Body>
        </Modal>
        {renderSuccessModal()}
        {renderErrorModal()}
      </>

    )}



    {showSuccessModal && selectedProduct.type == "wtc" && (
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

    </Container>)}
    </>
  );
};

export default Activity;