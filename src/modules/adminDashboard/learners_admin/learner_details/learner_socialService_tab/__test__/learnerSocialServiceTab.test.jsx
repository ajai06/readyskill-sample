import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LearnerSocialServiceTab from '../learnerSocialServiceTab';
import { UserContext } from '../../../../../../context/user/userContext';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Learners social service tab', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Learners social service tab', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <LearnerSocialServiceTab />
        </UserContext>, { route }
    )
})