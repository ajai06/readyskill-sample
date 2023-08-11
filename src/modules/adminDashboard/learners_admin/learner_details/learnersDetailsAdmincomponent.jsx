import React, { useState, useEffect, useRef } from "react";
import ReactTooltip from "react-tooltip";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  deleteProfileImage,
  getLearnerNameDetails,
  getLearnersGeneralInformation,
  updateProfileImage,
} from "../../../../services/learnersServices";
import {
  suspendUser,
  unSuspendUser,
} from "../../../../services/organizationServices";
import {
  getSocialServiceCount,
  getEducationAndSponsoredCount,
  getMessageThreadDetails,
  changeUserName,
  sentResetPasswordMail,
} from "../../../../services/adminServices";

import { UserAuthState } from "../../../../context/user/userContext";

import LearnersOverview from "./learner_overview_tab/learner_overview";
import LearnerBadges from "./learner_badges_tab/learnerBadges";
import LearnerAccountTab from "./learner_account_tab/learnerAccountTab";
import LearnerEducationTab from "./learner_education_tab/learnerEducationTab";
import LearnerActivityTab from "./learner_activity_tab/learnerActivityTab";
import LearnerSocialServiceTab from "./learner_socialService_tab/learnerSocialServiceTab";
import LearnerDevelopmentTab from "./learner_development_tab/learnerDevelopmentTab";
import LearnerContactsTab from "./learner_contacts_tab/learnerContactsTab";

import "react-tabs/style/react-tabs.css";
import "../../admindashboard.scss";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";
import { useIsMounted } from "../../../../utils/useIsMounted";
import logo from "../../../../assets/img/blankProfile.jpg";
import { clearAlert } from "../../../../utils/contants";

function LearnersDetailsAdminComponent({ refreshName }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm({ mode: "onChange" });

  const [learnerData, setLearnerData] = useState();
  const [suspendModalShow, setSuspendModalShow] = React.useState(false);
  const [unSuspendModalShow, setUnSuspendModalShow] = React.useState(false);
  const [resetPasswordModalShow, setResetPasswordModalShow] = useState(false);
  const [enrolledAndSponsoredCount, setCount] = useState({});
  const [socialServiceCount, setSocialCount] = useState(0);
  const [isSignIn, setSigninStatus] = useState(false);
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const isMounted = useIsMounted();
  const [addressInfo, setAddressInfo] = useState({});
  const [images, setImages] = useState("");
  const [messageModalShow, setMessageModalShow] = useState(false);


  useEffect(() => {
    if (isMounted()) {
      getLearnerInfo();
      // getLearnerSchoolInfo();
      getEnrolledAndSponsoredData();
      getSocialCount();
      getLearnerDetails();
    }
  }, []);

  const getEnrolledAndSponsoredData = () => {
    getEducationAndSponsoredCount(id)
      .then((res) => {
        if (res.data) {
          let response = res.data;
          if (response) {
            if (isMounted()) {
              setCount(response);
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getSocialCount = () => {
    getSocialServiceCount(id)
      .then((res) => {
        if (isMounted()) {
          if (res.data) {
            setSocialCount(res.data.count);
          } else {
            setSocialCount(0);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getLearnerInfo = () => {
    getLearnerNameDetails(id)
      .then((res) => {
        if (isMounted()) {
          setLearnerData(res.data);
          if (res.data.isActive && !res.data.isSuspended) {
            setSigninStatus(true);
          } else {
            setSigninStatus(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getLearnerSchoolInfo = async () => {

  //     let userIdList = {};
  //     userIdList["learnerIds"] = [id];

  //     try {
  //         let schoolList = await learnerSchoolList(userIdList);

  //     } catch (err) {
  //         console.log(err)
  //     }

  // }

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  const suspendOrganizationUser = () => {
    let params = {
      id: userState.user.id,
      UserId: learnerData.id,
      IsSuspended: true,
    };
    setSuspendModalShow(false);
    suspendUser(params)
      .then((res) => {
        if (isMounted()) {
          if (res.status === 200) {
            let timeOutId = setTimeout(() => {
              toast({ type: "success", text: res.data.message });
              getLearnerInfo();
            }, 500);
            timeOutIDs.current.push(timeOutId);
          } else {
            toast({ type: "error", text: res.data.message });
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const unSuspendOrganizationUSer = () => {
    let params = {
      id: userState.user.id,
      UserId: learnerData.id,
      IsSuspended: false,
    };
    setUnSuspendModalShow(false);
    unSuspendUser(params)
      .then((res) => {
        if (isMounted()) {
          if (res.status === 200) {
            setTimeout(() => {
              toast({ type: "success", text: res.data.message });
              getLearnerInfo();
            }, 500);
          } else {
            toast({ type: "error", text: res.data.message });
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const sentResetPassword = () => {
    let params = {
      applicationUserIds: [id],
    };
    setResetPasswordModalShow(false);
    sentResetPasswordMail(params)
      .then((res) => {
        if (isMounted()) {
          toast({ type: "success", text: res.data.message });
        }
      })
      .catch((err) => {
        console.log(err.response);
        if (isMounted()) {
          toast({ type: "error", text: err.response.data.message });
        }
      });
  };

  const toMessageCenter = () => {
    getMessageThreadDetails(userState.user.id, id)
      .then((res) => {
        if (isMounted()) {
          if (res.data) {
            let thread = res.data;
            navigate(`/portal/messagecenter`, { state: { thread } });
          } else {
            navigate(`/portal/messagecenter`);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const closeEditNameInput = () => {
    if (isMounted()) {
      reset();
      setUserNameEditable(false);
    }
  };

  const [isUsernameEditable, setUserNameEditable] = useState(false);

  const editUserName = () => {
    if (isMounted()) {
      setUserNameEditable(true);
      setValue("firstName", learnerData.firstName);
      setValue("lastName", learnerData.lastName);
    }
  };

  const editUserNameSubmit = (data) => {
    data["id"] = id;
    changeUserName(data)
      .then((res) => {
        if (isMounted()) {
          toast({ text: "User name updated", type: "success" });
          getLearnerInfo();
          refreshName();
          setUserNameEditable(false);
          reset();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //get learner details API call
  const getLearnerDetails = () => {
    const timestamp = Date.now();
    getLearnersGeneralInformation(id)
      .then((res) => {
        if (isMounted()) {
          setAddressInfo(res.data);
          if (res.data.uploadedImageUrl?.length > 0) {
            let profileImage = res.data.uploadedImageUrl + "?" + timestamp;
            setImages(profileImage);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const refreshAddress = () => {
    getLearnerDetails();
  };
  const refreshCount = () => {
    if (isMounted()) {
      getEnrolledAndSponsoredData();
      getSocialCount();
    }
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
    updateProfileImage(id, f)
      .then((res) => {
        if (res.status === 200) {
          if (isMounted()) {
            toast({
              type: "success",
              text: "Logo updated successfully",
              timeout: 2500,
            });
            getLearnerDetails()
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
      deleteProfileImage(id)
        .then((res) => {
          if (res.status === 200) {
            setImages("");
            toast({
              type: "success",
              text: "Logo deleted Successfully",
              timeout: 2500,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <React.Fragment>
      <input
        onChange={onChange}
        type="file"
        accept="image/png, image/gif, image/jpeg, image/jpg, image/jpe, image/bmp"
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
      <ConfirmationModal
        show={suspendModalShow}
        actionText="Block this user?"
        actionButton="Block"
        btnClassName="btn-danger"
        onHide={() => setSuspendModalShow(false)}
        onAction={suspendOrganizationUser}
      />
      <ConfirmationModal
        show={unSuspendModalShow}
        actionText="Unblock this user?"
        actionButton="Unblock"
        btnClassName="custom-btn-modal"
        onHide={() => setUnSuspendModalShow(false)}
        onAction={unSuspendOrganizationUSer}
      />
      <ConfirmationModal
        show={resetPasswordModalShow}
        actionText="send reset password mail?"
        actionButton="Send Mail"
        btnClassName="custom-btn-modal"
        onHide={() => setResetPasswordModalShow(false)}
        onAction={sentResetPassword}
      />
      <ConfirmationModal
        show={messageModalShow}
        actionText={
          <>
            navigate?
            <br />
            <span>
              It looks like you have been editing something. If you leave before
              saving, your changes will be lost
            </span>
          </>
        }
        actionButton="OK"
        btnClassName="custom-btn-modal"
        onHide={() => setMessageModalShow(false)}
        onAction={toMessageCenter}
      />
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-5 pr-2">
              <div className="card shadow learner-main-card">
                <div className="card-header pb-0 bb-0">
                  <div className="d-flex mt-3 mb-4">
                    <div className="d-grid  position-relative">

                      <img
                        // src={addressInfo?.uploadedImageUrl ? addressInfo.uploadedImageUrl : logo}
                        src={images?.length > 0 ? images : logo}
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
                    </div>
                    <div className="ml-3">
                      {isUsernameEditable ? (
                        <span className="d-flex">
                          <span>
                            <input
                              type="text"
                              id="firstName"
                              className="form-control mr-2"
                              placeholder="First Name"
                              {...register("firstName", { required: true })}
                            />
                            {errors.firstName ? (
                              <span className="error-msg">
                                First name required
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                          <span className="mr-4">
                            <input
                              type="text"
                              id="flastName"
                              className="form-control ml-3"
                              placeholder="Last Name"
                              {...register("lastName", { required: true })}
                            />
                            {errors.lastName ? (
                              <span className="error-msg ml-3 mt-1">
                                Last name required
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                          <span
                            className="material-icons text-white learner-control-icons mt-1 mr-2 custom-tooltip"
                            onClick={handleSubmit(editUserNameSubmit)}
                          >
                            <span className='tooltiptext'>Save Name</span>
                            save
                          </span>
                          <span
                            className="material-icons text-white learner-control-icons mt-1 custom-tooltip"
                            onClick={() => closeEditNameInput()}
                          >
                            <span className='tooltiptext'>Cancel</span>
                            close
                          </span>
                        </span>
                      ) : (
                        <span className="d-flex">
                          <p className="bigger-text text-capitalize mb-0">
                            {learnerData &&
                              learnerData.firstName +
                              " " +
                              learnerData.lastName}
                            <br />
                          </p>
                          <i
                            className="fa-regular fa-pen-to-square learner-control-icons mt-1 ml-3 h5 edit-icon edit-learner-icon custom-tooltip"
                            onClick={editUserName}
                          >
                            <span className='tooltiptext'>Edit name</span>
                          </i>
                        </span>
                      )}

                      <p className="subLearner-text text-uppercase mt-1">
                        {`${addressInfo.city?.length > 0
                          ? addressInfo.city + " ,"
                          : ""
                          } ${addressInfo.state?.length > 0 ? addressInfo.state : ""
                          }`}{" "}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {learnerData ? (
                        !learnerData.isSuspended ? (
                          <span
                            className="subText mr-3 function-links position-relative"
                            onClick={() => setSuspendModalShow(true)}
                          >
                            <span className="material-icons-outlined align-middle block-icon learner-block-icon mr-1 mt-0">
                              lock
                            </span>
                            Block Sign-In
                          </span>
                        ) : (
                          <span
                            className="subText mr-3 function-links"
                            onClick={() => setUnSuspendModalShow(true)}
                          >
                            <span className="material-icons unblock-icon text-success learner-block-icon mr-1">
                              lock_open
                            </span>
                            Unblock
                          </span>
                        )
                      ) : (
                        ""
                      )}
                      {learnerData &&
                        learnerData.loginMethods.includes("Local") ? (
                        <span
                          className={
                            !learnerData.isSuspended
                              ? "subText function-links mr-3"
                              : "subText mr-3 function-links opacity-50"
                          }
                          onClick={
                            !learnerData.isSuspended
                              ? () => setResetPasswordModalShow(true)
                              : undefined
                          }
                        >
                          <span className="material-icons renew-icon learner-reset-icon mr-1">
                            loop
                          </span>
                          Reset Password
                        </span>
                      ) : (
                        ""
                      )}

                      {userState.messageThreadReadOnly && <span
                        className="material-icons add-convo-icon mr-2 mt-1 cursor-pointer"
                        onClick={()=>setMessageModalShow(true)}
                      >
                        sms
                      </span>}
                      <span
                        className="subText msg-lrnr"
                        onClick={()=>setMessageModalShow(true)}
                      >
                        Message {learnerData && learnerData.firstName}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex mt-3 mb-4">
                    <div className="w-65 d">
                      {enrolledAndSponsoredCount.educationEnrolledCount > 0 && (
                        <span className="learner-headTag learner-headTag-1 text-uppercase mr-3 px-3 py-0">
                          EDUCATION
                        </span>
                      )}
                      {enrolledAndSponsoredCount.sponsoredProgramCount > 0 && (
                        <span className="learner-headTag text-uppercase mr-3 px-3 py-0">
                          SPONSORED
                        </span>
                      )}

                      {socialServiceCount > 0 && (
                        <span className="learner-headTag text-uppercase mr-3 px-3 py-0">
                          SERVICE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Tabs>
                  <TabList>
                    <Tab>OVERVIEW</Tab>
                    <Tab>ACCOUNT</Tab>
                    <Tab>EDUCATION</Tab>
                    <Tab>SERVICES</Tab>
                    <Tab>DEVELOPMENT</Tab>
                    <Tab>CONTACTS</Tab>
                    {userState.activityEnabled &&
                      <Tab>ACTIVITY</Tab>}

                    <Tab>BADGES</Tab>
                  </TabList>

                  <TabPanel>
                    <LearnersOverview refreshAddress={refreshAddress} />
                  </TabPanel>
                  <TabPanel>
                    <LearnerAccountTab isSignIn={isSignIn} />
                  </TabPanel>
                  <TabPanel>
                    <LearnerEducationTab refreshCount={refreshCount} />
                  </TabPanel>
                  <TabPanel>
                    <LearnerSocialServiceTab refreshCount={refreshCount} />
                  </TabPanel>
                  <TabPanel>
                    <LearnerDevelopmentTab />
                  </TabPanel>
                  <TabPanel>
                    <LearnerContactsTab />
                  </TabPanel>
                  {userState.activityEnabled &&
                    <TabPanel>
                      <LearnerActivityTab />
                    </TabPanel>}
                  <TabPanel>
                    <LearnerBadges />
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LearnersDetailsAdminComponent;
