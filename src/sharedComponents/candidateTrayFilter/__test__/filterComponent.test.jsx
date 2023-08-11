import { render } from '@testing-library/react';
import FilterComponent from '../filterComponent';
test('renders filter component', () => {
    //Mock data
    let filterCriteria = [{
        mainHeadText: ""
    }];
    render(
        <FilterComponent filterCriteria={filterCriteria} />
    );
});