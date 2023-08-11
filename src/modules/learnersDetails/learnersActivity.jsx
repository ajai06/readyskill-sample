import React from "react";
import { ConstText } from "../../utils/constantTexts";

function LearnersActivity({ activityData }) {
  return (
    <div>
      <div className="text-6 py-3 w-100 text-center" style={{ color: "white" }}>
        {ConstText.NODATA}
      </div>
      {/* {
                unique.map((date,i) => (<div key={i} className="card-body bb-1">
                    <p  className="activity-head text-uppercase">{date}</p>
                    {
                        activityData.map((activity,i) => {
                            if (date === new Date(activity.alertDate).toLocaleString("en-US", { month: "long", day: "2-digit", year: "numeric" })) {
                                return (<div key={i} className="d-flex mb-3">
                                    <img
                                        src={logo}
                                        className="mt-2"
                                        alt="Profile"
                                        width="35"
                                        height="35"
                                    />

                                    <div className="ml-3">
                                        <p className="activity-subHead text-capitalize mb-0">
                                            {activity.heading}
                                        </p>
                                        <p className="activity-text">
                                            {activity.content}
                                        </p>
                                    </div>
                                </div>)
                            }
                        })
                    }
                </div>))} */}
      <div className="card-footer d-flex pagination-footer">
        <span className="material-icons filter-arrow-disabled mr-3 mt-1">
          arrow_back_ios
        </span>
        <p className="subText text-uppercase mb-1">Page 1 0f 1</p>
        <span className="material-icons filter-arrow-disabled ml-3 mt-1">
          arrow_forward_ios
        </span>
      </div>
    </div>
  );
}

export default LearnersActivity;
