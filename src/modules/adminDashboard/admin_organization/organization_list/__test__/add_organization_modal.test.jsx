import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddOrganizationModal from '../add_organization_modal';
import { UserContext } from '../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'create organization', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('create organization', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <AddOrganizationModal />
        </UserContext>

        , { route }
    )
})