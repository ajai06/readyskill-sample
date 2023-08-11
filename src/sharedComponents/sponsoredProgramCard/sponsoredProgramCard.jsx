import React from "react";

import "./sponsoredProgramCard.scss";
import univercity from "../../assets/img/univercity.jpg";

const SponsoredProgramCard=React.memo(({programData})=> {
  return (
    // <div className="col-xl-3 col-md-6 mb-4" id="sponsered-id">
    <div className="mr-3 sponsered-program-main" id="sponsered-id">
          <div className={`card shadow h-100 py-2 sponsered-tray ${programData.programHeaderColor}`}>
            <div className="card-body sponsered-tray">
              <div className="row mt-4 sponsered-head">
                <div className="profile-pic">
                  <img
                    src={univercity}
                    className="sponsered-logo ml-3"
                    alt="Sponser logo"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="">
                  <h5 className="text3 mt-2">{programData.title}</h5>
                </div>
              </div>
              <div className="sponsered-details">
                <div className="subText col-lg-9 col-md-9">
                  CURRENTLY ENROLLED
                </div>
                <div className="subText sponsered-count">{programData.currentlyEnrolled}</div>
              </div>
              <div className="sponsered-details">
                <div className="subText col-lg-9 col-md-9">
                  LIFETIME SPONSORED
                </div>
                <div className="subText sponsered-count">{programData.lifetimeSponsored}</div>
              </div>
            </div>
          </div>
        </div>
  );
})

export default React.memo(SponsoredProgramCard);
