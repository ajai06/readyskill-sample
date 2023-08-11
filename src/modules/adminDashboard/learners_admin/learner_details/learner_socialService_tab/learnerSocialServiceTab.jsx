import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { clearAlert, OrganizationTypes, ResourcesList } from "../../../../../utils/contants";
import { UserAuthState } from "../../../../../context/user/userContext";
import {
  getAllOrgizationsTypesList,
  getSocialService,
  getAllCaseWorkers,
  addSocialService,
  updateSocialService,
  deleteSocialService
} from "../../../../../services/adminServices";
import SocialServiceGrid from "./socialServiceGrid";
import { useToastDispatch } from "../../../../../context/toast/toastContext";
import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";
import LearnerAddsocialservicemodal from "./learner_addsocialservicemodal";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import { getExternalPartnerServices } from "../../../../../services/locationService";


function LearnerSocialServiceTab({ refreshCount }) {

  const { id } = useParams();

  const userState = UserAuthState();
  const toast = useToastDispatch();

  const [externalServiceProviders, setExternalServiceProviders] = useState([]);
  const [readySkillServiceProviders, setReadySkillServiceProviders] = useState([]);
  const [socialList, setSocialList] = useState([]);
  const [caseWorkerList, setCaseWorkers] = useState([]);

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [flagData, setFlagAction] = useState("");
  const [editData, setEditData] = useState();
  const [copyData, setCopyData] = useState();
  const [deleteData, setDeleteData] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [addServiceModalShow, setAddserviceModalshow] = useState(false);
  const isMounted = useIsMounted();

  //timeout cleanup

  const timeOutIDs = useRef([]);

  useEffect(() => {
    return () => {
      let ids = timeOutIDs.current
      clearAlert(ids);
    };
  }, []);

  useEffect(() => {
    getReadySkillServiceProviders();
    getAllCaseWorkerList();
    getExternalServiceProviders();
  }, []);

  const getReadySkillServiceProviders = () => {

    getAllOrgizationsTypesList()
      .then((res) => {
        if (res.data) {
          if (isMounted()) {
            let response = res.data.filter(
              (obj) => obj.type === OrganizationTypes.SERVICEPARTNER
            )[0].organizationList;
            setReadySkillServiceProviders(response);
          }
        }
      })
      .catch((err) => console.log(err));

  };

  const getExternalServiceProviders = () => {

    getExternalPartnerServices()
      .then(res => {
        if (res.data.$values?.length > 0) {
          if (isMounted()) {
            let response = res.data.$values
            setExternalServiceProviders(response);
          }
        }
      })
      .catch(err => console.log(err))
  }

  const getAllCaseWorkerList = () => {
    getAllCaseWorkers().then((res) => {
      if (res.data) {
        if (isMounted()) {
          let response = res.data;
          setCaseWorkers(response);
        }
      }
    });
  };

  const getAllSocialService = () => {
    getSocialService(id, pageNumber, pageSize)
      .then((res) => {
        refreshCount();
        if (res.data) {
          if (isMounted()) {
            let response = res.data.socialServiceList.$values;
            setSocialList(response);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllSocialService();
  }, [currentPage]);

  const createFlag = (flag, data) => {
    setFlagAction(flag);
    if (flag === "Add") {
      setAddserviceModalshow(true);
    } else if (flag === "Edit") {
      setAddserviceModalshow(true);
      if (data) {
        setEditData(data);
      }
    } else if (flag === "Copy") {
      setCopyData(data);
      setAddserviceModalshow(true);
    } else if (flag === "DELETE") {
      setAddserviceModalshow(false);
      setModalShow(true);
      setDeleteData(data);
    }
  };


  const closeModal = () => {
    setAddserviceModalshow(false);
    setEditData();
    setCopyData();
  };

  const createNewSocialService = (data) => {
    if (data.completionDate === "") {
      data["completionDate"] = "0001-01-01"
    }
    data["applicationUserId"] = id;
    data["postUserId"] = userState.user.id;
    data["organizationId"] = data.serviceProviderId;
    // return;
    addSocialService(data)
      .then((res) => {
        // console.log(res)
        if (res.status === 200) {
          if (isMounted()) {
            closeModal();
            toast({ type: "success", text: "Service created successfully" });
            getAllSocialService();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const updateSocial = (data) => {
    if (data.completionDate === "") {
      data["completionDate"] = "0001-01-01"
    }
    updateSocialService(data)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            closeModal();
            toast({ type: "success", text: "Service updated successfully" });
            getAllSocialService();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const copySocial = (data) => {
    if (data.completionDate === "") {
      data["completionDate"] = "0001-01-01"
    }
    addSocialService(data)
      .then((res) => {
        if (res.status === 200) {
          if (isMounted()) {
            closeModal();
            toast({ type: "success", text: "Service created successfully" });
            getAllSocialService();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteService = () => {
    setModalShow(false);
    deleteSocialService(deleteData.id)
      .then((res) => {
        if (res.status === 204) {
          if (isMounted()) {
            toast({ type: "success", text: "Service deleted successfully" });
            setCurrentPage(1);
            setPageNumber(0);
            let timeOutId = setTimeout(() => {
              getAllSocialService();
            }, 200);
            timeOutIDs.current.push(timeOutId)
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {addServiceModalShow && readySkillServiceProviders && externalServiceProviders && ResourcesList &&
        <LearnerAddsocialservicemodal
          show={addServiceModalShow}
          copySocial={copySocial}
          updateSocial={updateSocial}
          createNewSocialService={createNewSocialService}
          externalServiceProviders={externalServiceProviders}
          readySkillServiceProviders={readySkillServiceProviders}
          resources={ResourcesList}
          onHide={closeModal}
          flagData={flagData}
          editData={editData}
          copyData={copyData}

        />
      }
      {modalShow &&
        <ConfirmationModal
          show={modalShow}
          actionText="delete this service"
          actionButton="Delete"
          btnClassName="btn-danger"
          onHide={() => setModalShow(false)}
          onAction={deleteService}
        />
      }
      <div className="card-header">
        <div className="d-flex">
          <p className="subHead-text-learner mb-3 text-uppercase mt-2">
            ENROLLED SERVICES
          </p>
          <a className="ml-auto text-decoration-none d-flex">
            <span className="material-icons plus-icon pt-1 mr-0" onClick={() => {
              createFlag("Add", {});
            }}>add</span>
            <p className="subText mt-1 ml-2 mb-0 mr-3">Add Service</p>
          </a>
        </div>
      </div>
      {externalServiceProviders && socialList && caseWorkerList && readySkillServiceProviders && ResourcesList && (
        <SocialServiceGrid
          externalServiceProviders={externalServiceProviders}
          readySkillServiceProviders={readySkillServiceProviders}
          resources={ResourcesList}
          socialList={socialList}
          caseWorker={caseWorkerList}
          ActionFlag={createFlag}
        />
      )}

    </div>
  );
}

export default LearnerSocialServiceTab;
