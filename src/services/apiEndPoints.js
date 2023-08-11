import { APIconst } from '../utils/contants';

export const userManagementAPIEndpoints = {
    userLogin: () => `${APIconst.IDENTITY}/authentication/login`,
    userRegister: () => `${APIconst.IDENTITY}/authentication/register`,
    verifyCode: () => `${APIconst.IDENTITY}/invite/verify-invite-code-organization`,
    verifyUser: () => `${APIconst.IDENTITY}/invite/verify-invite-Code`,
    forgetPassword: (userEmail) => `${APIconst.IDENTITY}/authentication/forget-password/${userEmail}`,
    changePassword: () => `${APIconst.IDENTITY}/authentication/change-password`,
    confirmEmail: () => `${APIconst.IDENTITY}/authentication/confirmEmail`,
    externalUserRegister: () => `${APIconst.IDENTITY}/externalauthentication/externalregister`,
    externalUserlogin: () => `${APIconst.IDENTITY}/externalauthentication/externallogin`,
    linkedInAPI: (token) => `${APIconst.IDENTITY}/externalauthentication/linkedin-user-details?token=${token}`,
    userLogout: (userid) => `${APIconst.IDENTITY}/authentication/logout/${userid}`,
    confirmNewEmail: () => `${APIconst.IDENTITY}/authentication/confirm-new-email`,
    resetPasswordByLearner: () => `${APIconst.IDENTITY}/authentication/reset-password-by-learner`
};


export const organizationAPIEndpoints = {
    getAllOrgList: (id) => `${APIconst.IDENTITY}/organization/get-all/${id}`,
    getOrganizationDetails: (id) => `${APIconst.IDENTITY}/organization/get-organization/${id}`,
    addOrg: () => `${APIconst.IDENTITY}/organization/create-organization`,
    editOrg: (id) => `${APIconst.IDENTITY}/organization/update/${id}`,
    deleteOrg: () => `${APIconst.IDENTITY}/organization/inactive`,
    organizationblock: () => `${APIconst.IDENTITY}/organization/organizationblock`,
    getAllUsers: (id) => `${APIconst.IDENTITY}/identityuser/get-user/${id}`,
    updateUserDetails: () => `${APIconst.IDENTITY}/identityuser/update-userdetails-role`,
    sentInvitation: () => `${APIconst.IDENTITY}/invite`,
    generateCode: (orgId) => `${APIconst.IDENTITY}/invite/refresh-organization-inviteCode/${orgId}`,
    getOrgTypes: () => `${APIconst.IDENTITY}/organization/get-organization-types`,
    getRoles: () => `${APIconst.IDENTITY}/role/get-all-roles`,
    deleteOrgUser: () => `${APIconst.IDENTITY}/identityuser/delete-user`,
    getExaternalLoginTypes: () => `${APIconst.IDENTITY}/organization/get-external-login-types`,
    suspendUser: () => `${APIconst.IDENTITY}/identityuser/suspend-user`,
    unSuspendUser: () => `${APIconst.IDENTITY}/identityuser/unsuspend-user`,
    orgOverViewUpdate: () => `${APIconst.IDENTITY}/organization/update-partial`,
    getOrganizationUsers: (orgId, searchString, pageNo) => `${APIconst.IDENTITY}/identityuser/get-all-users-by-organization/${orgId}`,
    uploadProfileImage: (id) => `${APIconst.IDENTITY}/blob/update-organization-image?organizationId=${id}`,
    deleteProfileImage: (id) => `${APIconst.IDENTITY}/blob/remove-organization-image/${id}`,
    getClassificationInfoDetails: () => `${APIconst.IDENTITY}/industrytype/get-all-industrytypes`,
    getExternalLoginTypeMapping: (userId, orgId) => `${APIconst.IDENTITY}/userexternal-loginmapping/get/${userId}/${orgId}`,
    setExternalLoginTypeMapping: () => `${APIconst.IDENTITY}/userexternal-loginmapping/update`,
    getOrganizationInfo: () => `${APIconst.IDENTITY}/organization/get-learning-model`,
    updateLearningModel: () => `${APIconst.IDENTITY}/organization/update-organization-learning-model`,
    getUserNameByEmail: (email) => `${APIconst.IDENTITY}/identityuser/get-user-by-email/${email}`,
    organizationListTrayInformation: () => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/Platform Admin/Organization`,
    getIndustryTypes: () => `${APIconst.IDENTITY}/industrytype/get-all-industrytypes`,
    deleteIndustry: (industryId, userId) => `${APIconst.IDENTITY}/industrytype/delete-industrytype/${industryId}/${userId}`,
    createIndustry: () => `${APIconst.IDENTITY}/industrytype/create-new-industrytype`,
    editIndustry: () => `${APIconst.IDENTITY}/industrytype/update-industrytype`,
    checkIndustryForDuplicate: (oNet, industry) => `${APIconst.IDENTITY}/industrytype/industrytype-exists-checking/${oNet}/${industry}`,
    getAllExternalConnections: () => `${APIconst.TRAYCONFIG}/externalconnection/getall-external-connection`,
    editExternalConnection: () => `${APIconst.TRAYCONFIG}/externalconnection/edit-external-connection`,
    updateServiceTypeModel: () => `${APIconst.IDENTITY}/organization/update-organization-service-type`,
    getOrganizationServiceTypes: () => `${APIconst.IDENTITY}/organization/get-service-type-model`
};

export const dashboardAPIEndPoints = {
    getInformtionTrayDetails: () => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/employer/dashboard`,
    getInformtionTrayCount: (endPoint, userId) => `${endPoint}${userId}`,
    getDashBoardSponsoredPrograms: (id) => `${APIconst.PROGRAMS}/enrolled-programs/get-enrollment-cards/${id}`,
    getCandidateTrayFilter: (id) => `${APIconst.CANDIDATES}/CandidatesTrayFilter/get/${id}`,
    // getCandidateCardDetails: () => `CandidateCard`,
    getCandidateCardDetails: () => `${APIconst.USER}/users/process-candidate-cards`,
    serviceDashboardTrayInformation: (data) => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/${data.userType}/${data.page}`,
    knowledgeDashboardTrayInformation: () => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/Knowledge/Dashboard`,
    serviceDashboardUsers: (organizationId) => `${APIconst.IDENTITY}/identityuser/get-all-users-by-organization/${organizationId}`,
    getDashboardAlert: (id, type) => `${APIconst.ALERTS}/dashboardalerts/get-alerts-by-user/${id}/${type}`,
    dismissDashboardAlert: () => `${APIconst.ALERTS}/dashboardalerts/dismiss-alert`,
    getDashBoardMessages: (id) => `dashboard-messages/${id}`,
    getUnReadMessages: (id) => `${APIconst.MESSAGES}/messagethread/message-threads-details-by-user/${id}`,
    getUnReadMsgCount: (id) => `${APIconst.MESSAGES}/informationtray/unread-msg-count/${id}`,
    updateMessageAsDelivered: () => `${APIconst.MESSAGES}/messages/update-messages-as-delivered`,
};

export const learnersAPIEndPoints = {
    getLearnerInstitutionId: (id) => `${APIconst.IDENTITY}/organization/get-organization/${id}`,
    getLearnersGeneralInformation: (id) => `${APIconst.USER}/users/get-userprofile-by-user/${id}`,
    getLearnerNameDetails: (id) => `${APIconst.IDENTITY}/identityuser/get-application-user/${id}`,
    getLearnersOverviewDetails: (id) => `get-learner-by-id/${id}`,
    getLearnersActivityDetails: (id) => `${APIconst.ACTIVITY}/activity/get/${id}`,
    getLearnersAssesmentDetails: (userId, assessmentId) => `${APIconst.ASSESSMENTS}/assessments/get-assessment-questions-attended/${userId}/${assessmentId}`,
    getLearnersAssesmentTopics: (id) => `${APIconst.ASSESSMENTS}/assessments/get-all-assessment/${id}`,
    getLearnerEnrolledServices: (id) => `${APIconst.SOCIALSERVICE}/socialservice/get-social-serviceby-userid/${id}`,
    getLearnerNotesDetails: (learnersId, organizationId, noteCount, pageNumber, isOrgAdmin) => `${APIconst.USER}/notes/get/${learnersId}/${organizationId}/${noteCount}/${pageNumber}/${isOrgAdmin}`,
    addLearnerNotes: () => `${APIconst.USER}/notes/add`,
    editLearnerNotes: () => `${APIconst.USER}/notes/edit`,
    deleteLearnerNotes: () => `${APIconst.USER}/notes/delete`,
    getAllUsersForNote: () => `${APIconst.IDENTITY}/identityuser/get-all-user`,
    suspendUser: () => `${APIconst.IDENTITY}/identityuser/suspend-user`,
    unSuspendUser: () => `${APIconst.IDENTITY}/identityuser/unsuspend-user`,
    deleteUser: () => `${APIconst.IDENTITY}/identityuser/delete-user`,
    resetPasswordUser: () => `${APIconst.IDENTITY}/authentication/admin-password-reset`,
    suspendMultipleUser: () => `${APIconst.IDENTITY}/identityuser/suspend-multiple-user`,
    deleteMultipleUser: () => `${APIconst.IDENTITY}/identityuser/delete-multiple-user`,
    unSuspendMultipleUser: () => `${APIconst.IDENTITY}/identityuser/unsuspend-multiple-user`,
    messageThreadDetails: (primaryUserId, secondaryUserId) => `${APIconst.MESSAGES}/messagethread/message-thread-by-users/${primaryUserId}/${secondaryUserId}`,
    learnersTrayInformation: (data) => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/${data.userType}/${data.page}`,
    getAllUsersForCandidateName: () => `${APIconst.IDENTITY}/identityuser/get-all-active-user`,
    getCandidateEnrolledDetails: () => `${APIconst.PROGRAMS}/enrolled-programs/get-all-enrolled-candidate-programs`,
    learnerSkills: (id) => `${APIconst.USER}/userskill/get-skills-by-user/${id}`,
    learnerListTrayInformation: () => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/Platform Admin/Learner`,
    careerPathwaySpecialization: () => `${APIconst.PROGRAMS}/enrolled-programs/get-career-pathway-specialization`,
    getAllUsersNameForNote: () => `${APIconst.IDENTITY}/identityuser/process-selected-user`,
    deleteProfileImage: (id) => `${APIconst.USER}/avatar/remove-profile-image/${id}`,
    updateProfileImage: (id) => `${APIconst.USER}/avatar/save-profile-image/${id}`
};

export const messageCenterAPIEndPoints = {
    getConversationData: (id) => `${APIconst.MESSAGES}/messagethread/message-threads-details-by-user/${id}`,
    getAllRelationShipData: (id) => `${APIconst.MESSAGES}/userrelationship/all-relationship-details-for-user/${id}`,
    getChatHistory: (uuId, threadId) => `${APIconst.MESSAGES}/messages/all-message-details-for-thread/${threadId}/${uuId}`,
    getUsersForThread: (uuId, threadId) => `${APIconst.MESSAGES}/messagethread/messagethread-users-for-thread/${threadId}/${uuId}`,
    createThreadRequest: () => `${APIconst.MESSAGES}/messagethread/create-new-thread`,
    sendMessageCenterTrayInformation: () => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/employer/MessageCenter`,
    sendMessageRequest: () => `${APIconst.MESSAGES}/messages/send-thread-message`,
    updateMessageAsDelivered: () => `${APIconst.MESSAGES}/messages/update-messages-as-delivered`,
    updateMessageAsRead: (reqData) => `${APIconst.MESSAGES}/messages/update-messages-as-read/${reqData.messageThreadId}`,
    updateThreadMessageName: (messageThreadId) => `${APIconst.MESSAGES}/messagethread/update-message-thread/${messageThreadId}`,
    addUserToThread: (threadID) => `${APIconst.MESSAGES}/messagethread/add-new-user-to-thread/${threadID}`,
    userSearch: (threadId, userId) => `${APIconst.MESSAGES}/messagethread/messagethread-new-users-for-thread/${threadId}/${userId}`,
    sendMessageCenterTrayInformationCount: (endPoint, userId) => `${endPoint}${userId}`,
    deleteThread: () => `${APIconst.MESSAGES}/messagethread/delete-message-threads`,
    addNewUsertoThread: (threadId) => `${APIconst.MESSAGES}/messagethread/add-new-user-to-thread/${threadId}`,
    updateUserThread: (id) => `${APIconst.MESSAGES}/messagethread/update-user-thread/${id}`,
    getAllThreadid: (id) => `${APIconst.MESSAGES}/messagethread/message-thread-ids-by-user/${id}`,
    getBlockedUsersInThread: (userId, threadId) => `${APIconst.MESSAGES}/userrelationship/get-blocked-user-details-for-sender/${threadId}/${userId}`,
    getFlaggedLearnersInThread: (orgId) => `${APIconst.USER}/users/get-flagged-learners/${orgId}`,
    sendNotificationRequest: () => `${APIconst.NOTIFICATIONS}/notifications/notification-request`
};

export const AlertsAPIEndPoints = {
    createAlerts: () => `${APIconst.ALERTS}/dashboardalerts/save-alert`,
    getAlertsByUserId: (applicationUserId, type) => `${APIconst.ALERTS}/dashboardalerts/get-alerts-by-user/${applicationUserId}/${type}`,
    getAllalerts: () => `${APIconst.ALERTS}/dashboardalerts/get-all-alerts`
};

export const ImpactAndOutComesAPIEndPoints = {
    getTrayInformation: () => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/employer/ImpactAndOutcome`,
    getImpactAndOutcomeTrayCount: (endPoint, userId) => `${endPoint}${userId}`,
    ServiceGetTrayInformation: () => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/Social Service/ImpactAndOutcome`,
    ServiceGetImpactAndOutcomeTrayCount: (endPoint, userId) => `${endPoint}${userId}`
};

export const SponsoredProgramsAPIEndPoints = {
    createProgram: () => `sponsored-programs`,
    editProgram: (id) => `sponsored-programs/${id}`,
    getProgramsByUserId: (userId) => `sponsored-programs/get-by-userId/${userId}`,
    getProgramDetailsById: (id) => `sponsored-programs/get-by-id/${id}`,
    deleteProgram: (id) => `sponsored-programs/${id}`
};

export const AdminLearnersAPIEndPoints = {
    getAllLearners: (orgId) => `${APIconst.IDENTITY}/identityuser/get-user/${orgId}`,
    getOrganizationLearners: (orgId, searchString, pageNo) => `${APIconst.IDENTITY}/identityuser/get-all-users-by-organization/${orgId}`,
    processUserList: () => `${APIconst.USER}/users/process-user-list`,
    getLearnerStatus: (id) => `${APIconst.IDENTITY}/identityuser/get-application-user/${id}`,
    searchContacts: (learnerId, searchString) => `${APIconst.MESSAGES}/userrelationship/all-relationships-for-user-search/${learnerId}/${searchString}`,
    addNewContact: (id, loggedInUserId) => `${APIconst.MESSAGES}/applicationuser/create-new-contact/${id}/${loggedInUserId}`,
    getActivity: (id) => `${APIconst.ACTIVITY}/activity/get/${id}`,
    getDashboardAlert: (id, type) => `${APIconst.ALERTS}/dashboardalerts/get-alerts-by-user/${id}/${type}`,
    dismissDashboardAlert: () => `${APIconst.ALERTS}/dashboardalerts/dismiss-alert`,
    addSocialService: () => `${APIconst.SOCIALSERVICE}/socialservice/create-new-service`,
    getSocialService: (applicationUserId, pageNumber, pageSize) => `${APIconst.SOCIALSERVICE}/socialservice/get-social-service/${applicationUserId}/${pageNumber}/${pageSize}`,
    updateSocialService: () => `${APIconst.SOCIALSERVICE}/socialservice/update`,
    getAllStatusSocialService: () => `${APIconst.SOCIALSERVICE}/socialservice/get-all-status`,
    deleteSocialService: (id) => `${APIconst.SOCIALSERVICE}/socialservice/delete/${id}`,
    changeUserEmail: () => `${APIconst.IDENTITY}/identityuser/update-email`,
    changeUserName: () => `${APIconst.IDENTITY}/identityuser/update-profile`,
    sentResetPasswordMail: () => `${APIconst.IDENTITY}/authentication/admin-password-reset`,
    getAllEnrolledPrograms: (userId) => `${APIconst.PROGRAMS}/enrolled-programs/get-by-userId/${userId}`,
    getEnrolledProgram: (id) => `${APIconst.PROGRAMS}/enrolled-programs/get-by-id/${id}`,
    addNewProgram: () => `${APIconst.PROGRAMS}/enrolled-programs/create-enrolled-program`,
    editProgram: (id) => `${APIconst.PROGRAMS}/enrolled-programs/update/${id}`,
    deleteProgram: (id) => `${APIconst.PROGRAMS}/enrolled-programs/delete/${id}`,
    getAllCaseWorkers: () => `${APIconst.IDENTITY}/identityuser/get-all-active-user`,
    getEducationAndSponsoredCount: (learnerId) => `${APIconst.PROGRAMS}/informationtray/get-education-enrolled-sponsored-count/${learnerId}`,
    getSocialServiceCount: (learnerId) => `${APIconst.SOCIALSERVICE}/informationtray/get-social-service-count/${learnerId}`,
    messageThreadDetails: (primaryUserId, secondaryUserId) => `${APIconst.MESSAGES}/messagethread/message-thread-by-users/${primaryUserId}/${secondaryUserId}`,
    learnerSchoolList: () => `${APIconst.PROGRAMS}/enrolled-programs/learners-school-list`,
    getAllOrgList: (id) => `${APIconst.IDENTITY}/organization/get-all/${id}`,
    getEducationEnrollment: (learnerid) => `${APIconst.PROGRAMS}/enrolled-programs/get-by-userId/${learnerid}`,
    getAllUsersForcontactCheck: () => `${APIconst.USER}/users/get-all`,
    upDateLearner: (id) => `${APIconst.USER}/users/update-learner/${id}`,
    removeContact: () => `${APIconst.MESSAGES}/applicationuser/delete-contact`,
    getPlatformModules: () => `${APIconst.TRAYCONFIG}/platformadminmodule/get-platform-modules`
};

export const AdminSecurityAPIEndPoints = {
    getLoginOptions: (id) => `${APIconst.IDENTITY}/organization/get-organization/${id}`,
    getAccountLockoutOptions: () => `${APIconst.IDENTITY}/organization/get-account-lockout-options`,
    saveAccountLockoutOptions: () => `${APIconst.IDENTITY}/organization/save-account-lockout-options`,
    getSelectedAccountLockout: (organizationId) => `${APIconst.IDENTITY}/organization/get-selected-account-lockout-options/${organizationId}`,
    getGeoBlockingOptions: () => `${APIconst.IDENTITY}/organization/get-geo-blocking-options`,
    updateGeoBlockingOptions: (id) => `${APIconst.IDENTITY}/organization/update-geoblocking-details/${id}`,
    updateLoginOptions: (id) => `${APIconst.IDENTITY}/organization/update-organization-external-login/${id}`
};

export const AdminGroupsAPIEndPoints = {
    createGroup: () => `${APIconst.IDENTITY}/group/create-group`,
    editGroup: () => `${APIconst.IDENTITY}/group/edit-group-name`,
    deleteGroup: (groupId) => `${APIconst.IDENTITY}/group/delete-group/${groupId}`,
    getGroups: (organizationId) => `${APIconst.IDENTITY}/group/get-groups/${organizationId}`,
    addGroupToUser: () => `${APIconst.IDENTITY}/group/add-group-to-user`,
    removeGroupFromUser: () => `${APIconst.IDENTITY}/group/remove-group-from-user`,
    getUserGroupsByUserId: (userId) => `${APIconst.IDENTITY}/group/get-group-user-mapping/${userId}`,
    getRoleCategory: () => `${APIconst.IDENTITY}/group/get-rolecategory`,
    getActiveRolesOfUser: (userId) => `${APIconst.IDENTITY}/group/get-active-roles-by-user/${userId}`,
    getGroupRolesByGroupId: (groupId) => `${APIconst.IDENTITY}/group/get-grouproles-by-groupid/${groupId}`,
    processGroupRoleMapping: () => `${APIconst.IDENTITY}/group/process-grouprole-mapping`,
    processGroupRoleMappingByGroupName: () => `${APIconst.IDENTITY}/group/process-grouprole-mapping-by-groupname`,
    getGroupRoles: (groupName) => `${APIconst.IDENTITY}/group/get-grouproles-by-groupname/${groupName}`,
};

export const AdminAssessmentAPIEndPoints = {
    getAssessmentList: () => `${APIconst.ASSESSMENTS}/assessments/get-assessment-list`,
    publishAssesmentStatus: () => `${APIconst.ASSESSMENTS}/assessments/publish-assessment-status`,
    createAssessment: () => `${APIconst.ASSESSMENTS}/assessments/create-assessment`,
    updateAssessment: () => `${APIconst.ASSESSMENTS}/assessments/update-assessment`,
    getReminderOptions: () => `${APIconst.ASSESSMENTS}/assessments/get-reminder-options`,
    getComputationList: () => `${APIconst.ASSESSMENTS}/assessments/get-resultcomputation-list`,
    redirectOptionsList: () => `${APIconst.ASSESSMENTS}/assessments/get-redirectpage-options`,
    assessmentNameCheck: (assessmentName) => `${APIconst.ASSESSMENTS}/assessments/assessment-exists-checking/${assessmentName}`,
    getAnswerTypes: () => `${APIconst.ASSESSMENTS}/assessments/get-answer-types`,
    getExistingCategoryList: () => `${APIconst.ASSESSMENTS}/assessmentquestion/get-category-list`,
    deleteAnswer: (answerId, applicationUserId) => `${APIconst.ASSESSMENTS}/assessments/delete-answer/${answerId}/${applicationUserId}`,
    deleteQuestionAnswer: (questionId, applicationUserId) => `${APIconst.ASSESSMENTS}/assessmentquestion/delete-question-and-answer/${questionId}/${applicationUserId}`,
    getAssessmentType:()=>`${APIconst.ASSESSMENTS}/assessmenttype/get-all-assessmenttype`,
    publishSingleAssessment:()=>`${APIconst.ASSESSMENTS}/assessments/publish-assessment-status-by-id`
};

export const programsAPIEndPoints = {
    programsTrayInformation: (data) => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/${data.userType}/${data.page}`
};

export const resourceAPIEndPoints = {
    resourceTrayInformation: (data) => `${APIconst.TRAYCONFIG}/informationtrayconfig/get/${data.userType}/${data.page}`
};

export const externalConnectionAPIEndPoints = {
    updateFederatedLoginTypes: (id) => `${APIconst.IDENTITY}/organization/update-federated-identity-logins-status/${id}`,
    emailConnectorTest: () => `${APIconst.IDENTITY}/externalauthentication/email-connector-test`,
    saveEmailConnectorDetails: () => `${APIconst.IDENTITY}/externalauthentication/save-email-connector-details`,
    getExternalLoginTypesPortal: () => `${APIconst.IDENTITY}/organization/get-external-login-types-portal-security`,
    getExternalLoginTypeByUser: (organizationId, applicationUserId) => `${APIconst.IDENTITY}/identityuser/get-external-login-type-by-user/${organizationId}/${applicationUserId}`,
    getApiConnectorDetails: () => `${APIconst.IDENTITY}/externalauthentication/get-email-connector-details`
};

export const newsItemsAPIEndPoints = {
    getAllNews: () => `${APIconst.NEWS}/news/get-news-details`,
    saveNewsEditor: () => `${APIconst.NEWS}/news/add`,
    updateNewsEditor: (id) => `${APIconst.NEWS}/news/update/${id}`,
    newsTitle: (newsTitle) => `${APIconst.NEWS}/news/check-news-exists/${newsTitle}`,
    uploadNewsImage: (id) => `${APIconst.NEWS}/blob/upload-news-image?newsId=${id}`,
    copyNews: () => `${APIconst.NEWS}/news/copy-news`,
    getNewsById: (id) => `${APIconst.NEWS}/news/get/${id}`,
    deleteNews: () => `${APIconst.NEWS}/news/delete-news`,
    purgeNews: (id) => `${APIconst.NEWS}/news/delete/${id}`,
    publishNews: () => `${APIconst.NEWS}/news/publish-draft-news`,
    addNewsToGroups: () => `${APIconst.NEWS}/news/save-news-group-mapping`,
    removeNewsFromGroups: () => `${APIconst.NEWS}/news/remove-news-group-mapping`,
    getGroups: (organizationId) => `${APIconst.IDENTITY}/group/get-all-usergroups/${organizationId}`,
    getEventTypes : () => `${APIconst.NEWS}/eventtype/get-all-eventtypes`
}

export const locationAPIEndPoints={
    getExternalServices:()=>`${APIconst.SOCIALSERVICE}/socialservice/get-partner-service`,
    getLocationByPartnerId:(partnerId)=>`${APIconst.SOCIALSERVICE}/socialservice/get-location/${partnerId}`,
    getResourceTypeByPartnerId:(partnerId)=>`${APIconst.SOCIALSERVICE}/socialservice/get-resource-type/${partnerId}`
}

export const servicePartnerAPIEndPoints={
    getSocialServiceByOrganization:(organizationId)=>`${APIconst.SOCIALSERVICE}/socialservice/get-social-service-by-organization/${organizationId}`
}
// ==========================================================================================

// export const userManagementAPIEndpoints = {
//     userLogin: () => `login`,
//     userRegister: () => 'register',
//     verifyCode: () => 'verify-organization-InviteCode',
//     verifyUser: () => 'verifyinvite-useremail',
//     forgetPassword: (userEmail) => `forget-password/${userEmail}`,
//     changePassword: () => `change-password`,
//     confirmEmail: () => 'confirmEmail',
//     externalUserRegister: () => 'externalregister',
//     externalUserlogin: () => `externallogin`,
//     linkedInAPI: (token) => `linkedin-user-details?token=${token}`,
//     userLogout: (userid) => `logout/${userid}`,
//     confirmNewEmail: () => `confirmNewEmail`,
//     resetPasswordByLearner: () => `/reset-password-by-learner`
// };


// export const organizationAPIEndpoints = {
//     getAllOrgList: (id) => `get-all-organization/${id}`,
//     getOrganizationDetails: (id) => `get-organization/${id}`,
//     addOrg: () => 'register-organization',
//     editOrg: (id) => `update-organization/${id}`,
//     deleteOrg: () => `inactive-organization`,
//     organizationblock: () => `organizationblock`,
//     getAllUsers: (id) => `/getusers/${id}`,
//     updateUserDetails: () => 'update-userdetailsRole',
//     sentInvitation: () => 'invite-user-email',
//     generateCode: (orgId) => `refresh-organization-InviteCode/${orgId}`,
//     getOrgTypes: () => 'organization-types',
//     getRoles: () => 'roles',
//     deleteOrgUser: () => 'identity/delete-user',
//     getExaternalLoginTypes: () => `get-external-login-types`,
//     suspendUser: () => `identity/suspend-user`,
//     unSuspendUser: () => `identity/unsuspend-user`,
//     orgOverViewUpdate: () => `update-organization-partial`,
//     getOrganizationUsers: (orgId, searchString, pageNo) => `get-all-users-by-organization/${orgId}`,
//     uploadProfileImage: (id) => `update-organization-image?organizationId=${id}`,
//     deleteProfileImage: (id) => `remove-organization-image/${id}`,
//     getClassificationInfoDetails: () => `/get-all-industrytypes`,
//     getExternalLoginTypeMapping: (userId, orgId) => `/userexternal-loginmapping-get/${userId}/${orgId}`,
//     setExternalLoginTypeMapping: () => `/userexternal-loginmapping-update`,
//     getOrganizationInfo: () => `get-learning-model`,
//     updateLearningModel: (organizationId, learningModelId) => `update-organization-learning-model/${organizationId}/${learningModelId}`,
//     getUserNameByEmail: (email) => `identity/get-user-by-email/${email}`,
//     organizationListTrayInformation: () => `information-tray/Platform Admin/Organization`,
//     getIndustryTypes: () => `/get-all-industrytypes`,
//     deleteIndustry: (industryId, userId) => `/delete-industrytype/${industryId}/${userId}`,
//     createIndustry: () => `/create-new-industrytype`,
//     editIndustry: () => `/update-industrytype`,
//     checkIndustryForDuplicate: (oNet, industry) => `industrytype-exists-checking/${oNet}/${industry}`,
//     getAllExternalConnections: () => `getall-external-connection`,
//     editExternalConnection: () => `edit-external-connection`,
//     updateServiceTypeModel: () => `organization/update-organization-service-type`,
//     getOrganizationServiceTypes: () => `organization/get-service-type-model`
// };

// export const dashboardAPIEndPoints = {
//     getInformtionTrayDetails: () => `information-tray/employer/dashboard`,
//     getInformtionTrayCount: (endPoint, userId) => `${endPoint}${userId}`,
//     getDashBoardSponsoredPrograms: (id) => `sponsored-programs/${id}`,
//     getCandidateTrayFilter: (id) => `CandidatesTrayFilter/${id}`,
//     // getCandidateCardDetails: () => `CandidateCard`,
//     getCandidateCardDetails: () => `process-candidate-cards-users`,
//     serviceDashboardTrayInformation: (data) => `information-tray/${data.userType}/${data.page}`,
//     knowledgeDashboardTrayInformation: () => `information-tray/Knowledge/Dashboard`,
//     serviceDashboardUsers: (organizationId) => `get-all-users-by-organization/${organizationId}`,
//     getDashboardAlert: (id, type) => `get-alerts-by-user/${id}/${type}`,
//     dismissDashboardAlert: () => `dismiss-alert`,
//     getDashBoardMessages: (id) => `dashboard-messages/${id}`,
//     getUnReadMessages: (id) => `message-threads-details-by-user/${id}`,
//     getUnReadMsgCount: (id) => `unread-msg-count/${id}`,
//     updateMessageAsDelivered: () => `update-messages-as-delivered`,

// };

// export const learnersAPIEndPoints = {
//     getLearnerInstitutionId: (id) => `get-organization/${id}`,
//     getLearnersGeneralInformation: (id) => `get-userprofile-by-user/${id}`,
//     getLearnerNameDetails: (id) => `get-application-user/${id}`,
//     getLearnersOverviewDetails: (id) => `get-learner-by-id/${id}`,
//     getLearnersActivityDetails: (id) => `get-activity-by-learner/${id}`,
//     getLearnersAssesmentDetails: (userId, assessmentId) => `get-assessment-questions-attended/${userId}/${assessmentId}`,
//     getLearnersAssesmentTopics: (id) => `get-all-assessment/${id}`,
//     getLearnerEnrolledServices: (id) => `get-social-serviceby-userid/${id}`,
//     getLearnerNotesDetails: (learnersId, organizationId, noteCount, pageNumber, isOrgAdmin) => `get-notes/${learnersId}/${organizationId}/${noteCount}/${pageNumber}/${isOrgAdmin}`,
//     addLearnerNotes: () => `add-notes`,
//     editLearnerNotes: () => `edit-notes`,
//     deleteLearnerNotes: () => `delete-notes`,
//     getAllUsersForNote: () => `get-allusers`,
//     suspendUser: () => `identity/suspend-user`,
//     unSuspendUser: () => `identity/unsuspend-user`,
//     deleteUser: () => 'identity/delete-user',
//     resetPasswordUser: () => `/admin-password-reset`,
//     suspendMultipleUser: () => `/identity/suspend-multiple-user`,
//     deleteMultipleUser: () => '/identity/delete-multiple-user',
//     unSuspendMultipleUser: () => '/identity/unsuspend-multiple-user',
//     messageThreadDetails: (primaryUserId, secondaryUserId) => `message-thread-by-users/${primaryUserId}/${secondaryUserId}`,
//     learnersTrayInformation: (data) => `information-tray/${data.userType}/${data.page}`,
//     getAllUsersForCandidateName: () => `get-allusers`,
//     getCandidateEnrolledDetails: () => `get-all-enrolled-candidate-programs`,
//     learnerSkills: (id) => `get-skills-by-user/${id}`,
//     learnerListTrayInformation: () => `information-tray/Platform Admin/Learner`,
//     careerPathwaySpecialization: () => `get-career-pathway-specialization`,
//     getFlaggedLearnersCount: (id) => `get-flagged-learners-count/${id}`,
//     getAllUsersNameForNote: () => `/process-selected-user`,
//     deleteProfileImage: (id) => `/avatar/remove-profile-image/${id}`,
//     updateProfileImage: (id) => `/avatar/save-profile-image/${id}`
// };

// export const messageCenterAPIEndPoints = {
//     getConversationData: (id) => `message-threads-details-by-user/${id}`,
//     getAllRelationShipData: (id) => `all-relationship-details-for-user/${id}`,
//     getChatHistory: (uuId, threadId) => `all-message-details-for-thread/${threadId}/${uuId}`,
//     getUsersForThread: (uuId, threadId) => `messagethread-users-for-thread/${threadId}/${uuId}`,
//     createThreadRequest: () => `create-new-thread`,
//     sendMessageCenterTrayInformation: () => `information-tray/employer/MessageCenter`,
//     sendMessageRequest: () => `send-thread-message`,
//     updateMessageAsDelivered: () => `update-messages-as-delivered`,
//     updateMessageAsRead: (reqData) => `update-messages-as-read/${reqData.messageThreadId}`,
//     updateThreadMessageName: (messageThreadId) => `update-message-thread/${messageThreadId}`,
//     addUserToThread: (threadID) => `add-new-user-to-thread/${threadID}`,
//     userSearch: (threadId, userId) => `messagethread-new-users-for-thread/${threadId}/${userId}`,
//     sendMessageCenterTrayInformationCount: (endPoint, userId) => `${endPoint}${userId}`,
//     deleteThread: () => `delete-message-threads`,
//     addNewUsertoThread: (threadId) => `add-new-user-to-thread/${threadId}`,
//     updateUserThread: (id) => `update-user-thread/${id}`,
//     getAllThreadid: (id) => `message-thread-ids-by-user/${id}`,
//     getBlockedUsersInThread: (userId, threadId) => `get-blocked-user-details-for-sender/${threadId}/${userId}`,
//     getFlaggedLearnersInThread: (orgId) => `/users/get-flagged-learners/${orgId}`,
//     sendNotificationRequest: () => `/notifications/notification-request`
// };

// export const AlertsAPIEndPoints = {
//     createAlerts: () => `save-alert`,
//     getAlertsByUserId: (applicationUserId, type) => `get-alerts-by-user/${applicationUserId}/${type}`,
//     getAllalerts: () => `get-all-alerts`
// };

// export const ImpactAndOutComesAPIEndPoints = {
//     getTrayInformation: () => `information-tray/employer/ImpactAndOutcome`,
//     getImpactAndOutcomeTrayCount: (endPoint, userId) => `${endPoint}${userId}`,
//     ServiceGetTrayInformation: () => `information-tray/Social Service/ImpactAndOutcome`,
//     ServiceGetImpactAndOutcomeTrayCount: (endPoint, userId) => `${endPoint}${userId}`
// };

// export const SponsoredProgramsAPIEndPoints = {
//     createProgram: () => `sponsored-programs`,
//     editProgram: (id) => `sponsored-programs/${id}`,
//     getProgramsByUserId: (userId) => `sponsored-programs/get-by-userId/${userId}`,
//     getProgramDetailsById: (id) => `sponsored-programs/get-by-id/${id}`,
//     deleteProgram: (id) => `sponsored-programs/${id}`
// };

// export const AdminLearnersAPIEndPoints = {
//     getAllLearners: (orgId) => `getusers/${orgId}`,
//     getOrganizationLearners: (orgId, searchString, pageNo) => `get-all-users-by-organization/${orgId}`,
//     processUserList: () => `process-user-list`,
//     getLearnerStatus: (id) => `get-application-user/${id}`,
//     searchContacts: (learnerId, searchString) => `all-relationships-for-user-search/${learnerId}/${searchString}`,
//     addNewContact: (id, loggedInUserId) => `create-new-contact/${id}/${loggedInUserId}`,
//     getActivity: (id) => `get-activity/${id}`,
//     getDashboardAlert: (id, type) => `get-alerts-by-user/${id}/${type}`,
//     dismissDashboardAlert: () => `dismiss-alert`,
//     addSocialService: () => `add-social-service`,
//     getSocialService: (applicationUserId, pageNumber, pageSize) => `/get-social-service/${applicationUserId}/${pageNumber}/${pageSize}`,
//     updateSocialService: () => `update-social-service`,
//     getAllStatusSocialService: () => 'get-all-status',
//     deleteSocialService: (id) => `delete-social-service/${id}`,
//     changeUserEmail: () => `updateemail`,
//     changeUserName: () => `identityuser/update-profile`,
//     sentResetPasswordMail: () => `admin-password-reset`,
//     getAllEnrolledPrograms: (userId) => `enrolled-programs/get-by-userId/${userId}`,
//     getEnrolledProgram: (id) => `enrolled-programs/get-by-id/${id}`,
//     addNewProgram: () => 'enrolled-programs',
//     editProgram: (id) => `enrolled-programs/${id}`,
//     deleteProgram: (id) => `enrolled-programs/${id}`,
//     getAllCaseWorkers: () => `get-allusers`,
//     getEducationAndSponsoredCount: (learnerId) => `get-education-enrolled-sponsored-count/${learnerId}`,
//     getSocialServiceCount: (learnerId) => `get-social-service-count/${learnerId}`,
//     messageThreadDetails: (primaryUserId, secondaryUserId) => `message-thread-by-users/${primaryUserId}/${secondaryUserId}`,
//     learnerSchoolList: () => `/learners-school-list`,
//     getAllOrgList: (id) => `get-all-organization/${id}`,
//     getEducationEnrollment: (learnerid) => `enrolled-programs/get-by-userId/${learnerid}`,
//     getAllUsersForcontactCheck: () => `get-alluser`,
//     upDateLearner: (id) => `/update-learner/${id}`,
//     removeContact: () => `/delete-contact`,
//     getPlatformModules: () => `/platform-admin/get-platform-modules`
// };

// export const AdminSecurityAPIEndPoints = {
//     getLoginOptions: (id) => `get-organization/${id}`,
//     getAccountLockoutOptions: () => `get-account-lockout-options`,
//     saveAccountLockoutOptions: () => `save-account-lockout-options`,
//     getSelectedAccountLockout: (organizationId) => `get-selected-account-lockout-options/${organizationId}`,
//     getGeoBlockingOptions: () => `get-geo-blocking-options`,
//     updateGeoBlockingOptions: (id) => `update-geoblocking-details/${id}`,
//     updateLoginOptions: (id) => `update-organization-external-login/${id}`
// };

// export const AdminGroupsAPIEndPoints = {
//     createGroup: () => `create-group`,
//     editGroup: () => `edit-group-name`,
//     deleteGroup: (groupId) => `delete-group/${groupId}`,
//     getGroups: (organizationId) => `get-groups/${organizationId}`,
//     addGroupToUser: () => `add-group-to-user`,
//     removeGroupFromUser: () => `remove-group-from-user`,
//     getUserGroupsByUserId: (userId) => `get-group-user-mapping/${userId}`,
//     getRoleCategory: () => `get-rolecategory`,
//     getActiveRolesOfUser: (userId) => `get-active-roles-by-user/${userId}`,
//     getGroupRolesByGroupId: (groupId) => `get-grouproles-by-groupid/${groupId}`,
//     processGroupRoleMapping: () => `process-grouprole-mapping`,
//     processGroupRoleMappingByGroupName: () => `/process-grouprole-mapping-by-groupname`,
//     getGroupRoles: (groupName) => `get-grouproles-by-groupname/${groupName}`,
// };

// export const AdminAssessmentAPIEndPoints = {
//     getAssessmentList: () => `get-assessment-list`,
//     publishAssesmentStatus: () => `publish-assessment-status`,
//     createAssessment: () => 'create-assessment',
//     updateAssessment: () => 'update-assessment',
//     getReminderOptions: () => 'get-reminder-options',
//     getComputationList: () => 'get-resultcomputation-list',
//     redirectOptionsList: () => 'get-redirectpage-options',
//     assessmentNameCheck: (assessmentName) => `assessment-exists-checking/${assessmentName}`,
//     getAnswerTypes: () => '/get-answer-types',
//     getExistingCategoryList: () => '/get-category-list',
//     deleteAnswer: (answerId, applicationUserId) => `/delete-answer/${answerId}/${applicationUserId}`,
//     deleteQuestionAnswer: (questionId, applicationUserId) => `/delete-question-and-answer/${questionId}/${applicationUserId}`,
//     getAssessmentType:()=>`get-all-assessmenttype`,
//     publishSingleAssessment:()=>`publish-assessment-status-by-id`
// };

// export const programsAPIEndPoints = {
//     programsTrayInformation: (data) => `information-tray/${data.userType}/${data.page}`
// };

// export const resourceAPIEndPoints = {
//     resourceTrayInformation: (data) => `information-tray/${data.userType}/${data.page}`
// };

// export const externalConnectionAPIEndPoints = {
//     updateFederatedLoginTypes: (id) => `update-federated-identity-logins-status/${id}`,
//     emailConnectorTest: () => `email-connector-test`,
//     saveEmailConnectorDetails: () => `save-email-connector-details`,
//     getExternalLoginTypesPortal: () => `get-external-login-types-portal-security`,
//     getExternalLoginTypeByUser: (organizationId, applicationUserId) => `get-external-login-type-by-user/${organizationId}/${applicationUserId}`,
//     getApiConnectorDetails: () => `get-email-connector-details`
// };

// export const newsItemsAPIEndPoints = {
//     getAllNews: () => 'get-all-news',
//     saveNewsEditor: () => '/save-news',
//     updateNewsEditor: (id) => `news-update/${id}`,
//     newsTitle: (newsTitle) => `/check-news-exists/${newsTitle}`,
//     uploadNewsImage: (id) => `upload-news-image?newsId=${id}`,
//     copyNews: () => `copy-news`,
//     getNewsById: (id) => `get-news/${id}`,
//     deleteNews: () => `/delete-news`,
//     publishNews: () => `/publish-draft-news`,
//     addNewsToGroups: () => `/save-news-group-mapping`,
//     removeNewsFromGroups: () => `/remove-news-group-mapping`,
//     getGroups: (organizationId) => `/get-all-usergroups/${organizationId}`,
//     getEventTypes: () => 'get-all-eventtypes'
// }

// export const locationAPIEndPoints = {
//     getExternalServices: () => `/get-partner-service`,
//     getPartnerServices: () => `get-partner-service`,
//     getLocationByPartnerId: (partnerId) => `get-location/${partnerId}`,
//     getResourceTypeByPartnerId: (partnerId) => `get-resource-type/${partnerId}`
// }

// export const servicePartnerAPIEndPoints = {
//     getSocialServiceByOrganization: (organizationId) => `/get-social-service-by-organization/${organizationId}`
// }