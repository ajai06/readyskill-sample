import React from "react";
import GroupRolesList from "../../../../sharedComponents/groupsRoleList/groupsRoleList";

function MobileUsersTab({ rolesCategoryList }) {
  return (
    <div>
      <div className="col-12">
        
        <div className="card-body w-100 px-0 pt-0">
         
        <p className="subHead-text-learner mb-4 text-uppercase w-100 mt-5">
            ROLES ASSIGNED TO THE MOBILE USER GROUP
          </p>
          <GroupRolesList
            groupName={"Mobile"}
            rolesCategoryList={rolesCategoryList}
          />
          {/* <div className=" accordion_one">
            <div className="panel-group" id="accordion_oneRight">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <p className="panel-title">
                    {" "}
                    <a
                      className="inner-sub pl-3 collapsed"
                      data-toggle="collapse"
                      id="0"
                      data-parent="#accordion_oneRight"
                      href="#collapseFiveRightone0"
                      aria-expanded="false"
                    >
                      Organization
                    </a>{" "}
                  </p>
                </div>
                <div
                  id="collapseFiveRightone0"
                  className="panel-collapse collapse"
                  aria-expanded="false"
                  role="tablist"
                >
                  <div className="panel-body">
                    <div className="">
                      <div
                        id="e0e30a28-6ff9-443d-8a23-22ff37dc72f0class"
                        className="form-check mb-2"
                      >
                        <label className="custom-control overflow-checkbox">
                          <input
                            type="checkbox"
                            id="e0e30a28-6ff9-443d-8a23-22ff37dc72f0"
                            className="form-check-input overflow-control-input"
                          />
                          <span className="overflow-control-indicator"></span>
                        </label>
                        <label
                          className="form-check-label subText"
                          for="e0e30a28-6ff9-443d-8a23-22ff37dc72f0"
                        >
                          Block Organization
                        </label>
                      </div>
                      <div
                        id="2f79560c-76ff-44bb-9964-3b9e7182b9bfclass"
                        className="form-check mb-2"
                      >
                        <label className="custom-control overflow-checkbox">
                          <input
                            type="checkbox"
                            id="2f79560c-76ff-44bb-9964-3b9e7182b9bf"
                            className="form-check-input overflow-control-input"
                          />
                          <span className="overflow-control-indicator"></span>
                        </label>
                        <label
                          className="form-check-label subText"
                          for="2f79560c-76ff-44bb-9964-3b9e7182b9bf"
                        >
                          Add Organization
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-group" id="accordion_oneRight">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <p className="panel-title">
                    {" "}
                    <a
                      className="inner-sub pl-3 collapsed"
                      data-toggle="collapse"
                      id="1"
                      data-parent="#accordion_oneRight"
                      href="#collapseFiveRightone1"
                      aria-expanded="false"
                    >
                      Authentication
                    </a>{" "}
                  </p>
                </div>
                <div
                  id="collapseFiveRightone1"
                  className="panel-collapse collapse"
                  aria-expanded="false"
                  role="tablist"
                >
                  <div className="panel-body">
                    <div className="">
                      <div
                        id="859856ed-89cb-4c94-9358-61d7d3640e71class"
                        className="form-check mb-2"
                      >
                        <label className="custom-control overflow-checkbox">
                          <input
                            type="checkbox"
                            id="859856ed-89cb-4c94-9358-61d7d3640e71"
                            className="form-check-input overflow-control-input"
                          />
                          <span className="overflow-control-indicator"></span>
                        </label>
                        <label
                          className="form-check-label subText"
                          for="859856ed-89cb-4c94-9358-61d7d3640e71"
                        >
                          Portal Login
                        </label>
                      </div>
                      <div
                        id="8798c5fe-5b74-4d16-b731-f38400b917e8class"
                        className="form-check mb-2"
                      >
                        <label className="custom-control overflow-checkbox">
                          <input
                            type="checkbox"
                            id="8798c5fe-5b74-4d16-b731-f38400b917e8"
                            className="form-check-input overflow-control-input"
                          />
                          <span className="overflow-control-indicator"></span>
                        </label>
                        <label
                          className="form-check-label subText"
                          for="8798c5fe-5b74-4d16-b731-f38400b917e8"
                        >
                          Mobile Login
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-group" id="accordion_oneRight">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <p className="panel-title">
                    {" "}
                    <a
                      className="inner-sub pl-3 collapsed"
                      data-toggle="collapse"
                      id="2"
                      data-parent="#accordion_oneRight"
                      href="#collapseFiveRightone2"
                      aria-expanded="false"
                    >
                      Programs
                    </a>{" "}
                  </p>
                </div>
                <div
                  id="collapseFiveRightone2"
                  className="panel-collapse collapse"
                  aria-expanded="false"
                  role="tablist"
                >
                  <div className="panel-body">
                    <div className="">
                      <div
                        id="96591681-1ad5-4cc5-8723-52538fe24765class"
                        className="form-check mb-2"
                      >
                        <label className="custom-control overflow-checkbox">
                          <input
                            type="checkbox"
                            id="96591681-1ad5-4cc5-8723-52538fe24765"
                            className="form-check-input overflow-control-input"
                          />
                          <span className="overflow-control-indicator"></span>
                        </label>
                        <label
                          className="form-check-label subText"
                          for="96591681-1ad5-4cc5-8723-52538fe24765"
                        >
                          Program_ReadOnly
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MobileUsersTab;
