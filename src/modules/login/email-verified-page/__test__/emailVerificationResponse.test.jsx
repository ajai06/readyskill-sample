import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmailVerificationResponse from '../emailVerificationResponse';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'email verified', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('email verified', () => {
    const route = '/';
    renderWithRouter(
            <EmailVerificationResponse />
        , { route }
    )
})