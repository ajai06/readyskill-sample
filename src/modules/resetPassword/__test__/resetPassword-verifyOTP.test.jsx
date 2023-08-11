import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPasswordVerifyOTP from '../resetPassword-verifyOTP';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'reset password verify otp', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('reset password verify otp', () => {
    const route = '/';
    renderWithRouter(
        
            <ResetPasswordVerifyOTP/>
        , { route }
    )
})