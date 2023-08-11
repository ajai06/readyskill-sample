import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

//context
import { UserAuthState } from "../../../context/user/userContext";

import DashboardHeaderComponent from '../../../sharedComponents/dashboardHeader/dashboardHeaderComponent';
import GlobalAdminLayOut from '../../../sharedComponents/hoc/globalAdminLayOut';
import OrganizationDetailsAdminComponent from './organization_details_component';
import { useLocation } from "react-router-dom";

//api
import {  getOrganization } from "../../../services/organizationServices";

import { useIsMounted } from "../../../utils/useIsMounted";
import "../admindashboard.scss";


function OrganizationDetailsAdminContainer() {

    const location = useLocation();
    const isMounted = useIsMounted();
    const userState = UserAuthState();
    const [organizationName, setOrganizationName] = useState();

  useEffect (()=>{
      if(userState.role_GlobalAdmin){
          getOrganizationDetails()
      }
  },[])

  //Organization Name
  const getOrganizationDetails =()=>{
    getOrganization(location.state.orgId)
    .then((res) => {
        let data = res.data;
        if (isMounted() && data) {
            setOrganizationName(data.organizationName);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

    return (
        <div id="main" className='learners-details-main'>
            <DashboardHeaderComponent headerText="Organizations" />
           { !userState.role_GlobalAdmin && <div className="bread-crumb">
                <NavLink to="/portal/dashboard" className="smallText text-uppercase navlink text-decoration-none">YOUR DASHBOARD </NavLink>
               <a className="smallText text-uppercase navlink text-decoration-none active"> {">"} {userState.user.organization.organizationName}</a>
            </div>}
            {userState.role_GlobalAdmin && 
            <div className="bread-crumb">
                {/* <NavLink to="/portal/admin/admin_dashboard" className="smallText text-uppercase text-decoration-none navlink">ADMIN DASHBOARD{' > '}</NavLink> */}
                <NavLink to="/portal/admin/organizations" className="smallText text-uppercase text-decoration-none navlink">ORGANIZATIONS</NavLink>
                <a className="smallText text-uppercase navlink text-decoration-none active active-breadcrumb">{' > '} {organizationName}</a>
            </div>
}

            <OrganizationDetailsAdminComponent />
             
        </div>
    )
}
 
export default GlobalAdminLayOut(OrganizationDetailsAdminContainer);