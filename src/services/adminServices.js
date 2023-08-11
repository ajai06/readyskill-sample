import axios from "axios";
import {
  AdminLearnersAPIEndPoints,
  messageCenterAPIEndPoints,
  organizationAPIEndpoints,
  AdminSecurityAPIEndPoints,
  AdminAssessmentAPIEndPoints,
  externalConnectionAPIEndPoints,
  newsItemsAPIEndPoints,
  servicePartnerAPIEndPoints,
} from "../services/apiEndPoints";

export const getAllLearners = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getAllLearners(id));
export const getOrganizationLearners = (orgId, searchString, pageNo) =>
  axios.get(
    AdminLearnersAPIEndPoints.getOrganizationLearners(
      orgId,
      searchString,
      pageNo
    )
  );
export const processUserList = (data) =>
  axios.post(AdminLearnersAPIEndPoints.processUserList(), data);
export const learnerSchoolList = (data) =>
  axios.post(AdminLearnersAPIEndPoints.learnerSchoolList(), data);

export const getAllContacts = (id) =>
  axios.get(messageCenterAPIEndPoints.getAllRelationShipData(id));
export const getLearnerStatus = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getLearnerStatus(id));
export const getActivity = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getActivity(id));
export const getDashboardAlert = (id, type) =>
  axios.get(AdminLearnersAPIEndPoints.getDashboardAlert(id, type));
export const dismissDashboardAlert = (data) =>
  axios.put(AdminLearnersAPIEndPoints.dismissDashboardAlert(), data);
export const changeUserEmail = (reqData) =>
  axios.put(AdminLearnersAPIEndPoints.changeUserEmail(), reqData);
export const changeUserName = (data) =>
  axios.put(AdminLearnersAPIEndPoints.changeUserName(), data);
export const sentResetPasswordMail = (data) =>
  axios.post(AdminLearnersAPIEndPoints.sentResetPasswordMail(), data);

export const getIpAddress = async (ip) => {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let init = { method: "GET", headers: headers };

  return fetch(`https://ipapi.co/${ip}/json/`, init);
};

export const searchContacts = (learnerid, searchstring) =>
  axios.get(AdminLearnersAPIEndPoints.searchContacts(learnerid, searchstring));
export const addNewContact = (id, loggedInUserId, data) =>
  axios.post(AdminLearnersAPIEndPoints.addNewContact(id, loggedInUserId), data);
export const getAllEnrolledPrograms = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getAllEnrolledPrograms(id));
export const getEnrolledProgram = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getEnrolledProgram(id));
export const addNewProgram = (data) =>
  axios.post(AdminLearnersAPIEndPoints.addNewProgram(), data);
export const editProgram = (id, data) =>
  axios.put(AdminLearnersAPIEndPoints.editProgram(id), data);
export const deleteProgram = (id) =>
  axios.delete(AdminLearnersAPIEndPoints.deleteProgram(id));

export const getAllOrgizationsTypesList = () =>
  axios.get(organizationAPIEndpoints.getOrgTypes());
export const getSocialService = (applicationUserId, pageNumber, pageSize) =>
  axios.get(
    AdminLearnersAPIEndPoints.getSocialService(
      applicationUserId,
      pageNumber,
      pageSize
    )
  );
export const addSocialService = (data) =>
  axios.post(AdminLearnersAPIEndPoints.addSocialService(), data);
export const updateSocialService = (data) =>
  axios.put(AdminLearnersAPIEndPoints.updateSocialService(), data);
export const getAllStatusSocialService = () =>
  axios.get(AdminLearnersAPIEndPoints.getAllStatusSocialService());
export const deleteSocialService = (id) =>
  axios.delete(AdminLearnersAPIEndPoints.deleteSocialService(id));
export const getAllCaseWorkers = () =>
  axios.get(AdminLearnersAPIEndPoints.getAllCaseWorkers());
export const getEducationAndSponsoredCount = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getEducationAndSponsoredCount(id));
export const getSocialServiceCount = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getSocialServiceCount(id));
export const getMessageThreadDetails = (primaryUserId, secondaryUserId) =>
  axios.get(
    AdminLearnersAPIEndPoints.messageThreadDetails(
      primaryUserId,
      secondaryUserId,
      secondaryUserId
    )
  );
export const getAllOrgList = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getAllOrgList(id));
export const upDateLearner = (id, data) =>
  axios.put(AdminLearnersAPIEndPoints.upDateLearner(id), data);
export const getPlatformModules = () =>
  axios.get(AdminLearnersAPIEndPoints.getPlatformModules());
export const getEducationEnrollment = (id) =>
  axios.get(AdminLearnersAPIEndPoints.getEducationEnrollment(id));
export const getAllUsersForcontactCheck = () =>
  axios.get(AdminLearnersAPIEndPoints.getAllUsersForcontactCheck());
export const getLoginOptions = (id) =>
  axios.get(AdminSecurityAPIEndPoints.getLoginOptions(id));

export const getAccountLockoutOptions = () =>
  axios.get(AdminSecurityAPIEndPoints.getAccountLockoutOptions());
export const saveAccountLockoutOptions = (data) =>
  axios.post(AdminSecurityAPIEndPoints.saveAccountLockoutOptions(), data);
export const getSelectedAccountLockout = (organizationId) =>
  axios.get(
    AdminSecurityAPIEndPoints.getSelectedAccountLockout(organizationId)
  );
export const getGeoBlockingOptions = () =>
  axios.get(AdminSecurityAPIEndPoints.getGeoBlockingOptions());
export const updateGeoBlockingOptions = (organizationId, data) =>
  axios.put(
    AdminSecurityAPIEndPoints.updateGeoBlockingOptions(organizationId),
    data
  );
export const updateLoginOptions = (id, data) =>
  axios.put(AdminSecurityAPIEndPoints.updateLoginOptions(id), data);
export const removeContact = (data) =>
  axios.put(AdminLearnersAPIEndPoints.removeContact(), data);
export const getAssessmentList = () =>
  axios.get(AdminAssessmentAPIEndPoints.getAssessmentList());

export const publishAssesmentStatus = (data) =>
  axios.post(AdminAssessmentAPIEndPoints.publishAssesmentStatus(), data);

export const createAssessment = (data) =>
  axios.post(AdminAssessmentAPIEndPoints.createAssessment(), data);
export const updateAssessment = (data) =>
  axios.put(AdminAssessmentAPIEndPoints.updateAssessment(), data);
export const getReminderOptions = () =>
  axios.get(AdminAssessmentAPIEndPoints.getReminderOptions());
export const getComputationList = () =>
  axios.get(AdminAssessmentAPIEndPoints.getComputationList());
export const redirectOptionsList = () =>
  axios.get(AdminAssessmentAPIEndPoints.redirectOptionsList());
export const assessmentNameCheck = (name) =>
  axios.get(AdminAssessmentAPIEndPoints.assessmentNameCheck(name));
export const getAnswerTypes = () =>
  axios.get(AdminAssessmentAPIEndPoints.getAnswerTypes());
export const getExistingCategoryList = () =>
  axios.get(AdminAssessmentAPIEndPoints.getExistingCategoryList());
export const deleteAnswer = (answerId, applicationUserId) =>
  axios.delete(
    AdminAssessmentAPIEndPoints.deleteAnswer(answerId, applicationUserId)
  );
export const deleteQuestionAnswer = (questionId, applicationUserId) =>
  axios.delete(
    AdminAssessmentAPIEndPoints.deleteQuestionAnswer(
      questionId,
      applicationUserId
    )
  );
export const getIndustryTypes = () =>
  axios.get(organizationAPIEndpoints.getIndustryTypes());

export const deleteIndustry = (industryId, userId) =>
  axios.delete(organizationAPIEndpoints.deleteIndustry(industryId, userId));

export const createIndustry = (data) =>
  axios.post(organizationAPIEndpoints.createIndustry(), data);

export const editIndustry = (data) =>
  axios.put(organizationAPIEndpoints.editIndustry(), data);

export const checkIndustryForDuplicate = (oNet, industry) =>
  axios.get(organizationAPIEndpoints.checkIndustryForDuplicate(oNet, industry));

export const getAllExternalConnections = (data) =>
  axios.get(organizationAPIEndpoints.getAllExternalConnections());

export const editExternalConnection = (data) =>
  axios.put(organizationAPIEndpoints.editExternalConnection(), data);

export const updateFederatedLoginTypes = (id, data) =>
  axios.put(externalConnectionAPIEndPoints.updateFederatedLoginTypes(id), data);
export const emailConnectorTest = (data) =>
  axios.post(externalConnectionAPIEndPoints.emailConnectorTest(), data);
export const saveEmailConnectorDetails = (data) =>
  axios.post(externalConnectionAPIEndPoints.saveEmailConnectorDetails(), data);
export const getExternalLoginTypesPortalSecurity = () =>
  axios.get(externalConnectionAPIEndPoints.getExternalLoginTypesPortal());

export const getExternalLoginTypeByUser = (organizationId, applicationUserId) =>
  axios.get(
    externalConnectionAPIEndPoints.getExternalLoginTypeByUser(
      organizationId,
      applicationUserId
    )
  );

export const getApiConnectorDetails = () =>
  axios.get(externalConnectionAPIEndPoints.getApiConnectorDetails());

// news items
export const getAllNewsItems = () =>
  axios.get(newsItemsAPIEndPoints.getAllNews());
export const saveNewsEditor = (data) =>
  axios.post(newsItemsAPIEndPoints.saveNewsEditor(), data);
export const updateNewsEditor = (id, data) =>
  axios.put(newsItemsAPIEndPoints.updateNewsEditor(id), data);
export const newsTitleCheck = (title) =>
  axios.get(newsItemsAPIEndPoints.newsTitle(title));
export const uploadNewsImage = (id, data) =>
  axios.post(newsItemsAPIEndPoints.uploadNewsImage(id), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const copyNewsItem = (data) =>
  axios.post(newsItemsAPIEndPoints.copyNews(), data);
export const getNewsById = (id) =>
  axios.get(newsItemsAPIEndPoints.getNewsById(id));
export const deleteNews = (data) =>
  axios.put(newsItemsAPIEndPoints.deleteNews(), data);
export const purgeNews = (id) =>
  axios.delete(newsItemsAPIEndPoints.purgeNews(id));
export const publishNews = (data) =>
  axios.put(newsItemsAPIEndPoints.publishNews(), data);
export const addNewsToGroups = (data) =>
  axios.post(newsItemsAPIEndPoints.addNewsToGroups(), data);
export const removeNewsFromGroups = (data) =>
  axios.post(newsItemsAPIEndPoints.removeNewsFromGroups(), data);
export const getGroups = (organizationId) =>
  axios.get(newsItemsAPIEndPoints.getGroups(organizationId));
export const getEventTypes = () =>
  axios.get(newsItemsAPIEndPoints.getEventTypes());

export const getSocialServiceByOrganization = (orgId) =>
  axios.get(servicePartnerAPIEndPoints.getSocialServiceByOrganization(orgId));
export const getAssessmentType = () =>
  axios.get(AdminAssessmentAPIEndPoints.getAssessmentType());


export const publishSingleAssessment = (data) =>
  axios.post(AdminAssessmentAPIEndPoints.publishSingleAssessment(), data);