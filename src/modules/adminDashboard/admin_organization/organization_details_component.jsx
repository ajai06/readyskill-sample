import React, { useEffect, useState, useRef } from "react";
import ReactTooltip from "react-tooltip";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CopyToClipboard from "react-copy-to-clipboard";
import { useForm } from "react-hook-form";
import {
  blockOrganization,
  deleteProfileImage,
  updateProfileImage,
} from "../../../services/organizationServices";

//context
import { useToastDispatch } from "../../../context/toast/toastContext";
import { UserAuthDispatch } from "../../../context/user/userContext";
import { UserAuthState } from "../../../context/user/userContext";
import { clearAlert } from "../../../utils/contants";

//services
import {
  inviteCodeGenerate,
  getOrganization,
  orgOverViewUpdate,
} from "../../../services/organizationServices";

//components
import OrganizationOverviewTab from "./organization_details/organization_overview/organization_overview_tab";
import OrganizationUsersTab from "./organization_details/organization_users/organization_users_tab";
import OrganizationGroups from "./organization_details/organization_groups/organization_groups_tab";
import OrganizationSecurity from "./organization_details/organization_security/organization_security_tab";
import OrganizationBilling from "./organization_details/organizationBilling";
import WithLayout from "../../../sharedComponents/hoc/withLayOut";
import { OrganizationTypes } from "../../../utils/contants";

import "react-tabs/style/react-tabs.css";
import "../admindashboard.scss";

//image
import blankProfile from "../../../assets/img/org-default.png";
import { useLocation } from "react-router-dom";
import { useIsMounted } from "../../../utils/useIsMounted";
import GlobalAdminLayOut from "../../../sharedComponents/hoc/globalAdminLayOut";

function OrganizationDetailsAdminComponent() {
  const { register, setValue, getValues, watch } = useForm({
    mode: "onChange",
  });

  const {
    register: registerOrgName,
    handleSubmit: handleSubmitOrgName,
    formState: { errors: orgNameError },
    setValue: setValueOrgName,
    clearErrors
  } = useForm({ mode: "onChange" });

  const toast = useToastDispatch();
  const userDispatch = UserAuthDispatch();
  const userState = UserAuthState();
  const location = useLocation();
  const [organizationDetails, setOrgnizationDetails] = useState({});
  const [orgId, setOrgId] = useState(undefined);
  const [editOrgName, setEditOrgName] = useState(false);
  const [images, setImages] = useState("");
  const isMounted = useIsMounted();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  useEffect(() => {
    if (location.state?.orgId) {
      setOrgId(location.state.orgId);
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      generateNewCode();
      getOrganizationDetails();
    }
  }, [orgId]);

  useEffect(() => { }, []);

  // ----------------- Update Organization Details -----------------
  const getOrganizationDetails = () => {
    const timestamp = Date.now();
    getOrganization(orgId)
      .then((res) => {
        let data = res.data;
        if (isMounted() && data) {
          setOrgnizationDetails(data);
          setValueOrgName("organizationName", data.organizationName);
          if (data.logoImage?.length > 0) {
            let profileImage = data.logoImage + "?" + timestamp;
            setImages(profileImage);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const [inviteCodeShown, setPasswordShown] = useState(false);
  const toggleInviteCodeVisiblity = () => {
    setPasswordShown(!inviteCodeShown);
  };

  const [copyValue, setCopyValue] = useState("");

  const onCopy = () => {
    const value = getValues("inviteCode");
    if (isMounted()) {
      setCopyValue(value);
      toast({ type: "success", text: "Copied", timeout: 3000 });
    }
  };

  const generateNewCode = () => {
    inviteCodeGenerate(orgId)
      .then(async (res) => {
        if (isMounted()) {
          let timeOutId = await setTimeout(() => {
            setValue("inviteCode", res.data.inviteCode);
          }, 500);
          timeOutIDs.current.push(timeOutId);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const value = watch("inviteCode");

  useEffect(() => {
    if (isMounted()) {
      setCopyValue(value);
    }
  }, [value]);

  const updateOrgName = (params) => {
    params["editingFieldName"] = "ORGANIZATIONNAME";
    params["id"] = organizationDetails.id;
    orgOverViewUpdate(params)
      .then((res) => {
        toast({
          type: "success",
          text: "Organization name updated successfully",
          timeout: 3000,
        });
        if (!userState.role_GlobalAdmin) {
          let user = JSON.parse(localStorage.getItem("user"));
          user.organization.organizationName = params.organizationName;
          userDispatch({ type: "LOGIN", payload: user });
          localStorage.setItem("user", JSON.stringify(user));
        }
        if (isMounted()) {
          getOrganizationDetails();
          setEditOrgName(false);
        }
      })
      .catch((err) => console.log(err));
  };
  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // ----------------- Update Profile Image -----------------
  const onChange = (imageList) => {
    let f = new FormData();
    f = new FormData();
    let fileTyeps = [
      "image/png",
      "image/gif",
      "image/jpeg",
      "image/jpg",
      "image/jpe",
      "image/bmp",
    ];
    let check = fileTyeps.includes(imageList.target.files[0].type);
    if (!check) {
      toast({ type: "error", text: "Selected file not supported" });
      return;
    }
    f.append("File", imageList.target.files[0]);
    imageList.target.value = "";
    updateProfileImage(orgId, f)
      .then((res) => {
        if (res.status === 200) {
          if (isMounted()) {
            toast({
              type: "success",
              text: "Logo updated successfully",
              timeout: 2500,
            });
            const timestamp = Date.now();
            let user = JSON.parse(localStorage.getItem("user"));
            if (!userState.role_GlobalAdmin) {
              user.userLogo = res.data.logoUrl + "?" + timestamp;
              userDispatch({ type: "LOGIN", payload: user });
              localStorage.setItem("user", JSON.stringify(user));
            } else if (
              userState.role_GlobalAdmin &&
              orgId === userState.user.organization.organizationId
            ) {
              user.userLogo = res.data.logoUrl + "?" + timestamp;
              userDispatch({ type: "LOGIN", payload: user });
              localStorage.setItem("user", JSON.stringify(user));
            } else {
              user.userLogo = res.data.logoUrl + "?" + timestamp;
            }

            setImages(user.userLogo);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ----------------- Delete Profile Image -----------------
  const handleDelete = () => {
    if (images) {
      deleteProfileImage(orgId)
        .then((res) => {
          if (res.status === 200) {
            setImages("");
            toast({
              type: "success",
              text: "Logo deleted Successfully",
              timeout: 2500,
            });
            let user = JSON.parse(localStorage.getItem("user"));
            if (!userState.role_GlobalAdmin) {
              user.userLogo = "";
              userDispatch({ type: "LOGIN", payload: user });
              localStorage.setItem("user", JSON.stringify(user));
            } else if (
              userState.role_GlobalAdmin &&
              orgId === userState.user.organization.organizationId
            ) {
              user.userLogo = "";
              userDispatch({ type: "LOGIN", payload: user });
              localStorage.setItem("user", JSON.stringify(user));
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const check = () => {
    return true;
  };

  const blockOrg = () => {
    const data = {};
    data.organizationIds = [organizationDetails.id];
    data.isSuspended = true;
    blockOrganization(data)
      .then((res) => {
        if (isMounted()) {
          getOrganizationDetails();
          toast({ type: "success", text: "Organization blocked successfully" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // unblock a organization submit
  const unblockOrg = () => {
    const data = {};
    data.organizationIds = [organizationDetails.id];
    data.isSuspended = false;
    blockOrganization(data)
      .then((res) => {
        if (isMounted()) {
          getOrganizationDetails();
          toast({
            type: "success",
            text: "Organization unblocked successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const orgNameEditHandler = () => {
    setValueOrgName("organizationName", organizationDetails.organizationName);
    clearErrors()
    setEditOrgName(false);
  }

  return (
    <React.Fragment>
      <div>
        <input
          onChange={onChange}
          type="file"
          accept="image/png, image/gif, image/jpeg, image/jpg, image/jpe, image/bmp"
          ref={hiddenFileInput}
          style={{ display: "none" }}
        />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-5 pr-2">
              <div className="card shadow learner-main-card">
                <div className="card-header pb-0 bb-0">
                  <div className="d-flex mt-3 mb-4">
                    <div className="d-grid position-relative" disabled={(userState.organizationEdit && userState.organizationReadonly) ? false : true}>
                      <img
                        src={images?.length > 0 ? images : blankProfile}
                        key={images}
                        className="rounded-circle object-cover"
                        alt="Profile"
                        width="60"
                        height="60"
                      />
                      <span
                        className="material-icons text-white learner-control-icons mt-2 mr-3 h5 pb-auto edit-prof-pic"
                        onClick={handleClick}
                        data-tip data-for="editPic"
                      > edit
                      </span>
                      <ReactTooltip id="editPic" className="tooltip-react" border arrowColor='#2C2A5F' place="top" effect="solid">
                        Edit picture
                      </ReactTooltip>
                      {images?.length > 0 ? (
                        <span
                          className="text-white learner-control-icons mt-2 text-center delete-prof-pic"
                          onClick={handleDelete}
                        >
                          Remove
                        </span>
                      ) : (
                        ""
                      )}
                      &nbsp;
                    </div>
                    <div className="ml-3" disabled={(userState.organizationEdit && userState.organizationReadonly) ? false : true}>
                      {!editOrgName && (
                        <span className="d-flex">
                          <div>
                            <p className="bigger-text text-capitalize mb-0">
                              {organizationDetails?.organizationName}
                            </p>
                            <p className="subText text-uppercase mb-0">
                              {organizationDetails?.organizationTypeInfo?.type}{" "}
                              <span className="material-icons separated-dot mr-0">
                                fiber_manual_record
                              </span>{" "}
                              {organizationDetails?.city},{" "}
                              {organizationDetails?.state}
                            </p>
                          </div>

                          <i
                            className="fa-regular fa-pen-to-square edit-icon learner-control-icons custom-tooltip mt-1 ml-3 h5"
                            onClick={() => setEditOrgName(true)}
                          >
                            <span className="tooltiptext">Edit</span>
                          </i>
                        </span>
                      )}
                      {editOrgName && (
                        <span className="">
                          <label
                            className="form-label subText"
                            htmlFor="org-name"
                          >
                            Organization name
                          </label>
                          <div className="d-flex">
                            <div className="">
                              <input
                                type="text"
                                id="org-name"
                                className="form-control mb-2"
                                {...registerOrgName("organizationName", {
                                  required: true,
                                })}
                                onBlur={handleSubmitOrgName(updateOrgName)}
                                onKeyPress={(e) =>
                                  e.key === "Enter" && e.target.blur()
                                }
                              />
                              {orgNameError.organizationName?.type ===
                                "required" ? (
                                <span className="error-msg">
                                  Organization name required
                                  <br />
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <span
                              className="material-icons ml-1 text-white mt-2 edit-learner-tick edit-learner-icon custom-tooltip"
                              onMouseDown={() => orgNameEditHandler()}
                            >
                              <span className="tooltiptext">Cancel</span>
                              close
                            </span>
                          </div>
                        </span>
                      )}
                    </div>
                    <div disabled={(userState.organizationReadonly && userState.inviteCodeGenerate) ? false : true} className="ml-auto">
                      <span className="subText text-nowrap mt-1 mr-3 text-uppercase">
                        Organization Invitation Code
                      </span>
                      <div className="d-flex">
                        <input
                          type={inviteCodeShown ? "text" : "password"}
                          id="inviteCode"
                          className="form-control mb-2 mr-3"
                          name="inviteCode"
                          {...register("inviteCode")}
                          disabled
                        />
                        <span
                          className="material-icons eye-icon"
                          onClick={toggleInviteCodeVisiblity}
                        >
                          {inviteCodeShown ? "visibility_off" : "visibility"}
                        </span>

                        <CopyToClipboard text={copyValue} onCopy={onCopy}>
                          <span className="material-icons mr-1 copy-icon mt-2 custom-tooltip">
                            <span className="tooltiptext">
                              Click here to copy
                            </span>
                            content_copy
                          </span>
                        </CopyToClipboard>
                        <span
                          onClick={generateNewCode}
                          className="material-icons reset-icon mr-1 ml-2 mt-2 custom-tooltip"
                        >
                          <span className="tooltiptext">
                            Click here to generate
                          </span>
                          autorenew
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Tabs>
                  <TabList>
                    <Tab onClick={getOrganizationDetails}>OVERVIEW</Tab>
                    <Tab>USERS</Tab>
                    <Tab>GROUPS</Tab>
                    <Tab>SECURITY</Tab>
                    {/* {organizationDetails.organizationTypeInfo?.type !==
                      OrganizationTypes.SERVICEPARTNER && <Tab>BILLING</Tab>} */}
                  </TabList>

                  <TabPanel>
                    <OrganizationOverviewTab
                      organizationDetails={organizationDetails}
                      getOrganizationDetails={getOrganizationDetails}
                      blockOrg={blockOrg}
                      unblockOrg={unblockOrg}
                    />
                  </TabPanel>

                  <TabPanel>
                    <OrganizationUsersTab
                      organizationDetails={organizationDetails}
                    />
                  </TabPanel>

                  <TabPanel>
                    <OrganizationGroups
                      organizationDetails={organizationDetails}
                    />
                  </TabPanel>

                  <TabPanel>
                    <OrganizationSecurity
                      organizationDetails={organizationDetails}
                    />
                  </TabPanel>

                  {/* {organizationDetails.organizationTypeInfo?.type !==
                    OrganizationTypes.SERVICEPARTNER && (
                    <TabPanel>
                      <OrganizationBilling />
                    </TabPanel>
                  )} */}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

let user = JSON.parse(localStorage.getItem("user"));

const roles = user.roleName;
var globalAdmin_Check = roles.includes("Global Admin");

const layout = !globalAdmin_Check
  ? WithLayout(OrganizationDetailsAdminComponent)
  : GlobalAdminLayOut(OrganizationDetailsAdminComponent);

export default layout;
