import React, { useRef } from "react";
import ReactTooltip from "react-tooltip";
import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  createGroup,
  editGroup,
  deleteGroup,
  getGroups,
  getRoleCategory,
} from "../../../../../services/organizationServices";
import { UserAuthState } from "../../../../../context/user/userContext";
import { useToastDispatch } from "../../../../../context/toast/toastContext";
import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";
import OrganizationRoles from "./organizationRoles";
import { useIsMounted } from "../../../../../utils/useIsMounted";
function OrganizationGroups({ organizationDetails }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    reset();
  };
  const handleShow = () => setShow(true);

  const userState = UserAuthState();
  const toast = useToastDispatch();
  const [groupList, setGroupList] = useState([]);
  const [builtInGroupList, setBuiltInGroup] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [editItem, setEditItemDetails] = useState({});
  const [actionDetail, setActionDetail] = useState("");
  const [rolesCategoryList, setRolesCategoryList] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [isBuiltIn, setIsBuiltIn] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({})
  const isMounted = useIsMounted();
  const containerRef = useRef(null);

  useEffect(() => {
    getGroupDetails();
    getRoles();
  }, []);

  const getGroupDetails = () => {
    getGroups(organizationDetails.id)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let builtingroup = res.data.filter(
              (obj) => obj.groupType === "BUITLIN"
            );
            let customgroup = res.data.filter(
              (obj) => obj.groupType === "CUSTOM"
            );
            let responseData = customgroup.map((obj) => ({
              ...obj,
              isAction: false,
            }));
            setBuiltInGroup(builtingroup);
            setGroupList(responseData);
          }
        }
      })
      .catch((err) => console.log(err));
  };
  const createGroups = (data) => {
    data["groupType"] = "CUSTOM";
    data["organizationId"] = organizationDetails.id;
    data["isActive"] = true;
    createGroup(data)
      .then((res) => {
        if (res.status === 200) {
          if (isMounted()) {
            if (res.data.isExists) {
              toast({ type: "warning", text: res.data.message, timeout: 2500 });
            } else {
              collapseRoles();
              reset();
              handleClose();
              getGroupDetails();
              toast({ type: "success", text: res.data.message, timeout: 2500 });
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteGroupData = () => {
    deleteGroup(deleteItem.id)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            toast({
              type: "success",
              text: "Group deleted successfully",
              timeout: 2500,
            });
            containerRef.current
              .querySelectorAll("input[type=checkbox]")
              .forEach((el) => (el.checked = false));
            setGroupId("");
            setSelectedGroup({})
            getGroupDetails();
            setModalShow(false);
            setDeleteItem({});
            collapseRoles();
          }
        }
      })
      .catch((err) => console.log(err));
  };
  const collapseRoles = () => {
    rolesCategoryList.map((obj, i) => {
      document.getElementById(`collapseFiveRightone${i}`).className =
        "panel-collapse collapse";
      document.getElementById(i).className = "inner-sub pl-3 collapsed";
    });
    containerRef.current
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false));
  };
  const selectDeleteData = (data) => {
    setDeleteItem(data);
    setModalShow(true);
  };

  const editGroupDetails = (data) => {
    data["id"] = editItem.id;
    editGroup(data)
      .then((res) => {
        if (res.status === 200) {
          if (isMounted()) {
            if (res.data.isExists) {
              toast({ type: "warning", text: res.data.message });
            } else {
              toast({ type: "success", text: res.data.message });
              getGroupDetails();
              setModalShow(false);
              setEditItemDetails({});
              handleClose();
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const selectAction = (flag, data) => {
    setActionDetail(flag);
    handleShow();
    if (flag === "Add") {
    } else if (flag === "Edit") {
      if (data) {
        setValue("groupName", data.groupName);
        setEditItemDetails(data);
      }
    }
  };
  const getRoles = () => {
    getRoleCategory()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data;
            setRolesCategoryList(responseData);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getgroupRolesById = (item, bool) => {
    setSelectedGroup(item)
    setGroupId(item.id);
    setIsBuiltIn(bool);
  };

  return (
    <div>
      <ConfirmationModal
        show={modalShow}
        actionText="delete this group?"
        actionButton="Delete"
        btnClassName="btn-danger"
        onHide={() => setModalShow(false)}
        onAction={deleteGroupData}
      />
      <div className="card-body groups-tab"
        disabled={userState.groupReadonly && userState.organizationReadonly ? false : true}
      >
        <div className="row">
          <div className="col-5">
            <div className="d-flex">
              <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                BUILT-IN GROUPS
              </p>
            </div>
            {builtInGroupList.map((obj) => (
              <p
                key={obj.id}
                className={`inner-sub text-capitalize custom-grp-items mb-3 py-2 pl-3 ${selectedGroup.id === obj.id ? "active" : ""
                  }`}
                // onClick={() => getgroupRolesById(obj, true)}
                onClick={() => {
                  setBuiltInGroup(
                    builtInGroupList.map((item) => {
                      item.isAction = false;
                      if (item.id === obj.id) {
                        item.isAction = true;
                      }
                      return item;
                    })
                  );
                  getgroupRolesById(obj, true);
                }}
              >
                {obj.groupName}
              </p>
            ))}

            <div className="d-flex">
              <div>
                <p className="subHead-text-learner mb-4 text-uppercase mt-5">
                  CUSTOM GROUPS
                </p>
              </div>
              <div className="d-flex ml-auto" disabled={userState.groupCreate && userState.organizationEdit ? false : true}>
                <span
                  className="material-icons mr-0 add-icon-grp ml-auto"
                  onClick={() => selectAction("Add", {})}
                >
                  add
                </span>
                <p className="subText add-geo-icon pt-1 ml-2"
                >
                  Add Group
                </p>
              </div>
            </div>
            {/* modal */}
            <Modal
              show={show}
              onHide={handleClose}
              className="add-custom-grp-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title className="subHead-text-learner">
                  {actionDetail} custom group
                </Modal.Title>
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
                          Group Name
                        </label>
                        <input
                          type="text"
                          id="groupName"
                          {...register("groupName", {
                            required: true,
                          })}
                          className="form-control mb-2"
                          name="groupName"
                        />
                      </div>
                      <div className="">
                        {errors.groupName ? (
                          <span className="error-msg">
                            This field is required
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <a

                  className="close-modal-btn"
                  onClick={handleClose}
                >
                  Cancel
                </a>
                <Button
                  variant="primary"
                  className="btn-primary save-btn-custom btn btn-primary"
                  onClick={
                    actionDetail === "Add"
                      ? handleSubmit(createGroups)
                      : handleSubmit(editGroupDetails)
                  }
                >
                  {actionDetail === "Add" ? "Add" : "Update"}
                </Button>
              </Modal.Footer>
            </Modal>
            {/* modal ends*/}
            <div className="card-body custom-grp-card w-100 px-0">
              {groupList.map((obj) => (
                <div
                  key={obj.id}
                  className={`d-flex custom-grp-items mb-2 ${selectedGroup.id === obj.id ? "active" : ""
                    }`}
                  onClick={() => {
                    setGroupList(
                      groupList.map((item) => {
                        item.isAction = false;
                        if (item.id === obj.id) {
                          item.isAction = true;
                        }
                        return item;
                      })
                    );
                    getgroupRolesById(obj, false);
                  }}
                >
                  <p className="inner-sub text-capitalize pl-3 py-2 mb-0">
                    {obj.groupName}
                  </p>
                  {obj.isAction && (
                    <div className="d-flex ml-auto mt-2" >
                      <div disabled={userState.groupEdit && userState.organizationEdit ? false : true}>
                        <i
                          className="fa-regular fa-pen-to-square cursor-pointer custom-tooltip edit-icon mr-3"
                          onClick={() => {
                            selectAction("Edit", obj);
                          }}
                          data-tip data-for="editGroup">
                        </i>
                        <ReactTooltip id="editGroup" className="tooltip-react" border arrowColor='#2C2A5F' place="top" effect="solid">
                          Edit group
                        </ReactTooltip>
                      </div>

                      <div disabled={userState.groupDelete && userState.organizationEdit ? false : true}>
                        <i
                          className="fa-regular fa-trash-can delete-btn delete-icon custom-tooltip mr-2"
                          onClick={() => selectDeleteData(obj)}
                          data-tip data-for="delete"
                        >
                        </i>
                        <ReactTooltip id="delete" className="tooltip-react" border arrowColor='#2C2A5F' place="top" effect="solid">
                          Delete group
                        </ReactTooltip>

                      </div>

                    </div>
                  )}
                </div>
              ))}

              {groupList?.length === 0 && (
                <p className="inner-sub text-capitalize org-grp-card-items py-1 pl-3 mb-2">
                  No groups found
                </p>
              )}
            </div>
          </div>

          <div className="col-6" ref={containerRef}>
            {/* <p className="subHead-text-learner mb-4 text-uppercase mt-5">
              ROLES
            </p> */}

            <OrganizationRoles
              rolesCategoryList={rolesCategoryList}
              groupId={groupId}
              isBuiltIn={isBuiltIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationGroups;
