import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useParams } from "react-router-dom";

import { useToastDispatch } from "../../../../../context/toast/toastContext";

// services
import {
  getLearnerStatus,
  getIpAddress,
  changeUserEmail,
} from "../../../../../services/adminServices";

import readyskill from "../../../../../assets/img/logos/readyskill.png";
import googleIcon from "../../../../../assets/img/logos/google.png";
import linkedin from "../../../../../assets/img/logos/linkedin.png";
import microsoft from "../../../../../assets/img/logos/MS365.png";
import { useForm } from "react-hook-form";
import { useIsMounted } from "../../../../../utils/useIsMounted";

function LearnerAccountTab({ isSignIn }) {
  const toast = useToastDispatch();
  const { id } = useParams();
  const [learnerDetail, setLearnerDetail] = useState();
  const [ipAddressLocation, setIpAddressLocation] = useState("");
  const [editUserName, setEditUserName] = useState(false);
  const isMounted = useIsMounted();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    getUserStatus();
  }, []);

  //get login status
  const getUserStatus = () => {
    getLearnerStatus(id)
      .then(async (res) => {
        let data = await res.data;
        if (isMounted()) {
          getIp(data.ipAddress);
          setLearnerDetail(data);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //get country from ip
  const getIp = (ip) => {
    getIpAddress(ip)
      .then((response) => {
        return response.json();
      })
      .then((obj) => {
        if (isMounted()) {
          setIpAddressLocation(obj.country_name);
        }
      });
  };

  //change username API call
  const submitNewUserName = (data) => {
    let reqData = {
      newEmail: data.registerEmail,
      oldEmail: learnerDetail.userName,
    };

    changeUserEmail(reqData)
      .then(async (res) => {
        let data = await res.data;
        if (res.data.isSuccess === true) {
          if (isMounted()) {
            setEditUserName(false);
            getUserStatus();
            toast({ type: "success", text: res.data.message });
          }
        } else {
          if (isMounted()) {
            toast({ type: "error", text: res.data.message });
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
          if (err?.response?.status === 400) {
            toast({
              type: "error",
              text: err?.response?.data.message
            });
          }
      });
  };

  //login methid logo render
  const renderSwitch = (param) => {
    switch (param) {
      case "Local":
        return <img className="mb-1" alt="Google sign-in" src={readyskill} />;
      case "Google":
        return <img className="mb-1" alt="Google sign-in" src={googleIcon} />;
      case "LinkedIn":
        return <img className="mb-1" alt="Google sign-in" src={linkedin} />;
      case "Microsoft":
        return (
          <img
            width="23px"
            className="mb-1"
            alt="Google sign-in"
            src={microsoft}
          />
        );

      default:
        return;
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

  const editUsernameHandler = () => {
    setValue("registerEmail", "")
    setEditUserName(false)
  }

  return (
    <div className="card-body learner-account-tab">
      <div className="col-10">
        <div className="row">
          <div className="col-6">
            <div className="d-flex">
              <div className="subHead-text-learner mb-2 text-uppercase mt-3">
                USER NAME
                {/* <span
                  className="material-icons ml-3 mr-0 text-white edit-icon edit-learner-icon"
                  onClick={() => setEditUserName(true)}
                >
                  edit
                </span> */}
                <i
                  className="fa-regular fa-pen-to-square ml-3 mr-0 text-white edit-icon edit-learner-icon custom-tooltip"
                  onClick={() => setEditUserName(true)}
                >
                  <span className='tooltiptext'>Edit</span>
                </i>
                {!learnerDetail?.emailConfirmed && (
                  <span
                    className="material-icons ml-3 text-white mt-0 warning-income-icon custom-tooltip"
                  >
                    <span className='tooltiptext'>This user has not verified their account</span>
                    warning
                  </span>
                )}
              </div>
            </div>

            {editUserName && (
              <form>
                <div className="d-flex">
                  <input
                    type="email"
                    id="register_email"
                    className={"form-control mb-2"}
                    placeholder="New Email"
                    {...register("registerEmail", {
                      required: true,
                      pattern:
                        /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      validate: (value) => value !== learnerDetail?.userName,
                    })}
                  />

                  <span
                    className="material-icons ml-3 text-white mt-2 edit-learner-tick mr-2 edit-learner-icon custom-tooltip"
                    onClick={handleSubmit(submitNewUserName)}
                  >
                    <span className='tooltiptext'>Save</span>
                    save
                  </span>
                  <span
                    className="material-icons ml-1 text-white mt-2 edit-learner-tick edit-learner-icon custom-tooltip"
                    onClick={() => editUsernameHandler()}
                  >
                    <span className='tooltiptext'>Cancel</span>
                    close
                  </span>
                </div>
                {errors.registerEmail?.type === "required" ? (
                  <span className="error-msg">Email required</span>
                ) : errors.registerEmail?.type === "pattern" ? (
                  <span className="error-msg">Enter valid email</span>
                ) : errors.registerEmail?.type === "validate" ? (
                  <span className="error-msg">
                    New email and existing email can not be same
                  </span>
                ) : (
                  ""
                )}
              </form>
            )}

            {!editUserName && (
              <div className="d-flex">
                <p className="inner-sub mb-3">{learnerDetail?.userName}</p>
              </div>
            )}
            <p className="subHead-text-learner mb-2 text-uppercase mt-3">
              SIGN-IN STATUS
            </p>
            <p className="inner-sub mb-3">
              <span className="d-flex">
                <span
                  className="material-icons unblock-icon list-fun-btns mr-2 custom-tooltip"
                >
                  <span className='tooltiptext'>Block</span>
                  lock_open
                </span>
                {isSignIn && learnerDetail?.emailConfirmed
                  ? "Allowed"
                  : isSignIn && !learnerDetail?.emailConfirmed
                    ? "Unverified"
                    : "Blocked"}
              </span>
            </p>

            <div className="d-flex mt-4">
              <p className="subHead-text-learner mb-2 text-uppercase">GROUPS</p>
              {/* <span className="material-icons ml-3 text-white mt-1 edit-learner-icon">
                edit
              </span> */}
            </div>
            <p className="inner-sub mb-3 text-capitalize">mobile users</p>
            {/* <p className="inner-sub mb-3 text-capitalize">enrolled learners</p> */}
            {/* <p className="inner-sub mb-3 text-capitalize">supported learners</p> */}
          </div>

          <div className="col-6">
            <p className="subHead-text-learner mb-2 text-uppercase mt-3">
              LOGINS
            </p>
            {learnerDetail?.loginMethods?.map((method, index) => (
              <div className="d-flex mb-3" key={index}>
                <div className="">{renderSwitch(method)}</div>
                {/* <span className="material-icons ml-3 mt-1 delete-login-icon">
                  delete
                </span> */}
              </div>
            ))}

            {!learnerDetail?.loginMethods && (
              <div className="d-flex mb-3">
                <div className="">{renderSwitch("Local")}</div>

                {/* <span className="material-icons ml-3 delete-login-icon">
                delete
              </span> */}
              </div>
            )}

            <p className="subHead-text-learner mb-2 text-uppercase mt-5">
              LAST LOGIN
            </p>
            {learnerDetail?.lastLoginDate && (
              <p className="inner-sub mb-1">
                {dateTimeFormatter(
                  learnerDetail?.lastLoginDate
                )?.toLocaleString("en-US", {
                  hour12: true,
                  month: "long", // numeric, 2-digit, long, short, narrow
                  day: "numeric", // numeric, 2-digit
                  year: "numeric", // numeric, 2-digit
                })}
              </p>
            )}
            {learnerDetail?.lastLoginDate && (
              <p className="inner-sub mb-3">
                {dateTimeFormatter(
                  learnerDetail?.lastLoginDate
                )?.toLocaleString("en-US", {
                  hour12: true,
                  hour: "2-digit", // numeric, 2-digit
                  minute: "2-digit", // numeric, 2-digit
                  second: "2-digit", // numeric, 2-digit
                })}
              </p>

            )}
            {learnerDetail?.ipAddress && (
              <div className="">
                {/* <ReactCountryFlag
                  countryCode={ipAddressLocation}
                  svg
                  className="mt-1 account-flag"
                /> */}

                <p className="inner-sub mb-1">
                  {learnerDetail?.ipAddress}
                </p>
                <p className="inner-sub mb-3"> {ipAddressLocation}</p>
              </div>
            )}
            {learnerDetail?.lastLoginMethod &&
              renderSwitch(learnerDetail?.lastLoginMethod)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnerAccountTab;
