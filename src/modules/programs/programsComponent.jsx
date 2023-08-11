import React, { useState } from "react";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./programs.scss";
import { useIsMounted } from '../../utils/useIsMounted';
import logo from "../../assets/img/employer.png";

function ProgramsComponent() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  
  const isMounted = useIsMounted();

  const dateRangeHandler = (item) => {
    if(isMounted()){
      setDateRange([item.selection]);
    }
  };
  const [showDateRange, setShowDateRange] = useState(false);
  return (
    <React.Fragment>
      <div className="programs-main">
        <div className="d-sm-flex mt-5 mb-3 pl-3">
          <h1 className="h5 headText mt-3">Explore Programs</h1>
        </div>
        <div className="main-container-programs d-flex">
          <div className="col-xl-3 col-lg-3 col-md-3">
            <div className="card shadow mb-4 filter-program-card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-8">
                    <div className="filter-head programs-filter-head">Filter Programs</div>
                  </div>
                  <div className="col-md-4 reset-area">
                    <div className="reset mr-1">
                      Reset
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-header">
                <input
                  type="text"
                  className="date-rangebox w-100"
                  onClick={() => setShowDateRange(true)}
                />
                <span className="material-icons calendar-icon">calendar_today</span>
                <span className="calendar-text">Date Range</span>
                <div className="filter-search">
                {showDateRange && (
                  <div>
                    <div className="w-100">
                    <span
                      className="material-icons close-icon mr-1"
                      onClick={() => setShowDateRange(false)}
                    >
                      close
                    </span>
                    </div>

                    <div className="filter-search calender-box">
                      <DateRange
                        onChange={(item) => dateRangeHandler(item)}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                      />
                    </div>
                  </div>
                )}
                </div>
              </div>
              <div className="card-body overflow-body">
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Industry
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Program Provider
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Program Fee
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Education Level
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Location
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Program Length
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Program Type
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
                <div className="main-category">
                  <div className="row flex-nowrap">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                     Accreditation
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-7 col-lg-7 col-md-7">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <p className="list-text">Drake University</p>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <p className="list-text">Drake University</p>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <p className="list-text">Drake University</p>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <p className="list-text">Drake University</p>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <p className="list-text">Drake University</p>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <p className="list-text">Drake University</p>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-10 pagination mt-2 justify-content-end pr-0">
                <p className="subText mb-0 mt-1">Page 1 of 2</p>
                <div className="filter-pagearrow">
                  <span className="material-icons filter-arrow-disabled ml-4">
                    arrow_back_ios
                  </span>
                  <span className="material-icons mr-0 filter-arrow-disabled ">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProgramsComponent;
