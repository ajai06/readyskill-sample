import axios from "axios";
import { AppConfig } from "./config";

import { messageCenterAPIEndPoints } from "./apiEndPoints";

export const getConversationData = (id) => axios.get(messageCenterAPIEndPoints.getConversationData(id));
export const getAllRelationShipData = (id) => axios.get(messageCenterAPIEndPoints.getAllRelationShipData(id));
export const getChatHistory = (uuid,threadId) => axios.get(messageCenterAPIEndPoints.getChatHistory(uuid,threadId));
export const getUsersForThread = (uuid,threadId) => axios.get(messageCenterAPIEndPoints.getUsersForThread(uuid,threadId));
export const createThreadRequest = (data) => axios.post(messageCenterAPIEndPoints.createThreadRequest(),data);
export const sendMessageCenterTrayInformation = () => axios.get(messageCenterAPIEndPoints.sendMessageCenterTrayInformation());
export const sendMessageRequest = (reqData) => axios.post(messageCenterAPIEndPoints.sendMessageRequest(), reqData);
// export const updateMessageAsDelivered = (reqData) => axios.post(messageCenterAPIEndPoints.updateMessageAsDelivered(), reqData);

export const updateMessageAsDelivered = async (reqData) => {

    let tokenObj = JSON.parse(localStorage.getItem("user")).token
    let headers = new Headers({
        'Authorization': `Bearer ${tokenObj.accessToken}`, 
        'Refresh_Token': `${tokenObj.refreshToken.tokenString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',

    });
    let init = {method: "POST",headers: headers,  body: JSON.stringify(reqData)}

    return fetch(`${AppConfig.baseUrl}/${messageCenterAPIEndPoints.updateMessageAsDelivered()}`, init)
}

export const updateMessageAsRead = (reqData) => axios.put(messageCenterAPIEndPoints.updateMessageAsRead(reqData), reqData);
export const updateThreadMessageName = (reqData, messagethreadId) => axios.put(messageCenterAPIEndPoints.updateThreadMessageName(messagethreadId), reqData);
export const addUserToThread = (reqData, threadId) => axios.put(messageCenterAPIEndPoints.addUserToThread(threadId), reqData);
export const userSearch = (userId, threadId) => axios.get(messageCenterAPIEndPoints.userSearch(threadId, userId));
export const sendMessageCenterTrayInformationCount = (endPoint, userId) => axios.get(messageCenterAPIEndPoints.sendMessageCenterTrayInformationCount(endPoint, userId));
export const deleteThread = (reqData) => axios.post(messageCenterAPIEndPoints.deleteThread(), reqData);
export const addNewUsertoThread = (threadId, reqData) => axios.put(messageCenterAPIEndPoints.addNewUsertoThread(threadId), reqData);
export const updateUserThread = (id, reqData) => axios.put(messageCenterAPIEndPoints.updateUserThread(id), reqData);
export const getAllThreadid = (id) => axios.get(messageCenterAPIEndPoints.getAllThreadid(id));
export const getBlockedUsersInThread = (userId, threadId) => axios.get(messageCenterAPIEndPoints.getBlockedUsersInThread(userId, threadId));
export const getFlaggedLearnersInThread = (orgId) => axios.get(messageCenterAPIEndPoints.getFlaggedLearnersInThread(orgId));
export const sendNotificationRequest = (req) => axios.post(messageCenterAPIEndPoints.sendNotificationRequest(), req)

