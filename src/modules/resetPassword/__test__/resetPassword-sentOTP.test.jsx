import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPasswordSentOTP from '../resetPassword-sentOTP';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'reset password sent otp', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('reset password sent otp', () => {
    const route = '/';
    renderWithRouter(
        
            <ResetPasswordSentOTP/>
        , { route }
    )
})