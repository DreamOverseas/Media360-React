import React from "react";
import { useParams } from "react-router-dom"; // 如果你想传 companyId 过来
import "../../css/PartnerApplicationForm.css";


const PartnerApplicationForm = () => {
  const { companyId } = useParams(); // 如果你路由中传了参数

  return (
    <div className="partner-application-form">
      <h3>申请加入合作伙伴</h3>
      <form>
        <label>公司名称：</label>
        <input type="text" name="companyName" />

        <label>联系人邮箱：</label>
        <input type="email" name="email" />

        {/* 你可以添加更多字段，例如：备注、ABN、附件上传等 */}

        <button type="submit">提交申请</button>
      </form>
    </div>
  );
};

export default PartnerApplicationForm;
