import React, { useEffect, useRef, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { NavLink, useParams } from "react-router-dom";
import {
  deleteOrganization,
  getOrganizationList,
  blockOrganization,
  organizationListTrayInformation,
} from "../../../../services/organizationServices";

import { UserAuthState } from "../../../../context/user/userContext";

import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";

import AddOrganizationModal from "./add_organization_modal";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";
import SendMessageContactsModal from "./sendMessageContactsModal";

import "../../admindashboard.scss";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import { useNavigate } from "react-router-dom";
import { useIsMounted } from "../../../../utils/useIsMounted";
import InformationTrayComponent from "../../../../sharedComponents/informationTray/informationTrayComponent";
import CustomPaginationComponent from "../../../../sharedComponents/dataTableCustomPaginationWithAlphabets/customPaginationComponent";
import { getInformtionTrayCount } from "../../../../services/dashboardServices";
import DataTableCustomCheckbox from "../../../../sharedComponents/dataTableCustomCheckbox/dataTableCustomCheckbox";
import { clearAlert } from "../../../../utils/contants";

function AdminOrganizationContainer() {
  const userState = UserAuthState();
  const toast = useToastDispatch();

  const navigate = useNavigate();

  const [organizationList, setOrganizationList] = useState([]);

  const [addOrgModalShow, setAddOrgModalShow] = React.useState(false);
  const [deleteOrgModalShow, setDeleteOrgModalShow] = React.useState(false);
  const [blockOrgModalShow, setBlockOrgModalShow] = React.useState(false);
  const [unblockOrgModalShow, setUnblockOrgModalShow] = React.useState(false);
  const [sendMessageModalShow, setSendMessageModalShow] = useState(false);
  const [informationTrayList, setInformationTrayList] = useState([]);
  const [inactiveOrgCount, setInactiveOrgCount] = useState(0);
  const [activeOrgCount, setActiveOrgCount] = useState(0);
  const isMounted = useIsMounted();


  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current
      clearAlert(ids);
    };
  }, []);


  useEffect(() => {
    fetchOrganizations();
    //getInformationTrayDetails();
    // newGetInformationTrayDetails()
  }, []);

  const fetchOrganizations = () => {
    getOrganizationList(userState.user.id)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            //Need to remove mobile organization data
            let response = res.data.filter(
              (obj) => obj.organizationTypeId !== 1
            );
            // getInformationTrayDetails();
            newGetInformationTrayDetails()
            setOrganizationList(response);
            setFilters(response);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [filters, setFilters] = useState();

  const searchFilter = (event) => {
    let value = event.target.value.toString();
    var lowSearch = value.toLowerCase();

    const filtered = organizationList.filter((item) =>
      // Object.keys(item).some((key) =>
      //   item[key]?.toString()?.toLowerCase()?.includes(lowSearch)
      // )

      item.organizationName?.toLowerCase().includes(lowSearch)
    );

    setFilters(filtered);
  };

  const [editData, setEditData] = useState();

  const addOrg = () => {
    setAddOrgModalShow(true);
    setEditData();
  };

  const editOrg = (row) => {
    // setAddOrgModalShow(true);
    // setEditData(row);
    let orgId = row.id;
    navigate(`/portal/admin/OrganizationDetails`, { state: { orgId } });
  };

  const deleteClick = (row) => {
    setDeleteOrgModalShow(true);
    setEditData(row);
  };

  const deleteOrg = () => {
    const data = {};
    data.organizationIds = [editData.id];
    data.isActive = false;
    setDeleteOrgModalShow(false);
    deleteOrganization(data)
      .then((res) => {
        if (isMounted()) {
          fetchOrganizations();
          toast({ type: "success", text: "Organization delete successfully" });
          clearSelections();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteMultiOrg = () => {
    const orgIds = selectedRows.map((item) => item.id);
    const data = {};
    data.organizationIds = orgIds;
    data.isActive = false;
    setDeleteOrgModalShow(false);
    deleteOrganization(data)
      .then((res) => {
        if (isMounted()) {
          fetchOrganizations();
          toast({ type: "success", text: "Organizations delete successfully" });
          clearSelections();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hideModal = () => {
    setAddOrgModalShow(false);
    setEditData();
  };

  // manage checkbox selections
  const [isMultipleChecked, setIsMultipleChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);

  const [isSuspend, setIsSuspend] = useState(false);
  const [isUnsuspend, setIsunsuspend] = useState(false);

  const rowSelectCritera = ({ selectedRows }) => {
    selectedRows.length > 1
      ? setIsMultipleChecked(true)
      : setIsMultipleChecked(false);

    setSelectedRows(selectedRows);

    if (selectedRows?.length > 1) {
      selectedRows.some((item) => !item.isSuspended)
        ? setIsunsuspend(true)
        : setIsunsuspend(false);
      selectedRows.some((item) => item.isSuspended)
        ? setIsSuspend(true)
        : setIsSuspend(false);
    }
  };

  const rowDisabledActiveCriteria = (row) =>
    !row.isSuspended && unblockOrgModalShow;
  const rowDisabledInactiveCriteria = (row) =>
    row.isSuspended && blockOrgModalShow;
  const rowDisabledMessageCriteria = (row) =>
    (row.isSuspended || row.administrativeUserIsSuspend) &&
    sendMessageModalShow;

  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  // block organization
  const blockClick = (row) => {
    setBlockOrgModalShow(true);
    setEditData(row);
  };

  const blockOrg = () => {
    const data = {};
    data.organizationIds = [editData.id];
    data.isSuspended = true;
    setBlockOrgModalShow(false);
    blockOrganization(data)
      .then((res) => {
        if (isMounted()) {
          toast({ type: "success", text: "Organization blocked successfully" });
          fetchOrganizations();
          clearSelections();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const blockMultipleOrg = () => {
    setBlockOrgModalShow(false);

    const filtered = selectedRows.filter((item) => !item.isSuspended);

    const data = {};
    data.organizationIds = filtered.map((item) => item.id);
    data.isSuspended = true;

    blockOrganization(data)
      .then((res) => {
        if (isMounted()) {
          fetchOrganizations();
          toast({
            type: "success",
            text: "Organizations blocked successfully",
          });
          clearSelections();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // unblock organization confrimation modal
  const unblockClick = (row) => {
    setUnblockOrgModalShow(true);
    setEditData(row);
  };

  // unblock a organization submit
  const unblockOrg = () => {
    const data = {};
    data.organizationIds = [editData.id];
    data.isSuspended = false;
    setUnblockOrgModalShow(false);
    blockOrganization(data)
      .then((res) => {
        if (isMounted()) {
          fetchOrganizations();
          toast({
            type: "success",
            text: "Organization unblocked successfully",
          });
          clearSelections();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // unblock multiple organizations submit
  const unblockMultiOrg = () => {
    const filtered = selectedRows.filter((item) => item.isSuspended);

    const data = {};
    data.organizationIds = filtered.map((item) => item.id);
    data.isSuspended = false;
    setUnblockOrgModalShow(false);
    blockOrganization(data)
      .then((res) => {
        if (isMounted()) {
          fetchOrganizations();
          clearSelections();
          toast({
            type: "success",
            text: "Organizations unblocked successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clearSelections = () => {
    setSelectedRows([]);
    handleClearRows();
    setIsMultipleChecked(false);
  };

  const hideBlockModal = () => {
    setBlockOrgModalShow(false);
  };

  const hideUnblockModal = () => {
    setUnblockOrgModalShow(false);
  };

  /////////// Data table theme and options //////

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
        backgroundColor: "transperant",
      },
    },
    selectableRows: {
      style: {
        backgroundColor: "green",
      },
    },
  };

  //data table conditional style for suspended learners
  const conditionalRowStyles = [
    {
      when: (row) => row.isSuspended,
      style: {
        backgroundColor: "rgba(231 34 99 / 8% )",
      },
    },
    {
      when: (row) => selectedRows.find((org) => org.id === row.id),
      style: {
        backgroundColor: "#3e3c7a",
        color: "#fff",
      },
    },
  ];

  //disabled rows per page dropdown in pagination
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  const newGetInformationTrayDetails = async () => {
    try {
      let response = await organizationListTrayInformation();
      let responseData = await response.data.$values;
      const newArr = await Promise.all(responseData.map(async item => {
        if (item.apiEndPoint) {
          try {
            let res = await getInformtionTrayCount(item.apiEndPoint, "");
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
      setInformationTrayList(newArr)
    } catch (error) {
      console.log(error)
    }
  }

  const caseInsensitiveSortUSers = (rowA, rowB) => {
    const a = rowA.userCount;
    const b = rowB.userCount;

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
      name: "Name",
      selector: (row) => `${row.organizationName}`,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => `${row.organizationTypeInfo.type}`,
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row) => row.administrativeUser ? row.administrativeUser : "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => `${row.isSuspended}`,
      cell: (row) => (
        <>
          {
            !row.isSuspended
              ? <span id={row.id}>Active</span>
              : <span id={row.id} className="block-icon-text">Inactive</span>
          }
        </>
      ),

      sortable: true,
    },
    // {
    //   name: "Zip",
    //   selector: (row) => `${row.zip1}`,
    //   sortable: true,
    // },
    {
      name: "Users",
      selector: (row) => `${row.userCount}`,
      sortable: true,
      sortFunction: caseInsensitiveSortUSers,
    },
    {
      button: true,
      cell: (row) => (
        <span className="list-btns">
          <i
            className={
              "fa-regular fa-pen-to-square edit-icon curosr-pointer list-fun-btns mx-2 custom-tooltip " +
              (isMultipleChecked && "opacity-50")
            }
            onClick={() => editOrg(row)}
          >
            <span className='tooltiptext'>Edit organization</span>
          </i>
          {!row.isSuspended ? (
            <span
              className={
                "material-icons curosr-pointer mx-2 unblock-icon custom-tooltip " +
                (isMultipleChecked && "opacity-50")
              }

              onClick={() => blockClick(row)}
            >
              <span className='tooltiptext'>Block Organization</span>
              lock_open
            </span>
          ) : (
            <span
              className={
                "material-icons-outlined curosr-pointer mx-2 mt-0 block-icon custom-tooltip " +
                (isMultipleChecked && "opacity-50")
              }
              onClick={() => unblockClick(row)}
            >
              <span className='tooltiptext'>Unblock Organization</span>
              lock
            </span>
          )}
          <a
            href={row.publicDirectoryLink}
            target={"_blank"}
            rel="noreferrer noopener"
          >
            <span
              className={
                "material-icons curosr-pointer open-new list-fun-btns mx-2 custom-tooltip " +
                ((isMultipleChecked || !row.publicDirectoryLink) &&
                  "opacity-50")
              }
            >
              <span className='tooltiptext'>Open Directory</span>
              open_in_new
            </span>
          </a>

          <i
            className={
              "fa-regular fa-trash-can curosr-pointer delete-btn list-fun-btns mx-2 custom-tooltip " +
              (isMultipleChecked && "opacity-50")
            }
            onClick={() => deleteClick(row)}
          >
            <span className='tooltiptext'>Delete organization</span>
          </i>
        </span>
      ),
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

  const sendMessageContacts = () => {
    setSendMessageModalShow(true);
  };

  function filterByAlphabets(item) {
    if (item === "All") {
      setFilters(organizationList);
    } else {
      var filtered = organizationList.filter((word) => {
        return (
          word.organizationName?.toLowerCase().charAt(0) === item.toLowerCase()
        );
      });
      setFilters(filtered);
    }
  }

  const checkLetterFoundInList = (item) => {
    var filtered = organizationList.some((word) => {
      return (
        word.organizationName?.toLowerCase().charAt(0) === item.toLowerCase()
      );
    });
    return filtered;
  };

  const CustomPag = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    onChangeRowsPerPage,
    currentPage,
  }) => {
    return (
      <CustomPaginationComponent
        component="nav"
        currentPage={currentPage}
        count={rowCount}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onChangePage={onChangePage}
        onChangeRowsPerPage={({ target }) =>
          onChangeRowsPerPage(Number(target.value))
        }
        ActionsComponent={CustomPaginationComponent}
        alphabetFilter={filterByAlphabets}
        checkLetterFoundInList={checkLetterFoundInList}
      />
    );
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer =
        setTimeout(() => func.apply(context, args), delay);
    }
  }

  const onOptimisedHandleChange = debounce(searchFilter, 500);

  return (
    <>
      {addOrgModalShow ? (
        <AddOrganizationModal
          show={addOrgModalShow}
          onHide={hideModal}
          // editData={editData}
          fetchOrganizations={fetchOrganizations}
        />
      ) : (
        ""
      )}
      {deleteOrgModalShow ? (
        <ConfirmationModal
          show={deleteOrgModalShow}
          btnClassName="btn-danger"
          actionButton="Delete"
          actionText={
            isMultipleChecked
              ? "delete this organizations ?"
              : "delete this organization ?"
          }
          onHide={() => setDeleteOrgModalShow(false)}
          onAction={isMultipleChecked ? deleteMultiOrg : deleteOrg}
        />
      ) : (
        ""
      )}
      {blockOrgModalShow ? (
        <ConfirmationModal
          show={blockOrgModalShow}
          btnClassName="btn-danger"
          actionButton="Block"
          actionText={
            isMultipleChecked ? (
              <>
                block these organizations ?<br />
                <span style={{ color: "red" }}>
                  *The selection is disabled for organization with 'Inactive'
                  status
                </span>
              </>
            ) : (
              "block this organization ?"
            )
          }
          onHide={hideBlockModal}
          onAction={isMultipleChecked ? blockMultipleOrg : blockOrg}
        />
      ) : (
        ""
      )}

      {unblockOrgModalShow ? (
        <ConfirmationModal
          show={unblockOrgModalShow}
          btnClassName="custom-btn-modal"
          actionButton="Unblock"
          actionText={
            isMultipleChecked ? (
              <>
                unblock these organizations ?<br />
                <span style={{ color: "red" }}>
                  *The selection is disabled for organization with 'Active'
                  status
                </span>
              </>
            ) : (
              "unblock this organization ?"
            )
          }
          onHide={hideUnblockModal}
          onAction={isMultipleChecked ? unblockMultiOrg : unblockOrg}
        />
      ) : (
        ""
      )}

      {sendMessageModalShow && (
        <SendMessageContactsModal
          contacts={selectedRows}
          show={sendMessageModalShow}
          clearSelections={clearSelections}
          onHide={() => setSendMessageModalShow(false)}
        />
      )}

      <div id="main" className="platform-admin-main">
        <DashboardHeaderComponent headerText="Organizations" />
        <div className="bread-crumb">
          <NavLink
            to="/portal/admin/admin_dashboard"
            className="smallText text-decoration-none text-uppercase navlink"
          >
            ADMIN DASHBOARD{" "}
          </NavLink>
          <NavLink
            to=""
            className="smallText text-decoration-none text-uppercase navlink navlink-active"
          >
            {">"} ORGANIZATIONS
          </NavLink>
        </div>
        <InformationTrayComponent trayInformation={informationTrayList} />
        <div className="d-flex col-11"></div>

        <div className="col-11">
          <div className="d-flex my-4">
            <input
              onChange={onOptimisedHandleChange}
              className="learners-searchbox py-2 mt-3"
              id="search-input"
              type="search"
              name="search"
              placeholder="Search by name"
            />
            <div className=" ml-auto">
              {/* <p className="subText">
              There are <span className="text-success">{activeOrgCount}</span>{" "}
              active organizations and{" "}
              <span className="text-danger">{inactiveOrgCount}</span> inactive
              organizations
            </p> */}
              <button
                className="add-btn-2 mt-2 text-uppercase"
                onClick={addOrg}
              >
                <span className="material-icons mr-2 plus-icon">add</span>Add
                Organization
              </button>
            </div>
          </div>
          <div className="">

            <div>
              {isMultipleChecked ? (
                <>
                  {
                    isSuspend ? (
                      <button
                        className="learner-default-btn mr-2 mb-2 text-uppercase"
                        onClick={unblockClick}
                      >
                        <span className="material-icons ml-2 mr-2 unblock-icon list-fun-btns">
                          lock_open
                        </span>
                        Activate Organizations
                      </button>
                    ) : (
                      ""
                    )}
                  {isUnsuspend ? (
                    <button
                      className="learner-default-btn mr-2 mb-2 text-uppercase"
                      onClick={blockClick}
                    >
                      <span className="material-icons-outlined align-bottom mr-2 block-icon list-fun-btns">
                        lock
                      </span>
                      Deactivate Organizations
                    </button>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => setDeleteOrgModalShow(true)}
                    className="learner-default-btn mr-2 mb-2 text-uppercase"
                  >
                    <i className="fa-regular fa-trash-can mr-2 list-fun-btns">
                    </i>
                    Delete Organizations
                  </button>

                </>

              ) : (
                "")}

              {(selectedRows?.length > 0 && userState.messageSendMessage) ? (
                <button
                  className="learner-default-btn mr-2 mb-2 "
                  onClick={sendMessageContacts}
                >
                  <span className="material-icons mr-2 unblock-icon list-fun-btns">
                    mail_outline
                  </span>
                  MESSAGE ORGANIZATIONS
                </button>
              ) : (
                ""
              )}

            </div>





          </div>
          <div className="text-primary mt-3 mb-5">
            <DataTable
              columns={columns}
              data={filters}
              selectableRows
              onSelectedRowsChange={rowSelectCritera}
              paginationTotalRows={filters ? filters.length : 0}
              paginationComponentOptions={paginationComponentOptions}
              pagination={true}
              paginationComponent={CustomPag}
              sortFunction={customSort}
              // selectableRowsComponent={Checkbox}
              // selectableRowsNoSelectAll={selectedRows.length > 0 ? false : true}
              persistTableHead
              highlightOnHover
              clearSelectedRows={toggledClearRows}
              theme="solarized"
              customStyles={customStyles}
              // selectableRowsHighlight
              selectableRowsVisibleOnly
              conditionalRowStyles={conditionalRowStyles}
              selectableRowsComponent={DataTableCustomCheckbox}
              selectableRowDisabled={
                blockOrgModalShow
                  ? rowDisabledInactiveCriteria
                  : unblockOrgModalShow
                    ? rowDisabledActiveCriteria
                    : sendMessageModalShow
                      ? rowDisabledMessageCriteria
                      : ""
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalAdminLayOut(AdminOrganizationContainer);
