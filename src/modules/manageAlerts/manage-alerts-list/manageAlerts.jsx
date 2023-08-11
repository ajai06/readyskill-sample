import React, { useEffect, useState, useRef } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { NavLink } from "react-router-dom";

import WithLayout from '../../../sharedComponents/hoc/withLayOut';
import { UserAuthState } from '../../../context/user/userContext';
import { useNavigate } from 'react-router-dom';
import { getAllalerts } from '../../../services/alertsService';
import DashboardHeaderComponent from '../../../sharedComponents/dashboardHeader/dashboardHeaderComponent';

import { useIsMounted } from '../../../utils/useIsMounted';

import './manageAlerts.scss';
import DataTableCustomPagination from '../../../sharedComponents/dataTableCustomPagination/dataTableCustomPagination';
import { clearAlert } from '../../../utils/contants';

function ManageAlerts() {

  const navigate = useNavigate();
  const [alertList, setAlertList] = useState([]);
  const userState = UserAuthState();
  const isMounted = useIsMounted();

    //timeout cleanup
    const timeOutIDs = useRef([]);

    useEffect(() => {
      return () => {
        let ids = timeOutIDs.current;
        clearAlert(ids);
      };
    }, []);


  createTheme('solarized', {
    text: {
      primary: '#9391b6',
      secondary: '#9391b6',

    },
    background: {
      default: '#181633',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#2f2c52',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');

  const columns = [
    {
      name: 'Header',
      selector: row => row.headerText,
      sortable: true,
    },
    {
      name: 'Body',
      selector: row => row.bodyText,
      sortable: true,
    }, {
      name: 'Alert Type',
      selector: row => row.alertType,
      sortable: true,
    },
    {
      name: 'Created Date',
      selector: row => `${(new Date(new Date(row.createdDate).getTime() - new Date(row.createdDate).getTimezoneOffset() * 60 * 1000)).toLocaleString("en-US", {
        month: "2-digit", // numeric, 2-digit, long, short, narrow
        day: "2-digit", // numeric, 2-digit
        year: "2-digit", // numeric, 2-digit
        hour: "numeric",
        minute: "numeric"
      })}`,
      sortable: true,
    },
  ];

  useEffect(() => {
    getaAlertsWitUserId();
  }, [])

  const getaAlertsWitUserId = () => {
    getAllalerts()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data.$values;
            let timeOutId = setTimeout(() => {
              setAlertList(responseData)
            }, 200);
          timeOutIDs.current.push(timeOutId);
          }
        } else {
          setAlertList([]);
        }
      })
  }

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

  const customStyles = {
    headCells: {
      style: {
        color: "#9391b6",
        fontSize: "13px",
        textTransform: "uppercase",
        fontWeight: "700",
      },
    },
    rows: {
      style: {
        color: "#fff",
      },
    },
    pagination:{
      style: {
        border: "none",
        backgroundColor: "transperant",
      }
    }
  };
 

  const paginationComponentOptions = {
    noRowsPerPage: true,
  };
  return (
    <div id="main" className="manage-alert-container">
      <DashboardHeaderComponent headerText="Manage Alerts" />
      <div className="bread-crumb">
        <NavLink to="/portal/dashboard" className="smallText text-uppercase navlink">YOUR DASHBOARD{'>'}</NavLink>
        <NavLink to="/portal/manageAlerts" className="smallText text-uppercase navlink">Manage Alerts</NavLink>
      </div>
      <div className="add-alert col-11">
        <button className="add-alert-btn" onClick={() => { navigate("/portal/add_alert") }}>Add Alert</button>

      </div>
      <div className="mt-4 col-11">
        <DataTable
          columns={columns}
          sortFunction={customSort}
          paginationComponent={DataTableCustomPagination}
          data={alertList}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          customStyles={customStyles}
          theme="solarized"
        />
      </div>
    </div>
  );
}

export default WithLayout(ManageAlerts);
