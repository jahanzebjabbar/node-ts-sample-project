import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { i18n } from 'src/i18n';
import actions from 'src/modules/product/view/productViewActions';
import selectors from 'src/modules/product/view/productViewSelectors';
import ProductView from 'src/view/product/view/ProductView';
import ProductViewToolbar from 'src/view/product/view/ProductViewToolbar';
import ContentWrapper from 'src/view/layout/styles/ContentWrapper';
import Breadcrumb from 'src/view/shared/Breadcrumb';
import PageTitle from 'src/view/shared/styles/PageTitle';

function ProductPage() {
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
          [i18n('entities.product.menu'), '/product'],
          [i18n('entities.product.view.title')],
        ]}
      />

      <ContentWrapper>
        <PageTitle>
          {i18n('entities.product.view.title')}
        </PageTitle>

        <ProductViewToolbar match={match} />

        <ProductView loading={loading} record={record} />
      </ContentWrapper>
    </>
  );
}

export default ProductPage;
