import { render } from '@testing-library/react';
import EditUserModel from '../editUserModel'
test('renders edit user modal', () => {
    //Mock data
    render(
        <EditUserModel/>
      );
  });