import axios from "axios";
import { locationAPIEndPoints } from "./apiEndPoints";

export const getExternalPartnerServices = () =>axios.get(locationAPIEndPoints.getExternalServices());
export const getLocationByPartnerId = (partnerId) =>axios.get(locationAPIEndPoints.getLocationByPartnerId(partnerId));
export const getResourceTypeByPartnerId = (partnerId) =>axios.get(locationAPIEndPoints.getResourceTypeByPartnerId(partnerId));