import React from "react";
import { createTheme } from "react-data-table-component";

import "../../learnersadmin.scss";
import { ConstText } from "../../../../../utils/constantTexts";


const LearnerDevelopmentListTable = ({ developmentEvents }) => {
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

  // const columns = useMemo(
  //   () => [
  //     {
  //       name: "",
  //       cell: (row) => (
  //         <div className="d-flex">
  //           <span className="material-icons edit-org mr-3 mt-3">
  //             terrain
  //           </span>
  //           <div>
  //             <p className="inner-sub text-capitalize mt-1 mb-0">
  //               {row.event}{" "}
  //               <p className="subText text-uppercase my-2">{row.university}</p>
  //             </p>
  //           </div>
  //         </div>
  //       ),
  //     },
  //     {
  //       name: "Date",
  //       cell: (row) => (
  //         <div>
  //           <p className="inner-sub text-capitalize mt-1 mb-0">{row.date}</p>
  //         </div>
  //       ),
  //       sortable: true,
  //     },
  //     {
  //       name: "",
  //       button: true,
  //       cell: (row) => (
  //         <span className="list-btns d-flex">
  //           <span className="material-icons edit-org mr-3">
  //             edit
  //           </span>
  //           <span className="material-icons delete-user">
  //             delete
  //           </span>
  //         </span>
  //       ),
  //     },
  //   ],
  //   []
  // );

  //custom column sorting
  // const customSort = (rows, selector, direction) => {
  //   return rows.sort((rowA, rowB) => {
  //     // use the selector function to resolve your field names by passing the sort comparitors
  //     const aField = selector(rowA);
  //     const bField = selector(rowB);

  //     let comparison = 0;

  //     if (aField.toLowerCase() > bField.toLowerCase()) {
  //       comparison = 1;
  //     } else if (aField.toLowerCase() < bField.toLowerCase()) {
  //       comparison = -1;
  //     }

  //     return direction === "desc" ? comparison * -1 : comparison;
  //   });
  // };

  return (
    <div className="container-fluid  mt-4">
      <div className="row org-list-card">
        <div className="d-flex justify-content-between">
          <h4 className="subHead-text-learner mb-3 mt-2">
            Career Development
          </h4>
          <span>
            <span className="material-icons plus-icon mr-0 cursor-text">
              add
            </span>
            <span className="ml-2 subText cursor-text">Add Event</span>
          </span>
        </div>
        <div className="col-5">
        <p className="" style={{ color: "white" }}>
          {ConstText.NODATA}
        </p>
      </div>
        {/* <div className="col-12">
          <DataTable
            columns={columns}
            sortFunction={customSort}
            // data={developmentEvents ? developmentEvents : []}
            // selectableRows
            pagination
            pointerOnHover
            highlightOnHover
            theme="solarized"
            // onSelectedRowsChange={handleChange}
          />
        </div> */}
      </div>
    </div>
  );
};

export default LearnerDevelopmentListTable;
