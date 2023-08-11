import React from "react";

import ContactDetailsPanel from "./contactDetailsPanel";
import GroupDetailsPanel from "./groupDetailsPanel";

const MessageCenterDetailsPanel = React.memo((props) => {
  //thread name change after update
  const messageLabelHandler = (threadName) => {
    props.messageLabelHandler(threadName);
  };

  //thread name change after update
  const setUpdateRequest = (threadName) => {
    props.setUpdateRequest(threadName);
  };

  //user added paprent update
  const setUserAddedMessageHandler = (message) => {
    props.setUserAddedMessage(message);
  };

  return (
    <React.Fragment>
      <div className="col-xl-3 col-lg-3 col-md-3">
        <div className="card shadow mb-4 msg-card-right">
          {!props.showChatInput && (
            <div className="card-header">
              <div className="text3 pb-2">Details Panel</div>
            </div>
          )}
          {props.showChatInput &&
            props.profile?.userThread?.$values?.length < 3 && (
              <ContactDetailsPanel groupDetails={props.profile} />
            )}
          {props.showChatInput &&
            (props.profile?.userThread?.$values?.length > 2 ||
              props.addUserToThreadDetails) && (
              <GroupDetailsPanel
                groupDetails={props.profile}
                messageLabelHandler={messageLabelHandler}
                addUserToThreadDetails={props.addUserToThreadDetails}
                setUpdateRequest={setUpdateRequest}
                setUserAddedMessage={setUserAddedMessageHandler}
              />
            )}
          {!props.showChatInput && (
            <div className="smallText text-uppercase mt-50 text-center">
              PLEASE SELECT A CONVERSATION
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
});

export default React.memo(MessageCenterDetailsPanel);
