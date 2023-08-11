import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateAssessmentModal from '../create-assessment-modal';
import { UserContext } from '../../../../../context/user/userContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'create assessment modal', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('create assessment modal', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <CreateAssessmentModal/>
        </UserContext>
        , { route }
    )
})