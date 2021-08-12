import React from 'react';
import {
  List,
  Edit,
  Datagrid,
  EditButton,
  TextField,
  NumberField,
  EmailField,
  TextInput,
  NumberInput,
  SimpleForm,
  SearchInput,
} from 'react-admin';

const userFilters = [
  <SearchInput source="username" alwaysOn />
];

export function UserList({permissions, ...props}) {
  return (
    <List {...props} filters={userFilters}>
      <Datagrid rowClick="edit">
        <TextField source="username" />
        <EmailField source="email" />
        <NumberField source="age" />
        <TextField source="gender" />
        <TextField source="housing" />
        <TextField source="race" />
        <TextField source="religion" />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export function UserEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="username" />
        <TextInput source="email" />
        <NumberInput source="age" />
        <TextInput source="gender" />
        <TextInput source="housing" />
        <TextInput source="race" />
        <TextInput source="religion" />
      </SimpleForm>
    </Edit>
  );
};
