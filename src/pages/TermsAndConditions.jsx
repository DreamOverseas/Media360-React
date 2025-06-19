import React from "react";
import { Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const { productName } = useParams();
  const navigate = useNavigate();

  return (
    <Container style={{ marginTop: 32, marginBottom: 32 }}>
      <h2 style={{ marginBottom: 20 }}>条款与条件</h2>
      <div style={{ fontSize: 16, lineHeight: 1.7 }}>
        <p>
          欢迎您成为我们的合作伙伴。请仔细阅读以下条款与条件，这些内容对所有提交申请的用户都适用。
        </p>
        <ol>
          <li>
            <strong>数据真实性：</strong>
            您填写的所有信息必须真实、有效，如发现虚假信息将取消合作资格。
          </li>
          <li>
            <strong>资料使用：</strong>
            您提交的资料仅用于 {productName || "本产品"} 合作伙伴资质审核及业务联络，不会对外泄露。
          </li>
          <li>
            <strong>权利与义务：</strong>
            成为合作伙伴后需遵守双方后续签署的正式协议和平台规则。
          </li>
          <li>
            <strong>其他说明：</strong>
            平台有权根据实际情况对合作伙伴名单进行调整及解释。
          </li>
        </ol>
        <p>
          如有疑问请随时联系我们。点击下方按钮可返回申请表。
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(-1)}
          style={{ marginTop: 20 }}
        >
          返回上一页
        </button>
      </div>
    </Container>
  );
};

export default TermsAndConditions;
