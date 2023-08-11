import React from "react";

import { VisibilityContext } from "react-horizontal-scrolling-menu";

import blankProfile from "../../../../../assets/img/org-default.png";


export function Card({ itemId, univ,logo, startDate, endDate, enrollmentClick, currentActiveId }) {

  const visibility = React.useContext(VisibilityContext);

  // to check card is on the visible area
  const visible = visibility.isItemVisible(itemId);

  const getDate = (date) => {
    const _date = new Date(date).toDateString().split(' ')
    return _date[1] + ' ' + _date[3]
  }

  const styles = {
    // WebkitMaskImage: 'linear-gradient(to right,transparent 0%, white 40%)',
    background: 'linear-gradient(to right, rgb(80 79 119), rgb(120 114 114 / 25%), rgb(191 137 137 / 0%))',
    maskImage: 'linear-gradient(to right, transparent 0%, white 40%)',
    
  }

  return (
    <div style={!visible ? styles : {}} className={`card ${currentActiveId === itemId ? 'active-enrollment-card ' : 'enrollment-card '}`}
      onClick={() => enrollmentClick(itemId)}>
      <div className="card-body cursor-pointer">
        <div className="d-flex">
          <div className="uni-logo">
            <img
              src={logo ? logo : blankProfile}
              className="uni-logo rounded-circle"
              alt="university logo"
              width="50"
              height="50"
              
            />
          </div>
          <div className="uni-details ml-3">
            <p className="uni-name mb-0 text-capitalize">{univ}</p>
            <p className="uni-period">
              {getDate(startDate) + ' to ' + getDate(endDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
