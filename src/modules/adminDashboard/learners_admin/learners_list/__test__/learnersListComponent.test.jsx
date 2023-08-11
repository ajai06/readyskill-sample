import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LearnersListComponent from '../learnersListComponent'
import { UserContext } from '../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Learners list component', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Learners list component', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <LearnersListComponent />
        </UserContext>, { route }
    )
})