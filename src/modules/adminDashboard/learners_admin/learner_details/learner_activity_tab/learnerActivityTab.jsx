import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useParams } from "react-router-dom";

// services
import { getActivity } from "../../../../../services/adminServices";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { ConstText } from "../../../../../utils/constantTexts";

function LearnerActivityTab() {
  const { id } = useParams();
  const [activityData, setActivityData] = useState([]);
  const isMounted = useIsMounted();

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

  useEffect(() => {
    getActivityList();
  }, []);

  const getActivityList = () => {
    getActivity(id)
      .then(async (res) => {
        let data = await res.data.$values;
        if (isMounted()) {
          setActivityData(data);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const columns = [
    {
      name: "Activity",
      selector: (row) => row.activity,
      sortable: true,
    },
    {
      name: "Source",
      selector: (row) => row.source,
      sortable: true,
    },
    {
      name: "Date & Time",
      selector: (row) =>
        dateTimeFormatter(row.createdDate)?.toLocaleString("en-US", {
          hour12: false,
          month: "short", // numeric, 2-digit, long, short, narrow
          day: "numeric", // numeric, 2-digit
          year: "numeric", // numeric, 2-digit
          hour: "2-digit", // numeric, 2-digit
          minute: "2-digit", // numeric, 2-digit
          second: "2-digit", // numeric, 2-digit
        }),
      sortable: true,
    },
    {
      name: "Additional Data",
      selector: (row) => row.additionalData,
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

      if (aField.toLowerCase() > bField.toLowerCase()) {
        comparison = 1;
      } else if (aField.toLowerCase() < bField.toLowerCase()) {
        comparison = -1;
      }

      return direction === "desc" ? comparison * -1 : comparison;
    });
  };

  const dateTimeFormatter = (data) => {
    console.log(data);
    if (data) {
      return new Date(
        new Date(data).getTime() -
          new Date(data).getTimezoneOffset() * 60 * 1000
      );
    }
  };
  return (
    <div className="card-body">
      <div className="col-5">
        <p className="" style={{ color: "white" }}>
          {ConstText.NODATA}
        </p>
      </div>
      {/* <div className="card badge-list-card shadow mt-4">
        <DataTable
          columns={columns}
          // data={activityData}
          // pagination
          sortFunction={customSort}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          // pointerOnHover
          highlightOnHover
          theme="solarized"
        />
      </div> */}
    </div>
  );
}

export default LearnerActivityTab;
