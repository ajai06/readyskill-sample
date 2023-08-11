import React from "react";

import WithLayout from "../../sharedComponents/hoc/withLayOut";
import DashboardHeaderComponent from "../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import MessageCenterComponent from "./messageCenterComponent";
import { NavLink } from "react-router-dom";

function MessageCenterContainer() {
  return (
    <div id="main">
      <DashboardHeaderComponent headerText="Message Center" />
      <div className="bread-crumb">
        <NavLink to="/portal/dashboard" className="smallText text-uppercase navlink">
          YOUR DASHBOARD
        </NavLink>
        <NavLink
          to="/portal/messagecenter"
          className="smallText text-uppercase navlink"
        >
         {" >"} MESSAGE CENTER
        </NavLink>
      </div>
      <MessageCenterComponent />
    </div>
  );
}

export default WithLayout(MessageCenterContainer);
