import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

//services
import {
  getAllContacts,
  searchContacts,
  getAllLearners,
  addNewContact,
  getAllUsersForcontactCheck,
  removeContact,
} from "../../../../../services/adminServices";

import { AppConfig } from "../../../../../services/config";

import ContactComponent from "./contactComponent";
import Learnersaddcontactmodal from "./learnersAddContactModal";
import { UserAuthState } from "../../../../../context/user/userContext";

// context
import { useToastDispatch } from "../../../../../context/toast/toastContext";
import { useSignalRDispatch } from "../../../../../context/signalR/signalR";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { getAllUsersForCandidateName } from "../../../../../services/dashboardServices";
import { OrganizationTypes, ReadySkillRepresentative } from "../../../../../utils/contants";

function LearnerContactsTab() {
  const { register, reset, setValue } = useForm();
  const { id } = useParams();
  const [arrangedContact, setArrangedcontact] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [contactCompareList, setContactCompare] = useState([]);
  const [learnersList, setLearners] = useState([]);
  const toast = useToastDispatch();
  const signalR = useSignalRDispatch();
  const [contactData, selectedContact] = useState({});
  const [addcontactModalShow, setAddcontactModalShow] = useState(false);
  const userState = UserAuthState();
  const isMounted = useIsMounted();

  //hubconnection starting if not
  useEffect(() => {
    if (!signalR.hubConnection) {
      signalR.startHubConnectionHandler(userState.user.id);
    }
  });

  useEffect(() => {
    getAllContactList();
  }, []);

  useEffect(() => {
    if (searchInput.length > 0) {
      searchContact();
    } else {
      getAllContactList();
    }
  }, [searchInput]);

  const searchContact = () => {
    searchContacts(id, searchInput)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data.$values;
            arrangeContacts(responseData);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllContactList = () => {
    getAllContacts(id)
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let responseData = res.data.$values;
            arrangeContacts(responseData);
            setContactCompare(responseData);
            getAllLearnersList(responseData);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllLearnersList = (responseData) => {
    getAllUsersForCandidateName()
      .then(res => {
        if (res.data) {
          let response = res.data.filter((obj) => obj.id !== id &&
            obj.isActive &&
            obj.id !== ReadySkillRepresentative.RepresentativeId)
          let contactIdList = responseData.map((obj) => obj.secondaryUserId);
          let data = response.filter((val) => {
            return !contactIdList.find((obj) => {
              return val.id === obj;
            });
          });
          let mobileOrganizations = data.filter(obj =>
            obj.organizationType === OrganizationTypes.MOBILE)

          let otherOrganizations = data.filter(obj =>
            obj.organizationType !== OrganizationTypes.MOBILE)
          getAllUsers(mobileOrganizations, otherOrganizations)
        }
      })
  };

  const getAllUsers = (mobileOrganizations, otherOrganizations) => {
    getAllUsersForcontactCheck().
      then((res) => {
        if (res.data) {
          let responseData = [];
          responseData = res.data.$values;
          let mobileUserList = mobileOrganizations.filter(item => {
            return responseData.some(obj =>
              obj.applicationUserId === item.id && obj.zipCode.length > 0)
          })

          let finalList = [...mobileUserList, ...otherOrganizations]
          setLearners(finalList);
        }
      });
  };

  let data;
  const arrangeContacts = (contacts) => {
    data = contacts.reduce((r, e) => {
      let alphabet = e.secondaryUserFirstName[0].toUpperCase();
      if (!r[alphabet]) r[alphabet] = { alphabet, record: [e] };
      else r[alphabet].record.push(e);
      return r;
    }, {});
    let result = Object.values(data);
    setFilters(result);
    setArrangedcontact(result);
  };

  const onSelectContact = (contactid) => {
    if (contactid) {
      let contactData = learnersList.find((obj) => obj.id === contactid);
      selectedContact(contactData);
    } else {
      selectedContact({});
    }
  };

  const clearSelectedContact = () => {
    reset();
    selectedContact({});
    setValue("contactId", "");
    setAddcontactModalShow(false);
  };

  const addNewContacts = () => {
    setAddcontactModalShow(false);
    if (contactData && contactData.id) {
      let reqData = {
        id: contactData.id,
        changeTrackingInfo: {
          created: {
            at: "2022-02-18T06:12:21.258Z",
            by: "string",
          },
          lastUpdated: {
            at: "2022-02-18T06:12:21.258Z",
            by: "string",
          },
        },
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        positionTitle: "ReadySkill",
        establishmentName: contactData.organizationType === OrganizationTypes.MOBILE ?
          "Learner" : contactData.organizationType,
      };
      addNewContact(id, userState.user.id, reqData)
        .then(async (res) => {
          if (res.status === 200) {
            if (isMounted()) {
              toast({ type: "success", text: "Contact added successfully" });
              await signalR.hubConnection.send("CreateContact", [
                id,
                contactData.id,
              ]);
              getAllContactList();
              clearSelectedContact();
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast({ type: "warning", text: "Please select contact" });
    }
  };

  // delete contact
  const deleteContact = (params) => {
    removeContact(params)
      .then(async (res) => {
        getAllContactList();

        toast({ type: "success", text: "Contact removed successfully" });
        await signalR.hubConnection.send(
          "RemoveGroupOnDelete",
          [params.primaryUserId, params.secondaryUserId],
          params.messageThreadId
        );

        if (res.data) {
        }
      })
      .catch((err) => console.log(err));
  };
  let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [filters, setFilters] = useState();

  function filterByAlphabets(item) {
    if (item === "All") {
      setFilters(arrangedContact);
    } else {
      var filtered = Object.entries(arrangedContact).map(([key, value]) => {
        console.log(key, value);
        if (value.alphabet.toLowerCase() === item.toLowerCase()) {
          return value;
        }
        // return value.alphabet.toLowerCase().charAt(0) === item.toLowerCase();
      });

      filtered = filtered.filter((obj) => obj !== undefined);
      setFilters(filtered);
    }
  }
  const checkItem = (item) => {
    if (Object.entries(arrangedContact)) {
      var filtered = Object.entries(arrangedContact).some(([key, value]) => {
        return value.alphabet?.toLowerCase() === item.toLowerCase();
      });
      return filtered;
    }
  };

  let disbaledClass = {
    pointerEvents: "none",
    opacity: 0.5,
  };
  return (
    <React.Fragment>
      <div>
        <Learnersaddcontactmodal
          show={addcontactModalShow}
          onSelectContact={onSelectContact}
          learnersList={learnersList}
          onHide={clearSelectedContact}
          onAction={addNewContacts}
        />
        <div className="col-12">
          <div className="d-flex mt-4">
            <div className="learner-contact-search">
              <input
                className="filter-searchbox py-2"
                onChange={(e) => setSearchInput(e.target.value)}
                autoComplete="off"
                value={searchInput}
                id="search-input"
                type="search"
                name="search"
                placeholder="Search by name"
              />
            </div>
            <a className="ml-auto text-decoration-none d-flex">
              <span className="material-icons plus-icon pt-1 mr-0" onClick={() => setAddcontactModalShow(true)}>add</span>
              <p className="subText mt-1 ml-2 mb-0 mr-3">Add Contact</p>
            </a>
          </div>
        </div>
        <div className="col-12 mt-4">
          {arrangedContact.length > 0 ? (
            <ContactComponent
              contacts={filters}
              deleteContact={deleteContact}
            />
          ) : (
            <p className="inner-sub mt-1 ml-0 mb-4 text-center">No contacts found</p>
          )}
        </div>
      </div>
      {arrangedContact.length > 0 && <div className="contact-sorting">
        <span className="mx-1 sorting-alphabets" onClick={() => filterByAlphabets("All")}>
          All
        </span>
        {alphabets.map((letter, index) => (
          <span
            style={!checkItem(letter) ? disbaledClass : {}}
            key={index}
            className="mx-1 sorting-alphabets"
            onClick={() => filterByAlphabets(letter)}
          >
            {letter}
          </span>
        ))}
      </div>}
    </React.Fragment>
  );
}

export default LearnerContactsTab;
