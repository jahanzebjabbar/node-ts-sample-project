import CustomerService from 'src/modules/customer/customerService';
import Errors from 'src/modules/shared/error/errors';
import { getHistory } from 'src/modules/store';

const prefix = 'CUSTOMER_VIEW';

const customerViewActions = {
  FIND_STARTED: `${prefix}_FIND_STARTED`,
  FIND_SUCCESS: `${prefix}_FIND_SUCCESS`,
  FIND_ERROR: `${prefix}_FIND_ERROR`,

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: customerViewActions.FIND_STARTED,
      });

      const record = await CustomerService.find(id);

      dispatch({
        type: customerViewActions.FIND_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: customerViewActions.FIND_ERROR,
      });

      getHistory().push('/customer');
    }
  },
};

export default customerViewActions;
