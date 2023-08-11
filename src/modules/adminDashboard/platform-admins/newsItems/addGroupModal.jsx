import React, { useEffect, useState } from "react";
import { Modal, Button, CloseButton } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useToastDispatch } from "../../../../context/toast/toastContext";

import { useIsMounted } from "../../../../utils/useIsMounted";
import {
  addNewsToGroups,
  removeNewsFromGroups,
  getGroups
} from "../../../../services/adminServices";
import "../../admindashboard.scss";
import { UserAuthState } from "../../../../context/user/userContext";

function AddGroupModal({
  onHide,
  clearRows,
  newsList,
  modalType,
  selectedRows,
  getAllNewsItemsList,
  ...props
}) {
  const { register, handleSubmit, setValue, watch } = useForm({
    mode: "onChange",
  });
  const toast = useToastDispatch();

  const [allChecked, setAllChecked] = React.useState(false);
  const [groups, setGroups] = useState([]);
  const [checkedLength, setCheckedLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMounted();
  const userState = UserAuthState();

  useEffect(() => {
    setLoading(true);
    getGroups(userState.user?.organization.organizationId)
      .then((res) => {
        if (isMounted()) {
          setGroups(res.data);
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
    let selectedGroups = groups.filter((item) => item.id);
    const y = selectedGroups.map((item) => item.id);
    value ? setValue("group", [...y]) : setValue("group", []);
    const formArray = watch("group");
    setCheckedLength(formArray.length);
  };

  const handleCheckChildElement = () => {
    const formArray = watch("group");
    formArray.length === groups.length
      ? setAllChecked(true)
      : setAllChecked(false);
    setCheckedLength(formArray.length);
  };

  const submitGroup = (data) => {
    let obj = {
      postUserId: userState.user.id,
      newsIds: newsList.map((item) => item.id),
      groupIds: data.group,
    };

    modalType === "add" ? addGroupToUsers(obj) : removeGroups(obj);
  };

  const addGroupToUsers = (req) => {
    onHide();
    addNewsToGroups(req)
      .then((res) => {
        toast({
          type: "success",
          text: "News item(s) added to the selected groups successfully",
        });
        clearRows();
        selectedRows();
        getAllNewsItemsList();

      })
      .catch((err) => {
        console.log(err.response);
        toast({ type: "error", text: "Something went wrong" });
      });
  };

  const removeGroups = (req) => {
    onHide();
    removeNewsFromGroups(req)
      .then((res) => {
        toast({
          type: "success",
          text: "News item(s) removed from the selected groups successfully",
        });
        clearRows();
        selectedRows();
        getAllNewsItemsList();

      })
      .catch((err) => {
        console.log(req);

        console.log(err.response);
        toast({ type: "error", text: "Something went wrong" });
      });
  };

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
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          {/* {modalType === "remove" ? (
            <p className="text-white">
              <span className="text-danger">WARNING </span> : Removing one or
              more groups from a user may remove the user's ability to perform
              certain functions or use the platform. Please ensure that the user
              maintains sufficient roles to use the platform as required.
            </p>
          ) : (
            ""
          )} */}
          {groups && groups.length > 0 ? (
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
              {groups.map((item) => (
                <li key={item.id}>
                  <div className="form-check filter-checkboxes">
                    <label className="custom-control overflow-checkbox ">
                      <input
                        {...register("group", {
                          onChange: (e) => handleCheckChildElement(),
                        })}
                        className="mr-2  form-check-input career-checkbox overflow-control-input"
                        key={item.id}
                        type="checkbox"
                        value={item.id}
                        id={item.id}
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
            onClick={handleSubmit(submitGroup)}
          >
            {modalType === "add" ? "Add" : "Remove"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddGroupModal;
