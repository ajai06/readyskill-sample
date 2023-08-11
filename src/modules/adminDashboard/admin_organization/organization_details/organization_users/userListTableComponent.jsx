import React, { useEffect, useRef, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";

import {
  suspendUser,
  unSuspendUser,
  deleteUser,
  resetPasswordUser,
  suspendMultipleUser,
  deleteMultipleUser,
  unSuspendMultipleUser,
} from "../../../../../services/learnersServices";

import { setExternalLoginTypeMapping } from "../../../../../services/organizationServices";
import { UserAuthState } from "../../../../../context/user/userContext";
import { useToastDispatch } from "../../../../../context/toast/toastContext";

import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";
import UserInfo from "./userInfo";
import { useForm } from "react-hook-form";
import EditUserModel from "./editUserModel";
import "../../../admindashboard.scss";
import AddGroupModal from "./addGroupModal";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import DataTableCustomPagination from "../../../../../sharedComponents/dataTableCustomPagination/dataTableCustomPagination";

import {
  clearAlert,
  ReadySkillRepresentative,
} from "../../../../../utils/contants";

import DataTableCustomCheckbox from "../../../../../sharedComponents/dataTableCustomCheckbox/dataTableCustomCheckbox";
import addGroup from "../../../../../assets/img/icons/add-group.png";
import removeGroup from "../../../../../assets/img/icons/remove-group.png";
import { useSignalRDispatch } from "../../../../../context/signalR/signalR";

function UserListComponent({
  organizationDetails,
  userList,
  getAllUsersList,
  orgId,
  expandRow,
}) {
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const signalR = useSignalRDispatch();

  const [actionOptionsMultiple, setActionOptionsMultiple] = useState(true);
  const [selectedUsersList, setSelectedUsersList] = useState([]);
  const [showLearnersList, setshowLearnersList] = useState([]);

  const [userInfo, setUserInfo] = useState(undefined);
  const [learnerObject, setLearnerObject] = useState({});

  const [suspendModalShow, setSuspendModalShow] = React.useState(false);
  const [unSuspendModalShow, setUnSuspendModalShow] = React.useState(false);
  const [resetPasswordModalShow, setResetPasswordModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [addGroupModalShow, setAddGroupModalShow] = useState(false);
  const [isUserEdit, setUserEdit] = useState(undefined);
  const [isSuspend, setIsSuspend] = useState(true);
  const [isUnsuspend, setIsunsuspend] = useState(true);
  const [isReset, setIsReset] = useState(true);
  const isMounted = useIsMounted();

  //hubconnection starting if not
  useEffect(() => {
    if (!signalR.hubConnection) {
      signalR.startHubConnectionHandler(userState.user.id);
    }
  });

  useEffect(() => {
    if (userInfo) {
      setUserInfo(userList.find((user) => user.id === userInfo.id));
    }
    setshowLearnersList(userList);
  }, [userList]);

  useEffect(() => {
    expandRowData();
  }, [expandRow]);

  //suspend orgnization single user
  const suspendOrganizationSingleUser = (data) => {
    let params = {
      id: userState.user.id,
      userId: data.id,
      isSuspended: true,
    };
    setSuspendModalShow(false);
    suspendUser(params)
      .then((res) => {
        if (res.status === 200 && isMounted()) {
          toast({ type: "success", text: res.data.message });
          signalR.hubConnection.send("UpdateUserSettingsForPortal", "Block", [
            params.userId,
          ]);
          getAllUsersList();
        } else {
          toast({ type: "warning", text: res.data.message });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message) {
          toast({ type: "warning", text: err.response.data.message });
        } else {
          toast({ type: "error", text: err.response.statusText });
        }
      });
  };

  //unsuspend orgnization single user
  const unSuspendSingleUser = (data) => {
    let params = {
      id: userState.user.id,
      userId: data.id,
      isSuspended: false,
    };
    setUnSuspendModalShow(false);
    unSuspendUser(params)
      .then((res) => {
        if (res.status === 200 && isMounted()) {
          toast({ type: "success", text: res.data.message });
          signalR.hubConnection.send("UpdateUserSettingsForPortal", "Unblock", [
            params.userId,
          ]);
          getAllUsersList();
          // setPreviousRowIndex()
        } else {
          toast({ type: "warning", text: res.data.message });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message) {
          toast({ type: "warning", text: err.response.data.message });
        } else {
          toast({ type: "error", text: err.response.statusText });
        }
      });
  };

  //suspend multiple learners
  const suspendOrganizationMultipleUser = () => {
    let params = {
      id: userState.user.id,
      applicationUserIds: [],
    };
    selectedUsersList.forEach((element) => {
      params["applicationUserIds"].push(element.id);
    });
    setSuspendModalShow(false);
    suspendMultipleUser(params)
      .then((res) => {
        if (res.status === 200 && isMounted()) {
          toast({ type: "success", text: res.data.message });
          signalR.hubConnection.send(
            "UpdateUserSettingsForPortal",
            "Block",
            params.applicationUserIds
          );
          setActionOptionsMultiple(true);
          setSelectedUsersList([]);
          getAllUsersList();
          handleClearRows();
          setPreviousRowIndex();
          // setPreviousRowIndex()
        } else {
          toast({ type: "warning", text: res.data.message });
          setPreviousRowIndex();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message) {
          toast({ type: "warning", text: err.response.data.message });
        } else {
          toast({ type: "error", text: err.response.statusText });
        }
      });
  };

  //unsuspend multiple learners
  const unSuspendOrganizationMultipleUser = () => {
    let params = {
      id: userState.user.id,
      applicationUserIds: [],
    };
    selectedUsersList.forEach((element) => {
      params["applicationUserIds"].push(element.id);
    });
    setUnSuspendModalShow(false);
    unSuspendMultipleUser(params)
      .then((res) => {
        if (res.status === 200 && isMounted()) {
          toast({ type: "success", text: res.data.message });
          signalR.hubConnection.send(
            "UpdateUserSettingsForPortal",
            "Unblock",
            params.applicationUserIds
          );
          setActionOptionsMultiple(true);
          setSelectedUsersList([]);
          getAllUsersList();
          setIsSuspend(true);
          handleClearRows();
          setPreviousRowIndex();
        } else {
          toast({ type: "warning", text: res.data.message });
          setPreviousRowIndex();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message) {
          toast({ type: "warning", text: err.response.data.message });
        } else {
          toast({ type: "error", text: err.response.statusText });
        }
      });
  };

  //reset password single user
  const sendResetPasswordSingleUser = (data) => {
    let params = {
      id: userState.user.id,
      applicationUserIds: [],
    };
    setResetPasswordModalShow(false);
    params["applicationUserIds"].push(data.id);
    resetPasswordUser(params)
      .then((res) => {
        if (isMounted()) {
          toast({ type: "success", text: res.data.message });
        }
      })
      .catch((err) => {
        console.log(err.response);
        toast({ type: "warning", text: err.response.data.message });
      });
  };

  //password reset for mutiple user
  const sendResetPasswordMultipleUser = () => {
    let params = {
      id: userState.user.id,
      applicationUserIds: [],
    };
    let nonFederatedUsers = [];
    nonFederatedUsers = selectedUsersList.filter((obj) =>
      obj.loginMethods.find((d) => d === "Local")
    );
    if (nonFederatedUsers) {
      nonFederatedUsers.forEach((element) => {
        params["applicationUserIds"].push(element.id);
      });
      setResetPasswordModalShow(false);
      resetPasswordUser(params)
        .then((res) => {
          if (isMounted()) {
            toast({ type: "success", text: res.data.message });
            setActionOptionsMultiple(true);
            setSelectedUsersList([]);
            handleClearRows();
            setPreviousRowIndex();
          }
        })
        .catch((err) => {
          console.log(err.response);
          setPreviousRowIndex();
          toast({ type: "warning", text: err.response.data.message });
        });
    } else {
    }
  };

  //delete single learner
  const deleteSingleUSer = (data) => {
    let params = {
      id: userState.user.id,
      deletedId: data.id,
    };
    setDeleteModalShow(false);
    deleteUser(params)
      .then((res) => {
        if (res.data.isSuccess && isMounted()) {
          toast({ type: "success", text: res.data.message });
          signalR.hubConnection.send("UpdateUserSettingsForPortal", "Delete", [
            params.deletedId,
          ]);
          getAllUsersList();
          setPreviousRowIndex();
        } else {
          toast({ type: "warning", text: res.data.message });
        }
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data.message) {
          toast({ type: "warning", text: err.response.data.message });
        } else {
          toast({ type: "error", text: err.response.statusText });
        }
      });
  };

  //delete multiple learners
  const deleteOrganizationMultipleUSer = () => {
    let params = {
      id: userState.user.id,
      applicationUserIds: [],
    };
    selectedUsersList.forEach((element) => {
      params["applicationUserIds"].push(element.id);
    });
    setDeleteModalShow(false);
    deleteMultipleUser(params)
      .then((res) => {
        if (res.data.isSuccess && isMounted()) {
          toast({ type: "success", text: res.data.message });
          signalR.hubConnection.send(
            "UpdateUserSettingsForPortal",
            "Delete",
            params.applicationUserIds
          );
          setActionOptionsMultiple(true);
          setSelectedUsersList([]);
          getAllUsersList();
          handleClearRows();
          setPreviousRowIndex();
        } else {
          toast({ type: "warning", text: res.data.message });
        }
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data.message) {
          toast({ type: "warning", text: err.response.data.message });
        } else {
          toast({ type: "error", text: err.response.statusText });
        }
      });
  };
  //confirmation modal show logics
  const userObjectHandler = (data, type) => {
    setLearnerObject(data);
    if (type === "suspend") {
      setSuspendModalShow(true);
    } else if (type === "unsuspend") {
      setUnSuspendModalShow(true);
    } else if (type === "reset") {
      setResetPasswordModalShow(true);
    } else if (type === "delete") {
      setDeleteModalShow(true);
    }
  };

  const [groupModalType, setGroupModalType] = useState();
  const addRemoveGroupModal = (type) => {
    setGroupModalType(type);
    setAddGroupModalShow(true);
  };

  const setLoginValues = (params, bool) => {
    let data = {
      applicationUserId: userInfo.id,
      externalLoginTypeId: params.externalLoginTypeId,
      isActive: bool,
      externalLoginTypeName: params.externalLoginType.typeName,
    };
    setExternalLoginTypeMapping(data)
      .then((res) => {
        if (isMounted()) {
          getAllUsersList();
        }
        toast({
          type: "success",
          text: `Login method changes updated successfully`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [userModalShow, setUserModalShow] = useState(false);

  // setting user data
  const patchUserData = (row) => {
    if (isMounted()) {
      let userDetails = userList.find((user) => user.id === row.id);
      if (userDetails) {
        setUserInfo(userDetails);
        setUserModalShow(true);
      }
    }
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

  //selected row added to varable and action button/icon visibility
  const handleChange = ({ selectedRows }) => {
    // console.log(selectedRows)
    selectedRows?.length > 1
      ? setActionOptionsMultiple(false)
      : setActionOptionsMultiple(true);
    setSelectedUsersList(selectedRows);
    if (selectedRows?.length > 1) {
      // setPreviousRowIndex()

      if (previousRowIndex !== undefined) {
        userList[previousRowIndex].defaultExpanded = false;
      }
      selectedRows.find((obj) => obj.isSuspended)
        ? setIsunsuspend(false)
        : setIsunsuspend(true);
      selectedRows.find((obj) => !obj.isSuspended)
        ? setIsSuspend(true)
        : setIsSuspend(false);
      selectedRows.find((obj) => !obj.isSuspended)
        ? setIsReset(true)
        : setIsReset(false);
    }
  };

  //date formatter for local time
  const dateTimeFormatter = (data) => {
    if (data) {
      return new Date(
        new Date(data).getTime() -
        new Date(data).getTimezoneOffset() * 60 * 1000
      );
    }
  };
  //clear selected rows after actions
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  //search learner parent comp API call
  const searchLearner = (event) => {
    // searchLearnerHandler(event.target.value);
    setshowLearnersList(
      userList.filter(
        (item) =>
          (item.firstName.toLowerCase() + item.lastName.toLowerCase())?.indexOf(
            event.target.value.toLowerCase()
          ) !== -1
      )
    );
  };
  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const onOptimisedHandleChange = debounce(searchLearner, 500);

  //columns defenitions
  const columns = [
    {
      name: "LAST NAME",
      selector: (row) => `${row.lastName}`,
      sortable: true,
    },
    {
      name: "FIRST NAME",
      selector: (row) => `${row.firstName}`,
      sortable: true,
    },
    {
      name: "USERNAME",
      selector: (row) => `${row.userName}`,
      sortable: true,
    },
    {
      name: "TYPE",
      selector: (row) => `${row.userRoles}`,
      sortable: true,
    },
    {
      name: "LAST LOGIN",
      selector: (row) =>
        row.lastLoginDate
          ? dateTimeFormatter(row.lastLoginDate)
            ?.toLocaleString("en-US", {
              hour12: true,
              month: "2-digit", // numeric, 2-digit, long, short, narrow
              day: "2-digit", // numeric, 2-digit
              year: "numeric", // numeric, 2-digit
              hour: "2-digit", // numeric, 2-digit
              minute: "2-digit", // numeric, 2-digit
              second: "2-digit", // numeric, 2-digit
            })
            .replace(/,/g, "")
          : "N/A",
      sortable: true,
    },

    {
      name: "",
      button: true,
      // width: "10%",
      cell: (row) => (
        <div className="list-btns d-flex m--10">
          {row.isSuspended && (
            <span
              className={
                actionOptionsMultiple &&
                  row.id !== userState.user.id &&
                  row.id !== ReadySkillRepresentative.RepresentativeId
                  ? "material-icons-outlined block-icon mr-2 mt-0 custom-tooltip "
                  : "material-icons-outlined block-icon mr-2 mt-0 opacity-50 custom-tooltip "
              }
              onClick={
                actionOptionsMultiple
                  ? () => userObjectHandler(row, "unsuspend")
                  : undefined
              }
            >
              <span className="tooltiptext">Unblock</span>
              lock
            </span>
          )}
          {!row.isSuspended && (
            <span
              className={
                actionOptionsMultiple &&
                  row.id !== userState.user.id &&
                  row.id !== ReadySkillRepresentative.RepresentativeId &&
                  userState.blockSignin
                  ? "material-icons mr-2 unblock-icon custom-tooltip "
                  : "material-icons mr-2  unblock-icon opacity-50 custom-tooltip "
              }
              onClick={
                actionOptionsMultiple
                  ? () => userObjectHandler(row, "suspend")
                  : undefined
              }
            >
              <span className="tooltiptext">Block</span>
              lock_open
            </span>
          )}
          <span
            className={
              actionOptionsMultiple &&
                row.id !== userState.user.id &&
                row.id !== ReadySkillRepresentative.RepresentativeId &&
                userState.resetPassword &&
                row.userExternalLoginMapping.find(
                  (method) =>
                    method.externalLoginType.typeName === "Local" &&
                    method.isActive
                ) &&
                !row.isSuspended
                ? "material-icons renew-icon list-fun-btns mr-2 custom-tooltip"
                : "material-icons renew-icon list-fun-btns mr-2 opacity-50 custom-tooltip"
            }
            onClick={
              actionOptionsMultiple && row.id !== ReadySkillRepresentative.RepresentativeId &&
                row.userExternalLoginMapping.find((method) => method.externalLoginType.typeName === "Local" && method.isActive) &&
                !row.isSuspended
                ? () => userObjectHandler(row, "reset")
                : undefined
            }
          >
            <span className="tooltiptext">Reset Password</span>
            autorenew
          </span>

          <i
            className={
              actionOptionsMultiple &&
                row.id !== userState.user.id &&
                row.id !== ReadySkillRepresentative.RepresentativeId &&
                userState.userDelete
                ? "fa-regular fa-trash-can list-fun-btns delete-btn mr-0 edit-learner-icon custom-tooltip"
                : "fa-regular fa-trash-can list-fun-btns delete-btn mr-0 edit-learner-icon opacity-50 custom-tooltip"
            }
            onClick={
              actionOptionsMultiple
                ? () => userObjectHandler(row, "delete")
                : undefined
            }
          >
            <span className="tooltiptext">Delete</span>
          </i>
        </div>
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
    rows: {
      style: {
        color: "#fff",
        cursor: "default !important",
      },
    },
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.isSuspended,
      style: {
        backgroundColor: "rgba(231 34 99 / 8% )",
      },
    },
    {
      when: (row) => row.id === userInfo?.id,
      style: {
        backgroundColor: "rgb(83, 81, 130)",
        color: "rgb(255, 255, 255)",
      },
    },
    {
      when: (row) => selectedUsersList.find((user) => user.id === row.id),
      style: {
        backgroundColor: "rgb(83, 81, 130)",
        color: "rgb(255, 255, 255)",
      },
    },
  ];
  //disabled rows per page dropdown in pagination
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };
  const rowDisabledCriteria = (row) =>
    row.userExternalLoginMapping.find(
      (method) =>
        method.externalLoginType.typeName === "Local" && !method.isActive
    ) || row.isSuspended;
  const rowDisabledCriteriaLoggedInUser = (row) =>
    row.id === userState.user.id ||
    row.id === ReadySkillRepresentative.RepresentativeId;
  const rowDisabledCriteriaBlock = (row) => row.isSuspended && suspendModalShow;
  const rowDisabledCriteriaUnBlock = (row) =>
    !row.isSuspended && unSuspendModalShow;

  const removeSelectedRows = () => {
    setSelectedUsersList([]);
    setActionOptionsMultiple(true);
  };
  const hideExpandable = {
    expandableRowsHideExpander: false,
  };

  const setUserInfoData = (row) => {
    setUserInfo(row);
    collapseExpandRowData(row);
  };

  const [previousRowIndex, setPreviousRowIndex] = useState();

  // console.log(previousRowIndex)
  // console.log(actionOptionsMultiple)

  const collapseExpandRowData = (row) => {
    if(!actionOptionsMultiple){
      setPreviousRowIndex();
      return;
    }
    // console.log(row);
    let index_of_row_we_just_clicked = userList.findIndex(
      (stateful_row_data) => {
        return stateful_row_data.id === row.id;
      }
    );
    userList[index_of_row_we_just_clicked].defaultExpanded = true;
    if (previousRowIndex !== undefined) {
      userList[previousRowIndex].defaultExpanded = false;
    }
    if (index_of_row_we_just_clicked !== previousRowIndex) {
      setPreviousRowIndex(index_of_row_we_just_clicked);
    } else {
      setUserInfo(undefined);

      setPreviousRowIndex(undefined);
    }
  };
  const expandRowData = () => {
    // console.log(previousRowIndex)
    if (previousRowIndex !== undefined) {
      userList[previousRowIndex].defaultExpanded = true;
    }
  };

  // data provides access to row data
  const ExpandedComponent = ({ data }) => {
    return (
      <UserInfo
        expandRowData={expandRowData}
        userInfo={data}
        isUserEdit={isUserEdit}
        setUserEdit={setUserEdit}
        organizationDetails={organizationDetails}
        userList={userList}
        getAllUsersList={getAllUsersList}
        userObjectHandler={userObjectHandler}
        setLoginValues={setLoginValues}
      />
    );
  };

  // console.log(actionOptionsMultiple)

  // data provides access to your row data
  return (
    <React.Fragment>
      <div className="d-flex">
        <ConfirmationModal
          show={suspendModalShow}
          actionText={
            !actionOptionsMultiple ? (
              <>
                block these users?
                <br />
                <span style={{ color: "red" }}>
                  *The selection is disabled for user with blocked sign-in
                  status
                </span>
              </>
            ) : (
              "block this user?"
            )
          }
          actionButton="Block"
          btnClassName="btn-danger"
          onHide={() => setSuspendModalShow(false)}
          onAction={() =>
            !actionOptionsMultiple
              ? suspendOrganizationMultipleUser()
              : suspendOrganizationSingleUser(learnerObject)
          }
        />
        <ConfirmationModal
          show={unSuspendModalShow}
          actionText={
            !actionOptionsMultiple ? (
              <>
                unblock these users?
                <br />
                <span style={{ color: "red" }}>
                  *The selection is disabled for user with allowed sign-in
                  status
                </span>
              </>
            ) : (
              "unblock this user?"
            )
          }
          actionButton="Unblock"
          btnClassName="custom-btn-modal"
          onHide={() => setUnSuspendModalShow(false)}
          onAction={() =>
            !actionOptionsMultiple
              ? unSuspendOrganizationMultipleUser()
              : unSuspendSingleUser(learnerObject)
          }
        />
        <ConfirmationModal
          show={deleteModalShow}
          actionText={
            !actionOptionsMultiple
              ? "delete these users?"
              : " delete this user?"
          }
          actionButton="Delete"
          btnClassName="btn-danger"
          onHide={() => setDeleteModalShow(false)}
          onAction={() =>
            !actionOptionsMultiple
              ? deleteOrganizationMultipleUSer()
              : deleteSingleUSer(learnerObject)
          }
        />
        <ConfirmationModal
          show={resetPasswordModalShow}
          actionText={
            !actionOptionsMultiple ? (
              <>
                send reset password mails? <br />
                <span style={{ color: "red" }}>
                  *User with federated logins or suspended users in the
                  selection list will not receive the email.
                </span>
              </>
            ) : (
              "send reset password mail?"
            )
          }
          actionButton="Reset Password"
          btnClassName="custom-btn-modal"
          onHide={() => setResetPasswordModalShow(false)}
          onAction={() =>
            !actionOptionsMultiple
              ? sendResetPasswordMultipleUser()
              : sendResetPasswordSingleUser(learnerObject)
          }
        />
        {addGroupModalShow && (
          <AddGroupModal
            show={addGroupModalShow}
            onHide={() => setAddGroupModalShow(false)}
            clearRows={handleClearRows}
            userList={selectedUsersList}
            modalType={groupModalType}
            getAllUsersList={getAllUsersList}
            selectedRows={() => removeSelectedRows()}
            orgId={orgId}
            setPreviousRowIndex={setPreviousRowIndex}
          />
        )}

        {!actionOptionsMultiple && (
          <div>
            {isSuspend && (
              <button
                className="org-users-btns mr-2 mb-2"
                onClick={() => setSuspendModalShow(true)}
                disabled={userState.blockSignin ? false : true}
              >
                <span className="material-icons-outlined align-bottom mr-2 block-icon list-fun-btns mt-0">
                  lock
                </span>
                Block Sign-In
              </button>
            )}
            {!isUnsuspend && (
              <button
                className="org-users-btns mr-2 mb-2"
                onClick={() => setUnSuspendModalShow(true)}
              >
                <span className="material-icons mr-2 unblock-icon list-fun-btns ">
                  lock_open
                </span>
                Unblock Sign-In
              </button>
            )}
            {isReset && (
              <button
                className="org-users-btns mr-2 mb-2"
                onClick={() => setResetPasswordModalShow(true)}
                disabled={userState.resetPassword ? false : true}
              >
                <span className="material-icons mr-2 renew-icon list-fun-btns">
                  sync
                </span>
                Reset Password
              </button>
            )}
            <button
              className="org-users-btns mr-2 mb-2"
              onClick={() => addRemoveGroupModal("add")}
              disabled={userState.groupEdit ? false : true}
            >
              <img
                src={addGroup}
                className=" mr-2 list-fun-btns unblock-icon"
              />
              Add Group
            </button>
            <button
              className="org-users-btns mr-2 mb-2"
              onClick={() => addRemoveGroupModal("remove")}
              disabled={userState.groupDelete ? false : true}
            >
              <img
                src={removeGroup}
                className=" mr-2 list-fun-btns unblock-icon"
              />
              Remove Group
            </button>
            <button
              className="org-users-btns mr-2 mb-2"
              onClick={() => setDeleteModalShow(true)}
              disabled={userState.userDelete ? false : true}
            >
              <i className="fa-regular fa-trash-can mr-2 list-fun-btns"></i>
              Delete Users
            </button>
          </div>
        )}
        <div className="ml-auto">
          <input
            className="py-2 org-users-search"
            id="search-input"
            type="search"
            name="search"
            placeholder="Search by name"
            onChange={onOptimisedHandleChange}
          />
        </div>
      </div>
      <div className="container-fluid  mt-4 px-0">
        <div
          disabled={userState.identityUserReadonly ? false : true}
          className="row org-list-card user-tab-table ml-0 mb-2"
        >
          <div className="col-12 px-0">
            <DataTable
              columns={columns}
              data={showLearnersList ? showLearnersList : []}
              selectableRows
              pagination
              paginationTotalRows={
                showLearnersList?.length ? showLearnersList.length : 0
              }
              paginationComponentOptions={paginationComponentOptions}
              paginationComponent={DataTableCustomPagination}
              highlightOnHover
              theme="solarized"
              onSelectedRowsChange={handleChange}
              clearSelectedRows={toggledClearRows}
              onRowClicked={setUserInfoData}
              conditionalRowStyles={conditionalRowStyles}
              customStyles={customStyles}
              expandableRows={actionOptionsMultiple ? true : false}
              expandableRowExpanded={(row) => row.defaultExpanded}
              expandableRowsComponent={ExpandedComponent}
              expandableRowsHideExpander={hideExpandable}
              expandOnRowClicked={actionOptionsMultiple ? true : false}
              sortFunction={customSort}
              selectableRowsComponent={DataTableCustomCheckbox}
              // selectableRowDisabled={rowDisabledCriteria}
              // pointerOnHover={false}
              selectableRowDisabled={
                resetPasswordModalShow
                  ? rowDisabledCriteria
                  : suspendModalShow
                    ? rowDisabledCriteriaBlock
                    : unSuspendModalShow
                      ? rowDisabledCriteriaUnBlock
                      : rowDisabledCriteriaLoggedInUser
              }
            />
          </div>
        </div>
      </div>
      {/* {actionOptionsMultiple && userInfo && (
        <UserInfo userInfo={userInfo} userList={userList} getAllUsersList={getAllUsersList} userObjectHandler={userObjectHandler} setLoginValues={setLoginValues}/>
      )} */}
    </React.Fragment>
  );
}

export default UserListComponent;
