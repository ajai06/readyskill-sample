import React, { useEffect, useState } from "react";
import GlobalAdminLayOut from "../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
//services
import { getPlatformModules } from "../../../services/adminServices";
import "./platformAdmin.scss";
import { useNavigate } from "react-router-dom";
// import moduleIcon from "../../../assets/img/icons/platformAdmin/Education.svg";

function PlatformAdminsComponent() {
  const [platformModules, setPlatformModules] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getModules();
  }, []);

  const getModules = () => {
    getPlatformModules()
      .then((res) => {
        let data = res.data.$values;
        var sortData = data.sort((a, b) => a.sequenceNumber-b.sequenceNumber);
        setPlatformModules(sortData);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const navigateToPage = (module) => {
    if (module.url) {
      if(!module.isDirectory)
      {
        navigate(`${module.url}`);
      }
    }
  };

  return (
    <div id="main" className=" platform-admin-component">
      <DashboardHeaderComponent headerText="ReadySkill Administrator" />
      <div className="bread-crumb">
        {/* <NavLink to="/portal/admin/admin_dashboard" className="smallText text-decoration-none text-uppercase navlink">ADMIN DASHBOARD  </NavLink> */}
        <a to="" className="smallText text-decoration-none text-uppercase navlink active"> READYSKILL ADMINISTRATOR</a>
      </div>
      <div className="container-fluid">
        <h1 className="h5 headText ml-1">Platform Modules</h1>
        <h6 className="headText-2 mb-3 ml-1">Choose a platform module to manage</h6>
        <div className="col-xl-11 col-lg-11 col-md-12">
        <div className="row">
          
          {platformModules.map((module, index) => (
            <div
              className="col-xl-4 col-lg-6 col-md-12 pl-0 pb-3 pr-3"
              key={index}
              onClick={() => navigateToPage(module)}
            >
              <div className="card platform-adm-cards">
                <div className="card-body">
                  <div className="d-flex">
                  {/* <img src={moduleIcon} className="modules-icons mr-3" alt="Platform modules"/> */}
                    <span
                      className="material-icons platform-adm-icons mr-3 mt-1 "
                      style={{"color": module.fillColor}}
                    >
                      {module.icon}
                    </span>
                    <div className="">
                      <h5 className="headText mt-2">{module.moduleName}</h5>
                      <p className="subText ml-2">{module.moduleDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalAdminLayOut(PlatformAdminsComponent);
