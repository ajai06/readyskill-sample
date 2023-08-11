import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";

//context
import { useToastDispatch } from "../../../../../context/toast/toastContext";

import {
  orgOverViewUpdate,
  getClassificationInfoDetails,
  getOrganizationInfo,
  updateLearningModel,
  updateServiceTypeModel,
  getOrganizationServiceTypes,
} from "../../../../../services/organizationServices";
import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";
import { GuidFormat, OrganizationTypes } from "../../../../../utils/contants";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { UserAuthState } from "../../../../../context/user/userContext";

const OrganizationOverviewTab = React.memo(
  ({ organizationDetails, getOrganizationDetails, blockOrg, unblockOrg }) => {
    const toast = useToastDispatch();

    const isMounted = useIsMounted();

    const [states, setStates] = useState([]);
    const [unlinkModalShow, setUnlinkModalShow] = React.useState(false);
    const userState = UserAuthState();

    const {
      register: registerHeadquarters,
      handleSubmit: handleSubmitHeadquarters,
      formState: { errors: headquartersError },
      setValue: setValueHeadquarters,
      getValues: getValuesHeadquarters,
      watch,
    } = useForm({ mode: "onChange" });

    const {
      register: registerZip,
      formState: { errors: zipError },
      setValue: setValueZip,
      handleSubmit: handleSubmitZip,
      getValues: getValuesZip,
      clearErrors: clearErrorZip
    } = useForm({ mode: "onChange" });

    const {
      register: registerMainPhone,
      formState: { errors: mainPhoneError },
      setValue: setValueMainPhone,
      handleSubmit: handleSubmitMainPhone,
      getValues: getValuesMainPhone,
      clearErrors: clearErrorMainPhone
    } = useForm({ mode: "onChange" });

    const {
      register: registerPrimaryContact,
      handleSubmit: handleSubmitPrimaryContact,
      formState: { errors: primaryContactError },
      setValue: setValuePrimaryContact,
      getValues: getValuesPrimaryContact,
      clearErrors: clearErrorPrimaryContact
    } = useForm({ mode: "onChange" });

    const {
      register: registerAdministrativeUserEmail,
      handleSubmit: handleSubmitAdministrativeUserEmail,
      formState: { errors: administrativeUserEmailError },
      setValue: setValueAdministrativeUserEmail,
      getValues: getValuesAdministrativeUserEmail,
      clearErrors: clearErrorAdministrativeUserEmail
    } = useForm({ mode: "onChange" });

    const {
      register: registerContactPhone,
      formState: { errors: contactPhoneError },
      setValue: setValueContactPhone,
      handleSubmit: handleSubmitContactPhone,
      getValues: getValuesContactPhone,
      clearErrors: clearErrorContactPhone
    } = useForm({ mode: "onChange" });

    const {
      register: registerWhoWeAre,
      handleSubmit: handleSubmitWhoWeAre,
      formState: { errors: WhoWeAreError },
      setValue: setValueWhoWeAre,
      getValues: getValuesWhoWeAre,
    } = useForm({ mode: "onChange" });

    const {
      register: registerOrgWebsite,
      handleSubmit: handleSubmitOrgWebsite,
      setValue: setValueOrgWebsite,
      getValues: getValuesOrgWebsite,
      formState: { errors: orgWebsiteError },
      clearErrors: clearErrorsOrgWebsite
    } = useForm({ mode: "onChange" });

    const {
      register: registerPublicDirectoryLink,
      handleSubmit: handleSubmitPublicDirectoryLink,
      formState: { errors: publicDirectoryLinkError },
      setValue: setValuePublicDirectoryLink,
      getValues: getValuesPublicDirectoryLink,
      clearErrors: clearErrorsPublicDirectoryLink,
    } = useForm({ mode: "onChange" });

    const {
      register: registerClassificationInformation,
      handleSubmit: handleSubmitClassificationInformation,
      setValue: setValueClassificationInformation,
      getValues,
    } = useForm({ mode: "onChange" });

    const {
      register: registerServiceType,
      handleSubmit: handleSubmitServiceType,
      setValue: setValueServiceType,
    } = useForm({ mode: "onChange" });

    const { register, setValue } = useForm({ mode: "onChange" });

    const [editHeadquarters, setEditHeadquarters] = useState(false);
    const [editPrimaryContact, setEditPrimaryContact] = useState(false);
    const [editWhoWeAre, setEditWhoWeAre] = useState(false);
    const [editOrgWebsite, setEditOrgWebsite] = useState(false);
    const [editPublicDirectoryLink, setEditPublicDirectoryLink] =
      useState(false);
    const [infoDetails, setInfoDetails] = useState([]);

    useEffect(() => {
      if (
        organizationDetails.organizationTypeInfo?.type ===
        OrganizationTypes.KNOWLEDGEPARTNER
      ) {
        getOrganizationInformation();
      } else if (
        organizationDetails.organizationTypeInfo?.type ===
        OrganizationTypes.EMPLOYERPARTNER
      ) {
        getClassificationInfo();
      } else if (
        organizationDetails.organizationTypeInfo?.type ===
        OrganizationTypes.SERVICEPARTNER
      ) {
        getOrganizationServiceType();
      }
      setOrganizationDetails();
    }, [organizationDetails]);

    useEffect(() => {
      // getOrganizationDetails();
    }, []);
    //update API function calls based on fieldname
    const updateHeadquarters = (data) => {
      const values = getValuesHeadquarters();
      const zip = getValuesZip();
      // const zip2 = getValuesZip2();
      const mainPhone = getValuesMainPhone();
      values["zip"] = zip.zip;
      // values["zip2"] = zip2.zip2;
      values["mainPhone"] = mainPhone.mainPhone;
      values["editingFieldName"] = "HEADQUARTERS";

      updateOverviewData(values);
    };
    const updatePrimaryContact = (data) => {
      const values = getValuesPrimaryContact();
      const administrativeUserEmail = getValuesAdministrativeUserEmail();
      const contactPhone = getValuesContactPhone();
      values["administrativeUserEmail"] =
        administrativeUserEmail.administrativeUserEmail;
      values["contactPhone"] = contactPhone.contactPhone;
      values["editingFieldName"] = "PRIMARYCONTACT";
      updateOverviewData(values);
    };

    const updateWhoWeAre = (data) => {
      const values = getValuesWhoWeAre();
      values["editingFieldName"] = "WHOWEARE";
      updateOverviewData(values);
    };
    const updateOrgWebsite = (data) => {
      const values = getValuesOrgWebsite();
      values["editingFieldName"] = "ORGANIZATIONWEBSITE";
      updateOverviewData(values);
    };
    const updatePublicDirectoryListing = (data) => {
      const values = getValuesPublicDirectoryLink();
      values["editingFieldName"] = "PUBLICDIRECTORYLISTING";
      updateOverviewData(values);
    };
    const unLinkPublicDirectoryListing = () => {
      let data = getValuesPublicDirectoryLink();
      data["editingFieldName"] = "PUBLICDIRECTORYLISTING";
      data["publicDirectoryLink"] = "";
      data["publicDirectoryText"] = "";
      setUnlinkModalShow(false);
      updateOverviewData(data);
      // public directory data binding
      setValuePublicDirectoryLink("publicDirectoryText", "");
      setValuePublicDirectoryLink("publicDirectoryLink", "");
    };
    const updateClassificationInformation = (id) => {
      let data = {
        editingFieldName: "CLASSIFICATIONINFORMATION",
      };
      if (id === "select") {
        data["industry"] = null;
      } else {
        data["industry"] = id;
      }
      updateOverviewData(data);
    };

    useEffect(() => {
      setStates(State.getStatesOfCountry("US"));
    }, []);

    useEffect(() => {
      if (infoDetails && organizationDetails.learningModelId) {
        setValue(
          "learningModelId",
          organizationDetails.learningModelId
            ? organizationDetails.learningModelId
            : GuidFormat.EMPTYGUID
        );
      }
      if (infoDetails && organizationDetails.serviceTypeId) {
        setValueServiceType(
          "serviceTypeId",
          organizationDetails.serviceTypeId
            ? organizationDetails.serviceTypeId
            : GuidFormat.EMPTYGUID
        );
      }
    }, [infoDetails, organizationDetails]);

    //update API  call
    const updateOverviewData = (params) => {
      params["organizationName"] = organizationDetails.organizationName;
      params["id"] = organizationDetails.id;
      orgOverViewUpdate(params)
        .then((res) => {
          if (isMounted()) {
            getOrganizationDetails();
            toast({
              type: "success",
              text: res.data.message,
            });

            if (params.editingFieldName === "ORGANIZATIONWEBSITE") {
              setEditOrgWebsite(false);
            } else if (params.editingFieldName === "WHOWEARE") {
              console.log("called to close");
              setEditWhoWeAre(false);
            } else if (params.editingFieldName === "PUBLICDIRECTORYLISTING") {
              if (
                params.publicDirectoryText.trim() !== "" &&
                params.publicDirectoryLink.trim() !== ""
              ) {
                setEditPublicDirectoryLink(false);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status === 400) {
            toast({
              type: "error",
              text: err.response.data,
            });
          }
        });
    };

    const handleChange = (evt) => {
      const id = evt.target.value;
      // const zip_code = (evt.target.validity.valid) ? evt.target.value : watch(id);

      const clearValue = clearNumber(id);

      if (clearValue.length >= 6) {
        let x = `${clearValue.slice(0, 5)}+${clearValue.slice(5, 9)}`;
        setValueZip("zip", x);
      } else {
        setValueZip("zip", clearValue);
      }
    };

    function clearNumber(value = "") {
      return value.replace(/\D+/g, "");
    }

    const setOrganizationDetails = () => {
      if (isMounted()) {
        //headquarters data binding
        // setValueHeadquarters("street1", organizationDetails.street1);
        setValueHeadquarters("address", organizationDetails.address);
        setValueHeadquarters("state", organizationDetails.state);
        setValueHeadquarters("city", organizationDetails.city);

        setValueZip("zip", organizationDetails.zip);
        // setValueZip2("zip2", organizationDetails.zip2);
        setValueMainPhone("mainPhone", organizationDetails.mainPhone);

        //Primary contact data binding
        setValuePrimaryContact(
          "administrativeUser",
          organizationDetails.administrativeUser
        );
        setValueAdministrativeUserEmail(
          "administrativeUserEmail",
          organizationDetails.administrativeUserEmail
        );
        setValueContactPhone("contactPhone", organizationDetails.contactPhone);

        //who we are data binding
        setValueWhoWeAre("description", organizationDetails.description);

        //website data binding
        setValueOrgWebsite("websiteUrl", organizationDetails.websiteUrl);

        // public directory data binding
        setValuePublicDirectoryLink(
          "publicDirectoryText",
          organizationDetails.publicDirectoryText
        );
        setValuePublicDirectoryLink(
          "publicDirectoryLink",
          organizationDetails.publicDirectoryLink
        );

        setValueClassificationInformation(
          "industry",
          organizationDetails.industry ? organizationDetails.industry : "select"
        );
      }
    };

    const getClassificationInfo = () => {
      getClassificationInfoDetails(organizationDetails.id)
        .then(async (res) => {
          let data = await res.data;
          if (isMounted()) {
            setInfoDetails(data);
            //classification info
            setValueClassificationInformation(
              "industry",
              organizationDetails.industry
                ? organizationDetails.industry
                : "select"
            );
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    };
    const getOrganizationInformation = () => {
      getOrganizationInfo(organizationDetails.id)
        .then(async (res) => {
          let data = await res.data;
          if (isMounted()) {
            setInfoDetails(data);
            //learningModelId
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    };

    const getOrganizationServiceType = () => {
      getOrganizationServiceTypes(organizationDetails.id)
        .then(async (res) => {
          let data = await res.data;
          if (isMounted()) {
            setInfoDetails(data);
            //learningModelId
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    };

    const updateOrganizationServiceTypes = (id) => {
      let params = {
        organizationName: organizationDetails.organizationName,
        id: organizationDetails.id,
        serviceTypeId: id !== GuidFormat.EMPTYGUID ? id : null,
      };
      updateServiceTypeModel(params)
        .then(async (res) => {
          if (isMounted()) {
            if (res.status === 204) {
              toast({
                type: "success",
                text: "Learning model updated successfully",
              });
              getOrganizationDetails();
            }
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    };

    //---------------- Organization Information update ----------------
    const updateOrganizationInfo = (id) => {
      let params = {
        organizationName: organizationDetails.organizationName,
        id: organizationDetails.id,
        learningModelId: id !== GuidFormat.EMPTYGUID ? id : null,
      };
      updateLearningModel(params)
        .then(async (res) => {
          if (isMounted()) {
            if (res.status === 204) {
              toast({
                type: "success",
                text: "Learning model updated successfully",
              });
              getOrganizationDetails();
            }
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    };

    const headQuarterEditHandler = (e, mode) => {
      e.preventDefault();
      setEditHeadquarters(mode);
      if (mode) {
        setValueHeadquarters("address", organizationDetails.address);
        setValueHeadquarters("state", organizationDetails.state);
        setValueHeadquarters("city", organizationDetails.city);
        setValueZip("zip", organizationDetails.zip);
        setValueMainPhone("mainPhone", organizationDetails.mainPhone);

        clearErrorMainPhone()
        clearErrorZip()
      }
    };
    const primaryContactEditHandler = (e, mode) => {
      e.preventDefault();
      setEditPrimaryContact(mode);
      if (mode) {
        setValuePrimaryContact(
          "administrativeUser",
          organizationDetails.administrativeUser
        );
        setValueAdministrativeUserEmail(
          "administrativeUserEmail",
          organizationDetails.administrativeUserEmail
        );
        setValueContactPhone("contactPhone", organizationDetails.contactPhone);

        clearErrorAdministrativeUserEmail(
          clearErrorContactPhone()
        )
      }
    };
    const publicDirectoryLinkEditHandler = (e, mode) => {
      e.preventDefault();
      setEditPublicDirectoryLink(mode);
      if (mode) {
        setValuePublicDirectoryLink(
          "publicDirectoryText",
          organizationDetails.publicDirectoryText
        );
        setValuePublicDirectoryLink(
          "publicDirectoryLink",
          organizationDetails.publicDirectoryLink
        );
        clearErrorsPublicDirectoryLink()
      }
    };
    const websiteEditHandler = (e, mode) => {
      e.preventDefault();
      setEditOrgWebsite(mode);
      if (mode) {
        setValueOrgWebsite("websiteUrl", organizationDetails.websiteUrl);

        clearErrorsOrgWebsite()
      }
    };
    const whoWeAreEditHandler = (e, mode) => {
      e.preventDefault();
      setEditWhoWeAre(mode);
      if (mode) {
        setValueWhoWeAre("description", organizationDetails.description);
      }
    };

    return (
      <div>
        {unlinkModalShow && (
          <ConfirmationModal
            show={unlinkModalShow}
            actionText={"unlink the public directory listing?"}
            actionButton="Unlink"
            btnClassName="btn-danger"
            onHide={() => setUnlinkModalShow(false)}
            onAction={() => unLinkPublicDirectoryListing()}
          />
        )}
        <div className="card-body org-overview-body mb-3" disabled={(userState.organizationReadonly && userState.organizationEdit) ? false : true}>
          <div className="row">
            <div className="col-6">
              <div className="d-flex">
                <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                  HEADQUARTERS
                </p>
                {!editHeadquarters && (
                  <i
                    className="fa-regular fa-pen-to-square cursor-pointer edit-icon ml-3 text-white mt-3 custom-tooltip"
                    onMouseDown={(e) => headQuarterEditHandler(e, true)}
                  >
                    {" "}
                    <span className="tooltiptext">Edit</span>
                  </i>
                )}
                {editHeadquarters && (
                  <div>
                    <span
                      className="material-icons ml-1 text-white mt-3 edit-learner-tick edit-learner-icon custom-tooltip"
                      onMouseDown={(e) => headQuarterEditHandler(e, false)}
                    >
                      <span className="tooltiptext">Cancel</span>
                      close
                    </span>
                  </div>
                )}
              </div>

              {!editHeadquarters && (
                <p className="inner-sub text-capitalize mb-3">
                  {organizationDetails?.address} <br />
                  {/* {organizationDetails?.street2} <br /> */}
                  {organizationDetails?.city}
                  {organizationDetails?.city && organizationDetails?.state
                    ? ","
                    : ""}{" "}
                  {organizationDetails?.state}{" "}
                  {organizationDetails?.zip ? organizationDetails?.zip : ""}
                  <br />
                  {organizationDetails?.mainPhone}
                </p>
              )}

              {editHeadquarters && (
                <div>
                  <label className="form-label subText" htmlFor="address">
                    Address
                  </label>

                  <input
                    id="address"
                    type="text"
                    className="form-control mb-2 w-90"
                    {...registerHeadquarters("address", {
                      required: true,
                    })}
                    onBlur={updateHeadquarters}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />

                  <div className="w-90">
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                        <div className="">
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
                                  {...registerHeadquarters("state", {})}
                                  className="text-capitalize select-case caseworker-select mb-1 w-100"
                                  onChange={(e) => {
                                    setValueHeadquarters(
                                      "state",
                                      e.target.value
                                    );
                                    updateHeadquarters();
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
                              {headquartersError.state?.type === "required" ? (
                                <span className="error-msg">
                                  State is required
                                  <br />
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <div className="">
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
                            {...registerHeadquarters("city", {
                              required: true,
                            })}
                            onBlur={updateHeadquarters}
                            onKeyPress={(e) =>
                              e.key === "Enter" && e.target.blur()
                            }
                          />

                          {headquartersError.city?.type === "required" ? (
                            <span className="error-msg">
                              City is required
                              <br />
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex w-60"></div>
                  </div>
                  <div className="w-90">
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                        <div className="">
                          <label
                            className="form-label subText mr-1"
                            htmlFor="zip"
                          >
                            ZIP
                          </label>
                          {/* <div className="d-flex"> */}
                          <div>
                            <input
                              type="text"
                              id="zip"
                              placeholder="- - - - + - - - -"
                              maxLength={10}
                              pattern="[0-9]*"
                              onInput={(event) => handleChange(event)}
                              className="form-control mb-2 pl-1 w-100"
                              {...registerZip("zip", {
                                required: true,
                                pattern: /^([0-9]{5})([+])([0-9]{4}$)/,
                              })}
                              onBlur={handleSubmitZip(updateHeadquarters)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && e.target.blur()
                              }
                            />

                            {zipError.zip?.type === "required" ? (
                              <span className="error-msg">
                                Zipcode is required
                                <br />
                              </span>
                            ) : zipError.zip?.type === "pattern" ? (
                              <span className="error-msg">
                                Invalid zip code
                                <br />
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                          {/* <p className="subText mr-1 mt-2">+</p> */}
                          {/* <div>
                              <input
                                id="zip2"
                                type="text"
                                className="form-control mb-2 mr-1 ml-3 w-90"
                                onInput={(event) => handleChange(event)}
                                maxLength={4}
                                pattern="[0-9]*"
                                {...registerZip2("zip2", {
                                  required: true,
                                  minLength: 4,
                                })}
                                onBlur={handleSubmitZip2(updateHeadquarters)}
                                onKeyPress={(e) =>
                                  e.key === "Enter" && e.target.blur()
                                }
                              />

                              {zip2Error.zip2?.type === "required" ? (
                                <span className="error-msg ml-3">
                                  Zipcode is required
                                  <br />
                                </span>
                              ) : zip2Error.zip2?.type === "minLength" ? (
                                <span className="error-msg ml-3">
                                  Invalid zip code
                                  <br />
                                </span>
                              ) : (
                                ""
                              )}
                            </div> */}
                          {/* </div> */}
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <div className="">
                          <label
                            className="form-label subText mr-1"
                            htmlFor="mainPhone"
                          >
                            Phone
                          </label>
                          <div className="w-100">
                            <input
                              type="text"
                              id="mainPhone"
                              className="form-control mb-2 mr-1 w-100"
                              {...registerMainPhone("mainPhone", {
                                required: true,
                                pattern:
                                  /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/,
                              })}
                              onBlur={handleSubmitMainPhone(updateHeadquarters)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && e.target.blur()
                              }
                            />
                            {mainPhoneError.mainPhone?.type === "required" ? (
                              <span className="error-msg">
                                Phone number is required
                                <br />
                              </span>
                            ) : mainPhoneError.mainPhone?.type === "pattern" ? (
                              <span className="error-msg">
                                Invalid phone number
                                <br />
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex">
                <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                  PRIMARY CONTACT
                </p>
                {!editPrimaryContact && (
                  <i
                    className="fa-regular fa-pen-to-square cursor-pointer edit-icon ml-3 text-white mt-3 custom-tooltip"
                    onMouseDown={(e) => primaryContactEditHandler(e, true)}
                  >
                    <span className="tooltiptext">Edit</span>
                  </i>
                )}
                {!organizationDetails?.administrativeUserEmailConfirmed && (
                  <span className="material-icons ml-2 text-white mt-3 mr-0 warning-income-icon custom-tooltip">
                    <span className="tooltiptext">
                      This user has not verified their account
                    </span>
                    warning
                  </span>
                )}
                {editPrimaryContact && (
                  <div>
                    <span
                      className="material-icons ml-1 text-white mt-3 edit-learner-tick edit-learner-icon custom-tooltip"
                      onMouseDown={(e) => primaryContactEditHandler(e, false)}
                    >
                      <span className="tooltiptext">Cancel</span>
                      close
                    </span>
                  </div>
                )}
              </div>

              {!editPrimaryContact && (
                <p className="inner-sub text-capitalize mb-3">
                  {organizationDetails?.administrativeUser} <br />
                  {organizationDetails?.administrativeUserEmail} <br />
                  {organizationDetails?.contactPhone}
                </p>
              )}

              {editPrimaryContact && (
                <div>
                  <label
                    className="form-label subText"
                    htmlFor="administrativeUser"
                  >
                    Name
                  </label>

                  <input
                    id="administrativeUser"
                    type="text"
                    className="form-control mb-2 w-90"
                    disabled
                    {...registerPrimaryContact("administrativeUser", {
                      required: true,
                    })}
                    onBlur={handleSubmitPrimaryContact(updatePrimaryContact)}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />
                  {primaryContactError.administrativeUser?.type ===
                    "required" ? (
                    <span className="error-msg">
                      Name is required
                      <br />
                    </span>
                  ) : (
                    ""
                  )}

                  <label
                    className="form-label subText"
                    htmlFor="administrativeUserEmail"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="administrativeUserEmail"
                    className={"form-control mb-2 w-90"}
                    {...registerAdministrativeUserEmail(
                      "administrativeUserEmail",
                      {
                        required: true,
                        pattern:
                          /^(([^<>()[\]\\.,;:+\s@"]+(\.[^<>()[\]\\.,;:+\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      }
                    )}
                    onBlur={handleSubmitAdministrativeUserEmail(
                      updatePrimaryContact
                    )}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />

                  {administrativeUserEmailError.administrativeUserEmail
                    ?.type === "required" ? (
                    <span className="error-msg">Email is required</span>
                  ) : administrativeUserEmailError.administrativeUserEmail
                    ?.type === "pattern" ? (
                    <span className="error-msg">Enter valid email</span>
                  ) : (
                    ""
                  )}

                  <label className="form-label subText" htmlFor="contactPhone">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    className="form-control mb-2 mr-1 w-90"
                    {...registerContactPhone("contactPhone", {
                      required: true,
                      pattern: /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/,
                    })}
                    onBlur={handleSubmitContactPhone(updatePrimaryContact)}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />
                  {contactPhoneError.contactPhone?.type === "required" ? (
                    <span className="error-msg">
                      Phone number is required
                      <br />
                    </span>
                  ) : contactPhoneError.contactPhone?.type === "pattern" ? (
                    <span className="error-msg">
                      Invalid phone number
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}

              <div className="d-flex">
                <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                  PUBLIC DIRECTORY LISTING
                </p>
                {!organizationDetails?.publicDirectoryLink &&
                  !editPublicDirectoryLink && (
                    <span
                      className="material-icons ml-3 text-white mt-3 edit-learner-icon custom-tooltip"
                      onMouseDown={(e) =>
                        publicDirectoryLinkEditHandler(e, true)
                      }
                    >
                      <span className="tooltiptext">Link</span>
                      link
                    </span>
                  )}

                {editPublicDirectoryLink && (
                  <div>
                    <span
                      className="material-icons ml-1 text-white mt-3 edit-learner-tick edit-learner-icon custom-tooltip"
                      onMouseDown={(e) => {
                        publicDirectoryLinkEditHandler(e, false);
                        clearErrorsPublicDirectoryLink();
                      }}
                    >
                      <span className="tooltiptext">Cancel</span>
                      close
                    </span>
                  </div>
                )}
                {!editPublicDirectoryLink &&
                  organizationDetails?.publicDirectoryLink && (
                    <span
                      className="material-icons ml-3 text-white mt-3 edit-learner-icon custom-tooltip"
                      onClick={() => setUnlinkModalShow(true)}
                    >
                      <span className="tooltiptext">Unlink</span>
                      link_off
                    </span>
                  )}
              </div>
              {!editPublicDirectoryLink &&
                organizationDetails?.publicDirectoryLink && (
                  <div>
                    <span
                      className="material-icons text-white custom-tooltip edit-learner-icon mr-2"
                      onClick={() => {
                        window.open(organizationDetails?.publicDirectoryLink);
                      }}
                    >
                      <span className="tooltiptext">Open Directory</span>
                      launch
                    </span>
                    <a
                      href={organizationDetails?.publicDirectoryLink}
                      target={"_blank"}
                      rel="noreferrer noopener"
                      className="subText"
                    >
                      {organizationDetails?.publicDirectoryText
                        ? organizationDetails?.publicDirectoryText
                        : organizationDetails?.publicDirectoryLink}
                    </a>
                    <a
                      href={organizationDetails?.publicDirectoryLink}
                      target={"_blank"}
                      rel="noreferrer noopener"
                    ></a>
                  </div>
                )}
              {editPublicDirectoryLink && (
                <div>
                  <input
                    type="text"
                    id="publicDirectoryText"
                    placeholder="Text to display"
                    className="form-control mb-2 mr-1 ml-1 mt-3"
                    {...registerPublicDirectoryLink("publicDirectoryText", {})}
                    onBlur={handleSubmitPublicDirectoryLink(
                      updatePublicDirectoryListing
                    )}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />
                  <input
                    type="text"
                    id="publicDirectoryLink"
                    placeholder="Link"
                    className="form-control mb-2 mr-1 ml-1 mt-3"
                    {...registerPublicDirectoryLink("publicDirectoryLink", {
                      required: true,
                      pattern:
                        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})+$/,
                    })}
                    onBlur={handleSubmitPublicDirectoryLink(
                      updatePublicDirectoryListing
                    )}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />
                  {publicDirectoryLinkError.publicDirectoryLink?.type ===
                    "required" ? (
                    <span className="error-msg">
                      Link is required
                      <br />
                    </span>
                  ) : publicDirectoryLinkError.publicDirectoryLink?.type ===
                    "pattern" ? (
                    <span className="error-msg">
                      Invalid URL
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}

              <div className="d-flex">
                <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                  ORGANIZATION WEB SITE
                </p>
                {!editOrgWebsite && (
                  <i
                    className="fa-regular fa-pen-to-square cursor-pointer edit-icon ml-3 mt-3 custom-tooltip"
                    onMouseDown={(e) => websiteEditHandler(e, true)}
                  >
                    <span className="tooltiptext">Edit</span>
                  </i>
                )}
                {editOrgWebsite && (
                  <div>
                    <span
                      className="material-icons ml-1 text-white mt-3 edit-learner-tick edit-learner-icon custom-tooltip"
                      onMouseDown={(e) => websiteEditHandler(e, false)}
                    >
                      <span className="tooltiptext">Cancel</span>
                      close
                    </span>
                  </div>
                )}
              </div>
              {!editOrgWebsite && (
                <div>
                  {organizationDetails?.websiteUrl && (
                    <span
                      className="material-icons text-white edit-learner-icon mr-2 custom-tooltip"
                      onClick={() => {
                        window.open(organizationDetails?.websiteUrl);
                      }}
                    >
                      <span className="tooltiptext">Open directory</span>
                      launch
                    </span>
                  )}
                  <a
                    href={organizationDetails?.websiteUrl}
                    target={"_blank"}
                    rel="noreferrer noopener"
                    className="subText"
                  >
                    {organizationDetails?.websiteUrl}
                  </a>
                  <a
                    href={organizationDetails?.websiteUrl}
                    target={"_blank"}
                    rel="noreferrer noopener"
                  ></a>
                </div>
              )}
              {editOrgWebsite && (
                <div>
                  <input
                    type="text"
                    id="contactPhone"
                    className="form-control mb-2 mr-1 w-90"
                    {...registerOrgWebsite("websiteUrl", {
                      pattern:
                        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})+$/,
                    })}
                    onBlur={handleSubmitOrgWebsite(updateOrgWebsite)}
                    onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                  />
                  {orgWebsiteError.websiteUrl?.type === "pattern" ? (
                    <span className="error-msg">
                      Invalid URL
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
            <div className="col-6">
              <div className="d-flex">
                <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                  ADDITIONAL INFORMATION
                </p>
              </div>
              <div className="d-flex">
                <div className="col-6 pl-0">
                  <p className="inner-sub mb-0 pb-1">Organization Type</p>
                  {/* Warning: A component is changing an uncontrolled input */}
                  <input
                    className="custom-input mt-0 cursor-auto"
                    disabled
                    value={
                      organizationDetails?.organizationTypeInfo?.type || ""
                    }
                  />
                  {/* Warning: A component is changing an uncontrolled input */}
                </div>
                {/* for service partner */}
                {organizationDetails.organizationTypeInfo?.type ===
                  OrganizationTypes.SERVICEPARTNER && (
                    <div className="col-6 pl-0">
                      <div className="sm-block">
                        <p className="inner-sub mb-1 mt-0">Service Type :</p>
                        <div className="d-flex skills-head">
                          <div className="dropdown skills-head text-center mb-1">
                            <div className="text-center">
                              <select
                                className="text-capitalize caseworker-select select-box-border mb-4"
                                {...registerServiceType("serviceTypeId")}
                                onChange={(e) => {
                                  updateOrganizationServiceTypes(e.target.value);
                                }}
                              >
                                <option
                                  className="caseworker-droplist"
                                  value={GuidFormat.EMPTYGUID}
                                >
                                  Please Select
                                </option>
                                {infoDetails.map((service, index) => (
                                  <option
                                    key={index}
                                    className="caseworker-droplist"
                                    value={service.id}
                                  >
                                    {service?.name?.length > 20
                                      ? service.name.substring(0, 20) + " ..."
                                      : service.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                {
                  //Knowledge Partner
                  organizationDetails.organizationTypeInfo?.type ===
                  OrganizationTypes.KNOWLEDGEPARTNER && (
                    <div className="col-6 pl-0">
                      <div className="sm-block ml-2">
                        <p className="inner-sub mb-1 mt-0 ml-2">
                          Learning Type :
                        </p>
                        <div className="d-flex skills-head ">
                          <div className="dropdown skills-head text-center mb-1 ml-2">
                            <div className="text-center">
                              <select
                                className="text-capitalize caseworker-select select-box-border mb-4"
                                {...register("learningModelId")}
                                onChange={(e) => {
                                  updateOrganizationInfo(e.target.value);
                                }}
                              >
                                <option
                                  className="caseworker-droplist"
                                  value={GuidFormat.EMPTYGUID}
                                >
                                  Please Select
                                </option>
                                {infoDetails.map((industry, index) => (
                                  <option
                                    key={index}
                                    className="caseworker-droplist"
                                    value={industry.id}
                                  >
                                    {industry?.name?.length > 20
                                      ? industry.name.substring(0, 20) + " ..."
                                      : industry.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  //Employer
                  organizationDetails.organizationTypeInfo?.type ===
                  OrganizationTypes.EMPLOYERPARTNER && (
                    <div className="col-6 pl-0">
                      <div className="sm-block ml-2">
                        <p className="inner-sub text-capitalize mb-1">
                          Industry
                        </p>
                        <div className="d-flex skills-head">
                          <div className="dropdown skills-head">
                            <div className="">
                              <select
                                className="text-capitalize caseworker-select select-box-border mb-4"
                                {...registerClassificationInformation(
                                  "industry"
                                )}
                                onChange={(e) => {
                                  updateClassificationInformation(
                                    e.target.value
                                  );
                                }}
                              >
                                <option
                                  className="caseworker-droplist"
                                  value={"select"}
                                  defaultValue
                                >
                                  Select your industry
                                </option>
                                {infoDetails.map((industry, index) => {
                                  if (
                                    industry.isEnabled ||
                                    getValues("industry") === industry.id
                                  ) {
                                    if (getValues("industry") === industry.id) {
                                      setValueClassificationInformation(
                                        "industry",
                                        organizationDetails.industry
                                          ? organizationDetails.industry
                                          : "select"
                                      );
                                    }
                                    return (
                                      <option
                                        key={index}
                                        className="d-inline-block  caseworker-droplist text-truncate"
                                        style={{ wordWrap: "break-word" }}
                                        value={industry.id}
                                        disabled={!industry.isEnabled}
                                      >
                                        {industry?.name?.length > 20
                                          ? industry.name.substring(0, 20) +
                                          " ..."
                                          : industry.name}
                                      </option>
                                    );
                                  }
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
              {/* <div className="d-flex">
              <p className="inner-head mb-2">PARTNER STATUS :</p>
              {
                <p
                  className={
                    !organizationDetails?.isSuspended
                      ? "inner-sub text-capitalize text-success mb-3 ml-2"
                      : "inner-sub text-danger text-capitalize mb-3 ml-2"
                  }
                >
                  {!organizationDetails?.isSuspended ? "ACTIVE" : "INACTIVE"}
                </p>
              }
            </div> */}
              <p className="inner-sub mb-2 mt-2">Partner Status</p>
              <div className="d-flex mb-3">
                <div>
                  <input
                    name="partnerStatus"
                    id="partnerActive"
                    type="radio"
                    className="custom-radio"
                    checked={!organizationDetails?.isSuspended || ""}
                    onChange={unblockOrg}
                  />
                  <label htmlFor="partnerActive" className="radio">
                    Active
                  </label>
                </div>
                <div className="ml-3">
                  {/* Warning: A component is changing an uncontrolled input  */}
                  <input
                    name="partnerStatus"
                    id="partnerInactive"
                    type="radio"
                    className="custom-radio"
                    checked={organizationDetails?.isSuspended || ""}
                    onChange={blockOrg}
                  />
                  {/* Warning: A component is changing an uncontrolled input  */}
                  <label htmlFor="partnerInactive" className="radio">
                    Inactive
                  </label>
                </div>
              </div>
              <form>
                <div className="d-flex mt-3">
                  <p className="subHead-text-learner mb-2 text-uppercase mt-3">
                    WHO WE ARE
                  </p>
                  {!editWhoWeAre && (
                    <i
                      className="fa-regular fa-pen-to-square cursor-pointer edit-icon ml-3 mt-3 mr-0 custom-tooltip"
                      onMouseDown={(e) => {
                        whoWeAreEditHandler(e, true);
                      }}
                    >
                      <span className="tooltiptext">Edit</span>
                    </i>
                  )}
                  {editWhoWeAre && (
                    <div>
                      <span
                        className="material-icons ml-1 text-white mt-3 edit-learner-tick edit-learner-icon custom-tooltip"
                        onMouseDown={(e) => {
                          whoWeAreEditHandler(e, false);
                        }}
                      >
                        <span className="tooltiptext">Cancel</span>
                        close
                      </span>
                    </div>
                  )}
                </div>

                {!editWhoWeAre && (
                  <p className=" subText mb-3">
                    {organizationDetails?.description
                      ? organizationDetails?.description
                      : "Provide a brief description of your organization for other partners on the ReadySkill platform."}
                  </p>
                )}
                {editWhoWeAre && (
                  <div>
                    <textarea
                      type="text"
                      id="description"
                      className="form-control mb-2 mr-1"
                      {...registerWhoWeAre("description", {})}
                      onBlur={(e) => {
                        console.log(e);
                        updateWhoWeAre();
                      }}
                      onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                    />
                  </div>
                )}
              </form>

              {/* Service partner */}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default React.memo(OrganizationOverviewTab);
