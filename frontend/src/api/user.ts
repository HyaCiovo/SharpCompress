import request from "@/utils/request";

export const login = (params: {
  phone: string;
  captcha: string;
  channelCode: string;
  terraceCode: string;
}) => {
  return request
    .post("/api/h5/user/login-by-captcha", params)
    .then((res) => res.data);
};

export const getUserInfo = () => {
  return request.get("/api/h5/user/get-user-detail").then((res) => res.data);
};

/**
 * 定制详情
 * @param params
 * @returns
 */
export const getCustomDetail = (params: {
  assetsNo: string;
  interestsId: number;
}) => {
  return request
    .get("/api/h5/my-goods/get-custom-detail", { params })
    .then((res) => res.data);
};
