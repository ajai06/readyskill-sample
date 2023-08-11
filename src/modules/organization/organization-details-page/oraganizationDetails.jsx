import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import ClipLoader from "react-spinners/ClipLoader";

import WithLayout from "../../../sharedComponents/hoc/withLayOut";
import InviteCodeGenerate from "./invite-code-generate/inviteCodeGenerate";
import InvitationContainer from "./sentInvitation/invitationContainer";
import DashboardHeaderComponent from "../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import OrganizationInfo from "./organizationInfo";

import { UserAuthState } from "../../../context/user/userContext";

import { useToastDispatch } from "../../../context/toast/toastContext";

// import { getAllUsers, getAllRoles, updateUserData, getOrganization, deleteOrganizationUser } from "../../../services/apiServices";

import {
  getOrganization,
  updateUserData,
  getAllUsers,
  getAllRoles,
  deleteOrganizationUser,
  suspendUser,
  unSuspendUser,
} from "../../../services/organizationServices";

import "./organization.scss";

function OraganizationDetails() {
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

  const { register, handleSubmit, setValue } = useForm();

  const navigate = useNavigate();
  const { id } = useParams();

  const userState = UserAuthState();

  const toast = useToastDispatch();

  const [organization, setOrganization] = useState([]);
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    //get organization details
    getOrganization(id)
      .then((res) => {
        if (mountedRef) {
          setOrganization(res.data);
          setTimeout(() => {
            setLoaded(true);
          }, 400);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
    // get all role types
    getAllRoles()
      .then((res) => {
        if (mountedRef) {
          setAllRoles(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // get all user list
    getUsersList();
  }, []);

  // get all user list under the oragnization
  const getUsersList = () => {
    getAllUsers(id)
      .then((res) => {
        if (mountedRef) {
          setTimeout(() => {
            setUsers(res.data);
          }, 300);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const [userModalShow, setUserModalShow] = useState(false);
  const [editUserData, setEditUserData] = useState([]);

  // setting user data
  const patchUserData = (row) => {
    if (mountedRef) {
      setValue("firstName", row.firstName);
      setValue("lastName", row.lastName);
      setValue("role", row.userRoles[0]);
      setEditUserData(row);
      setUserModalShow(true);
    }
  };

  // user update
  const userUpdate = (data) => {
    data.organizationId = editUserData.organizationId;
    data.id = editUserData.id;
    setUserModalShow(false);

    updateUserData(data)
      .then((res) => {
        setTimeout(() => {
          toast({ type: "success", text: res.data.message });
          getUsersList();
        }, 300);
      })
      .catch((err) => {
        console.log(err.response);
        setUserModalShow(false);
        setTimeout(() => {
          if (err.response.data.message) {
            toast({ type: "error", text: err.response.data.message });
          } else {
            toast({ type: "error", text: err.response.statusText });
          }
        }, 500);
      });
  };

  // user update modal close
  const modalClose = () => {
    setUserModalShow(false);
  };

  // dleete user
  const deleteUser = () => {
    let params = {
      id: userState.user.id,
      deletedId: editUserData.id,
    };
    deleteOrganizationUser(params)
      .then((res) => {
        if (res.data.isSuccess) {
          setTimeout(() => {
            toast({ type: "success", text: res.data.message });
            getUsersList();
          }, 500);
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

  const randomId = () => {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now();
    return uniqid;
  };

  //suspend user

  const suspendOrganizationUser = () => {
    let params = {
      id: userState.user.id,
      UserId: editUserData.id,
      IsSuspended: true,
    };
    suspendUser(params)
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            toast({ type: "success", text: res.data.message });
            getUsersList();
          }, 500);
        } else {
          toast({ type: "error", text: res.data.message });
        }
      })
      .catch((err) => console.log(err));
  };

  const unSuspendOrganizationUSer = () => {
    let params = {
      id: userState.user.id,
      UserId: editUserData.id,
      IsSuspended: false,
    };
    unSuspendUser(params)
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            toast({ type: "success", text: res.data.message });
            getUsersList();
          }, 500);
        } else {
          toast({ type: "error", text: res.data.message });
        }
      })
      .catch((err) => console.log(err));
  };

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

  // data table colums and rows
  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.userRoles[0],
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <span className="list-btns user-modal">
          <span
            hidden={userState.user.id === row.id}
            className="material-icons edit-org custom-tooltip"
            onClick={() => patchUserData(row)}
            data-toggle="modal"
          >
            <span className='tooltiptext'>Edit User</span>
            edit
          </span>
          <span
            hidden={userState.user.id === row.id}
            className="material-icons delete-user custom-tooltip"
            data-toggle="modal"
            data-target="#delete-modal-user"
            onClick={() => {
              setEditUserData(row);
            }}
          >
            <span className='tooltiptext'>Delete User</span>
            delete
          </span>

          {row.isSuspended ? (
            <span
              hidden={userState.user.id === row.id}
              className="material-icons delete-user custom-tooltip"
              data-toggle="modal"
              data-target="#unsuspend-modal-user"
              onClick={() => {
                setEditUserData(row);
              }}
            >
              <span className='tooltiptext'>Unsuspend user</span>
              person_off
            </span>
          ) : (
            <span
              hidden={userState.user.id === row.id}
              className="material-icons delete-user custom-tooltip"
              data-toggle="modal"
              data-target="#suspend-modal-user"
              onClick={() => {
                setEditUserData(row);
              }}
            >
              <span className='tooltiptext'>Suspend user</span>
              person
            </span>
          )}

          {/* modal starts */}
          <div
            className={`modal ${userModalShow ? "modal-show" : "modal-hide"}`}
            tabIndex="-1"
            aria-labelledby="editUser-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="delete-modalLabel">
                    Edit User
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => modalClose()}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row mb-3">
                      <div className="col">
                        <div className="form-outline">
                          <label
                            className="form-label subText black-txt"
                            htmlFor="firstName"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id={`user_first_name${randomId()}`}
                            className="form-control mb-2"
                            placeholder=""
                            {...register("firstName", { required: true })}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-outline">
                          <label
                            className="form-label subText black-txt"
                            htmlFor="lastName"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id={`user_last_name${randomId()}`}
                            className="form-control mb-2"
                            placeholder=""
                            {...register("lastName", { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label subText black-txt"
                        htmlFor="role"
                      >
                        User's Role
                      </label>
                      <select
                        style={{ height: "46px" }}
                        className="form-control mb-2"
                        id={`user_role_${randomId()}`}
                        {...register("role", { required: true })}
                      >
                        {allRoles.map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => modalClose()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn submit-userBtn"
                    onClick={handleSubmit(userUpdate)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* modal ends */}
          {/* <span className="material-icons delete-smodal" data-target="#delete-modal-user">delete</span> */}

          {/* user delete modal starts */}
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
                  <h5 className="modal-title" id="delete-modalLabel">
                    Are you sure?
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this user?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditUserData([])}
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={deleteUser}
                    data-dismiss="modal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* user delete modal ends */}
          {/* user suspend modal starts */}
          <div
            className="modal fade"
            id="suspend-modal-user"
            tabIndex="-1"
            aria-labelledby="delete-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="delete-modalLabel">
                    Are you sure?
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to block this user?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditUserData([])}
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={suspendOrganizationUser}
                  >
                    Block
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* user suspend modal ends */}
          {/* user unsuspend modal starts */}
          <div
            className="modal fade"
            id="unsuspend-modal-user"
            tabIndex="-1"
            aria-labelledby="delete-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="delete-modalLabel">
                    Are you sure?
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to unblock this user?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditUserData([])}
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={unSuspendOrganizationUSer}
                  >
                    Unblock
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* user unsuspend modal ends */}
        </span>
      ),
      width: "180px",
      // omit : userState.user.id === row.id
    },
  ];

  return (
    <div id="main">
      <div
        className="back-btn mb-4 mt-3"
        onClick={() => navigate("/portal/organization")}
      >
        <span className="material-icons org-back-arrow">arrow_back_ios</span>
        <span className="back-text">Back</span>
      </div>

      <DashboardHeaderComponent headerText="Organization Details" />
      {loaded ? (
        <OrganizationInfo
          usersNo={users.length}
          organizationData={organization}
        />
      ) : (
        <div className="col-xl-3 col-md-6 mb-4">
          <ClipLoader color={"#2a9fd8"} loading={true} size={50} />
        </div>
      )}

      <DashboardHeaderComponent headerText="Invite User" />
      {loaded ? (
        <InvitationContainer organizationData={organization} />
      ) : (
        <div className="col-xl-3 col-md-6 mb-4">
          <ClipLoader color={"#2a9fd8"} loading={true} size={50} />
        </div>
      )}

      <DashboardHeaderComponent headerText="Invite Code Generator" />
      {loaded ? (
        <InviteCodeGenerate organizationData={organization} />
      ) : (
        <div className="col-xl-3 col-md-6 mb-4">
          <ClipLoader color={"#2a9fd8"} loading={true} size={50} />
        </div>
      )}

      <DashboardHeaderComponent headerText="User's List" />
      {loaded ? (
        <div className="col-8 px-0 mb-5">
          <div className="card user-list-card">
            <div className="card-body">
              <DataTable
                columns={columns}
                sortFunction={customSort}
                data={users}
                pagination
                pointerOnHover
                highlightOnHover
                // customStyles={customStyles}
                theme="solarized"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="col-xl-3 col-md-6 mb-4">
          <ClipLoader color={"#2a9fd8"} loading={true} size={50} />
        </div>
      )}
    </div>
  );
}

export default WithLayout(OraganizationDetails);
