import React, { useState, useEffect, useRef } from "react";
import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import { NavLink, useParams } from "react-router-dom";
import {
  getOrganizationLearners,
  processUserList,
  learnerSchoolList,
  getAllOrgList,
} from "../../../../services/adminServices";

import { AppConfig } from "../../../../services/config";

import { UserAuthState } from "../../../../context/user/userContext";

import "../../admindashboard.scss";
import ListTableComponent from "./listTableComponent";
import { useIsMounted } from "../../../../utils/useIsMounted";
import InformationTrayComponent from "../../../../sharedComponents/informationTray/informationTrayComponent";
import { learnerListTrayInformation } from "../../../../services/learnersServices";
import { getInformtionTrayCount } from "../../../../services/dashboardServices";
import { getAllUsers } from "../../../../services/organizationServices";
import { clearAlert } from "../../../../utils/contants";

function LearnersListComponent() {
  const userState = UserAuthState();

  const [learnersList, setLearners] = useState([]);
  const [learnerDetails, setLearnerDetails] = useState([]);
  const [learnerSchool, setLearnerSchool] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [informationTrayList, setInformationTrayList] = useState([]);
  const isMounted = useIsMounted();

  useEffect(() => {
    getAllLearnsrsList();

  }, []);

  useEffect(() => {
    setTimeout(() => {
      getAllOrganizationList();
    }, 500);
  }, []);

  const getAllLearnsrsList = () => {
    getAllUsers(AppConfig.mobileOrganizationId)
      .then((res) => {
        if (isMounted()) {
          let response = res.data;
          let listOfLearnerId = res.data.map((obj) => obj.id);
          processUsersDetails(listOfLearnerId, response);
          schoolDetails(listOfLearnerId);
        }
      })
      .catch((err) => console.log(err));
  };

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current
      clearAlert(ids);
    };
  }, []);

  const processUsersDetails = (data, candidates) => {
    let userIdList = {
      applicationUserIds: data,
    };
    processUserList(userIdList)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data.$values;
            let learners = candidates.filter((item) => {
              return responseData.some((obj) =>
                item.id === obj.applicationUserId);
            });
            //for displaying count
            let activeLearners = candidates.filter((item) => {
              return responseData.some(
                (obj) =>
                  item.id === obj.applicationUserId &&
                  !item.isSuspended
              );
            });
            setLearners(learners);
            setLearnerDetails(responseData);
            getInformationTrayDetails(activeLearners?.length);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const schoolDetails = (data) => {
    let userIdList = {
      learnerIds: data,
    };
    learnerSchoolList(userIdList)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data.$values;
            setLearnerSchool(responseData);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllOrganizationList = () => {
    getAllOrgList(userState.user.id)
      .then((res) => {
        if (isMounted()) {
          setOrganizations(res.data);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getInformationTrayDetails = async (activelearners) => {
    try {
      let response = await learnerListTrayInformation();
      let responseData = response.data.$values;
      const newArr = await Promise.all(responseData.map(async item => {
        try {
          if (item.apiEndPoint?.length > 0 && item.headingText !== "ACTIVE LEARNERS") {
            let res = await getInformtionTrayCount(item.apiEndPoint, userState.user.organization.organizationId);
            item.count = res.data.count;
          } else if (item.apiEndPoint?.length > 0 && item.headingText === "ACTIVE LEARNERS") {
            item.count = activelearners;
          } else {
            item.count = 0;
          }
          return item;
        } catch (error) {
          console.log(error)
        }
      }));
      setInformationTrayList(newArr);
    }
    catch (error) {
      console.log(error)
    }

    // learnerListTrayInformation()
    //   .then(async (response) => {
    //     if (response.data) {
    //       if (response.data.$values !== undefined) {
    //         let responseData = await response.data.$values;
    //         //api call for the tray count
    //         for (let i = 0; i < responseData.length; i++) {
    //           if (responseData[i].apiEndPoint?.length > 0 && responseData[i].headingText !== "ACTIVE LEARNERS") {
    //             getInformtionTrayCount(responseData[i].apiEndPoint, userState.user.organization.organizationId).
    //               then(async (res) => {
    //                 if (res.data) {
    //                   responseData[i].count = await res.data.count;
    //                 }

    //               });
    //           } else if (responseData[i].apiEndPoint?.length > 0 && responseData[i].headingText === "ACTIVE LEARNERS") {
    //             responseData[i].count = activelearners;
    //           }
    //         }
    //         let timeOutId = setTimeout(() => {
    //           if (isMounted()) {
    //             setInformationTrayList(responseData);
    //           }
    //         }, 3000);
    //         timeOutIDs.current.push(timeOutId);
    //       }
    //     } else {
    //       setInformationTrayList([]);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.response);
    //   });
  };

  return (
    <div id="main" className="platform-admin-main">
      <DashboardHeaderComponent headerText="Learners" />
      <div className="bread-crumb">
        <NavLink
          to="/portal/admin/admin_dashboard"
          className="smallText text-decoration-none text-uppercase navlink"
        >
          ADMIN DASHBOARD{" "}
        </NavLink>
        <NavLink
          to=""
          className="smallText text-decoration-none text-uppercase navlink"
        >
          {">"} LEARNERS
        </NavLink>
      </div>
      <InformationTrayComponent trayInformation={informationTrayList} />
      <div>
        <ListTableComponent
          learnersList={learnersList}
          learnerDetails={learnerDetails}
          getAllLearnsrsList={getAllLearnsrsList}
          getInformationTrayDetails={getInformationTrayDetails}
          learnerSchool={learnerSchool}
          organizations={organizations}
        />
      </div>
    </div>
  );
}

export default GlobalAdminLayOut(LearnersListComponent);
