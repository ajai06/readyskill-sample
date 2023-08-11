
import React, { useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/img/readyskill.PNG";

import { UserAuthState } from "../../context/user/userContext";

import { navPaths } from "../../utils/contants";

import ReadySkillLogo from "../../assets/img/logos/readySkill-light.png";
import blankProfile from "../../assets/img/org-default.png";
import learnersIcon from "../../assets/img/icons/learners.png";
import platfromIcon from "../../assets/img/icons/platform-icon.png";
import orgIcon from "../../assets/img/icons/organization.png";
import "./admin.scss";

function AdminNavigationBarComponent() {
  const ref = useRef();

  const [isAvatar, setAvatar] = useState(false);
  const userState = UserAuthState();
  const navigate = useNavigate();

  const collapse = { width: "85px" };
  const expand = { width: "315px" };

  const location = useLocation();

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
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isAvatar && ref.current && !ref.current.contains(e.target)) {
        closeSideBar();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isAvatar]);

  const navigateToPortal = () => {
    navigate("/portal/dashboard");
  };

  const checkActive = (parent) => {
    return navPaths
      .find((obj) => obj.parent === parent)
      .children?.some((path) => location.pathname.startsWith(path))
      ? "active"
      : "";
  };

  return (
    <div
      id="mySidebar"
      style={isAvatar ? expand : collapse}
      className="sidebar"
      ref={ref}
    >
      <div className="navContent">
        <div className="d-flex avatar">
          <div className="avatar-cursor mt-1">
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
              // height="50"
            />
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
            <div className="user-details ml-3">
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
        <NavLink className="nav-link" to="/portal/admin/admin_dashboard">
          <i
            className="material-symbols-outlined navbar-icons mr-30"
            data-tip
            data-for="home"
          >
            home
          </i>
          {!isAvatar && (
            <ReactTooltip
              id="home"
              className="tooltip-react"
              border
              arrowColor="#2C2A5F"
              place="right"
              effect="solid"
            >
              {"Admin Dashboard"}
            </ReactTooltip>
          )}
          <span className="icon-text">ADMIN DASHBOARD</span>
        </NavLink>

        <NavLink
          className={"nav-link " + checkActive("adminOrganizations")}
          to="/portal/admin/organizations"
        >
          <img
            src={orgIcon}
            className="navbar-icons mr-30"
            data-tip
            data-for="org"
          />
          {!isAvatar && (
            <ReactTooltip
              id="org"
              className="tooltip-react"
              border
              arrowColor="#2C2A5F"
              place="right"
              effect="solid"
            >
              {"Organizations"}
            </ReactTooltip>
          )}
          <span className="icon-text">ORGANIZATIONS</span>
        </NavLink>

        <NavLink
          className={"nav-link " + checkActive("adminLearners")}
          to="/portal/admin/learners_list"
        >
          <img
            src={learnersIcon}
            className="navbar-icons mr-30"
            data-tip
            data-for="learner"
          />
          {!isAvatar && (
            <ReactTooltip
              id="learner"
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

        <NavLink
          className={"nav-link " + checkActive("platformAdmin")}
          to="/portal/admin/platform_admins"
        >
          <img
            src={platfromIcon}
            className="navbar-icons mr-30"
            data-tip
            data-for="admin"
          />
          {!isAvatar  && <ReactTooltip
            id="admin"
            className="tooltip-react"
            border
            arrowColor="#2C2A5F"
            place="right"
            effect="solid"
          >
            {"Readyskill Administrator"}
          </ReactTooltip>}
          <span className="icon-text">READYSKILL ADMINISTRATOR</span>
        </NavLink>

        <li className="nav-link logout-nav-link mb-3">
          <span onClick={navigateToPortal}>
            <i className="material-icons" data-tip data-for="return">
              arrow_back
            </i>
            {!isAvatar  && <ReactTooltip
              id="return"
              className="tooltip-react"
              border
              arrowColor="#2C2A5F"
              place="right"
              effect="solid"
            >
              {"Return to user portal"}
            </ReactTooltip>}
            <span className="icon-text">RETURN TO USER PORTAL</span>
          </span>
        </li>
        <div className="row readySkill-logo-small admin-readyskill-logo pt-5 ml-1 pb-5">
          <img src={ReadySkillLogo} alt="ReadySkillLogo" />
        </div>
      </div>
    </div>
  );
}

export default AdminNavigationBarComponent;
