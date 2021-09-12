import { createSelector } from 'reselect';

const selectRaw = (state) => state.customer.destroy;

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const customerDestroySelectors = {
  selectLoading,
};

export default customerDestroySelectors;
