import React, { useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

//services
import {
  getConversationData,
  getAllRelationShipData,
  deleteThread,
  updateUserThread,
  updateMessageAsDelivered,
  getFlaggedLearnersInThread,
} from "../../../services/messageCenterServices";

//context

import { UserAuthState } from "../../../context/user/userContext";
import { useToastDispatch } from "../../../context/toast/toastContext";
import { useSignalRDispatch } from "../../../context/signalR/signalR";

import { useIsMounted } from "../../../utils/useIsMounted";
import { AppConfig } from "../../../services/config";

import logo from "../../../assets/img/blank-profile-picture.png";

import "../messageCenter.scss";
import { clearAlert } from "../../../utils/contants";

const MessageCenterConversations = React.memo((props) => {
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const signalR = useSignalRDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [isNewChat, setIsNewChat] = useState(false);
  const [conversationDataList, setConversationDataList] = useState([]);
  const [showConversationDataListActive, setShowConversationDataListActive] =
    useState([]);
  const [
    showConversationDataListInactive,
    setShowConversationDataListInactive,
  ] = useState([]);
  const [relationshipDataList, setRelationshipDataList] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedChat, setSelectedChat] = useState(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [showInactiveThreads, setShowInactiveThreads] = useState(false);
  const [currentIndexActive, setCurrentIndexActive] = useState("");
  const [currentIndexInactive, setCurrentIndexInactive] = useState("");
  const [threadUpdateMessage, setThreadUpdateMessage] = useState(undefined);
  const [threadUpdateMessageInfoTray, setThreadUpdateMessageInfoTray] =
    useState(undefined);
  const [threadUpdateMessageView, setThreadUpdateMessageView] =
    useState(undefined);
  const [prevSelectedChat, setPrevSelectedChat] = useState(undefined);

  const searchInputRef = useRef();
  const isMounted = useIsMounted();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  const [flaggedLearnersList, setFlaggedLearnersList] = useState([]);
  //show clicked chat selected from dashboard message center
  useEffect(() => {
    if (location.state?.thread) {
      showChatHandler(location.state.thread);
      navigate(location.pathname, { replace: true });
    }
  }, []);

  //conversation threads and relations update
  useEffect(() => {
    getConversationDataList();
    getAllRelationShipDataList();
  }, [threadUpdateMessageView]);

  //message read update API call
  useEffect(() => {
    if (threadUpdateMessage) {
      messageDeliveredUpdate();
    }
  }, [threadUpdateMessage]);

  //info tray api call
  useEffect(() => {
    props.setInformationTray();
  }, [threadUpdateMessageInfoTray]);

  //to remove unread message after selecting chat
  useEffect(() => {
    if (selectedChat) {
      resetConversationDataList();
    }
  }, [selectedChat]);

  useEffect(() => {
    setIsNewChat(props.showThreads);
    setSelectedChat(undefined);
    return () => {
      setSelectedProfiles([]);
    };
  }, [props.showThreads]);

  //selected chat set
  useEffect(() => {
    if (props.profile?.id) {
      setSelectedChat(props.profile);
    }
  }, [props.profile]);

  //disable chat input
  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("DisableThreadHubCommand", (message) => {
        console.log("DisableThreadHubCommand", message);
        if (message.length) {
          setThreadUpdateMessageView(message);
          setThreadUpdateMessageInfoTray(message);
        }
      });
    }
  });

  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("EnableThreadHubCommand", (message) => {
        if (message.length) {
          setThreadUpdateMessageView(message);
          setThreadUpdateMessageInfoTray(message);
        }
      });
    }
  });

  //live listen calls
  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("ReceiveGroupCreated", async (message) => {
        if (isMounted() && message.isNewThread) {
          setThreadUpdateMessage(message);
        }
      });

      signalR.hubConnection.on("NewMemberAdded", (message) => {
        if (isMounted()) {
          if (
            conversationDataList.find((thread) => thread.id === message.id) ||
            message.userThread.find(
              (user) => user.applicationUserId === userState.user.id
            )
          ) {
            setThreadUpdateMessage(message);
          }
        }
      });

      signalR.hubConnection.on("LeaveChat", (message) => {
        if (isMounted()) {
          props.messageLabelHandler(message.threadName);
          setThreadUpdateMessage(message);
        }
      });

      signalR.hubConnection.on("BlockUser", (message) => {
        if (isMounted()) {
          setThreadUpdateMessageView(message);
        }
      });

      signalR.hubConnection.on("UnblockUser", (message) => {
        if (isMounted()) {
          setThreadUpdateMessageView(message);
        }
      });

      signalR.hubConnection.on("UpdateThreadName", (message) => {
        if (isMounted()) {
          props.messageLabelHandler(message.threadName);
          setThreadUpdateMessage(message);
        }
      });

      signalR.hubConnection.on("ReceiveMessage", (message) => {
        if (isMounted()) {
          if (
            message.threadUsers.find(
              (user) => user.applicationUserId === userState.user.id
            ).isBlock ||
            message.threadUsers.find(
              (user) => user.applicationUserId === userState.user.id
            ).isExit
          ) {
            return;
          }
          setThreadUpdateMessage(message);
        }
      });

      signalR.hubConnection?.on("DeleteContact", (message) => {
        if (isMounted()) {
          setThreadUpdateMessageView(message);
          setThreadUpdateMessageInfoTray(message);
        }
      });

      signalR.hubConnection?.on("ContactWithoutThread", (message) => {
        if (isMounted() && message.find((id) => id === userState.user.id)) {
          setThreadUpdateMessageView(message);
        }
      });
    }
  });

  //live call for info tray
  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("ReceiveGroupCreated", async (message) => {
        if (isMounted() && message.isNewThread) {
          setThreadUpdateMessageInfoTray(message);
        }
      });
      signalR.hubConnection.on("ReceiveMessage", (message) => {
        if (isMounted()) {
          if (
            message.threadUsers.find(
              (user) => user.applicationUserId === userState.user.id
            ).isBlock
          ) {
            return;
          }
          setThreadUpdateMessageInfoTray(message);
        }
      });
    }
  });

  //set message as delivered API
  const messageDeliveredUpdate = () => {
    let reqData = {
      currentDate: new Date().toISOString(),
      applicationUserId: userState.user.id,
    };
    updateMessageAsDelivered(reqData)
      .then(async (res) => {
        await getConversationDataList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //conversation reset manual setup
  const resetConversationDataList = () => {
    let data = conversationDataList;

    let dataIndex = data.findIndex((thread) => thread.id === selectedChat.id);
    if (dataIndex >= 0 && data[dataIndex].unreadMessageCount > 0) {
      // props.setInformationTray();
      data[dataIndex].unreadMessageCount = 0;
      setConversationDataList(data);

      if (data[dataIndex].isActive) {
        data = showConversationDataListActive;
        dataIndex = data.findIndex((thread) => thread.id === selectedChat.id);
        if (dataIndex >= 0) {
          data[dataIndex].unreadMessageCount = 0;
          setShowConversationDataListActive(data);
        }
      } else {
        data = showConversationDataListActive;
        dataIndex = data.findIndex((thread) => thread.id === selectedChat.id);
        if (dataIndex >= 0) {
          data[dataIndex].unreadMessageCount = 0;
          setShowConversationDataListInactive(data);
        }
      }
    }
  };

  //get all relationships
  const getAllRelationShipDataList = () => {
    let uuid = userState.user.id;
    getAllRelationShipData(uuid)
      .then((res) => {
        let data = res.data.$values;
        data = data.filter(
          (relation) =>
            relation.secondaryUserIsActive && !relation.secondaryUserIsSuspended
        );
        if (isMounted() && data) {
          setRelationshipDataList(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //get all conversation threads
  const getConversationDataList = () => {
    let uuid = userState.user.id;
    getConversationData(uuid)
      .then(async (res) => {
        let data = await res.data.$values;
        if (isMounted() && data) {
          getFlaggedLearnersInThread(AppConfig.mobileOrganizationId)
            .then(async (res) => {
              if (isMounted() && res.data.$values)
                setFlaggedLearnersList(res.data.$values);
            })
            .catch((err) => {
              console.log(err);
            });

          setCurrentIndexActive("");

          setConversationDataList(data);
          setShowConversationDataListActive(
            data.filter((thread) => thread.isActive)
          );
          setShowConversationDataListInactive(
            data.filter((thread) => !thread.isActive)
          );
          if (selectedChat) {
            setSelectedChat(data.find((chat) => chat.id === selectedChat.id));
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //create new thread view changes
  const newChathandler = () => {
    console.log(isNewChat);
    if (!isNewChat) {
      setPrevSelectedChat(selectedChat);
      setSelectedChat(undefined);
      props.chatHandler(undefined, false);
      props.showChatInput(false);
      props.messageLabelHandler("Panel");
    } else if (prevSelectedChat) {
      showChatHandler(prevSelectedChat);
      setPrevSelectedChat(undefined);
    } else {
      props.showChatInput(false);
      props.messageLabelHandler("Panel");
    }
    setIsNewChat(!isNewChat);
    setSelectedProfiles([]);
    props.showAllThreads(false);
  };

  //creating user array for adding new users to thread
  const newThreadCreateHandler = (profile) => {
    const profiles = selectedProfiles;
    if (
      props.addUserToThreadDetails?.userThread.$values.find(
        (member) =>
          member.applicationUserId === profile.secondaryUserId && !member.isExit
      )
    ) {
      toast({
        type: "warning",
        text: "User is already in the thread",
      });
      return;
    }
    if (
      profiles.find((obj) => obj.secondaryUserId === profile.secondaryUserId)
    ) {
      let index = profiles.findIndex(
        (obj) => obj.secondaryUserId === profile.secondaryUserId
      );
      profiles.splice(index, 1);
    } else {
      profiles.push(profile);
    }
    let showName = "";
    let welcomeMessage = "";
    for (let i = 0; i < profiles?.length; i++) {
      showName = showName + profiles[i].secondaryUserFirstName;
      welcomeMessage = welcomeMessage + profiles[i].secondaryUserFirstName;
      if (i !== profiles.length - 1) {
        showName = showName + ", ";
      }
      if (profiles.length > 1) {
        if (i < profiles.length - 2) {
          welcomeMessage = welcomeMessage + ", ";
        } else if (i === profiles.length - 2) {
          welcomeMessage = welcomeMessage + " & ";
        }
      }
    }
    if (profiles.length > 1) {
      showName = userState.user.firstName + ", " + showName;
    }

    setSelectedProfiles(profiles);
    props.welcomeMessageLabelHandler(welcomeMessage);
    props.chatHandler(profiles, false);

    if (!props.addUserToThreadDetails) {
      props.chatHandler(profiles, true);
      props.messageLabelHandler(showName);
      props.showChatInput(profiles.length ? true : false);
    }
  };

  //view modes for new chat and conversations
  const showChatHandler = (profile) => {
    props.chatHandler(profile, false);
    props.showChatInput(true);
    setSelectedChat(profile);

    props.messageLabelHandler(
      profile.userThread?.$values?.length < 3
        ? `${profile.secondaryUserFirstName} ${profile.secondaryUserLastName}`
        : profile.threadName
    );
    props.welcomeMessageLabelHandler(null);
  };

  //search conversations
  const search = async (value) => {
    if (value.length > 0) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setShowInactiveThreads(false);
    }

    const filtered = conversationDataList.filter((chat) => {
      return (chat.secondaryUserFirstName + " " + chat.secondaryUserLastName)
        .toLowerCase()
        .includes(value.toLowerCase(), 0);
    });
    setShowConversationDataListActive(
      filtered.filter((thread) => thread.isActive)
    );
    setShowConversationDataListInactive(
      filtered.filter((thread) => !thread.isActive)
    );
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const onOptimisedHandleChange = debounce(search, 500);

  //delete a thread
  const deleteThreadHandler = (mode) => {
    searchInputRef.current.value = "";
    let threadId =
      mode === "active"
        ? showConversationDataListActive[currentIndexActive].id
        : showConversationDataListInactive[currentIndexInactive].id;
    let reqData = {
      applicationUserId: userState.user.id,
      deleteDate: new Date().toISOString(),
      messageThreadIds: [threadId],
    };

    deleteThread(reqData)
      .then((res) => {
        let data = res.data.$values;
        toast({
          type: "success",
          text: "Thread deleted successfully.",
        });
        if (isMounted()) {
          getConversationDataList();
          props.setInformationTray();

          if (selectedChat?.id === reqData.messageThreadIds[0]) {
            props.showChatInput(false);
            setSelectedChat(undefined);
            props.chatHandler(undefined, false);
            props.messageLabelHandler("Panel");
            props.showAllThreads(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //block user
  const blockUserHandler = async (mode) => {
    searchInputRef.current.value = "";

    let thread =
      mode === "active"
        ? showConversationDataListActive[currentIndexActive]
        : showConversationDataListInactive[currentIndexInactive];
    let reqThread = thread.userThread.$values.find(
      (user) => user.applicationUserId === userState.user.id
    );
    let reqData = await {
      id: reqThread.id,
      messageThreadId: thread.id,
      applicationUserId: userState.user.id,
      enrolledDate: null,
      hasHistoryEnabled: true,
      isBlock: reqThread.isBlock === true ? false : true,
      blockedDate: reqThread.isBlock === true ? null : new Date().toISOString(),
      isCleared: false,
      clearedDate: null,
      isDelete: reqThread.isDelete,
      deleteDate: reqThread.deleteDate,
      isExit: false,
      exitDate: null,
      userFirstName: userState.user.firstName,
      isValidateUser: true,
      isNewThread: false,
      currentDate: new Date().toISOString(),
      deviceId: "",
    };
    updateUserThread(reqThread.id, reqData)
      .then(async (res) => {
        let data = await res;
        let hubReqData = {
          primaryUserId: thread.primaryUserId,
          primaryUserFirstName: thread.primaryUserFirstName,
          primaryUserLastName: thread.primaryUserLastName,
          secondaryUserId: thread.secondaryUserId,
          secondaryUserFirstName: thread.secondaryUserFirstName,
          secondaryUserLastName: thread.secondaryUserLastName,
          secondaryUserPositionTitle: thread.secondaryUserPositionTitle,
          secondaryUserEstablishmentName: thread.secondaryUserEstablishmentName,
          threadCount: thread.threadCount,
          isGroupThread: thread.isGroupThread,
          isThreadNameChanged: thread.isThreadNameChanged,
          deviceId: thread.deviceId,
          id: thread.id,
          signalRActionUserId: userState.user.id,
        };
        let timeOutId = await setTimeout(() => {
          signalR.hubConnection.send(
            "UpdateSettings",
            reqThread.isBlock === true ? "Unblock" : "Block",
            thread.id,
            hubReqData
          );
          props.setUpdateRequest(hubReqData);
        }, 200);
        timeOutIDs.current.push(timeOutId);
        toast({
          type: "success",
          text: `User ${
            reqThread.isBlock === true ? "unblocked" : "blocked"
          } successfully.`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dateTimeFormatter = (data) => {
    if (data) {
      return new Date(
        new Date(data).getTime() -
          new Date(data).getTimezoneOffset() * 60 * 1000
      );
    }
  };

  const flaggedLearnerShowHandler = (id) => {
    return flaggedLearnersList.some(
      (learner) => learner.applicationUserId === id
    );
  };

  return (
    <React.Fragment>
      {/* Conversation Threads */}
      {!isNewChat && (
        <div className="col-xl-3 col-lg-3 col-md-3">
          <div className="card shadow mb-4 msg-card">
            <div className="card-header">
              <div className="msg-list-head">
                <div className="text3 pb-2">Conversations</div>
                {userState.messageThreadCreate && (
                  <div className="add-convo">
                    <span
                      onClick={newChathandler}
                      className="material-icons add-convo-icon mr-0"
                    >
                      sms
                    </span>
                  </div>
                )}
              </div>
              <div className="msg-search">
                <input
                  ref={searchInputRef}
                  className="msg-searchbox"
                  type="search"
                  autoComplete="off"
                  name="search"
                  placeholder="Search for chat.."
                  onChange={(e) => {
                    onOptimisedHandleChange(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Active chat */}
            <div className="card-body p-0 msg-overflow mb-2">
              {showConversationDataListActive.length > 0 &&
                showConversationDataListActive.map((chat, index) => (
                  <div
                    key={index}
                    id={chat.id}
                    className={
                      chat?.id === selectedChat?.id
                        ? "selected-msg chat-user-main border-bot hover-msg"
                        : "border-bot chat-user-main hover-msg"
                    }
                  >
                    <div className="d-flex w-100 ml-2">
                      <div
                        className="d-flex w-88 chat-list-left"
                        onClick={
                          chat?.id !== selectedChat?.id
                            ? () => showChatHandler(chat)
                            : null
                        }
                      >
                        <div className="profile-pic mt-2 mr-1 position-relative">
                          <div className="position-relative">
                            {chat.threadCount > 2 && (
                              // <span className="group-count">
                              //   {chat.threadCount}
                              // </span>
                              <div className="members-icon">
                                <div className="icon__value">
                                  {chat.threadCount}
                                </div>
                              </div>
                            )}
                            <img
                              src={
                                chat.secondaryUserUploadedImageUrl
                                  ? chat.secondaryUserUploadedImageUrl +
                                    "?" +
                                    Date.now()
                                  : logo
                              }
                              className="rounded-circle ml-2 object-cover"
                              alt="Profile"
                              width="44"
                              height="44"
                            />
                            {flaggedLearnerShowHandler(
                              chat.secondaryUserId
                            ) && (
                              <span className="material-icons warning-icon-message">
                                warning
                              </span>
                            )}
                          </div>

                          <span className="badge"></span>
                        </div>
                        <div className="">
                          <h5
                            className="text-8 mt-2 pl-2"
                            data-tip
                            data-for={chat.id}
                          >
                            <ReactTooltip
                              id={chat.id}
                              className="tooltip-react"
                              border
                              arrowColor="#2C2A5F"
                              place="top"
                              effect="solid"
                            >
                              {chat.userThread.$values?.length < 3
                                ? `${chat.secondaryUserFirstName} ${chat.secondaryUserLastName}`
                                : chat.threadName}
                            </ReactTooltip>

                            {chat.userThread.$values?.length < 3
                              ? `${chat.secondaryUserFirstName} ${chat.secondaryUserLastName}`
                              : chat.threadName?.length > 22
                              ? chat.threadName.slice(0, 22) + "..."
                              : chat.threadName}
                          </h5>
                          {new Date().getDate() ===
                            dateTimeFormatter(
                              chat.lastMessageDate
                            )?.getDate() && (
                            <p className="smallText pl-3">
                              {chat.lastMessageDate
                                ? `${dateTimeFormatter(
                                    chat.lastMessageDate
                                  )?.toLocaleString("en-US", {
                                    hour: "numeric", // numeric, 2-digit
                                    minute: "numeric", // numeric, 2-digit
                                  })}`
                                : ""}
                            </p>
                          )}

                          {new Date().getDate() !==
                            dateTimeFormatter(
                              chat.lastMessageDate
                            )?.getDate() && (
                            <p className="smallText day-capitalize pl-2">
                              {chat.lastMessageDate
                                ? `${dateTimeFormatter(
                                    chat.lastMessageDate
                                  )?.toLocaleString("en-US", {
                                    weekday: "short", //long, short, narrow
                                  })}
                                  ${dateTimeFormatter(
                                    chat.lastMessageDate
                                  )?.toLocaleString("en-US", {
                                    month: "2-digit", // numeric, 2-digit, long, short, narrow
                                    day: "2-digit", // numeric, 2-digit
                                    year: "2-digit", // numeric, 2-digit
                                  })}`
                                : ""}
                            </p>
                          )}
                        </div>
                        {chat.unreadMessageCount !== 0 &&
                          chat?.id !== selectedChat?.id && (
                            <div className="unread-count">
                              <div className="unread-count-value">
                                {chat.unreadMessageCount}
                              </div>
                            </div>
                          )}

                        {/* <div className="unread-count">
                                <div className="unread-count-value">1</div>
                          </div> */}
                      </div>
                      <div className="d-flex mt-4">
                        {!chat.isReadySkillRepresentative &&
                          (userState.messageThreadBlock ||
                            userState.messageThreadDelete) && (
                            <div className="dropdown">
                              <span
                                className="material-icons data-toggle drop-menu-icon mr-2 ml-auto"
                                data-toggle="dropdown"
                              >
                                more_vert
                              </span>
                              <ul className={"dropdown-menu msg-user-dropdown"}>
                                {userState.messageThreadBlock &&
                                  chat.userThread.$values.length === 2 && (
                                    <li
                                      className="msg-drop-links"
                                      onClick={() => {
                                        setCurrentIndexActive(index);
                                      }}
                                      data-target="#block-msg-user"
                                      data-toggle="modal"
                                    >
                                      <a
                                        className="msg-drop-item"
                                        data-target="#block-msg-user"
                                        data-toggle="modal"
                                      >
                                        {chat.userThread.$values.find(
                                          (user) =>
                                            user.applicationUserId ===
                                              userState.user.id && user.isBlock
                                        )
                                          ? "Unblock User"
                                          : "Block User"}
                                      </a>
                                    </li>
                                  )}

                                {userState.messageThreadDelete && (
                                  <li
                                    className="msg-drop-links"
                                    onClick={() => {
                                      setCurrentIndexActive(index);
                                    }}
                                    data-target="#remove-msg-user"
                                    data-toggle="modal"
                                  >
                                    <a
                                      className="msg-drop-item"
                                      data-target="#remove-msg-user"
                                      data-toggle="modal"
                                    >
                                      Delete Coversation
                                    </a>
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                      {/* //block user modal */}
                      <div
                        className="modal fade"
                        id="block-msg-user"
                        tabIndex="-1"
                        aria-labelledby="delete-modal"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="subHead-text-learner modal-title h4"
                                id="delete-modalLabel-active"
                              >
                                {showConversationDataListActive[
                                  currentIndexActive
                                ]?.userThread?.$values.find(
                                  (user) =>
                                    user.applicationUserId ===
                                      userState.user.id && user.isBlock
                                )
                                  ? "Unblock User"
                                  : "Block User"}
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body text-white">
                              Are you sure you want to{" "}
                              {showConversationDataListActive[
                                currentIndexActive
                              ]?.userThread?.$values.find(
                                (user) =>
                                  user.applicationUserId ===
                                    userState.user.id && user.isBlock
                              )
                                ? "unblock"
                                : "block"}{" "}
                              this user?
                            </div>
                            <div className="modal-footer">
                              <a
                                className="close-modal-btn"
                                data-dismiss="modal"
                                onClick={() => setCurrentIndexActive("")}
                              >
                                Cancel
                              </a>
                              <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={() => blockUserHandler("active")}
                              >
                                {showConversationDataListActive[
                                  currentIndexActive
                                ]?.userThread?.$values.find(
                                  (user) =>
                                    user.applicationUserId ===
                                      userState.user.id && user.isBlock
                                )
                                  ? "Unblock"
                                  : "Block"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* //remove user modal */}
                      <div
                        className="modal fade"
                        id="remove-msg-user"
                        tabIndex="-1"
                        aria-labelledby="delete-modal"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="subHead-text-learner modal-title h4"
                                id="delete-modalLabel-active"
                              >
                                Delete Coversation
                              </h5>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body text-white">
                              Are you sure you want to delete this conversation?
                            </div>
                            <div className="modal-footer">
                              <a
                                className="close-modal-btn"
                                data-dismiss="modal"
                                onClick={() => setCurrentIndexActive("")}
                              >
                                Cancel
                              </a>
                              <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={() => deleteThreadHandler("active")}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {isSearching && showConversationDataListActive.length === 0 && (
                <p className="no-srch-result">
                  No search results found for active chats
                </p>
              )}

              {/* Inactive Chat */}
              {isSearching && (
                <div>
                  <a onClick={() => setShowInactiveThreads(true)}>
                    <div className="show-inactive cursor-pointer">
                      {!showInactiveThreads
                        ? "Search inactive chats"
                        : "Inactive chats"}
                    </div>
                  </a>
                  {showConversationDataListInactive &&
                    showInactiveThreads &&
                    showConversationDataListInactive.map((chat, i) => (
                      <div
                        key={i}
                        id={chat.id}
                        className={
                          chat?.id === selectedChat?.id
                            ? "selected-msg border-bot"
                            : "border-bot"
                        }
                      >
                        <div className="d-flex w-100 ml-2 ">
                          <div
                            className="d-flex w-88"
                            onClick={
                              chat?.id !== selectedChat?.id
                                ? () => showChatHandler(chat)
                                : null
                            }
                          >
                            <div className="profile-pic my-2 mr-1  position-relative">
                              <div className="position-relative">
                                {chat.threadCount > 2 && (
                                  <span className="group-count">
                                    {chat.threadCount}
                                  </span>
                                )}
                                <img
                                  src={
                                    chat.secondaryUserUploadedImageUrl
                                      ? chat.secondaryUserUploadedImageUrl +
                                        "?" +
                                        Date.now()
                                      : logo
                                  }
                                  className="rounded-circle ml-2 object-cover"
                                  alt="Profile"
                                  width="44"
                                  height="44"
                                />
                                {flaggedLearnerShowHandler(
                                  chat.secondaryUserId
                                ) && (
                                  <span className="material-icons warning-icon-message">
                                    warning
                                  </span>
                                )}
                              </div>
                              <span className="badge"></span>
                            </div>
                            <div className="">
                              <h5
                                className="text-8 mt-2 pl-2"
                                data-tip
                                data-for={chat.id}
                              >
                                <ReactTooltip
                                  id={chat.id}
                                  className="tooltip-react"
                                  border
                                  arrowColor="#2C2A5F"
                                  place="top"
                                  effect="solid"
                                >
                                  {chat.userThread.$values?.length < 3
                                    ? `${chat.secondaryUserFirstName} ${chat.secondaryUserLastName}`
                                    : chat.threadName}
                                </ReactTooltip>
                                {chat.userThread.$values.length < 3
                                  ? `${chat.secondaryUserFirstName} ${chat.secondaryUserLastName}`
                                  : chat.threadName}
                              </h5>

                              <p className="smallText day-capitalize pl-2">
                                {chat.lastMessageDate
                                  ? `${dateTimeFormatter(
                                      chat.lastMessageDate
                                    ).toLocaleString("en-US", {
                                      weekday: "short", //long, short, narrow
                                      month: "2-digit", // numeric, 2-digit, long, short, narrow
                                      day: "2-digit", // numeric, 2-digit
                                      year: "2-digit", // numeric, 2-digit
                                    })}
                                    `
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex mt-4 w-auto">
                            {chat.unreadMessageCount !== 0 && (
                              <span className="msg-count-badge">
                                {chat.unreadMessageCount}
                              </span>
                            )}
                            {!chat.isReadySkillRepresentative &&
                              (userState.messageThreadBlock ||
                                userState.messageThreadDelete) && (
                                <div className="dropdown">
                                  <span
                                    className="material-icons data-toggle drop-menu-icon mr-2 ml-auto"
                                    data-toggle="dropdown"
                                  >
                                    more_vert
                                  </span>
                                  <ul
                                    className={
                                      "dropdown-menu msg-user-dropdown"
                                    }
                                  >
                                    {userState.messageThreadBlock &&
                                      chat.userThread.$values.length === 2 && (
                                        <li
                                          className="msg-drop-links"
                                          onClick={() =>
                                            setCurrentIndexInactive(i)
                                          }
                                          data-target="#block-msg-user-inactive"
                                          data-toggle="modal"
                                        >
                                          <a
                                            className="msg-drop-item"
                                            data-target="#block-msg-user-inactive"
                                            data-toggle="modal"
                                          >
                                            {chat.userThread.$values.find(
                                              (user) =>
                                                user.applicationUserId ===
                                                  userState.user.id &&
                                                user.isBlock
                                            )
                                              ? "Unblock User"
                                              : "Block User"}{" "}
                                          </a>
                                        </li>
                                      )}
                                    {userState.messageThreadDelete && (
                                      <li
                                        className="msg-drop-links"
                                        onClick={() =>
                                          setCurrentIndexInactive(i)
                                        }
                                        data-target="#remove-msg-user-inactive"
                                        data-toggle="modal"
                                      >
                                        <a
                                          className="msg-drop-item"
                                          data-target="#remove-msg-user-inactive"
                                          data-toggle="modal"
                                        >
                                          Delete Coversation
                                        </a>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>

                          {/* //block user modal */}
                          <div
                            className="modal fade"
                            id="block-msg-user-inactive"
                            tabIndex="-1"
                            aria-labelledby="delete-modal"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="subHead-text-learner modal-title h4"
                                    id="block-modalLabel-inactive"
                                  >
                                    {showConversationDataListInactive[
                                      currentIndexInactive
                                    ]?.userThread?.$values.find(
                                      (user) =>
                                        user.applicationUserId ===
                                          userState.user.id && user.isBlock
                                    )
                                      ? "Unblock User"
                                      : "Block User"}{" "}
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body text-white">
                                  Are you sure you want to{" "}
                                  {showConversationDataListInactive[
                                    currentIndexInactive
                                  ]?.userThread?.$values.find(
                                    (user) =>
                                      user.applicationUserId ===
                                        userState.user.id && user.isBlock
                                  )
                                    ? "unblock"
                                    : "block"}{" "}
                                  this user?{" "}
                                </div>
                                <div className="modal-footer">
                                  <a
                                    className="close-modal-btn"
                                    data-dismiss="modal"
                                    onClick={() => setCurrentIndexInactive("")}
                                  >
                                    Cancel
                                  </a>
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-dismiss="modal"
                                    onClick={() => blockUserHandler("inactive")}
                                  >
                                    {showConversationDataListActive[
                                      currentIndexActive
                                    ]?.userThread?.$values.find(
                                      (user) =>
                                        user.applicationUserId ===
                                          userState.user.id && user.isBlock
                                    )
                                      ? "Unblock"
                                      : "Block"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* //remove user modal */}
                          <div
                            className="modal fade"
                            id="remove-msg-user-inactive"
                            tabIndex="-1"
                            aria-labelledby="delete-modal"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="delete-modalLabel-inactive"
                                  >
                                    Delete Coversation
                                  </h5>
                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  Are you sure you want to delete this
                                  conversation?
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                    onClick={() => setCurrentIndexInactive("")}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-dismiss="modal"
                                    onClick={() =>
                                      deleteThreadHandler("inactive")
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {isSearching &&
                showInactiveThreads &&
                showConversationDataListInactive.length === 0 && (
                  <p className="no-srch-result">
                    No search results found for inactive chats
                  </p>
                )}
            </div>
          </div>
        </div>
      )}
      {/* Conversation Threads ends */}

      {/* All relationships */}
      {isNewChat && (
        <div className="col-xl-3 col-lg-3 col-md-3">
          <div className="card shadow mb-4 msg-card">
            <div className="card-header">
              <div className="msg-list-head">
                <div className="text3 pb-2">Conversations</div>
                <div className="add-convo">
                  <span className="material-icons selected-convo-icon mr-0">
                    sms
                  </span>
                </div>
              </div>
            </div>
            <div className="new-convo">
              <div className="smallText-white">
                NEW CONVERSATION (SELECT ONE OR MORE)
              </div>
              <a className="cancel-convo" to={"#"} onClick={newChathandler}>
                CANCEL
              </a>
            </div>
            <div className="card-body add-convo-card p-0 msg-overflow">
              {relationshipDataList &&
                relationshipDataList.map((relation, index) => {
                  if (!relation.isReadySkillRepresentative) {
                    return (
                      <div
                        key={index}
                        className={
                          selectedProfiles.find(
                            (obj) =>
                              obj?.secondaryUserId === relation?.secondaryUserId
                          ) !== undefined
                            ? "selected-msg-1 chat-user-main border-bot hover-msg-1"
                            : "border-bot chat-user-main hover-msg-1"
                        }
                        onClick={() => newThreadCreateHandler(relation)}
                      >
                        <div className="d-flex w-100 ml-2 ">
                          <div className="profile-pic mt-2  position-relative">
                            <img
                              src={
                                relation.secondaryUserUploadedImageUrl
                                  ? relation.secondaryUserUploadedImageUrl +
                                    "?" +
                                    Date.now()
                                  : logo
                              }
                              className="rounded-circle ml-2 object-cover position-relative"
                              alt="Profile"
                              width="44"
                              height="44"
                            />
                            {flaggedLearnerShowHandler(
                              relation.secondaryUserId
                            ) && (
                              <span className="material-icons warning-icon-message">
                                warning
                              </span>
                            )}

                            <span className="badge"></span>
                          </div>
                          <div className="new-contact-sec">
                            {" "}
                            <h5 className="text-8 mt-2 pl-2 mr-2 text-capitalize new-contact-name">{`${relation.secondaryUserFirstName} ${relation.secondaryUserLastName}`}</h5>
                            <p className="smallText pl-3 text-uppercase text-wrap">
                              {relation.secondaryUserPositionTitle}{" "}
                              {relation.secondaryUserEstablishmentName}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      )}
      {/* All relationships ends */}
    </React.Fragment>
  );
});

export default React.memo(MessageCenterConversations);
