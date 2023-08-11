import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import WithLayout from "../../sharedComponents/hoc/withLayOut";
import DashboardHeaderComponent from "../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import InformationTrayComponent from "../../sharedComponents/informationTray/informationTrayComponent";
import { clearAlert, OrganizationTypes } from "../../utils/contants";
import {
  getImpactAndOutcomeTray,
  ServiceGetTrayInformation,
  getImpactAndOutcomeTrayCount
} from "../../services/impactAndOutcomeServices";
import "./impact.scss";
import { UserAuthState } from "../../context/user/userContext";

function ImpactAndOutcomesContainer() {
  const [informationTrayList, setInformationTray] = useState([]);
  const userState = UserAuthState();
  
  useEffect(() => {
    if (
      userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
      userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER ||
      userState.role_GlobalAdmin
    ) {
      serviceGetInformationTrayDetails();
    } else {
      getInformationTrayDetails();
    }
  }, []);

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  const getInformationTrayDetails = async () => {
    let params = {
      userType: OrganizationTypes.EMPLOYERPARTNER,
      page: "ImpactAndOutcome",
    };

    try {
      let response = await getImpactAndOutcomeTray(params);
      let responseData = await response.data.$values;
      const newArr = await Promise.all(responseData.map(async item => {
        if (item.apiEndPoint) {
          try {
            let res = await getImpactAndOutcomeTrayCount(item.apiEndPoint, userState.user.id);
            item.count = res.data;
            return item;
          } catch (error) {
            console.log(error)
          }
        } else {
          item.count = 0;
          return item;
        }
      }));
      setInformationTray(newArr)
    } catch (error) {
      console.log(error)
    }
  };

  const serviceGetInformationTrayDetails = async () => {
    let params = {
      userType: OrganizationTypes.SERVICEPARTNER,
      page: "ImpactAndOutcome",
    };

    try {
      let response = await ServiceGetTrayInformation(params);
      let responseData = await response.data.$values;
      const newArr = await Promise.all(responseData.map(async item => {
        if (item.apiEndPoint) {
          try {
            let res = await getImpactAndOutcomeTrayCount(item.apiEndPoint, userState.user.id);
            item.count = res.data;
            return item;
          } catch (error) {
            console.log(error)
          }
        } else {
          item.count = 0;
          return item;
        }
      }));
      setInformationTray(newArr)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="impact-main">
      <div className="impact-top pl-200">
        <DashboardHeaderComponent headerText="Impact & Outcomes" />
        <div className="bread-crumb">
          <NavLink
            to="/portal/dashboard"
            className="smallText text-uppercase navlink"
          >
            YOUR DASHBOARD
          </NavLink>
          <NavLink
            to="/portal/impactandoutcomes"
            className="smallText text-uppercase navlink"
          >
            {" >"} Impact & Outcomes
          </NavLink>
        </div>
        <InformationTrayComponent trayInformation={informationTrayList} />
        {userState.organization_type !== OrganizationTypes.SERVICEPARTNER &&
          userState.organization_type !==
          OrganizationTypes.KNOWLEDGEPARTNER && (
            <div className="col-9">
              <div className="card impact-track">
                {/* comment for now */}
                <div className="card-body d-flex">
                  {/* <i className="material-icons impact-track-icon">light_mode</i>
                <div>
                  <p className='subText text-uppercase mb-0'>goal :  place 57 new employees by oct 2021</p>
                  <p className='impact-track-text'>You are <span className="on-track">on track</span> to meet your goal by October 2021</p>
                </div> */}
                  <div className="subText text-uppercase mb-0">
                    This is the page to show impact and outcome and there is not
                    enough data to calculate
                  </div>
                </div>
              </div>
              {/* <div className="">graph</div> */}
            </div>
          )}

        {/* SERVICES GOAL CARD */}
        {(userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
          userState.organization_type ===
          OrganizationTypes.KNOWLEDGEPARTNER) && (
            <div className="col-9">
              <div className="card impact-track">
                <div className="card-body d-flex">
                  {/* <i className="material-icons impact-track-icon">light_mode</i>
                <div>
                  <div className="d-flex">
                    <p className="subText text-uppercase mb-0">
                      goal : increase income for 10,000 by 10%+ by 2021
                    </p>
                    <div className="ml-auto">
                      <select
                        name="cars"
                        id="cars"
                        className="text-capitalize assessment-head "
                      >
                        <option value="volvo" className="goals-droplist">
                          Platform Goal
                        </option>
                        <option value="saab">Assessment Link 1</option>
                        <option value="opel"> Link 2</option>
                        <option value="audi">Link 3</option>
                      </select>
                    </div>
                  </div>
                  <p className="impact-track-text">
                    You are <span className="on-track">on track</span> to meet
                    your goal by October 2021
                  </p>
                </div> */}
                  <div className="subText text-uppercase mb-0">
                    This is the page to show impact and outcome and there is not
                    enough data to calculate
                  </div>
                </div>
              </div>
              {/* <div className="">graph</div> */}
            </div>
          )}
        {/* SERVICES GOAL CARD ENDS*/}

        {/* <div className="col-9">
          <div className="card impact-rates">
            <div className="card-body d-flex">
              <div className="col-6 d-flex">
                <i className="material-icons impact-track-icon">light_mode</i>
                <p className="grad-rates">
                  Graduations rates are <br />
                  <span className="grad-rates-bot">
                    18% higher in sponsered programs
                  </span>
                </p>
              </div>
              <div className="col-6">graph</div>
            </div>
          </div>
        </div> */}
      </div>
      <div className="impact-bottom pl-200 d-none">
        {/* {userState.organization_type !== OrganizationTypes.SERVICEPARTNER &&
          userState.organization_type !==
            OrganizationTypes.KNOWLEDGEPARTNER && (
            <div className="col-9 pt-150 mb-3">
              <div className="card impact-training ">
                <div className="card-header d-flex">
                  <div className="">
                    <h5 className="headText-black">Training & Employement</h5>
                    <p className="subText-medium">
                      Tracking ReadySkill students trained, offered jobs, and
                      hired.
                    </p>
                  </div>
                  <div className="ml-auto mr-4 mt-2">
                    <div className="dropdown">
                      <button
                        type="button"
                        className="btn dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        Last 30 days
                      </button>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" href="#">
                          Last 1 week
                        </a>
                        <a className="dropdown-item" href="#">
                          Last 6 months
                        </a>
                        <a className="dropdown-item" href="#">
                          Last 1 year
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body d-flex">graph</div>
              </div>
            </div>
          )} */}
        SERVICES USAGE RATES SECTION STARTS
        {/* {(userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
          userState.organization_type ===
            OrganizationTypes.KNOWLEDGEPARTNER) && (
          <div className="col-9 pt-150 mb-3">
            <div className="row">
              <div className="col-8">
                <div className="card impact-usage-rates">
                  <div className="card-body">
                    <h5 className="headText-black">
                      Usage Rates of Services Over Time
                    </h5>
                    <div>graphhhhh</div>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="card impact-usage-rates">
                  <div className="card-header">
                    <h5 className="headText-black">
                      Individuals Places in Living Wage Jobs
                    </h5>
                    <p className="subText-impact text-capitalize">
                      Since nov 1, 2021
                    </p>
                  </div>
                  <div className="card-body">
                    <p className="individuals-no">265</p>
                  </div>
                  <div className="card-footer individuals-footer">
                    <div className="d-flex">
                      <span className="material-icons up-arrow mr-2">
                        north_east
                      </span>
                      <p className="subText-impact">Up 18% from last month</p>
                    </div>
                    <div className="d-flex">
                      <span className="material-icons up-arrow mr-2">
                        north_east
                      </span>
                      <p className="subText-impact">Up 4% from last month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}
        SERVICES USAGE RATES SECTION ENDS
        {/* <div className="demographics-main pb-5">
          <div className="container-fluid">
            <h5 className="headText-black mt-90 mb-3">Demographics</h5>
            <div className="row">
              <div className="d-flex col-9 pl-0 flex-wrap">
                <EmploymentChart />
                <GenderChart />
                <div className="col-6 mb-3">
                  <div className="card demo-card">
                    <div className="card-body">completion by zip</div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="card demo-card">
                    <div className="card-body">race/ethnicity</div>
                  </div>
                </div>
              </div>
            </div>
            <a href="" className="load-more">
              LOAD MORE
            </a>
          </div>
        </div> */}
        SYSTEM INSIGHT STARTS
        {/* {(userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
          userState.organization_type ===
            OrganizationTypes.KNOWLEDGEPARTNER) && (
          <div className="system-insight-main pb-5">
            <div className="container-fluid">
              <h5 className="headText-black mt-90 mb-3">System Insights</h5>
              <div className="row">
                <div className="d-flex col-9 pl-0 flex-wrap">
                  <div className="col-6 mb-3">
                    <div className="card impact-system-top">
                      <div className="card-header">
                        <div className="d-flex">
                          <h5 className="headText-black">
                            Ohio-to-work participants
                          </h5>
                          <div className="dropdown ml-auto">
                            <button
                              type="button"
                              className="btn dropdown-toggle"
                              data-toggle="dropdown"
                            >
                              Last 30 days
                            </button>
                            <div className="dropdown-menu">
                              <a className="dropdown-item" href="#">
                                Last 1 week
                              </a>
                              <a className="dropdown-item" href="#">
                                Last 6 months
                              </a>
                              <a className="dropdown-item" href="#">
                                Last 1 year
                              </a>
                            </div>
                          </div>
                        </div>
                        <p className="subText-impact">
                          Receiving coaching & case management
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="d-flex">
                          <p className="count-large">150</p>
                          <i
                            className="material-icons impact-system-icon pt-4 ml-2"
                            title="Learners"
                          >
                            people
                          </i>
                          <div className="ml-auto export-btn">
                            <a href="" className="export-text">
                              EXPORT DATA
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="card impact-system-top">
                      <div className="card-header">
                        <div className="d-flex">
                          <h5 className="headText-black">
                            Ohio-to-work referals
                          </h5>
                          <div className="dropdown ml-auto">
                            <button
                              type="button"
                              className="btn dropdown-toggle"
                              data-toggle="dropdown"
                            >
                              Last 30 days
                            </button>
                            <div className="dropdown-menu">
                              <a className="dropdown-item" href="#">
                                Last 1 week
                              </a>
                              <a className="dropdown-item" href="#">
                                Last 6 months
                              </a>
                              <a className="dropdown-item" href="#">
                                Last 1 year
                              </a>
                            </div>
                          </div>
                        </div>
                        <p className="subText-impact">
                          Individuals refered to OTW
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="d-flex">
                          <p className="count-large">265</p>
                          <i
                            className="material-icons impact-system-icon pt-4 ml-2"
                            title="Learners"
                          >
                            people
                          </i>
                          <div className="ml-auto export-btn">
                            <a href="" className="export-text">
                              EXPORT DATA
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-9">
                  <div className="card impact-coaching">
                    <div className="card-header">
                      <div className="d-flex">
                        <h5 className="headText-black">
                          Coaching & case Management
                        </h5>
                        <div className="dropdown ml-auto">
                          <button
                            type="button"
                            className="btn dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            Last 30 days
                          </button>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">
                              Last 1 week
                            </a>
                            <a className="dropdown-item" href="#">
                              Last 6 months
                            </a>
                            <a className="dropdown-item" href="#">
                              Last 1 year
                            </a>
                          </div>
                        </div>
                      </div>
                      <p className="subText-impact">
                        All Individuals receiving coaching or case management
                      </p>
                    </div>
                    <div className="card-body pb-0 pt-0">
                      <div className="row h-100">
                        <div className="col-2 border-r">
                          <div className="d-flex">
                            <p className="count-large">45</p>
                            <i
                              className="material-icons impact-system-icon pt-4 ml-2"
                              title="Learners"
                            >
                              people
                            </i>
                          </div>
                        </div>


                        <div className="col-3 border-r">
                          <div className="accordion" id="race-tab">
                            <div className="card">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseOne"
                                aria-expanded="true"
                              >
                                <span className="title">Race & Gender</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseOne"
                                className="collapse show"
                                data-parent="#race-tab"
                              >
                                <div className="card-body">
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      BLACK FEMALE
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      NON-WHITE FEMALE
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      BLACK
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      NON-WHITE
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      FEMALE
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-2 border-r">
                          <div className="accordion" id="age-tab">
                            <div className="card">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseTwo"
                                aria-expanded="true"
                              >
                                <span className="title">Age</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseTwo"
                                className="collapse show"
                                data-parent="#age-tab"
                              >
                                <div className="card-body">
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      UNDER 25
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      OVER 45
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-3 border-r">
                          <div className="accordion" id="Education-tab">
                            <div className="card mh-325">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseThree"
                                aria-expanded="true"
                              >
                                <span className="title">Education</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseThree"
                                className="collapse show"
                                data-parent="#Education-tab"
                              >
                                <div className="card-body">
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      UNDER GED/HS
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      GED/HS
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      ASSOCIATE DEGREE
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      BACHELORS DEGREE
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      VOCATIONAL/ SPECIAL CERTIFICATE
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      MASTER DEGREE OR HIGHER
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-2">
                          <div className="accordion" id="Misc">
                            <div className="card">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseFour"
                                aria-expanded="true"
                              >
                                <span className="title">Misc.</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseFour"
                                className="collapse show"
                                data-parent="#Misc"
                              >
                                <div className="card-body">
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      DISABILITY
                                    </p>
                                  </div>
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      VETERAN
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto export-btn">
                        <a href="" className="export-text">
                          EXPORT DATA
                        </a>
                      </div>
                      <div className="ml-auto export-btn">
                        <a href="" className="export-text">
                          EXPORT DATA
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-9 mt-3">
                  <div className="card impact-placement">
                    <div className="card-header">
                      <div className="d-flex">
                        <h5 className="headText-black">Placement Offer</h5>
                        <div className="dropdown ml-auto">
                          <button
                            type="button"
                            className="btn dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            Last 30 days
                          </button>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">
                              Last 1 week
                            </a>
                            <a className="dropdown-item" href="#">
                              Last 6 months
                            </a>
                            <a className="dropdown-item" href="#">
                              Last 1 year
                            </a>
                          </div>
                        </div>
                      </div>
                      <p className="subText-impact">
                        All Individuals receiving placement offers for Jobs,
                        apprenticeships and internships
                      </p>
                    </div>
                    <div className="card-body pb-0 pt-0">
                      <div className="row h-100">
                        <div className="col-2 border-r">
                          <div className="d-flex">
                            <p className="count-large">45</p>
                            <i
                              className="material-icons impact-system-icon pt-4 ml-2"
                              title="Learners"
                            >
                              people
                            </i>
                          </div>
                        </div>

                        <div className="col-3 border-r">
                          <div className="accordion" id="race-tab">
                            <div className="card">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseFive"
                                aria-expanded="true"
                              >
                                <span className="title">Race & Gender</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseFive"
                                className="collapse show"
                                data-parent="#race-tab"
                              >
                                <div className="card-body">
                                  <div className="d-flex">
                                    <div className="form-check filter-checkboxes">
                                      <label className="custom-control overflow-checkbox">
                                        <input
                                          className="form-check-input career-checkbox overflow-control-input"
                                          type="checkbox"
                                          onChange=""
                                          value=""
                                          id=""
                                        />
                                        <span className="overflow-control-indicator"></span>
                                      </label>
                                      <label className="form-check-label text-5 ml-2"></label>
                                    </div>
                                    <p className="subText-impact-2 text-uppercase">
                                      BLACK FEMALE
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-2 border-r">
                          <div className="accordion" id="age-tab">
                            <div className="card">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseSix"
                                aria-expanded="true"
                              >
                                <span className="title">Age</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseSix"
                                className="collapse show"
                                data-parent="#age-tab"
                              >
                                <div className="card-body"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-3 border-r">
                          <div className="accordion" id="Education-tab">
                            <div className="card mh-325">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseSeven"
                                aria-expanded="true"
                              >
                                <span className="title">EDUCATION</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseSeven"
                                className="collapse show"
                                data-parent="#Education-tab"
                              >
                                <div className="card-body"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-2">
                          <div className="accordion" id="Misc">
                            <div className="card">
                              <div
                                className="card-header"
                                data-toggle="collapse"
                                data-target="#collapseEight"
                                aria-expanded="true"
                              >
                                <span className="title">Misc.</span>
                                <span className="material-icons mr-0">
                                  expand_more
                                </span>
                              </div>
                              <div
                                id="collapseEight"
                                className="collapse show"
                                data-parent="#Misc"
                              >
                                <div className="card-body"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto export-btn">
                        <a href="" className="export-text">
                          EXPORT DATA
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default WithLayout(ImpactAndOutcomesContainer);
