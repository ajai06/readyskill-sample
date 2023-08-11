import { render } from '@testing-library/react';
import SupportServices from '../supportServices'

test('Learners support service', () => {
    let socialList=[];
    render(
        <SupportServices socialList={socialList}/>
    )
})