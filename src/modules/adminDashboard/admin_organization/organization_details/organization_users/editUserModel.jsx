import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, CloseButton } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useToastDispatch } from "../../../../../context/toast/toastContext";


import {
  updateUserData,
  getAllRoles,
} from "../../../../../services/organizationServices";
import { clearAlert } from "../../../../../utils/contants";
import { useIsMounted } from "../../../../../utils/useIsMounted";

function EditUserModel({ getAllUsersList, onHide, userInfo, ...props }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { error: registerError },
  } = useForm({ mode: 'onChange' });
  const toast = useToastDispatch();
  const isMounted = useIsMounted();

  const [allRoles, setAllRoles] = useState([]);

    //timeout cleanup

    const timeOutIDs = useRef([]);
  
    useEffect(() => {
      return () => {
        let ids = timeOutIDs.current
        clearAlert(ids);
      };
    }, []);
  

  useEffect(() => {
    setValue("firstName", userInfo?.firstName ? userInfo?.firstName : "");
    setValue("lastName", userInfo?.lastName ? userInfo?.lastName : "");

    getAllRoles()
      .then((res) => {
        if (isMounted()) {
          setAllRoles(res.data);
          let role = res.data.find(
            (item) => item.name === userInfo["userRoles"][0]
          );
          setValue("role", role.name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // user update
  const userUpdate = (data) => {
    data.organizationId = userInfo.organizationId;
    data.id = userInfo.id;
    updateUserData(data)
      .then((res) => {
        if (isMounted()) {
          let timeOutId = setTimeout(() => {
            toast({ type: "success", text: res.data.message });
            getAllUsersList();
          }, 300);
          timeOutIDs.current.push(timeOutId);

          onHide();
        }
      })
      .catch((err) => {
        console.log(err.response);
        onHide();
        let timeOutId = setTimeout(() => {
          if (err.response.data.message) {
            toast({ type: "error", text: err.response.data.message });
          } else {
            toast({ type: "error", text: err.response.statusText });
          }
        }, 500);
        timeOutIDs.current.push(timeOutId);

      });
  };
  return (
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" className="edit-user-modal">
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="subHead-text-learner text-uppercase">Edit User</Modal.Title>
        <CloseButton onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row mb-3">
            <div className="">
              <div className="form-outline">
                <label
                  className="form-label subText black-txt"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control mb-2"
                  {...register("firstName", { required: true })}
                />
                {registerError?.lastName?.type === "required" ? (
                  <span className="error-msg">
                    Firstname is required
                    <br />
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="">
              <div className="form-outline">
                <label
                  className="form-label subText black-txt"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control mb-2"
                  {...register("lastName", { required: true })}
                />
                {registerError?.lastName?.type === "required" ? (
                  <span className="error-msg">
                    Lastname is required
                    <br />
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group">
                <label className="form-label subText" htmlFor="role">
                  Account Type
                </label>

                <select
                  style={{ height: "42px" }}
                  className="form-control mb-2 select-box caseworker-select"
                  id="role"
                  {...register("role", { required: true })}
                >
                  {allRoles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>

                {registerError?.role ? (
                  <span className="error-msg">Please select a role</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <a className="close-modal-btn" onClick={onHide}>
          Cancel
        </a>
        <Button className={"btn-primary save-btn-custom"} onClick={handleSubmit(userUpdate)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditUserModel;
