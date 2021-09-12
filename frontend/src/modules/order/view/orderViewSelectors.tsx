import { createSelector } from 'reselect';

const selectRaw = (state) => state.order.view;

const selectRecord = createSelector(
  [selectRaw],
  (raw) => raw.record,
);

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const orderViewSelectors = {
  selectLoading,
  selectRecord,
  selectRaw,
};

export default orderViewSelectors;