import React, { useEffect, useState } from "react";

import { ScrollMenu } from 'react-horizontal-scrolling-menu';

//context
import { UserAuthState } from "../../../../context/user/userContext";

//components
import { LeftArrow, RightArrow } from "./arrow";
import { Card } from "./card";
import "./hideScrollbar.css";

//services
import { getDashBoardSponsoredPrograms } from "../../../../services/dashboardServices";

function DashboardSponsoredPrograms() {

  const userState = UserAuthState();

  const [sponsoredProgramsData, getSponsoredProgramsData] = useState([]);

  useEffect(() => {
    getSponsoredPrograms();
  }, []);

  const getSponsoredPrograms = () => {
    let organizationId = userState.user.organization.organizationId;
    getDashBoardSponsoredPrograms(organizationId)
      .then((res) => {
        let data = res.data.$values;
        getSponsoredProgramsData(data);

      })
      .catch((err) => {
        console.log(err);

      });
  };

  function onWheel(apiObj, ev) {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }

  return (
    <div className="container-fluid pl-0 dashboard-arrows">
      <div className="d-sm-flex mt-5 mb-3">
        <h1 className="h5 headText mt-3 pl-3">Your Sponsored Programs</h1>
      </div>

      {
        sponsoredProgramsData && sponsoredProgramsData.length > 0
          ? <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
          >
            {sponsoredProgramsData.map(item => (
              <Card
                itemId={item.$id} // NOTE: itemId is required for track items
                key={item.$id}
                data={item}
              />

            ))}
          </ScrollMenu>
          : <p className="text-white ml-5">No sponsored programs found</p>
      }
    </div>
  );
}
export default DashboardSponsoredPrograms;
