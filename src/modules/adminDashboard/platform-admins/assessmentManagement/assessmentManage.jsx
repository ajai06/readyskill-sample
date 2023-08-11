import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import DataTable, { createTheme } from "react-data-table-component";
import { NavLink } from "react-router-dom";
import {
  getAssessmentList,
  publishAssesmentStatus,
  createAssessment,
  publishSingleAssessment,
} from "../../../../services/adminServices";
import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";
import CreateAssessmentModal from "./create-assessment-modal";
import ConfirmationModal from "../../../../sharedComponents/confirmationModal/confirmationModal";
import "../platformAdmin.scss";
import { useToastDispatch } from "../../../../context/toast/toastContext";
import { UserAuthState } from "../../../../context/user/userContext";
import { useIsMounted } from "../../../../utils/useIsMounted";
import DataTableCustomPagination from "../../../../sharedComponents/dataTableCustomPagination/dataTableCustomPagination";
import DataTableCustomCheckbox from "../../../../sharedComponents/dataTableCustomCheckbox/dataTableCustomCheckbox";

function AssessmentManagement() {
  const [addAssesmentModalShow, setAddAssesmentModalShow] = useState(false);
  const [isMultipleChecked, setIsMultipleChecked] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [publishModalShow, setPublishModalShow] = useState(false);
  const [unpublishModalShow, setUnPublishModalShow] = useState(false);
  const [isPublishButton, setIsPublishButton] = useState(true);
  const [isUnPublishButton, setIsUnPublishButton] = useState(true);
  const [assessmentObject, setAssessmentObject] = useState({});
  const [copiedData, setCopyData] = useState({});
  const [copyModalShow, setCopyModal] = useState(false);
  const toast = useToastDispatch();
  const userState = UserAuthState();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted()) {
      asessmentManageList();
    }
  }, []);

  // get all Assessments
  const asessmentManageList = () => {
    getAssessmentList()
      .then((res) => {
        if (isMounted()) {
          if (res.data) {
            setAssessments(res.data.$values);
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.statusText) {
          console.log(err.response);
        }
      });
  };

  //Publish/Unpublish only if multiple checked
  const handleChange = ({ selectedRows }) => {
    selectedRows?.length > 1
      ? setIsMultipleChecked(true)
      : setIsMultipleChecked(false);
    if (selectedRows?.length > 1) {
      selectedRows.find((obj) => obj.isPublish)
        ? setIsUnPublishButton(true)
        : setIsUnPublishButton(false);
      selectedRows.find((obj) => !obj.isPublish)
        ? setIsPublishButton(true)
        : setIsPublishButton(false);
    }
    setSelectedAssessments(selectedRows);
  };

  //disabled rows per page dropdown in pagination
  const paginationComponentOptions = {
    noRowsPerPage: true,
  };

  //data table custom style for header
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

  //confirmation modal show logics
  const assessmentObjectHandler = (data, type) => {
    setAssessmentObject(data);
    if (type === "publish") {
      setPublishModalShow(true);
    } else if (type === "unPublish") {
      setUnPublishModalShow(true);
    }
  };

  //data table conditional style for published assessment
  const conditionalRowStyles = [
    {
      when: (row) => !row.isPublish,
      style: {
        backgroundColor: "rgba(231 34 99 / 8% )",
      },
    },
    {
      when: (row) => selectedAssessments.find((obj) => obj.id === row.id),
      style: {
        backgroundColor: "#3e3c7a",
        color: "#fff",
      },
    },
  ];

  const caseInsensitiveSortQcount = (rowA, rowB) => {
    const a = parseInt(rowA.questionCount ? rowA.questionCount : 0);
    const b = parseInt(rowB.questionCount ? rowB.questionCount : 0);

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };

  const caseInsensitiveSortRespones = (rowA, rowB) => {
    const a = parseInt(rowA.responseCount ? rowA.responseCount : 0);
    const b = parseInt(rowB.responseCount ? rowB.responseCount : 0);

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };
  //---------- Row disable Criteria
  const rowDisabledCriteriaPublish = (row) => row.isPublish && publishModalShow;
  const rowDisabledCriteriaUnPublish = (row) =>
    !row.isPublish && unpublishModalShow;

  //columns defenitions
  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.name}`,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => `${row.description}`,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => `${row.typeName}`,
      sortable: true,
    },
    {
      name: "Q Count",
      selector: (row) => `${row.questionCount}`,
      sortable: true,
      sortFunction: caseInsensitiveSortQcount,
    },
    {
      name: "Created Date",
      selector: (row) =>
        `${new Date(
          new Date(row.createdDate).getTime() -
          new Date(row.createdDate).getTimezoneOffset() * 60 * 1000
        ).toLocaleString("en-US", {
          month: "2-digit", // numeric, 2-digit, long, short, narrow
          day: "2-digit", // numeric, 2-digit
          year: "2-digit", // numeric, 2-digit
          hour: "numeric",
          minute: "numeric",
        })}`,
      sortable: true,
    },
    {
      name: "Responses",
      selector: (row) => `${row.responseCount}`,
      sortable: true,
      sortFunction: caseInsensitiveSortRespones,
    },
    {
      name: (
        <span className="material-icons list-fun-btns unblock-icon mr-3 ">
          visibility
        </span>
      ),
      // name: "Status",
      selector: (row) => (row.isPublish ? "Published" : "Unpublished"),
      sortable: true,
    },
    {
      button: true,
      cell: (row) => (
        <span className="list-btns d-flex ml-auto">
          <span
            className={
              "material-icons list-fun-btns edit-icon mr-3 custom-tooltip " +
              ((isMultipleChecked || row.isPublish) && "opacity-50")
            }
            onClick={() => editAssessment(row)}
          >
            <span className='tooltiptext'>Edit assessment</span>
            edit
          </span>

          {!row.isPublish ? (
            <span
              className={
                "material-icons curosr-pointer block-icon list-fun-btns mt-0 mr-3 " +
                (isMultipleChecked && "opacity-50")
              }
              onClick={
                !isMultipleChecked
                  ? () => assessmentObjectHandler(row, "publish")
                  : undefined
              }
              data-tip data-for="publish"
            >

              visibility_off
            </span>


          ) :

            (

              <span
                className={
                  "material-icons list-fun-btns unblock-icon mr-3  " +
                  (isMultipleChecked && "opacity-50")
                }

                onClick={
                  !isMultipleChecked
                    ? () => assessmentObjectHandler(row, "unPublish")
                    : undefined
                }
                data-tip data-for="unpublish"
              >

                {/* <span className='tooltiptext'>Unpublish assessment</span> */}
                visibility
              </span>

            )}
          <ReactTooltip id="unpublish" className="tooltip-react" border arrowColor='#2C2A5F' place="left" effect="solid">
            Unpublish assessment
          </ReactTooltip>
          <ReactTooltip id="publish" className="tooltip-react" border arrowColor='#2C2A5F' place="left" effect="solid">
            Publish assessment
          </ReactTooltip>
          <span
            className={
              "material-icons curosr-pointer list-fun-btns mr-2 custom-tooltip " +
              (isMultipleChecked && "opacity-50")
            }
            onClick={() => {
              setCopyData(row);
              setCopyModal(true);
            }}
          >
            <span className='tooltiptext'>Copy</span>
            content_copy
          </span>
        </span>
      ),
    },
  ];

  //custom column sorting
  const customSort = (rows, selector, direction) => {
    return rows.sort((rowA, rowB) => {
      // use the selector function to resolve your field names by passing the sort comparitors
      const aField = selector(rowA);
      const bField = selector(rowB);

      let comparison = 0;

      if (aField.toLowerCase() > bField.toLowerCase()) {
        comparison = 1;
      } else if (aField.toLowerCase() < bField.toLowerCase()) {
        comparison = -1;
      }

      return direction === "desc" ? comparison * -1 : comparison;
    });
  };

  const [editData, setEditData] = useState();
  const editAssessment = (rowData) => {
    setAddAssesmentModalShow(true);
    setEditData(rowData);
  };

  const copyAssessment = () => {
    let params = {
      name: copiedData.name + "-copy",
      description: copiedData.description,
      publicName: copiedData.publicName,
      publicDescription: copiedData.publicDescription,
      typeId: copiedData.typeId,
      reminderId: copiedData.reminderId,
      resultComputationId: copiedData.resultComputationId,
      redirectPageId: copiedData.redirectPageId,
      showThankYouPage: copiedData.showThankYouPage,
      applicationUserId: userState.user.id,
      shortDescription: copiedData.shortDescription,
      longDescription: copiedData.longDescription,
      thankYouDescription: copiedData.thankYouDescription,
      additionalInstructions: copiedData.additionalInstructions,
      assessmentGroupMapping: copiedData.assessmentGroupMapping.$values
        ? copiedData.assessmentGroupMapping.$values.map((obj) => ({
          isActive: obj.isActive,
          groupId: obj.groupId,
        }))
        : [],
      assessmentsQuestion: copiedData.assessmentsQuestion.$values
        ? copiedData.assessmentsQuestion.$values.map((obj) => ({
          order: obj.order,
          question: obj.question,
          category: obj.category,
          weight: obj.weight,
          assessmentAnswerTypeId: obj.assessmentAnswerTypeId,
          preQuestionPhrase: obj.preQuestionPhrase,
          isRequired: obj.isRequired,
          isActive: true,
          assessmentsAnswer: obj.assessmentsAnswer.$values
            ? obj.assessmentsAnswer.$values.map((data) => ({
              order: data.order,
              answer: data.answer,
              weight: data.weight,
              value: data.value,
              isActive: true,
            }))
            : [],
        }))
        : [],
    };

    createAssessment(params)
      .then((res) => {
        if (res && (res.status === 204 || res.status === 200)) {
          if (isMounted()) {
            toast({ type: "success", text: "Assessment copied successfully" });
            setCopyModal(false);
            asessmentManageList();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  //clear selected rows after actions
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
    setIsPublishButton(false);
    setIsUnPublishButton(false);
    setIsMultipleChecked(false);
  };

  const publishSingleAssesment = () => {
    let params = {
      isPublish: true,
      assessmentId: assessmentObject.id,
      typeName: assessmentObject.typeName
    };
    publishSingleAssessment(params)
      .then((res) => {
        if (res && res.status === 204) {
          if (isMounted()) {
            setPublishModalShow(false);
            toast({
              type: "success",
              text: "Assessment published successfully",
            });
            setAssessmentObject({});
            asessmentManageList();
          }
        }
      })
      .catch((err) => console.log(err));
  };
  const unPublishSingleAssesment = () => {
    let params = {
      isPublish: false,
      assessmentId: assessmentObject.id,
      typeName: assessmentObject.typeName
    };
    publishSingleAssessment(params)
      .then((res) => {
        if (res && res.status === 204) {
          if (isMounted()) {
            setUnPublishModalShow(false);
            toast({
              type: "success",
              text: "Assessment unpublished successfully",
            });
            setAssessmentObject({});
            asessmentManageList();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const publishMultipleAssesment = () => {
    let params = {
      isPublish: true,
      assessmentIds: [],
    };
    let resourceTypes = selectedAssessments.filter(obj => obj.typeId === 1)
    if (resourceTypes.length > 1) {
      toast({
        type: "warning",
        text: "Can't able to publish more than one Resource Type Assessment at the same time.",
      });
      return;
    }
    let publishusers = selectedAssessments.filter((obj) => !obj.isPublish);
    if (publishusers) {
      publishusers.forEach((element) => {
        params["assessmentIds"].push(element.id);
      });
    }
    publishAssesmentStatus(params)
      .then((res) => {
        if (res && res.status === 204) {
          if (isMounted()) {
            setPublishModalShow(false);
            toast({
              type: "success",
              text: "Assessments published successfully",
            });
            setSelectedAssessments([]);
            asessmentManageList();
            handleClearRows();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const unPublishMultipleAssesment = () => {
    let params = {
      isPublish: false,
      assessmentIds: [],
    };
    let publishusers = selectedAssessments.filter((obj) => obj.isPublish);
    if (publishusers) {
      publishusers.forEach((element) => {
        params["assessmentIds"].push(element.id);
      });
    }
    publishAssesmentStatus(params)
      .then((res) => {
        if (res && res.status === 204) {
          if (isMounted()) {
            setUnPublishModalShow(false);
            toast({
              type: "success",
              text: "Assessments unpublished successfully",
            });
            setSelectedAssessments([]);
            asessmentManageList();
            handleClearRows();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <ConfirmationModal
        show={publishModalShow}
        actionText={
          isMultipleChecked ? (
            <>
              publish these assessments?
              <br />
              <span style={{ color: "red" }}>
                *The selection is disabled for assessment with published status
              </span>
            </>
          ) : (
            "publish this assessment?"
          )
        }
        actionButton="Publish"
        btnClassName="save-btn-custom"
        onHide={() => setPublishModalShow(false)}
        onAction={() =>
          !isMultipleChecked
            ? publishSingleAssesment()
            : publishMultipleAssesment()
        }
      />
      <ConfirmationModal
        show={unpublishModalShow}
        actionText={
          isMultipleChecked ? (
            <>
              unpublish these assessments?
              <br />
              <span style={{ color: "red" }}>
                *The selection is disabled for assessment with unpublished
                status
              </span>
            </>
          ) : (
            "unpublish this assessment?"
          )
        }
        actionButton="Unpublish"
        btnClassName="btn-danger"
        onHide={() => setUnPublishModalShow(false)}
        onAction={() =>
          !isMultipleChecked
            ? unPublishSingleAssesment()
            : unPublishMultipleAssesment()
        }
      />
      <ConfirmationModal
        show={copyModalShow}
        actionText="make a copy of this assessment?"
        actionButton="Copy"
        btnClassName="save-btn-custom"
        onHide={() => setCopyModal(false)}
        onAction={copyAssessment}
      />

      {addAssesmentModalShow && (
        <CreateAssessmentModal
          show={addAssesmentModalShow}
          onHide={() => setAddAssesmentModalShow(false)}
          asessmentManageList={asessmentManageList}
          editData={editData}
          setEditData={setEditData}
        />
      )}
      <div id="main" className="platform-admin-component">
        <DashboardHeaderComponent headerText="ReadySkill Administrator" />
        <div className="bread-crumb">
          <NavLink
            to="/portal/admin/platform_admins"
            className="smallText text-uppercase text-decoration-none navlink"
          >
            READYSKILL ADMINISTRATOR{" "}
          </NavLink>
          <a className="smallText text-uppercase navlink-assesment text-decoration-none active">
            {" "}
            {">"} ASSESSMENT MANAGEMENT
          </a>
        </div>
        <div className="container-fluid pl-0">
          <h1 className="h5 headText mt-5 d-flex">
            <span className="material-icons mt-02 mr-2" >
              help_outline
            </span>
            Assessment Management
          </h1>
          <p className="subText mt-3">
            <span className="material-icons mr-2 text-danger">warning</span>
            WARNING: Unless otherwise noted, changes made here are reflected
            immediately on the platform. Use care when making changes on a live
            system!
          </p>

          <div className="assessment-btns pl-0">
            {isMultipleChecked && (
              <>
                {isPublishButton && (
                  <button
                    className="assessment-publish mr-2 mt-2"
                    onClick={() => setPublishModalShow(true)}
                  >
                    <span className="material-icons publish-icon mr-2">
                      remove_red_eye
                    </span>
                    Publish Assessments
                  </button>
                )}
                {isUnPublishButton && (
                  <button
                    className="assessment-publish mr-2 mt-2"
                    onClick={() => setUnPublishModalShow(true)}
                  >
                    <span className="material-icons unpublish-icon mr-2">
                      visibility_off
                    </span>
                    Unpublish Assessments
                  </button>
                )}
              </>
            )}
            <button className="add-btn-2 mt-2 text-uppercase" onClick={() => setAddAssesmentModalShow(true)}>
              Create Assessment
            </button>
          </div>

          <div className="org-list-card mt-4">
            <DataTable
              columns={columns}
              sortFunction={customSort}
              data={assessments ? assessments : []}
              pagination
              paginationComponent={DataTableCustomPagination}
              paginationComponentOptions={paginationComponentOptions}
              highlightOnHover
              customStyles={customStyles}
              theme="solarized"
              selectableRows
              onSelectedRowsChange={handleChange}
              clearSelectedRows={toggledClearRows}
              conditionalRowStyles={conditionalRowStyles}
              selectableRowsComponent={DataTableCustomCheckbox}
              selectableRowDisabled={
                publishModalShow
                  ? rowDisabledCriteriaPublish
                  : unpublishModalShow
                    ? rowDisabledCriteriaUnPublish
                    : ""
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalAdminLayOut(AssessmentManagement);
