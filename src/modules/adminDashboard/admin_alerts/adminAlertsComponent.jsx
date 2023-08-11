import React, { useEffect, useState } from "react";

import AlertCenter from "../../../sharedComponents/alertCenter/alertCenter";

import { UserAuthState } from "../../../context/user/userContext";

//services
import {
  getDashboardAlert,
  dismissDashboardAlert,
} from "../../../services/adminServices";
import { useIsMounted } from "../../../utils/useIsMounted";

function AdminAlertsComponent() {
  const userState = UserAuthState();
  const isMounted = useIsMounted();

  const uuid = userState.user.id;

  const [alertCenterDataList, setAlerCenterDataList] = useState([]);

  useEffect(() => {
    getDashboardMessageCenterData();
  }, []);

  const getDashboardMessageCenterData = () => {
    getDashboardAlert(uuid, "Admin")
      .then((res) => {
        if (isMounted()) {
          let data = res.data.$values;
          setAlerCenterDataList(data);
        }
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
        if(isMounted()){
          getDashboardMessageCenterData();
        }
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
        if(isMounted()){
          getDashboardMessageCenterData();
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="col-xl-11 col-lg-11 col-md-11">

      <AlertCenter
        dismissAllHandler={dismissAllHandler}
        dismissClickHandler={dismissClickHandler}
        alertCenterDataList={alertCenterDataList}
        type={`PENDING ADMINISTRATIVE ALERTS`}
      />
    </div>
  );
}

export default AdminAlertsComponent;
