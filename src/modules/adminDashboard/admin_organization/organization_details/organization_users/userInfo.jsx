import React, { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useForm } from "react-hook-form";

import "../../../admindashboard.scss";

import { getExternalLoginTypeByUser, getIpAddress } from "../../../../../services/adminServices";
import {
  getUserGroupsByUserId,
  updateUserData,
} from "../../../../../services/organizationServices";
import UserRolesModal from "./userRolesModal";
import EditUserGroupsModal from "./editUserGroupsModal";

import { useToastDispatch } from "../../../../../context/toast/toastContext";
import { UserAuthState } from "../../../../../context/user/userContext";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { clearAlert, ReadySkillRepresentative } from "../../../../../utils/contants";
import { getLearnersGeneralInformation } from "../../../../../services/learnersServices";

const UserInfo = React.memo(({
  organizationDetails,
  userInfo,
  userList,
  userObjectHandler,
  setLoginValues,
  getAllUsersList,
  expandRowData,
  setUserEdit,
  isUserEdit
}) => {
  const userState = UserAuthState();
  const [ipAddressLocation, setIpAddressLocation] = useState(undefined);
  const [loginMethods, setLoginMethods] = useState([]);
  const [userGroupsList, setUserGroupsList] = useState([]);
  const [userRolesModalShow, setUserRolesModalShow] = useState(false);
  const [editUserGroupsModalShow, setEditUserGroupModalShow] = useState(false);
  const [editUserDetails, setEditUserDetails] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [generalInformation, setGeneralInformation] = useState([]);

  const isMounted = useIsMounted();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current
      clearAlert(ids);
    };
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { error: registerError },
  } = useForm({ mode: 'onChange' });

  // const [allRoles, setAllRoles] = useState([]);
  const toast = useToastDispatch();
  const {
    register: registerUserEmail,
    handleSubmit: handleSubmitRegisterUserEmail,
    formState: { errors: registerUserEmailError },
    setValue: setRegisterUserEmail,
    getValues: getRegisterUserEmail,
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    setValue("firstName", userInfo?.firstName ? userInfo?.firstName : "");
    setValue("lastName", userInfo?.lastName ? userInfo?.lastName : "");
    setRegisterUserEmail(
      "userName",
      userInfo?.userName ? userInfo.userName : ""
    );
    if (userInfo) {
      getGeneralInformation();
      setCurrentUser(userList.find((user) => user.id === userInfo.id));
    }
  }, [userInfo]);

  useEffect(() => {
    getGroupsList(userInfo);
    getUserExternalType();
    if (userInfo?.ipAddress) {
      findIp(userInfo?.ipAddress);
    } else {
      setIpAddressLocation(undefined);
    }
    // return () => {
    //   setLoginMethods([]);
    // };
  }, [userInfo]);

  useEffect(() => {
    if (isUserEdit) {
      setEditUserDetails(true);
    }
  }, [


  ]);


  const getUserExternalType = () => {
    getExternalLoginTypeByUser(organizationDetails.id, userInfo.id)
      .then(res => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data.filter(obj => obj !== null);
            if (responseData?.length > 0 && userInfo.userExternalLoginMapping?.length > 0) {
              let result = userInfo.userExternalLoginMapping.filter(obj => {
                return responseData.some(item => item.externalLoginTypeId === obj.externalLoginTypeId)
              })
              setLoginMethods(result);
            }

          }
        }
      })
  }
  const findIp = (ip) => {
    getIpAddress(ip)
      .then((response) => {
        return response.json();
      })
      .then((obj) => {
        if (isMounted()) {
          setIpAddressLocation(obj.country_code);
        }
      });
  };
  const updateLoginValues = (checked, method, index) => {
    document.getElementById(method.externalLoginTypeId).checked = checked;
    let methods = loginMethods;
    methods[index].isActive = checked;
    setLoginMethods(methods);
    setLoginValues(method, checked);
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

  //------------User Group List ------------
  const getGroupsList = (userInfo) => {
    let userId = userInfo.id;
    getUserGroupsByUserId(userId).then((res) => {
      setUserGroupsList(res.data);
    });
  };

  //------------Update User Details ------------
  const userUpdate = () => {
    let data = {
      id: userInfo.id,
      organizationId: userInfo.organizationId
    };
    data["firstName"] = getValues("firstName");
    data["lastName"] = getValues("lastName");
    data["userName"] = getRegisterUserEmail("userName");
    updateUserData(data)
      .then((res) => {
        if (isMounted()) {
          let timeOutId = setTimeout(() => {
            toast({ type: "success", text: res.data.message });
            getAllUsersList();
          }, 300);
          timeOutIDs.current.push(timeOutId);

        }
      })
      .catch((err) => {
        console.log(err.response);
        if (err?.response?.status === 400) {
          toast({
            type: "error",
            text: err.response.data.message,
          });
        }
      });
  };


  const hideGroupModal = async () => {
    setEditUserGroupModalShow(false);

    // const x = await
    getAllUsersList();
    //   expandRowData();
  }

  const showUserDetails = (data) => {
    setEditUserDetails(data);
    setUserEdit(data);
  }

  const getGeneralInformation = () => {
    getLearnersGeneralInformation(userInfo.id)
      .then((res) => {
        // console.log(res)
        if (isMounted()) {
          setGeneralInformation(res.data);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  return (
    <>
      {userRolesModalShow && (
        <UserRolesModal
          userInfo={userInfo}
          show={userRolesModalShow}
          onHide={() => setUserRolesModalShow(false)}
        />
      )}
      {editUserGroupsModalShow && (
        <EditUserGroupsModal
          organizationDetails={organizationDetails}
          getAllUsersList={getAllUsersList}
          getGroupList={getGroupsList}
          userInfo={userInfo}
          show={editUserGroupsModalShow}
          onHide={hideGroupModal}
          orgId={userInfo.organizationId}
        />
      )}
      <div className="col-12 row my-4">
        <div className="col-4">
          <div className="d-flex">
            <p className="subHead-text-learner mb-4 text-uppercase mt-3">
              USER INFORMATION
            </p>
            {!editUserDetails && (
              <div disabled={(userInfo.id === userState.user.id) || (!userState.organizationEdit) || (userInfo.id === ReadySkillRepresentative.RepresentativeId)}>
                <i className="fa-regular fa-pen-to-square cursor-pointer edit-icon ml-3 text-white mt-3 mr-0 custom-tooltip"
                  onClick={() => showUserDetails(true)}>
                  <span className='tooltiptext'>Edit</span>
                </i>

              </div>
            )}
            {editUserDetails && (
              <div>
                <span
                  className="material-icons ml-1 text-white mt-3 mr-0 edit-learner-tick edit-learner-icon custom-tooltip"
                  onClick={() => showUserDetails(false)}
                >
                  <span className='tooltiptext'>Cancel</span>
                  close
                </span>
              </div>
            )}
            {!userInfo.emailConfirmed && (
              <span
                className="material-icons ml-3 text-white mt-3 warning-income-icon custom-tooltip"
              >
                <span className='tooltiptext'>This user has not verified their account</span>
                warning
              </span>
            )}

          </div>
          <div>
            {!editUserDetails && (
              <div>
                <div className="d-flex">
                  <p className="inner-head mb-3 text-uppercase text-nowrap">
                    Name :
                  </p>
                  <p className="inner-sub text-capitalize ml-2 w-90 text-break">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </p>
                </div>
                <div className="d-flex">
                  <p className="inner-head mb-3 text-uppercase text-nowrap">
                    Username :
                  </p>
                  <p className="inner-sub text-capitalize ml-2 w-90 text-break">
                    {userInfo?.userName}
                  </p>
                </div>
              </div>
            )}

            {editUserDetails && (
              <form>
                <div className="row mb-3">
                  <div className="">
                    <div className="form-outline">
                      <label
                        className="form-label subText black-txt"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="form-control mb-2"
                        {...register("firstName", { required: true })}
                        onBlur={handleSubmit(userUpdate)}
                        onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                      />
                      {registerError?.lastName?.type === "required" ? (
                        <span className="error-msg">
                          Firstname is required
                          <br />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="">
                    <div className="form-outline">
                      <label
                        className="form-label subText black-txt"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="form-control mb-2"
                        {...register("lastName", { required: true })}
                        onBlur={handleSubmit(userUpdate)}
                        onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                      />
                      {registerError?.lastName?.type === "required" ? (
                        <span className="error-msg">
                          Lastname is required
                          <br />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="">
                      <div className="form-outline">
                        <label
                          className="form-label subText black-txt"
                          htmlFor="lastName"
                        >
                          Username
                        </label>
                        <input
                          type="email"
                          id="registerUserEmail"
                          className="form-control mb-2"
                          {...registerUserEmail("userName", {
                            required: true,
                            pattern:
                              /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          })}
                          onBlur={handleSubmitRegisterUserEmail(userUpdate)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && e.target.blur()
                          }
                        />

                        {registerUserEmailError.userName?.type ===
                          "required" ? (
                          <span className="error-msg">Email is required</span>
                        ) : registerUserEmailError.userName?.type ===
                          "pattern" ? (
                          <span className="error-msg">Enter valid email</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            <div className="d-flex mt-3">
              <p className="inner-head mb-3 text-uppercase text-nowrap">
                Created :

              </p>
              <p className="inner-sub text-capitalize ml-2 w-90 text-break">
                {/* February 21, 2022 */}
                {generalInformation && userInfo.emailConfirmed ?
                  dateTimeFormatter(generalInformation?.createdDate)?.toLocaleString(
                    "en-US",
                    {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric"
                    }
                  )
                  : ""
                }
              </p>
            </div>

            <div className="d-flex">
              <p className="inner-head mb-3 text-uppercase text-nowrap">
                Last Login :
              </p>
              <p className="inner-sub text-capitalize ml-2 w-90 text-break">
                {userInfo?.lastLoginDate 
                  ? (dateTimeFormatter(userInfo?.lastLoginDate)?.toLocaleString(
                    "en-US",
                    {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                      hour12: true,
                      hour: "2-digit", // numeric, 2-digit
                      minute: "2-digit", // numeric, 2-digit
                      second: "2-digit", // numeric, 2-digit
                    }).replace(/,/g, '')
                  )

                  : ""}
              </p>
            </div>
            <div className="d-flex">
              <p className="inner-head mb-3 text-uppercase">Last IP :</p>
              <p className="inner-sub text-capitalize ml-2">
                {userInfo?.ipAddress}
              </p>
              {/* <ReactCountryFlag
                countryCode={ipAddressLocation}
                svg
                className="mt-1 account-flag ml-2"
              /> */}
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="d-flex">
            <div className="d-flex" disabled={!userState.groupReadonly}>
              <p className="subHead-text-learner mb-4 text-uppercase mt-3">
                GROUPS
              </p>

              <span
                onClick={() => setUserRolesModalShow(true)}

                className="material-icons ml-3 text-white mt-3 mr-3 eye-icon-user edit-learner-icon custom-tooltip"

              >
                <span className='tooltiptext'>View group roles</span>
                remove_red_eye
              </span>
            </div>

            <div disabled={(userInfo.id === userState.user.id) || (!userState.groupEdit) || (userInfo.id === ReadySkillRepresentative.RepresentativeId)}>

              <i className="fa-regular fa-pen-to-square cursor-pointer edit-icon text-white mt-3 mr-0 custom-tooltip"
                onClick={() => setEditUserGroupModalShow(true)}>
                <span className='tooltiptext'>Edit</span>
              </i>

            </div>
          </div>
          <div className="user-groups-list">
            {userGroupsList.length > 0 ? (
              userGroupsList.map((obj) => (
                <p key={obj.group.id} className="inner-sub text-capitalize mb-2">
                  {obj.group.groupName}
                </p>
              ))
            ) : (
              <p className="inner-sub text-capitalize mb-3">No groups found</p>
            )}
          </div>
        </div>
        <div className="col-5">
          <p className="subHead-text-learner mb-4 text-uppercase mt-3">
            LOGIN METHODS
          </p>
          <div className="">
            {loginMethods?.map((method, index) => (
              <div
                key={method.externalLoginTypeId}
                className="form-check mb-2"
                disabled={(userInfo.id === userState.user.id) || (userInfo.id === ReadySkillRepresentative.RepresentativeId)}
              >
                <label className="custom-control overflow-checkbox">
                  <input
                    type="checkbox"
                    className="form-check-input overflow-control-input"
                    id={method.externalLoginTypeId}
                    checked={method.isActive}
                    onChange={(e) =>
                      updateLoginValues(e.target.checked, method, index)
                    }
                  />
                  <span className="overflow-control-indicator"></span>
                </label>
                <label
                  className="form-check-label subText"
                  htmlFor="exampleCheck1"
                >
                  {method.externalLoginType?.typeNameDescription}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12" disabled={(userInfo.id === userState.user.id) || (userInfo.id === ReadySkillRepresentative.RepresentativeId)}>
          <div className="admin-org-user-btns mt-3 d-flex">
            {!userInfo.isSuspended && (
              <button
                className="mb-3 text-uppercase learner-default-btn-light"
                onClick={() => userObjectHandler(userInfo, "suspend")}
                disabled={userState.blockSignin ? false : true}
              >
                <span className="material-icons-outlined align-bottom mr-2 list-fun-btns block-icon mt-0">lock</span>
                Block Sign-In
              </button>
            )}
            {userInfo.isSuspended && (
              <button
                className="mb-3 ml-2  text-uppercase learner-default-btn-light"
                onClick={() => userObjectHandler(userInfo, "unsuspend")}
              >
                <span className="material-icons mr-2 list-fun-btns unblock-icon">
                  lock_open
                </span>
                Unblock Sign-In
              </button>
            )}
            {loginMethods?.find(
              (method) =>
                method.externalLoginType.typeName === "Local" && method.isActive
            ) && (
                <button
                  disabled={userState.resetPassword ? false : true}
                  className={
                    userInfo.isSuspended
                      ? "learner-default-btn-light text-uppercase mb-3 ml-2 opacity-50"
                      : "learner-default-btn-light text-uppercase mb-3 ml-2"
                  }
                  onClick={
                    userInfo.isSuspended
                      ? undefined
                      : () => userObjectHandler(userInfo, "reset")
                  }
                >
                  <span className="material-icons mr-2 renew-icon list-fun-btns">sync</span>
                  Reset Password
                </button>
              )}
            <button
              className="learner-default-btn-light text-uppercase mb-3 ml-2"
              onClick={() => userObjectHandler(userInfo, "delete")}
              disabled={userState.userDelete ? false : true}
            >
              <i className="fa-regular fa-trash-can mr-2 list-fun-btns "></i>
              Delete Users
            </button>
          </div>
        </div>
      </div>
    </>
  );
})

export default React.memo(UserInfo);
