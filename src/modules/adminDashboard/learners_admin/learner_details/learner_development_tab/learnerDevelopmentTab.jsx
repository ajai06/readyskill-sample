import React, { useEffect, useState } from "react";

import "../../learnersadmin.scss";
import LearnerDevelopmentListTable from "./learnerDevelopmentListTable";

function LearnerDevelopmentTab() {
  const [developmentEvents, setDevelopmentEvents] = useState([]);

  useEffect(() => {
    setDevelopmentEvents([
      {
        event: "Resume Writing Seminar",
        date: "09/23/2021",
        university: "Columbus State community college",
      },
      {
        event: "Enrolled in Mentorship",
        date: "09/23/2021",
        university: "Franklin University",
      },
    ]);
  }, []);


  return (
    <LearnerDevelopmentListTable developmentEvents={developmentEvents} />
  );
}

export default LearnerDevelopmentTab;
