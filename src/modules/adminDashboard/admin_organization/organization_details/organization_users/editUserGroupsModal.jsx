import React, { useEffect, useState } from "react";

import { Modal, CloseButton } from "react-bootstrap";
import {
  getUserGroupsByUserId,
  getGroups,
  addGroupToUser,
  removeGroupFromUser,
} from "../../../../../services/organizationServices";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { useToastDispatch } from "../../../../../context/toast/toastContext";

function EditUserGroupsModal({
  organizationDetails,
  getGroupList,
  onHide,
  userInfo,
  orgId,
  getAllUsersList,
  ...props
}) {
  const [allGroups, setAllGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToastDispatch();
  const isMounted = useIsMounted();

  useEffect(() => {
    getGroupsOfUser();
  }, []);

  const getGroupsOfUser = () => {
    setLoading(true);
    (async () => {
      let allGroupsLength;
      try {
        const allGroup = await getGroups(orgId);
        setAllGroups(allGroup.data);
        allGroupsLength = allGroup.data.length;
      } catch (error) {
        console.log(error.response);
      }
      try {
        const userGroup = await getUserGroupsByUserId(userInfo.id);
        const groups = userGroup.data.map((item) => item.group.id);
        setUserGroups(groups);
        allGroupsLength === groups.length
          ? setAllChecked(true)
          : setAllChecked(false);
        setLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    })();
  }

  const [allChecked, setAllChecked] = useState(false);

  const handleAllChecked = (e) => {
    const checked = e.target.checked;
    setAllChecked(!allChecked);
    if (checked) {
      let selectedGroups = allGroups.filter(
        (item) =>
          !(
            item.groupType === "BUITLIN" &&
            item.groupName.toLowerCase().includes("users")
          )
      );
      let groups = selectedGroups.map((item) => item.id);
      addToGroup(groups);
      setUserGroups(allGroups.map((item) => item.id));
    } else {
      let selectedGroups = allGroups.filter(
        (item) =>
          !(
            item.groupType === "BUITLIN" &&
            item.groupName.toLowerCase().includes("users")
          )
      );
      let groups = selectedGroups.map((item) => item.id);
      setUserGroups(
        allGroups
          .filter(
            (item) =>
              item.groupType === "BUITLIN" &&
              item.groupName.toLowerCase().includes("users")
          )
          .map((item) => item.id)
      );
      removeFromGroup(groups);
    }
  };

  const getChecked = (item) => {
    if (userGroups.length > 0) {
      const checked = userGroups.includes(item.id);
      return checked;
    } else {
      return false;
    }
  };

  const handleCheckChieldElement = (e) => {
    const value = e.target.value;

    let groups;

    if (e.target.checked) {
      groups = [...userGroups, value];
      setUserGroups(groups);
      addToGroup([value]);
    } else {
      groups = userGroups.filter((item) => item !== value);
      setUserGroups(groups);
      removeFromGroup([value]);
    }

    allGroups.length === groups.length
      ? setAllChecked(true)
      : setAllChecked(false);
  };

  const addToGroup = (id) => {
    let obj = {};
    obj.userIds = [userInfo.id];
    obj.groupIds = id;
    setLoading(true);
    addGroupToUser(obj)
      .then((res) => {
        if (isMounted()) {
          getGroupList(userInfo);
          getGroupsOfUser();
          if (res.data.status === "Success") {
            toast({ type: "success", text: res.data.message });
          }
        }
        //  getAllUsersList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const groupDisabledCriteria = (item) => {
    // return disabled item Users (default) & Administrators(if overview primary contact is same as the user selected in usertab
    return (
      item.groupType === "BUITLIN" &&
      item.groupName.toLowerCase().includes("users"));
    // (item.groupType === "BUITLIN" &&
    //   item.groupName.toLowerCase().includes("users")) ||
    // (userInfo.userName === organizationDetails.administrativeUserEmail &&
    //   item.groupName.toLowerCase().includes("administrators"))

  };

  const removeFromGroup = (id) => {
    let obj = {};
    obj.userIds = [userInfo.id];
    obj.groupIds = id;
    setLoading(true);
    removeGroupFromUser(obj)
      .then((res) => {
        if (isMounted()) {
          getGroupList(userInfo);
          getGroupsOfUser();
          if (res.data.status === "Failed") {
            toast({ type: "warning", text: res.data.message });
          } else if (res.data.status === "Success") {
            toast({ type: "success", text: res.data.message });
          }
        }
        // setLoading(false);
        //  getAllUsersList();
      })
      .catch((err) => {
        console.log(err.response);

      });
  };

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className={`manage-groups-modal ${loading ? "z-indexx " : ""}`}
      >
        <Modal.Header>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="subHead-text-learner text-uppercase"
          >
            Groups
          </Modal.Title>
          <CloseButton onClick={onHide} />
        </Modal.Header>
        <Modal.Body>
          <ul style={{ listStyleType: "none" }}>
            {allGroups && allGroups.length > 0 ? (
              <li>
                <div className="form-check filter-checkboxes">
                  <label className="custom-control overflow-checkbox ">
                    <input
                      className="mr-2 form-check-input career-checkbox overflow-control-input"
                      type="checkbox"
                      onChange={(e) => handleAllChecked(e)}
                      value="checkedall"
                      checked={allChecked}
                    />
                    <span className="overflow-control-indicator"></span>
                  </label>
                  <label className="form-check-label subText ml-2">
                    Select All
                  </label>
                </div>
              </li>
            ) : (
              ""
            )}
            {allGroups && allGroups.length > 0 ? (
              allGroups.map((item) => (
                <li key={item.id}>
                  <div
                    className="form-check filter-checkboxes"
                    disabled={groupDisabledCriteria(item)}
                  >
                    <label className="custom-control overflow-checkbox ">
                      <input
                        onChange={(e) => handleCheckChieldElement(e)}
                        className="mr-2  form-check-input career-checkbox overflow-control-input"
                        key={item.id}
                        checked={getChecked(item)}
                        type="checkbox"
                        name="checkboxes"
                        value={item.id || false}
                      />
                      <span className="overflow-control-indicator"></span>
                    </label>
                    <label
                      className="form-check-label subText ml-2"
                      htmlFor={item.id}
                    >
                      {item.groupName}
                    </label>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-white">No groups found</li>
            )}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <a className="close-modal-btn" onClick={onHide}>
            Close
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditUserGroupsModal;
