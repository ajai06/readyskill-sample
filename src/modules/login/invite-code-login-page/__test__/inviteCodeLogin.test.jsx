import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InviteCodeLogin from '../inviteCodeLogin';
import { UserContext } from '../../../../context/user/userContext';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'invite code login', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('invite code login', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <InviteCodeLogin />
        </UserContext>, { route }
    )
})