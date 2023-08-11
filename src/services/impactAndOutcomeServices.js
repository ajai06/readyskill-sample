import axios from "axios";
import { ImpactAndOutComesAPIEndPoints } from "./apiEndPoints";

export const getImpactAndOutcomeTray = (data) => axios.get(ImpactAndOutComesAPIEndPoints.getTrayInformation(),data);
export const getImpactAndOutcomeTrayCount = (endpoint,userid) => axios.get(ImpactAndOutComesAPIEndPoints.getImpactAndOutcomeTrayCount(endpoint,userid));
export const ServiceGetTrayInformation = (data) => axios.get(ImpactAndOutComesAPIEndPoints.ServiceGetTrayInformation(),data);
export const ServiceGetImpactAndOutcomeTrayCount = (endpoint,userid) => axios.get(ImpactAndOutComesAPIEndPoints.ServiceGetImpactAndOutcomeTrayCount(endpoint,userid));