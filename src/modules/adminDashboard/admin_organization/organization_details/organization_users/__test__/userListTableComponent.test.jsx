import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserListComponent from '../userListTableComponent';
import { UserContext } from '../../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'organization users list', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('organization users list', () => {
    const route = '/';
    let organizationDetails={}
    renderWithRouter(
        <UserContext>
            <UserListComponent organizationDetails={organizationDetails} />
        </UserContext>
        , { route }
    )
})