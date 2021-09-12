import { connectRouter } from 'connected-react-router';
import layout from 'src/modules/layout/layoutReducers';
import auth from 'src/modules/auth/authReducers';
import user from 'src/modules/user/userReducers';
import customer from 'src/modules/customer/customerReducers';
import product from 'src/modules/product/productReducers';
import order from 'src/modules/order/orderReducers';
import { combineReducers } from 'redux';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    layout,
    auth,
    user,
    customer,
    product,
    order,
  });
