import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { UserAuthState } from "../../../../../context/user/userContext";

import { getAllUsers } from "../../../../../services/organizationServices";
import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";
import {
  hiringStatuses,
  OrganizationTypes,
} from "../../../../../utils/contants";

import { getLearnersGeneralInformation } from "../../../../../services/learnersServices";
import {
  getEducationEnrollment,
  getAllOrgizationsTypesList,
  getSocialService,
  upDateLearner,
  getLearnerStatus,
  getActivity,
  getMessageThreadDetails,
} from "../../../../../services/adminServices";
import { getOrganizationList } from "../../../../../services/organizationServices";
import { getExternalPartnerServices } from "../../../../../services/locationService";

import LearnerNotesContainer from "../../../../../sharedComponents/learnerNotes/learnerNotesContainer";
import EducationEnrollment from "./educationEnrollment";
import SupportServices from "./supportServices";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useToastDispatch } from "../../../../../context/toast/toastContext";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { State } from "country-state-city";

function LearnersOverview({ refreshAddress }) {
  const { id } = useParams();
  const userState = UserAuthState();

  const navigate = useNavigate();
  const toast = useToastDispatch();

  const orgId = userState.user.organization.organizationId;

  const [allCaseWorkers, setAllCaseWorkers] = useState([]);
  const [learnerInfo, setLearnerInfo] = useState();
  const [learnerDetail, setLearnerDetail] = useState();
  const [lastActivity, setAllLastActivity] = useState();
  const [enrollmentsList, setEnrollments] = useState([]);
  const [organizationList, setOrganization] = useState([]);
  const [externalServiceProviders, setExternalServiceProviders] = useState([]);
  const [readySKillServiceProviders, setReadySKillServiceProviders] = useState(
    []
  );
  const [socialList, setSocialList] = useState([]);
  const [editAddress, setEditAddress] = useState(false);
  const [editHousehold, setEditHousehold] = useState(false);
  const [editFinancial, setEditFinancial] = useState(false);
  const [selectedCaseWorker, setSelectedCaseWorker] = useState("");
  const [messageModel, setMessageModalShow] = useState(false);
  const isMounted = useIsMounted();
  const {
    register: registerAddres,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressError },
    setValue: setValueAddress,
    clearErrors: clearErrorsAddress,
  } = useForm({ mode: "onChange" });

  const {
    register: registerHousehold,
    handleSubmit: handleSubmitHousehold,
    formState: { errors: householdError },
    setValue: setValueHousehold,
    clearErrors: clearErrorsHousehold,
  } = useForm({ mode: "onChange" });

  const {
    register: registerFinancial,
    handleSubmit: handleSubmitFinancial,
    formState: { errors: financialError },
    setValue: setValueFinancial,
    clearErrors: clearErrorsFinancial,
  } = useForm({ mode: "onChange" });

  const {
    register: registerCaseWorker,
    setValue: setValueCaseWorker,
    getValues: getValuesCaseWorker,
  } = useForm({ mode: "onChange" });

  const { register: registerHiringStatus, setValue: setValueHiringStatus } =
    useForm({ mode: "onChange" });

  const { register: registerReviewStatus, setValue: setValueReviewStatus } =
    useForm({ mode: "onChange" });

  useEffect(() => {
    getAllUsersList();
    getLearnerDetails();
    getUserStatus();
    getActivityList();
    getEducationEnrollmentDetails();
    getOrganizations();
    getServiceProviders();
    getAllSocailService();
  }, []);

  //activity list API call
  const getActivityList = () => {
    getActivity(id)
      .then(async (res) => {
        let data = await res.data.$values;
        if (isMounted()) {
          data.sort(function (a, b) {
            return new Date(b.createdDate) - new Date(a.createdDate);
          });
          setAllLastActivity(data[0]);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //caseworkers list API call
  const getAllUsersList = () => {
    getAllUsers(orgId)
      .then((res) => {
        if (isMounted()) {
          setAllCaseWorkers(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Login status API call
  const getUserStatus = () => {
    getLearnerStatus(id)
      .then(async (res) => {
        let data = await res.data;

        if (isMounted()) {
          setLearnerDetail(data);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    if (learnerInfo?.primaryCaseWorkerId && allCaseWorkers) {
      setValueCaseWorker(
        "primaryCaseWorkerId",
        learnerInfo?.primaryCaseWorkerId
          ? learnerInfo?.primaryCaseWorkerId
          : "select"
      );
    }
  }, [learnerInfo, allCaseWorkers]);

  //get learner details API call
  const getLearnerDetails = () => {
    getLearnersGeneralInformation(id)
      .then((res) => {
        if (isMounted()) {
          setLearnerInfo(res.data);
          patchLearnerInfo(res.data, "all");
          // setValueAddress(
          //   "zipCode",
          //   res.data?.zipCode ? res.data?.zipCode : ""
          // );
          // setValueAddress(
          //   "address",
          //   res.data?.address ? res.data?.address : ""
          // );
          // setValueAddress("state", res.data?.state ? res.data?.state : "");
          // setValueAddress("city", res.data?.city ? res.data?.city : "");

          // setValueHousehold(
          //   "householdAdultCount",
          //   res.data?.householdAdultCount ? res.data?.householdAdultCount : ""
          // );
          // setValueHousehold(
          //   "householdSeniorsCount",
          //   res.data?.householdSeniorsCount
          //     ? res.data?.householdSeniorsCount
          //     : ""
          // );
          // setValueHousehold(
          //   "householdChildrenCount",
          //   res.data?.householdChildrenCount
          //     ? res.data?.householdChildrenCount
          //     : ""
          // );
          // setValueFinancial(
          //   "annualGrossIncome",
          //   res.data?.annualGrossIncome ? res.data?.annualGrossIncome : res.data?.annualGrossIncome === 0 ? 0 : ""
          // );
          // setValueHiringStatus("hiringStatus", res.data?.hiringStatus);

          // setValueReviewStatus(
          //   "reviewStatus",
          //   res.data?.reviewRequired ? res.data?.reviewRequired : ""
          // );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const patchLearnerInfo = (data, type) => {
    if (type === "headquarters" || type === "all") {
      setValueAddress("zipCode", data?.zipCode ? data?.zipCode : "");
      setValueAddress("address", data?.address ? data?.address : "");
      setValueAddress("state", data?.state ? data?.state : "");
      setValueAddress("city", data?.city ? data?.city : "");
    }

    if (type === "household" || type === "all") {
      setValueHousehold(
        "householdAdultCount",
        data?.householdAdultCount
          ? data?.householdAdultCount
          : data?.householdAdultCount === 0
            ? 0
            : ""
      );
      setValueHousehold(
        "householdSeniorsCount",
        data?.householdSeniorsCount
          ? data?.householdSeniorsCount
          : data?.householdSeniorsCount === 0
            ? 0
            : ""
      );
      setValueHousehold(
        "householdChildrenCount",
        data?.householdChildrenCount
          ? data?.householdChildrenCount
          : data?.householdChildrenCount === 0
            ? 0
            : ""
      );
    }

    if (type === "finance" || type === "all") {
      setValueFinancial(
        "annualGrossIncome",
        data?.annualGrossIncome
          ? data?.annualGrossIncome
          : data?.annualGrossIncome === 0
            ? 0
            : ""
      );
    }

    setValueHiringStatus("hiringStatus", data?.hiringStatus);

    setValueReviewStatus(
      "reviewStatus",
      data?.reviewRequired ? data?.reviewRequired : ""
    );
  };

  const [states, setStates] = useState([]);
  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
  }, []);

  //Get all organizations API call for institution name
  const getOrganizations = () => {
    getOrganizationList(userState.user.id)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let response = res.data;
            setOrganization(response);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //education enrollment API call
  const getEducationEnrollmentDetails = () => {
    getEducationEnrollment(id).then((res) => {
      if (res.data) {
        if (isMounted()) {
          let response = res.data.$values;
          setEnrollments(response);
        }
      }
    });
  };

  //service providers API call
  const getServiceProviders = () => {
    getAllOrgizationsTypesList()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let response = res.data.filter(
              (obj) => obj.type === OrganizationTypes.SERVICEPARTNER
            )[0].organizationList;
            setReadySKillServiceProviders(response);
          }
        }
      })
      .catch((err) => console.log(err));

    getExternalPartnerServices()
      .then((res) => {
        if (res.data.$values?.length > 0) {
          if (isMounted()) {
            let response = res.data.$values;
            setExternalServiceProviders(response);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  //social service API call
  const getAllSocailService = () => {
    getSocialService(id, 0, 0)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let response = res.data.socialServiceList.$values;
            setSocialList(response);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  //update API function calls based on fieldname
  const updateOverviewDataAddress = (data) => {
    data["editingFieldName"] = "ADDRESS";
    data["loggerInUserId"] = userState.user.id;
    // data["zipCode"] = data.zipCode.toString();
    updateOverviewData(data);
    // data.zipCode = data.zipCode.toString();
  };
  const updateOverviewDataHousehold = (data) => {
    data["editingFieldName"] = "HOUSEHOLD";
    data["loggerInUserId"] = userState.user.id;
    updateOverviewData(data);
  };
  const updateOverviewDataFinancial = (data) => {
    data["editingFieldName"] = "FINANCIAL";
    data["loggerInUserId"] = userState.user.id;
    updateOverviewData(data);
  };

  const updateOverviewDataCaseWorker = (data) => {
    let params = {
      editingFieldName: "PRIMARYCASEWORKER",
      loggerInUserId: userState.user.id,
      primaryCaseWorkerId: data === "select" ? null : data,
    };
    updateOverviewData(params);
  };

  const updateOverviewDataHiringStatus = (data) => {
    let params = {
      editingFieldName: "HiringStatus",
      loggerInUserId: userState.user.id,
      hiringStatus: parseInt(data),
    };
    updateOverviewData(params);
  };

  //update API  call
  const updateOverviewData = (params) => {
    upDateLearner(id, params)
      .then((res) => {
        if (isMounted()) {
          getLearnerDetails();
          console.log(res);
          if (params.editingFieldName === "ADDRESS") {
            setEditAddress(false);
            toast({
              type: "success",
              text: "Address updated successfully",
              timeout: 3000,
            });
            refreshAddress();
          } else if (params.editingFieldName === "HOUSEHOLD") {
            setEditHousehold(false);
            toast({
              type: "success",
              text: "Household updated successfully",
              timeout: 3000,
            });
          } else if (params.editingFieldName === "PRIMARYCASEWORKER") {
            toast({
              type: "success",
              text: "Primary case worker updated successfully",
              timeout: 3000,
            });
          } else if (params.editingFieldName === "HiringStatus") {
            toast({
              type: "success",
              text: "Hirig status updated successfully",
              timeout: 3000,
            });
          } else if (params.editingFieldName === "ReviewRequired") {
            toast({
              type: "success",
              text: "Review status updated successfully",
              timeout: 3000,
            });
          } else {
            setEditFinancial(false);
            toast({
              type: "success",
              text: "Finance updated successfully",
              timeout: 3000,
            });
          }
        }
      })
      .catch((err) => console.log(err));
  };

  // navigate to message center
  const toMessageCenter = () => {
    getMessageThreadDetails(
      userState.user.id,
      getValuesCaseWorker("primaryCaseWorkerId")
    )
      .then((res) => {
        if (res.data && isMounted()) {
          let thread = res.data;
          navigate(`/portal/messagecenter`, { state: { thread } });
        } else {
          navigate(`/portal/messagecenter`);
        }
      })
      .catch((err) => console.log(err));
  };

  //date formatter to lacal time
  const dateTimeFormatter = (data) => {
    if (data) {
      return new Date(
        new Date(data).getTime() -
        new Date(data).getTimezoneOffset() * 60 * 1000
      );
    }
  };

  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
   ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()
  };

  const updateReviewStatus = (checked) => {
    let params = {
      editingFieldName: "ReviewRequired",
      loggerInUserId: userState.user.id,
      reviewRequired: checked,
    };
    updateOverviewData(params);
  };

  const editAddressHandler = () => {
    patchLearnerInfo(learnerInfo, "headquarters");
    setEditAddress(false);
    clearErrorsAddress();
  };

  const editFinanceHandler = () => {
    patchLearnerInfo(learnerInfo, "finance");
    setEditFinancial(false);
    clearErrorsFinancial();
  };

  const editHouseholdHandler = () => {
    patchLearnerInfo(learnerInfo, "household");
    setEditHousehold(false);
    clearErrorsHousehold();
  };

  const handleChange = (evt) => {
    const zip = evt.target.value;
    if (zip.length >= 6) {
      let x = `${zip.slice(0, 5)}`;
      setValueAddress("zipCode", x);
      return
    }
    // if (evt.target.value[evt.target.value.length-1] >= 0 && evt.target.value[evt.target.value.length-1] <= 9) {
    //   return;
    // } else {
    //   let x = `${zip.slice(0, zip.length - 1)}`;
    //   setValueAddress("zipCode", x);
    // }
  };

  return (
    <div className="card-body">
      <ConfirmationModal
        show={messageModel}
        actionText="navigate? It looks like you have been editing something. 
If you leave before saving, your changes will be lost.."
        actionButton="OK"
        btnClassName="btn-success"
        onHide={() => setMessageModalShow(false)}
        onAction={toMessageCenter}
      />
      <div className="row">
        <div className="col-4">
          <p className="subHead-text-learner mb-4 text-uppercase mt-3">
            Platform Interactions
          </p>
          <div className="d-flex">
            <p className="inner-sub mb-1">Joined :</p>
            <p className="inner-sub text-capitalize ml-2 mb-0">
              {dateTimeFormatter(learnerInfo?.createdDate)?.toLocaleString(
                "en-US",
                {
                  month: "long", // numeric, 2-digit, long, short, narrow
                  day: "numeric", // numeric, 2-digit
                  year: "numeric", // numeric, 2-digit
                }
              )}
            </p>
          </div>
          <div className="d-flex">
            <p className="inner-sub mb-1">Last Login :</p>
            <p className="inner-sub text-capitalize ml-2 mb-0">
              {learnerDetail?.lastLoginDate
                ? dateTimeFormatter(
                  learnerDetail?.lastLoginDate
                )?.toLocaleString("en-US", {
                  month: "long", // numeric, 2-digit, long, short, narrow
                  day: "numeric", // numeric, 2-digit
                  year: "numeric", // numeric, 2-digit
                })
                : ""}
            </p>
          </div>
          <div className="d-flex">
            <p className="inner-sub mb-1">Last Activity :</p>
            <p className="inner-sub text-capitalize ml-2 mb-0">
              {lastActivity?.createdDate
                ? dateTimeFormatter(lastActivity?.createdDate)?.toLocaleString(
                  "en-US",
                  {
                    month: "long", // numeric, 2-digit, long, short, narrow
                    day: "numeric", // numeric, 2-digit
                    year: "numeric", // numeric, 2-digit
                  }
                )
                : ""}
            </p>
          </div>
          <p className="subHead-text-learner mb-4 text-uppercase mt-5">
            READYSKILL
          </p>
          <div className="form-check filter-checkboxes mb-3">
            <p className="inner-sub mb-0">Review Required</p>
            <label className="custom-control overflow-checkbox">
              <input
                className="form-check-input career-checkbox overflow-control-input"
                type="checkbox"
                {...registerReviewStatus("reviewStatus")}
                onChange={(e) => {
                  updateReviewStatus(e.target.checked);
                }}
              />
              <span className="overflow-control-indicator"></span>
            </label>
          </div>
          <div className="sm-block">
            <p className="inner-sub mb-2">Primary Caseworker</p>
            <div className="skills-head">
              <div className="dropdown skills-head">
                <div className="mb-2">
                  <select
                    className="text-capitalize caseworker-select"
                    {...registerCaseWorker("primaryCaseWorkerId")}
                    onChange={(e) => {
                      updateOverviewDataCaseWorker(e.target.value);
                    }}
                  >
                    <option
                      className="caseworker-droplist"
                      value="select"
                      defaultValue
                    >
                      Please Select
                    </option>
                    {allCaseWorkers &&
                      allCaseWorkers?.map((caseWorker) => (
                        <option
                          key={caseWorker.id}
                          value={caseWorker.id}
                          className="caseworker-droplist"
                        >
                          {caseWorker.firstName + " " + caseWorker.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {userState.messageThreadReadOnly && learnerInfo?.primaryCaseWorkerId &&
                userState?.user?.id !== learnerInfo?.primaryCaseWorkerId && (
                  <div className="d-flex mb-2">
                    <span
                      className="material-icons add-convo-icon mr-1"
                      onClick={() => setMessageModalShow(true)}
                    >
                      sms
                    </span>
                    )<p className="inner-head">Message Caseworker</p>
                  </div>
                )}
            </div>
          </div>
          <p className="inner-sub mb-0 mt-3">
            Education Enrollment
            <span className="learner-sub-count ml-2 mb-3">
              {enrollmentsList.length}
            </span>{" "}
            :
          </p>
          {enrollmentsList.length > 0 && organizationList.length > 0 && (
            <EducationEnrollment
              enrollments={enrollmentsList}
              organizations={organizationList}
            />
          )}
          <p className="inner-sub mb-0 mt-3">
            Support Services
            <span className="learner-sub-count ml-2 mb-3">
              {socialList.length}
            </span>{" "}
            :
          </p>
          {externalServiceProviders.length > 0 && socialList.length > 0 && (
            <SupportServices
              readySKillServiceProviders={readySKillServiceProviders}
              externalServiceProviders={externalServiceProviders}
              socialList={socialList}
            />
          )}

          <div className="sm-block">
            <p className="inner-sub mb-2 mt-3">Hiring Status</p>
            <div className="skills-head">
              <div className="dropdown skills-head">
                <div className="mb-2">
                  <select
                    className="text-capitalize caseworker-select"
                    {...registerHiringStatus("hiringStatus")}
                    onChange={(e) => {
                      updateOverviewDataHiringStatus(e.target.value);
                    }}
                  >
                    {hiringStatuses &&
                      hiringStatuses?.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                          className="caseworker-droplist"
                        >
                          {status.status}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-3">
          <form>
            <div className="d-flex">
              <p className="subHead-text-learner mb-4 text-uppercase mt-3">
                ADDRESS
              </p>
              {!editAddress && (
                <i
                  className="fa-regular fa-pen-to-square ml-3 text-white mt-3 edit-icon edit-learner-icon custom-tooltip"
                  onClick={() => setEditAddress(true)}
                >
                  <span className="tooltiptext">Edit</span>
                </i>
              )}

              {editAddress && (
                <div>
                  <span
                    className="material-icons ml-3 text-white mt-3 edit-learner-tick mr-2 edit-learner-icon custom-tooltip"
                    onClick={handleSubmitAddress(updateOverviewDataAddress)}
                  >
                    <span className="tooltiptext">Save</span>
                    save
                  </span>
                  <span
                    className="material-icons ml-1 text-white mt-3 edit-learner-tick edit-learner-icon custom-tooltip"
                    onClick={() => editAddressHandler()}
                  >
                    <span className="tooltiptext">Cancel</span>
                    close
                  </span>
                </div>
              )}
            </div>
            {!editAddress && (
              <p className="inner-sub text-capitalize mb-3">
                {learnerInfo?.address ? learnerInfo?.address : ""}
                <br />
                {learnerInfo?.city ? learnerInfo?.city : ""},{" "}
                {learnerInfo?.state ? learnerInfo?.state : ""}{" "}
                {learnerInfo?.zipCode ? learnerInfo?.zipCode : ""}
              </p>
            )}

            {editAddress && (
              <div className="col pl-0">
                <div className="form-outline">
                  {/* <label className="form-label subText" htmlFor="street1">
                    Street
                  </label>

                  <input
                    id="street1"
                    type="text"
                    className="form-control mb-2 w-90"
                    {...registerAddres("street1", {
                      required: true,
                    })}
                  />
                  <input
                    id="street2"
                    type="text"
                    className="form-control mb-2 w-90"
                    {...registerAddres("street2", {})}
                  />

                  <label
                    className="form-label subText text-nowrap"
                    htmlFor="State"
                  >
                    State
                  </label>
                  <div className="d-flex skills-head mt-0 w-100">
                    <div className="dropdown skills-head text-center w-100">
                      <div className="text-center mt-1 w-100">
                        <select
                          {...registerAddres("state", {})}
                          className="text-capitalize select-case caseworker-select mb-1 w-100"
                          onChange={(e) => {
                            setValueAddress("state", e.target.value);
                            registerAddres();
                          }}
                        >
                          <option
                            className="caseworker-droplist text-capitalize w-100"
                            value=""
                            disabled
                            defaultValue
                          >
                            Select your state
                          </option>
                          {states.map((state, index) => (
                            <option
                              key={index}
                              value={state.isoCode}
                              className="caseworker-droplist text-capitalize w-100"
                            >
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {addressError.state?.type === "required" ? (
                        <span className="error-msg">
                          State is required
                          <br />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <label
                    className="form-label subText text-nowrap mr-2"
                    htmlFor="city"
                  >
                    City
                  </label>

                  <input
                    type="text"
                    id="city"
                    className="form-control mb-2"
                    {...registerAddres("city", {
                      required: true,
                    })}
                  />

                  {addressError.city?.type === "required" ? (
                    <span className="error-msg">
                      City is required
                      <br />
                    </span>
                  ) : (
                    ""
                  )} */}
                </div>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Address"
                  {...registerAddres("address", {
                    required: true,
                  })}
                  // onKeyDown={(e) => checkKeyDown(e)}
                />
                {addressError.address?.type === "required" ? (
                  <span className="error-msg">Address required</span>
                ) : (
                  ""
                )}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="city"
                  {...registerAddres("city", {
                    required: true,
                  })}
                  // onKeyDown={(e) => checkKeyDown(e)}
                />
                {addressError.city?.type === "required" ? (
                  <span className="error-msg">City required</span>
                ) : (
                  ""
                )}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="State"
                  {...registerAddres("state", {
                    required: true,
                  })}
                  // onKeyDown={(e) => checkKeyDown(e)}
                />
                {addressError.state?.type === "required" ? (
                  <span className="error-msg">State required</span>
                ) : (
                  ""
                )}
                <span className="zip-input">
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Zip code"
                    maxLength={5}
                    pattern="[0-9]*"
                    // onChange={e => setValueAddress("zipCode", e.target.value.replace(/[^0-9]/g, ""))}
                    onInput={(event) => handleChange(event)}
                    // onKeyPress={removeLetter}
                    {...registerAddres("zipCode", {
                      required: true,
                      pattern: /^([0-9]{5}$)/,
                    })}

                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                    
                  />
                </span>
                {console.log(addressError)}
                {addressError.zipCode?.type === "required" ? (
                  <span className="error-msg">Zip code required</span>
                ) : addressError.zipCode?.type === "pattern" ? (
                  <span className="error-msg">Invalid zip code</span>
                ) : (
                  ""
                )}
              </div>
            )}
          </form>

          <form>
            <div className="d-flex">
              <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                HOUSEHOLD
              </p>
              {!editHousehold && (
                <i
                  className="fa-regular fa-pen-to-square ml-3 text-white mt-5 edit-icon custom-tooltip"
                  onClick={() => setEditHousehold(true)}
                >
                  <span className="tooltiptext">Edit</span>
                </i>
              )}

              {editHousehold && (
                <div>
                  <span
                    className="material-icons ml-3 text-white mt-5 edit-learner-tick mr-2 edit-learner-icon custom-tooltip"
                    onClick={handleSubmitHousehold(updateOverviewDataHousehold)}
                  >
                    <span className="tooltiptext">Save</span>
                    save
                  </span>
                  <span
                    className="material-icons ml-1 text-white mt-5 edit-learner-tick edit-learner-icon custom-tooltip"
                    onClick={() => editHouseholdHandler()}
                  >
                    <span className="tooltiptext">Cancel</span>
                    close
                  </span>
                </div>
              )}
            </div>
            {!editHousehold && (
              <div>
                <p className="inner-sub text-capitalize mb-1">
                  {learnerInfo && learnerInfo?.householdChildrenCount} Children
                </p>
                <p className="inner-sub text-capitalize mb-1">
                  {learnerInfo && learnerInfo?.householdAdultCount} Adult
                </p>
                <p className="inner-sub text-capitalize mb-1">
                  {learnerInfo && learnerInfo?.householdSeniorsCount} Senior
                </p>
              </div>
            )}

            {editHousehold && (
              <div>
                <label
                  className="form-label subText"
                  htmlFor="householdChildrenCount"
                >
                  Children
                </label>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Children"
                  min={0}
                  {...registerHousehold("householdChildrenCount", {
                    required: true,
                  })}
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                />
                {householdError.householdChildrenCount?.type === "required" ? (
                  <span className="error-msg">
                    Children count required
                    <br />
                  </span>
                ) : (
                  ""
                )}

                <label
                  className="form-label subText"
                  htmlFor="householdAdultCount"
                >
                  Adults
                </label>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Adults"
                  min={0}
                  {...registerHousehold("householdAdultCount", {
                    required: true,
                  })}
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                />
                {householdError.householdAdultCount?.type === "required" ? (
                  <span className="error-msg">
                    Adults count required
                    <br />
                  </span>
                ) : (
                  ""
                )}

                <label
                  className="form-label subText"
                  htmlFor="householdSeniorsCount"
                >
                  Senior
                </label>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Adults"
                  min={0}
                  {...registerHousehold("householdSeniorsCount", {
                    required: true,
                  })}
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                />
                {householdError.householdSeniorsCount?.type === "required" ? (
                  <span className="error-msg">
                    Seniors count required
                    <br />
                  </span>
                ) : (
                  ""
                )}
              </div>
            )}
          </form>

          <form>
            <div className="d-flex">
              <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                FINANCIAL
              </p>
              {!editFinancial && (
                <i
                  className="fa-regular fa-pen-to-square ml-3 text-white mt-5 edit-icon custom-tooltip "
                  onClick={() => setEditFinancial(true)}
                >
                  <span className="tooltiptext">Edit</span>
                </i>
              )}

              {editFinancial && (
                <div>
                  <span
                    className="material-icons ml-3 text-white mt-5 edit-learner-tick mr-2 edit-learner-icon custom-tooltip"
                    onClick={handleSubmitFinancial(updateOverviewDataFinancial)}
                  >
                    <span className="tooltiptext">Save</span>
                    save
                  </span>
                  <span
                    className="material-icons ml-1 text-white mt-5 edit-learner-tick edit-learner-icon custom-tooltip"
                    onClick={() => editFinanceHandler()}
                  >
                    <span className="tooltiptext">Cancel</span>
                    close
                  </span>
                </div>
              )}
            </div>
            <div className="">
              {!editFinancial && (
                <div className="">
                  <p className="inner-sub mb-0">Annual Income</p>
                  <div className="d-flex">
                    <p className="inner-sub text-capitalize mb-3 ">
                      ${learnerInfo && learnerInfo?.annualGrossIncome}
                    </p>
                    {learnerInfo &&
                      (learnerInfo?.annualGrossIncome ||
                        learnerInfo?.annualGrossIncome === 0) &&
                      learnerInfo?.annualGrossIncome <
                      learnerInfo?.annualIncomeTarget && (
                        <span className="material-icons ml-3 text-white mt-0 warning-income-icon custom-tooltip">
                          <span className="tooltiptext">{`This is $${learnerInfo.annualIncomeTarget} below target`}</span>
                          warning
                        </span>
                      )}
                  </div>
                </div>
              )}
              {editFinancial && (
                <div>
                  <label className="form-label subText" htmlFor="financial">
                    ANNUAL INCOME
                  </label>

                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Annual Income"
                    min={0}
                    {...registerFinancial("annualGrossIncome", {
                      required: true,
                    })}
                    onKeyDown={(e) => checkKeyDown(e)}
                  />
                  {financialError.annualGrossIncome?.type === "required" ? (
                    <span className="error-msg">
                      Annual Income required
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </form>
          <div className="">
            <p className="inner-sub mb-0">SNAP</p>
            <p className="inner-sub text-capitalize mb-3">YES</p>
          </div>
        </div>
        <div className="col-5">
          <LearnerNotesContainer learnerId={id} />
          {/* <LearnerNotesContainer learnerId={id} isAdminDashboard={true} /> */}
        </div>
      </div>
    </div>
  );
}

export default LearnersOverview;
