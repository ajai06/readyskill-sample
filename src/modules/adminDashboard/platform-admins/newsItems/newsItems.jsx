import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";

//api
import {
  copyNewsItem,
  getAllNewsItems,
  deleteNews,
  publishNews,
} from "../../../../services/adminServices";

import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";

import { useIsMounted } from "../../../../utils/useIsMounted";

import "../platformAdmin.scss";
import DataTableCustomPagination from "../../../../sharedComponents/dataTableCustomPagination/dataTableCustomPagination";
import DataTableCustomCheckbox from '../../../../sharedComponents/dataTableCustomCheckbox/dataTableCustomCheckbox'
import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import { dateTimeFormatter } from "../../../../utils/contants";
import AddGroupModal from "./addGroupModal";
import { getGroups } from "../../../../services/adminServices";

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
};

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

function NewsItems() {
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const [newsItems, setNewsItems] = useState([]);
  const [selectedNewsItems, setSelectedNewsItems] = useState([]);

  const [isMultipleChecked, setIsMultipleChecked] = useState(false);
  const [isPublishButton, setIsPublishButton] = useState(true);
  const [isDraftButton, setDraftButton] = useState(true);

  const [publishModalShow, setPublishModalShow] = useState(false);
  const [draftModalShow, setDraftModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [copyModalShow, setCopyModalShow] = useState(false);
  const [copyData, setCopyData] = useState();
  const [deleteNewsData, setDeleteNewsData] = useState();
  const [addGroupModalShow, setAddGroupModalShow] = useState(false);
  const [groupsList, setGroupsList] = useState([]);

  const userState = UserAuthState();
  const toast = useToastDispatch();

  useEffect(() => {
    if (isMounted()) {
      getAllNewsItemsList();
    }
  }, []);

  const getAllNewsItemsList = () => {
    getAllNewsItems()
      .then((res) => {
        // console.log(res)
        setNewsItems(res.data.$values);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const routing = () => {
    navigate("/portal/admin/newsItemsEditor");
  };

  //Publish/Unpublish only if multiple checked
  const handleChange = ({ selectedRows }) => {
    selectedRows?.length > 1
      ? setIsMultipleChecked(true)
      : setIsMultipleChecked(false);
    if (selectedRows?.length > 1) {
      selectedRows.find((obj) => obj.status === "Published")
        ? setDraftButton(true)
        : setDraftButton(false);
      selectedRows.find((obj) => obj.status === "Draft")
        ? setIsPublishButton(true)
        : setIsPublishButton(false);
    }
    setSelectedNewsItems(selectedRows);
  };

  //disabled rows per page dropdown in pagination
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  //data table conditional style for published assessment
  const conditionalRowStyles = [
    {
      when: (row) => row.status === "Expired",
      style: {
        backgroundColor: "rgba(231 34 99 / 8% )",
      },
    },
    {
      when: (row) => selectedNewsItems.find((obj) => obj.id === row.id),
      style: {
        backgroundColor: "#3e3c7a",
        color: "#fff",
      },
    },
  ];
  //---------- Row disable Criteria
  const rowDisabledCriteriaPublish = (row) =>
    (row.status === "Published" || row.status === "Expired") &&
    publishModalShow;
  const rowDisabledCriteriaDraft = (row) =>
    (row.status === "Draft" || row.status === "Expired") && draftModalShow;

  //clear selected rows after actions
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
    setIsPublishButton(false);
    setDraftButton(false);
    setIsMultipleChecked(false);
  };

  const [groupModalType, setGroupModalType] = useState();
  const addRemoveGroupModal = (type) => {
    setGroupModalType(type);
    setAddGroupModalShow(true);
  };

  const removeSelectedRows = () => {
    setSelectedNewsItems([]);
    // setIsMultipleChecked(true);
  };

  useEffect(() => {
    getGroups(userState.user?.organization.organizationId)
      .then((res) => {
        if (isMounted() && res) {
          setGroupsList(res.data);
        }
      })
      .catch((err) => {
        console.log(err?.response);
      });
  }, []);

  const groupNameFromId = (id) => {
    return groupsList.find((group) => group.id === id)?.groupName;
  };

  //columns defenitions
  const columns = [
    {
      name: "Headline",
      selector: (row) => `${row.title}`,
      sortable: true,
    },
    {
      name: "Target Groups",
      selector: (row) =>
        `${groupNameFromId(row.newsGroupMapping.$values?.[0]?.groupId)}`,
      sortable: true,
      cell: (row) => (
        <div className="d-block">
          {row.newsGroupMapping.$values.length > 0 ? row.newsGroupMapping.$values.map((group, i) => {
            return (
              <p className="mb-1" key={i}>
                {groupNameFromId(group.groupId)}
              </p>
            );
          }) : <div>N/A</div>}{" "}
        </div>
      ),
    },
    // {
    //   name: "Start Date",
    //   selector: (row) =>
    //     row.eventStartDate
    //       ? dateTimeFormatter(row.eventStartDate)?.toLocaleString("en-US", {
    //         month: "2-digit", // numeric, 2-digit, long, short, narrow
    //         day: "2-digit", // numeric, 2-digit
    //         year: "numeric", // numeric, 2-digit
    //       })
    //       : "N/A",
    //   sortable: true,
    // },
    // {
    //   name: "End Date",
    //   selector: (row) =>
    //     row.eventEndDate
    //       ? dateTimeFormatter(row.eventEndDate)?.toLocaleString("en-US", {
    //         month: "2-digit", // numeric, 2-digit, long, short, narrow
    //         day: "2-digit", // numeric, 2-digit
    //         year: "numeric", // numeric, 2-digit
    //       })
    //       : "N/A",
    //   sortable: true,
    // },
    {
      name: "Published Dates",
      selector : (row) => row.eventStartDate,
      cell: (row) => (
        <>
          <span> from { row.eventStartDate ?  dateTimeFormatter(row.eventStartDate)?.toLocaleString("en-US", {
            month: "2-digit", // numeric, 2-digit, long, short, narrow
            day: "2-digit", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
          }) : "N/A" } to { row.eventEndDate ? dateTimeFormatter(row.eventEndDate)?.toLocaleString("en-US", {
            month: "2-digit", // numeric, 2-digit, long, short, narrow
            day: "2-digit", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
          }) : "N/A"}</span>
        </>
      ),
      sortable: true,
    },
    {
      name: "Event Date",
      selector: (row) =>
        row.eventDate
          ? dateTimeFormatter(row.eventDate)?.toLocaleString("en-US", {
            month: "2-digit", // numeric, 2-digit, long, short, narrow
            day: "2-digit", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
          })
          : "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => `${row.status}`,
      sortable: true,
    },
    {
      button: true,
      cell: (row) => (
        <span className="list-btns d-flex ml-auto">
          <i className={"fa-regular fa-pen-to-square edit-icon cursor-pointer learner-control-icons mr-3 ml--12 custom-tooltip " +
            (isMultipleChecked && "opacity-50")
          }
            onClick={() => navigate(`/portal/admin/editNewsItem/${row.id}`)}
          >
            <span className='tooltiptext'>Edit</span>
          </i>

          <span
            className={
              "material-icons list-fun-btns cursor-pointer unblock-icon mr-3 custom-tooltip " +
              (isMultipleChecked && "opacity-50")
            }
            onClick={() => {
              setCopyData(row);
              setCopyModalShow(true);
            }}
          >
            <span className='tooltiptext'>Copy</span>
            content_copy
          </span>
          <i
            className={
              "fa-regular fa-trash-can list-fun-btns delete-btn cursor-pointer mr-3 custom-tooltip " +
              (isMultipleChecked && "opacity-50")
            }
            onClick={() => deleteNewsItem(row)}
          >
            <span className='tooltiptext'>Delete</span>
          </i>
        </span>
      ),
    },
  ];

  const copyNewsItemsData = () => {
    let params = {
      postUserId: userState.user.id,
      newsIds: [],
    };
    if (copyData) {
      params["newsIds"].push(copyData.id);
    } else {
      selectedNewsItems.forEach((element) => {
        params["newsIds"].push(element.id);
      });
    }
    copyNewsItem(params)
      .then((res) => {
        if (res) {
          if (isMounted()) {
            toast({
              type: "success",
              text: "News item(s) copied successfully",
            });
            handleClearRows();
            removeSelectedRows();
            getAllNewsItemsList();
            setCopyModalShow(false);
            setCopyData();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  //delete News
  const deleteNewsItem = (row) => {
    setDeleteNewsData(row);
    setDeleteModalShow(true);
  };

  const deleteNewsDataItem = () => {
    let params = {
      postUserId: userState.user.id,
      newsIds: [],
    };
    if (deleteNewsData) {
      params["newsIds"].push(deleteNewsData.id);
    } else {
      selectedNewsItems.forEach((element) => {
        params["newsIds"].push(element.id);
      });
    }
    deleteNews(params)
      .then((res) => {
        if (res) {
          if (isMounted()) {
            toast({
              type: "success",
              text: "News item(s) deleted successfully",
            });
            setDeleteNewsData("");
            getAllNewsItemsList();
            setDeleteModalShow(false);
            handleClearRows();
            removeSelectedRows();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  //Publish/Unpublish News Item Action
  const publishNewsItem = (data) => {
    let params = {
      postUserId: userState.user.id,
      newsIds: [],
      isPublished: data === "publish" ? true : false,
    };
    setDraftModalShow(false);
    setPublishModalShow(false);
    if (selectedNewsItems) {
      selectedNewsItems.forEach((element) => {
        params["newsIds"].push(element.id);
      });
    }
    publishNews(params)
      .then((res) => {
        if (res) {
          if (res.status === 204) {
            if (isMounted()) {
              toast({
                type: "success",
                text: `News item(s) ${data === "publish" ? "published" : "drafted"
                  } successfully`,
              });
              handleClearRows();
              removeSelectedRows();
              getAllNewsItemsList();
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <ConfirmationModal
        show={publishModalShow}
        actionText={
          isMultipleChecked
            ? "publish these news items?"
            : "publish this news item?"
        }
        actionButton="Publish"
        btnClassName="custom-btn-modal"
        onHide={() => setPublishModalShow(false)}
        onAction={() => publishNewsItem("publish")}
      />
      <ConfirmationModal
        show={draftModalShow}
        actionText={
          isMultipleChecked
            ? "draft these news items?"
            : "draft this news item?"
        }
        actionButton="Draft"
        btnClassName="custom-btn-modal"
        onHide={() => setDraftModalShow(false)}
        onAction={() => publishNewsItem("draft")}
      />
      <ConfirmationModal
        show={copyModalShow}
        actionText={"make a copy?"}
        actionButton="Copy"
        btnClassName="custom-btn-modal"
        onHide={() => setCopyModalShow(false)}
        onAction={() => copyNewsItemsData()}
      />
      <ConfirmationModal
        show={deleteModalShow}
        actionText={
          isMultipleChecked
            ? "delete these news items?"
            : "delete this news item?"
        }
        actionButton="Delete"
        btnClassName="btn-danger"
        onHide={() => setDeleteModalShow(false)}
        onAction={() => deleteNewsDataItem()}
      />
      {addGroupModalShow && (
        <AddGroupModal
          show={addGroupModalShow}
          onHide={() => setAddGroupModalShow(false)}
          clearRows={handleClearRows}
          newsList={selectedNewsItems}
          modalType={groupModalType}
          selectedRows={removeSelectedRows}
          getAllNewsItemsList={getAllNewsItemsList}
        />
      )}

      <div id="main" className="news-items-main">
        <DashboardHeaderComponent headerText="ReadySkill Administrator" />
        <div className="bread-crumb-assesment">
          <NavLink
            to="/portal/admin/platform_admins"
            className="smallText text-uppercase text-decoration-none navlink"
          >
            READYSKILL ADMINISTRATOR{" "}
          </NavLink>
          <a className="smallText text-uppercase navlink-assesment text-decoration-none">
            {" "}
            {">"} News item Management
          </a>
        </div>
        <div className="container-fluid">
          <h1 className="h5 headText mt-5 d-flex mb-3">
            <span className="material-icons mt-02 mr-2">
              feed
            </span>
            News Item Management
          </h1>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-5 pr-2">
              <div className="d-flex col-12 mb-4 px-0">
                <div className="mt-3">
                  {isMultipleChecked && (
                    <>
                      {isPublishButton && (
                        <button
                          className="default-multi-btn ml-0 mr-2 mb-2 text-uppercase"
                          onClick={() => setPublishModalShow(true)}
                        >
                          <span className="material-icons mr-2 unblock-icon list-fun-btns">
                            visibility
                          </span>
                          PUBLISH
                        </button>
                      )}
                      {isDraftButton && (
                        <button
                          className="default-multi-btn mr-2 mb-2 text-uppercase"
                          onClick={() => setDraftModalShow(true)}
                        >
                          <span className="material-icons mr-2 unblock-icon list-fun-btns">
                            drafts
                          </span>
                          DRAFT ITEMS
                        </button>
                      )}
                      <button
                        className="default-multi-btn mr-2 mb-2 "
                        onClick={() => addRemoveGroupModal("add")}
                      >
                        <span className="material-icons mr-2 unblock-icon list-fun-btns">
                          checklist_rtl
                        </span>
                        ASSIGN GROUPS
                      </button>
                      <button
                        className="default-multi-btn mr-2 mb-2 "
                        onClick={() => addRemoveGroupModal("remove")}
                      >
                        <span className="material-icons mr-2 unblock-icon list-fun-btns">
                          group_remove
                        </span>
                        REMOVE GROUPS
                      </button>
                      <button
                        className="default-multi-btn mr-2 mb-2 "
                        onClick={() => setCopyModalShow(true)}
                      >
                        <span className="material-icons mr-2 unblock-icon list-fun-btns">
                          content_copy
                        </span>
                        COPY
                      </button>
                      <button
                        className="default-multi-btn mr-2 mb-2 "
                        onClick={() => setDeleteModalShow(true)}
                      >
                        <i className="fa-regular fa-trash-can mr-2  list-fun-btns">
                        </i>
                        DELETE
                      </button>
                    </>
                  )}
                </div>
                <div className=" ml-auto">
                  <button className="add-btn-2 mt-2 text-uppercase" onClick={() => routing()}>
                    <span className="material-icons mr-2 plus-icon">add</span>Add News Item
                  </button>
                </div>
              </div>
              {/* <div className="card shadow group-manage-card pt-3"> */}
              <div className="news-items-list">
              <DataTable
                columns={columns}
                // sortFunction={customSort}
                data={newsItems}
                pagination
                paginationComponent={DataTableCustomPagination}
                paginationComponentOptions={paginationComponentOptions}
                highlightOnHover
                customStyles={customStyles}
                theme="solarized"
                selectableRows
                persistTableHead
                onSelectedRowsChange={handleChange}
                clearSelectedRows={toggledClearRows}
                conditionalRowStyles={conditionalRowStyles}
                selectableRowsComponent={DataTableCustomCheckbox}
                selectableRowDisabled={
                  publishModalShow
                    ? rowDisabledCriteriaPublish
                    : draftModalShow
                      ? rowDisabledCriteriaDraft
                      : ""
                }
              />
              </div> 
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalAdminLayOut(NewsItems);
