import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";

import "../platformAdmin.scss";

//services
import { getRoleCategory } from "../../../../services/organizationServices";

//contexts
import { useIsMounted } from "../../../../utils/useIsMounted";

import "react-tabs/style/react-tabs.css";
import GroupRolesList from "../../../../sharedComponents/groupsRoleList/groupsRoleList";

function AssessmentManagement() {
  const isMounted = useIsMounted();
  const [rolesCategoryList, setRolesCategoryList] = useState([]);
  const [tabName, setTabName] = useState(undefined);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = () => {
    getRoleCategory()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data;
            setRolesCategoryList(responseData);
          }
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div id="main" className="platform-admin-component">
        <DashboardHeaderComponent headerText="ReadySkill Administrator" />
        <div className="bread-crumb-assesment">
          <NavLink
            to="/portal/admin/platform_admins"
            className="smallText text-uppercase text-decoration-none navlink"
          >
            READYSKILL ADMINISTRATOR{" "}
          </NavLink>
          <a className="smallText text-uppercase navlink-assesment text-decoration-none">
            {" "}
            {">"} DEFAULT GROUP MANAGEMENT
          </a>
        </div>
        <div className="container-fluid">
          <h1 className="h5 headText mt-5 d-flex">
            <span className="material-icons mt-02 mr-2" >
              groups
            </span>
            Default Group Management
          </h1>
          <p className="subText mt-3">
            <span className="material-icons mr-2 text-danger">warning</span>
            WARNING: Unless otherwise noted, changes made here are reflected
            immediately on the platform. Use care when making changes on a live
            system!
          </p>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-5 pr-2">
              <div className="card shadow group-manage-card pt-3">
                <div className="d-flex">
                  <div className="col-6">

                    <p className="subHead-text-learner mb-4 text-uppercase w-100 mt-5">
                      default groups
                    </p>
                    <p
                      className={`inner-sub text-capitalize custom-grp-items mb-3 py-2 pl-3 ${tabName === "Mobile" ? "active" : ""
                        }`}
                      onClick={() => setTabName("Mobile")}
                    >
                      Mobile Users
                    </p>
                    <p
                      className={`inner-sub text-capitalize custom-grp-items mb-3 py-2 pl-3 ${tabName === "Organization" ? "active" : ""
                        }`}
                      onClick={() => setTabName("Organization")}
                    >
                      Organization Users
                    </p>
                    <p
                      className={`inner-sub text-capitalize custom-grp-items mb-3 py-2 pl-3 ${tabName === "Admin" ? "active" : ""
                        }`}
                      onClick={() => setTabName("Admin")}
                    >
                      Organization Admins
                    </p>
                  </div>
                  {tabName && <div className="col-6">
                    <div>
                      <div className="col-12">
                        <div className="card-body w-100 px-0 pt-0">
                          <p className="subHead-text-learner mb-4 text-uppercase w-100 mt-4">
                            {/* ROLES ASSIGNED TO THE{" "}
                          {tabName === "User" ? "ORGANIZATION" : tabName} USER
                          GROUP */}
                          </p>
                          <GroupRolesList
                            groupName={tabName}
                            rolesCategoryList={rolesCategoryList}
                            setTabName={setTabName}
                          />
                        </div>
                      </div>
                    </div>

                  </div>}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalAdminLayOut(AssessmentManagement);
