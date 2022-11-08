import React from 'react';
import {
  List,
  Datagrid,
  EmailField,
  TextField,
} from 'react-admin';

export function EmailList({permissions, ...props}) {
  return (
    <List {...props}
      bulkActionButtons={false}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <EmailField source="email" />
      </Datagrid>
    </List>
  );
};
