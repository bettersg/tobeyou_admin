import './App.css';
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Dashboard } from './components/dashboard';
import { UserList, UserEdit } from './components/users';
import { RoomList, RoomEdit } from './components/rooms';
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
      <Resource name="rooms" list={RoomList} edit={RoomEdit} />
      <Resource name="reflectionResponses" options={{ label: 'Reflections' }} list={ReflectionList} edit={ReflectionEdit}/>
    </Admin>
  );
};
