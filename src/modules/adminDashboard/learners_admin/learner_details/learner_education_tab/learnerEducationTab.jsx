import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import Select from "react-select";

import { LeftArrow, RightArrow } from "./arrow";
import { Card } from "./card";
import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";

import { useToastDispatch } from "../../../../../context/toast/toastContext";

import {
  getOrganizationTypes,
  getAllUsers,
} from "../../../../../services/organizationServices";
import {
  getAllEnrolledPrograms,
  getEnrolledProgram,
  addNewProgram,
  editProgram,
  deleteProgram,
  getMessageThreadDetails,
} from "../../../../../services/adminServices";
import { OrganizationTypes } from "../../../../../utils/contants";

import "./hideScrollbar.css";
import { UserAuthState } from "../../../../../context/user/userContext";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { reactSelectCustomStyles } from "../../../../../assets/js/react-select-custom-styles";
import { careerPathwaySpecialization } from "../../../../../services/learnersServices";

function LearnerEducationTab({ refreshCount }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    clearErrors,
    setError,
    reset,
  } = useForm({ mode: "onChange" });

  const toast = useToastDispatch();
  const userState = UserAuthState();

  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);

  const [institutionalList, setInstitutionalList] = useState([]);
  const [insuranceList, setInsuranceList] = useState([]);
  const [counselorsList, setCounselorsList] = useState([]);
  const [programList, setProgramList] = useState([]);

  const [editData, setEditData] = useState();
  const [counselorValue, setCounselorValue] = useState();
  // const [btnDisable, setBtnDisable] = useState(false);
  const [instId, setInstId] = useState();
  const [counselorId, setCounselorId] = useState();
  const [isSponseredPgrmSelected, setSponseredPgrmSelected] = useState(false);
  const [messageModel, setMessageModalShow] = useState(false);
  const isMounted = useIsMounted();
  const [careerPathwayList, setCareerPathwayList] = useState([]);
  const [careerSpecialization, setCareerSpecialization] = useState([]);
  const pathway = watch("carrerPathway");

  useEffect(() => {
    if (isMounted()) {
      getAllInstitutions();

      careerPathwayDetails();
    }
  }, []);

  const getAllInstitutions = async () => {
    getOrganizationTypes()
      .then(async (res) => {
        if (isMounted()) {
          refreshCount();
          const knowledgeData = await res.data.find(
            (item) => item.type === OrganizationTypes.KNOWLEDGEPARTNER
          );
          const list = knowledgeData.organizationList.filter(
            (item) => item.isActive && !item.isSuspended
          );
          // console.log(list)
          setInstitutionalList(list);

          const employerData = res.data.find(
            (item) => item.type === OrganizationTypes.EMPLOYERPARTNER
          );
          // console.log(employerData)
          setInsuranceList(
            employerData.organizationList.filter(
              (item) => item.isActive && !item.isSuspended
            )
          );
          // console.log(employerData.organizationList.filter(item=>item.isActive&&!item.isSuspended))

          getAllPrograms(list);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllPrograms = (list) => {
    getAllEnrolledPrograms(id)
      .then(async (res) => {
        const data = res.data.$values;
        await data.map((item) => {
          if (list) {
            list.map((inst) => {
              if (inst.id === item.institutionId) {
                return (item.institutionName = inst.organizationName, item.logoUrl = inst.logoImage);
              }
            });
          }
        });
        setProgramList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addEnrollmentClick = () => {
    reset();
    setEditData();
    setCounselorId();
    // setBtnDisable(false);
    setInstId();
    setCounselorValue();
    setCounselorsList([]);
    setSponseredPgrmSelected(false);
    setEditMode(false);
    setAddMode(true);
  };

  const addNewEnrollment = (data) => {
    data["learnersId"] = id;
    addNewProgram(data)
      .then((res) => {
        getAllInstitutions();
        cancelProgramBtn();
        toast({ text: "New enrollment added successfully", type: "success" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeInstitution = (data) => {
    if (data === "") {
      return;
    }
    setInstId(data);
    // getAllUsers('D44F0ADA-B1B1-457C-AFA1-08D9BE260266')
    getAllUsers(data)
      .then((res) => {
        if (isMounted()) {
          const list = [];
          if (res.data) {
            res.data.map((item) =>
              list.push({
                value: item.id,
                label: item.firstName + " " + item.lastName,
              })
            );
            setCounselorsList(list);
            setCounselorValue("");
            setCounselorId();
            setValue("counselorId","")
            // setBtnDisable(false);
            // reset({ counselorId: "" });
          } else {
            // setBtnDisable(true);
            setCounselorsList([]);
            setCounselorValue("");
            setCounselorId();
            setValue("counselorId","")
            // reset({ counselorId: "" });
            toast({
              text: "No counselors found for the selected institution.",
              type: "warning",
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toMessageCenter = () => {
    getMessageThreadDetails(userState.user.id, counselorId)
      .then((res) => {
        if (res.data) {
          let thread = res.data;
          navigate(`/portal/messagecenter`, { state: { thread } });
        } else {
          navigate(`/portal/messagecenter`);
        }
      })
      .catch((err) => console.log(err));
  };

  const enrollmentClick = (id) => {
    getEnrolledProgram(id)
      .then((res) => {
        setEditData(res.data);
        patchEditData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const patchEditData = async (data) => {
    // console.log(data);
    setEditMode(true);
    setAddMode(false);

    clearErrors()

    setValue("institutionId", data.institutionId);
    setValue("enrollmentDate", data.enrollmentDate.split("T")[0]);
    setValue("programStartDate", data.programStartDate.split("T")[0]);
    setValue("graduationDate", data.graduationDate.split("T")[0]);
    setValue("carrerPathway", data.carrerPathway);

    setValue("isSponsoredProgram", data.isSponsoredProgram);
    setValue("sponsoredOrgID", data.sponsoredOrgID);
    setValue("counselorId", data.counselorId);
    setValue("learnersId", data.learnersId);
    if (data.carrerPathway?.length > 0) {
      //this is for displaying career specialization
      let specialization = careerPathwayList.filter(
        (obj) =>
          obj.carrerPathwayName.toLowerCase() ===
          data.carrerPathway.toLowerCase()
      );
      if (specialization?.length > 0) {
        setCareerSpecialization(specialization[0].careerSpecialization.$values);
        setValue("carrerSpecialization", data.carrerSpecialization);
      } else {
        setCareerSpecialization([]);
        setValue("carrerSpecialization", "");
      }
    } else {
      setCareerSpecialization([]);
      setValue("carrerSpecialization", "");
    }

    // changeInstitution(data.institutionId);
    setInstId(data.institutionId);
    setCounselorId(data.counselorId);
    setSponseredPgrmSelected(data.isSponsoredProgram);
    (async () => {
      try {
        // let res = await getAllUsers('D44F0ADA-B1B1-457C-AFA1-08D9BE260266');
        let res = await getAllUsers(data.institutionId);
        if (isMounted()) {
          if (res.data) {
            let list = [];
            res.data.map((item) =>
              list.push({ value: item.id, label: item.firstName })
            );
            setCounselorsList(list);
            const counselor = list.find(
              (item) => data.counselorId === item.value
            );
            setCounselorValue(counselor);
            // setBtnDisable(false);
          } else {
            setCounselorValue();
            toast({
              text: "No counselors found for the selected institution.",
              type: "warning",
            });
            // setBtnDisable(true);
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    })();
  };

  const enrollmentDateWatch = watch("enrollmentDate");
  const programStartDateWatch = watch("programStartDate");
  const graduationDateWatch = watch("graduationDate");

  useEffect(() => {
    if (programStartDateWatch > enrollmentDateWatch) {
      clearErrors("programStartDate");
    }
    if (graduationDateWatch > programStartDateWatch) {
      clearErrors("graduationDate");
    }
  }, [enrollmentDateWatch, programStartDateWatch, graduationDateWatch]);

  const handleChange = (selectedOption) => {
    if (isMounted()) {
      setCounselorValue(selectedOption);
      setCounselorId(selectedOption.value);
      setValue("counselorId", selectedOption.value);
      clearErrors("counselorId")
    }
  };

  const editEnrollment = (data) => {
    data["learnersId"] = id;
    data["id"] = editData.id;
    data["IsActive"] = true;
    // console.log(editData);
    // return;
    editProgram(editData.id, data)
      .then((res) => {
        if (isMounted()) {
          getAllInstitutions();
          // console.log(res)
          cancelProgramBtn()
          // enrollmentClick(editData.id);
          toast({ text: "Enrollment updated successfully", type: "success" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteEnrollment = () => {
    setModalShow(false);
    deleteProgram(editData.id)
      .then((res) => {
        if (isMounted()) {
          getAllInstitutions();
          cancelProgramBtn();
          toast({ text: "Enrollment deleted successfully", type: "success" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelProgramBtn = () => {
    if (isMounted()) {
      setAddMode(false);
      setEditMode(false);
      reset();
      setCounselorValue();
      setCounselorsList([]);
      setSponseredPgrmSelected(false);
      setEditData();
      setInstId();
      // setBtnDisable(false);
    }
  };

  function onWheel(apiObj, ev) {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }

  const careerPathwayDetails = (careerpathway) => {
    careerPathwaySpecialization()
      .then((res) => {
        if (res.data) {
          setCareerPathwayList(res.data.$values);
        }
      })
      .catch((err) => console.log(err));
  };
  const changeCareerPathWay = (e) => {
    setValue("carrerSpecialization", "");
    clearErrors("carrerSpecialization")
    if (e.target.value.length > 0) {
      let specialization = careerPathwayList.filter(
        (obj) =>
          obj.carrerPathwayName.toLowerCase() === e.target.value.toLowerCase()
      );
      setCareerSpecialization(specialization[0].careerSpecialization.$values);
    } else {
      setCareerSpecialization([]);
    }
  };
  return (
    <>
      <ConfirmationModal
        show={modalShow}
        actionText="delete this enrollment?"
        actionButton="Delete"
        btnClassName="btn-danger"
        onHide={() => setModalShow(false)}
        onAction={deleteEnrollment}
      />
      <ConfirmationModal
        show={messageModel}
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
      <div className="card-body">
        <div className="col-12">
          <div className="d-flex">
            <p className="subHead-text-learner mb-3 text-uppercase mt-2">
              ENROLLMENTS
            </p>

            <span className="ml-auto text-decoration-none d-flex">
              {
                <span className="material-icons mr-0 add-icon-grp ml-auto mt-1"
                  onClick={() => addEnrollmentClick()}>
                  add
                </span>

              }
              <p className="subText mt-1 ml-3 mb-0 mr-3">Add New Enrollment</p>
            </span>
          </div>
          <div className="container-fluid  pb-2 bb-1">
            <div className="education-tab-arrows">
              {programList.length > 0 ? (
                <ScrollMenu
                  LeftArrow={LeftArrow}
                  RightArrow={RightArrow}
                  onWheel={onWheel}
                >
                  {programList.map(
                    ({
                      id,
                      institutionName,
                      graduationDate,
                      programStartDate,
                      logoUrl
                    }) => (
                      <Card
                        itemId={id} // NOTE: itemId is required for track items
                        univ={institutionName}
                        startDate={programStartDate}
                        endDate={graduationDate}
                        key={id}
                        enrollmentClick={enrollmentClick}
                        currentActiveId={editData ? editData.id : ""}
                        logo={logoUrl}
                      />
                    )
                  )}
                </ScrollMenu>
              ) : (
                <div className="text-white text-center">No records found</div>
              )}
            </div>
          </div>

          {addMode || editMode ? (
            <div>
              <form>
                {addMode ? (
                  <h3 className="inner-head-large text-capitalize mb-4 mt-4">
                    Add New Enrollment
                  </h3>
                ) : (
                  <h3 className="inner-head mb-4 text-uppercase mt-4">
                    SELECTED ENROLLMENT
                  </h3>
                )}

                <div className="d-flex">
                  <div className="col-7 pl-0 pr-2">
                    <div className="">
                      <p className="subHead-text-learner mb-0 col-4 pl-0 mb-2">
                        INSTITUTION
                      </p>
                      <div className="d-flex skills-head w-100 mb-3">
                        <div className="dropdown skills-head w-100">
                          <div className="">
                            <select
                              defaultValue=""
                              className="text-capitalize caseworker-select mb-1 "
                              {...register("institutionId", {
                                onChange: (e) =>
                                  changeInstitution(e.target.value),
                                required: true,
                              })}
                            >
                              <option
                                value=""
                                className="caseworker-droplist text-capitalize"
                              >
                                Please select
                              </option>
                              {institutionalList &&
                                institutionalList.map((institution) => (
                                  <option
                                    key={institution.id}
                                    value={institution.id}
                                    className="caseworker-droplist text-capitalize"
                                  >
                                    {institution.organizationName}
                                  </option>
                                ))}
                            </select>
                          </div>
                          {errors.institutionId ? (
                            <span className="error-msg">
                              Please select Institution
                            </span>
                          ) : (
                            ""
                          )}
                        </div>

                      </div>

                    </div>
                    <div className="row">
                      <div className="col-4 mb-3">
                        <p className="subHead-text-learner mb-0 pl-0 mt-2 mb-2">
                          ENROLLMENT
                        </p>
                        <div className="d-flex date-box mb-1">
                          <input
                            type="date"
                            onKeyDown={(e) => e.preventDefault()}
                            {...register("enrollmentDate", { required: true })}
                            className="form-control"
                          />
                        </div>
                        {errors.enrollmentDate ? (
                          <span className="error-msg">
                            Please select Enrollment date
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="col-4 mb-3 date-box">
                        <p className="subHead-text-learner mb-0 pl-0 mt-2 mb-2">
                          START
                        </p>
                        <div className="d-flex">
                          <input
                            type="date"
                            className="form-control"
                            onKeyDown={(e) => e.preventDefault()}
                            {...register("programStartDate", {
                              required: true,
                              validate: (value) =>
                                value > watch("enrollmentDate"),
                            })}
                          />
                        </div>
                        {errors.programStartDate?.type === "required" ? (
                          <span className="error-msg">
                            Please select Start date
                          </span>
                        ) : errors.programStartDate?.type === "validate" ? (
                          <span className="error-msg">
                            Start date should be greater than Enrollment Date
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="col-4 mb-3">
                        <p className="subHead-text-learner mb-0 pl-0 mt-2 mb-2">
                          GRADUATION
                        </p>
                        <div className="d-flex date-box mb-1">
                          <input
                            type="date"
                            onKeyDown={(e) => e.preventDefault()}
                            {...register("graduationDate", {
                              required: true,
                              validate: (value) =>
                                value > watch("programStartDate"),
                            })}
                            className="form-control"
                          />
                        </div>
                        {errors.graduationDate?.type === "required" ? (
                          <span className="error-msg">
                            Please select Graduation date
                          </span>
                        ) : errors.graduationDate?.type === "validate" ? (
                          <span className="error-msg">
                            Graudation date should be greater than Start Date
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {instId ? (
                      <div className="mb-3">
                        <p className="subHead-text-learner pl-0 mb-2 mt-1">
                          COUNSELOR
                        </p>
                        <div className="">
                          <div className=" councelor-select dropdown ">
                            <Select
                              {...register("counselorId", { required: true })}
                              options={counselorsList}
                              value={counselorValue}
                              onChange={handleChange}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              placeholder={"Please select"}
                              styles={reactSelectCustomStyles}
                            />
                            {/* <select defaultValue="" className="text-capitalize caseworker-select text-center mb-4"
                                    {...register("counselorId", { onChange: (e) => setCounselorId(e.target.value), required: true })
                                    }
                                  >
                                    <option disabled value="" className="caseworker-droplist text-capitalize">Please select</option>
                                    {
                                      counselorsList.map(item => (
                                        <option key={item.id} value={item.id} className="caseworker-droplist text-capitalize">
                                          {item.firstName + ' ' + item.lastName}
                                        </option>
                                      ))
                                    }
                                  </select> */}
                          </div>
                          {counselorId && counselorValue && counselorsList.length > 0 && (
                            <div className="d-flex">
                              <span
                                className="material-icons add-convo-icon mt-2 mr-0 "
                                onClick={() => setMessageModalShow(true)}
                              >
                                sms
                              </span>{" "}
                              : ''
                              <p className="inner-head mt-2">
                                Message Counselor
                              </p>
                            </div>
                          )}
                        </div>

                        {errors.counselorId ? (
                          <span className="error-msg">
                            Please select Counselor
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-5 pl-4">
                    <div className="">
                      <p className="subHead-text-learner mb-2">
                        CAREER PATHWAY
                      </p>
                      <div className="skills-head mb-4">
                        <div className="dropdown skills-head">
                          <select
                            className="text-capitalize caseworker-select mb-1 "
                            {...register("carrerPathway", { required: true, onChange:(e)=>  changeCareerPathWay(e)})}
                            // onChange={(e) => changeCareerPathWay(e)}
                          >
                            <option
                              value=""
                              className="caseworker-droplist text-capitalize"
                            >
                              Please select
                            </option>
                            {careerPathwayList.map((obj) => (
                              <option
                                key={obj.id}
                                value={obj.carrerPathwayName}
                                className="caseworker-droplist text-capitalize"
                              >
                                {obj.carrerPathwayName}
                              </option>
                            ))}
                          </select>
                          {errors.carrerPathway ? (
                            <span className="error-msg"> Please select Career Pathway</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="">
                      <p className="subHead-text-learner mb-2">
                        CAREER SPECIALIZATION
                      </p>
                      <div className="skills-head  mb-4 ">
                        <div className="dropdown skills-head">
                          <select
                            className={"text-capitalize caseworker-select mb-1" + ( careerSpecialization?.length ? "" : " opacity-50")}
                            {...register("carrerSpecialization", {
                              required: watch("carrerPathway") ? true : false,
                            })}
                            disabled={
                              careerSpecialization?.length > 0 ? false : true
                            }
                          >
                            <option
                              value=""
                              className="caseworker-droplist text-capitalize"
                            >
                              Please select
                            </option>
                            {careerSpecialization.map((obj) => (
                              <option
                                key={obj.$id}
                                value={obj.careerSpecializaionName}
                                className="caseworker-droplist text-capitalize"
                              >
                                {obj.careerSpecializaionName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.carrerSpecialization ? (
                          <span className="error-msg"> Please select Career Specialization</span>
                        ) : (
                          ""
                        )}
                      </div>

                    </div>
                    <div className="">
                      <div className="form-check filter-checkboxes">
                        <p className="inner-head mb-0">Sponsored Program</p>
                        <label className="custom-control overflow-checkbox">
                          <input
                            className="form-check-input career-checkbox overflow-control-input"
                            type="checkbox"
                            {...register("isSponsoredProgram", {
                              onChange: (e) =>
                                setSponseredPgrmSelected(e.target.checked),
                            })}
                          />
                          <span className="overflow-control-indicator"></span>
                        </label>
                      </div>
                      <label className="form-check-label text-5"></label>

                      {isSponseredPgrmSelected ? (
                        <div className="w-100">
                          <p className="subHead-text-learner mb-2">
                            SPONSORING ORGANIZATION
                          </p>
                          <div className="dropdown skills-head ">
                            <select
                              defaultValue=""
                              className="text-capitalize caseworker-select mb-1"
                              {...register("sponsoredOrgID", {
                                required: isSponseredPgrmSelected
                                  ? true
                                  : false,
                              })}
                            >
                              <option
                                value=""
                                className="caseworker-droplist text-capitalize"
                              >
                                Please select
                              </option>
                              {insuranceList &&
                                insuranceList.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id}
                                    className="caseworker-droplist text-capitalize"
                                  >
                                    {item.organizationName}
                                  </option>
                                ))}
                            </select>
                          </div>

                          {errors.sponsoredOrgID ? (
                            <span className="error-msg mt-1">
                              Please select Insurance
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                      {errors.isSponsoredProgram ? (
                        <span className="error-msg"> Please select</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex ml-auto">
                  <a
                    type="button"
                    className="close-modal-btn ml-auto mt-1"
                    onClick={() => cancelProgramBtn()}
                  >
                    Cancel
                  </a>
                  {editMode ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger delete-enrollment-btn ml-3"
                        onClick={() => setModalShow(true)}
                      >
                        Delete
                      </button>
                      <button
                        // disabled={btnDisable}
                        type="button"
                        className="save-btn-custom ml-3"
                        onClick={handleSubmit(editEnrollment)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      // disabled={btnDisable}
                      type="button"
                      className="save-btn-custom ml-3"
                      onClick={handleSubmit(addNewEnrollment)}
                    >
                      Save
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default LearnerEducationTab;
