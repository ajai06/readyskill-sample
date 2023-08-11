import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrganizationUsersTab from '../organization_users_tab';
import { UserContext } from '../../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'organization users tab', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('organization users tab', () => {
    const route = '/';
    let organizationDetails={}
    renderWithRouter(
        <UserContext>
            <OrganizationUsersTab organizationDetails={organizationDetails} />
        </UserContext>
        , { route }
    )
})