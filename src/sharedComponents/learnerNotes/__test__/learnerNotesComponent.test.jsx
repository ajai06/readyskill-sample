import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LearnerNotesComponent from '../learnerNotesComponent';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Candidate Card', route)
    return render(ui, { wrapper: BrowserRouter })
}
test('renders learners notes', () => {
    //Mock data
    const route = "/portal/messagecenter";

    renderWithRouter(
        <LearnerNotesComponent/>, { route })
})