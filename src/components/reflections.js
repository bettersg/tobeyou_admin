import React from 'react';
import {
  List,
  Edit,
  Datagrid,
  SimpleForm,
  EditButton,
  ReferenceField,
  TextField,
  NumberField,
  DateField,
  TextInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  SearchInput,
} from 'react-admin';

// For reference, see storyMap.js from the main repository
const reflectionIdStoryMap = {
  1: 'Aman 1',
  2: 'Nadia 1',
  3: 'Nadia 2',
  4: 'Nadia 3',
  5: 'Aman 2',
  6: 'Aman 3',
  7: 'Ravi 1',
  8: 'Ravi 2',
  9: 'Ravi 3',
  // 10: 'Ravi 4',  // unused
  11: 'Zhihao 1',
  12: 'Zhihao 2',
  13: 'Zhihao 3',
  14: 'Unaisah 1',
  15: 'Unaisah 2',
  16: 'Unaisah 3',
  17: 'Marie 1',
  18: 'Marie 2',
  19: 'Marie 3',
};

const reflectionChoices = Object.entries(reflectionIdStoryMap)
  .map(([id, name]) => ({ id: +id, name }))
  .sort((x, y) => x.name > y.name);

export function ReflectionList(props) {
  const reflectionFilters = [
    <SearchInput source='$answer|search' alwaysOn />,
    <SelectInput
      source='reflectionId'
      choices={reflectionChoices}
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
        <NumberField source="numLikes" label="Likes" />
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
