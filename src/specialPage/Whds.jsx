import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import moment from "moment";
import "moment-timezone";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMapMarkerAlt, faUserTie } from "@fortawesome/free-solid-svg-icons";
import MerchantRegistrationForm from '../Forms/MerchantRegistrationForm';
import InfluencerRegistrationForm from'../Forms/InfluencerRegistrationForm';


const API_KEY_UPLOAD = import.meta.env.VITE_API_KEY_REGISTRATION_UPLOAD
const MERCHANT_UPLOAD_EMAIL_NOTIFY = import.meta.env.VITE_360_MEDIA_WHDS_BIZ_UPLOAD_NOTIFICATION;
const INF_UPLOAD_EMAIL_NOTIFY = import.meta.env.VITE_360_MEDIA_WHDS_INF_UPLOAD_NOTIFICATION;

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const EventDetail = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("merchant");

  const [showSuccessSubmissionModal, setShowSuccessSubmissionModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleUpload = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const path = location.pathname.replace("/events/", "");
    axios
      .get(`${BACKEND_HOST}/api/events`, {
        params: {
          "filters[url]": path,
          populate: "Image",
        },
      })
      .then((response) => {
        const eventData = response.data?.data || null;
        if (eventData && eventData.length > 0) {
          setEvent(eventData);
        } else {
          setError("No data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, [location]);

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!event) return <div className="text-gray-500 text-center mt-10">{t("loading")}</div>;

  const formatDateTime = (datetime) => {
    if (!datetime) return "N/A";
    const timezone = "Australia/Sydney";
    return moment(datetime).tz(timezone).format("ddd, DD MMM, h:mm a z");
  };

  const calculateTime = (start, end) => {
    if (!start) return "N/A";
    const startTime = formatDateTime(start);
    const endTime = end ? formatDateTime(end) : null;
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };

  const eventAttributes = event[0] || {};
  const EventImage =
    eventAttributes.Image?.url || "https://placehold.co/1200x600";

  const language = i18n.language;
  const Description =
    language === "zh"
      ? eventAttributes.Description_zh || "N/A"
      : eventAttributes.Description_en || "N/A";
  const ShortDescription =
    language === "zh"
      ? eventAttributes.Short_zh || "N/A"
      : eventAttributes.Short_en || "N/A";

  const EventTime = calculateTime(eventAttributes.Start_Date, eventAttributes.End_Date);
  const EventLocation = eventAttributes.Location || "N/A";
  const EventHost = eventAttributes.Host || "N/A";




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

  return (
    <div className="w-full bg-gray-50">
      {/* Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <img
          src={`${BACKEND_HOST}${EventImage}`}
          alt="Event Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            {language === "zh"
              ? eventAttributes.Name_zh || "N/A"
              : eventAttributes.Name_en || "N/A"}
          </h1>
        </div>
      </div>

      {/* Event Info */}
      <div className="container mt-4 mx-auto py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">活动信息</h2>
            <ul className="space-y-3 p-0 text-gray-700">
              <li>
                <FontAwesomeIcon icon={faClock} className="mr-2 text-indigo-600" />
                <strong>{t("time")}:</strong> {EventTime}
              </li>
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-indigo-600" />
                <strong>{t("location")}:</strong> {EventLocation}
              </li>
              <li>
                <FontAwesomeIcon icon={faUserTie} className="mr-2 text-indigo-600" />
                <strong>{t("host")}:</strong> {EventHost}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">活动总览</h2>
            {ShortDescription !== "N/A" ? (
              <div className="prose prose-indigo max-w-none">
                <ReactMarkdown>{ShortDescription}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500">{t("noDescription")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="container mt-4 py-12 border-t border-gray-200">
        <div className=" mx-auto">
          <h2 className="text-2xl font-bold mb-6">{t("eventDescription")}</h2>
          {Description !== "N/A" ? (
            <div className="prose prose-lg prose-indigo max-w-none">
              <div dangerouslySetInnerHTML={{ __html: Description }} />
            </div>
          ) : (
            <p className="text-gray-500">{t("noDescription")}</p>
          )}
        </div>
      </div>

      <div className="container mt-4">
        <h2 className="text-2xl font-bold mb-6">报名方式</h2>
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

        {renderSuccessModal()}
        {renderErrorModal()}
      </div>
    </div>
  );
};

export default EventDetail;