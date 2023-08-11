import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import { NavLink } from "react-router-dom";

import WithLayout from "../../../sharedComponents/hoc/withLayOut";
import DashboardHeaderComponent from "../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import "./manageSponseredPrograms.scss";
import {
  deleteProgram,
  getProgramsByUserId,
} from "../../../services/sponsoredProgramService";
import { useToastDispatch } from "../../../context/toast/toastContext";

import { useIsMounted } from "../../../utils/useIsMounted";
import { clearAlert } from "../../../utils/contants";

function ManageSponseredPrograms() {
  const toast = useToastDispatch();
  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const [programsList, setPrograms] = useState([]);
  const [deleteData, setDeleteData] = useState({});

  //timeout cleanup
  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

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
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  useEffect(() => {
    getAllPrograms();
  }, []);

  const rowSelection = (row) => {
    navigate(`/edit_programe/${row.id}`, { state: { programe: row } });
  };
  const deletePrograme = () => {
    deleteProgram(deleteData.id)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            getAllPrograms();
            toast({ type: "success", text: "Program deleted successfully" });
          }
        }
      })
      .then((err) => console.log(err));
  };

  const columns = [
    {
      name: "Career Pathway",
      sortable: true,
      cell: (row) => (
        <a
          style={{ textDecoration: "underline" }}
          onClick={() => rowSelection(row)}
        >
          {row.carrerPathway}
        </a>
      ),
    },
    {
      name: "Enrollment Date",
      selector: (row) =>
        `${new Date(row.enrollmentDate).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}`,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) =>
        `${new Date(row.programStartDate).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}`,
      sortable: true,
    },
    {
      name: "Graduation Date",
      selector: (row) =>
        `${new Date(row.graduationDate).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}`,
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <span className="list-btns user-modal">
          <span
            className="material-icons delete-user custom-tooltip"
            data-toggle="modal"
            data-target="#delete-modal-user"
            onClick={() => setDeleteData(row)}
          >
            <span className='tooltiptext'>Delete program</span>
            delete
          </span>

          {/* program delete modal starts */}
          <div
            className="modal fade"
            id="delete-modal-user"
            tabIndex="-1"
            aria-labelledby="delete-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="subHead-text-learner modal-title h4" id="delete-modalLabel">
                    Are you sure?
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                 
                  </button>
                </div>
                <div className="modal-body text-white">
                  Are you sure you want to delete this programe?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={deletePrograme}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* user delete modal ends */}
        </span>
      ),
      width: "180px",
    },
  ];

  const getAllPrograms = () => {
    getProgramsByUserId("DA3C920C-18D2-45B4-8C13-54283F30FD9F").then((res) => {
      if (res.data) {
        if (isMounted()) {
          let responseData = res.data.$values;
          let timeOutId = setTimeout(() => {
            setPrograms(responseData);
          }, 200);
          timeOutIDs.current.push(timeOutId);
        }
      }
    });
  };

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
    <div id="main" className="manage-spons-pgm-container">
      <DashboardHeaderComponent headerText="Manage Sponsored Program" />
      {/* <Breadcrumbs /> */}
      <div className="bread-crumb">
        <NavLink
          to="/portal/dashboard"
          className="smallText text-uppercase navlink"
        >
          YOUR DASHBOARD
        </NavLink>
        <NavLink
          to="/manageSponsoredPrograms"
          className="smallText text-uppercase navlink"
        >
          {" >"} MANAGE SPONSORED PROGRAMS
        </NavLink>
      </div>
      <div className="add-spons-pgm">
        <button
          className="add-spons-pgm-btn"
          onClick={() => {
            navigate("/add_programe");
          }}
        >
          Add Sponsored Program
        </button>
      </div>
      <div className="card org-list-card shadow mt-4">
        <DataTable
          columns={columns}
          sortFunction={customSort}
          data={programsList}
          pagination
          pointerOnHover
          // highlightOnHover
          // customStyles={customStyles}
          theme="solarized"
        />
      </div>
    </div>
  );
}

export default WithLayout(ManageSponseredPrograms);
