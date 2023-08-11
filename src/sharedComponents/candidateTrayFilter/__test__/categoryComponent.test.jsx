import { render } from '@testing-library/react';
import CategoryComponent from '../categoryComponent';
test('renders category component', () => {
    //Mock data
    let category=[];
    render(
        <CategoryComponent category={category}/>
      );
  });