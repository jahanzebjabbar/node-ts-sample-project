import list from 'src/modules/product/list/productListReducers';
import form from 'src/modules/product/form/productFormReducers';
import view from 'src/modules/product/view/productViewReducers';
import destroy from 'src/modules/product/destroy/productDestroyReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
  view,
  destroy,
});
