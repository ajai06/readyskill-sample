import axios from "axios";
import { SponsoredProgramsAPIEndPoints } from "./apiEndPoints";

export const createProgram = (data) => axios.post(SponsoredProgramsAPIEndPoints.createProgram(), data);
export const updateProgram = (id, data) => axios.put(SponsoredProgramsAPIEndPoints.editProgram(id), data);
export const getProgramsByUserId = (id) => axios.get(SponsoredProgramsAPIEndPoints.getProgramsByUserId(id));
export const getProgramDetailsById = (id) => axios.get(SponsoredProgramsAPIEndPoints.getProgramDetailsById(id));
export const deleteProgram = (id) => axios.delete(SponsoredProgramsAPIEndPoints.deleteProgram(id));