import React from 'react';
import { i18n } from 'src/i18n';
import CustomerListFilter from 'src/view/customer/list/CustomerListFilter';
import CustomerListTable from 'src/view/customer/list/CustomerListTable';
import CustomerListToolbar from 'src/view/customer/list/CustomerListToolbar';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';

function CustomerListPage(props) {
  return (
    <>
      <Breadcrumb
        items={[
          [i18n('dashboard.menu'), '/'],
          [i18n('entities.customer.menu')],
        ]}
      />

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.customer.list.title')}
        </PageTitle>

        <CustomerListToolbar />
        <CustomerListFilter />
        <CustomerListTable />
      </ContentWrapper>
    </>
  );
}

export default CustomerListPage;
