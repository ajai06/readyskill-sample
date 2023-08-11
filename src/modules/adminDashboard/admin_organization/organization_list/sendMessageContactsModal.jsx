import React, { useEffect } from "react";
import { Modal, Button, CloseButton } from "react-bootstrap";
import { useForm } from "react-hook-form";

import { useSignalRDispatch } from "../../../../context/signalR/signalR";
import { UserAuthState } from "../../../../context/user/userContext";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import "../../admindashboard.scss";

function SendMessageContactsModal({ onHide, contacts,clearSelections, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange'});

  //hubconnection starting if not
  useEffect(() => {
    if (!signalR.hubConnection) {
      signalR.startHubConnectionHandler(userState.user.id);
    }
  });

  const toast = useToastDispatch();

  const signalR = useSignalRDispatch();

  const userState = UserAuthState();
  const messageSubmit = async (data) => {
    const chatMessage = {
      // messageThreadId: null,
      messageTypeId: 1,
      text: data.message,
      authorIsReadySkillUser: true,
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
      deviceId: "",
      threadUsers: [],
    };
    contacts.forEach((element) => {
      if (!element.isSuspended && !element.administrativeUserIsSuspend) {
        chatMessage.threadUsers.push({
          applicationUserId: element.administrativeUserId,
        });
      }
    });
    await signalR.hubConnection.send("SendBulkMessage", chatMessage);
    toast({ type: "success", text: "Message sent successfully" });

    onHide();
    clearSelections()

  };

  return (
    <div>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="send-msg-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="subHead-text-learner text-uppercase">
            Send Message
          </Modal.Title>
          <CloseButton onClick={onHide} />
        </Modal.Header>
        <Modal.Body>
          <div>
            {contacts.find((contact) => contact.isSuspended || contact.administrativeUserIsSuspend) && (
              <span style={{ color: "red" }}>
                *Administrator with Inactive Organization in the selection list
                will not receive the message.
              </span>
            )}
            <label className="form-label subText" htmlFor="message">
              Message
            </label>
            <textarea
              {...register("message", { required: true })}
              className="form-control"
              name="message"
              id="message"
              cols="30"
              rows="4"
            />

            {errors.message ? (
              <span className="error-msg">Please enter your message</span>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a className="close-modal-btn" onClick={onHide}>
            Close
          </a>
          <Button
            className={"btn-primary save-btn-custom "}
            onClick={handleSubmit(messageSubmit)}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SendMessageContactsModal;
