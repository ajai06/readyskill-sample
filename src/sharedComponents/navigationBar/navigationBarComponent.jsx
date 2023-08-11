import React, { useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { navPaths, OrganizationTypes } from "../../utils/contants";
import {
  UserAuthDispatch,
  UserAuthState,
} from "../../context/user/userContext";
import logo from "../../assets/img/employer.png";

import { logoutAndClear } from "../../services/userManagementServices";

//services
import { updateMessageAsDelivered } from "../../services/messageCenterServices";
import blankProfile from "../../assets/img/org-default.png";

import "./navigationBar.scss";
import ReadySkillLogo from "../../assets/img/logos/readySkill-light.png";
import impactOutcomes from "../../assets/img/icons/impactOutcomes.png";
import learnersIcon from "../../assets/img/icons/learners.png";

import ConfirmationModal from "../confirmationModal/confirmationModal";
import { useToastDispatch } from "../../context/toast/toastContext";
import { useSignalRDispatch } from "../../context/signalR/signalR";
import { useIsMounted } from "../../utils/useIsMounted";

function NavigationBarComponent() {
  const ref = useRef();
  const isMounted = useIsMounted();
  const userDispatch = UserAuthDispatch();
  const [isAvatar, setAvatar] = useState(false);
  const userState = UserAuthState();
  const navigate = useNavigate();
  const toast = useToastDispatch();

  const [logoutModalShow, setLogoutModalShow] = useState(false);

  const collapse = { width: "85px" };
  const expand = { width: "270px" };

  const signalR = useSignalRDispatch();
  const [notActiveInSystem, setNotActiveInSystem] = useState([]);

  //hubconnection starting if not
  useEffect(() => {
    if (!signalR.hubConnection) {
      signalR.startHubConnectionHandler(userState.user.id);
    }
  });

  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("DisableThreadHubCommand", (message) => {
        if (isMounted()) {
          setNotActiveInSystem(message);
        }
      });
    }
  });

  useEffect(() => {
    if (
      notActiveInSystem.length &&
      notActiveInSystem.some((id) => id === userState.user.id) &&
      !location.pathname.startsWith("/portal/dashboard")
    ) {
      logout();
      toast({ type: "warning", text: "Administrator blocked or Deleted your Account from login. Please contact your administrator." });
    }
  }, [notActiveInSystem]);

  const closeSideBar = () => {
    setAvatar(false);
  };
  const ExpandAndCollapse = () => {
    if (isAvatar) {
      setAvatar(false);
    } else {
      setAvatar(true);
    }
  };

  const location = useLocation();

  const checkActive = (parent) => {
    return navPaths
      .find((obj) => obj.parent === parent)
      .children?.some((path) => location.pathname.startsWith(path))
      ? "active"
      : "";
  };

  const logout = () => {
    logoutAndClear(userState.user.id)
      .then((response) => {
        if (response.data && response.data.isSuccess) {
          // setLogoutModalShow(false)
          userDispatch({ type: "LOGOUT" });
          navigate("/portal/login");
        } else {
        }
      })
      .catch((err) => {
        toast({ type: "error", text: "Something went wrong ! " });
      });
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isAvatar && ref.current && !ref.current.contains(e.target)) {
        closeSideBar();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isAvatar]);

  useEffect(() => {
    messageReadUpdate();
  });
  
  const messageReadUpdate = () => {
    let reqData = {
      currentDate: new Date().toISOString(),
      applicationUserId: userState.user.id,
    };
    updateMessageAsDelivered(reqData)
      .then(async (res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateToOrgDetails = () => {
    navigate(`/portal/admin/OrganizationDetails`, {
      state: { orgId: userState.user.organization.organizationId },
    });
  };

  return (
    <>
      {/* {logoutModalShow &&
      <ConfirmationModal
        show={logoutModalShow}
        actionText="logout ?"
        actionButton="Logout"
        btnClassName="btn-danger"
        onHide={() => setLogoutModalShow(false)}
        onAction={() =>logout()}
      />} */}
      <div
        id="mySidebar"
        style={isAvatar ? expand : collapse}
        className="sidebar"
        ref={ref}
      >
        <div className="navContent">
          <div className="d-flex avatar">
            <div className="avatar-cursor">
              {userState.role_GlobalAdmin && (
                <img
                  alt=""
                  src={
                    userState && userState.user.userLogo?.length > 0
                      ? userState.user.userLogo
                      : blankProfile
                  }
                  onClick={ExpandAndCollapse}
                  width="63"
                  height=""
                  data-tip
                  data-for="logo1"
                />
              )}
              {!isAvatar && (
                <ReactTooltip
                  id="logo1"
                  className="tooltip-react"
                  border
                  arrowColor="#2C2A5F"
                  place="right"
                  effect="solid"
                >
                  {"Click to expand"}
                </ReactTooltip>
              )}
              {!userState.role_GlobalAdmin && (
                <img
                  alt=""
                  src={
                    userState && userState.user.userLogo?.length > 0
                      ? userState.user.userLogo
                      : blankProfile
                  }
                  onClick={ExpandAndCollapse}
                  width="60"
                  data-tip
                  data-for="logo"
                />
              )}
              {!isAvatar && (
                <ReactTooltip
                  id="logo"
                  className="tooltip-react"
                  border
                  arrowColor="#2C2A5F"
                  place="right"
                  effect="solid"
                >
                  {"Click to expand"}
                </ReactTooltip>
              )}
            </div>
            {isAvatar && (
              <div className="ml-3">
                <p className="main-user">
                  {userState.user.organization.organizationName}
                </p>
                <p className="sub-user">
                  {userState.user.firstName} {userState.user.lastName}
                </p>
                <p className="sub-user">{userState.user.roleName[0]}</p>
              </div>
            )}
          </div>
          <NavLink className="nav-link" to="/portal/dashboard">
            <i
              className="material-symbols-outlined navbar-icons mr-30"
              data-tip
              data-for="dashboard"
            >
              home
            </i>
            {!isAvatar && (
              <ReactTooltip
                id="dashboard"
                className="tooltip-react"
                border
                arrowColor="#2C2A5F"
                place="right"
                effect="solid"
              >
                {"Your Dashboard"}
              </ReactTooltip>
            )}
            <span className="icon-text">YOUR DASHBOARD</span>
          </NavLink>

          <NavLink className="nav-link" to="/portal/messagecenter">
            <i
              className="material-symbols-outlined navbar-icons mr-30"
              data-tip
              data-for="messageCenter"
            >
              dashboard
            </i>
            {!isAvatar && (
              <ReactTooltip
                id="messageCenter"
                className="tooltip-react"
                border
                arrowColor="#2C2A5F"
                place="right"
                effect="solid"
              >
                {"Message Center"}
              </ReactTooltip>
            )}
            <span className="icon-text">MESSAGE CENTER</span>
          </NavLink>

          <NavLink className="nav-link" to="/portal/impactandoutcomes">
            <img
              src={impactOutcomes}
              className="navbar-icons mr-30"
              data-tip
              data-for="impact-Outcomes"
            />
            {!isAvatar && (
              <ReactTooltip
                id="impact-Outcomes"
                className="tooltip-react"
                border
                arrowColor="#2C2A5F"
                place="right"
                effect="solid"
              >
                {"Impact & Outcomes "}
              </ReactTooltip>
            )}
            <span className="icon-text">IMPACT & OUTCOMES</span>
          </NavLink>

          <NavLink
            className={"nav-link " + checkActive("learners")}
            to="/portal/learners"
          >
            <img
              src={learnersIcon}
              className="navbar-icons mr-30"
              data-tip
              data-for="Learners"
            />

            {!isAvatar && (
              <ReactTooltip
                id="Learners"
                className="tooltip-react"
                border
                arrowColor="#2C2A5F"
                place="right"
                effect="solid"
              >
                {"Learners"}
              </ReactTooltip>
            )}
            <span className="icon-text">LEARNERS</span>
          </NavLink>

          <NavLink className="nav-link" to="/portal/programs">
            <i
              className="material-symbols-outlined navbar-icons mr-30"
              data-tip
              data-for="programs"
            >
              desktop_windows
            </i>
            {!isAvatar && (
              <ReactTooltip
                id="programs"
                className="tooltip-react"
                border
                arrowColor="#2C2A5F"
                place="right"
                effect="solid"
              >
                {"Programs"}
              </ReactTooltip>
            )}
            <span className="icon-text">PROGRAMS</span>
          </NavLink>

          {(userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
            userState.organization_type ===
              OrganizationTypes.KNOWLEDGEPARTNER ||
            userState.role_GlobalAdmin) && (
            <NavLink className="nav-link" to="/portal/resources">
              <i
                className="material-symbols-outlined navbar-icons mr-30"
                data-tip
                data-for="resources"
              >
                favorite
              </i>
              {!isAvatar && (
                <ReactTooltip
                  id="resources"
                  className="tooltip-react"
                  border
                  arrowColor="#2C2A5F"
                  place="right"
                  effect="solid"
                >
                  {"Resources"}
                </ReactTooltip>
              )}
              <span className="icon-text">RESOURCES</span>
            </NavLink>
          )}

          {userState.role_GlobalAdmin && (
            <NavLink
              className={"nav-link " + checkActive("manageAlerts")}
              to="/portal/manageAlerts"
            >
              <i
                className="material-symbols-outlined navbar-icons mr-30"
                data-tip
                data-for="alerts"
              >
                notifications
              </i>
              {!isAvatar && (
                <ReactTooltip
                  id="alerts"
                  className="tooltip-react"
                  border
                  arrowColor="#2C2A5F"
                  place="right"
                  effect="solid"
                >
                  {"Manage Alerts"}
                </ReactTooltip>
              )}
              <span className="icon-text">MANAGE ALERTS</span>
            </NavLink>
          )}

          {userState.role_GlobalAdmin ? (
            <NavLink className="nav-link" to="/portal/admin/admin_dashboard">
              <i
                className="material-symbols-outlined navbar-icons mr-30"
                data-tip
                data-for="settings"
              >
                settings
              </i>
              {!isAvatar && (
                <ReactTooltip
                  id="settings"
                  className="tooltip-react"
                  border
                  arrowColor="#2C2A5F"
                  place="right"
                  effect="solid"
                >
                  {"Settings"}
                </ReactTooltip>
              )}
              <span className="icon-text">SETTINGS</span>
            </NavLink>
          ) : (
            ""
          )}

          {userState.role_OrganizationAdmin ? (
            <div
              className={"nav-link " + checkActive("adminOrganizations")}
              onClick={navigateToOrgDetails}
            >
              <i
                onClick={ExpandAndCollapse}
                className="material-symbols-outlined navbar-icons mr-30 settings-icon"
                data-tip
                data-for="settings"
              >
                settings
              </i>
              {!isAvatar && (
                <ReactTooltip
                  id="settings"
                  className="tooltip-react"
                  border
                  arrowColor="#2C2A5F"
                  place="right"
                  effect="solid"
                >
                  {"Settings"}
                </ReactTooltip>
              )}
              <span className="icon-text settings-icon">SETTINGS</span>
            </div>
          ) : (
            ""
          )}
          <li className="nav-link logout-nav-link">
            <span onClick={() => logout()}>
              <i className="material-icons" data-tip data-for="logout">
                logout
              </i>
              {!isAvatar && (
                <ReactTooltip
                  id="logout"
                  className="tooltip-react"
                  border
                  arrowColor="#2C2A5F"
                  place="right"
                  effect="solid"
                >
                  {"Logout"}
                </ReactTooltip>
              )}
              <span className="icon-text">LOGOUT</span>
            </span>
          </li>

          <div
            className={`row readySkill-logo-small mt-5 ml-1 pb-5 ${
              userState.role_GlobalAdmin ? "" : "fixed-logo"
            } `}
          >
            <img src={ReadySkillLogo} alt="ReadySkillLogo" />
          </div>
        </div>
      </div>
    </>
  );
}

export default NavigationBarComponent;
