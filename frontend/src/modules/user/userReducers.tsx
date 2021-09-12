import list from 'src/modules/user/list/userListReducers';
import form from 'src/modules/user/form/userFormReducers';
import view from 'src/modules/user/view/userViewReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
  view,
});
