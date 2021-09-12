import OrderService from 'src/modules/order/orderService';
import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { getHistory } from 'src/modules/store';
import { i18n } from 'src/i18n';

const prefix = 'ORDER_FORM';

const orderFormActions = {
  INIT_STARTED: `${prefix}_INIT_STARTED`,
  INIT_SUCCESS: `${prefix}_INIT_SUCCESS`,
  INIT_ERROR: `${prefix}_INIT_ERROR`,

  CREATE_STARTED: `${prefix}_CREATE_STARTED`,
  CREATE_SUCCESS: `${prefix}_CREATE_SUCCESS`,
  CREATE_ERROR: `${prefix}_CREATE_ERROR`,

  UPDATE_STARTED: `${prefix}_UPDATE_STARTED`,
  UPDATE_SUCCESS: `${prefix}_UPDATE_SUCCESS`,
  UPDATE_ERROR: `${prefix}_UPDATE_ERROR`,

  doInit: (id) => async (dispatch) => {
    try {
      dispatch({
        type: orderFormActions.INIT_STARTED,
      });

      let record = {};

      const isEdit = Boolean(id);

      if (isEdit) {
        record = await OrderService.find(id);
      }

      dispatch({
        type: orderFormActions.INIT_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: orderFormActions.INIT_ERROR,
      });

      getHistory().push('/order');
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: orderFormActions.CREATE_STARTED,
      });

      await OrderService.create(values);

      dispatch({
        type: orderFormActions.CREATE_SUCCESS,
      });

      Message.success(
        i18n('entities.order.create.success'),
      );

      getHistory().push('/order');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: orderFormActions.CREATE_ERROR,
      });
    }
  },

  doUpdate: (id, values) => async (dispatch, getState) => {
    try {
      dispatch({
        type: orderFormActions.UPDATE_STARTED,
      });

      await OrderService.update(id, values);

      dispatch({
        type: orderFormActions.UPDATE_SUCCESS,
      });

      Message.success(
        i18n('entities.order.update.success'),
      );

      getHistory().push('/order');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: orderFormActions.UPDATE_ERROR,
      });
    }
  },
};

export default orderFormActions;
