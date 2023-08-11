import { render } from '@testing-library/react';
import InformationTrayComponent from '../informationTrayComponent'

test('renders informationTray', () => {
    //Mock data
    let trayInformation={}
    render(
        <InformationTrayComponent trayInformation={trayInformation}/>
      );
  });