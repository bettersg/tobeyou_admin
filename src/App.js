import './App.css';
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList, UserEdit } from './components/users';
import { Dashboard } from './components/dashboard';
import { ReflectionList, ReflectionEdit } from './components/reflections';
import dataProvider from './providers/dataProvider';
import authProvider from './providers/authProvider';

export default function App() {
  return (
    <Admin
      dashboard={Dashboard}
      dataProvider={dataProvider}
      authProvider={authProvider}>
      <Resource name="users" list={UserList} edit={UserEdit} />
      <Resource name="reflectionResponses" options={{ label: 'Reflections' }} list={ReflectionList} edit={ReflectionEdit}/>
    </Admin>
  );
};
