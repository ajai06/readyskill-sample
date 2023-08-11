import { render } from '@testing-library/react';
import AlertCenter from '../alertCenter'
test('renders Alert center', () => {
    //Mock data
    let alertCenterDataList=[]
    let type=''
    render(
        <AlertCenter type={type} alertCenterDataList={alertCenterDataList}/>
      );
  });