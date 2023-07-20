import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "",
  // headers: {
  //   "Cache-Control": "no-cache"
  // },
});

const escapePathnames = ["/account"];

// instance.interceptors.request.use(
//   (config) => {
//     if (config.headers && config.headers['Cache-Control'] === 'no-cache') {
//       config.params = Object.assign(config.params || {}, { t: Date.now() });
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

instance.interceptors.response.use(
  (response) => {
    const { errorCode } = response?.data || {};
    const { pathname } = window.location;
    //用户登录态cookie处理策略
    if (
      !response.config.url?.includes("get-user-detail") &&
      !escapePathnames.includes(pathname) &&
      errorCode === 2003001
    ) {
      Cookies.remove("satoken"); //cookie过期后删除
      window.location.replace("/login");
    }
    return {
      ...response,
      data: {
        success: response?.data?.errorCode === 200,
        data: response?.data?.data,
        originResponse: response.data,
        serverDate: response.headers.date,
        error:
          response?.data?.errorCode === 200
            ? null
            : new Error(response?.data?.message),
      },
    };
  },
  (error) => {
    return {
      ...error,
      data: {
        success: false,
        data: undefined,
        originResponse: error,
        error: new Error(error.message),
      },
    };
  }
);

export default instance;
