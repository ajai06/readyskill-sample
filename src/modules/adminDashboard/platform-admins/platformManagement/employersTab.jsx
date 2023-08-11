import React from "react";
import { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import CustomPaginationComponent from "../../../../sharedComponents/dataTableCustomPaginationWithAlphabets/customPaginationComponent";

//context
import { useIsMounted } from "../../../../utils/useIsMounted";
import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";

//services
import {
  checkIndustryForDuplicate,
  deleteIndustry,
  editIndustry,
  getIndustryTypes,
} from "../../../../services/adminServices";
import { useEffect } from "react";
import DataTableCustomPagination from "../../../../sharedComponents/dataTableCustomPagination/dataTableCustomPagination";
import AddIndustryModal from "./addIndustryModal";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";

function EmployersTab() {
  const isMounted = useIsMounted();
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const [editData, setEditData] = useState(undefined);
  const [addIndustryShow, setAddIndustryShow] = useState(false);
  const [deleteIndustryShow, setDeleteIndustryShow] = useState(false);
  const [industryList, setIndustryList] = useState([]);
  const [deleteObject, setDeleteObject] = useState({});

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

  const customSortEnabled = (rowA, rowB) => {
    console.log("called");

    const a = JSON.stringify(rowA.isEnabled);
    const b = JSON.stringify(rowB.isEnabled);

    console.log("called", a, b);
    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };

  //columns defenitions
  const columns = [
    {
      name: "ONET Code",
      selector: (row) => `${row.onetCode}`,
      sortable: true,
      // width: "15%"
    },
    {
      name: "Name",
      selector: (row) => `${row.name.trim().length>100 ? row.name.slice(0,100)+'...':row.name}`,
      sortable: true,
      // width: "58%"
    },
    {
      name: "Enabled",
      sortable: true,
      selector: (row) => `${row.isEnabled}`,
      sortFuction: customSortEnabled,
      width: "12%",

      cell: (row) => (
        <div className="px-0 py-1">
          <div className="form-check mb-2">
            <label className="custom-control overflow-checkbox">
              <input
                type="checkbox"
                key={row.id}
                onChange={() => editIndustryData(row)}
                checked={row.isEnabled}
                value={row.id}
                className="form-check-input overflow-control-input"
              />
              <span className="overflow-control-indicator"></span>
            </label>
          </div>
        </div>
      ),
    },

    {
      name: "",
      width: "15%",
      button: true,
      cell: (row) => (
        <div className="list-btns">
          <i
            className={
              "fa-regular fa-pen-to-square edit-icon list-fun-btns mr-3 custom-tooltip"
            }
            onClick={() => editIndustryHandler(row)}
          >
            <span className='tooltiptext'>Edit</span>
          </i>
          <i
            className={
              "fa-regular fa-trash-can delete-btn list-fun-btns mr-0 custom-tooltip" +
              (row.isAssigned ? " opacity-50" : "")
            }
            onClick={() => deleteIndustryHandler(row)}
          >
            <span className='tooltiptext'>Delete</span>
          </i>
        </div>
      ),
    },
  ];

  //disabled rows per page dropdown in pagination
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  //data table custom style for header
  const customStyles = {
    headCells: {
      style: {
        color: "#9391b6",
        fontSize: "13px",
        textTransform: "uppercase",
        fontWeight: "700",
      },
    },
    pagination: {
      style: {
        border: "none",
        backgroundColor: "green",
      },
    },
  };

  useEffect(() => {
    getAllIndustry();
  }, []);

  const getAllIndustry = () => {
    getIndustryTypes()
      .then((res) => {
        if (isMounted()) {
          let response = res.data;
          setIndustryList(response);
        }
      })
      .catch((err) => console.log(err));
  };

  const addIndustry = () => {
    setAddIndustryShow(true);
    setEditData(undefined);
  };

  const hideModal = () => {
    setAddIndustryShow(false);
    setEditData();
  };

  const editIndustryHandler = (data) => {
    setEditData(data);
    setAddIndustryShow(true);
  };

  const deleteIndustryHandler = (data) => {
    setDeleteObject(data);
    setDeleteIndustryShow(true);
  };

  const industryDelete = () => {
    setDeleteIndustryShow(false);
    deleteIndustry(deleteObject.id, userState.user.id)
      .then((res) => {
        if (isMounted()) {
          getAllIndustry();
          setDeleteObject({});
        }
        toast({ type: "success", text: "Industry deleted successfully" });
      })
      .catch((err) => console.log(err));
  };
  const editIndustryData = (data) => {
    data["isEnabled"] = !data.isEnabled;
    editIndustry(data)
      .then((res) => {
        getAllIndustry();
        toast({ type: "success", text: "Industry updated successfully" });
      })
      .catch((err) => console.log(err));
  };


  return (
    <React.Fragment>
      <AddIndustryModal
        show={addIndustryShow}
        onHide={hideModal}
        editData={editData}
        getAllIndustry={getAllIndustry}
      />
      <ConfirmationModal
        show={deleteIndustryShow}
        btnClassName="btn-danger"
        actionButton="Delete"
        actionText={"delete this industry ?"}
        onHide={() => setDeleteIndustryShow(false)}
        onAction={industryDelete}
      />
      <div className="card-body">
        <p className="subHead-text-learner mb-2 text-uppercase mt-3">
          Industry Types
        </p>
        <p className="subText ml-2">
          The following values define the industry type associated with
          employment partners on the ReadySkill platform. Entries require both a
          description and an industry-standard ONET code.
        </p>
        <span
          className="justify-content-end add-enrollment-btn d-flex"
          onClick={addIndustry}
        >
          <span className="material-icons add-icon mr-0">add</span>
          <p className="subText mt-1 ml-3 mb-0 mr-3">Add New Industry</p>
        </span>
        <div className="container-fluid employers-table  mt-4">
          <div className="row  user-tab-table">
            <div className="col-12 px-0">
              <DataTable
                columns={columns}
                data={industryList ? industryList : []}
                // selectableRows
                pagination
                paginationComponent={DataTableCustomPagination}
                // paginationServer
                paginationTotalRows={
                  industryList?.length ? industryList.length : 0
                }
                paginationComponentOptions={paginationComponentOptions}
                // onChangePage={handlePageChange}
                persistTableHead
                // pointerOnHover
                // sortFunction={customSort}
                highlightOnHover
                theme="solarized"
                // onSelectedRowsChange={handleChange}
                // clearSelectedRows={toggledClearRows}
                // conditionalRowStyles={conditionalRowStyles}
                customStyles={customStyles}
                // selectableRowDisabled={
                //   resetPasswordModalShow
                //     ? rowDisabledCriteria
                //     : suspendModalShow
                //     ? rowDisabledCriteriaBlock
                //     : unSuspendModalShow
                //     ? rowDisabledCriteriaUnBlock
                //     : ""
                // }
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EmployersTab;
