import listActions from 'src/modules/customer/list/customerListActions';
import CustomerService from 'src/modules/customer/customerService';
import Errors from 'src/modules/shared/error/errors';
import { i18n } from 'src/i18n';
import { getHistory } from 'src/modules/store';
import Message from 'src/view/shared/message';

const prefix = 'CUSTOMER_DESTROY';

const customerDestroyActions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,

  DESTROY_ALL_STARTED: `${prefix}_DESTROY_ALL_STARTED`,
  DESTROY_ALL_SUCCESS: `${prefix}_DESTROY_ALL_SUCCESS`,
  DESTROY_ALL_ERROR: `${prefix}_DESTROY_ALL_ERROR`,

  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: customerDestroyActions.DESTROY_STARTED,
      });

      await CustomerService.destroyAll([id]);

      dispatch({
        type: customerDestroyActions.DESTROY_SUCCESS,
      });

      Message.success(
        i18n('entities.customer.destroy.success'),
      );

      dispatch(listActions.doFetchCurrentFilter());

      getHistory().push('/customer');
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: customerDestroyActions.DESTROY_ERROR,
      });
    }
  },

  doDestroyAll: (ids) => async (dispatch) => {
    try {
      dispatch({
        type: customerDestroyActions.DESTROY_ALL_STARTED,
      });

      await CustomerService.destroyAll(ids);

      dispatch({
        type: customerDestroyActions.DESTROY_ALL_SUCCESS,
      });

      if (listActions) {
        dispatch(listActions.doClearAllSelected());
        dispatch(listActions.doFetchCurrentFilter());
      }

      Message.success(
        i18n('entities.customer.destroyAll.success'),
      );

      getHistory().push('/customer');
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: customerDestroyActions.DESTROY_ALL_ERROR,
      });
    }
  },
};

export default customerDestroyActions;
