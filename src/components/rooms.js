import React from 'react';
import {
  List,
  Edit,
  Datagrid,
  EditButton,
  TextField,
  TextInput,
  NumberField,
  NumberInput,
  SimpleForm,
  SearchInput,
  DateField,
  DateInput,
  ReferenceArrayField,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
} from 'react-admin';

const roomFilters = [
  <SearchInput source="code" alwaysOn />
];

export function RoomList({permissions, ...props}) {
  return (
    <List {...props}
      bulkActionButtons={false}
      filters={roomFilters}>
      <Datagrid rowClick="edit">
        <TextField source="name" />
        <TextField source="code" />
        <TextField source="organisation" />
        <ReferenceArrayField reference="users" source="facilitatorIds">
          <Datagrid>
            <TextField source="email" />
          </Datagrid>
        </ReferenceArrayField>
        <ReferenceArrayField reference="users" source="participantIds">
          <Datagrid>
            <TextField source="email" />
          </Datagrid>
        </ReferenceArrayField>
        <NumberField source="reflectionIds" />
        <DateField source="date" />
        <DateField source="createdAt" />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export function RoomEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" />
        <TextInput source="code" />
        <TextInput source="organisation" />
        <ReferenceArrayInput reference="users" source="facilitatorIds">
          <SelectArrayInput optionText="email" />
        </ReferenceArrayInput>
        <ReferenceArrayInput reference="users" source="participantIds">
          <SelectArrayInput optionText="email" />
        </ReferenceArrayInput>
        <ArrayInput source="reflectionIds">
          <SimpleFormIterator>
            <NumberInput />
          </SimpleFormIterator>
        </ArrayInput>
        <DateInput source="date" />
        <DateInput source="createdAt" />
      </SimpleForm>
    </Edit>
  );
};

