import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListTableComponent from '../listTableComponent';
import { UserContext } from '../../../../../context/user/userContext';


const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Learners list table', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('Learners list table', () => {
    const route = '/';
    renderWithRouter(
        <UserContext>
            <ListTableComponent />
        </UserContext>, { route }
    )
})