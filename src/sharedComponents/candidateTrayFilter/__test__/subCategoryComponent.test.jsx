import { render } from '@testing-library/react';
import SubCategoryComponent from '../subCategoryComponent';
import SubHeadComponent from '../subHeadComponent';
test('renders subcategory component', () => {
    //Mock data
    let headerName = "";
    let subcategory = [{
        mainHeadText: ""
    }];
    let subHeader = "";
    render(
        <SubCategoryComponent
            headerName={headerName}
            subcategory={subcategory}
        >
            <SubHeadComponent subHeader={subHeader} />
        </SubCategoryComponent>
    );
});