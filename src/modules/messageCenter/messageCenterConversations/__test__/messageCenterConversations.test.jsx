import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'organization groups tab', route)
    return render(ui, { wrapper: BrowserRouter })
}

test('organization groups tab', () => {
    renderWithRouter(
        // setTimeout(() => {
        //     <UserContext>
        //         <SignalRContext>
        //             <MessageCenterConversations />
        //         </SignalRContext>
        //     </UserContext>
        // }, 300)

        // , { route }
    )
})