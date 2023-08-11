import React, { useEffect, useRef, useState } from "react";


//components
import InformationTrayComponent from "../../sharedComponents/informationTray/informationTrayComponent";
import MessageCenterConversations from "./messageCenterConversations/messageCenterConversations";
import MessageCenterControl from "./messageCenterControl/messageCenterControl";
import MessageCenterDetailsPanel from "./messageCenterDetailsPanel/messageCenterDetailsPanel";

//context
import { UserAuthState } from "../../context/user/userContext";
import { useSignalRDispatch } from "../../context/signalR/signalR";

//services
import {
  sendMessageCenterTrayInformation,
  sendMessageCenterTrayInformationCount,
} from "../../services/messageCenterServices";

import { useIsMounted } from "../../utils/useIsMounted";
import { clearAlert } from "../../utils/contants";

import "./messageCenter.scss";

function MessageCenterComponent(props) {
  const userState = UserAuthState();
  const signalR = useSignalRDispatch();

  const [selectedChat, setSelectedChat] = useState();
  const [messageLabel, setMessageLabel] = useState("Panel");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showThreads, setShowThreads] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [newReationWindow, setNewRelationWindow] = useState(false);
  const [informationTrayList, setInformationTray] = useState([]);
  const [hubConnection, setHubConnection] = useState(null);
  const [hubLiveMessage, setHubLiveMessage] = useState(null);
  const [updateRequest, setUpdateRequest] = useState([]);
  const [addUserToThreadDetails, setaddUserToThreadDetails] =
    useState(undefined);
  const [userAddedMessage, setUserAddedMessage] = useState(undefined);
  const isMounted = useIsMounted();

  // //hubconnection starting if not
  // useEffect(() => {
  //   if (!signalR.hubConnection) {
  //     signalR.startHubConnectionHandler(userState.user.id);
  //   }
  // });

  //live message
  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("ReceiveMessage", (message) => {
        if (isMounted() && message.messageSendUserId !== userState.user.id) {
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
          setHubLiveMessage(message);
        }
        setUpdateRequest(undefined);
      });
      signalR.hubConnection.on("ReceiveGroupCreated", async (message) => {
        if (isMounted() && message.isNewThread) {
          signalR.getThreadIdAll(userState.user.id, signalR.hubConnection);
        }
      });
    }
  });

  //get tray info
  useEffect(() => {
    // getTrayInformation();
  }, []);

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current;
      clearAlert(ids);
    };
  }, []);

  //selected chat show handling
  const chatHandler = (profile, newRelation) => {
    if (!addUserToThreadDetails) {
      setShowThreads(false);
    }
    setNewRelationWindow(newRelation);

    setSelectedChat(profile);
  };

  //show conversation thread or relationships on logic
  const showAllThreads = (mode) => {
    setShowThreads(mode);
    setaddUserToThreadDetails(undefined);
  };

  //show conversation thread or relationships on logic after add user from panel
  const showAllThreadsAddUser = (threadId, flag) => {
    setShowThreads(threadId ? true : false);
    setaddUserToThreadDetails(flag);
  };

  //chat input and selected chat details show logic
  const showChatInputHandler = (mode) => {
    setShowChatInput(mode);
  };

  //message label for selected chat
  const messageLabelHandler = (label) => {
    setMessageLabel(label);
  };

  //welcome message label for selected chat
  const welcomeMessageLabelHandler = (label) => {
    setWelcomeMessage(label);
  };

  //tray info
  const getTrayInformation = async () => {
    try {
      let response = await sendMessageCenterTrayInformation();
      let responseData = await response.data.$values;
      const newArr = await Promise.all(
        responseData.map(async (item) => {
          if (item.apiEndPoint) {
            try {
              let res = await sendMessageCenterTrayInformationCount(
                item.apiEndPoint,
                userState.user.id
              );
              item.count = res.data.count;
              return item;
            } catch (error) {
              console.log(error);
            }
          } else {
            item.count = 0;
            return item;
          }
        })
      );
      setInformationTray(newArr);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      {/* Message center statitics */}
      {informationTrayList && (
        <InformationTrayComponent trayInformation={informationTrayList} />
      )}

      {userState.messageThreadReadOnly && (
        <>
          <div className="container-fluid">
            <p className="text3 mb-2 ml-1 mt-3">Chat</p>
          </div>
          <div className="msg-center-container">
            {/* Conversation List */}
            <MessageCenterConversations
              chatHandler={chatHandler}
              showChatInput={showChatInputHandler}
              showAllThreads={showAllThreads}
              showThreads={showThreads}
              messageLabelHandler={messageLabelHandler}
              welcomeMessageLabelHandler={welcomeMessageLabelHandler}
              profile={selectedChat}
              hubConnection={hubConnection}
              addUserToThreadDetails={addUserToThreadDetails}
              setUpdateRequest={setUpdateRequest}
              setInformationTray={getTrayInformation}
            />

            {/* Message center control */}
            <MessageCenterControl
              profile={selectedChat}
              chatHandler={chatHandler}
              showAllThreads={showAllThreadsAddUser}
              showChatInputHandler={showChatInputHandler}
              welcomeMessageLabelHandler={welcomeMessageLabelHandler}
              showChatInput={showChatInput}
              messageLabel={messageLabel}
              welcomeMessage={welcomeMessage}
              newRelation={newReationWindow}
              hubConnection={hubConnection}
              hubLiveMessage={hubLiveMessage}
              addUserToThreadDetails={addUserToThreadDetails}
              setUpdateRequest={setUpdateRequest}
              userAddedMessage={userAddedMessage}
              setInformationTray={getTrayInformation}
            />

            {/* Details panel */}

            <MessageCenterDetailsPanel
              profile={selectedChat}
              messageLabelHandler={messageLabelHandler}
              showChatInput={showChatInput}
              addUserToThreadDetails={addUserToThreadDetails}
              hubConnection={hubConnection}
              setUpdateRequest={setUpdateRequest}
              setUserAddedMessage={setUserAddedMessage}
            />
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default MessageCenterComponent;
