import React from 'react';
import {
  List,
  Edit,
  Datagrid,
  SimpleForm,
  EditButton,
  ReferenceField,
  TextField,
  DateField,
  TextInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  SearchInput,
} from 'react-admin';

const reflectionIdStoryMap = {
  1: 'Aman 1',
  2: 'Nadia 1',
  3: 'Nadia 2',
  4: 'Nadia 3',
};

export function ReflectionList(props) {
  const reflectionFilters = [
    <SearchInput source='$answer|search' alwaysOn />,
    <SelectInput
      source='reflectionId'
      choices={Object.entries(reflectionIdStoryMap).map(([id, name]) => ({ id: +id, name }))}
      alwaysOn
    />,
    <BooleanInput
      label='Non-empty response'
      source='$answer|nonemptyresponse'
      alwaysOn
    />
  ];

  const ReflectionField = ({ record, source }) => {
    const reflectionId = record[source];
    const story = reflectionIdStoryMap[reflectionId];
    return <p>{story}</p>;
  };

  return (
    <List {...props}
      bulkActionButtons={false}
      filter={{ questionId: 3 }}  // Show only reflection responses, i.e. questionId == 3
      filters={reflectionFilters}>
      <Datagrid rowClick="edit">
        <ReferenceField source="userId" reference="users"><TextField source="username" /></ReferenceField>
        <TextField source="answer" />
        {/* <NumberField source="questionId" /> */}
        <ReflectionField source="reflectionId" />
        <DateField source="submittedAt" showTime={true} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export function ReflectionEdit (props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <ReferenceInput source="userId" reference="users"><SelectInput optionText="username" /></ReferenceInput>
        <TextInput source="answer" multiline />
        {/* <NumberInput source="questionId" /> */}
        {/* <NumberInput source="reflectionId" /> */}
        <DateTimeInput source="submittedAt" />
      </SimpleForm>
    </Edit>
  );
};
