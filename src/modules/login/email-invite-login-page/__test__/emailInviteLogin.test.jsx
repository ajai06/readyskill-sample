import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmailInviteLogin from '../emailInviteLogin';
import { UserContext } from '../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'email invite login', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('email invite login', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <EmailInviteLogin />
        </UserContext>

        , { route }
    )
})