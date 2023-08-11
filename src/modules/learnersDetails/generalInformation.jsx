import React from "react";
import { OrganizationTypes } from "../../utils/contants";
import { UserAuthState } from "../../context/user/userContext";
import { ConstText } from "../../utils/constantTexts";

function GeneralInformation({ generalData, enrolledProgramsData }) {
  const userState = UserAuthState();
  let countOfHousehold =
    generalData?.householdAdultCount +
    generalData?.householdChildrenCount +
    generalData?.householdSeniorsCount;

  return (
    <div className="card-body">
      <p className="subHead-text mb-4">General Information</p>
      {userState.organization_type === OrganizationTypes.SERVICEPARTNER ||
        userState.organization_type === OrganizationTypes.KNOWLEDGEPARTNER || userState.role_GlobalAdmin ? (
        <div className="row">
          <div className="col-6">
            {userState.programEnabled &&
              <div>
                <p className="inner-head mb-0">EXPECTED GRADUATION DATE</p>
                <p className="inner-sub text-capitalize mb-4">
                  {enrolledProgramsData?.graduationDate
                    ? new Date(enrolledProgramsData.graduationDate).toLocaleString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )
                    : ""}
                </p>

                <p className="inner-head mb-0">EXPECTED JOB TITLE</p>
                <p className="inner-sub text-capitalize mb-4">
                  {enrolledProgramsData?.carrerSpecialization
                    ? `${enrolledProgramsData.carrerSpecialization}`
                    : ""}
                </p>
              </div>}
            <p className="inner-head mb-0">EXPECTED INCOME</p>
            <p className="inner-sub text-capitalize mb-4">
              {generalData?.annualGrossIncome
                ? `$ ${generalData.annualGrossIncome}`
                : ""}
            </p>


            <p className="inner-head mb-0">HOUSEHOLD SIZE</p>
            <p className="inner-sub fs-13 text-capitalize mb-4 d-flex">
              <span className="subHead-text mr-3">
                {countOfHousehold ? countOfHousehold : 0}{" "}
              </span>
              <span className="pt-1">
                {generalData.householdAdultCount} ADULT,{" "}
                {generalData.householdChildrenCount} CHILD,{" "}
                {generalData.householdSeniorsCount} SENIOR{" "}
              </span>
            </p>
          </div>
          <div className="col-6">
            <p className="inner-head mb-0">PRIMARY CAREGIVER</p>
            <div
              className="text-6 py-3 w-100 text-center"
              style={{ color: "white" }}
            >
              {ConstText.NODATA}
            </div>
            <p className="inner-head mb-0">CURRENT HOUSEHOLD INCOME</p>
            <div
              className="text-6 py-3 w-100 text-center"
              style={{ color: "white" }}
            >
              {ConstText.NODATA}
            </div>
            <p className="inner-head mb-0">ZIP CODE</p>
            <p className="inner-sub text-capitalize mb-4">
              {generalData?.zipCode ? generalData.zipCode : ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-6">
            <p className="inner-head mb-0">EXPECTED GRADUATION DATE</p>
            <p className="inner-sub text-capitalize mb-4">
              {enrolledProgramsData?.graduationDate
                ? new Date(enrolledProgramsData.graduationDate).toLocaleString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )
                : ""}
            </p>
            <p className="inner-head mb-0">EXPECTED JOB TITLE</p>
            <p className="inner-sub text-capitalize mb-4">
              {enrolledProgramsData?.carrerSpecialization
                ? `${enrolledProgramsData.carrerSpecialization}`
                : ""}
            </p>
            <p className="inner-head mb-0">EXPECTED INCOME</p>
            <p className="inner-sub text-capitalize mb-4">
              {generalData?.annualGrossIncome
                ? `$ ${generalData.annualGrossIncome}`
                : ""}
            </p>
            <p className="inner-head mb-0">ZIP CODE</p>
            <p className="inner-sub text-capitalize mb-4">
              {generalData?.zipCode ? generalData.zipCode : ""}{" "}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneralInformation;
