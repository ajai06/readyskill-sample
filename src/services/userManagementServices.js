import axios from "axios";

import { userManagementAPIEndpoints } from "./apiEndPoints";


export const login = (data) => axios.post(userManagementAPIEndpoints.userLogin(), data);

export const invitedUserRegister = (data) => axios.post(userManagementAPIEndpoints.userRegister(), data);

export const inviteCodeVerify = (data) => axios.post(userManagementAPIEndpoints.verifyCode(), data);

export const verifyInvitedUser = (data) => axios.post(userManagementAPIEndpoints.verifyUser(), data);

export const resetPasswordSentOtp = (data) => {
    return axios.get(userManagementAPIEndpoints.forgetPassword(data.userEmail), { headers: { IpAddress: data.ipAddress } });
}
export const setNewPassword = (data) => axios.post(userManagementAPIEndpoints.changePassword(), data);

export const confirmNewEmail = (data) => axios.put(userManagementAPIEndpoints.confirmNewEmail(), data);

export const confirmEmail = (data) => axios.post(userManagementAPIEndpoints.confirmEmail(), data);

export const external_login = (data) => {
    let ip = localStorage.getItem("ipAddress")
    return axios.post(userManagementAPIEndpoints.externalUserlogin(), data, { headers: { IpAddress: ip ? ip : "" } })
};

export const external_register = (data) => axios.post(userManagementAPIEndpoints.externalUserRegister(), data);

export const linkedIn_api = (token) => axios.get(userManagementAPIEndpoints.linkedInAPI(token));

export const resetPasswordByLearner = (data) => axios.post(userManagementAPIEndpoints.resetPasswordByLearner(), data);


export const google_api = async (token) => {

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let init = { method: "GET", headers: headers }

    return fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`, init)
}

export const microsoft_api = async (token, email) => {

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`)
    let init = { method: "GET", headers: headers }

    return fetch(`https://graph.microsoft.com/v1.0/users/${email}`, init)
}

export const getIpAddress = async () => {

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let init = { method: "GET", headers: headers }

    return fetch("https://ipapi.co/json/", init)
}

export const logoutAndClear = async (userid) => {

    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Refresh_Token'];
    delete axios.defaults.headers.common['User_Id'];

    return axios.get(userManagementAPIEndpoints.userLogout(userid));
}


