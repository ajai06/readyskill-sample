import axios from "axios";
import { programsAPIEndPoints } from "./apiEndPoints";

export const programsTrayInformation = (data) => axios.get(programsAPIEndPoints.programsTrayInformation(data));