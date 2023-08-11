import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'group details', route)
    return render(ui, { wrapper: BrowserRouter })
}

test(' group details', () => {
    renderWithRouter(
        // setTimeout(() => {
        //     <UserContext>
        //         <GroupDetailsPanel  />
        //     </UserContext>
        // }, 200)

        // , { route }
    )
})