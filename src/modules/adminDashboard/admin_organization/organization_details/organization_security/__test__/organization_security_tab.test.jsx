import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrganizationSecurity from '../organization_security_tab';
import { UserContext } from '../../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'organization security tab', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('organization security', () => {
    const route = '/';
    let organizationDetails={}
    renderWithRouter(
        <UserContext>
            <OrganizationSecurity organizationDetails={organizationDetails} />
        </UserContext>
        , { route }
    )
})