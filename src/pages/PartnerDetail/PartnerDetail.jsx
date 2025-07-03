import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getPartnerTypeLabel } from "../../components/PartnerConfig";
import DefaultPartnerDetail from "./DefaultPartnerDetail";
// import StudyAbroadDetail from "./StudyAbroadDetail";
// import ImmigrationAdvisorDetail from "./ImmigrationAdvisorDetail";
// import TravelAgencyDetail from "./TravelAgencyDetail";
// import FranchisePartnerDetail from "./FranchisePartnerDetail";


const PartnerDetail = () => {
  const { productName, partnerType } = useParams();
  const decodedProductName = decodeURIComponent(productName);
  const [partners, setPartners] = useState([]);
  const [documentId, setDocumentId] = useState("");

  const title = getPartnerTypeLabel(partnerType);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const params = new URLSearchParams();
        params.append("filters[productName][$eq]", decodedProductName);
        params.append("filters[partnerType][$eq]", title);
        params.append("populate", "*");

        const url = `${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submissions?${params.toString()}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}` },
        });

        const entries = res.data?.data || [];
        setPartners(entries);
        setDocumentId(entries[0]?.documentId || "");
      } catch (err) {
        console.error("拉取合作伙伴失败", err);
        setPartners([]);
        setDocumentId("");
      }
    };

    fetchPartners();
  }, [decodedProductName, partnerType]);

  const commonProps = {
    partners,
    documentId,
    productName,
    partnerType,
  };

  const renderComponent = () => {
    switch (partnerType) {
      // case "study-abroad-agency":
      //   return <StudyAbroadDetail {...commonProps} />;
      // case "immigration-advisor":
      //   return <ImmigrationAdvisorDetail {...commonProps} />;
      // case "travel-agency":
      //   return <TravelAgencyDetail {...commonProps} />;
      // case "franchise-partner":
      //   return <FranchisePartnerDetail {...commonProps} />;

      case "study-abroad-agency":
        return <DefaultPartnerDetail {...commonProps} />;
      case "immigration-advisor":
        return <DefaultPartnerDetail {...commonProps} />;
      default:
        return <DefaultPartnerDetail {...commonProps} />;
    }
  };

  return <>{renderComponent()}</>;
};

export default PartnerDetail;