import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthorizationLimit from '../authorizationLimit';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Authorization limit', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Authorization limit', () => {
    const route = '/';
    renderWithRouter(
            <AuthorizationLimit />
        , { route }
    )
})