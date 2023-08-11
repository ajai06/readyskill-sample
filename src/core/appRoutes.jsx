import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import AllRoutes from '../core/allRoutes';

import { UserAuthState } from "../context/user/userContext";

import FallBack from '../sharedComponents/fallback/fallBack';

const AppRoutes = () => {

  const userState = UserAuthState();

  const array = ['/portal/login', '/portal/invitation', '/portal/invite_signup', '/portal/invite_code', '/portal/resetPassword',
    '/portal/resetPasswordOTP', '/portal/faq', '/portal/confirmEmail', '/portal/signin-google',
    '/portal/authorizationLimit', '/portal/mobile_ResetPassword', '/portal/confirm/confirmEmail'
  ];

  const globAdmin_urls = ['/portal/admin/admin_dashboard', '/portal/admin/organizations',
    '/portal/admin/learners_list', '/portal/admin/learnerDetails/:id', '/portal/admin/platform_admins', '/portal/admin/managePlatform',
    '/portal/admin/newsItems', '/portal/admin/newsItemsEditor', '/portal/admin/editNewsItem/:id', '/portal/admin/manageAssessment',
    '/portal/admin/externalConnections', '/portal/admin/manageGroups',
  ];

  const orgAdmin_urls = ['/portal/admin/OrganizationDetails']

  function AuthRoute({ component: Component, path }) {

    if (userState.user && (path === '/' || path === '/portal/login')) {
      return <Navigate to="/portal/dashboard" />
    } else if ((!userState.user || path === '/') && (!array.includes(path))) {
      return <Navigate to="/portal/login" />
    } else if (userState.user && array.includes(path)) {
      return <Navigate to="/portal/dashboard" />
    } else {
      if (userState.role_User && (globAdmin_urls.includes(path) || orgAdmin_urls.includes(path))) {
        return <Navigate to="/portal/dashboard" />
      } else if (userState.role_OrganizationAdmin && globAdmin_urls.includes(path)) {
        return <Navigate to="/portal/dashboard" />
      } else {
        return <Component />
      }
    }
  }

  return (

    <Routes>
      {
        AllRoutes.map(route => {
          const { component, path } = route;
          return <Route key={path} path={path}
            element={<Suspense fallback={<FallBack />}>
              <AuthRoute path={path} component={component} />
            </Suspense>
            }
          />
        })
      }
      <Route path="*" element={<Navigate to="/portal/login" />} />
    </Routes>
  );

}

export default AppRoutes