import { render } from '@testing-library/react';
import HeaderComponent from '../headerComponent';
test('renders header component', () => {
    //Mock data
    let headerName = "";
    render(
        <HeaderComponent headerName={headerName} />
    );
});