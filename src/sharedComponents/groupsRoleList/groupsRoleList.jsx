import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useToastDispatch } from "../../context/toast/toastContext";
import {
  processGroupRoleMappingByGroupName,
  getGroupRoles,
  processGroupRoleMapping,
} from "../../services/organizationServices";
import { clearAlert } from "../../utils/contants";
import { useIsMounted } from "../../utils/useIsMounted";

import "./groupRoleList.scss";

function GroupRolesList({ rolesCategoryList, groupName, setTabName }) {
  const toast = useToastDispatch();
  const isMounted = useIsMounted();
  const containerRef = useRef(null);
  const checkboxTick = "form-check mb-2 check-tick";
  const checkboxCross = "form-check mb-2 cross-check";
  const checkboxBlank = "form-check mb-2";
  const panelCollapseShow = "panel-collapse collapse show";
  const panelInnerArea = "inner-sub pl-3";

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  const [roleChangeObject, setRoleChangeObject] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const myRef = useRef([]);
  myRef.current = [];
 

  useEffect(() => {
    if (groupName && rolesCategoryList) {
      //Unselect all the check boxes while changing groups
      containerRef.current
        .querySelectorAll("input[type=checkbox]")
        .forEach((el) => (el.checked = false));
      expandRolesSectionsOnGroupSelect();
      getGroupRolesByGroup();
    }
  }, [groupName, rolesCategoryList]);

  const expandRolesSectionsOnGroupSelect = () => {
    if (rolesCategoryList?.length > 0) {
      rolesCategoryList.map((obj, i) => {
        document.getElementById(`collapseFiveRightone${i}`).className =
          panelCollapseShow;
        document.getElementById(i).className = panelInnerArea;
        obj.groupRole.map((role, i) => {
          //for refreshing the checkbox's classname -while selecting groups
          document.getElementById(role.id + "group").className = checkboxBlank;
        });
      });
    }
  };

  const getGroupRolesByGroup = () => {
    getGroupRoles(groupName).then((res) => {
      if (res.data) {
        if (isMounted()) {
          let timeOutId = setTimeout(() => {
            setSelectedRoles(res.data);
            showSelectedRoles(res.data);
          }, 200);
          timeOutIDs.current.push(timeOutId);
        }
      }
    });
  };
  const showSelectedRoles = (data) => {
    if (data) {
      data.map(obj => {
        if (obj.isActive && document.getElementById(obj.groupRole.id)) {
          return document.getElementById(obj.groupRole.id).checked = true;
        } else if (!obj.isActive && document.getElementById(obj.groupRole.id)) {
          return document.getElementById(obj.groupRole.id).checked = true;
        }
      })
    }
    if (data) {
      data.map(obj => {
        if (!obj.isActive && document.getElementById(obj.groupRole.id + "group")) {
          return document.getElementById(obj.groupRole.id + "group").className = checkboxCross;
        } else if (obj.isActive && document.getElementById(obj.groupRole.id + "group")) {
          return document.getElementById(obj.groupRole.id + "group").className = checkboxTick
        }
      })
    }
  }
  const onSelectRoles = (event, item, checkboxRef, selected) => {
    if (groupName.length === 0) {
      toast({ type: "warning", text: "Please select group" });
      document.getElementById(item.id).checked = !item.isActive;
      return;
    }
    let params = {
      groupName: groupName,
      groupRoleId: item.id,
    };
    if (document.getElementById(item.id + "group").className === checkboxTick) {
      document.getElementById(item.id).checked = true;
      params['isActive'] = false;
      document.getElementById(item.id + "group").className = checkboxCross;
    } else if (document.getElementById(item.id + "group").className === checkboxCross) {
      document.getElementById(item.id + "group").className = checkboxBlank;
    } else if (document.getElementById(item.id + "group").className === checkboxBlank) {
      document.getElementById(item.id + "group").className = checkboxTick;
      params['isActive'] = true;
    }
    saveHandler(params);
    // if (roleChangeObject.some((obj) => obj.groupRoleId === item.id)) {
    //   const newState = roleChangeObject.map((obj) => {
    //     if (obj.groupRoleId === item.id) {
    //       return params;
    //     }
    //     return obj;
    //   });
    //   setRoleChangeObject(newState);
    // } else {
    //   setRoleChangeObject((oldArray) => [...oldArray, params]);
    // }
  };
  const saveHandler = (params) => {
    processGroupRoleMappingByGroupName([params])
      .then((res) => {
        if (res.status === 200) {
          if (isMounted()) {
            getGroupRolesByGroup();
          }
        }
      })

      .catch((err) => console.log(err));
  };
  const cancelHandler = () => {
    setTabName(undefined);

    // containerRef.current
    //   .querySelectorAll("input[type=checkbox]")
    //   .forEach((el) => (el.checked = false));
    // setRoleChangeObject([]);
    // showSelectedRoles(selectedRoles);
  };

  return (
    <div>
      <div
        className="card-body group-roles-main w-100 px-0 pt-2"
        ref={containerRef}
      >
        <div className="org-roles-card accordion_one">
          <p className="subHead-text-learner mb-4 ml-3 text-uppercase mt-3">
            {" "}
            ROLES ASSIGNED TO THE{" "}
            {groupName === "User" ? "ORGANIZATION" : groupName} USER GROUP
          </p>
          {rolesCategoryList?.length > 0 &&
            rolesCategoryList.map((obj, i) => (
              <div key={obj.id} className="panel-group" id="accordion_oneRight">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <p className="panel-title">
                      {" "}
                      <a
                        className="inner-sub pl-3 collapsed"
                        data-toggle="collapse"
                        id={i}
                        data-parent="#accordion_oneRight"
                        href={`#collapseFiveRightone${i}`}
                        aria-expanded="false"
                      >
                        {obj.categoryName}
                      </a>{" "}
                    </p>
                  </div>
                  <div
                    id={`collapseFiveRightone${i}`}
                    className="panel-collapse collapse"
                    aria-expanded="false"
                    role="tablist"
                  >
                    <div className="panel-body">
                      <div className="">
                        {obj.groupRole.map((item, i) => (
                          <div
                            key={item.id}
                            id={item.id + "group"}
                            className="form-check mb-2"
                          >
                            <label className="custom-control overflow-checkbox">
                              <input
                                type="checkbox"
                                id={item.id}
                                onChange={(e) =>
                                  onSelectRoles(
                                    e,
                                    item
                                  )
                                }
                                className="form-check-input overflow-control-input"
                              />
                              <span className="overflow-control-indicator"></span>
                            </label>
                            <label
                              className="form-check-label subText"
                            >
                              {item.roleName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* <div className="d-flex grp-manage-btns">
        <div className="text-right w-100 mt-4">
          <button className="cancel-btn-group" onClick={cancelHandler}>
            Cancel
          </button>
          <button
            className="save-btn-group ml-3"
            onClick={saveHandler}
            disabled={!roleChangeObject.length}
          >
            Save
          </button>
        </div>
      </div> */}
    </div>
  );
}

export default GroupRolesList;
