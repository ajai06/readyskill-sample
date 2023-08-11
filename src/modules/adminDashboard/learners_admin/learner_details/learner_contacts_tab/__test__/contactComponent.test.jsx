import { render } from '@testing-library/react';
import ContactComponent from '../contactComponent'
import { UserContext } from '../../../../../../context/user/userContext'

test('Learners contact tab', () => {
    let contacts={}
    render(
        <UserContext>
            <ContactComponent contacts={contacts}/>
        </UserContext>

    )
})