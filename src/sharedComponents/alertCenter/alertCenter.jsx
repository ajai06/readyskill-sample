import React,{useState} from "react";
import ConfirmationModal from "../confirmationModal/confirmationModal";
import "./alertCenter.scss";

const AlertCenter = React.memo(({ dismissAllHandler, dismissClickHandler, alertCenterDataList, type }) => {

  const [isDismissAll,setDismissAll]=useState(false);

  return (
    <React.Fragment>
      <ConfirmationModal show={isDismissAll} actionText="clear all the alerts?" actionButton="Clear" btnClassName="btn-danger"
        onHide={() => setDismissAll(false)} onAction={()=>{dismissAllHandler();setDismissAll(false)}}
      />
      <div className="card shadow mb-4 reviewCard">
        <div className="card-header">
          <div className="row">
            <div className="col-md-9 col-lg-9">
              <div className="boldText">{!!alertCenterDataList ? alertCenterDataList.length : 0}</div>
              <div className="subText">{type}</div>
            </div>
            <div className="col-md-3 col-lg-3">
              {!!alertCenterDataList && alertCenterDataList.length !== 0 && <button type="button" className="btn btn-link smallText bRight" onClick={()=>{setDismissAll(true)}}>
                Dismiss All
              </button>}
            </div>
          </div>
        </div>
        <div className="card-body pending-alert fading">
          {!!alertCenterDataList && alertCenterDataList.length !== 0 &&
            alertCenterDataList.map((alertData, index) => (
              <div className="row " key={alertData["$id"]}>
                <div className="col-md-10 col-lg-10 ">
                  <h5 className="text3 m-0">{alertData.bodyText}</h5>
                  <p className="smallText">
                    {`${(new Date(new Date(alertData.createdDate).getTime() - new Date(alertData.createdDate).getTimezoneOffset() * 60 * 1000)).toLocaleString("en-US", {
                      month: "2-digit", // numeric, 2-digit, long, short, narrow
                      day: "2-digit", // numeric, 2-digit
                      year: "2-digit", // numeric, 2-digit
                      hour: "numeric",
                      minute: "numeric"
                    })}`}

                  </p>
                </div>
                <div className="col-md-2 col-lg-2">
                  <button
                    type="button"
                    className="btn btn-link smallText dismiss"
                    onClick={() => dismissClickHandler(alertData)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          {(!alertCenterDataList || alertCenterDataList.length === 0) && <h5 className="text3 m-0">No pending alerts</h5>}
        </div>
      </div>
    </React.Fragment>
  );
})

export default React.memo(AlertCenter)