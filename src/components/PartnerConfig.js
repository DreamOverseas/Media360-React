const partnerTypeLabelMap = {
  lvyouzhongjie: "旅游中介",
  jiamengshang: "加盟商",
  liuxuezhongjie: "留学中介",
  yiminzhongjie: "移民中介",
  yiminguwen: "移民顾问",
};

export const getPartnerTypeLabel = (key) => {
  return partnerTypeLabelMap[key] || "合作伙伴";
};

export default partnerTypeLabelMap;
