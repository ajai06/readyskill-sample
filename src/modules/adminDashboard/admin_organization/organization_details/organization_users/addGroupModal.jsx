import React, { useEffect, useState } from "react";
import { Modal, Button, CloseButton } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useToastDispatch } from "../../../../../context/toast/toastContext";

import {
  getGroups,
  addGroupToUser,
  removeGroupFromUser,
} from "../../../../../services/organizationServices";
import { useIsMounted } from "../../../../../utils/useIsMounted";

function AddGroupModal({
  onHide,
  clearRows,
  userList,
  modalType,
  selectedRows,
  orgId,
  setPreviousRowIndex,
  getAllUsersList,
  ...props
}) {
  const { register, handleSubmit, setValue, watch } = useForm({
    mode: "onChange",
  });
  const toast = useToastDispatch();

  const [allChecked, setAllChecked] = React.useState(false);
  const [groups1, setGroups1] = useState([]);
  const [checkedLength, setCheckedLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    setLoading(true);
    getGroups(orgId)
      .then((res) => {
        if (isMounted()) {
          setGroups1(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  const handleAllChecked = () => {
    setAllChecked(!allChecked);
    const value = !allChecked;
    // let selectedGroups = groups1.filter(item => !(item.groupType === "BUITLIN" && item.groupName.toLowerCase().includes("users")));
    const y = groups1.map((item) => item.id);
    value ? setValue("asset", [...y]) : setValue("asset", []);
    const formArray = watch("asset");
    setCheckedLength(formArray.length);
  };

  const handleCheckChieldElement = () => {
    const formArray = watch("asset");
    formArray.length === groups1.length
      ? setAllChecked(true)
      : setAllChecked(false);
    setCheckedLength(formArray.length);
  };

  const submitGrouop = (data) => {
    const userIds = userList.map((item) => item.id);
    let obj = {};
    obj.userIds = userIds;
    obj.groupIds = data.asset;
    modalType === "add" ? addGroupToUsers(obj) : removeGroupfromUsers(obj);
  };

  const addGroupToUsers = (obj) => {
    onHide();
    addGroupToUser(obj)
      .then((res) => {
        clearRows();
        selectedRows();
        getAllUsersList();
        console.log(res)
        if (res.data.status === "Success") {
          toast({ type: "success", text: res.data.message });
        }
        setPreviousRowIndex()
      })
      .catch((err) => {
        console.log(err.response);
        setPreviousRowIndex()
        toast({ type: "error", text: "Something went wrong" });
      });
  };

  const removeGroupfromUsers = (obj) => {
    onHide();
    removeGroupFromUser(obj)
      .then((res) => {
        clearRows();
        selectedRows();
        getAllUsersList();
        if (res.data.status === "Failed") {
          toast({ type: "warning", text: res.data.message });
        } else if (res.data.status === "Success") {
          toast({ type: "success", text: res.data.message });
        }
        setPreviousRowIndex()
      })
      .catch((err) => {
        console.log(err.response);
        setPreviousRowIndex()
        toast({ type: "error", text: "Something went wrong" });
      });
  };

  // const groupDisabledCriteria = (item) => {
  //     return (item.groupType === "BUITLIN" && item.groupName.toLowerCase().includes("users"))
  // }
  return (
    <div>
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
            {modalType === "add" ? "Add" : "Remove"} Groups
          </Modal.Title>
          <CloseButton onClick={onHide} />
        </Modal.Header>
        <Modal.Body>
          {modalType === "remove" ? (
            <p className="text-white">
              <span className="text-danger">WARNING </span> : Removing one or
              more groups from a user may remove the user's ability to perform
              certain functions or use the platform. Please ensure that the user
              maintains sufficient roles to use the platform as required.
            </p>
          ) : (
            ""
          )}
          {groups1 && groups1.length > 0 ? (
            <ul style={{ listStyleType: "none" }}>
              <li>
                <div className="form-check filter-checkboxes">
                  <label className="custom-control overflow-checkbox ">
                    <input
                      className="mr-2 form-check-input career-checkbox overflow-control-input"
                      type="checkbox"
                      onChange={handleAllChecked}
                      value="checkedall"
                      checked={allChecked}
                    />
                    <span className="overflow-control-indicator"></span>
                  </label>
                  <label className="form-check-label subText ml-2">
                    Select all
                  </label>
                </div>
              </li>
              {groups1.map((item) => (
                <li key={item.id}>
                  <div className="form-check filter-checkboxes">
                    <label className="custom-control overflow-checkbox ">
                      <input
                        {...register("asset", {
                          onChange: (e) => handleCheckChieldElement(),
                        })}
                        className="mr-2  form-check-input career-checkbox overflow-control-input"
                        key={item.id}
                        type="checkbox"
                        value={item.id}
                      />
                      <span className="overflow-control-indicator"></span>
                    </label>
                    <label
                      className="form-check-label subText ml-2"
                      htmlFor={item.id}
                    >
                      {" "}
                      {item.groupName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <li style={{ listStyleType: "none" }} className="text-white">
              No groups found
            </li>
          )}
        </Modal.Body>
        <Modal.Footer>
          <a className="close-modal-btn" onClick={onHide}>
            Cancel
          </a>
          <Button
            disabled={checkedLength > 0 ? false : true}
            className={"btn-primary save-btn-custom"}
            onClick={handleSubmit(submitGrouop)}
          >
            {modalType == "add" ? "Add" : "Remove"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddGroupModal;
