import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrganizationOverviewTab from '../organization_overview_tab';
import { UserContext } from '../../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'organization overview tab', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('organization overview tab', () => {
    const route = '/';
    let organizationDetails={}
    renderWithRouter(
        <UserContext>
            <OrganizationOverviewTab organizationDetails={organizationDetails} />
        </UserContext>
        , { route }
    )
})