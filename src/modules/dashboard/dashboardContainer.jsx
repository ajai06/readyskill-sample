import React from "react";

import WithLayout from "../../sharedComponents/hoc/withLayOut";
import EmployerDashboardComponent from "./employerDashboard/employerDashboardComponent";

import { UserAuthState } from "../../context/user/userContext";

import "./dashboard.scss";
import ServiceDashboardComponent from "./serviceDashboard/serviceDashboardComponent";
import { OrganizationTypes } from "../../utils/contants"

function DashboardContainer() {

  const userState = UserAuthState();

  return (
    <div className="container-fluid px-0">
      {(userState.organization_type === OrganizationTypes.EMPLOYERPARTNER) && <EmployerDashboardComponent />}
      {(userState.organization_type === OrganizationTypes.READYSKILL || userState.organization_type === OrganizationTypes.SERVICEPARTNER
        || userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER) && (
          <ServiceDashboardComponent />
        )}
    </div>
  );
}

export default WithLayout(DashboardContainer);
