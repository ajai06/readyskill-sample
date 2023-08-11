import React from "react";

export const Roles = {
  ORGANISATIONADMIN: "Organization Admin",
  USER: "User",
  GLOBALADMIN: "Global Admin",
  //Tray
  TRAY_READONLY: "63801840-c8e8-4fa0-b215-b0ddb4713751",

  //Candidate
  CANDIDATECARD_READONLY: "fdea37bb-db78-48b8-b10c-9338ce85d6e7",

  //Activity
  ACTIVITY_READONLY: "8bcf525f-072b-456e-8e80-6f44c68bc107",

  //Alerts
  ALERTS_READONLY: "707f135b-fb0b-4e53-9b2e-e6ccd21d24a2",

  //Program
  PROGRAM_READONLY: "96591681-1ad5-4cc5-8723-52538fe24765",

  //Social Service
  SOCIAL_SERVICE_READONLY: "9a12c5ba-3938-406c-b329-54896e30a092",
  SOCIAL_SERVICE_CREATE: "3eb360da-6762-483d-8844-c4553d09c0fd",
  SOCIAL_SERVICE_EDIT: "7a26f19d-4201-4806-b83a-40cbbc54e678",
  SOCIAL_SERVICE_DELETE: "05100ad9-7815-48ae-b571-ad95439d826b",

  //Organization
  IDENTITY_ORGANIZATION_READONLY: "34a92cd2-09bf-4cde-b631-6ba64d0b19e3",
  IDENTITY_ORGANIZATION_CREATE: "20b90df0-ed3b-45ee-8a59-a9405ad7fd29",
  IDENTITY_ORGANIZATION_EDIT: "5d0b7971-20e4-48c7-878d-7d2add359417",
  IDENTITY_ORGANIZATION_DELETE: "1b50f9c5-2d6f-4f1a-b8f6-c0b0576bc44f",
  IDENTITY_ORGANIZATION_INVITE_GENERATE: "b4095a84-6ea5-40d3-8ee3-4622e7a5e216",

  //Group
  IDENTITY_GROUP_READONLY: "d2e19cee-66e0-4f9f-92d2-843f3b6711d1",
  IDENTITY_GROUP_CREATE: "00cd38a6-bc63-418c-8e91-bb48ce698dd8",
  IDENTITY_GROUP_EDIT: "3a69352e-09f9-4419-8158-28e7241aa6be",
  IDENTITY_GROUP_DELETE: "7a427772-873c-4042-9816-9496f83bf405",

  //User
  IDENTITY_USER_READONLY: "c1eb8fae-dbd1-4c06-a03a-46e491ae8554",
  IDENTITY_USER_BLOCK: "759522dc-7714-4830-9747-4abd6c1b24ce",
  IDENTITY_USER_RESET_PASSWORD: "468df00f-457f-4a62-a9ef-9d086c693ee9",
  IDENTITY_USER_DELETE: "823f46a1-dff5-4f9f-b983-8672f0bdaf00",

  //Notes
  USER_NOTES_READONLY: "3a6e2e75-432d-4a08-b7a6-22b030c05c1f",
  USER_NOTES_CREATE: "1dcb8009-1e2d-45a8-aac4-6b35e740f128",
  USER_NOTES_EDIT: "6ba888a3-045f-4055-9bfc-aa753d4cb9d4",
  USER_NOTES_DELETE: "580cedb9-ff14-4415-b495-0814db8c7f47",

  //Skill
  USER_SKILL_READONLY: "d3e0ee0c-28db-48dd-8459-8c57f39592a0",

  //Message Center
  MESSAGE_THREAD_CREATE: "1c651f66-d559-459e-bc70-d175afeb6448",
  MESSAGE_THREAD_DELETE: "128e6089-4116-4ea2-9e88-16516a8b648f",
  MESSAGE_THREAD_UPDATE: "be71cbd5-66c1-4510-b252-0c76bfe4d97b",
  MESSAGE_THREAD_READONLY: "86100f62-1f97-4eb8-80cb-043d12787601",
  MESSAGE_SEND_MESSAGE: "3b455293-745c-4c17-945c-462cbb7b379f",
  MESSAGE_THREAD_BLOCK: "26bebc2e-7801-4d42-8cde-2c7110030fec",
  MESSAGE_THREAD_LEAVE: "a4abcd1e-f28e-4d3e-a97c-ea7e5465b4c6",
  MESSAGE_THREAD_ADD_USER: "1a40cd69-6954-4ca3-9947-5d14a142ace6",

  //Assessment
  ASSESSMENT_READONLY: "c0c8a46d-8318-4896-9d56-d32e1a035abf",
  ASSESSMENT_CREATE: "45679c5e-5093-41a1-a5e6-f1851d758f15",
  ASSESSMENT_UPDATE: "9b73a084-ee82-4c2b-8340-16a87650ae88",
  ASSESSMENT_DELETE: "f7c443a0-7eeb-4cec-a887-b58e34033ff9"
};

export const OrganizationTypes = {
  KNOWLEDGEPARTNER: "Knowledge Partner",
  EMPLOYERPARTNER: "Employer Partner",
  SERVICEPARTNER: "Social Service Partner",
  READYSKILL: "ReadySkill",
  MOBILE: "Mobile",
};

export const PlatFormAdminConstants = {
  ASSESSMENT_TYPE_ID: 1,
};

export const GuidFormat = {
  EMPTYGUID: "00000000-0000-0000-0000-000000000000",
  EMPTYLEARNINGMODELID: "00000000-0000-0000-0000-000000000001"
};

export const Gender = {
  MALE: 5,
  FEMALE: 10,
  PREFERNOTTOSAY: 20,
};

//date formatter for local time
export const dateTimeFormatter = (data) => {
  if (data) {
    return new Date(
      new Date(data).getTime() - new Date(data).getTimezoneOffset() * 60 * 1000
    );
  }
};

//timeout clear function
export const clearAlert = (timeoutIDs) => {
  timeoutIDs.forEach(element => {
    clearTimeout(element);
  });
}

export const APIconst = {
  IDENTITY: "/Identity/api/v1",
  USER: "/User/api/v1",
  MESSAGES: "/Messages/api/v1",
  ASSESSMENTS: "/Assessments/api/v1",
  PROGRAMS: "/Programs/api/v1",
  SOCIALSERVICE: "/SocialService/api/v1",
  ALERTS: "/Alerts/api/v1",
  ACTIVITY: "/Activity/api/v1",
  INFORMATION: "/Information/api/v1",
  TRAYCONFIG: "/Trayconfig/api/v1",
  CANDIDATES: "/Candidates/api/v1",
  NEWS: "/News/api/v1",
  NOTIFICATIONS: "/Notifications/api/v1"
}


export const partnerType = (id) => {
  switch (id) {
    case 1:
      return "Mobile";
    case 2:
      return "Employer Partner";
    case 3:
      return "Social Service Partner";
    case 4:
      return "Knowledge Partner";
    case 5:
      return "Readyskill";

    default:
      break;
  }
};

export const hiringStatuses = [
  { status: "Not available", value: 0 },
  { status: "Pending", value: 1 },
  { status: "Available to hire", value: 2 }
]

export const navPaths = [
  {
    parent: "adminOrganizations",
    children: ["/portal/admin/OrganizationDetails"]
  },
  {
    parent: "platformAdmin",
    children: ["/portal/admin/managePlatform", "/portal/admin/newsItems", "/portal/admin/manageAssessment", "/portal/admin/externalConnections", "/portal/admin/manageGroups"]
  },
  {
    parent: "adminLearners",
    children: ["/portal/admin/learnerDetails"]
  },
  {
    parent: "learners",
    children: ["/portal/learnersDetail"]
  },
  {
    parent: "manageAlerts",
    children: ["/portal/add_alert"]
  }
]

export const NewsEventTypeId = {
  InPersonEvent: "1",
  OnlineEvent: "2",
  NonEvent: "3"
}

export const ResourcesList = [
  {
    id: "e4148666-f4bd-4f05-c6d6-08d9d0ddf713",
    serviceName: "Housing Resources"
  },
  {
    id: "e4148666-f4bd-4f05-c6d6-08d9d0ddf714",
    serviceName: "Food Resources"
  },
  {
    id: "e4148666-f4bd-4f05-c6d6-08d9d0ddf715",
    serviceName: "Family Resources"
  },
  {
    id: "e4148666-f4bd-4f05-c6d6-08d9d0ddf716",
    serviceName: "Financial Resources"
  },

]

export const ReadySkillRepresentative = {
  RepresentativeId: "a78164d8-347d-45e8-8496-2eeffcd1f85b"
}