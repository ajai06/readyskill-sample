import { render } from '@testing-library/react';
import SponsoredProgramCard from '../sponsoredProgramCard'
test('renders sponsored programs card', () => {
    //Mock data
    let key=""
    let programData={}
    render(
        <SponsoredProgramCard key={key} programData={programData}/>
      );
  });