import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SocialServiceGrid from '../socialServiceGrid';
import { UserContext } from '../../../../../../context/user/userContext';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Learners social service grid', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Learners social service grid', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <SocialServiceGrid />
        </UserContext>, { route }
    )
})