import React, { useEffect, useRef, useState } from "react";
import MessageCenterMessageBlock from "./messageCenterMessageBlock";

const MessageCenterChatWindow = React.memo((props) => {
  const currentShowingDate = useRef(undefined);
  const showDate = useRef(true);
  const [chatData, setChatData] = useState();

  //scroll to bottom on chat load
  useEffect(() => {
    var objDiv = document.getElementById("chat-content");
    objDiv.scrollTop = objDiv.scrollHeight;

    return () => {
      currentShowingDate.current = undefined;
    };
  }, [props]);

  //chat message mapping
  useEffect(() => {
    if (props.chat.length > 0) {
      setChatData(
        props.chat.map((msg, index) => {
          if (
            dateTimeFormatter(msg.postedDate, msg)?.toLocaleDateString() !==
            new Date(currentShowingDate.current)?.toLocaleDateString()
          ) {
            currentShowingDate.current = msg.postedDate;
            showDate.current = true;
          } else if (currentShowingDate === undefined) {
            currentShowingDate.current = msg.postedDate;
            showDate.current = true;
          } else {
            showDate.current = false;
          }

          return (
            <MessageCenterMessageBlock
              key={index}
              messageData={msg}
              showDate={showDate.current}
              searchKeyWord={props.searchKeyWord}
              pointSearchMessageHandler={pointSearchMessageHandler}
            />
          );
        })
      );
    }
    return () => {
      setChatData([])
    }
  }, [props.chat]);


  //scroll to selected message on searched messages
  const pointSearchMessageHandler = (id) => {
    props.pointSearchMessageHandler(id);
  };

  //date time formatter
  const dateTimeFormatter = (data, msg) => {
    if (data) {
      if(msg.groupActivity === "live message") {
        return new Date(data);
      }
      return new Date(
        new Date(data).getTime() -
          new Date(data).getTimezoneOffset() * 60 * 1000
      );
    }
  };

  return (
    <div
      className="ps-container ps-theme-default ps-active-y"
      id="chat-content"
    >
      {props.chat.length === 0 &&
      props.searchKeyWord?.length > 0 &&
      !props.newRelation ? (
        <p className="no-srch-result">No search results found</p>
      ) : (
        
        chatData
      )}
    </div>
  );
});
export default React.memo(MessageCenterChatWindow);
