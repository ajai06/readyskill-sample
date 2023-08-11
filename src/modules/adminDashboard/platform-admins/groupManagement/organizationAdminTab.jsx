import React from "react";
import GroupRolesList from "../../../../sharedComponents/groupsRoleList/groupsRoleList";

function OrganizationAdminTab({ rolesCategoryList }) {
  return (
<div>
         <div className="col-12">
        <div className="card-body w-100 px-0 pt-0">
          <p className="subHead-text-learner mb-4 text-uppercase mt-5">
            ROLES ASSIGNED TO THE ORGANIZATION ADMINISTRATOR GROUP
          </p>

          <GroupRolesList
            groupName={"Admin"}
            rolesCategoryList={rolesCategoryList}
          />
        </div>
      </div>
    </div>
  );
}

export default OrganizationAdminTab;
