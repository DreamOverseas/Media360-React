import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
import "../../css/CustomerApplicationForm.css";
import { getPartnerTypeLabel } from "../../components/PartnerConfig";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const CUSTOMER_URL = `${STRAPI_HOST}/api/partner-application-forms`;
const PARTNER_URL = `${STRAPI_HOST}/api/partner-application-submissions`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;
const MAIL_NOTIFY_API = import.meta.env.VITE_360_MEDIA_CUSTOMER_APPLICATION_NOTIFICATION;

const RecruitmentAgencyForm = () => {
  const { productName, partnerType } = useParams();
  const { partnerID } = Object.fromEntries(new URLSearchParams(useLocation().search));
  const navigate = useNavigate();
  const partnerTypeLabel = getPartnerTypeLabel(partnerType);

  const initialFormData = {
    surname: "",
    firstname: "",
    Email: "",
    address: "",
    region: "",
    resume: null,
    preferredPosition: "",
    preferredIndustry: "",
    preferredLocation: "",
    preferredJobType: "",
    certification: null,
    workVisaStatus: "",
    workRightsProof: null,
    };

    const requiredFields = {
    surname: "姓氏",
    firstname: "名字",
    Email: "邮箱",
    address: "地址",
    region: "区域",
    resume: "简历",
    preferredPosition: "期望职位",
    preferredIndustry: "行业",
    preferredLocation: "期望工作地点",
    preferredJobType: "工作类型",
    workVisaStatus: "工作签证状态",
    workRightsProof: "工作权利证明",
    };

  const [formData, setFormData] = useState(initialFormData);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productName || !partnerID) {
      alert("缺少必要参数，非法访问！");
      navigate("/");
    }
  }, [productName, partnerID, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpload = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("files", file);
    const res = await axios.post(`${STRAPI_HOST}/api/upload`, data, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return res.data?.[0]?.id || null;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);

    const missingFields = Object.entries(requiredFields)
    .filter(([key]) => {
        const value = formData[key];
        return value === "" || value === null || value === undefined;
    })
    .map(([_, label]) => label);

    if (missingFields.length > 0) {
    setLoading(false);
    setError(`请填写以下字段：${missingFields.join("、")}`);
    return;
    }

    try {
      const query = `?filters[productName][$eq]=${encodeURIComponent(productName)}&filters[partnerID][$eq]=${encodeURIComponent(partnerID)}&fields[0]=documentId&fields[1]=companyName&fields[2]=advisorFirstName&fields[3]=advisorLastName`;


      const partnerRes = await axios.get(`${PARTNER_URL}${query}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

    //   console.log("📦 partnerRes:", JSON.stringify(partnerRes.data, null, 2)); // 加上这句

      const partnerEntry = partnerRes.data?.data?.[0];
      if (!partnerEntry) throw new Error("未找到对应合作伙伴");

      const documentId = partnerEntry.documentId;
      const companyName = partnerEntry.companyName;
      const advisorFirstName = partnerEntry.advisorFirstName;
      const advisorLastName = partnerEntry.advisorLastName;

    //   console.log("✅ 从 partnerEntry 中提取字段：", {
    //     documentId,
    //     companyName,
    //     advisorFirstName,
    //     advisorLastName
    //   });



      if (!partnerEntry) throw new Error("未找到对应合作伙伴");

      const partnerDocumentId = partnerEntry?.documentId;
      if (!partnerDocumentId) throw new Error("合作伙伴缺少 documentId");

      // 1. 创建 Customer 并绑定 Partner
      // 上传 resume 和 workRightsProof 文件，获取 fileId
    const resumeFileId = await handleUpload(formData.resume);
    const workRightsProofFileId = await handleUpload(formData.workRightsProof);
    const certificationFileId = await handleUpload(formData.certification);

    // 创建 Customer 表单
    const customerRes = await axios.post(
    CUSTOMER_URL,
    {
        data: {
        customerID: uuidv4(),
        surname: formData.surname,
        firstname: formData.firstname,
        Email: formData.Email,
        address: formData.address,
        region: formData.region,
        preferredPosition: formData.preferredPosition,
        preferredIndustry: formData.preferredIndustry,
        preferredLocation: formData.preferredLocation,
        preferredJobType: formData.preferredJobType,
        // certification: formData.certification,
        workVisaStatus: formData.workVisaStatus,
        otherNeeds: formData.otherNeeds,
        Partner: partnerDocumentId,

        // 文件字段：使用上传返回的 file.id
        certification: certificationFileId,
        resume: resumeFileId,
        workRightsProof: workRightsProofFileId,

        // 附加元数据
        productName,
        partnerType: partnerTypeLabel,
        partnerID,
        companyName,
        advisorFirstName,
        advisorLastName,
        },
    },
    {
        headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        },
    }
    );

      const customerDocumentId = customerRes.data?.data?.documentId;
      if (!customerDocumentId) throw new Error("创建用户失败");

      // 2. 反向绑定 Partner → Customer
      await axios.put(
        `${PARTNER_URL}/${partnerDocumentId}`,
        {
          data: {
            Customer: {
              connect: [customerDocumentId],
            },
          },
        },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      // 3. 邮件通知
      axios.post(MAIL_NOTIFY_API, {
        ...formData,
        partnerID,
        productName,
        partnerType,
        companyName,
        advisorFirstName,
        advisorLastName,
      }).catch((err) => console.warn("邮件通知失败", err));

      // 4. 成功重置
      setSuccess(true);
      setFormData(initialFormData);

      setTimeout(() => {
        navigate(`/products/${encodeURIComponent(productName)}/${partnerType}/PartnerDetail`);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error?.message || "提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="customer-application-form" style={{ position: "relative" }}>
    
      <div
        className="back-button"
        onClick={() => navigate(`/products/${encodeURIComponent(productName)}/${partnerType}/PartnerDetail`)}
      >
        <FiArrowLeft />
        <span className="back-text">返回</span>
      </div>      

      <h2 className="form-title">请完善信息</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ 提交成功！</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>姓名</Form.Label>
          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Control
              type="text"
              placeholder="姓"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              required
            />
            <Form.Control
              type="text"
              placeholder="名"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>邮箱</Form.Label>
          <Form.Control
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="region">
        <Form.Label>所在区域</Form.Label>
        <Form.Select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
        >
            <option value="">请选择所在区域</option>
            <option value="NSW">新南威尔士州 (NSW)</option>
            <option value="VIC">维多利亚州 (VIC)</option>
        </Form.Select>
        </Form.Group>      

        <Form.Group className="mb-3">
          <Form.Label>现居住地址</Form.Label>
          <Form.Control
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="请输入您的详细居住地址"
            required
          />
        </Form.Group>












        <Form.Group className="mb-3">
        <Form.Label>上传简历 (上传文件大小不得大于10MB)</Form.Label>
        <Form.Control
            type="file"
            name="resume"
            onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>期望职位</Form.Label>
        <Form.Control
            name="preferredPosition"
            value={formData.preferredPosition}
            onChange={handleChange}
            placeholder="例如：市场专员，前端开发"
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>行业</Form.Label>
        <Form.Control
            name="preferredIndustry"
            value={formData.preferredIndustry}
            onChange={handleChange}
            placeholder="例如：教育，科技，零售"
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>期望工作地点</Form.Label>
        <Form.Control
            name="preferredLocation"
            value={formData.preferredLocation}
            onChange={handleChange}
            placeholder="例如：悉尼，墨尔本"
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>工作类型</Form.Label>
        <Form.Select
            name="preferredJobType"
            value={formData.preferredJobType}
            onChange={handleChange}
        >
            <option value="">请选择</option>
            <option value="全职">全职</option>
            <option value="兼职">兼职</option>
            <option value="实习">实习</option>
        </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>资格证书 (上传文件大小不得大于10MB)</Form.Label>
        <Form.Control
            type="file"
            name="certification"
            onChange={(e) => setFormData({ ...formData, certification: e.target.files[0] })}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>工作签证状态</Form.Label>
        <Form.Select
            name="workVisaStatus"
            value={formData.workVisaStatus}
            onChange={handleChange}
            required
        >
            <option value="">请选择</option>
            <option value="工作签证">工作签证</option>
            <option value="澳大利亚永久居留权">澳大利亚永久居留权</option>
            <option value="澳大利亚公民身份">澳大利亚公民身份</option>
        </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>上传工作权利证明 (例如工作签证，上传文件大小不得大于10MB)</Form.Label>
        <Form.Control
            type="file"
            name="workRightsProof"
            onChange={(e) => setFormData({ ...formData, workRightsProof: e.target.files[0] })}
        />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>其他特别需求</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="otherNeeds"
            value={formData.otherNeeds}
            onChange={handleChange}
            placeholder="请输入其他需求"
          />
        </Form.Group>

        {error && (
        <Alert variant="danger" style={{ marginTop: "20px" }}>
            {error}
        </Alert>
        )}

        <div style={{ textAlign: "center" }}>
        <Button type="submit" disabled={loading} className="primary-submit-btn">
            {loading ? <Spinner animation="border" size="sm" /> : "提交"}
        </Button>
        </div>
      </Form>
    </Container>
  );
};

export default RecruitmentAgencyForm;
