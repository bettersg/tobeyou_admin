import React from 'react';
import {
  List,
  Edit,
  Datagrid,
  EditButton,
  TextField,
  NumberField,
  ReferenceField,
  TextInput,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  SearchInput,
} from 'react-admin';

const userFilters = [
  <SearchInput source="username" alwaysOn />
];

export function UserList({permissions, ...props}) {
  return (
    <List {...props}
      bulkActionButtons={false}
      filters={userFilters}>
      <Datagrid rowClick="edit">
        <TextField source="username" />
        <ReferenceField reference="emails" source="id" label="email">
          <TextField source="email" />
        </ReferenceField>
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
        <ReferenceInput reference="emails" source="email" disabled>
          <TextInput />
        </ReferenceInput>
        <NumberInput source="age" />
        <TextInput source="gender" />
        <TextInput source="housing" />
        <TextInput source="race" />
        <TextInput source="religion" />
      </SimpleForm>
    </Edit>
  );
};
