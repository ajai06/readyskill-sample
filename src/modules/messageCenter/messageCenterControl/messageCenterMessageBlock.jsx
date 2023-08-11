import React from "react";

//context
import { UserAuthState } from "../../../context/user/userContext";

const MessageCenterMessageBlock = React.memo((props) => {

  const userState = UserAuthState();

  //show selected message on searching
  const pointSearchMessageHandler = () => {
    props.pointSearchMessageHandler(props.messageData.id);
  };

  // date formatter
  const dateTimeFormatter = (data) => {
    if (data) {
      if(props.messageData.groupActivity === "live message") {
        return new Date(data);
      }
      return (new Date(new Date(data).getTime()-new Date(data).getTimezoneOffset()*60*1000))      
    }
  }
  return (
    <React.Fragment>
      {props.showDate && (
        <div className="media media-meta-day">
          {dateTimeFormatter(props.messageData.postedDate)?.toLocaleString("en-US", {
            month: "long", // numeric, 2-digit, long, short, narrow
            day: "numeric", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
          }) !==
          new Date().toLocaleString("en-US", {
            month: "long", // numeric, 2-digit, long, short, narrow
            day: "numeric", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
          })
            ? dateTimeFormatter(props.messageData.postedDate)?.toLocaleString("en-US", {
                month: "long", // numeric, 2-digit, long, short, narrow
                day: "numeric", // numeric, 2-digit
                year: "numeric", // numeric, 2-digit
              })
            : "Today"}
        </div>
      )}

      {props.messageData.messageSendUserId !== userState.user.id && !props.messageData.isGroupActivity && (
        <div id={props.messageData.id} className="media media-chat">
          <div
            className="media-body"
            onClick={
              props.searchKeyWord?.length > 0
                ? pointSearchMessageHandler
                : () => {}
            }
          >
            <div className="meta">
              <span className="mr-2 bold-5">
                {props.messageData.sendUserFirstName}
              </span>
              {`${dateTimeFormatter(props.messageData.postedDate)?.toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric", // numeric, 2-digit
                  minute: "numeric", // numeric, 2-digit
                }
              )} `}
            </div>
 
            <p>{props.messageData.text}</p>
          </div>
        </div>
      )}
      {props.messageData.messageSendUserId === userState.user.id && !props.messageData.isGroupActivity &&( 
        <div
          id={props.messageData.id}
          className="media media-chat media-chat-reverse"
        >
          <div
            className="media-body"
            onClick={
              props.searchKeyWord?.length > 0
                ? pointSearchMessageHandler
                : () => {}
            }
          >
            <div className="meta float-right">
              {`${dateTimeFormatter(props.messageData.postedDate)?.toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric", // numeric, 2-digit
                  minute: "numeric", // numeric, 2-digit
                }
              )} `}
              <span className="ml-2 bold-5">You</span>
            </div>

            <p>{props.messageData.text}</p>
          </div>
        </div>
      )}
      {props.messageData.isGroupActivity &&(
        <p className="smallText text-uppercase left-chat text-center">
          {props.messageData.text}
        </p>
      )}
      {/* Typing Design */}
      {/* <div className="media media-chat">
        <div className="media-body">
          <div className="meta">
            <span className="mr-2 bold-5">Winnie Bakersfield</span>
          </div>
          <p>...</p>
        </div>
      </div> */}

      <div className="ps-scrollbar-x-rail">
        <div className="ps-scrollbar-x" tabIndex="0"></div>
      </div>
      <div className="ps-scrollbar-y-rail">
        <div className="ps-scrollbar-y" tabIndex="0"></div>
      </div>
    </React.Fragment>
  );
});

export default React.memo(MessageCenterMessageBlock);
