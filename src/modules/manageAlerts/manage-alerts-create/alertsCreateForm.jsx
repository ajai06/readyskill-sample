import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { createAlerts } from "../../../services/alertsService";
import { UserAuthState } from "../../../context/user/userContext";
import DashboardHeaderComponent from "../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import WithLayout from "../../../sharedComponents/hoc/withLayOut";
import { useToastDispatch } from "../../../context/toast/toastContext";

import { useIsMounted } from "../../../utils/useIsMounted";

import "./alertsCreate.scss";
import { getAllUsersForCandidateName } from "../../../services/dashboardServices";
import { clearAlert } from "../../../utils/contants";

function AlertsCreateForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const userState = UserAuthState();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const [userIdList, setUesrIdList] = useState([]);
  const toast = useToastDispatch();

  //timeout cleanup
  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  // get all user list under the oragnization
  const getUsersList = () => {
    getAllUsersForCandidateName()
      .then((res) => {
        if (isMounted()) {
          if (res.data) {
            let idList = res.data.map((d) => d.id);
            let timeOutId = setTimeout(() => {
              setUesrIdList(idList.filter((obj) => obj !== userState.user.id));
            }, 200);
            timeOutIDs.current.push(timeOutId);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    getUsersList();
  }, []);

  const CreateNewAlert = (data) => {
    let userData = { ...userState };
    if (data.alertType === "Admin") {
      data.userIds = [userData.user.id];
    } else {
      data.userIds = userIdList;
    }
    data.applicationUserId = userData.user.id;
    data.organizationId = userData.user.organization.organizationId;
    data.icon = "";
    createAlerts(data)
      .then((res) => {
        if (isMounted()) {
          if (res.status === 200) {
            toast({ type: "success", text: "Alert created successfully" });
            let timeOutId = setTimeout(() => {
              navigate(-1);
            }, 100);
            timeOutIDs.current.push(timeOutId);
          }
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div id="main" className="alerts-form-container">
      <DashboardHeaderComponent headerText="Add New Alert" />
      <div className="bread-crumb">
        <NavLink
          to="/portal/dashboard"
          className="smallText text-uppercase navlink"
        >
          YOUR DASHBOARD{">"}
        </NavLink>
        <NavLink
          to="/portal/manageAlerts"
          className="smallText text-uppercase navlink"
        >
          MANAGE ALERTS{">"}
        </NavLink>
        <NavLink to="" className="smallText text-uppercase navlink active-breadcrumb">
          Add New Alert
        </NavLink>
      </div>
      <div className="col back-btn" onClick={() => navigate(-1)}>
        <span className="material-icons org-back-arrow">arrow_back_ios</span>
        <span className="back-text">Back</span>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-md-8">
            <div className="card shadow mb-4 org-card">
              <div className="card-header">
                <div className="card-body">
                  <form>
                    <div className="row mb-3">
                      <div className="col">
                        <div className="form-outline">
                          <label className="form-label subText text-uppercase">
                            Header
                          </label>
                          <input
                            type="text"
                            {...register("headerText", { required: true })}
                            className="form-control mb-2"
                            placeholder="Header"
                          />
                          {errors.headerText ? (
                            <span className="error-msg">Header required</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <div className="form-outline">
                          <label className="form-label subText  text-uppercase">
                            Body
                          </label>
                          <textarea
                            className="form-control mb-2"
                            {...register("bodyText", { required: true })}
                            rows="4"
                            placeholder="Body"
                          />
                          {errors.bodyText ? (
                            <span className="error-msg">Body required</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <div className="form-outline">
                          <p className="form-label subText  text-uppercase">
                            Alert Type
                          </p>
                          <select
                            className="text-capitalize custom-select"
                            {...register("alertType", { required: true })}
                          >
                            <option value="">Please select</option>
                            <option className="" value="Admin">
                              Admin
                            </option>
                            <option className="" value="Non-Admin">
                              Non-Admin
                            </option>
                          </select>

                          {/* <label className="form-label subText" >Alert Type</label>
                                                    <input type="text" {...register("alertType")} className="form-control mb-2" placeholder="Alert Type" /> */}
                        </div>
                        {errors.alertType ? (
                          <span className="error-msg">Alert type required</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col org-buttons">
                        <button
                          type="button"
                          className="btn btn-block create-btn mb-2 mt-4"
                          onClick={handleSubmit(CreateNewAlert)}
                        >
                          CREATE
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithLayout(AlertsCreateForm);
