import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LearnerEducationTab from '../learnerEducationTab'
import { UserContext } from '../../../../../../context/user/userContext'

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Learners education tab', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Learners education tab', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <LearnerEducationTab/>
        </UserContext>,{route})
})