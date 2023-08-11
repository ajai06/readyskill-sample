import axios from "axios";
import { learnersAPIEndPoints } from "./apiEndPoints";

export const getLearnersGeneralInformation = (id) =>
  axios.get(learnersAPIEndPoints.getLearnersGeneralInformation(id));
export const getLearnerNameDetails = (id) =>
  axios.get(learnersAPIEndPoints.getLearnerNameDetails(id));
export const getLearnersOverviewDetails = (id) =>
  axios.get(learnersAPIEndPoints.getLearnersOverviewDetails(id));
export const getLearnersActivityDetails = (id) =>
  axios.get(learnersAPIEndPoints.getLearnersActivityDetails(id));

export const getLearnersAssesmentDetails = (userId, assessmentId) =>
  axios.get(
    learnersAPIEndPoints.getLearnersAssesmentDetails(userId, assessmentId)
  );

export const getLearnersAssesmentTopics = (id) =>
  axios.get(learnersAPIEndPoints.getLearnersAssesmentTopics(id));

export const getLearnerEnrolledServices = (id) =>
  axios.get(learnersAPIEndPoints.getLearnerEnrolledServices(id));
export const getLearnerNotesDetails = (
  learnersId,
  organizationId,
  noteCount,
  pageNumber,
  isOrgAdmin
) =>
  axios.get(
    learnersAPIEndPoints.getLearnerNotesDetails(
      learnersId,
      organizationId,
      noteCount,
      pageNumber,
      isOrgAdmin
    )
  );
export const addLearnerNotes = (data) =>
  axios.post(learnersAPIEndPoints.addLearnerNotes(), data);
export const editLearnerNotes = (data) =>
  axios.post(learnersAPIEndPoints.editLearnerNotes(), data);
export const deleteLearnerNotes = (data) =>
  axios.post(learnersAPIEndPoints.deleteLearnerNotes(), data);
export const getAllUsersForNote = () =>
  axios.get(learnersAPIEndPoints.getAllUsersForNote());
export const suspendUser = (data) =>
  axios.put(learnersAPIEndPoints.suspendUser(), data);
export const unSuspendUser = (data) =>
  axios.put(learnersAPIEndPoints.unSuspendUser(), data);
export const deleteUser = (data) =>
  axios.put(learnersAPIEndPoints.deleteUser(), data);
export const resetPasswordUser = (userEmails) =>
  axios.post(learnersAPIEndPoints.resetPasswordUser(), userEmails);
export const suspendMultipleUser = (data) =>
  axios.put(learnersAPIEndPoints.suspendMultipleUser(), data);
export const deleteMultipleUser = (data) =>
  axios.put(learnersAPIEndPoints.deleteMultipleUser(), data);
export const unSuspendMultipleUser = (data) =>
  axios.put(learnersAPIEndPoints.unSuspendMultipleUser(), data);
export const getMessageThreadDetails = (primaryUserId, secondaryUserId) =>
  axios.get(
    learnersAPIEndPoints.messageThreadDetails(
      primaryUserId,
      secondaryUserId,
      secondaryUserId
    )
  );
export const learnersTrayInformation = (data) =>
  axios.get(learnersAPIEndPoints.learnersTrayInformation(data));
export const getLearnerSkills = (id) =>
  axios.get(learnersAPIEndPoints.learnerSkills(id));
export const getLearnerInstitutionId = (id) =>
  axios.get(learnersAPIEndPoints.getLearnerInstitutionId(id));
export const learnerListTrayInformation = () =>
  axios.get(learnersAPIEndPoints.learnerListTrayInformation());
export const careerPathwaySpecialization = () =>
  axios.get(learnersAPIEndPoints.careerPathwaySpecialization());
export const getFlaggedLearnersCount = (req) =>
  axios.get(learnersAPIEndPoints.getFlaggedLearnersCount(req));
  export const getAllUsersNameForNote = (reqData) =>
  axios.post(learnersAPIEndPoints.getAllUsersNameForNote(), reqData);
  export const deleteProfileImage = (id) =>
  axios.delete(learnersAPIEndPoints.deleteProfileImage(id));
  export const updateProfileImage = (id, data) =>
  axios.post(learnersAPIEndPoints.updateProfileImage(id), data, { headers: { 'Content-Type': 'multipart/form-data' } });
