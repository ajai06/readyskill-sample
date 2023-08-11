import React, { useEffect, useRef, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";

import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";

import {
  suspendUser,
  unSuspendUser,
  deleteUser,
  resetPasswordUser,
  suspendMultipleUser,
  deleteMultipleUser,
  unSuspendMultipleUser,
} from "../../../../services/learnersServices";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";
import { useIsMounted } from "../../../../utils/useIsMounted";
import CustomPaginationComponent from "../../../../sharedComponents/dataTableCustomPaginationWithAlphabets/customPaginationComponent";
import DataTableCustomCheckbox from "../../../../sharedComponents/dataTableCustomCheckbox/dataTableCustomCheckbox";
import { clearAlert } from "../../../../utils/contants";
import { useSignalRDispatch } from "../../../../context/signalR/signalR";

const ListTableComponent = React.memo(
  ({
    learnersList,
    learnerDetails,
    getAllLearnsrsList,
    learnerSchool,
    organizations,
    getInformationTrayDetails,
  }) => {
    const navigate = useNavigate();
    const userState = UserAuthState();
    const toast = useToastDispatch();
    const signalR = useSignalRDispatch();

    const [selectedUsersList, setSelectedUsersList] = useState([]);
    const [actionOptionsMultiple, setActionOptionsMultiple] = useState(true);
    const [suspendModalShow, setSuspendModalShow] = React.useState(false);
    const [unSuspendModalShow, setUnSuspendModalShow] = React.useState(false);
    const [resetPasswordModalShow, setResetPasswordModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [isSuspend, setIsSuspend] = useState(true);
    const [isUnsuspend, setIsunsuspend] = useState(true);
    const [learnerObject, setLearnerObject] = useState({});
    const [showLearnersList, setshowLearnersList] = useState([]);
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
          disabled: "rgba(0,0,0,.12)",
        },
      },
      "dark"
    );

    //hubconnection starting if not
    useEffect(() => {
      if (!signalR.hubConnection) {
        signalR.startHubConnectionHandler(userState.user.id);
      }
    });

    //timeout cleanup

    const timeOutIDs = useRef([]);

    useEffect(() => {
      return () => {
        let ids = timeOutIDs.current;
        clearAlert(ids);
      };
    }, []);

    useEffect(() => {
      setshowLearnersList(learnersList);
      // console.log(learnersList);
      mergeData();
    }, [learnersList, learnerDetails]);

    const mergeData = () => {
      learnersList.map((obj) => {
        if (learnerDetails.find((data) => data.applicationUserId === obj.id)) {
          let item = learnerDetails.find(
            (data) => data.applicationUserId === obj.id
          );
          return (obj.createdDate = item?.createdDate);
        }
      });
      let filterList = learnersList.filter((item) =>
        learnerDetails.some((data) => item.id === data.applicationUserId)
      );
      filterList.sort((a, b) => {
        return new Date(b.createdDate) - new Date(a.createdDate);
      });

      setshowLearnersList(filterList);
    };

    //get zip field for learner
    const getZipCode = (data) => {
      if (learnerDetails) {
        if (learnerDetails.find((obj) => obj.applicationUserId === data.id)) {
          return `${
            learnerDetails.find((obj) => obj.applicationUserId === data.id)
              .zipCode
          }`;
        } else {
          return "N/A";
        }
      } else {
        return "N/A";
      }
    };

    //get age for learner
    const getAge = (data) => {
      if (data) {
        if (learnerDetails) {
          if (learnerDetails.find((obj) => obj.applicationUserId === data.id)) {
            let dateOfBirth = learnerDetails.find(
              (obj) => obj.applicationUserId === data.id
            ).dateOfBirth;
            return `${Math.floor(
              (new Date() - new Date(dateOfBirth).getTime()) / 3.15576e10
            )}`;
          } else {
            return "N/A";
          }
        } else {
          return "N/A";
        }
      } else {
        return "N/A";
      }
    };

    //get school for learner
    const getSchool = (data) => {
      let currentLearner;
      if (learnerSchool) {
        currentLearner = learnerSchool.find(
          (learner) => learner.learnersId === data.id
        );
      }
      if (organizations) {
        if (
          organizations.find((obj) => obj.id === currentLearner?.institutionId)
        ) {
          return `${
            organizations.find(
              (obj) => obj.id === currentLearner?.institutionId
            ).organizationName
          }`;
        } else {
          return "N/A";
        }
      } else {
        return "N/A";
      }
    };

    //selected row added to varable and action button/icon visibility
    const handleChange = ({ selectedRows }) => {
      selectedRows?.length > 1
        ? setActionOptionsMultiple(false)
        : setActionOptionsMultiple(true);
      setSelectedUsersList(selectedRows);
      if (selectedRows?.length > 1) {
        selectedRows.find((obj) => obj.isSuspended)
          ? setIsunsuspend(false)
          : setIsunsuspend(true);
        selectedRows.find((obj) => !obj.isSuspended)
          ? setIsSuspend(true)
          : setIsSuspend(false);
      }
    };

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
            let timeOutId = setTimeout(() => {
              toast({ type: "success", text: res.data.message });
              signalR.hubConnection.send(
                "UpdateUserSettingsForPortal",
                "Block",
                [params.userId]
              );
              getAllLearnsrsList();
              getInformationTrayDetails();
            }, 500);
            timeOutIDs.current.push(timeOutId);
          } else {
            toast({ type: "error", text: res.data.message });
          }
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            if (err.response.data.message) {
              toast({ type: "error", text: err.response.data.message });
            } else {
              toast({ type: "error", text: err.response.statusText });
            }
          }, 500);
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
            let timeOutId = setTimeout(() => {
              toast({ type: "success", text: res.data.message });
              signalR.hubConnection.send(
                "UpdateUserSettingsForPortal",
                "Unblock",
                [params.userId]
              );
              getAllLearnsrsList();
              getInformationTrayDetails();
            }, 500);
            timeOutIDs.current.push(timeOutId);
          } else {
            toast({ type: "error", text: res.data.message });
          }
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            if (err.response.data.message) {
              toast({ type: "error", text: err.response.data.message });
            } else {
              toast({ type: "error", text: err.response.statusText });
            }
          }, 500);
        });
    };

    //suspend multiple learners
    const suspendOrganizationMultipleUser = () => {
      let params = {
        id: userState.user.id,
        applicationUserIds: [],
      };
      let blockUsers = selectedUsersList.filter((obj) => !obj.isSuspended);
      if (blockUsers) {
        blockUsers.forEach((element) => {
          params["applicationUserIds"].push(element.id);
        });
        setSuspendModalShow(false);
        suspendMultipleUser(params)
          .then((res) => {
            if (res.status === 200 && isMounted()) {
              let timeOutId = setTimeout(() => {
                toast({ type: "success", text: res.data.message });
                signalR.hubConnection.send(
                  "UpdateUserSettingsForPortal",
                  "Block",
                  params.applicationUserIds
                );
                setActionOptionsMultiple(true);
                setSelectedUsersList([]);
                getAllLearnsrsList();
                getInformationTrayDetails();
                handleClearRows();
              }, 500);
              timeOutIDs.current.push(timeOutId);
            } else {
              toast({ type: "error", text: res.data.message });
            }
          })
          .catch((err) => {
            console.log(err);
            setTimeout(() => {
              if (err.response.data.message) {
                toast({ type: "error", text: err.response.data.message });
              } else {
                toast({ type: "error", text: err.response.statusText });
              }
            }, 500);
          });
      } else {
      }
    };

    //unsuspend multiple learners
    const unSuspendOrganizationMultipleUser = () => {
      let params = {
        id: userState.user.id,
        applicationUserIds: [],
      };
      let unBlockUsers = selectedUsersList.filter((obj) => obj.isSuspended);
      if (unBlockUsers) {
        unBlockUsers.forEach((element) => {
          params["applicationUserIds"].push(element.id);
        });
        setUnSuspendModalShow(false);
        unSuspendMultipleUser(params)
          .then((res) => {
            if (res.status === 200 && isMounted()) {
              let timeOutId = setTimeout(() => {
                toast({ type: "success", text: res.data.message });
                signalR.hubConnection.send(
                  "UpdateUserSettingsForPortal",
                  "Unblock",
                  params.applicationUserIds
                );
                setActionOptionsMultiple(true);
                setSelectedUsersList([]);
                getAllLearnsrsList();
                getInformationTrayDetails();
                setIsSuspend(true);
                handleClearRows();
              }, 500);
              timeOutIDs.current.push(timeOutId);
            } else {
              toast({ type: "error", text: res.data.message });
            }
          })
          .catch((err) => {
            console.log(err);
            setTimeout(() => {
              if (err.response.data.message) {
                toast({ type: "error", text: err.response.data.message });
              } else {
                toast({ type: "error", text: err.response.statusText });
              }
            }, 500);
          });
      } else {
      }
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
          toast({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          console.log(err.response);
          toast({ type: "error", text: err.response.data.message });
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
            }
          })
          .catch((err) => {
            console.log(err.response);
            toast({ type: "error", text: err.response.data.message });
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
            let timeOutId = setTimeout(() => {
              toast({ type: "success", text: res.data.message });
              signalR.hubConnection.send(
                "UpdateUserSettingsForPortal",
                "Delete",
                [params.deletedId]
              );
              getAllLearnsrsList();
              getInformationTrayDetails();
            }, 500);
            timeOutIDs.current.push(timeOutId);
          } else {
            toast({ type: "error", text: res.data.message });
          }
        })
        .catch((err) => {
          console.log(err.response);
          setTimeout(() => {
            if (err.response.data.message) {
              toast({ type: "error", text: err.response.data.message });
            } else {
              toast({ type: "error", text: err.response.statusText });
            }
          }, 500);
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
            let timeOutId = setTimeout(() => {
              toast({ type: "success", text: res.data.message });
              signalR.hubConnection.send(
                "UpdateUserSettingsForPortal",
                "Delete",
                [params.applicationUserIds]
              );
              setActionOptionsMultiple(true);
              setSelectedUsersList([]);
              getAllLearnsrsList();
              getInformationTrayDetails();
              handleClearRows();
            }, 500);
            timeOutIDs.current.push(timeOutId);
          } else {
            toast({ type: "error", text: res.data.message });
          }
        })
        .catch((err) => {
          console.log(err.response);
          setTimeout(() => {
            if (err.response.data.message) {
              toast({ type: "error", text: err.response.data.message });
            } else {
              toast({ type: "error", text: err.response.statusText });
            }
          }, 500);
        });
    };

    //search learner parent comp API call
    const searchLearner = (event) => {
      let value = event.target.value.toString();
      var searchTerm = value.toLowerCase();
      setshowLearnersList(
        learnersList.filter(
          (item) =>
            item.firstName?.toLowerCase().includes(searchTerm) ||
            item.lastName?.toLowerCase().includes(searchTerm)

          //   Object.keys(item).some((key) =>
          //   item[key]?.toString()?.toLowerCase()?.includes(lowSearch)
          // )
          // (
          //   item.firstName.toLowerCase() + item.lastName.toLowerCase()
          // )?.indexOf(event.target.value.toLowerCase()) !== -1
        )
      );
    };

    //confirmation modal show logics
    const learnerObjectHandler = (data, type) => {
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

    const caseInsensitiveSort = (rowA, rowB) => {
      const a = rowA.firstName.toLowerCase() + rowA.lastName.toLowerCase();
      const b = rowB.firstName.toLowerCase() + rowB.lastName.toLowerCase();

      if (a > b) {
        return 1;
      }

      if (b > a) {
        return -1;
      }

      return 0;
    };

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

    //columns defenitions
    const columns = [
      {
        name: "Name",
        selector: (row) => `${row.firstName} ${row.lastName}`,
        sortable: true,
        // width: "20%"
      },
      {
        name: "Sign-In Status",
        selector: (row) => `${row.isSuspended}`,
        cell: (row) => (
          <>
            {!row.isSuspended && row.emailConfirmed ? (
              <span id={row.id}>Allowed</span>
            ) : !row.isSuspended && !row.emailConfirmed ? (
              <span id={row.id}>Unverified</span>
            ) : (
              <span id={row.id} className="block-icon-text">
                Blocked
              </span>
            )}
          </>
        ),
        sortable: true,
        width: "15%",
      },
      {
        name: "Zip",
        selector: (row) => `${getZipCode(row)}`,
        sortable: true,
        // width: "10%"
      },
      {
        name: "Age",
        selector: (row) => `${getAge(row)}`,
        sortable: true,
        // width: "10%"
      },
      {
        name: "School",
        selector: (row) => `${getSchool(row)}`,
        sortable: true,
        width: "25%",
      },
      {
        name: "",
        button: true,
        // width: "10%",
        cell: (row) => (
          <div className="list-btns">
            <i
              className={
                actionOptionsMultiple
                  ? "fa-regular fa-pen-to-square edit-icon list-fun-btns mr-3 custom-tooltip"
                  : "fa-regular fa-pen-to-square edit-icon list-fun-btns mr-3 opacity-50 custom-tooltip"
              }
              onClick={
                actionOptionsMultiple
                  ? () => navigate(`/portal/admin/learnerDetails/${row.id}`)
                  : undefined
              }
            >
              <span className="tooltiptext">Edit</span>
            </i>
            {row.isSuspended && (
              <span
                className={
                  actionOptionsMultiple
                    ? "material-icons-outlined list-fun-btns block-icon mt-0 mr-3 custom-tooltip"
                    : "material-icons list-fun-btns block-icon mt-0 mr-3 opacity-50 custom-tooltip"
                }
                onClick={
                  actionOptionsMultiple
                    ? () => learnerObjectHandler(row, "unsuspend")
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
                  actionOptionsMultiple
                    ? "material-icons unblock-icon list-fun-btns mr-3 custom-tooltip"
                    : "material-icons unblock-icon list-fun-btns mr-3 opacity-50 custom-tooltip"
                }
                onClick={
                  actionOptionsMultiple
                    ? () => learnerObjectHandler(row, "suspend")
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
                row.loginMethods.find((method) => method === "Local") &&
                !row.isSuspended
                  ? "material-icons renew-icon list-fun-btns mr-3 custom-tooltip"
                  : "material-icons renew-icon list-fun-btns mr-3 opacity-50 custom-tooltip"
              }
              onClick={
                actionOptionsMultiple &&
                row.loginMethods.find((method) => method === "Local") &&
                !row.isSuspended
                  ? () => learnerObjectHandler(row, "reset")
                  : undefined
              }
            >
              <span className="tooltiptext">Reset password</span>
              autorenew
            </span>
            <i
              className={
                actionOptionsMultiple
                  ? "fa-regular fa-trash-can list-fun-btns delete-btn mr-0 custom-tooltip"
                  : "fa-regular fa-trash-can list-fun-btns delete-btn mr-0 opacity-50 custom-tooltip"
              }
              onClick={
                actionOptionsMultiple
                  ? () => learnerObjectHandler(row, "delete")
                  : undefined
              }
            >
              <span className="tooltiptext">Delete</span>
            </i>
          </div>
        ),
      },
    ];

    //disabled rows per page dropdown in pagination
    const paginationComponentOptions = {
      noRowsPerPage: true,
    };

    //clear selected rows after actions
    const [toggledClearRows, setToggleClearRows] = React.useState(false);
    const handleClearRows = () => {
      setToggleClearRows(!toggledClearRows);
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
        when: (row) =>
          selectedUsersList.find((learner) => learner.id === row.id),
        style: {
          backgroundColor: "#3e3c7a",
          color: "#fff",
        },
      },
    ];

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
    const rowDisabledCriteria = (row) =>
      row.loginMethods.find((method) => method === "Local") || row.isSuspended;
    const rowDisabledCriteriaBlock = (row) =>
      row.isSuspended && suspendModalShow;
    const rowDisabledCriteriaUnBlock = (row) =>
      !row.isSuspended && unSuspendModalShow;

    const checkLetterFoundInList = (item) => {
      var filtered = learnersList.some((word) => {
        return word.firstName?.toLowerCase().charAt(0) === item.toLowerCase();
      });
      return filtered;
    };

    function filterByAlphabets(item) {
      if (item === "All") {
        setshowLearnersList(learnersList);
      } else {
        var filtered = learnersList.filter((word) => {
          return word.firstName?.toLowerCase().charAt(0) === item.toLowerCase();
        });
        setshowLearnersList(filtered);
      }
    }

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

    return (
      <div className="col-11">
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
        <div className="container-fluid learners-admin-search">
          {/* <p className="subText text-right">
            There are{" "}
            <span className="text-success">
              {learnersList?.length > 0 ? learnersList[0].activeUserCount : 0}
            </span>{" "}
            active learners and{" "}
            <span className="text-danger">
              {learnersList?.length > 0 ? learnersList[0].inActiveUserCount : 0}
            </span>{" "}
            inactive learners
          </p> */}
          <div className="d-flex mt-3">
            <input
              className="learners-searchbox py-2 mt-2"
              id="search-input"
              type="search"
              name="search"
              placeholder="Search by name"
              onChange={searchLearner}
            />

            <div className="ml-auto">
              {!actionOptionsMultiple && (
                <div>
                  {isSuspend && (
                    <button
                      className="learner-default-btn ml-2 mt-2 mb-2 text-uppercase"
                      disabled={actionOptionsMultiple}
                      onClick={() => setSuspendModalShow(true)}
                    >
                      <span className="material-icons-outlined align-bottom mr-2 block-icon list-fun-btns mt-0">
                        lock
                      </span>
                      Block Sign-In
                    </button>
                  )}
                  {!isUnsuspend && (
                    <button
                      className="learner-default-btn ml-2 mt-2 mb-2 text-uppercase"
                      onClick={() => setUnSuspendModalShow(true)}
                    >
                      <span className="material-icons mr-2 unblock-icon list-fun-btns">
                        lock_open
                      </span>
                      Unblock Sign-In
                    </button>
                  )}
                  <button
                    className="learner-default-btn ml-2 mt-2 mb-2 text-uppercase"
                    onClick={() => setResetPasswordModalShow(true)}
                  >
                    <span className="material-icons mr-2 renew-icon list-fun-btns">
                      sync
                    </span>
                    Reset Password
                  </button>
                  <button
                    className="ml-2 learner-default-btn mt-2 mb-2 text-uppercase"
                    onClick={() => setDeleteModalShow(true)}
                  >
                    <i className="fa-regular fa-trash-can mr-2 list-fun-btns"></i>
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container-fluid  mt-4">
          <div className="row org-list-card">
            <div className="col-12">
              <DataTable
                columns={columns}
                data={showLearnersList ? showLearnersList : []}
                selectableRows
                pagination
                paginationComponent={CustomPag}
                // paginationServer
                paginationTotalRows={
                  showLearnersList?.length ? showLearnersList.length : 0
                }
                paginationComponentOptions={paginationComponentOptions}
                // onChangePage={handlePageChange}
                persistTableHead
                // pointerOnHover
                sortFunction={customSort}
                highlightOnHover
                theme="solarized"
                onSelectedRowsChange={handleChange}
                clearSelectedRows={toggledClearRows}
                conditionalRowStyles={conditionalRowStyles}
                customStyles={customStyles}
                selectableRowsComponent={DataTableCustomCheckbox}
                selectableRowDisabled={
                  resetPasswordModalShow
                    ? rowDisabledCriteria
                    : suspendModalShow
                    ? rowDisabledCriteriaBlock
                    : unSuspendModalShow
                    ? rowDisabledCriteriaUnBlock
                    : ""
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default React.memo(ListTableComponent);
