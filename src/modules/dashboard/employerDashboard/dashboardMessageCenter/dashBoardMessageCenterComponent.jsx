import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//services
import {
  getUnReadMessages,
  getUnReadMessageCount,
  updateMessageAsDelivered,
} from "../../../../services/dashboardServices";

//context

import { UserAuthState } from "../../../../context/user/userContext";
import { useSignalRDispatch } from "../../../../context/signalR/signalR";
import { useIsMounted } from "../../../../utils/useIsMounted";

import "../../dashboard.scss";
import logo from "../../../../assets/img/blank-profile-picture.png";

function DashboardMessageCenterComponent() {
  const userState = UserAuthState();
  const signalR = useSignalRDispatch();

  let uuid = userState.user.id;

  const [showMessageData, setShowMessageData] = useState([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [threadUpdateMessage, setThreadUpdateMessage] = useState(undefined);
  const isMounted = useIsMounted();


  // //hubconnection starting if not
  // useEffect(() => {
  //   if (!signalR.hubConnection) {
  //     signalR.startHubConnectionHandler(userState.user.id);
  //   }
  // });

  useEffect(() => {
    if (signalR.hubConnection?._connectionStarted) {
      signalR.hubConnection.on("ReceiveMessage", (message) => {
        if (isMounted()) {
          if (
            message.threadUsers.find(
              (user) => user.applicationUserId === userState.user.id
            ).isBlock
          ) {
            return;
          }
          setThreadUpdateMessage(message);
        }
      });
      signalR.hubConnection.on("ReceiveGroupCreated", async (message) => {
        if (isMounted() && message.isNewThread) {
          setThreadUpdateMessage(message);
        }
      });

      signalR.hubConnection.on("NewMemberAdded", (message) => {
        if (isMounted()) {
          setThreadUpdateMessage(message);
        }
      });
      signalR.hubConnection.on("UpdateThreadName", (message) => {
        if (isMounted()) {
          setThreadUpdateMessage(message);
        }
      });
    }
  });

  useEffect(() => {
    messageDeliveredUpdate();
  }, [threadUpdateMessage]);

  useEffect(() => {
    signalR.addUserToCache(userState.user.id);
  });

  useEffect(() => {
    getUnReadMsgs();
    unReadCounts();
  }, []);
  const getUnReadMsgs = () => {
    getUnReadMessages(uuid)
      .then((res) => {
        let data = res.data.$values;

        if (data) {
          let filteredData = data
            .filter((thread) => thread.unreadMessageCount > 0)
            .slice(0, 3);
          setShowMessageData(filteredData);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const navigate = useNavigate();

  const unReadCounts = () => {
    getUnReadMessageCount(uuid)
      .then((res) => {
        setUnreadMessageCount(res.data.count);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const threadIdNavigate = (thread) => {
    navigate(`/portal/messagecenter`, { state: { thread } });
  };

  //set message as delivered API
  const messageDeliveredUpdate = () => {
    let reqData = {
      currentDate: new Date().toISOString(),
      applicationUserId: userState.user.id,
    };
    updateMessageAsDelivered(reqData)
      .then(async (res) => {
        let data = await res;
        await getUnReadMsgs();
        await unReadCounts();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <React.Fragment>
      <div className={`${userState.alertsEnabled?'col-xl-3 col-lg-3 col-md-3' : 'col-xl-7 col-lg-7 col-md-7'}`}>
        <div className="card shadow mb-4 reviewCard">
          <div className="card-header">
            <div className="row">
              <div className="col-md-9">
                <div className="boldText">
                  {unreadMessageCount ? unreadMessageCount : 0}
                </div>
                <div className="subText">NEW MESSAGES</div>
              </div>
            </div>
          </div>
          {showMessageData &&
            showMessageData.map((msgData) => {
              let {
                threadCount,
                unreadMessageCount,
                threadName,
                secondaryUserFirstName,
                secondaryUserLastName,
                secondaryUserUploadedImageUrl,
              } = msgData;

              return (
                <div key={msgData["$id"]} className="container-fluid pl-1">
                  <div className="mt-4 d-flex">
                    <div className="profile-pic pl-0 ml-2">
                      <a
                        onClick={() => threadIdNavigate(msgData)}
                        className="link-decoration-none"
                      >
                        {threadCount > 2 && (
                          <div className="members-icon">
                            <div className="icon__value">{threadCount}</div>
                          </div>
                        )}

                        <img
                          src={
                            secondaryUserUploadedImageUrl
                              ? secondaryUserUploadedImageUrl + "?" + Date.now()
                              : logo
                          }
                          className="rounded-circle ml-2 object-cover"
                          alt="Profile"
                          width="40"
                          height="40"
                        />
                      </a>
                      <span className="badge">
                        {unreadMessageCount ? unreadMessageCount : 0}
                      </span>
                    </div>
                    <div className="w-auto mw-80 pl-0">
                      <a
                        onClick={() => threadIdNavigate(msgData)}
                        className="link-decoration-none"
                      >
                        <h5 className="text3 mt-2 new-msg-preview text-capitalize ml-3">
                          {threadCount > 2
                            ? threadName
                            : secondaryUserFirstName +
                              " " +
                              secondaryUserLastName}
                        </h5>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          <div className="ml-3 mt-4 viewLink">
            {showMessageData.length > 0 ? (
              <Link to="/portal/messagecenter" className="link-decoration-none">
                VIEW ALL
              </Link>
            ) : (
              <span className="text-white">No new messages</span>
            )}
            {/* <a href="">VIEW ALL</a> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default DashboardMessageCenterComponent;
