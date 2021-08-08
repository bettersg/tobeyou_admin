import React from 'react';
import {
  List,
  Datagrid,
  ReferenceField,
  TextField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from 'react-admin';

export const PostList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <ReferenceField source="userId" reference="users"><TextField source="name"/></ReferenceField>
      <TextField source="id"/>
      <TextField source="title"/>
      <TextField source="body"/>
      <EditButton />
    </Datagrid>
  </List>
);


export const PostEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users"><SelectInput optionText="id"/></ReferenceInput>
      <TextInput source="id"/>
      <TextInput source="title"/>
      <TextInput source="body"/>
    </SimpleForm>
  </Edit>
);

export const PostCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users"><SelectInput optionText="id"/></ReferenceInput>
      <TextInput source="id"/>
      <TextInput source="title"/>
      <TextInput source="body"/>
    </SimpleForm>
  </Create>
);