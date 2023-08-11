import React from "react";

import { VisibilityContext } from "react-horizontal-scrolling-menu";
import SponsoredProgramCard from "../../../../sharedComponents/sponsoredProgramCard/sponsoredProgramCard";

export function Card({ itemId, data }) {

  const visibility = React.useContext(VisibilityContext);

  // to check card is on the visible area
  const visible = visibility.isItemVisible(itemId);

  const styles = {
    WebkitMaskImage: 'linear-gradient(to right,transparent 0%, white 50%)',
    maskImage: 'linear-gradient(to right, transparent 0%, white 50%)',
  }

  return (

    <>
      <div style={!visible ? styles : {}} id="programCard" className={"sponsered-card mb-4"}>
        <SponsoredProgramCard programData={data} />
      </div>
    </>
  );
}
