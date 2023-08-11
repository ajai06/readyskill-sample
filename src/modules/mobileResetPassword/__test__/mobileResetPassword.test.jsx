import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MobileResetPassword from '../mobileResetPassword';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'reset password mobile', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('reset password mobile', () => {
    const route = '/';
    renderWithRouter(
        
            <MobileResetPassword/>
        , { route }
    )
})