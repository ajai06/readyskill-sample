import React, { useEffect, useRef, createRef } from 'react'
import { useToastDispatch } from '../../../../../context/toast/toastContext';
import { UserAuthState } from '../../../../../context/user/userContext';
import {
    processGroupRoleMapping,
    getGroupRolesByGroupId
} from '../../../../../services/organizationServices';
import { clearAlert } from '../../../../../utils/contants';
import { useIsMounted } from '../../../../../utils/useIsMounted';

function OrganizationRoles({ rolesCategoryList, groupId, isBuiltIn }) {
    const toast = useToastDispatch();
    const isMounted = useIsMounted();
    const userState=UserAuthState();

    //timeout cleanup

    const timeOutIDs = useRef([]);

    useEffect(() => {
        return () => {
            let ids = timeOutIDs.current
            clearAlert(ids);
        };
    }, []);

    const containerRef = useRef(null);
    const checkboxTick = "form-check mb-2 check-tick";
    const checkboxCross = "form-check mb-2 cross-check";
    const checkboxBlank = "form-check mb-2";
    const panelCollapseShow = "panel-collapse collapse show";
    const panelInnerArea = "inner-sub pl-3";

    const myRef = useRef([]);
    const checkBoxRef = useRef([]);
    myRef.current = [];
    const addToRefs = (el) => {
        if (el && !myRef.current.includes(el)) {
            myRef.current.push(el);
        }
    };
    const addCheckBoxRef = (el) => {
        if (el && !checkBoxRef.current.includes(el)) {
            checkBoxRef.current.push(el);
        }
    };

    useEffect(() => {
        if (groupId) {
            //Unselect all the check boxes while changing groups
            containerRef.current.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
            expandRolesSectionsOnGroupSelect();
            getGroupRolesById();
        }

    }, [groupId]);

    const expandRolesSectionsOnGroupSelect = () => {
        if (rolesCategoryList?.length > 0) {
            rolesCategoryList.map((obj, i) => {
                document.getElementById(`collapseFiveRightone${i}`).className = panelCollapseShow;
                document.getElementById(i).className = panelInnerArea;
                obj.groupRole.map((role, i) => {
                    //for refreshing the checkbox's classname -while selecting groups
                    document.getElementById(role.id + "group").className = checkboxBlank
                })
            })
        }
    }

    const getGroupRolesById = () => {
        getGroupRolesByGroupId(groupId)
            .then(res => {
                if (res.data) {
                    if (isMounted()) {
                        let timeOutId = setTimeout(() => {
                            showSelectedRoles(res.data);
                        }, 200);
                        timeOutIDs.current.push(timeOutId);

                    }
                }
            })
    }
    // const showSelectedRoles = (data) => {
    //     if (data) {
    //         data.map((obj, i) => {
    //             if (obj.isActive && checkBoxRef.current[i].id) {
    //                 return checkBoxRef.current[i].checked = true;
    //             } else if (!obj.isActive && checkBoxRef.current[i].id) {
    //                 return checkBoxRef.current[i].checked = true;
    //             }
    //         })
    //     }
    //     if (data) {
    //         data.map((obj, i) => {
    //             if (!obj.isActive && myRef.current[i].id) {
    //                 return myRef.current[i].className = checkboxCross;
    //             } else if (obj.isActive && myRef.current[i].id) {
    //                 return myRef.current[i].className = checkboxTick;
    //             }
    //         })
    //     }
    // }
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
    const onSelectRoles = (event, item) => {
        if (groupId.length === 0) {
            toast({ type: "warning", text: "Please select group" });
            document.getElementById(item.id).checked = !item.isActive;
            return;
        }
        let params = {
            groupId: groupId,
            groupRoleId: item.id
        }
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

        processGroupRoleMapping(params)
            .then(res => {
                if (res.status === 200) {
                    if (isMounted()) {
                        //Auto save , no actions required
                    }
                }
            })
            .catch(err => console.log(err))
    }
    return (
        <div className="card-body org-roles-card w-100 px-0 pt-0 mt-4" ref={containerRef}>
            <p className="subHead-text-learner mb-4 text-uppercase mt-3 ml-3">
                ROLES
            </p>
            <div className=" accordion_one">
                {
                    rolesCategoryList?.length > 0 && rolesCategoryList.map((obj, i) => (

                        <div key={obj.id} className="panel-group" id="accordion_oneRight">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <p className="panel-title"> <a className="inner-sub pl-3 collapsed" data-toggle="collapse" id={i} data-parent="#accordion_oneRight" href={`#collapseFiveRightone${i}`} aria-expanded="false">{obj.categoryName}</a> </p>
                                </div>
                                <div id={`collapseFiveRightone${i}`} className="panel-collapse collapse" aria-expanded="false" role="tablist">
                                    <div className="panel-body">
                                        <div className="" disabled={!userState.groupEdit}>
                                            {
                                                obj.groupRole.map((item, i) => (<div key={item.id} ref={addToRefs} id={item.id + "group"} className="form-check mb-2">
                                                    <label className="custom-control overflow-checkbox">
                                                        <input type="checkbox"
                                                            ref={addCheckBoxRef}
                                                            id={item.id}
                                                            disabled={isBuiltIn}
                                                            onChange={(e) => onSelectRoles(e, item)}
                                                            className="form-check-input overflow-control-input" />
                                                        <span className="overflow-control-indicator"></span>
                                                    </label>
                                                    <label className="form-check-label subText">{item.roleName}</label>
                                                </div>))
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default OrganizationRoles