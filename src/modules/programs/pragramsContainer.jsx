import React, { useState, useEffect, useRef } from "react";
import DashboardHeaderComponent from "../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import Breadcrumbs from "../../sharedComponents/BreadCrumbs/breadCrumbs";
import WithLayout from "../../sharedComponents/hoc/withLayOut";
import ProgramsComponent from "./programsComponent";
import InformationTrayComponent from "../../sharedComponents/informationTray/informationTrayComponent";
import { programsTrayInformation } from "../../services/programeServices";
import { getInformtionTrayCount } from "../../services/dashboardServices";
import { clearAlert, OrganizationTypes } from "../../utils/contants";

import "./programs.scss";
import { UserAuthState } from "../../context/user/userContext";

function PragramsContainer() {
  const [informationTrayList, setInformationTray] = useState([]);
  const userState = UserAuthState();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current
      clearAlert(ids);
    };
  }, []);

  useEffect(() => {
    getInformationTrayDetails();
  }, []);

  const getInformationTrayDetails = async () => {
    let params = {};
    if (userState.organization_type === OrganizationTypes.SERVICEPARTNER) {
      params = {
        userType: "Social Service",
        page: "Program",
      };
    } else if (
      userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER
    ) {
      params = {
        userType: "Knowledge",
        page: "Program",
      };
    } else if (
      userState.organization_type === OrganizationTypes.EMPLOYERPARTNER
    ) {
      params = {
        userType: "employer",
        page: "Program",
      };
    } else {
      params = {
        userType: "employer",
        page: "Program",
      };
    }
    try {
      let response = await programsTrayInformation(params);
      let responseData = await response.data.$values;
      const newArr = await Promise.all(responseData.map(async item => {
        if (item.apiEndPoint) {
          try {
            let res = await getInformtionTrayCount(item.apiEndPoint, userState.user.organization.organizationId);
            item.count = res.data.count;
            return item;
          } catch (error) {
            console.log(error)
          }
        } else {
          item.count = 0;
          return item;
        }
      }));
      setInformationTray(newArr)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div id="main">
      <DashboardHeaderComponent headerText="Programs" />
      <Breadcrumbs />
      <InformationTrayComponent trayInformation={informationTrayList} />
      {userState.programEnabled && <ProgramsComponent />}
    </div>
  );
}

export default WithLayout(PragramsContainer);
