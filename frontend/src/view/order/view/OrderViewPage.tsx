import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { i18n } from 'src/i18n';
import actions from 'src/modules/order/view/orderViewActions';
import selectors from 'src/modules/order/view/orderViewSelectors';
import OrderView from 'src/view/order/view/OrderView';
import OrderViewToolbar from 'src/view/order/view/OrderViewToolbar';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';

function OrderPage() {
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const loading = useSelector(selectors.selectLoading);
  const record = useSelector(selectors.selectRecord);

  useEffect(() => {
    dispatch(actions.doFind(match.params.id));
  }, [dispatch, match.params.id]);

  return (
    <>
      <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('entities.order.menu'), '/order'],
          [i18n('entities.order.view.title')],
        ]}
      />

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.order.view.title')}
        </PageTitle>

        <OrderViewToolbar match={match} />

        <OrderView loading={loading} record={record} />
      </ContentWrapper>
    </>
  );
}

export default OrderPage;
