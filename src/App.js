import './App.css';
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList, UserEdit } from './components/users';
import { Dashboard } from './components/dashboard';
import { ReflectionList, ReflectionEdit } from './components/reflections';
import { FirebaseAuthProvider, FirebaseDataProvider } from 'react-admin-firebase';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const authProvider = FirebaseAuthProvider(config);
const dataProvider = FirebaseDataProvider(config);

export default function App() {
  return (
    <Admin dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="users" list={UserList} edit={UserEdit}/>
      <Resource name="reflectionResponses" options={{ label: 'Reflections' }} list={ReflectionList} edit={ReflectionEdit}/>
    </Admin>
  );
};
