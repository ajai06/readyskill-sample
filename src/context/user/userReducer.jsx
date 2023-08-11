import { Roles } from "../../utils/contants";

const userData = JSON.parse(localStorage.getItem("user"));

if (userData) {
    const roles = userData.roleName;
    const userRoles = userData.userRolesIds ? userData.userRolesIds : [];
    var globalAdmin_Check = roles.includes("Global Admin");
    var organizationAdmin_Check = roles.includes("Organization Admin");
    var user_Check = roles.includes("User");
    var organizationType = userData.organization.organizationType;
    var trayCheckReadOnly = globalAdmin_Check ? true : userRoles.includes(Roles.TRAY_READONLY);
    var cardCheckReadOnly = globalAdmin_Check ? true : userRoles.includes(Roles.CANDIDATECARD_READONLY);
    var activityReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.ACTIVITY_READONLY);
    var alertsReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.ALERTS_READONLY);
    var programsReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.PROGRAM_READONLY);
    var socialServiceReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.SOCIAL_SERVICE_READONLY);
    var organizationEdit = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_ORGANIZATION_EDIT);
    var inviteCodeGenerate = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_ORGANIZATION_INVITE_GENERATE);
    var blockSignin = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_USER_BLOCK);
    var resetPassword = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_USER_RESET_PASSWORD);
    var userDelete = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_USER_DELETE);
    var identityUserReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_USER_READONLY);
    var notesReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.USER_NOTES_READONLY);
    var notesCreate = globalAdmin_Check ? true : userRoles.includes(Roles.USER_NOTES_CREATE);
    var notesEdit = globalAdmin_Check ? true : userRoles.includes(Roles.USER_NOTES_EDIT);
    var noteDelete = globalAdmin_Check ? true : userRoles.includes(Roles.USER_NOTES_DELETE);
    var skillReadOnly = globalAdmin_Check ? true : userRoles.includes(Roles.USER_SKILL_READONLY);
    var groupReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_GROUP_READONLY);
    var groupCreate = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_GROUP_CREATE);
    var groupEdit = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_GROUP_EDIT);
    var groupDelete = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_GROUP_DELETE);
    var assessmentReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.ASSESSMENT_READONLY);
    var messageThreadCreate = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_THREAD_CREATE);
    var messageThreadDelete = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_THREAD_DELETE);
    var messageThreadUpdate = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_THREAD_UPDATE);
    var messageThreadReadOnly = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_THREAD_READONLY);
    var messageSendMessage = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_SEND_MESSAGE);
    var messageThreadBlock = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_THREAD_BLOCK);
    var messageThreadLeave = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_THREAD_LEAVE);
    var messageThreadAddUser = globalAdmin_Check ? true : userRoles.includes(Roles.MESSAGE_THREAD_ADD_USER);
    var organizationReadonly = globalAdmin_Check ? true : userRoles.includes(Roles.IDENTITY_ORGANIZATION_READONLY);
}

export const initialState = userData ? {
    isLoggedIn: true,
    role_GlobalAdmin: globalAdmin_Check,
    role_OrganizationAdmin: organizationAdmin_Check,
    role_User: user_Check,
    user: userData,
    organization_type: organizationType,
    trayEnabled: trayCheckReadOnly,
    cardEnabled: cardCheckReadOnly,
    activityEnabled: activityReadonly,
    alertsEnabled: alertsReadonly,
    programEnabled: programsReadonly,
    socialReadonly: socialServiceReadonly,
    organizationEdit: organizationEdit,
    inviteCodeGenerate: inviteCodeGenerate,
    blockSignin: blockSignin,
    resetPassword: resetPassword,
    identityUserReadonly: identityUserReadonly,
    notesReadonly: notesReadonly,
    notesCreate: notesCreate,
    notesEdit: notesEdit,
    noteDelete: noteDelete,
    skillReadOnly: skillReadOnly,
    userDelete: userDelete,
    groupReadonly: groupReadonly,
    groupCreate: groupCreate,
    groupEdit: groupEdit,
    groupDelete: groupDelete,
    assessmentReadonly: assessmentReadonly,
    messageThreadCreate: messageThreadCreate,
    messageThreadDelete: messageThreadDelete,
    messageThreadUpdate: messageThreadUpdate,
    messageThreadReadOnly: messageThreadReadOnly,
    messageSendMessage: messageSendMessage,
    messageThreadBlock: messageThreadBlock,
    messageThreadLeave: messageThreadLeave,
    messageThreadAddUser: messageThreadAddUser,
    organizationReadonly:organizationReadonly
}
    : {
        isLoggedIn: false,
        user: null,
        role_GlobalAdmin: false,
        role_OrganizationAdmin: false,
        organization_type: null,
        role_User: false,
        trayEnabled: false,
        cardEnabled: false,
        activityEnabled: false,
        alertsEnabled: false,
        programEnabled: false,
        socialReadonly: false,
        organizationEdit: false,
        inviteCodeGenerate: false,
        blockSignin: false,
        resetPassword: false,
        identityUserReadonly: false,
        notesReadonly: false,
        notesCreate: false,
        notesEdit: false,
        noteDelete: false,
        skillReadOnly: false,
        userDelete: false,
        groupReadonly: false,
        groupCreate: false,
        groupEdit: false,
        groupDelete: false,
        assessmentReadonly: false,
        messageThreadCreate: false,
        messageThreadDelete: false,
        messageThreadUpdate: false,
        messageThreadReadOnly: false,
        messageSendMessage: false,
        messageThreadBlock: false,
        messageThreadLeave: false,
        messageThreadAddUser: false,
        organizationReadonly:false
    };

export const userReducer = (initialState, action) => {
    switch (action.type) {

        case "LOGIN":
            const roles = action.payload.roleName;
            const userRoles = action.payload.userRolesIds ? action.payload.userRolesIds : [];
            const globalAdminCheck = roles.includes("Global Admin");
            const organizationAdminCheck = roles.includes("Organization Admin");
            const userCheck = roles.includes("User");
            const organizationType = action.payload.organization.organizationType
            var trayCheckReadOnly = globalAdminCheck ? true : userRoles.includes(Roles.TRAY_READONLY);
            var cardCheckReadOnly = globalAdminCheck ? true : userRoles.includes(Roles.CANDIDATECARD_READONLY);
            var activityReadonly = globalAdminCheck ? true : userRoles.includes(Roles.ACTIVITY_READONLY);
            var alertsReadonly = globalAdminCheck ? true : userRoles.includes(Roles.ALERTS_READONLY);
            var programsReadonly = globalAdminCheck ? true : userRoles.includes(Roles.PROGRAM_READONLY);
            var socialServiceReadonly = globalAdminCheck ? true : userRoles.includes(Roles.SOCIAL_SERVICE_READONLY);
            var organizationEdit = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_ORGANIZATION_EDIT);
            var inviteCodeGenerate = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_ORGANIZATION_INVITE_GENERATE);
            var blockSignin = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_USER_BLOCK);
            var resetPassword = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_USER_RESET_PASSWORD);
            var userDelete = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_USER_DELETE);
            var identityUserReadonly = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_USER_READONLY);
            var notesReadonly = globalAdminCheck ? true : userRoles.includes(Roles.USER_NOTES_READONLY);
            var notesCreate = globalAdminCheck ? true : userRoles.includes(Roles.USER_NOTES_CREATE);
            var notesEdit = globalAdminCheck ? true : userRoles.includes(Roles.USER_NOTES_EDIT);
            var noteDelete = globalAdminCheck ? true : userRoles.includes(Roles.USER_NOTES_DELETE);
            var skillReadOnly = globalAdminCheck ? true : userRoles.includes(Roles.USER_SKILL_READONLY);
            var groupReadonly = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_GROUP_READONLY);
            var groupCreate = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_GROUP_CREATE);
            var groupEdit = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_GROUP_EDIT);
            var groupDelete = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_GROUP_DELETE);
            var assessmentReadonly = globalAdminCheck ? true : userRoles.includes(Roles.ASSESSMENT_READONLY);
            var messageThreadCreate = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_THREAD_CREATE);
            var messageThreadDelete = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_THREAD_DELETE);
            var messageThreadUpdate = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_THREAD_UPDATE);
            var messageThreadReadOnly = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_THREAD_READONLY);
            var messageSendMessage = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_SEND_MESSAGE);
            var messageThreadBlock = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_THREAD_BLOCK);
            var messageThreadLeave = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_THREAD_LEAVE);
            var messageThreadAddUser = globalAdminCheck ? true : userRoles.includes(Roles.MESSAGE_THREAD_ADD_USER);
            var organizationReadonly = globalAdminCheck ? true : userRoles.includes(Roles.IDENTITY_ORGANIZATION_READONLY);


            return {
                ...initialState,
                isLoggedIn: true,
                role_GlobalAdmin: globalAdminCheck,
                role_OrganizationAdmin: organizationAdminCheck,
                role_User: userCheck,
                user: action.payload,
                organization_type: organizationType,
                trayEnabled: trayCheckReadOnly,
                cardEnabled: cardCheckReadOnly,
                activityEnabled: activityReadonly,
                alertsEnabled: alertsReadonly,
                programEnabled: programsReadonly,
                socialReadonly: socialServiceReadonly,
                organizationEdit: organizationEdit,
                inviteCodeGenerate: inviteCodeGenerate,
                blockSignin: blockSignin,
                resetPassword: resetPassword,
                identityUserReadonly: identityUserReadonly,
                notesReadonly: notesReadonly,
                notesCreate: notesCreate,
                notesEdit: notesEdit,
                noteDelete: noteDelete,
                skillReadOnly: skillReadOnly,
                userDelete: userDelete,
                groupReadonly: groupReadonly,
                groupCreate: groupCreate,
                groupEdit: groupEdit,
                groupDelete: groupDelete,
                assessmentReadonly: assessmentReadonly,
                messageThreadCreate: messageThreadCreate,
                messageThreadDelete: messageThreadDelete,
                messageThreadUpdate: messageThreadUpdate,
                messageThreadReadOnly: messageThreadReadOnly,
                messageSendMessage: messageSendMessage,
                messageThreadBlock: messageThreadBlock,
                messageThreadLeave: messageThreadLeave,
                messageThreadAddUser: messageThreadAddUser,
                organizationReadonly:organizationReadonly
            };

        case "LOGOUT":
            localStorage.clear();
            return {
                ...initialState,
                isLoggedIn: false,
                role_GlobalAdmin: false,
                role_OrganizationAdmin: false,
                role_User: false,
                user: null,
                organization_type: null,
                trayEnabled: false,
                cardEnabled: false,
                activityEnabled: false,
                alertsEnabled: false,
                programEnabled: false,
                socialReadonly: false,
                organizationEdit: false,
                inviteCodeGenerate: false,
                blockSignin: false,
                resetPassword: false,
                identityUserReadonly: false,
                notesReadonly: false,
                notesCreate: false,
                notesEdit: false,
                noteDelete: false,
                skillReadOnly: false,
                userDelete: false,
                groupReadonly: false,
                groupCreate: false,
                groupEdit: false,
                groupDelete: false,
                assessmentReadonly: false,
                messageThreadCreate: false,
                messageThreadDelete: false,
                messageThreadUpdate: false,
                messageThreadReadOnly: false,
                messageSendMessage: false,
                messageThreadBlock: false,
                messageThreadLeave: false,
                messageThreadAddUser: false,
                organizationReadonly:false
            };

        default:
            return initialState;
    }
}