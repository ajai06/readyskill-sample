import { render } from '@testing-library/react';
import EditUserGroupsModal from '../editUserGroupsModal';
import { UserContext } from '../../../../../../context/user/userContext';
test('renders edit groups modal', () => {
    //Mock data
    render(
        <UserContext>
            <EditUserGroupsModal />
        </UserContext>
    );
});