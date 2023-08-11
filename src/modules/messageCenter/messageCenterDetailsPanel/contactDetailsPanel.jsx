import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/img/blank-profile-picture.png";
import { UserAuthState } from "../../../context/user/userContext";
import { getAllEnrolledPrograms } from "../../../services/adminServices";
import LearnerNotesContainer from "../../../sharedComponents/learnerNotes/learnerNotesContainer";

import "../messageCenter.scss";

const ContactDetailsPanel = React.memo((props) => {
  const navigate = useNavigate();
  const userState = UserAuthState();

  const [specializedCareer, setSpecializedCareer] = useState("");

  useEffect(() => {
    if (
      props.groupDetails.secondaryUserEstablishmentName?.toLowerCase() ===
        "learner" &&
      props.groupDetails.secondaryUserPositionTitle?.toLowerCase() ===
        "readyskill"
    ) {
      getAllEnrolledProgramList();
    } else {
      setSpecializedCareer(props.groupDetails.secondaryUserPositionTitle);
    }
    return () => {
      setSpecializedCareer("")
    }
  }, [props.groupDetails]);

  const handleNavigate = () => {
    if (
      userState.userState.cardEnabled &&
      props.groupDetails.secondaryUserEstablishmentName?.toLowerCase() ===
        "learner" &&
      props.groupDetails.secondaryUserPositionTitle?.toLowerCase() ===
        "readyskill"
    ) {
      navigate(`/portal/learnersDetail/${props.groupDetails.secondaryUserId}`);
    }
  };

  const getAllEnrolledProgramList = () => {
    getAllEnrolledPrograms(props.groupDetails.secondaryUserId)
      .then((response) => {
        if (response.data.$values.length) {
          setSpecializedCareer(response.data.$values[0].carrerSpecialization);
        }
      })
      .catch((err) => console.log(err.response));
  };

  const avatarClassNameHandler = () => {
    if (
      userState.cardEnabled &&
      props.groupDetails.secondaryUserEstablishmentName?.toLowerCase() ===
        "learner" &&
      props.groupDetails.secondaryUserPositionTitle?.toLowerCase() ===
        "readyskill"
    ) {
      return "rounded-circle mt-2 mb-1 object-cover hand-icon-class";
    } else {
      return "rounded-circle mt-2 mb-1 object-cover";
    }
  };

  return (
    <React.Fragment>
      <div className="card-header text-center pb-0">
        <img
          src={
            props.groupDetails.secondaryUserUploadedImageUrl
              ? props.groupDetails.secondaryUserUploadedImageUrl +
                "?" +
                Date.now()
              : logo
          }
          className={avatarClassNameHandler()}
          alt="Profile"
          width="72"
          height="72"
          onClick={handleNavigate}
        />
        <p className="text-user mb-0">
          {props.groupDetails.secondaryUserFirstName}{" "}
          {props.groupDetails.secondaryUserLastName}
        </p>
        <p className="text-userRole text-capitalize mb-2">
          {specializedCareer}
        </p>
        <section>
          <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
            <li className="nav-item waves-effect waves-light">
              <a
                className="nav-link active note"
                id="notes-tab"
                data-toggle="tab"
                href="#notes"
                role="tab"
                aria-controls="notes"
                aria-selected="true"
              >
                NOTES
              </a>
            </li>
          </ul>
        </section>
      </div>
      <LearnerNotesContainer learnerId={props.groupDetails.secondaryUserId} />
    </React.Fragment>
  );
});

export default React.memo(ContactDetailsPanel);
