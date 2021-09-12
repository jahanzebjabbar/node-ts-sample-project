import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbNav = styled.nav`
  .breadcrumb {
    font-size: 13px;
    margin: 0px;
    padding: 0px;
    background-color: transparent;
  }

  .breadcrumb-item:not(.active) a {
    color: rgba(0, 0, 0, 0.45);
  }
`;

function Breadcrumb(props) {
  const isLink = (item) => {
    return item.length > 1;
  };
  return (
    <BreadcrumbNav>
      <ol className="breadcrumb">
        {props.items.map((item, index) => (
          <li
            key={item[0]}
            className={`breadcrumb-item ${
              props.items.length - 1 === index
                ? 'active'
                : ''
            }`}
          >
            {isLink(item) ? (
              <Link to={item[1]}>{item[0]}</Link>
            ) : (
              item[0]
            )}
          </li>
        ))}
      </ol>
    </BreadcrumbNav>
  );
}

export default Breadcrumb;
