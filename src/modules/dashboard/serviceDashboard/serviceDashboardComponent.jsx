import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DataTable, { createTheme } from "react-data-table-component";

import DashboardHeaderComponent from "../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import InformationTrayComponent from "../../../sharedComponents/informationTray/informationTrayComponent";
import DataTableCustomPagination from "../../../sharedComponents/dataTableCustomPagination/dataTableCustomPagination";
import { clearAlert, OrganizationTypes } from "../../../utils/contants";

// import {getInformtionTrayCount} from '../../../services/apiServices'
import {
  serviceAndKnowledgeDashboardTrayInformation,
  serviceDashboardUsers,
  getInformtionTrayCount,
} from "../../../services/dashboardServices";
import { processUserList } from "../../../services/adminServices";
import { useIsMounted } from "../../../utils/useIsMounted";
import { UserAuthDispatch, UserAuthState } from "../../../context/user/userContext";

import { AppConfig } from "../../../services/config";

import "../dashboard.scss";

import logo from "../../../assets/img/blankProfile.jpg";
import { logoutAndClear } from "../../../services/userManagementServices";
import { useSignalRDispatch } from "../../../context/signalR/signalR";
import { useToastDispatch } from "../../../context/toast/toastContext";

function ServiceDashboardComponent() {
  // createTheme creates a new theme named solarized that overrides the build in dark theme
  createTheme(
    "solarized",
    {
      text: {
        primary: "#9391b6",
        secondary: "#9391b6",
      },
      background: {
        default: "#181633",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#2f2c52",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  const navigate = useNavigate();
  const userState = UserAuthState();
  const [informationTrayList, setInformationTray] = useState([]);
  const [allLearners, setAllLearners] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const isMounted = useIsMounted();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  useEffect(() => {
    getInformationTrayDetails();
    getAllLearners();
  }, []);

  const [notActiveInSystem, setNotActiveInSystem] = useState([]);
  const location = useLocation();
  const signalR = useSignalRDispatch();
  const userDispatch = UserAuthDispatch();
  const toast = useToastDispatch();


  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("DisableThreadHubCommand", (message) => {
        if(isMounted()) {
          setNotActiveInSystem(message);
        }
      });
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
    try {
      let params = {};
      if (userState.organization_type === OrganizationTypes.SERVICEPARTNER) {
        params = {
          userType: "Social Service",
          page: "ServiceDashBoard",
        };
      } else {
        params = {
          userType: "Knowledge",
          page: "Dashboard",
        };
      }
      let response = await serviceAndKnowledgeDashboardTrayInformation(params);
      let responseData = await response.data.$values;
      const newArr = await Promise.all(
        responseData.map(async (item) => {
          try {
            if (item.apiEndPoint?.length > 0) {
              let res = await getInformtionTrayCount(
                item.apiEndPoint,
                userState.user.organization.organizationId
              );
              item.count = res.data.count;
            } else {
              item.count = 0;
            }
            return item;
          } catch (error) {
            console.log(error);
          }
        })
      );
      setInformationTray(newArr);
    } catch (error) {
      console.log(error);
    }

    // serviceAndKnowledgeDashboardTrayInformation(params)
    //   .then(async (response) => {
    //     if (response.data) {
    //       if (response.data.$values !== undefined) {
    //         let responseData = await response.data.$values;
    //         //api call for the tray count
    //         for (let i = 0; i < responseData.length; i++) {
    //           if (responseData[i].apiEndPoint?.length > 0) {
    //             getInformtionTrayCount(
    //               responseData[i].apiEndPoint,
    //               userState.user.organization.organizationId
    //             ).then(async (res) => {
    //               if (res.data) {
    //                 responseData[i].count = await res.data;
    //               }
    //               if (i === responseData.length - 1) {
    //                 if (isMounted()) {
    //                   let timeOutId = setTimeout(() => {
    //                     setInformationTray(responseData);
    //                   }, 500);
    //                   timeOutIDs.current.push(timeOutId);
    //                 }
    //               }
    //             });
    //           } else if (i === responseData.length - 1) {
    //             if (isMounted()) {
    //               let timeOutId = setTimeout(() => {
    //                 setInformationTray(responseData);
    //               }, 500);
    //               timeOutIDs.current.push(timeOutId);
    //             }
    //           }
    //         }

    //       }
    //     } else {
    //       setInformationTray([]);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.response);
    //   });
  };

  const getAllLearners = () => {
    serviceDashboardUsers(AppConfig.mobileOrganizationId)
      .then((res) => {
        if (isMounted()) {
          getFilteredLearnersData(res.data.filter((obj) => !obj.isSuspended));
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getFilteredLearnersData = (data) => {
    let params = {
      applicationUserIds: [],
    };
    if (data) {
      data.forEach((element) => {
        params["applicationUserIds"].push(element.id);
      });
    }
    processUserList(params).then((res) => {
      if (res.data) {
        if (isMounted()) {
          let learners = data.filter((item) => {
            //filter reviewed learners only on grid
            return res.data.$values.some(
              (obj) =>
                obj.applicationUserId === item.id &&
                obj.reviewRequired &&
                obj.isActive
            );
          });
          learners.map((learner) => {
            if (
              res.data.$values?.find(
                (obj) => learner.id === obj.applicationUserId
              )
            ) {
              let result = res.data.$values?.find(
                (obj) => learner.id === obj.applicationUserId
              );
              return (learner.uploadedImageUrl = result?.uploadedImageUrl);
            }
          });
          setAllLearners(learners);
        }
      }
    });
  };

  const rowSelection = (row) => {
    navigate(`/portal/learnersDetail/${row.id}`);
  };

  const columns = [
    {
      name: "FLAGGED LEARNERS",
      sortable: true,

      selector: (row) => row.firstName + " " + row.lastName,
      cell: (row) => (
        <span className="d-flex" onClick={() => rowSelection(row)}>
          <div className="position-relative">
            <img
              src={
                row?.uploadedImageUrl
                  ? row.uploadedImageUrl + "?" + Date.now()
                  : logo
              }
              className="rounded-circle mr-3 object-cover"
              alt="Profile"
              width="40"
              height="40"
            />
            <span className="material-icons warning-icon">warning</span>
          </div>
          <div>
            <span className="table-text">
              {row.firstName + " " + row.lastName}
            </span>
          </div>
        </span>
      ),
    },
    {
      name: "SUGGESTED INTERVENTION",
      // selector: row => row.normalizedUserName,
      cell: (row) => (
        <span className="text-danger">{/* NEED TO IMPLEMENT */}</span>
      ),
      sortable: false,
    },
    {
      name: "REFERRING PATNER",
      // selector: row => row.normalizedUserName,
      cell: (row) => (
        <span className="text-danger">{/* NEED TO IMPLEMENT */}</span>
      ),
      sortable: false,
    },
  ];

  //custom column sorting
  const customSort = (rows, selector, direction) => {
    return rows.sort((rowA, rowB) => {
      // use the selector function to resolve your field names by passing the sort comparitors
      const aField = selector(rowA);
      const bField = selector(rowB);

      let comparison = 0;

      if (aField?.toLowerCase() > bField?.toLowerCase()) {
        comparison = 1;
      } else if (aField?.toLowerCase() < bField?.toLowerCase()) {
        comparison = -1;
      }

      return direction === "desc" ? comparison * -1 : comparison;
    });
  };

  //disabled rows per page dropdown in pagination
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  return (
    <div id="main">
      <div className="service-dashboard">
        <DashboardHeaderComponent headerText="Your Dashboard" />
        <InformationTrayComponent trayInformation={informationTrayList} />
        {userState.identityUserReadonly && (
          <div>
            <div className="d-sm-flex mt-5 mb-3">
              <h1 className="h5 headText mt-3 pl-3">For Your Review</h1>
            </div>
            <div className="col-10 mb-5 service-review-component">
              <DataTable
                columns={columns}
                title={allLearners?.length}
                sortFunction={customSort}
                data={allLearners}
                pagination
                paginationComponent={DataTableCustomPagination}
                paginationComponentOptions={paginationComponentOptions}
                pointerOnHover
                highlightOnHover
                theme="solarized"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceDashboardComponent;
