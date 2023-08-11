import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginComponent from '../loginComponent';
import { UserContext } from '../../../../context/user/userContext';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Login', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Login', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <LoginComponent />
        </UserContext>, { route }
    )
})