import React from "react";

function LearnersProgress({ enrolledProgramsData }) {
  
  let progressPercentage =
    (enrolledProgramsData.currentWeek / enrolledProgramsData.totalWeek) * 100;

  return (
    <div className="py-4 card-body bb-1">
      <div className="progress-top">
        <p className="subHead-text mb-3">Progress</p>
      </div>
      <div className="progress card-progress">
        <div className="first-dot" />
        <div className="sec-dot" />
        <div className="third-dot" />
        <div className="fourth-dot" />
        <div className="fifth-dot" />
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage ? progressPercentage : 0}%` }}
        />
      </div>
      <div className="d-flex mt-1 mb-1">
        <p className="smallText mt-1 mb-2 text-uppercase">
          {enrolledProgramsData?.weeksToComplete}
        </p>
        <div className="circle-target ml-3 mt-2"></div>
        <span className="smallText text-uppercase ml-2 mt-1">
          {enrolledProgramsData?.educationStatus}
        </span>
      </div>
    </div>
  );
}

export default LearnersProgress;
