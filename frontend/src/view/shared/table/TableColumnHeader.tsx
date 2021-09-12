import React from 'react';
import styled from 'styled-components';

const TableColumnHeaderStyled = styled.th`
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.15s ease-in;

  &:hover,
  &:focus {
    opacity: 0.5;
    transition: opacity 0.15s ease-in;
  }

  &:active {
    opacity: 0.8;
    transition: opacity 0.15s ease-out;
  }
`;

const TableColumnHeader = (props) => {
  const {
    sorter,
    onSort,
    name,
    label,
    hasRows,
    children,
    align = 'left',
  } = props;

  if (!hasRows || !onSort) {
    return (
      <th
        className={props.className || ''}
        style={{ textAlign: align }}
        scope="col"
      >
        {children || label || ''}
      </th>
    );
  }

  return (
    <TableColumnHeaderStyled
      onClick={() => onSort(name)}
      className={`${props.className || ''} sortable`}
      scope="col"
    >
      <div
        className="d-flex"
        style={{
          justifyContent:
            align === 'right'
              ? 'flex-end'
              : align === 'center'
              ? 'center'
              : 'flex-start',
        }}
      >
        {children || label || ''}

        {sorter.field === name &&
          sorter.order === 'descend' && (
            <i className="ml-2 fas fa-sort-up" />
          )}
        {sorter.field === name &&
          sorter.order === 'ascend' && (
            <i className="ml-2 fas fa-sort-down" />
          )}
      </div>
    </TableColumnHeaderStyled>
  );
};

export default TableColumnHeader;
