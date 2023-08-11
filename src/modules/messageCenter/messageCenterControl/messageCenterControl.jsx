import React, { useEffect, useRef, useState } from "react";

//components
import MessageCenterChatInput from "./messageCenterChatInput";
import MessageCenterChatWindow from "./messageCenterChatWindow";

//services
import {
  getChatHistory,
  createThreadRequest,
  updateMessageAsRead,
  sendMessageRequest,
  addNewUsertoThread,
  updateUserThread,
  getBlockedUsersInThread,
  sendNotificationRequest,
  getUsersForThread,
} from "../../../services/messageCenterServices";

//context
import { UserAuthState } from "../../../context/user/userContext";
import { useToastDispatch } from "../../../context/toast/toastContext";
import { useSignalRDispatch } from "../../../context/signalR/signalR";

import { useIsMounted } from "../../../utils/useIsMounted";

import "../messageCenter.scss";
import { clearAlert } from "../../../utils/contants";

const MessageCenterControl = React.memo((props) => {
  const userState = UserAuthState();
  const toast = useToastDispatch();
  const signalR = useSignalRDispatch();

  const [chatHistoryData, setChatHistoryData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showChatData, setShowChatData] = useState([]);
  const [threadId, setThreadId] = useState();
  const [threadDetails, setThreadDetails] = useState(undefined);
  const [threadUpdateMessageBlock, setThreadUpdateMessageBlock] =
    useState(undefined);
  const [threadUpdateMessageLeave, setThreadUpdateMessageLeave] =
    useState(undefined);
  const [threadUpdateMessageNewUser, setThreadUpdateMessageNewUser] =
    useState(undefined);
  const [leftChat, setLeftChat] = useState(false);

  const [usersInThread, setUsersInThread] = useState([]);

  const isMounted = useIsMounted();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  //message read update and get all threads API call
  useEffect(() => {
    if (props.profile?.id && !props.newRelation) {
      getChatHistoryData();
      getBlockedUsers();
      messageReadUpdate();
      getUserListForThread();
    } else if (!props.addUserToThreadDetails) {
      setShowChatData([]);
    }
    if(props.profile?.userThread?.$values.length === 2 &&
      (!props.profile.secondaryUserIsActive ||
        props.profile.secondaryUserIsSuspended)) {
      toast({
        type: "warning",
        text: "This User Account Is Suspended or Deleted. Unable to send message to the Suspended or Deleted Contact.",
      });
    }
    return () => {
      if (props.addUserToThreadDetails) {
        setShowChatData([]);
      }
    };
    // }, [props.profile?.userThread]);
  }, [props.profile?.id]);

  //reset search input and reset left status
  useEffect(() => {
    if (props.profile) {
      setSearchInput("");
      setLeftChat(false);
    }
    return () => {
      setContactDeleted(false);
    };
  }, [props.profile]);

  //add user from chat panel
  useEffect(() => {
    if (props.addUserToThreadDetails) {
      setThreadDetails(props.addUserToThreadDetails);
    }
    return () => {
      setThreadDetails(undefined);
    };
  }, [props.addUserToThreadDetails]);

  const [notActiveInSystem, setNotActiveInSystem] = useState([]);
  const [activeInSystem, setActiveInSystem] = useState([]);
  const [contactDeleted, setContactDeleted] = useState(false);

  //disable chat input
  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("DisableThreadHubCommand", (message) => {
        setNotActiveInSystem(message);
      });
    }
  });
  useEffect(() => {
    if (
      notActiveInSystem.length &&
      notActiveInSystem.some((id) => id === props.profile?.secondaryUserId)
    ) {
      setContactDeleted(true);
    }
  }, [notActiveInSystem]);

  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("EnableThreadHubCommand", (message) => {
        setActiveInSystem(message);
      });
    }
  });

  useEffect(() => {
    if (
      activeInSystem.length &&
      activeInSystem.some((id) => id === props.profile?.secondaryUserId)
    ) {
      setContactDeleted(false);
    }
  }, [activeInSystem]);

  //send welcome message for newly added user from detail panel
  useEffect(() => {
    if (props.userAddedMessage) {
      getUserListForThread();
      sendMessageHandler(
        props.userAddedMessage.messageThreadId,
        props.userAddedMessage
      );
    }
  }, [props.userAddedMessage]);

  //live message update
  useEffect(() => {
    if (
      props.hubLiveMessage &&
      props.hubLiveMessage.messageThreadId === props.profile?.id
    ) {
      props.hubLiveMessage.groupActivity = "live message";
      setChatHistoryData((preMessages) => [
        ...preMessages,
        props.hubLiveMessage,
      ]);
      setShowChatData((preShowMessages) => [
        ...preShowMessages,
        props.hubLiveMessage,
      ]);
      messageReadUpdate();
    }
  }, [props.hubLiveMessage]);

  //live message for block and unblock
  useEffect(() => {
    if (
      threadUpdateMessageBlock &&
      threadUpdateMessageBlock.id === props.profile?.id
    ) {
      if (threadUpdateMessageBlock.primaryUserId === userState.user.id) {
        props.profile.userThread.$values.forEach((element, index) => {
          if (
            element.applicationUserId === threadUpdateMessageBlock.primaryUserId
          ) {
            props.profile.userThread.$values[index].isBlock = true;
          }
        });
        setChatHistoryData((preMessages) => [
          ...preMessages,
          {
            isGroupActivity: true,
            groupActivity: "Block",
            text: "You blocked this chat",
            postedDate: new Date().toISOString(),
          },
        ]);
        setShowChatData((preShowMessages) => [
          ...preShowMessages,
          {
            isGroupActivity: true,
            groupActivity: "Block",
            text: "You blocked this chat",
            postedDate: new Date().toISOString(),
          },
        ]);
      } else {
        setChatHistoryData((preMessages) => [
          ...preMessages,
          {
            isGroupActivity: true,
            groupActivity: "Block",
            text:
              threadUpdateMessageBlock.primaryUserFirstName + " blocked you",
            postedDate: new Date().toISOString(),
          },
        ]);
        setShowChatData((preShowMessages) => [
          ...preShowMessages,
          {
            isGroupActivity: true,
            groupActivity: "Block",
            text:
              threadUpdateMessageBlock.primaryUserFirstName + " blocked you",
            postedDate: new Date().toISOString(),
          },
        ]);
      }
    } else if (
      threadUpdateMessageBlock &&
      threadUpdateMessageBlock.primaryUserId === userState.user.id
    ) {
      if (
        props.profile?.userThread?.$values?.some(
          (user) =>
            user.applicationUserId === threadUpdateMessageBlock.secondaryUserId
        )
      ) {
        toast({
          type: "warning",
          text: "The thread includes one or more blocked users.The responses from them will not be blocked in the group thread",
        });
      }
    }
  }, [threadUpdateMessageBlock]);

  //block message remove from array on unblock
  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("UnblockUser", (message) => {
        if (message.id === props.profile?.id) {
          props.profile.userThread.$values.forEach((element, index) => {
            if (element.applicationUserId === message.primaryUserId) {
              props.profile.userThread.$values[index].isBlock = false;
            }
          });
          let filterData = chatHistoryData.filter(
            (msg) => msg.groupActivity !== "Block"
          );
          if (filterData) {
            setChatHistoryData(filterData);
            setShowChatData(filterData);
          }
        }
      });
    }
  });

  //live message for leave chat
  useEffect(() => {
    if (
      threadUpdateMessageLeave &&
      threadUpdateMessageLeave.id === props.profile?.id &&
      threadUpdateMessageLeave.primaryUserId !== userState.user.id &&
      threadUpdateMessageLeave.userThread.find(
        (currentUser) =>
          currentUser.applicationUserId === userState.user.id &&
          !currentUser.isExit
      )
    ) {
      setChatHistoryData((preMessages) => [
        ...preMessages,
        {
          isGroupActivity: true,
          groupActivity: "Left",
          text:
            threadUpdateMessageLeave.primaryUserFirstName +
            " " +
            threadUpdateMessageLeave.primaryUserLastName +
            " left this chat",
          messageThreadId: threadUpdateMessageLeave.id,
          postedDate: new Date().toISOString(),
        },
      ]);
      setShowChatData((preShowMessages) => [
        ...preShowMessages,
        {
          isGroupActivity: true,
          groupActivity: "Left",
          text:
            threadUpdateMessageLeave.primaryUserFirstName +
            " " +
            threadUpdateMessageLeave.primaryUserLastName +
            " left this chat",
          messageThreadId: threadUpdateMessageLeave.id,
          postedDate: new Date().toISOString(),
        },
      ]);

      let leftUserIndex = props.profile.userThread.$values.findIndex(
        (user) =>
          user.applicationUserId === threadUpdateMessageLeave.primaryUserId
      );
      props.profile.userThread.$values[leftUserIndex].isExit = true;
    }
  }, [threadUpdateMessageLeave]);

  //live message call for block
  useEffect(() => {
    signalR.hubConnection?.on("BlockUser", (message) => {
      if (isMounted()) {
        setThreadUpdateMessageBlock(message);
      }
    });
  });

  //live message for user added
  useEffect(() => {
    if (
      threadUpdateMessageNewUser &&
      threadUpdateMessageNewUser.id === props.profile?.id &&
      threadUpdateMessageNewUser.userThread.some(
        (user) => user.applicationUserId === userState.user.id && !user.isExit
      )
    ) {
      getUserListForThread();
      if (threadUpdateMessageNewUser.applicationUserId === userState.user.id) {
        getChatHistoryData();
      } else {
        if (
          threadUpdateMessageNewUser.userThread.some(
            (user) => user.applicationUserId === userState.user.id
          )
        ) {
          var tempChatHistoryData = chatHistoryData?.filter(
            (message) =>
              !(
                message.isGroupActivity &&
                message.text.toLowerCase() === "you left this chat"
              )
          );
          var tempShowChatData = showChatData?.filter(
            (message) =>
              !(
                message.isGroupActivity &&
                message.text.toLowerCase() === "you left this chat"
              )
          );
        }
        threadUpdateMessageNewUser.userThread.forEach((user) => {
          tempChatHistoryData = tempChatHistoryData?.filter(
            (message) =>
              !(
                message.isGroupActivity &&
                message.text.toLowerCase() ===
                  ((
                    user.userFirstName +
                    " " +
                    user.userLastName
                  ).toLowerCase() + " was added" ||
                    message.text.toLowerCase() ===
                      (
                        user.userFirstName +
                        " " +
                        user.userLastName
                      ).toLowerCase() +
                        "left this chat")
              )
          );
          tempShowChatData = tempShowChatData?.filter(
            (message) =>
              !(
                message.isGroupActivity &&
                ((user.userFirstName + " " + user.userLastName).toLowerCase() +
                  " was added" ||
                  message.text.toLowerCase() ===
                    (
                      user.userFirstName +
                      " " +
                      user.userLastName
                    ).toLowerCase() +
                      "left this chat")
              )
          );

          tempChatHistoryData.push({
            isGroupActivity: true,
            groupActivity: "userAdded",
            text: user.userFirstName + " " + user.userLastName + " WAS ADDED",
            postedDate: new Date().toISOString(),
          });
          tempShowChatData.push({
            isGroupActivity: true,
            groupActivity: "userAdded",
            text: user.userFirstName + " " + user.userLastName + " WAS ADDED",
            postedDate: new Date().toISOString(),
          });
        });
        setChatHistoryData(tempChatHistoryData);
        setShowChatData(tempShowChatData);
        if (
          threadUpdateMessageNewUser.userThread.some(
            (user) => user.applicationUserId === userState.user.id
          )
        ) {
          setLeftChat(false);
          props.profile.isExitFromThread = false;
        }
      }
    }
  }, [threadUpdateMessageNewUser]);

  //live message update call set
  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("LeaveChat", (message) => {
        if (isMounted()) {
          setThreadUpdateMessageLeave(message);
        }
      });
      signalR.hubConnection.on("NewMemberAdded", (message) => {
        if (isMounted()) {
          setThreadUpdateMessageNewUser(message);
        }
      });
    }
  });

  //get chat history data
  const getChatHistoryData = () => {
    let uuid = props.profile.primaryUserId;
    setThreadId(props.profile.id);
    getChatHistory(uuid, props.profile.id)
      .then(async (res) => {
        let data = await res.data.$values;

        if (isMounted()) {
          setChatHistoryData(data);
          setShowChatData(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //get blocked users in thread
  const getBlockedUsers = () => {
    if (props.profile.userThread?.$values?.length < 3) {
      return;
    }
    let uuid = props.profile.primaryUserId;
    getBlockedUsersInThread(uuid, props.profile.id)
      .then(async (res) => {
        let data = await res.data.$values;
        if (isMounted() && data?.length) {
          toast({
            type: "warning",
            text: "The thread includes one or more blocked users.The responses from them will not be blocked in the group thread",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //set message as read API
  const messageReadUpdate = () => {
    let reqData = {
      currentDate: new Date().toISOString(),
      applicationUserId: userState.user.id,
      messageThreadId: props.profile.userThread.$values[0].messageThreadId,
    };
    updateMessageAsRead(reqData)
      .then(async (res) => {
        props.setInformationTray();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //thread create or send message to a thread
  const createThreadHandler = async (message) => {
    const chatMessage = {
      messageThreadId: null,
      messageTypeId: 1,
      text: message,
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
      threadUsers: [],
    };

    if (props.profile.userThread) {
      chatMessage.messageThreadId = props.profile.id;

      await sendMessageHandler(props.profile.id, chatMessage);
    } else if (props.profile) {
      if (threadDetails) {
        let reqData = {
          id: props.profile.id,
          threadName: threadDetails.threadName,
          description: "",
          isActive: true,
          openDate: new Date().toISOString(),
          closeDate: null,
          currentDate: new Date().toISOString(),
          isThreadNameChanged: threadDetails.isThreadNameChanged,
          groupActivity: "string",
          applicationUserId: userState.user.id,
          userThread: [],
        };
        props.profile.forEach((element) => {
          console.log(element.secondaryUserLastName);
          let userThreadToAdd = {
            applicationUserId: element.secondaryUserId,
            messageThreadId: props.profile.id,
            enrolledDate: new Date().toISOString(),
            hasHistoryEnabled: true,
            isBlock: false,
            blockedDate: null,
            isCleared: false,
            clearedDate: null,
            isDelete: false,
            deleteDate: null,
            isExit: false,
            exitDate: null,
            userFirstName: element.secondaryUserFirstName,
            userLastName: element.secondaryUserLastName,
            isValidateUser: true,
            isNewThread: true,
            currentDate: new Date().toISOString(),
            deviceId: "",
          };
          reqData.userThread.push(userThreadToAdd);
        });
        console.log(reqData);
        await addUserToMessageThread(reqData, chatMessage);
      } else {
        let reqData = {
          threadName: "",
          description: "",
          isActive: true,
          openDate: new Date().toISOString(),
          closeDate: null,
          currentDate: new Date().toISOString(),
          groupActivity: "string",
          applicationUserId: userState.user.id,
          userThread: [
            {
              applicationUserId: userState.user.id,
              enrolledDate: new Date().toISOString(),
              hasHistoryEnabled: true,
              isBlock: false,
              blockedDate: null,
              isCleared: false,
              clearedDate: null,
              isDelete: false,
              deleteDate: null,
              isExit: false,
              exitDate: null,
              userFirstName: userState.user.firstName,
              userLastName: userState.user.lastName,
              isValidateUser: true,
              isNewThread: true,
              currentDate: new Date().toISOString(),
              deviceId: "",
            },
          ],
        };
        let threadIdList = [];
        props.profile.forEach((element) => {
          let userThreadToAdd = {
            applicationUserId: element.secondaryUserId,
            enrolledDate: new Date().toISOString(),
            hasHistoryEnabled: true,
            isBlock: false,
            blockedDate: null,
            isCleared: false,
            clearedDate: null,
            isDelete: false,
            deleteDate: null,
            isExit: false,
            exitDate: null,
            userFirstName: element.secondaryUserFirstName,
            userLastName: element.secondaryUserLastName,
            isValidateUser: true,
            isNewThread: true,
            currentDate: new Date().toISOString(),
            deviceId: "",
          };
          reqData.userThread.push(userThreadToAdd);
          threadIdList.push(element.secondaryUserId);
        });

        createThreadRequest(reqData)
          .then(async (res) => {
            let threadIdNew = res.data.userThread.$values[0].messageThreadId;
            chatMessage.messageThreadId = threadIdNew;
            await signalR.hubConnection.send(
              "JoinGroupOnCreate",
              threadIdList,
              threadIdNew
            );

            await sendMessageHandler(threadIdNew, chatMessage);
            if (isMounted()) {
              setThreadId(threadIdNew);
              let timeOutId = setTimeout(() => {
                props.showAllThreads(true, false);
                props.showChatInputHandler();
                props.chatHandler(res.data, false);
                console.log("control", res.data);
                props.showChatInputHandler(true);
                props.welcomeMessageLabelHandler("");
                props.setUpdateRequest(threadIdList);
              }, 500);
              timeOutIDs.current.push(timeOutId);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  //add user to a thread
  const addUserToMessageThread = (reqData, chatMessage) => {
    chatMessage.messageThreadId =
      threadDetails.userThread.$values[0].messageThreadId;
    addNewUsertoThread(chatMessage.messageThreadId, reqData)
      .then(async (res) => {
        let respUserThreads = [];
        reqData.userThread.forEach((element) => {
          let newUSerData = res.data.userThread.$values.find(
            (user) => user.applicationUserId === element.applicationUserId
          );
          if (newUSerData) {
            newUSerData.userFirstName = element.userFirstName;
            newUSerData.userLastName = element.userLastName;
            respUserThreads.push(newUSerData);
          }
        });
        reqData.userThread = respUserThreads;
        reqData.threadName = res.data.threadName;
        reqData.id = chatMessage.messageThreadId;

        await signalR.hubConnection.send(
          "AddNewUserToCurrentThread",
          chatMessage.messageThreadId,
          reqData
        );
        await sendMessageHandler(chatMessage.messageThreadId, chatMessage);
        if (isMounted()) {
          toast({ type: "success", text: "User added successfully" });
          let timeOutId = setTimeout(() => {
            props.showAllThreads(false, false);
            props.showChatInputHandler();
            props.chatHandler(res.data, false);
            props.showChatInputHandler(true);
            props.setUpdateRequest(reqData);
          }, 500);
          timeOutIDs.current.push(timeOutId);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  //send message
  const sendMessageHandler = async (id, message) => {
    sendMessageRequest(message)
      .then(async (res) => {
        let data = await res;

        if (isMounted()) {
          message.groupActivity = "live message";
          setChatHistoryData((preMessages) => [...preMessages, message]);
          setShowChatData((preShowMessages) => [...preShowMessages, message]);
          props.setUpdateRequest(message);
        }
        message["threadUsers"] = [];

        await res.data.userThread.$values.forEach((element) => {
          message.threadUsers.push({
            applicationUserId: element.applicationUserId,
            isExit: element.isExit,
            isBlock: element.isBlock,
          });
        });

        await signalR.hubConnection.send("SendMessageToGroup", id, message);

        console.log(usersInThread);
        if (
          usersInThread.some(
            (user) =>
              user.userEstablishmentName?.toLowerCase() === "learner" &&
              user.userPositionTitle?.toLowerCase() === "readyskill"
          )
        ) {
          let tags = [];
          usersInThread.forEach((user) => {
            if (
              user.userEstablishmentName?.toLowerCase() === "learner" &&
              user.userPositionTitle?.toLowerCase() === "readyskill"
            ) {
              tags.push("UserId:" + user.applicationUserId);
            }
          });
          let notificationReq = {
            text: message.text,
            action: "action_a",
            senderName:
              res.data.userThread.$values.length < 3
                ? message.sendUserFirstName + " " + message.sendUserLastName
                : props.profile.threadName,
            tags,
            // silent: true
          };
          notification(notificationReq);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const notification = (notificationReq) => {
    sendNotificationRequest(notificationReq)
      .then((res) => {})
      .catch((err) => {
        console.log(err.response);
      });
  };
  //get user list API
  const getUserListForThread = () => {
    let uuid = userState.user.id;
    getUsersForThread(uuid, props.profile.id)
      .then(async (res) => {
        let data = await res.data.$values;
        if (isMounted() && data) {
          if (data.length > 2 && data.some(user => !user.userIsActive || user.userIsSuspended)) {
            toast({
              type: "warning",
              text: "The thread includes one or more suspended or deleted users"
            });
          }
          setUsersInThread(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //search message
  const search = async (value) => {
    setSearchInput(value);
    const filtered = chatHistoryData.filter((chat) => {
      return chat.text.toLowerCase().includes(value.toLowerCase());
    });
    if (filtered) {
      setShowChatData(filtered);
    }
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

  //show selected message on search
  const pointSearchMessageHandler = (id) => {
    setShowChatData(chatHistoryData);
    setSearchInput(undefined);
    document.getElementById("search-message").value = "";
    let timeOutId = setTimeout(() => {
      var elem = document.getElementById(id);
      elem.scrollIntoView(true);
    }, 0);
    timeOutIDs.current.push(timeOutId);
  };

  //show message threads after add user
  const addUserToThreadHandler = () => {
    props.welcomeMessageLabelHandler(null);
    props.showAllThreads(true, props.profile);
  };

  //leave from thread
  const leaveGroupHandler = async () => {
    let thread = props.profile;
    let reqThread = thread.userThread.$values.find(
      (user) => user.applicationUserId === userState.user.id
    );

    if (reqThread.applicationUserId === userState.user.id) {
      let leaveMessage = {
        isGroupActivity: true,
        groupActivity: "Left",
        text: "You left this chat",
        messageThreadId: reqThread.messageThreadId,
        postedDate: new Date().toISOString(),
      };
      setChatHistoryData((preMessages) => [...preMessages, leaveMessage]);
      setShowChatData((preShowMessages) => [...preShowMessages, leaveMessage]);
    }

    let reqData = await {
      id: reqThread.id,
      messageThreadId: reqThread.messageThreadId,
      applicationUserId: userState.user.id,
      enrolledDate: null,
      hasHistoryEnabled: true,
      isBlock: false,
      blockedDate: null,
      isCleared: false,
      clearedDate: null,
      isDelete: reqThread.isDelete,
      deleteDate: reqThread.deleteDate,
      isExit: true,
      exitDate: new Date().toISOString(),
      userFirstName: userState.user.firstName,
      userLastName: userState.user.lastName,
      isValidateUser: true,
      isNewThread: false,
      currentDate: new Date().toISOString(),
      deviceId: "",
      changeTrackingInfo: null,
      isReadySkillRepresentative: false,
      userEstablishmentName: "",
      userFullName: "",
      userPositionTitle: "",
    };

    updateUserThread(reqThread.id, reqData)
      .then(async (res) => {
        let hubReqData = {
          id: thread.id,
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
          threadName: res.data.threadName,
          deviceId: thread.deviceId,
          userThread: res.data.userThread.$values,
          threadUsers: [],
          signalRActionUserId: userState.user.id,
        };
        await res.data.userThread.$values.forEach((element) => {
          hubReqData.threadUsers.push({
            applicationUserId: element.applicationUserId,
            isExit: element.isExit,
            isBlock: element.isBlock,
          });
        });
        if (signalR.hubConnection?._connectionStarted) {
        }

        await signalR.hubConnection.send(
          "UpdateSettings",
          "Leave Chat",
          reqThread.messageThreadId,
          hubReqData
        );

        if (isMounted()) {
          setLeftChat(true);
          props.setUpdateRequest(hubReqData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <div className="col-xl-5 col-lg-5 col-md-5">
        <div className="card shadow mb-4 msg-card main-msg-panel">
          <div className="card-header">
            <div className="d-flex">
              <div className="text3 pb-2 w-75 custom-tooltip">
                <span className="tooltiptext">{props.messageLabel}</span>
                Message{" "}
                {props.profile?.userThread?.$values?.length < 3
                  ? props.profile?.secondaryUserFirstName
                  : props.messageLabel && props.messageLabel.length > 30
                  ? props.messageLabel.slice(0, 30) + "..."
                  : props.messageLabel}
              </div>
              {props.showChatInput &&
                (props.profile?.userThread?.$values?.length > 2 ||
                  props.addUserToThreadDetails) &&
                !props.profile.isExitFromThread &&
                !leftChat && (
                  <div className="d-flex ml-auto">
                    {userState.messageThreadLeave && (
                      <a
                        className="subText rename-group text-capitalize mb-2 float-right text-nowrap mt-2"
                        data-toggle="modal"
                        data-target="#delete-modal"
                      >
                        Leave group
                      </a>
                    )}
                   {userState.messageThreadAddUser && <span
                      className="material-icons badge-icons mr-0 add-learner-top mt-1 ml-3"
                      onClick={
                        !props.addUserToThreadDetails
                          ? addUserToThreadHandler
                          : null
                      }
                    >
                      add
                    </span>}
                  </div>
                )}
            </div>
            {/* modal starts */}
            <div
              className="modal fade"
              id="delete-modal"
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
                      Are you sure?
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body text-white">
                    You won't get updates or be able to send messages to this
                    group later. Are you sure you want to leave this group?
                  </div>
                  <div className="modal-footer">
                    <a className="close-modal-btn" data-dismiss="modal">
                      Cancel
                    </a>
                    <button
                      type="button"
                      onClick={leaveGroupHandler}
                      className="btn btn-danger"
                      data-dismiss="modal"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* modal ends */}
            {props.showChatInput && !props.newRelation && (
              <div className="msg-search w-50">
                <input
                  id="search-message"
                  className="msg-searchbox"
                  type="search"
                  // value={searchInput}
                  autoComplete="off"
                  name="search"
                  placeholder="Search messages.."
                  onChange={(e) => {
                    onOptimisedHandleChange(e.target.value);
                  }}
                />
              </div>
            )}
          </div>
          {!props.showChatInput && (
            <div className="card-body chat-body p-0 no-msg-body">
              <p className="smallText text-uppercase mt-50">
                please select a conversation
              </p>
            </div>
          )}

          <div className="card-body chat-body p-0 msg-card-body">
            <div className="page-content page-container" id="page-content">
              <div className="row container p-0 m-0">
                <div className="col p-0">
                  {props.showChatInput && !props.newRelation && (
                    <MessageCenterChatWindow
                      chat={showChatData}
                      searchKeyWord={searchInput}
                      pointSearchMessageHandler={pointSearchMessageHandler}
                      newRelation={props.newRelation}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        
          <div className="">
            {userState.messageSendMessage &&
              props.showChatInput &&
              !props.profile?.isExitFromThread &&
              !leftChat && (
                <MessageCenterChatInput
                  sendMessage={createThreadHandler}
                  newChatLabel={
                    props.newRelation || props.addUserToThreadDetails
                      ? props.welcomeMessage
                      : null
                  }
                  searchKeyword={searchInput}
                  sameChat={props.profile}
                  isBlocked={
                    props.newRelation
                      ? false
                      : props.profile?.userThread?.$values?.find(
                          (user) =>
                            user.isBlock &&
                            user.applicationUserId === userState.user.id
                        )
                      ? true
                      
                      : contactDeleted
                      ? true
                      : props.profile?.userThread?.$values.length === 2 &&
                        (!props.profile.secondaryUserIsActive ||
                          props.profile.secondaryUserIsSuspended)
                      ? true
                      : false
                  }
                />
              )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});
export default React.memo(MessageCenterControl);
