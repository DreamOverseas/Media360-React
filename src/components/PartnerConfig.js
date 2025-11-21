export const partnerTypeLabelMap = {
  "travel-agency": "旅游中介",
  "franchise-partner": "加盟商",
  "study-abroad-agency": "留学中介",
  "immigration-advisor": "移民顾问",
  "recruitment-agency": "招聘中介",

  "partner": "合作伙伴",
};


export const getPartnerTypeLabel = (key) => {
  return partnerTypeLabelMap[key] || "合作伙伴";
};

