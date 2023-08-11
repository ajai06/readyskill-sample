import React, { useState, useEffect, useRef } from "react";

//components
import InformationTrayComponent from "../../../sharedComponents/informationTray/informationTrayComponent";
import DashboardHeaderComponent from "../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import DashboardMessageCenterComponent from "./dashboardMessageCenter/dashBoardMessageCenterComponent";
import DashboardAlertCenterComponent from "./dashboardAlertCenter/dashboardAlertCenter";
import DashboardSponsoredPrograms from "./dashboardSponsoredPrograms/dashboardSponsoredPrograms";
import CandiadateTrayfilterContainer from "../../../sharedComponents/candidateTrayFilter/candiadateTrayfilterContainer";
//services
// import { getInformtionTrayCount } from "../../../services/apiServices";
import {
  getInformtionTrayDetails,
  getInformtionTrayCount,
} from "../../../services/dashboardServices";
import { clearAlert, OrganizationTypes } from "../../../utils/contants";
//contexts

import { UserAuthDispatch, UserAuthState } from "../../../context/user/userContext";

import "../dashboard.scss";
import { logoutAndClear } from "../../../services/userManagementServices";
import { useSignalRDispatch } from "../../../context/signalR/signalR";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMounted } from "../../../utils/useIsMounted";
import { useToastDispatch } from "../../../context/toast/toastContext";

function EmployerDashboardComponent() {
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

  const navigate = useNavigate();
  const [notActiveInSystem, setNotActiveInSystem] = useState([]);
  const location = useLocation();
  const signalR = useSignalRDispatch();
  const userDispatch = UserAuthDispatch();
  const isMounted = useIsMounted();
  const toast = useToastDispatch();



  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("DisableThreadHubCommand", (message) => {
        if(isMounted()) {
          setNotActiveInSystem(message);
        }      });
    }
  });

  useEffect(() => {
    if (
      notActiveInSystem.length &&
      notActiveInSystem.some((id) => id === userState.user.id) && 
      location.pathname.startsWith("/portal/dashboard")
    ) {
      logout();
    }
  }, [notActiveInSystem]);

  const logout = () => {
    logoutAndClear(userState.user.id)
      .then((response) => {

        if (response.data && response.data.isSuccess) {
          toast({ type: "warning", text: "Administrator blocked or Deleted your Account from login. Please contact your administrator." });
          userDispatch({ type: "LOGOUT" });
          navigate("/portal/login");
        } else {
        }
      })
      .catch((err) => {
        // toast({ type: "error", text: "Something went wrong ! " });
      });
  };

  const getInformationTrayDetails = async () => {
    let params = {
      userType: OrganizationTypes.EMPLOYERPARTNER,
      page: "Dashboard",
    };

    try {
      let response = await getInformtionTrayDetails(params);
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
      <DashboardHeaderComponent headerText="Your Dashboard" />
      {/* <Breadcrumbs/> */}
      <InformationTrayComponent trayInformation={informationTrayList} />
      <div className="container-fluid">
        {(userState.messageThreadReadOnly || userState.alertsReadonly) &&
          <div className="d-sm-flex mt-5 mb-3">
            <h1 className="h5 headText mt-3">For Your Review</h1>
          </div>
        }

        <div className="row">
          {userState.messageThreadReadOnly && <DashboardMessageCenterComponent />}
          {userState.alertsEnabled &&
            <DashboardAlertCenterComponent />
          }

          {
            userState.cardEnabled && <div className="container-fluid pl-0">
              <div className="d-sm-flex mt-5 mb-3">
                <h1 className="h5 headText mt-3 pl-3">Recruiting</h1>
              </div>
              <CandiadateTrayfilterContainer />
            </div>
          }

          {
            userState.programEnabled && <DashboardSponsoredPrograms />
          }

        </div>
      </div>
    </div>
  );
}

export default EmployerDashboardComponent;
