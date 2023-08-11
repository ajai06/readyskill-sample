import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, CloseButton } from "react-bootstrap";
import Select from "react-select";
// import {
//   getAllCaseWorkers
// } from "../../../../../services/adminServices";
import {
  getMessageThreadDetails,
  getAllStatusSocialService,
} from "../../../../../services/adminServices";
import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";

import { getAllUsers } from "../../../../../services/organizationServices";
import { useToastDispatch } from "../../../../../context/toast/toastContext";
import { UserAuthState } from "../../../../../context/user/userContext";

import "../../../admindashboard.scss";
import { useIsMounted } from "../../../../../utils/useIsMounted";

import { reactSelectCustomStyles } from "../../../../../assets/js/react-select-custom-styles";
import {
  getLocationByPartnerId,
  getResourceTypeByPartnerId,
} from "../../../../../services/locationService";

const LearnerAddsocialservicemodal = ({
  onHide,
  externalServiceProviders,
  readySkillServiceProviders,
  resources,
  flagData,
  createNewSocialService,
  updateSocial,
  copySocial,
  editData,
  copyData,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { id } = useParams();
  const navigate = useNavigate();

  const toast = useToastDispatch();
  const userState = UserAuthState();
  const isMounted = useIsMounted();

  const [messageModel, setMessageModalShow] = useState(false);
  const [caseWorkerValue, setCaseWorkerValue] = useState(null);
  const [caseWorkersOptions, setCaseWorkersOptions] = useState([]);
  const [caseWorkerDisabled, setCaseWorkerDisabled] = useState(true);
  const [caseWorkerId, setCaseworkerId] = useState();
  const [statusList, setStatusList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [partnerResourceList, setPartnerResourceList] = useState([]);

  const isProvider = watch("serviceProviderId");
  const isLocationSelected = watch("locationName");

  useEffect(() => {
    (async () => {
      try {
        let res = await getAllStatusSocialService();
        setStatusList(res.data.$values);
        if (editData) {
          PatchData(editData);
        }
        if (copyData) {
          patchCopyData(copyData);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [editData, copyData]);

  // useEffect(() => {
  //   if (editData) {
  //     PatchData(editData);
  //     console.log(editData)
  //   }
  // }, [editData]);

  // useEffect(() => {
  //   if (copyData) {
  //     patchCopyData(copyData);
  //   }
  // }, [copyData]);

  const setCaseWorker = (serviceProviderId) => {
    (async () => {
      try {
        let res = await getAllUsers(serviceProviderId);
        // console.log(res)
        if (isMounted()) {
          if (res.data) {
            let list = [];
            res.data.map(item => list.push({ value: item.id, label: item.firstName + ' ' + item.lastName }));
            setCaseWorkersOptions(list)
            setCaseWorkerValue('');
            setCaseworkerId('');
          } else {
            setCaseWorkersOptions([])
            setCaseWorkerValue('');
            setCaseworkerId('');
            toast({ text: "No case workers found for the selected service.", type: "warning" })
          }
        }
      } catch (error) {
        console.log(error)
      }
    })()
  };

  const setLocation = (partnerId) => {


    let organizationService = readySkillServiceProviders.find(item => item.id === partnerId);
    setLocationList([]);
    setPartnerResourceList([])
    setValue("locationName", "");
    setValue("serviceId", "");


    if (organizationService) {
      setLocationList([organizationService]);
      setPartnerResourceList(resources)
      setCaseWorker(partnerId)
      setCaseWorkerDisabled(false)
    } else {
      if (partnerId) {
        getLocationDetails(partnerId);
        getPartnerResourceTypes(partnerId);
        setCaseWorkersOptions([])
        setCaseWorkerDisabled(true);
        setValue("caseWorker", "")
        clearErrors("caseWorker")
      }
    }

  };

  const getLocationDetails = (partnerId, locationid) => {
    (async () => {
      try {
        let res = await getLocationByPartnerId(partnerId);
        if (isMounted()) {
          if (res.data.$values?.length > 0) {
            setLocationList(res.data.$values);
            setValue("locationId", locationid);
            console.log(isLocationSelected)
          } else {

          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const getPartnerResourceTypes = (partnerId, serviceid) => {
    getResourceTypeByPartnerId(partnerId)
      .then((res) => {
        if (res.data.$values?.length > 0) {
          if (isMounted()) {
            setPartnerResourceList(res.data.$values);
            setValue("serviceId", serviceid);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const selectCaseworker = (selectedData) => {
    setCaseWorkerValue(selectedData);
    setCaseworkerId(selectedData.value);
    setValue("caseWorker", selectedData.value);
    clearErrors("caseWorker")
  };

  const cancelModal = () => {
    reset({
      serviceProviderId: "",
      caseWorker: "",
      referalDate: "",
      startDate: "",
      completionDate: "",
    });
    onHide();
  };

  const PatchData = async (editData) => {
    console.log(editData)
    setValue("id", editData.id);
    setValue("serviceProviderId", editData.serviceProviderId);
    setValue("applicationUserId", id);
    setValue("organizationId", editData.serviceProviderId);
    setValue("status", editData.status);
    setValue("caseWorker", editData.caseWorker);
    setValue("postUserId", userState.user.id);
    setValue("referalDate", editData.referalDate.split("T")[0]);
    setValue("startDate", editData.startDate.split("T")[0]);
    setValue(
      "completionDate",
      editData.completionDate.split("T")[0] === "0001-01-01"
        ? ""
        : editData.completionDate.split("T")[0]
    );

    if (editData.serviceProviderId) {
      getLocationDetails(editData.serviceProviderId, editData.locationId);
      console.log(isLocationSelected)
      getPartnerResourceTypes(editData.serviceProviderId, editData.serviceId);
    }

    let organizationService = readySkillServiceProviders.find(item => item.id === (editData?.serviceProviderId));

    if (organizationService) {
      setCaseWorkerDisabled(false)
      setPartnerResourceList(resources)
      setValue("serviceId", editData.serviceId)
    } else {
      setCaseWorkerDisabled(true)
    }

    if (organizationService) {
      (async () => {
        try {
          let res = await getAllUsers(editData.serviceProviderId);
          if (isMounted()) {
            if (res.data) {
              let list = [];
              res.data.map(item => list.push({ value: item.id, label: item.firstName + ' ' + item.lastName }));
              setCaseWorkersOptions(list)
              const caseWorker = list.find(item => editData.caseWorker === item.value);
              setCaseWorkerValue(caseWorker)
            } else {
              setCaseWorkerValue();
              toast({ text: "No case workers found for the selected service.", type: "warning" })
            }
          }

        } catch (error) {
          console.log(error.response)
        }

      })()
    }


  };

  const patchCopyData = async (copyData) => {
    setValue("serviceProviderId", copyData.serviceProviderId);
    setValue("caseWorker", copyData.caseWorker);
    setValue("applicationUserId", id);
    setValue("organizationId", copyData.serviceProviderId);
    setValue("referalDate", new Date().toISOString().split("T")[0]);
    setValue("postUserId", userState.user.id);

    if (copyData.serviceProviderId) {
      getLocationDetails(copyData.serviceProviderId, copyData.locationId);
      getPartnerResourceTypes(copyData.serviceProviderId, copyData.serviceId);
    }

    let organizationService = readySkillServiceProviders.find(item => item.id === copyData?.serviceProviderId);

    if (organizationService) {
      setCaseWorkerDisabled(false)
      setPartnerResourceList(resources)
      setValue("serviceId", copyData.serviceId)
    }

    if (organizationService) {

      (async () => {
        try {
          let res = await getAllUsers(copyData.serviceProviderId);
          if (isMounted()) {
            if (res.data) {
              let list = [];
              res.data.map(item => list.push({ value: item.id, label: item.firstName + ' ' + item.lastName }));
              setCaseWorkersOptions(list)
              const caseWorker = list.find(item => copyData.caseWorker === item.value);
              setCaseWorkerValue(caseWorker)
            } else {
              setCaseWorkerValue();
              toast({ text: "No case workers found for the selected service.", type: "warning" })
            }
          }
        } catch (error) {
          console.log(error.response)
        }
      })()
    }

  };

  const onAddsubmit = (data) => {
    if (
      data.completionDate.length > 0 &&
      data.completionDate < data.startDate
    ) {
      toast({
        text: "Completion date should be greater than start date",
        type: "warning",
      });
      return;
    }
    createNewSocialService(data);
    cancelModal();
  };

  const onCopysubmit = (data) => {
    if (
      data.completionDate.length > 0 &&
      data.completionDate < data.startDate
    ) {
      toast({
        text: "Completion date should be greater than start date",
        type: "warning",
      });
      return;
    }
    copySocial(data);
    cancelModal();
  };

  const onEditsubmit = (data) => {
    // return console.log(data)
    if (data.completionDate === "") {
      data["completionDate"] = "0001-01-01";
    } else if (
      data.completionDate.length > 0 &&
      data.completionDate < data.startDate
    ) {
      toast({
        text: "Completion date should be greater than start date",
        type: "warning",
      });
      return;
    }
    updateSocial(data);
    cancelModal();
  };

  const getCoworkerMessage = () => {
    getMessageThreadDetails(userState.user.id, caseWorkerId)
      .then((res) => {
        setMessageModalShow(false);
        if (res.data) {
          let thread = res.data;
          navigate(`/portal/messagecenter`, { state: { thread } });
        } else {
          navigate(`/portal/messagecenter`);
        }
      })
      .catch((err) => console.log(err));
  };

  const getServiceprooviderNameFromId = () => {

    let organizationService = readySkillServiceProviders.find(item => item.id === (editData?.serviceProviderId || copyData?.serviceProviderId));

    if (organizationService) {
      return organizationService.organizationName
    } else {
      return externalServiceProviders?.find(obj => obj.id === copyData?.serviceProviderId || obj.id === editData?.serviceProviderId)?.partnerServiceName
    }
  }
  const getLocationFromId = () => {

    let organizationService = readySkillServiceProviders.find(item => item.id === (editData?.serviceProviderId || copyData?.serviceProviderId));

    if (organizationService) {
      return organizationService.city + ', ' + organizationService.state
    } else {
      let serviceProvider = (copyData?.locationName || editData?.locationName)
      return serviceProvider;
    }
  }

  return (
    <>
      {messageModel && (
        <ConfirmationModal
          show={messageModel}
          onHide={() => setMessageModalShow(false)}
          onAction={getCoworkerMessage}
          actionText="navigate? It looks like you have been editing something. If you leave before saving, 
          your changes will be lost.."
          actionButton="OK"
          btnClassName="custom-btn-modal"
        />
      )}
      {
        <Modal
          {...props}
          id="add-social-service"
          className="add-contact-modal add-ss-modal"
          size="lg"
        >
          <Modal.Header>
            <Modal.Title
              className="inner-head-large"
              id="contained-modal-title-vcenter"
            >
              {/* {flagData === "Add" ? `${flagData} New Service` : flagData === "Copy" ? "Copy Service" :  `Edit Service`} */}
              {flagData === "Add" ? `${flagData} New Service` : `Edit Service`}

            </Modal.Title>
            <CloseButton onClick={cancelModal} />
          </Modal.Header>
          <Modal.Body className="text-white">
            <div className="row">
              <div className="col-6">
                <div className="">
                  <p className="subHead-text-learner mr-2 mb-2">
                    Partner Service Name{" "}
                  </p>
                  {flagData === "Edit" || flagData === "Copy" ? (
                    <p>
                      {getServiceprooviderNameFromId()}
                    </p>
                  ) : (
                    <select
                      size="lg"
                      className={`text-capitalize text-capitalize h-25 ${flagData === "Edit" || flagData === "Copy"
                        ? "caseworker-select-2"
                        : "caseworker-select"
                        } mb-0`}
                      {...register("serviceProviderId", {
                        required: true,
                        onChange: (e) => setLocation(e.target.value),
                      })}
                      defaultValue=""
                    >
                      <option
                        value=""

                        className="caseworker-droplist text-capitalize"
                      >
                        Please Select
                      </option>
                      <optgroup label="Partner organization" className="text-secondary">
                        {readySkillServiceProviders.map((obj) => (
                          <option
                            key={obj.id}
                            className="assessment-droplist text-capitalize"
                            value={obj.id}
                          >
                            {obj.organizationName}{" "}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Service provider directory" className="text-secondary">
                        {externalServiceProviders.map((obj) => (
                          <option
                            key={obj.id}
                            className="assessment-droplist text-capitalize"
                            value={obj.id}
                          >
                            {obj.partnerServiceName}{" "}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  )}
                  <div className="">
                    {errors.serviceProviderId ? (
                      <span className="error-msg">Please Select Partner Service Name</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>


                <div className="mt-4  mb-4">
                  <p className="subHead-text-learner mb-2 mr-2">Location </p>
                  {flagData === "Edit" || flagData === "Copy" ? <p>
                    {getLocationFromId()}
                  </p> : <select
                    className={`text-capitalize ${isProvider ? 'caseworker-select' : 'caseworker-select cursor-text'}`}
                    {...register("locationName", {
                      required: watch("serviceProviderId") ? true : false,
                    })}
                    disabled={isProvider ? false : true}
                  >
                    <option
                      value=""
                      className="caseworker-droplist text-capitalize"
                    >
                      Please select
                    </option>
                    {locationList.map((obj) => (
                      <option
                        key={obj.id}
                        value={`${obj.city},${obj.state}`}
                        className="caseworker-droplist text-capitalize"
                      >
                        {obj.city}, {obj.state}
                      </option>
                    ))}
                  </select>}
                  <div className="">
                    {errors.locationName ? (
                      <span className="error-msg">Please Select Location</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="subHead-text-learner mb-2 mr-2">
                    Partner Resource Type{" "}
                  </p>
                  <select
                    className={`text-capitalize ${isLocationSelected || flagData === "Edit" || flagData === "Copy" ? 'caseworker-select' : 'caseworker-select cursor-text'}`}
                    {...register("serviceId", {
                      required: watch("locationName") ? true : false,
                    })}
                    disabled={isLocationSelected || flagData === "Edit" || flagData === "Copy" ? false : true}
                  >
                    <option
                      value=""
                      className="caseworker-droplist text-capitalize"
                    >
                      Please Select
                    </option>
                    {partnerResourceList.map((obj) => (
                      <option
                        key={obj.id}
                        value={obj.id}
                        className="caseworker-droplist text-capitalize"
                      >
                        {obj.serviceName}
                      </option>
                    ))}
                  </select>
                  <div className="">
                    {errors.serviceId ? (
                      <span className="error-msg">Please Select Partner Resource Type</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>


                {isProvider && (
                  <>
                    <div className="caseworker-section">
                      <p className="subHead-text-learner mb-2 mt-1 mr-2">
                        Case Worker{" "}
                      </p>
                      <div className="d-flex">
                        <div className="w-100 d-flex">
                          <Select
                            {...register("caseWorker", { required: caseWorkerDisabled ? false : true })}
                            value={caseWorkerValue}
                            options={caseWorkersOptions}
                            onChange={selectCaseworker}
                            className="basic-multi-select case-worker text-dark w-100"
                            classNamePrefix="select"
                            styles={reactSelectCustomStyles}
                            isDisabled={caseWorkerDisabled}
                          />
                          {
                            caseWorkerDisabled ? <span className="material-icons mr-0 ml-2 mt-1 cursor-pointer custom-tooltip">
                              <span className="tooltiptext">This field is disabled because the selected service provider is not a registered ReadySkill partner</span>
                              info
                            </span> : ""
                          }

                        </div>
                        {userState.messageThreadReadOnly && caseWorkerId && caseWorkersOptions.length > 0 && (
                          <span
                            className="material-icons add-convo-icon ml-2 mr-0 pointer mt-1 "
                            onClick={() => setMessageModalShow(true)}
                          >
                            sms
                          </span>
                        )}
                      </div>
                      {errors.caseWorker ? (
                        <span className="error-msg">Please select Case Worker</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="col-6">
                <div className="mb-2">
                  <p className="subHead-text-learner mb-1 pl-0 col-6">
                    Enrollment
                  </p>
                  <span className="modal-input-error date-box">
                    <input
                      type="date"
                      onKeyDown={(e) => e.preventDefault()}
                      {...register("referalDate", { required: true })}
                    />
                    {errors.referalDate ? (
                      <span className="error-msg">Please Select Enrollment Date</span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
                <div className="mb-2 mt-4">
                  <p className="subHead-text-learner mb-1 pl-0 col-6">Start</p>
                  <span className="modal-input-error date-box">
                    <input
                      type="date"
                      onKeyDown={(e) => e.preventDefault()}
                      {...register("startDate", {
                        required: true,
                        validate: (value) => value >= watch("referalDate"),
                      })}
                    />
                    {errors.startDate?.type === "required" ? (
                      <span className="error-msg">Please Select Start Date</span>
                    ) : errors.startDate?.type === "validate" ? (
                      <span className="error-msg">
                        {" "}
                        Start date should be greater than or equal to Referral
                        date
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
                <div className="mb-2 mt-4">
                  <p className="subHead-text-learner mb-1 pl-0 col-6">
                    Graduation
                  </p>
                  <span className="date-box">
                    <input
                      type="date"
                      className="w-100"
                      onKeyDown={(e) => e.preventDefault()}
                      {...register("completionDate", { validate: (value) => value ? value > watch("startDate") : true })}
                    />
                  </span>
                  {
                    errors.completionDate?.type === "validate"
                      ? <span className="error-msg" > Completion date should be greater than Start date</span>
                      : ''
                  }
                </div>

                <div className="mb-2 mt-4">
                  <p className="subHead-text-learner mb-1 pl-0 col-6">Status</p>
                  <select
                    {...register("status")}
                    name="status"
                    className="text-capitalize caseworker-select mb-4"
                  >
                    <option value="">Please Select</option>
                    {statusList.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="caseworker-droplist"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <a className="close-modal-btn mr-3" onClick={cancelModal}>
              Cancel
            </a>
            {flagData === "Add" && <Button
              type="button"
              className="btn save-btn-custom"
              onClick={handleSubmit(onAddsubmit)}
            >
              SUBMIT
            </Button>}
            {flagData === "Edit" && <Button
              type="button"
              className="btn  save-btn-custom"
              onClick={handleSubmit(onEditsubmit)}
            >
              Save
            </Button>}
            {flagData === "Copy" && <Button
              className="btn save-btn-custom"
              onClick={handleSubmit(onCopysubmit)}
            >
              Save
            </Button>}
          </Modal.Footer>
        </Modal>
      }
    </>
  );
};

export default LearnerAddsocialservicemodal;
