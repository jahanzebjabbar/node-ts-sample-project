import { createSelector } from 'reselect';

const selectRaw = (state) => state.order.destroy;

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const orderDestroySelectors = {
  selectLoading,
};

export default orderDestroySelectors;
