import axios from "axios";
import { AlertsAPIEndPoints } from "./apiEndPoints";

export const createAlerts = (data) => axios.post(AlertsAPIEndPoints.createAlerts(),data);
export const getAlertsByUserId = (id,type) => axios.get(AlertsAPIEndPoints.getAlertsByUserId(id,type));
export const getAllalerts = () => axios.get(AlertsAPIEndPoints.getAllalerts());