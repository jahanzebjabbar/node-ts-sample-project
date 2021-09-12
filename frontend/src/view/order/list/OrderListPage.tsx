import React from 'react';
import { i18n } from 'src/i18n';
import OrderListFilter from 'src/view/order/list/OrderListFilter';
import OrderListTable from 'src/view/order/list/OrderListTable';
import OrderListToolbar from 'src/view/order/list/OrderListToolbar';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';

function OrderListPage(props) {
  return (
    <>
      <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('entities.order.menu')],
        ]}
      />

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.order.list.title')}
        </PageTitle>

        <OrderListToolbar />
        <OrderListFilter />
        <OrderListTable />
      </ContentWrapper>
    </>
  );
}

export default OrderListPage;
