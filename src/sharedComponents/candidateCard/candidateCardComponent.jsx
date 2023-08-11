import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import "./candidatecard.scss";

import logo from "../../assets/img/blankProfile.jpg";
import linkedin from "../../assets/img/linkedin-icon.svg";
import { ConstText } from '../../utils/constantTexts';
import { hiringStatuses, OrganizationTypes } from '../../utils/contants';
import { UserAuthState } from '../../context/user/userContext';

const CandidateCardComponent = React.memo((props) => {

  const navigate = useNavigate();
  const location = useLocation();
  const userState = UserAuthState();
  const selectFilterOptions = (value, criteria) => {
    if (location.pathname === '/portal/dashboard') {
      // props.filterByQualifications(value, criteria);
      navigate(`/portal/learners`, { state: { value, criteria } });
    }
  }

  const openLinkedIn = (profileId) => {
    if (profileId) {
      window.open(profileId, "_blank");
    }
  }
  useEffect(() => {

  }, []);

  const gotoDetails = (learnerData) => {
    navigate(`/portal/learnersDetail/${learnerData.applicationUserId}`);
  }

  const showHiringStatus = (id) => {
    return (
      hiringStatuses.find(obj => obj.value === id)?.status
    )
  }
  return (
    <div className={`candidateCardContainer ${props.cardColumns}`}>
      {/* {
        userState.cardEnabled &&
      } */}
      <div className="card shadow mb-4 candidate-card">
        <div className="row mt-3 candidate-details" >
          <div className="col-3" >
            <div className="candidate-profile-pic">

              <img src={props.uploadedImageUrl?.length > 0 ? props.uploadedImageUrl + '?' + Date.now(): logo} onClick={() => { gotoDetails(props) }} className="rounded-circle object-cover ml-3 candidate-pic" alt="Profile" />
              {props.unreadMessageCount > 0 && <span className="badge">
                {props.unreadMessageCount}
              </span>}
            </div>
          </div>
          <div className="col-9">
            <div className="candidate-name">
              <div className="flex-1">
                <h5 className="text3 w-100 candidate-name" onClick={() => { gotoDetails(props) }}>{props.learnerName}</h5>
                <div>
                  {props.linkedinProfileUrl && <img src={linkedin} onClick={() => openLinkedIn(props.linkedinProfileUrl)} className="linkedin ml-3" alt="Profile" width="20" height="20" />}
                </div>
              </div>
              {
                props.carrerSpecialization?.length > 0 && <div className={location.pathname === '/portal/dashboard' ? 'candidate-role py-1' : 'candidate-role py-1 cursor-disable'} ><span onClick={() => { selectFilterOptions(1, props.carrerSpecialization) }}>{props.carrerSpecialization}</span></div>
              }

              <div className={location.pathname === '/portal/dashboard' ? 'candidate-uni py-1' : 'candidate-uni py-1 cursor-disable'} ><span onClick={() => { selectFilterOptions(2, props.institutionName) }}>{props.institutionName}</span></div>
            </div>
          </div>
        </div>

        <div className="card-body progress-card">

          <div className="py-1">
            <div className="progress-top">
              <p className="progress-text mb-1">Progress</p>
              <div className="circle-target ml-3"></div>
              <span className="smallText text-uppercase ml-2" >{props.educationStatus}</span>
            </div>
            <div className="progress card-progress">
              <div className="first-dot" />
              <div className="sec-dot" />
              <div className="third-dot" />
              <div className="fourth-dot" />
              <div className="fifth-dot" />
              <div className="progress-bar" style={{ width: `${props.progressPercentage ? props.progressPercentage : 0}%` }} />
            </div>
            <p className="smallText mt-1 mb-2 text-uppercase">{props.weeksToComplete}</p>

          </div>

          <div className="candidate-badge py-2">
            {/* {
              props.badges.$values.length > 0 ? props.badges.$values.slice(0, 3).map(badge => (
                <div key={badge.$id} className={location.pathname==='/portal/dashboard'?"badge-details mr-3":'badge-details mr-3 cursor-disable'} onClick={() => { selectFilterOptions(3, badge.badgeId)}}>
                  <span className="material-icons badge-icons mr-0" >{badge.icon}</span>
                  <p className="smallerText text-uppercase pb-0 mb-0 mt-1">{badge.name}</p>
                </div>
              ))
                : <div className="text-6 py-3 w-100 text-center">NO BADGES YET</div>
            } */}
            <div className="text-6 py-3 w-100 text-center" style={{ color: 'white' }}>{ConstText.NODATA}</div>
          </div>

          <div className={location.pathname === '/portal/dashboard' ? "exp-grad mt-2" : 'exp-grad mt-2 cursor-disable'} ><span onClick={() => { selectFilterOptions(4, props.graduationDate) }}>Expected graduation:


            {props.graduationDate ? new Date(props.graduationDate).toLocaleString("en-US", {
              month: "short",
              year: "numeric",

            }) : ""}
          </span></div>
          <div className='d-flex'>
            <div className="availability" >{showHiringStatus(props.hiringStatus)}</div>
            {props.reviewRequired && <span className="material-icons warning-icon-candidate ml-auto mr-0 ">warning</span>}
          </div>

        </div>

      </div>
    </div>

  )
});

export default React.memo(CandidateCardComponent)
