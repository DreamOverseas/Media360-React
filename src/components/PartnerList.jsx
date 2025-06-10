import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";

const PartnerList = ({ currentProductName }) => {
  console.log("✅ PartnerList 渲染了，当前产品：", currentProductName);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_STRAPI_HOST}/api/product-screen-join-applications?sort=createdAt:desc&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY_PRODUCT_JOIN_APPLICATIONS}`,
            },
          }
        );

        const all = res.data.data || [];
        console.log("📦 所有申请原始数据:", all);

        // 修正这里：因为 sourceProductName 是 item 顶层字段
        const filtered = all.filter((item, index) => {
          const fromStrapi = item?.sourceProductName?.trim().toLowerCase();
          const current = currentProductName?.trim().toLowerCase();
          const match = fromStrapi === current;

          console.log(`🧪 对比 [${index}]:`, {
            currentProduct: current,
            fromStrapi,
            match,
          });

          return match;
        });

        console.log("🎯 匹配当前产品的记录:", filtered);
        setApplications(filtered);
      } catch (err) {
        console.error("❌ 拉取申请信息失败", err);
      }
    };

    fetchApplications();
  }, [currentProductName]);

  return (
    <Row className="mt-4">
      <Col>
        <h5>最新申请信息</h5>
        {applications.length === 0 && <p>暂无申请记录。</p>}
        {applications.map((item, idx) => {
          const data = item;

          const logoUrl = data?.companyLogo?.data?.attributes?.url
            ? import.meta.env.VITE_STRAPI_HOST + data.companyLogo.data.attributes.url
            : null;

          const asicUrl = data?.asicCertificate?.data?.attributes?.url
            ? import.meta.env.VITE_STRAPI_HOST + data.asicCertificate.data.attributes.url
            : null;

          return (
            <div
              key={item.id || idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <p><strong>公司名称:</strong> {data.companyName || "N/A"}</p>
              <p><strong>电话:</strong> {data.Phone || "N/A"}</p>
              <p><strong>邮箱:</strong> {data.Email || "N/A"}</p>
              <p><strong>备注:</strong> {data.Notes || "N/A"}</p>
              <p><strong>公司官网:</strong>{" "}
                <a href={data.companyUrlLink} target="_blank" rel="noopener noreferrer">
                  {data.companyUrlLink}
                </a>
              </p>
              <p><strong>ABN:</strong> {data.abnNumber || "N/A"}</p>
              <p><strong>来源产品:</strong> {data.sourceProductName || "N/A"}</p>
              <p><strong>来源链接:</strong>{" "}
                <a href={data.sourceProductUrl} target="_blank" rel="noopener noreferrer">
                  {data.sourceProductUrl}
                </a>
              </p>

              {logoUrl && (
                <p><strong>公司 Logo:</strong><br />
                  <img src={logoUrl} alt="公司Logo" style={{ width: 100 }} />
                </p>
              )}

              {asicUrl && (
                <p><strong>ASIC 证书:</strong><br />
                  <a href={asicUrl} target="_blank" rel="noopener noreferrer">查看证书</a>
                </p>
              )}
            </div>
          );
        })}
      </Col>
    </Row>
  );
};

export default PartnerList;
