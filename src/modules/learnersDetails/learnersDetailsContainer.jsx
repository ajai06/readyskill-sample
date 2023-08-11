import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import WithLayout from "../../sharedComponents/hoc/withLayOut";
import DashboardHeaderComponent from "../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import GeneralInformation from "./generalInformation";
//API
import {
  getLearnersGeneralInformation,
  getLearnersOverviewDetails,
  getLearnersActivityDetails,
  getLearnersAssesmentDetails,
  getLearnerEnrolledServices,
  getLearnersAssesmentTopics,
  getMessageThreadDetails,
  getLearnerInstitutionId,
} from "../../services/learnersServices";
import {
  getLearnerStatus,
  getAllEnrolledPrograms,
} from "../../services/adminServices";
import logo from "../../assets/img/blankProfile.jpg";
import BadgesDetails from "./badgesDetails";
import LearnersProgress from "./learnersProgress";
import LearnersActivity from "./learnersActivity";
import "./learnersDetails.scss";
import LearnersAssesment from "./learnersAssesment";
import { OrganizationTypes } from "../../utils/contants";
import EnrolledServices from "./enrolledServices";
import { UserAuthState } from "../../context/user/userContext";
import LearnersSkills from "./learnersSkills";
import SpiderChart from "./spiderChart";
import { useIsMounted } from "../../utils/useIsMounted";
import LearnerNotesContainer from "../../sharedComponents/learnerNotes/learnerNotesContainer";
import { ConstText } from "../../utils/constantTexts";

function LearnersDetailsContainer() {
  const navigate = useNavigate();
  const { reset } = useForm({ mode: 'onChange' });
  const { id } = useParams();
  const [generalInformation, setGeneralInformation] = useState([]);
  const [learnerInformation, setLearnerInformation] = useState([]);
  const [badgeDetails, setBadgeDetails] = useState([]);
  const [learnerActivity, setLearnerActivity] = useState([]);
  const [learnerAssessment, setLearnerAssessment] = useState([]);
  const [learnerAssessmentTopics, setLearnerAssessmentTopics] = useState([]);
  const [enrolledServices, setEnrolledServices] = useState([]);
  const [institutionDetails, setInstitutionDetails] = useState();
  const [enrolledProgramsData, setEnrolledProgramsData] = useState();
  const userState = UserAuthState();
  const isMounted = useIsMounted();

  // Sample data
  const data = [
    { name: "THINKER", x: 20 },
    { name: "ORGANIZER", x: 22 },
    { name: "CREATOR", x: -32 },
    { name: "HELPER", x: -14 },
    { name: "PERSUADER", x: -51 },
    { name: "DOER", x: 16 },
  ];
  const category = [
    { name: "TRANSPORTATION", x: 20 },
    { name: "CHILDCARE", x: 22 },
    { name: "EDUCATION", x: -32 },
    { name: "HEALTHCARE", x: -14 },
    { name: "HOUSING", x: -51 },
    { name: "FOOD", x: 16 },
  ];

  useEffect(() => {
    if (isMounted()) {
      getLearnerDetails();
      getAllEnrolledProgramList();
      // getLearnerInstitutionDetails();
    }
  }, []);

  const getLearnerDetails = () => {
    getLearnerStatus(id)
      .then((response) => {
        if (response.data) {
          if (isMounted()) {
            let responseData = response.data;
            setLearnerInformation(responseData);
          }
        } else {
          setLearnerInformation([]);
        }
      })
      .catch((err) => console.log(err.response));
  };

  const getAllEnrolledProgramList = () => {
    getAllEnrolledPrograms(id)
      .then((response) => {
        if (isMounted()) {
          if (response.data.$values.length > 0) {
            let responseData = response.data.$values[0];
            setEnrolledProgramsData(responseData);
            if (responseData.institutionId) {
              getLearnerInstitutionDetails(responseData.institutionId);
            }
          } else {
            setEnrolledProgramsData();
          }
        }
      })
      .catch((err) => console.log(err.response));
  };

  const getLearnerInstitutionDetails = (id) => {
    getLearnerInstitutionId(id)
      .then((response) => {
        if (response.data) {
          if (isMounted()) {
            let responseData = response.data.organizationName;
            setInstitutionDetails(responseData);
          }
        }
      })
      .catch((err) => console.log(err.response));
  };

  const getcandidateGeneralInformation = () => {
    getLearnersGeneralInformation(id)
      .then((response) => {
        if (response.data) {
          if (isMounted()) {
            let responseData = response.data;
            setGeneralInformation(responseData);
          }
        } else {
          setGeneralInformation([]);
        }
      })
      .catch((err) => console.log(err.response));
  };


  const getLearnersOverview = () => {
    getLearnersOverviewDetails(id)
      .then((response) => {
        if (response.data) {
          if (isMounted()) {
            let badges = response.data.badges.$values;
            setBadgeDetails(badges);
          }
        } else {
          setBadgeDetails([]);
        }
      })
      .catch((err) => console.log(err));
  };

  const getLearnerActivity = () => {
    getLearnersActivityDetails(id)
      .then((response) => {
        if (response.data) {
          if (isMounted()) {
            let responseData = response.data.$values;
            setTimeout(() => {
              setLearnerActivity(responseData);
            }, 200);
          }
        } else {
          setLearnerActivity([]);
        }
      })
      .catch((err) => console.log(err));
  };

  const getLearnersAssesment = () => {
    getLearnersAssesmentTopics(id)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            setLearnerAssessmentTopics(res.data.$values);
            getAssesmentData(res.data.$values[0].id);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getAssesmentData = (topicId) => {
    getLearnersAssesmentDetails(id, topicId)
      .then(async (response) => {
        if (isMounted()) {
          setLearnerAssessment(response.data.$values);
        }
      })
      .catch((err) => console.log(err));
  };

  const getLearnerEnrolledDetails = () => {
    getLearnerEnrolledServices(id)
      .then((response) => {
        if (response.data) {
          if (isMounted()) {
            let responseData = response.data.$values;
            setEnrolledServices(responseData);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [editNoteMode, setEditNoteMode] = useState(false);

  // hide add or edit note input box
  const hideNoteInput = () => {
    setAddButtonClicked(false);
    setEditNoteMode(false);
    reset();
  };

  useEffect(() => {
    if (isMounted()) {
      getcandidateGeneralInformation();
      // getLearnersOverview();
      getLearnerActivity();
      getLearnersAssesment();
      getLearnerEnrolledDetails();
    }
  }, []);

  const toMessageCenter = () => {
    getMessageThreadDetails(userState.user.id, id)
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
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div id="main">
      <DashboardHeaderComponent headerText="Learners" />

      <div className="bread-crumb">
        <NavLink to="/portal/dashboard" className="smallText text-uppercase navlink">
          YOUR DASHBOARD
        </NavLink>
        <a
          className="smallText text-uppercase navlink cursor-enable"
          onClick={goBack}
        >
          {" >"} Learners
        </a>
        <a className="smallText text-uppercase navlink text-decoration-none active">
          {" >"} {learnerInformation.firstName} {learnerInformation.lastName}
        </a>
      </div>

      <div className="learner-component d-flex">
        <div className="col-xl-6 col-lg-6 col-md-6 mb-5 pr-2">
          <div className="card shadow learner-card">
            <div className="card-header bb-0 pb-0">
              <div className="d-flex">
                <div className="w-100 d">
                  {enrolledProgramsData?.isSponsoredProgram && (
                    <span className="learner-headTag learner-headTag-1 text-uppercase mr-3 px-3 py-0">
                      sponsored
                    </span>
                  )}
                  {/* <span className="learner-headTag text-uppercase mr-3 px-3 py-0">
                    SQL Certificate
                  </span> */}
                </div>
                {userState.messageThreadReadOnly && <div className="w-50 text-right">
                  <span
                    className="material-icons add-convo-icon mr-2 mt-1 cursor-pointer"
                    onClick={() => toMessageCenter()}
                  >
                    sms
                  </span>
                  <span className="subText">
                    Message {learnerInformation.firstName}
                  </span>
                </div>}
              </div>
              <div className="d-flex mt-3 mb-4">
                {generalInformation.uploadedImageUrl ? (
                  <img
                    src={generalInformation.uploadedImageUrl + '?' + Date.now()}
                    className="rounded-circle object-cover"
                    alt="Profile"
                    width="60"
                    height="60"
                  />
                ) : (
                  <img
                    src={logo}
                    className="rounded-circle object-cover"
                    alt="Profile"
                    width="60"
                    height="60"
                  />
                )}
                <div className="ml-3">
                  <p className="bigger-text text-capitalize mb-0">
                    {learnerInformation.firstName} {learnerInformation.lastName}
                  </p>
                  {
                    userState.programEnabled &&
                    <p className="subLearner-text text-uppercase">
                      {institutionDetails}
                    </p>
                  }

                </div>
              </div>

            </div>

            <Tabs>
              <TabList>
                <Tab>OVERVIEW</Tab>
                {userState.activityEnabled &&
                  <Tab>ACTIVITY</Tab>}
                {
                  (userState.organization_type === OrganizationTypes.SERVICEPARTNER
                    || userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER
                    || userState.role_GlobalAdmin)
                    ? userState.assessmentReadonly ? <Tab>ASSESSMENT</Tab> : ""
                    : userState.skillReadOnly ? <Tab>SKILLS</Tab> : ""
                }
                {userState.notesReadonly && <Tab>NOTES</Tab>}
              </TabList>

              <TabPanel>
                {enrolledProgramsData &&
                  userState.programEnabled &&
                  <LearnersProgress enrolledProgramsData={enrolledProgramsData} />}
                <BadgesDetails badges={badgeDetails} />
                <GeneralInformation generalData={generalInformation}
                  enrolledProgramsData={enrolledProgramsData} />
              </TabPanel>
              {userState.activityEnabled &&
                <TabPanel>
                  <LearnersActivity activityData={learnerActivity} />
                </TabPanel>}
              {
                (userState.organization_type === OrganizationTypes.SERVICEPARTNER
                  || userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER || userState.role_GlobalAdmin)
                  ?
                  userState.assessmentReadonly ? <TabPanel>
                    <LearnersAssesment assessmentTopics={learnerAssessmentTopics} assessmentData={learnerAssessment}
                      getAssesmentData={(topic) => getAssesmentData(topic)} />
                  </TabPanel> : ""
                  :
                  userState.skillReadOnly ?
                    <TabPanel>
                      <LearnersSkills learnerId={id} />
                    </TabPanel> : ""
              }

              {userState.notesReadonly && <TabPanel>
                <LearnerNotesContainer learnerId={id} />
              </TabPanel>}

            </Tabs>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 mb-5 pl-0">
          {userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
            userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER || userState.role_GlobalAdmin ? (
            <SpiderChart chartData={category} headerText="Category Status" />
          ) : (
            <SpiderChart chartData={data} headerText="Strength & Traits" />
          )}

          {(userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
            userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER ||
            userState.role_GlobalAdmin) && (userState.socialReadonly) ? (
            <EnrolledServices
              enrolledData={enrolledServices}
              headerText="Enrolled Services"
              cds={false}
            />
          ) : (userState.organization_type === OrganizationTypes.EMPLOYERPARTNER )? (
            <EnrolledServices
              className=""
              headerText="Career Development & Support"
              cds={true}
            />
          ) : ""}
          <div className="col-xl-12 col-lg-12 col-md-12 pb-3">
            <div className="card shadow role-card">
              <div className="card-body">
                <div
                  className="text-6 py-3 w-100 text-center"
                  style={{ color: "white" }}
                >
                  {ConstText.NODATA}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithLayout(LearnersDetailsContainer);
