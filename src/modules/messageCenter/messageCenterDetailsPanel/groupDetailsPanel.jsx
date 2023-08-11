import React, { useEffect, useRef, useState } from "react";

//services
import {
  updateThreadMessageName,
  userSearch,
  addUserToThread,
  getUsersForThread,
} from "../../../services/messageCenterServices";

//context

import { UserAuthState } from "../../../context/user/userContext";
import { useToastDispatch } from "../../../context/toast/toastContext";
import { useSignalRDispatch } from "../../../context/signalR/signalR";

import { useIsMounted } from "../../../utils/useIsMounted";

import logo from "../../../assets/img/blank-profile-picture.png";

import "../messageCenter.scss";
import { clearAlert } from "../../../utils/contants";

const GroupDetailsPanel = React.memo((props) => {
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const signalR = useSignalRDispatch();

  const [groupDetails, setGroupDetails] = useState([]);
  const [threadId, setThreadId] = useState(undefined);
  const [newUserSearchResults, setNewUserSearchResults] = useState([]);
  const [newUserList, setNewUserList] = useState([]);
  const [allUsersList, setAllUserList] = useState([]);
  const [threadUsers, setThreadUsers] = useState([]);
  const [isEditThread, setIsEditThread] = useState(false);
  const [threadUpdateMessage, setThreadUpdateMessage] = useState(undefined);
  const threadNameRef = useRef("");

  const isMounted = useIsMounted();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  //thread details set
  useEffect(() => {
    if (props.groupDetails) {
      setGroupDetails(props.groupDetails);
      threadNameRef.current = props.groupDetails.threadName
        ? props.groupDetails.threadName
        : threadNameRef.current;
      setThreadId(props.groupDetails.userThread?.$values[0].messageThreadId);
    }
    return () => {
      setThreadId(undefined);
    };
  }, [props.groupDetails, props.addUserToThreadDetails]);

  //get all user function call
  useEffect(() => {
    if (threadId) {
      getUserListForThread();
      getAllUsersList();
    }
  }, [threadId]);

  // message live
  useEffect(() => {
    signalR.hubConnection.on("LeaveChat", (message) => {
      if (isMounted()) {
        setThreadUpdateMessage(message);
        threadNameRef.current = message.threadName;
        if (message.primaryUserId === userState.user.id) {
          groupDetails.isExitFromThread = true;
        }
      }
    });

    signalR.hubConnection.on("UpdateThreadName", (message) => {
      if (isMounted()) {
        threadNameRef.current = message.threadName;
        setThreadUpdateMessage(message);
      }
    });
    signalR.hubConnection.on("NewMemberAdded", (message) => {
      if (isMounted()) {
        if (message && message.id === threadId) {
          props.messageLabelHandler(message.threadName);
        }
        // props.messageLabelHandler(message.threadName);
        setThreadUpdateMessage(message);
      }
    });
  });

  //thread users list after group update
  useEffect(() => {
    if (threadUpdateMessage) {
      getUserListForThread();
    }
  }, [threadUpdateMessage]);

  //update thread name
  const updateThreadNameHandler = (event) => {
    if (event.target.value.trim() === "") {
      toast({ type: "warning", text: "Thread name can not be emptygi" });
      return;
    }
    if (event.target.value !== threadNameRef.current) {
      threadNameRef.current = event.target.value;

      props.messageLabelHandler(threadNameRef.current);
      let threadUsers = [];
      groupDetails.userThread.$values.forEach((element) => {
        threadUsers.push({
          applicationUserId: element.applicationUserId,
          isExit: false,
          isBlock: false,
        });
      });
      let reqData = {
        threadName: threadNameRef.current,
        description: "",
        isActive: true,
        openDate: new Date().toISOString(),
        closeDate: null,
        currentDate: new Date().toISOString(),
        groupActivity: "",
        isThreadNameChanged: true,
        applicationUserId: userState.user.id,
        deviceId: "",
        signalRActionUserId: userState.user.id,
        userThread: groupDetails.userThread.$values,
        threadUsers: threadUsers,
      };

      updateThreadMessageName(reqData, threadId)
        .then(async (res) => {
          let data = await res.data;

          toast({ type: "success", text: "Thread renamed successfully" });
          if (signalR.hubConnection?._connectionStarted) {
          }
          let hubRequest = {
            id: threadId,
            isThreadNameChanged: true,
            threadName: data.threadName,
            applicationUserId: userState.user.id,
          };
          await signalR.hubConnection.send(
            "UpdateThreadName",
            threadId,
            hubRequest
          );
          if (isMounted() && data) {
            threadNameRef.current = data.threadName;
            setGroupDetails(data);
            props.setUpdateRequest(reqData);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setIsEditThread(false);
    } else {
      setIsEditThread(false);
    }
  };

  //API call for get all user
  const getAllUsersList = () => {
    let userId = userState.user.id;
    userSearch(userId, threadId)
      .then(async (res) => {
        let data = await res.data.$values;
        data = data.filter(relation => (relation.secondaryUserIsActive && !relation.secondaryUserIsSuspended))
        if (isMounted()) {
          setAllUserList(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [searchNameUser, setSearchNameUser] = useState("");
  //user search for user adding
  const searchUserHandler = (event) => {
    setSearchNameUser(event.target.value);
    if (event.target.value.trim().length) {
      setSearchNameUser(event.target.value);
      setNewUserSearchResults(
        allUsersList.filter((user) => {
          return (
            user.secondaryUserFirstName +
            " " +
            user.secondaryUserLastName
          )
            .toLowerCase()
            .includes(event.target.value.toLowerCase(), 0);
        })
      );
    } else {
      setNewUserSearchResults([]);
    }
  };

  //add user array set
  const addUserArrayHandler = (newMember) => {
    let existingUserArray = props.groupDetails?.id
      ? props.groupDetails.userThread.$values
      : threadUsers;
    if (!props.groupDetails?.id) {
      setThreadId(threadUsers[0].messageThreadId);
    }
    if (
      existingUserArray.find(
        (member) =>
          member.applicationUserId === newMember.secondaryUserId &&
          !member.isExit
      )
    ) {
      toast({ type: "warning", text: "User is already in the thread" });
    } else if (
      !newUserList.find(
        (x) => x.applicationUserId === newMember.secondaryUserId
      )
    ) {
      let data = {
        messageThreadId: threadId,
        applicationUserId: newMember.secondaryUserId,
        enrolledDate: null,
        hasHistoryEnabled: true,
        isBlock: false,
        blockedDate: null,
        isCleared: false,
        clearedDate: null,
        isDelete: false,
        deleteDate: null,
        isExit: false,
        exitDate: null,
        userFirstName: newMember.secondaryUserFirstName,
        userLastName: newMember.secondaryUserLastName,
        isValidateUser: true,
        isNewThread: false,
        currentDate: new Date().toISOString(),
        deviceId: "",
      };

      setNewUserList((prev) => [...prev, data]);
    }
  };

  //add user to thread
  const addUserHandler = () => {
    if (newUserList.length === 0) {
      toast({ type: "warning", text: "No users selected for adding to group" });
      return;
    }
    let reqData = {
      threadName: threadNameRef.current,
      description: "",
      isActive: true,
      openDate: new Date().toISOString(),
      closeDate: null,
      currentDate: new Date().toISOString(),
      isThreadNameChanged: groupDetails.isThreadNameChanged,
      groupActivity: "string",
      applicationUserId: userState.user.id,
      userThread: newUserList,
    };

    addUserToThread(reqData, threadId)
      .then(async (res) => {
        getUserListForThread();

        let data = await res.data;
        threadNameRef.current = data.threadName;
        let respUserThreads = [];
        reqData.userThread.forEach((element) => {
          let newUSerData = res.data.userThread.$values.find(
            (user) => user.applicationUserId === element.applicationUserId
          );
          if (newUSerData) {
            newUSerData.userFirstName = element.userFirstName;
            respUserThreads.push(newUSerData);
          }
        });

        reqData.userThread = respUserThreads;
        reqData.threadName = res.data.threadName;
        reqData.id = threadId;

        await signalR.hubConnection.send(
          "AddNewUserToCurrentThread",
          threadId,
          reqData
        );
        welcomeMessageSend(respUserThreads);
        if (isMounted() && data) {
          setGroupDetails(data);
          resetAddUserHandler();
          toast({ type: "success", text: "User added successfully" });
          props.setUpdateRequest(reqData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //welcome message for newly added users
  const welcomeMessageSend = (userThreads) => {
    let welcomeMessage = "";
    for (let i = 0; i < userThreads?.length; i++) {
      welcomeMessage = welcomeMessage + userThreads[i].userFirstName;

      if (userThreads.length > 1) {
        if (i < userThreads.length - 2) {
          welcomeMessage = welcomeMessage + ", ";
        } else if (i === userThreads.length - 2) {
          welcomeMessage = welcomeMessage + " & ";
        }
      }
    }
    let message = {
      messageThreadId: threadId,
      messageTypeId: 1,
      text: "Welcome to ReadySkill, " + welcomeMessage,
      authorIsReadySkillUser: false,
      messageSendUserId: userState.user.id,
      postedDate: new Date().toISOString(),
      deliveryStatus: "s",
      isActive: true,
      isGroupActivity: false,
      groupActivity: null,
      isPrimaryUser: true,
      messageTypeName: "string",
      sendUserFirstName: userState.user.firstName,
      sendUserLastName: userState.user.lastName,
      signalRActionUserId: userState.user.id,
      deviceId: "",
    };
    props.setUserAddedMessage(message);
  };

  //get user list API
  const getUserListForThread = () => {
    if (threadId) {
      let uuid = userState.user.id;
      getUsersForThread(uuid, threadId)
        .then(async (res) => {
          let data = await res.data.$values;
          if (isMounted() && data) {
            setThreadUsers(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteFromAddGroupListHandler = (data) => {
    setNewUserList(
      newUserList.filter(
        (member) => member.applicationUserId !== data.applicationUserId
      )
    );
  };

  //thread rename update
  const threadRenameHandler = () => {
    setIsEditThread(true);
    let timeOutId = setTimeout(() => {
      const input = document.getElementById("threadName");
      input.focus();
      // Move the cursor to the end
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }, 0);
    timeOutIDs.current.push(timeOutId);
  };

  //reset add user popup
  const resetAddUserHandler = () => {
    document.getElementById("search-user").value = "";
    setSearchNameUser("");
    setNewUserSearchResults([]);
    setNewUserList([]);
  };
  return (
    <React.Fragment>
      <div className="card-header grp-details-msg pb-0">
        <div className="">
          {threadUsers &&
            // threadUsers.length > 9 &&
            threadUsers
              .slice(0, 9)
              .map((member, index) => (
                <img
                  key={index}
                  src={
                    member?.secondaryUserUploadedImageUrl
                      ? member?.secondaryUserUploadedImageUrl + "?" + Date.now()
                      : logo
                  }
                  className="rounded-circle object-cover mt-2 mb-1 mr-3"
                  alt="Profile"
                  width="35"
                  height="35"
                />
              ))}{" "}
          {threadUsers && threadUsers.length > 9 && (
            <span style={{ color: "white" }}>...</span>
          )}
          {/* {threadUsers &&
            threadUsers.length <= 9 &&
            threadUsers.map((member, index) => (
              <img
                key={index}
                src={logo}
                className="rounded-circle object-cover mt-2 mb-1 mr-3"
                alt="Profile"
                width="35"
                height="35"
              />
            ))} */}
        </div>

        {isEditThread && (
          <input
            id="threadName"
            disabled={!isEditThread}
            ref={threadNameRef}
            defaultValue={threadNameRef.current}
            type="text"
            className="form-control grp-rename-form mb-2 mt-2"
            maxLength={50}
            // onKeyPress={(e) => e.key === "Enter" && updateThreadNameHandler(e)}
            onBlur={updateThreadNameHandler}
            onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
          />
        )}

        {!isEditThread && (
          <p className="text-user mb-0 mt-2 text-center custom-tooltip">
            <span className="tooltiptext">{threadNameRef.current}</span>
            {threadNameRef.current?.length > 25
              ? threadNameRef.current.slice(0, 25) + "..."
              : threadNameRef.current}{" "}
          </p>
        )}
        {userState.messageThreadUpdate && !groupDetails?.isExitFromThread && (
          <div className="w-100 text-center">
            <a
              className="subText rename-group text-capitalize mb-2"
              onClick={threadRenameHandler}
            >
              Rename group
            </a>
          </div>
        )}
        <section>
          <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
            <li className="nav-item waves-effect waves-light">
              <a
                className="nav-link active"
                id="group-tab"
                data-toggle="tab"
                href="#group"
                role="tab"
                aria-controls="group"
                aria-selected="true"
              >
                GROUP
              </a>
            </li>
          </ul>
        </section>
      </div>
      <div className="">
        {/* Tabs content */}
        <div className="tab-content grp-tab" id="myTabContent">
          {/* overview tab */}
          <div
            className="tab-pane fade show active"
            id="group"
            role="tabpanel"
            aria-labelledby="group-tab"
          >
            <div className="card-body grp-list-card">
              <p className="subText">{threadUsers?.length} People</p>
              {userState.messageThreadAddUser &&
                !groupDetails?.isExitFromThread && (
                  <div className="d-flex">
                    <span
                      className="material-icons badge-icons mr-0 add-learner-icon"
                      data-toggle="modal"
                      data-target="#delete-modal-user"
                    >
                      add
                    </span>
                    <p className="subText mt-1 ml-3 mb-0 add-note cursor-text">
                      Add Person{" "}
                    </p>
                  </div>
                )}
              {threadUsers &&
                threadUsers.map((member, index) => (
                  <div className="d-flex py-1" key={index}>
                    <img
                      src={
                        member?.secondaryUserUploadedImageUrl
                          ? member?.secondaryUserUploadedImageUrl +
                            "?" +
                            Date.now()
                          : logo
                      }
                      className="rounded-circle object-cover mt-2 mb-1"
                      alt="Profile"
                      width="40"
                      height="40"
                    />
                    <p className="text-noteName mt-3 ml-3 mb-0 add-note text-capitalize w-80 cursor-text">
                      {member.userFullName}
                    </p>
                    {/* <span
                      className="material-icons mr-0 block-icon"
                      data-target="#block-msg-user"
                      data-toggle="modal"
                    >
                      block
                    </span> */}
                    {/* <span
                      className="material-icons mr-0 cancel-icon ml-2"
                      data-target="#remove-msg-user"
                      data-toggle="modal"
                    >
                      cancel
                    </span> */}
                  </div>
                ))}
            </div>
          </div>

          <div
            className="modal fade"
            id="delete-modal-user"
            tabIndex="-1"
            aria-labelledby="delete-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="subHead-text-learner modal-title h4"
                    id="delete-modalLabel"
                  >
                    Add user to thread
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={resetAddUserHandler}
                  ></button>
                </div>
                <div className="modal-body">
                  {newUserList &&
                    newUserList.map((member) => (
                      <div
                        className="d-flex py-1"
                        key={member.applicationUserId}
                      >
                        <img
                          src={
                            member?.secondaryUserUploadedImageUrl
                              ? member?.secondaryUserUploadedImageUrl +
                                "?" +
                                Date.now()
                              : logo
                          }
                          className="rounded-circle object-cover mt-2 mb-1 ml-2"
                          alt="Profile"
                          width="40"
                          height="40"
                        />
                        <p className="text-noteName added-username mt-3 ml-2 mr-2 mb-0 add-note text-capitalize">
                          {`${member.userFirstName}`}
                        </p>
                        <span
                          className="material-icons mr-0 cancel-icon"
                          onClick={() => {
                            deleteFromAddGroupListHandler(member);
                          }}
                        >
                          cancel
                        </span>
                      </div>
                    ))}
                  <div className="msg-search w-100">
                    <input
                      id="search-user"
                      className="msg-searchbox user-srch-txt"
                      type="search"
                      autoComplete="off"
                      name="search"
                      placeholder="Search user.."
                      onChange={searchUserHandler}
                    />
                    {newUserSearchResults.length !== 0 && (
                      <div className="add-grp-list">
                        {newUserSearchResults &&
                          newUserSearchResults.map((member) => (
                            <div
                              className="add-grp-member"
                              key={member.id}
                              onClick={() => addUserArrayHandler(member)}
                            >
                              {member.secondaryUserFirstName}{" "}
                              {member.secondaryUserLastName}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  {searchNameUser.length !== 0 &&
                    !newUserSearchResults.length && (
                      <div className="text-white"> No results found</div>
                    )}
                </div>
                <div className="modal-footer">
                  <a
                    className="close-modal-btn"
                    data-dismiss="modal"
                    onClick={resetAddUserHandler}
                  >
                    Cancel
                  </a>
                  <button
                    type="button"
                    className="save-btn-custom"
                    data-dismiss="modal"
                    disabled={newUserList.length === 0}
                    onClick={addUserHandler}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});
export default React.memo(GroupDetailsPanel);
