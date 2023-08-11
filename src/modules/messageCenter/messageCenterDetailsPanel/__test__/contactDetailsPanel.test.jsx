import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'contact details', route)
    return render(ui, { wrapper: BrowserRouter })
}

test(' contact details', () => {
    renderWithRouter(
        // setTimeout(() => {
        //     <UserContext>
        //         <ContactDetailsPanel groupDetails={groupDetails} />
        //     </UserContext>
        // }, 200)

        // , { route }
    )
})