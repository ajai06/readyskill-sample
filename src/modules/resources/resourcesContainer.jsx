import React, { useState, useEffect } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Breadcrumbs from "../../sharedComponents/BreadCrumbs/breadCrumbs";
import DashboardHeaderComponent from "../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import WithLayout from "../../sharedComponents/hoc/withLayOut";
import ResourceComponent from "./resourceComponent";
import "./resources.scss";
import InformationTrayComponent from "../../sharedComponents/informationTray/informationTrayComponent";
import { UserAuthState } from "../../context/user/userContext";
import { OrganizationTypes } from "../../utils/contants";
import { resourceTrayInformation } from "../../services/resourceServices";
import { getInformtionTrayCount } from "../../services/dashboardServices";

function ResourcesContainer() {
  const userState = UserAuthState();
  const [informationTrayList, setInformationTray] = useState([]);

  useEffect(() => {
    getInformationTrayDetails();
  }, []);

  const getInformationTrayDetails = async () => {
    let params = {};
    if (userState.organization_type === OrganizationTypes.SERVICEPARTNER || userState.role_GlobalAdmin) {
      params = {
        userType: "Social Service",
        page: "Resources"
      }
    } else if (userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER) {
      params = {
        userType: "Knowledge",
        page: "Resources"
      }
    }
    try {
      let response = await resourceTrayInformation(params);
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
      <DashboardHeaderComponent headerText="Resources" />
      <Breadcrumbs />
      <InformationTrayComponent trayInformation={informationTrayList} />
      {userState.socialReadonly && <ResourceComponent />}
    </div>
  );
}

export default WithLayout(ResourcesContainer);
