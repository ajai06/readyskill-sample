import axios from "axios";
import { resourceAPIEndPoints } from "./apiEndPoints";
export const resourceTrayInformation = (data) => axios.get(resourceAPIEndPoints.resourceTrayInformation(data));