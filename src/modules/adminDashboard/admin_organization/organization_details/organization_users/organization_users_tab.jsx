import React, { useEffect, useState } from "react";

//services
import { getOrganizationUsers } from "../../../../../services/organizationServices";
import { useIsMounted } from "../../../../../utils/useIsMounted";
import UserListComponent from "./userListTableComponent";

function OrganizationUsersTab({ organizationDetails }) {
  const [users, setUsers] = useState([]);
  const [expandRow, setExpandRow] = useState(false);

  const isMounted = useIsMounted();
 

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const res = await getOrganizationUsers(organizationDetails.id);
      if (res.data.length) {
        if (isMounted()) {
          await setUsers(res.data);
          setExpandRow(!expandRow);
        }
      } else {
        if (isMounted()) {
          setUsers([]);
        }
      }
    } catch (error) {
      console.log(error.response);
    }
    return "";
  };

  return (
    <div>
      <div className="card-body org-user-tab">
        <UserListComponent
          organizationDetails={organizationDetails}
          userList={users}
          expandRow={expandRow}
          getAllUsersList={getAll}
          // totalRecords={totalRecords}
          orgId={organizationDetails.id}
        />
      </div>
    </div>
  );
}

export default OrganizationUsersTab;
