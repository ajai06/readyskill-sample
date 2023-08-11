import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CandidateCardComponent from '../candidateCardComponent'

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Candidate Card', route)
    return render(ui, { wrapper: BrowserRouter })
}
test('renders Candidate card', () => {
    //Mock data
    let candidate = { badges: { $values: [] } }
    const route = '/portal/dashboard';
    let Key = "";
    let cardColumns = "col-6";
    renderWithRouter(
        <CandidateCardComponent {...candidate} cardColumns={cardColumns} key={Key} />, { route })
})