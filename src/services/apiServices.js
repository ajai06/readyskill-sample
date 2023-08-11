import axios from "axios";
import { APIconst } from "../utils/contants";

import { logoutAndClear } from "./userManagementServices";

export const setBaseUrl = (baseurl) => {
   axios.defaults.baseURL = baseurl;
};



// const mainAxios = axios.create({
//   baseURL: 'http://localhost:3000/summary'
// });

// const identityAxios = axios.create({
//   baseURL: 'http://localhost:6000/profile'
// });

export const setToken = (token, id) => {
  axios.defaults.headers.common = {
    Authorization: `Bearer ${token.accessToken}`,
    Refresh_Token: `${token.refreshToken.tokenString}`,
    User_Id: `${id}`
  };
};

export const setHeaders = () => {
  axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";
  axios.defaults.headers["PlatformType"] = "Portal";

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (user) {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${user.token.accessToken}`,
      Refresh_Token: `${user.token.refreshToken.tokenString}`,
      User_Id: `${user.id}`
    };
  }
};

export const createAxiosResponseInterceptor = () => {
  const interceptor = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Reject promise if usual error
      let errorResponse = await error
      if (errorResponse.response.status !== 401) {
        return Promise.reject(error);
      }

      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      axios.interceptors.response.eject(interceptor);
      delete axios.defaults.headers.common["Authorization"];
      delete axios.defaults.headers.common["Refresh_Token"];
      delete axios.defaults.headers.common["User_Id"];

      const user = JSON.parse(localStorage.getItem("user"));

      const obj = {
        accessToken: user.token.accessToken,
        refreshToken: user.token.refreshToken.tokenString,
        userId: user.id
      };
      return axios
        .post(`${APIconst.IDENTITY}/token/reissue-token`, obj)
        .then((response) => {
          const user = JSON.parse(localStorage.getItem("user"));
          user.token = response.data;

          localStorage.setItem("user", JSON.stringify(user));
          error.response.config.headers["Authorization"] =
            "Bearer " + response.data.accessToken;
          error.response.config.headers["Refresh_Token"] =
            response.data.refreshToken;
          error.response.config.headers["User_Id"] = user.id;

          setHeaders();

          return axios(error.response.config);
        })
        .catch((error) => {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            let userid = user.id;

            logoutAndClear(userid)
              .then(() => {
                localStorage.removeItem("user");
                window.location.reload();
              })
              .catch(() => {
                window.location.reload();
                return;
              });
          } else {
            window.location.reload();
            return;
          }
          return Promise.reject(error);
        })
        .finally(createAxiosResponseInterceptor);
    }
  );
};
