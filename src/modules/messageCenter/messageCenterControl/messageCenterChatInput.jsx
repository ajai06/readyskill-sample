import React, { useEffect, useRef, useState } from "react";

import { Picker, emojiIndex } from "emoji-mart";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import InputEmoji from "react-input-emoji";
import { useToastDispatch } from "../../../context/toast/toastContext";
import { useSignalRDispatch } from "../../../context/signalR/signalR";
import { useIsMounted } from "../../../utils/useIsMounted";
import "../messageCenter.scss";

const MessageCenterChatInput = React.memo((props) => {
  const signalR = useSignalRDispatch();
  const toast = useToastDispatch();
  const emojiRef = useRef();
  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);
  // const [pickerOpen, togglePicker] = React.useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [emojiIndexPosition, setEmojiIndexPosition] = useState("");
  const [contactDeleted, setContactDeleted] = useState(false);
  const [contactDeletedLive, setContactDeletedLive] = useState(undefined);
  const messageToSend = useRef("");
  const isMounted = useIsMounted();

  useEffect(() => {
    if (contactDeletedLive && contactDeletedLive === props.sameChat.id) {
      setContactDeleted(true);
      toast({
        type: "warning",
        text: "This user has been deleted from your contact list by the administrator.",
      });
    }
  }, [contactDeletedLive]);

  useEffect(() => {
    signalR.hubConnection?.on("DeleteContact", (message) => {
      if (isMounted()) {
        setContactDeletedLive(message);
      }
    });
  });

  const [notActiveInSystem, setNotActiveInSystem] = useState([]);
  const [activeInSystem, setActiveInSystem] = useState([]);

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
      notActiveInSystem.some((id) => id === props.sameChat?.secondaryUserId)
    ) {
      setContactDeleted(true);
      toast({
        type: "warning",
        text: "This User Account Is Suspended or Deleted. Unable to send message to the Suspended or Deleted Contact.",
      });
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
      activeInSystem.some((id) => id === props.sameChat?.secondaryUserId)
    ) {
      setContactDeleted(false);
    }
  }, [activeInSystem]);


  //welcome message
  useEffect(() => {
    if (props.newChatLabel) {
      setNewMessage("Welcome to ReadySkill, " + props.newChatLabel);
      messageToSend.current = "Welcome to ReadySkill, " + props.newChatLabel;
    }
  }, [props.newChatLabel]);

  //chat input reset on chat change
  useEffect(() => {
    if (props && !props.searchKeyword?.length) {
      if (!props.newChatLabel) {
        setNewMessage("");
        messageToSend.current = "";
        const input = document.getElementById("textbox");
        input.focus();
      }
    }
    return () => {
      setContactDeleted(false);
    };
  }, [props.sameChat]);

  //popup emoji close on emoji select
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        pickerOpen &&
        emojiRef.current &&
        !emojiRef.current.contains(e.target)
      ) {
        togglePicker();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    const input = document.getElementById("textbox");
    input.focus();

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [pickerOpen]);

  //send message on enter
  // useEffect(() => {
  //   const listener = (event) => {
  //     if (event.code === "Enter" || event.code === "NumpadEnter") {
  //       event.preventDefault();
  //       messageSendHandler();
  //     }
  //   };
  //   document.getElementById("textbox")?.addEventListener("keydown", listener);
  //   return () => {
  //     document
  //       .getElementById("textbox")
  //       ?.removeEventListener("keydown", listener);
  //   };
  // }, []);

  //message text update
  const addMessageHandler = (event) => {
    if (event.keyCode === 13) {
      return;
    }
    setNewMessage(event.target.value);
    messageToSend.current = event.target.value;
  };

  //message send function
  const messageSendHandler = () => {
    if (
      !props.isBlocked &&
      !contactDeleted &&
      messageToSend.current.trim() !== ""
    ) {
      props.sendMessage(messageToSend.current);
      setNewMessage("");
      messageToSend.current = "";
      setEmojiIndexPosition(0);
    }
  };

  //add emoji to textbox
  function addEmoji(emoji) {
    const input = document.getElementById("textbox");
    const text =
      newMessage.slice(0, emojiIndexPosition) +
      emoji.native +
      newMessage.slice(emojiIndexPosition);
    setNewMessage(text);
    messageToSend.current = text;
    togglePicker();
    input.focus();
  }
  const caretPositionChangeHandler = (position) => {
    setEmojiIndexPosition(position);
  };

  // auto resize textarea
  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute(
      "style",
      "height:" + tx[i].scrollHeight + "px;overflow-y:auto;"
    );
    tx[i].addEventListener("input", OnInput, false);
  }

  function OnInput() {
    if (messageToSend.current > 250) {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    } else {
      this.style.height = "50px";
    }
  }

  const enterMessageSendHandler = (e) => {
    e.preventDefault();
    messageSendHandler();
  };

  return (
    <React.Fragment>
      <div className="chat-box-main">
        {/* chat input */}
        <div className="publisher mx-1 border-chatbox">
          <div className="row">
            <div className="text-area-width">
              <ul className="chat-messages">
                {pickerOpen ? (
                  <div ref={emojiRef}>
                    <Picker
                      onSelect={addEmoji}
                      showPreview={false}
                      showSkinTones={false}
                    />
                  </div>
                ) : null}

                <footer className="chat-footer">
                  <ReactTextareaAutocomplete
                    id="textbox"
                    className="message-input my-textarea"
                    onChange={addMessageHandler}
                    value={newMessage}
                    movePopupAsYouType={true}
                    disabled={contactDeleted ? true : props.isBlocked ? true : false}
                    onCaretPositionChange={caretPositionChangeHandler}
                    loadingComponent={() => <span>Loading</span>}
                    placeholder="Type your message.."
                    onKeyPress={(e) =>
                      e.key === "Enter" && enterMessageSendHandler(e)
                    }
                    trigger={{
                      ":": {
                        dataProvider: (token) =>
                          emojiIndex
                            .search(token)
                            .slice(0, 8)
                            .map((o) => ({
                              colons: o.colons,
                              native: o.native,
                            })),
                        component: ({ entity: { native, colons } }) => (
                          <div>{`${colons} ${native}`}</div>
                        ),
                        output: (item) => `${item.native}`,
                      },
                    }}
                  />
                </footer>
              </ul>
            </div>
            <div className="msg-options-width">
              <div className="msg-options">
                <span
                  className="material-icons emoji-icon mr-3"
                  onClick={
                    props.isBlocked || contactDeleted ? undefined : togglePicker
                  }
                >
                  mood
                </span>
                {/* <span className="material-icons emoji-icon mr-3">attach_file</span> */}
                <span
                  className="publisher-btn text-info send-msg-icon"
                  data-abc="true"
                  onClick={() => messageSendHandler()}
                >
                  <span className="material-icons mr-0">send</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

export default React.memo(MessageCenterChatInput);
