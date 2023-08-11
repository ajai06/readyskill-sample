import axios from "axios";

import { organizationAPIEndpoints } from "./apiEndPoints";
import { AdminGroupsAPIEndPoints } from "./apiEndPoints";


export const getOrganizationList = (id) => axios.get(organizationAPIEndpoints.getAllOrgList(id));

export const getAllUsers = (id) => axios.get(organizationAPIEndpoints.getAllUsers(id));

export const getOrganization = (id) => axios.get(organizationAPIEndpoints.getOrganizationDetails(id));

export const addOrganization = (data) => axios.post(organizationAPIEndpoints.addOrg(), data);

export const updateOrganization = (id, data) => axios.put(organizationAPIEndpoints.editOrg(id), data);

export const deleteOrganization = (data) => axios.put(organizationAPIEndpoints.deleteOrg(), data);

export const blockOrganization = (data) => axios.put(organizationAPIEndpoints.organizationblock(), data);

export const updateUserData = (data) => axios.put(organizationAPIEndpoints.updateUserDetails(), data);

export const inviteUser = (data) => axios.post(organizationAPIEndpoints.sentInvitation(), data);

export const inviteCodeGenerate = (orgId) => axios.get(organizationAPIEndpoints.generateCode(orgId));

export const getOrganizationTypes = () => axios.get(organizationAPIEndpoints.getOrgTypes());

export const getAllRoles = () => axios.get(organizationAPIEndpoints.getRoles());

export const deleteOrganizationUser = (data) => axios.put(organizationAPIEndpoints.deleteOrgUser(), data);

export const getExternalLoginTypes = () => axios.get(organizationAPIEndpoints.getExaternalLoginTypes());

export const suspendUser = (data) => axios.put(organizationAPIEndpoints.suspendUser(), data);

export const unSuspendUser = (data) => axios.put(organizationAPIEndpoints.unSuspendUser(), data);

export const orgOverViewUpdate = (data) => axios.put(organizationAPIEndpoints.orgOverViewUpdate(), data);

export const getOrganizationUsers = (orgId) => axios.get(organizationAPIEndpoints.getOrganizationUsers(orgId));

export const updateProfileImage = (id, data) => {
    return axios.post(organizationAPIEndpoints.uploadProfileImage(id), data, { headers: { 'Content-Type': 'multipart/form-data' } }
    );
};

export const deleteProfileImage = (id) => axios.delete(organizationAPIEndpoints.deleteProfileImage(id));
export const getClassificationInfoDetails = () => axios.get(organizationAPIEndpoints.getClassificationInfoDetails());
export const getExternalLoginTypeMapping = (userId, orgId) => axios.get(organizationAPIEndpoints.getExternalLoginTypeMapping(userId, orgId));

export const setExternalLoginTypeMapping = (data) => axios.put(organizationAPIEndpoints.setExternalLoginTypeMapping(), data);
export const getOrganizationInfo = () => axios.get(organizationAPIEndpoints.getOrganizationInfo());
export const updateLearningModel = (params) => axios.put(organizationAPIEndpoints.updateLearningModel(), params);
export const getUserNameByEmail = (email) => axios.get(organizationAPIEndpoints.getUserNameByEmail(email));

export const createGroup = (data) => axios.post(AdminGroupsAPIEndPoints.createGroup(), data);
export const editGroup = (data) => axios.put(AdminGroupsAPIEndPoints.editGroup(), data);
export const deleteGroup = (groupId) => axios.put(AdminGroupsAPIEndPoints.deleteGroup(groupId));
export const getGroups = (organizationId) => axios.get(AdminGroupsAPIEndPoints.getGroups(organizationId));

export const addGroupToUser = (data) => axios.post(AdminGroupsAPIEndPoints.addGroupToUser(), data);
export const removeGroupFromUser = (data) => axios.post(AdminGroupsAPIEndPoints.removeGroupFromUser(), data);

export const getActiveRolesOfUser = (userId) => axios.get(AdminGroupsAPIEndPoints.getActiveRolesOfUser(userId));
export const getRoleCategory = () => axios.get(AdminGroupsAPIEndPoints.getRoleCategory());
export const getGroupRolesByGroupId = (groupId) => axios.get(AdminGroupsAPIEndPoints.getGroupRolesByGroupId(groupId));
export const processGroupRoleMapping = (data) => axios.post(AdminGroupsAPIEndPoints.processGroupRoleMapping(), data);
export const getUserGroupsByUserId = (userId) => axios.get(AdminGroupsAPIEndPoints.getUserGroupsByUserId(userId));
export const getGroupRoles = (groupName) => axios.get(AdminGroupsAPIEndPoints.getGroupRoles(groupName));
export const processGroupRoleMappingByGroupName = (data) => axios.post(AdminGroupsAPIEndPoints.processGroupRoleMappingByGroupName(), data);
export const organizationListTrayInformation = () =>
  axios.get(organizationAPIEndpoints.organizationListTrayInformation());
export const updateServiceTypeModel = (params) => axios.put(organizationAPIEndpoints.updateServiceTypeModel(), params);
export const getOrganizationServiceTypes = () => axios.get(organizationAPIEndpoints.getOrganizationServiceTypes());



