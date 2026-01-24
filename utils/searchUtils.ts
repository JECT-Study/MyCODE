const REGION_KEYWORD: Record<string, string> = {
  ALL: "",
  SEOUL: "서울",
  GYEONGGI_INCHEON: "경기",
  GANGWON: "강원",
  CHUNGCHEONG: "충청",
  CHUNGNAM: "충남",
  DAEGU_GYEONGBUK: "대구",
  GYEONGNAM_ULSAN: "경남",
  GWANGJU_JEONNAM: "광주",
  JEONBUK: "전북",
  BUSAN: "부산",
  JEJU: "제주",
};

export const getRegionKeyword = (regionKey: string): string => {
  return REGION_KEYWORD[regionKey] ?? "";
};

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "PERFORMANCE":
      return "공연";
    case "EXHIBITION":
      return "전시";
    case "FESTIVAL":
      return "축제";
    case "EVENT":
      return "행사";
    case "ALL":
    default:
      return "전체";
  }
};

export const getRegionLabel = (region: string): string => {
  switch (region) {
    case "SEOUL":
      return "서울";
    case "GYEONGGI_INCHEON":
      return "경기/인천";
    case "GANGWON":
      return "강원";
    case "CHUNGCHEONG":
      return "충청권";
    case "CHUNGNAM":
      return "충남";
    case "DAEGU_GYEONGBUK":
      return "대구/경북";
    case "GYEONGNAM_ULSAN":
      return "경남/울산";
    case "GWANGJU_JEONNAM":
      return "광주/전남";
    case "JEONBUK":
      return "전북";
    case "BUSAN":
      return "부산";
    case "JEJU":
      return "제주";
    case "ALL":
    default:
      return "지역";
  }
};

const REGION_NAME_TO_KEY: Record<string, string> = {
  서울: "SEOUL",
  "경기·인천": "GYEONGGI_INCHEON",
  강원: "GANGWON",
  "충청권(충북·대전·세종)": "CHUNGCHEONG",
  충남: "CHUNGNAM",
  "대구·경북": "DAEGU_GYEONGBUK",
  "경남·울산": "GYEONGNAM_ULSAN",
  "광주·전남": "GWANGJU_JEONNAM",
  전북: "JEONBUK",
  부산: "BUSAN",
  제주: "JEJU",
};

export const mapUserRegionNameToKey = (regionName: string): string => {
  return REGION_NAME_TO_KEY[regionName] ?? "ALL";
};
