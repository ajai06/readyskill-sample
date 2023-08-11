import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InviteSignup from '../inviteSignup';
import { UserContext } from '../../../../context/user/userContext';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'invite signup', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('invite signup', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <InviteSignup />
        </UserContext>, { route }
    )
})