import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import { getMessageThreadDetails } from "../../../../../services/adminServices";

import { UserAuthState } from "../../../../../context/user/userContext";


import DataTableCustomPagination from "../../../../../sharedComponents/dataTableCustomPagination/dataTableCustomPagination";
import { dateTimeFormatter } from "../../../../../utils/contants";

import ConfirmationModal from "../../../../../sharedComponents/confirmationModal/confirmationModal";

function SocialServiceGrid({
  externalServiceProviders,
  socialList,
  resources,
  readySkillServiceProviders,
  caseWorker,
  ActionFlag,
}) {

  const userState = UserAuthState();
  const navigate = useNavigate();

  const [messageModalShow, setMessageModalShow] = useState(false);


  const selectAction = (flag, data) => {
    ActionFlag(flag, data);
  };

  // data table custom style for header
  const customStyles = {
    headCells: {
      style: {
        color: "#9391b6",
        fontSize: "13px",
        textTransform: "uppercase",
        fontWeight: "700",
      },
    },
  };

  createTheme(
    "solarized",
    {
      text: {
        primary: "#9391b6",
        secondary: "#9391b6",
      },
      background: {
        default: "#181633",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#2f2c52",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  const getServiceProvider = (data) => {
    if (externalServiceProviders || readySkillServiceProviders) {
      if (externalServiceProviders.find((obj) => obj.id === data.serviceProviderId)) {
        return `${externalServiceProviders.filter((obj) => obj.id === data.serviceProviderId)[0]
          .partnerServiceName
          }`;
      } else if (readySkillServiceProviders.find(obj => obj.id === data.serviceProviderId)) {
        return `${readySkillServiceProviders.filter((obj) => obj.id === data.serviceProviderId)[0]
          .partnerServiceName
          }`;
      } else {
        return "N/A"
      }
    } else {
      return "N/A";
    }
  };

  const getServicePartnerType = (data) => {

    if (externalServiceProviders || resources) {

      if (externalServiceProviders.find((obj) => obj.id === data.serviceProviderId)) {
        let resource = externalServiceProviders.map(obj => {
          if (obj.resourceType.$values.find(item => item.id === data.serviceId)) {
            return `${obj.resourceType.$values.find(item => item.id === data.serviceId).serviceName}`
          } else {
            return ""
          }
        })
        return resource;
      } else if (resources.find(obj => obj.id === data.serviceId)) {
        return `${resources.filter((obj) => obj.id === data.serviceId)[0]
          .serviceName
          }`;
      } else {
        return "N/A"
      }
    } else {
      return "N/A";
    }
  };

  const getCaseWorker = (data) => {
    if (caseWorker) {
      if (caseWorker.find((obj) => obj.id === data.caseWorker)) {
        return `${caseWorker.find((obj) => obj.id === data.caseWorker).firstName
          } ${caseWorker.find((d) => d.id === data.caseWorker).lastName}`;
      } else {
        return "N/A";
      }
    } else {
      return "N/A";
    }
  };

  const [caseWorkerData, setCaseWorkerData] = useState()
  const toMessageCenter = (row) => {
    setMessageModalShow(true);
    setCaseWorkerData(row)
  }

  const getCoworkerMessage = () => {
    getMessageThreadDetails(userState.user.id, caseWorkerData.caseWorker)
      .then((res) => {
        if (res.data) {
          let thread = res.data;
          navigate(`/portal/messagecenter`, { state: { thread } });
        } else {
          navigate(`/portal/messagecenter`);
        }
      })
      .catch((err) => console.log(err));
  };

  //columns defenitions
  const columns = [
    {
      name: "Service Provider",
      cell: (row) => (
        <span className="d-flex">
          <div>
            <span className="material-icons text-white mt-1 mr-3">
              handshake
            </span>
          </div>
          <div>
            <span>{getServiceProvider(row)}</span>
            <br />
            <span>{getServicePartnerType(row)}</span>
          </div>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status ? row.status : "N/A",
      sortable: true,
    },
    {
      name: "Started",
      selector: (row) =>
        dateTimeFormatter(row.startDate).toLocaleString("en-US", {
          month: "2-digit", // numeric, 2-digit, long, short, narrow
          day: "2-digit", // numeric, 2-digit
          year: "numeric", // numeric, 2-digit
        }),
      sortable: true,
    },
    {
      name: "Completed",
      selector: (row) =>
        dateTimeFormatter(row.completionDate).valueOf() === dateTimeFormatter("0001-01-01T00:00:00").valueOf()
          ? "N/A"
          : dateTimeFormatter(row.completionDate).toLocaleString("en-US", {
            month: "2-digit", // numeric, 2-digit, long, short, narrow
            day: "2-digit", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
          }),
      sortable: true,
    },
    {
      name: "Case Worker",
      selector: (row) => getCaseWorker(row),
      cell: (row) => getCaseWorker(row) && (
        <span>
          <span>{getCaseWorker(row)}</span>
          {
            userState.messageThreadReadOnly && getCaseWorker(row) !== "N/A"
              ? <span
                className="material-icons add-convo-icon ml-2 pointer"
                onClick={() => {
                  toMessageCenter(row);
                }}
              >
                sms
              </span> : ''
          }
        </span>
      ),


      sortable: true,
    },
    {
      button: true,
      cell: (row) => (
        <span className="list-btns d-flex">
          <i
            className="fa-regular fa-pen-to-square curosr-pointer mr-2 edit-icon custom-tooltip "
            onClick={() => {
              selectAction("Edit", row);
            }}
          >
            <span className='tooltiptext'>Block</span>
          </i>
          <span
            className="material-icons curosr-pointer copy-icon-secondary mx-2 custom-tooltip "
            onClick={() => {
              selectAction("Copy", row);
            }}
          >
            <span className='tooltiptext'>Copy</span>
            content_copy
          </span>
          <i
            className="fa-regular fa-trash-can curosr-pointer delete-btn mx-2 custom-tooltip "
            onClick={() => {
              selectAction("DELETE", row);
            }}
          >
            <span className='tooltiptext'>Delete</span>
          </i>

        </span>
      ),
    },
  ];

  //disabled rows per page dropdown in pagination
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  // console.log(socialList);

  return (
    <div>
      <ConfirmationModal
        show={messageModalShow}
        actionText={
          <>
            navigate?
            <br />
            <span>
              It looks like you have been editing something. If you leave before
              saving, your changes will be lost
            </span>
          </>
        }
        actionButton="OK"
        btnClassName="custom-btn-modal"
        onHide={() => setMessageModalShow(false)}
        onAction={getCoworkerMessage}
      />
      {/* <div className="col-12 mt-3 max-h-500 px-0">
            </div> */}

      <DataTable
        columns={columns}
        data={socialList}
        paginationTotalRows={socialList ? socialList.length : 0}
        paginationComponentOptions={paginationComponentOptions}
        pagination
        paginationComponent={DataTableCustomPagination}
        persistTableHead
        highlightOnHover
        theme="solarized"
        customStyles={customStyles}
        paginationPerPage={5}

      />
    </div>
  );
}

export default SocialServiceGrid;
