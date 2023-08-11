import { render } from '@testing-library/react';
import LeafNodeComponent from '../leafNodeComponent';
test('renders leaf node component', () => {
    //Mock data
    let headerName = "";
    let leafCategory = []
    render(
        <LeafNodeComponent
            headerName={headerName}
            leafCategory={leafCategory}
        />
    );
});