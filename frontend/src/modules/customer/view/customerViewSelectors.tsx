import { createSelector } from 'reselect';

const selectRaw = (state) => state.customer.view;

const selectRecord = createSelector(
  [selectRaw],
  (raw) => raw.record,
);

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const customerViewSelectors = {
  selectLoading,
  selectRecord,
  selectRaw,
};

export default customerViewSelectors;