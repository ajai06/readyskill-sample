import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrganizationGroups from '../organization_groups_tab';
import { UserContext } from '../../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'organization groups tab', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('organization groups tab', () => {
    const route = '/';
    let organizationDetails={}
    renderWithRouter(
        <UserContext>
            <OrganizationGroups organizationDetails={organizationDetails} />
        </UserContext>
        , { route }
    )
})