import React from 'react';

export const TableContext = React.createContext({
  record: { _id: Math.random() },
  fetchParams: { page: 1, pageSize: 10 },
  refreshData: () => {},
});
