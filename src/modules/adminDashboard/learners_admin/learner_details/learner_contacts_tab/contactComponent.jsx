import React from "react";
import { useState } from "react";

import { UserAuthState } from "../../../../../context/user/userContext";

import { getMessageThreadDetails } from "../../../../../services/adminServices";

import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";
import { dateTimeFormatter, GuidFormat } from "../../../../../utils/contants";
import { useIsMounted } from "../../../../../utils/useIsMounted";

function ContactComponent({ contacts, deleteContact }) {

  const [selectedContactTodelete, setSelectedContactTodelete] =
    useState(undefined);
  const [deleteContactShow, setDeleteContactShow] = useState(false);
  const userState = UserAuthState();
  const isMounted = useIsMounted();

  // get thread id
  const getThread = () => {
    setDeleteContactShow(false);

    getMessageThreadDetails(
      selectedContactTodelete.primaryUserId,
      selectedContactTodelete.secondaryUserId
    )
      .then((res) => {
        let params = {
          applicationUserId: userState.user.id,
          primaryUserId: selectedContactTodelete.primaryUserId,
          secondaryUserId: selectedContactTodelete.secondaryUserId,
        };
        setSelectedContactTodelete(undefined);
        if (isMounted()) {
          if (res.data) {
            let threadId = res.data.id;
            params["messageThreadId"] = threadId;
          } else {
            //For fluent api validation backend- this field should not be empty,we are initializing empty GUID format
            params["messageThreadId"] = GuidFormat.EMPTYGUID;
          }
          deleteContact(params);
        }
      })
      .catch((err) => console.log(err));
  };
  const setDeleteContact = (item) => {
    setSelectedContactTodelete(item);
    setDeleteContactShow(item ? true : false);
  };

  return (
    <div className=" contact-list-section">
      <ConfirmationModal
        show={deleteContactShow}
        actionText={" delete this contact?"}
        actionButton="Delete"
        btnClassName="btn-danger"
        onHide={() => setDeleteContact(undefined)}
        onAction={() => getThread()}
      />
      {Object.entries(contacts)?.map(([key, value], i) => {
        return (
          <div key={i} className="pr-5 contact-list-main" style={{ color: "white" }}>
            <span className="contact-head mb-3 mt-3 w-100">{value.alphabet}</span>
            <ul className="mb-2 mr-2 pl-0 w-100">
              {value.record.map((item, j) => (
                <div className="w-100  custom-tooltip" key={j}>
                  <li

                    // title={
                    //   item?.lastMessageDate
                    //     ? `Last Message ${dateTimeFormatter(item.lastMessageDate).toLocaleString("en-US", {
                    //       hour12: true, hour: "2-digit", minute: "2-digit",
                    //     })} ${dateTimeFormatter(item.lastMessageDate).toLocaleString("en-US", {
                    //       month: "2-digit",
                    //       day: "2-digit",
                    //       year: "2-digit"

                    //     })}`
                    //     : ""
                    // }
                    className="mb-2 list-unstyled "
                  >
                    <div className="d-flex contact-item w-100">
                      <span className="material-icons contact-user-icon mr-2">
                        account_circle
                      </span>
                      <span>
                        {item.secondaryUserFirstName} {item.secondaryUserLastName}
                      </span>

                      {item.secondaryUserId !== userState.user.id && <span
                        className="material-icons mr-0 pt-1 delete-btn ml-auto"
                        onClick={() => setDeleteContact(value.record[j])}
                      >
                        close
                      </span>}


                    </div>

                  </li>
                  {item?.lastMessageDate
                    && <span className="tooltiptext-1">

                      Last Message {dateTimeFormatter(item.lastMessageDate).toLocaleString("en-US", {
                        hour12: true, hour: "2-digit", minute: "2-digit",
                      })} {dateTimeFormatter(item.lastMessageDate).toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric"

                      })}

                    </span>}
                </div>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default ContactComponent;
