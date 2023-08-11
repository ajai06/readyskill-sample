import React, { useState,useEffect, useRef } from "react";
import { Range, getTrackBackground } from "react-range";
import { DateRange } from "react-date-range";

import "./resources.scss";

import logo from "../../assets/img/employer.png";

function ResourceComponent() {
  const [sliderRange, setSliderRange] = useState({
    values: [0],
  });
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const mountedRef = useRef(false);

  useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
  }, []);
  const dateRangeHandler = (item) => {
    console.log(item);
    if(mountedRef){
      setDateRange([item.selection]);
    }
  };
  const [showDateRange, setShowDateRange] = useState(false);
  const STEP = 0.1;
  const MIN = 0;
  const MAX = 100;
  return (
    <React.Fragment>
      <div className="resources-main">
        <div className="d-sm-flex mt-5 mb-3 pl-3">
          <h1 className="h5 headText mt-3">Explore Services</h1>
        </div>
        <div className="main-container-programs d-flex">
          <div className="col-xl-3 col-lg-3 col-md-3">
            <div className="card shadow mb-4 filter-program-card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-8">
                    <div className="filter-head  resources-filter-head">
                      Categories
                      <span className="material-icons expand-arrow">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 reset-area">
                    <div className="reset mr-1">Reset</div>
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
              <div className="card-body">
                <div className="main-category">
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Top 25 Services
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Advocacy, Planning, Professional Development
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Adult Care and Youth Programs
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Arts, Education, Employment and Income Support
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Community, Government and Specialized Resources
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Where to Donate
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Emergency Food, Clothing, Furniture and Disaster Services
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Health Care
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Housing and Utility Assistance
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Legal and Re-Entry Services
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                      Mental Health and Counseling Resources
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  {/* <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                    Peer Support
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div> */}
                  {/* <div className="row mb-filter">
                    <div className="col-xl-10 col-lg-10 col-md-10 filter-text">
                    Seasonal Services
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2">
                      <span className="material-icons filter-arrow">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="card-footer">
                <div className="filter-pagination">
                  <div className="filter-pages">
                    <p className="subText mb-0 mt-1">Showing Results 1 of 2</p>
                  </div>
                  <div className="page-arrows">
                    <span className="material-icons filter-arrow-disabled">
                      arrow_back_ios
                    </span>
                    <span className="material-icons filter-arrow mr-0">
                      arrow_forward_ios
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-7 col-lg-7 col-md-7">
            <div className="col-xl-10 col-lg-10 col-md-10">
              <div className="container-fluid shadow resources-topbar mb-3">
                <div className="d-flex pt-1">
                  <div className="resources-search w-50">
                    <input
                      className="resources-searchbox py-2 my-2"
                      id="search-input"
                      type="search"
                      autoComplete="off"
                      name="search"
                      placeholder="Search"
                    />
                  </div>
                  <div className="resources-range w-50">
                    <div className="d-flex distance-rangeData">
                      <div className="distance-data mt-1">
                        451 Maple, 657661
                      </div>
                      <div className="distance-text mt-1">Search Range</div>
                    </div>
                    <Range
                      values={sliderRange.values}
                      step={STEP}
                      min={MIN}
                      max={MAX}
                      onChange={(values) => setSliderRange({ values })}
                      renderTrack={({ props, children }) => (
                        <div
                          className="distance-range"
                          onMouseDown={props.onMouseDown}
                          onTouchStart={props.onTouchStart}
                          style={{
                            ...props.style,
                            height: "36px",
                            display: "flex",
                          }}
                        >
                          <div
                            ref={props.ref}
                            style={{
                              height: "5px",
                              width: "100%",
                              borderRadius: "4px",
                              background: getTrackBackground({
                                values: sliderRange.values,
                                colors: ["#fff", "#555374"],
                                min: MIN,
                                max: MAX,
                              }),
                              alignSelf: "center",
                            }}
                          >
                            {children}
                          </div>
                        </div>
                      )}
                      renderThumb={({ props, isDragged }) => (
                        <div
                          className="mile-box"
                          {...props}
                          style={{
                            ...props.style,
                            height: "22px",
                            width: "42px",
                            borderRadius: "4px",
                            backgroundColor: "#FFF",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div /> {sliderRange.values[0].toFixed(1)}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-5">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <div className="d-flex">
                        <div className="col-10">
                          <p className="program-text-8 mb-2">
                            Programming fundamentals
                          </p>
                          <a href="" className="list-text">
                            www.midohiofoodbank.com
                          </a>
                        </div>
                        <div className="col-2">
                          <span className="material-icons filter-arrow">
                            arrow_forward_ios
                          </span>
                        </div>
                      </div>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <a href="" className="list-text">
                        www.midohiofoodbank.com
                      </a>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <a href="" className="list-text">
                        www.midohiofoodbank.com
                      </a>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <a href="" className="list-text">
                        www.midohiofoodbank.com
                      </a>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <a href="" className="list-text">
                        www.midohiofoodbank.com
                      </a>
                      <p className="list-text mt-5 mb-1">12-week course</p>
                      <p className="subText">Online Classes</p>
                    </div>
                    <div className="program-card-bottom">
                      <img className="program-img" src={logo}></img>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="card mb-4 program-card">
                    <div className="program-card-upper">
                      <p className="program-text-8 mb-2">
                        Programming fundamentals
                      </p>
                      <a href="" className="list-text">
                        www.midohiofoodbank.com
                      </a>
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
                <p className="subText mb-0 mt-1 mr-4">Page 1 of 2</p>
                <div className="filter-pagearrow">
                  <span className="material-icons filter-arrow-disabled">
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
export default ResourceComponent;
