import React from 'react';



// const DashboardContainer = React.lazy(() => retry(() =>  ){
//     return new Promise(resolve => {
//       setTimeout(() => resolve(import('../modules/dashboard/dashboardContainer')), 1520000);
//     });
//   } );
const DashboardContainer = React.lazy(() => retry(() => import('../modules/dashboard/dashboardContainer')));
const MessageCenterContainer = React.lazy(() => retry(() => import('../modules/messageCenter/messageCenterContainer')));
const ImpactAndOutcomesContainer = React.lazy(() => retry(() => import('../modules/impactAndOutcomes/impactAndOutcomesContainer')));
const LearnersContainer = React.lazy(() => retry(() => import('../modules/learners/learnersContainer')));
const PragramsContainer = React.lazy(() => retry(() => import('../modules/programs/pragramsContainer')));
const ProgramsDetails = React.lazy(() => retry(() => import('../modules/programs/programsDetails')));
const SeetingsContainer = React.lazy(() => retry(() => import('../modules/settings/settingsContainer')));
const LearnersDetailsContainer = React.lazy(() => retry(() => import('../modules/learnersDetails/learnersDetailsContainer')));
const ResourcesContainer = React.lazy(() => retry(() => import('../modules/resources/resourcesContainer')));
const ResourcesDetails = React.lazy(() => retry(() => import('../modules/resources/resourcesDetails')));
const RecruitingComponent = React.lazy(() => retry(() => import('../modules/recruiting/recruitingComponent')));

const LoginContainer = React.lazy(() => retry(() => import('../modules/login/login-page/loginContainer')));
const InviteCodeLoginComponent = React.lazy(() => retry(() => import('../modules/login/invite-code-login-page/inviteCodeLogin')));
const EmailInviteLoginComponent = React.lazy(() => retry(() => import('../modules/login/email-invite-login-page/emailInviteLogin')));
const InviteSignupContainer = React.lazy(() => retry(() => import('../modules/login/invite-signup-page/inviteSignup')));
const EmailVerifiedComponent = React.lazy(() => retry(() => import('../modules/login/email-verified-page/emailVerificationResponse')));

const ResetPassword_SentOTP = React.lazy(() => retry(() => import('../modules/resetPassword/resetPassword-sentOTP')));
const ResetPassword_VerifyOTP = React.lazy(() => retry(() => import('../modules/resetPassword/resetPassword-verifyOTP')));

const OrganizationList = React.lazy(() => retry(() => import('../modules/organization/organization-list-page/organizationList')));
const OrganizationForm = React.lazy(() => retry(() => import('../modules/organization/organization-create-page/organizationForm')));
const OrganizationDetails = React.lazy(() => retry(() => import('../modules/organization/organization-details-page/oraganizationDetails')));
const InvitationContainer = React.lazy(() => retry(() => import('../modules/organization/organization-details-page/sentInvitation/invitationContainer')));
const InviteCodeGeneratorContainer = React.lazy(() => retry(() => import('../modules/organization/organization-details-page/invite-code-generate/inviteCodeGenerate')));

const ManageSponsoredPrograms = React.lazy(() => retry(() => import('../modules/manageSponseredPrograms/sponsored-program-list/manageSponseredPrograms')));
const FaqComponent = React.lazy(() => retry(() => import('../modules/faq/faqComponent')));
const ManageAlerts = React.lazy(() => import('../modules/manageAlerts/manage-alerts-list/manageAlerts'));
const ManageAlertsForm = React.lazy(() => import('../modules/manageAlerts/manage-alerts-create/alertsCreateForm'));

const AuthorizationLimit = React.lazy(() => retry(() => import('../modules/login/authorization-limit/authorizationLimit')));
const ProgramsForm = React.lazy(() => retry(() => import('../modules/manageSponseredPrograms/sponsored-program-create/programsForm')));
const AdminDashboardContainer = React.lazy(() => retry(() => import('../modules/adminDashboard/adminDashboardContainer')));
const LearnersListComponent = React.lazy(() => retry(() => import('../modules/adminDashboard/learners_admin/learners_list/learnersListComponent')));
const PlatformAdminsComponent=React.lazy(() => retry(() => import('../modules/adminDashboard/platform-admins/platformAdminsComponent')));
const assessmentManagement=React.lazy(() => retry(() => import('../modules/adminDashboard/platform-admins/assessmentManagement/assessmentManage')));
const groupManagement=React.lazy(() => retry(() => import('../modules/adminDashboard/platform-admins/groupManagement/groupManage')));
const platformManagement=React.lazy(() => retry(() => import('../modules/adminDashboard/platform-admins/platformManagement/platformManage')));
const ExternalConnections=React.lazy(() => retry(() => import('../modules/adminDashboard/platform-admins/externalConnections/externalConnections')));
const NewsItems=React.lazy(() => retry(() => import('../modules/adminDashboard/platform-admins/newsItems/newsItems')));
const NewsItemsEditor=React.lazy(() => retry(() => import('../modules/adminDashboard/platform-admins/newsItems/newsItemsEditor')));
const MobileResetPassword=React.lazy(() => retry(() => import('../modules/mobileResetPassword/mobileResetPassword')));

//admin
const AdminLearnersDetails = React.lazy(() => retry(() => import('../modules/adminDashboard/learners_admin/learner_details/learner_details_container')));
const AdminOrganizationDetails = React.lazy(() => retry(() => import('../modules/adminDashboard/admin_organization/organization_details_container')));
// const AdminOrganizationList = React.lazy(() => retry(() => import('../modules/adminDashboard/admin_organization/adminOrganizationContainer')));
const AdminOrganizationList = React.lazy(() => retry(() => import('../modules/adminDashboard/admin_organization/organization_list/admin_organization_list')));

const knowledgeDashboard = React.lazy(() => retry(() => import('../modules/dashboard/knowledgeDashboard/knowledgeDashboardComponent')));
const Confirm=React.lazy(() => retry(() => import('../sharedComponents/confirm/confirm')));
const AllRoutes = [
    {
        path: '/portal/dashboard',
        component: DashboardContainer,
        breadcrumb: "YOUR DASHBOARD"
    },
    {
        path: '/portal/login',
        component: LoginContainer
    },
    {
        path: '/portal/messagecenter',
        component: MessageCenterContainer,
        breadcrumb: "MESSAGE CENTER"
    },
    {
        path: '/portal/impactandoutcomes',
        component: ImpactAndOutcomesContainer,
        breadcrumb: "IMPACT & OUTCOMES"
    },
    {
        path: '/portal/learners',
        component: LearnersContainer,
        breadcrumb: "LEARNERS"
    },
    {
        path: '/portal/programs',
        component: PragramsContainer,
        breadcrumb: "PROGRAMS"
    },
    {
        path: '/portal/programsDetails',
        component: ProgramsDetails,
        breadcrumb: "PROGRAMS DETAILS"
    },

    {
        path: '/portal/settings',
        component: SeetingsContainer
    },
    {
        path: '/portal/organization',
        component: OrganizationList,
        breadcrumb: "ORGANIZATION LIST"
    },
    {
        path: '/portal/organizationDetails/:id',
        component: OrganizationDetails
    },
    {
        path: '/portal/add_organization',
        component: OrganizationForm
    },
    {
        path: '/portal/edit_organization/:id',
        component: OrganizationForm
    },
    {
        path: '/portal/sent_invitation/:id',
        component: InvitationContainer
    },
    {
        path: '/portal/invite_code',
        component: InviteCodeLoginComponent
    },
    {
        path: '/portal/invitation',
        component: EmailInviteLoginComponent
    },
    {
        path: '/portal/invite_signup',
        component: InviteSignupContainer
    },
    {
        path: '/portal/invite_code_generator',
        component: InviteCodeGeneratorContainer
    },
    {
        path: '/portal/recruiting',
        component: RecruitingComponent
    },
    {
        path: '/portal/resetPassword',
        component: ResetPassword_SentOTP
    },
    {
        path: '/portal/resetPasswordOTP',
        component: ResetPassword_VerifyOTP
    },
    {
        path: '/portal/confirmEmail',
        component: EmailVerifiedComponent
    },
    {
        path: '/portal/faq',
        component: FaqComponent
    },
    {
        path: '/portal/learnersDetail/:id',
        component: LearnersDetailsContainer,
        breadcrumb: "LEARNERS"
    },
    {
        path: '/portal/resources',
        component: ResourcesContainer
    },
    {
        path: '/portal/resourcesDetails',
        component: ResourcesDetails
    },
    {
        path: '/portal/manageAlerts',
        component: ManageAlerts,
        breadcrumb: "MANAGE ALERTS"
    },
    {
        path: '/portal/manageSponsoredPrograms',
        component: ManageSponsoredPrograms,
        breadcrumb: "MANAGE SPONSORED PROGRAMS"
    },
    {
        path: '/portal/add_alert',
        component: ManageAlertsForm,
        breadcrumb: "CREATE ALERTS"
    },
    {
        path: '/portal/authorizationLimit',
        component: AuthorizationLimit

    },
    {
        path: '/portal/add_programe',
        component: ProgramsForm

    },
    {
        path: '/portal/edit_programe/:id',
        component: ProgramsForm

    }, {
        path: '/portal/admin/admin_dashboard',
        component: AdminDashboardContainer
    }, {
        path: '/portal/admin/learners_list',
        component: LearnersListComponent
    },
    {
        path:'/portal/admin/platform_admins',
        component:PlatformAdminsComponent
    },
    {
        path:'/portal/admin/manageAssessment',
        component:assessmentManagement
    },
    {
        path:'/portal/admin/manageGroups',
        component:groupManagement
    },
    {
        path:'/portal/admin/managePlatform',
        component:platformManagement
    },
    {
        path:'/portal/admin/externalConnections',
        component:ExternalConnections
    },
    {
        path:'/portal/admin/newsItems',
        component:NewsItems
    },
    {
        path:'/portal/admin/newsItemsEditor',
        component:NewsItemsEditor
    },
    {
        path:'/portal/admin/editNewsItem/:id',
        component:NewsItemsEditor
    },
    {
        path:'/portal/mobile_ResetPassword',
        component:MobileResetPassword
    },
    {
        path: '/portal/admin/learnerDetails/:id',
        component: AdminLearnersDetails,
    },
    {
        path: '/portal/admin/OrganizationDetails',
        component: AdminOrganizationDetails,
    },
    {
        path: '/portal/admin/organizations',
        component: AdminOrganizationList,
    },
    {
        path: '/portal/knowledgeDashboard',
        component: knowledgeDashboard,
    },
    {
        path: '/portal/confirm/confirmEmail',
        component: Confirm,
    }

]

function retry(fn, retriesLeft = 5, interval = 1000) {

    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                console.log("retrying........")
                console.log("retry error", error)
                setTimeout(() => {
                    if (retriesLeft === 1) {
                        // reject('maximum retries exceeded');
                        reject(error);
                        return;
                    }

                    // Passing on "reject" is the important part
                    retry(fn, retriesLeft - 1, interval).then(resolve, reject);
                }, interval);
            });
    });
}

export default AllRoutes;
