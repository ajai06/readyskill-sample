import React from "react";
import { ConstText } from "../../utils/constantTexts";

function BadgesDetails({ badges }) {
  return (
    <div className="card-body bb-1">
      <p className="subHead-text mb-3">Badges</p>
      <div className="candidate-badge py-2">
        {/* <span className="material-icons filter-arrow-disabled mr-3 mt-3">
                    arrow_back_ios
                </span> */}
        <div className="text-6 py-3 w-100 text-center" style={{ color: "white" }}>
         {ConstText.NODATA}
        </div>

        {/* {badges.length > 0 ? (
          badges.map((badge) => (
            <div key={badge.$id} className="badge-details mr-3">
              <span className="material-icons badge-icons mr-0">
                {badge.icon}
              </span>
              <p className="small-badgeText text-uppercase pb-0 mb-0 mt-1">
                {badge.name}
              </p>
            </div>
          ))
        ) : (
          <div className="text-6 py-3 w-100 text-center">NO BADGES YET</div>
        )} */}
        {/* <span className="material-icons filter-arrow next-arrow mr-3 mt-3">
                    arrow_forward_ios
                </span> */}
      </div>
    </div>
  );
}

export default BadgesDetails;
