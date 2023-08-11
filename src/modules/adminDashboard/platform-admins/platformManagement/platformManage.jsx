import React from "react";
import { NavLink } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";

import "../platformAdmin.scss";
import "../../admindashboard.scss";

import PlatformTab from "./platformTab";
import EmployersTab from "./employersTab";

import "react-tabs/style/react-tabs.css";



function PlatformManagement() {  

  return (
    <>     
      <div id="main" className="platform-admin-component platform-manage-main">
        <DashboardHeaderComponent headerText="ReadySkill Administrator" />
        <div className="bread-crumb-assesment">
          <NavLink to="/portal/admin/platform_admins" className="smallText text-uppercase text-decoration-none navlink">ReadySkill Administrator </NavLink>
          <a className="smallText text-uppercase navlink-assesment text-decoration-none"> {">"} Platform Management</a>
        </div>
        <div className="container-fluid">
          <h1 className="h5 headText mt-5 d-flex">
            <span className="material-icons mt-02 mr-2" >
            view_list
            </span>
            Platform Management
          </h1>
          <p className="subText mt-3">
            <span className="material-icons mr-2 text-danger">warning</span>
            WARNING:  Unless otherwise noted, changes made here are reflected immediately on the platform. Use care when making changes on a live system!

          </p>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-5 pr-2">
              <div className="card shadow group-manage-card platform-manage-card pt-3">
                <Tabs>
                  <TabList>
                    <Tab>PLATFORM</Tab>
                    <Tab>EMPLOYERS</Tab>
                    {/* <Tab>KNOWLEDGE</Tab>
                    <Tab>SOCIAL</Tab> */}
                  </TabList>

                  <TabPanel>
                    <PlatformTab/>
                  </TabPanel>

                  <TabPanel>
                    <EmployersTab/>
                  </TabPanel>

                  {/* <TabPanel>
                    <KnowledgeTab/>
                  </TabPanel>

                  <TabPanel>
                    <SocialTab/>
                  </TabPanel> */}

                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalAdminLayOut(PlatformManagement);
