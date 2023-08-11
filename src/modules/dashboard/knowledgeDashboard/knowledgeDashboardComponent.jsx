import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable, { createTheme } from "react-data-table-component";

import DashboardHeaderComponent from "../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import InformationTrayComponent from "../../../sharedComponents/informationTray/informationTrayComponent";

// import {getInformtionTrayCount} from '../../../services/apiServices'
import {
  knowledgeDashboardTrayInformation,
  serviceDashboardUsers,
  getInformtionTrayCount,
} from "../../../services/dashboardServices";

import { clearAlert, OrganizationTypes } from "../../../utils/contants";

import { UserAuthState } from "../../../context/user/userContext";

import "../dashboard.scss";
import { useIsMounted } from "../../../utils/useIsMounted";
import logo from "../../../assets/img/user.jpg";

import WithLayout from "../../../sharedComponents/hoc/withLayOut";

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

  const getInformationTrayDetails = async () => {

    try {
      let response = await knowledgeDashboardTrayInformation();
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

  const getAllLearners = () => {
    serviceDashboardUsers(userState.user.organization.organizationId)
      .then((res) => {
        if (isMounted()) {
          setAllLearners(res.data.$values);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const rowSelection = (row) => {
    navigate(`/portal/learnersDetail/${row.candidateId}`);
  };

  const columns = [
    {
      name: "FLAGGED LEARNERS",
      sortable: true,
      selector: (row) => row.firstName + " " + row.lastName,
      cell: (row) => (
        <span onClick={() => rowSelection(row)}>
          <img
            src={logo}
            className="rounded-circle mr-3 object-cover"
            alt="Profile"
            width="40"
            height="40"
          />
          <span className="material-icons warning-icon">warning</span>
          <span>{row.firstName + " " + row.lastName}</span>
        </span>
      ),
    },
    {
      name: "SUGGESTED INTERVENTION",
      selector: (row) => row.suggestedIntervention,
      sortable: true,
    },
    {
      name: "REFERRING PATNER",
      selector: (row) => row.referringPartner,
      sortable: true,
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

  return (
    <div id="main">
      <div className="service-dashboard">
        <DashboardHeaderComponent headerText="Your Dashboard" />
        <InformationTrayComponent trayInformation={informationTrayList} />
        <div className="d-sm-flex mt-5 mb-3">
          <h1 className="h5 headText mt-3 pl-3">For Your Review</h1>
        </div>
        <div className="col-10 service-review-component">
          <DataTable
            columns={columns}
            sortFunction={customSort}
            data={allLearners}
            pagination
            pointerOnHover
            highlightOnHover
            theme="solarized"
          />
        </div>
      </div>
    </div>
  );
}

export default WithLayout(ServiceDashboardComponent);
