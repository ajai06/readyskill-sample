import React, { useEffect, useState } from "react";

//services
import {
  getDashboardAlert,
  dismissDashboardAlert,
} from "../../../../services/dashboardServices";

import { UserAuthState } from "../../../../context/user/userContext";
import AlertCenter from "../../../../sharedComponents/alertCenter/alertCenter";

import {OrganizationTypes} from "../../../../utils/contants"

function DashboardAlertCenterComponent() {
  const userState = UserAuthState();

  const uuid = userState.user.id;

  const [alertCenterDataList, setAlerCenterDataList] = useState([]);

  useEffect(() => {
    getDashboardMessageCenterData();
  }, []);

  const getDashboardMessageCenterData = () => {
    getDashboardAlert(uuid, "Non-Admin")
      .then((res) => {
        let data = res.data.$values;
        console.log(data);
        setAlerCenterDataList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dismissClickHandler = (alert) => {
    const data = {};
    data.applicationUserId = uuid;
    data.alertIds = [alert.id];

    dismissDashboardAlert(data)
      .then((res) => {
        getDashboardMessageCenterData();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const dismissAllHandler = () => {
    let alertsIds = [];

    alertCenterDataList.map((item) => alertsIds.push(item.id));

    const data = {};
    data.applicationUserId = uuid;
    data.alertIds = alertsIds;

    dismissDashboardAlert(data)
      .then((res) => {
        getDashboardMessageCenterData();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="col-xl-7 col-lg-7 col-md-7">
    <AlertCenter
      dismissAllHandler={dismissAllHandler}
      dismissClickHandler={dismissClickHandler}
      alertCenterDataList={alertCenterDataList}
      type={`PENDING ALERTS ${alertCenterDataList?.length > 1 ? "ALERTS" : "ALERT"}`}
    />
    </div>
  );
}

export default DashboardAlertCenterComponent;
