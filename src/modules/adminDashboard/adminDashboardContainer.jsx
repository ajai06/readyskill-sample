import React from 'react'
import DashboardHeaderComponent from '../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import GlobalAdminLayOut from '../../sharedComponents/hoc/globalAdminLayOut';
import AdminAlertsComponent from './admin_alerts/adminAlertsComponent';

function AdminDashboardContainer() {
    return (
        <div id="main">
            <DashboardHeaderComponent headerText="Admin Dashboard"/>
            {/* <div className="bread-crumb">
        <NavLink
          to="/portal/admin/admin_dashboard"
          className="smallText text-uppercase navlink text-decoration-none"
        >
          Admin Dashboard{" "}
        </NavLink>
        
      </div> */}
            <AdminAlertsComponent />
        </div>
    )
}

export default GlobalAdminLayOut(AdminDashboardContainer)