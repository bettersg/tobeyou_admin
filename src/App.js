import './App.css';
import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from './components/users';
import { PostList, PostEdit, PostCreate } from './components/posts';
import { FirebaseAuthProvider } from 'react-admin-firebase';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const firebaseAuthProvider = FirebaseAuthProvider(config);

export default function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={firebaseAuthProvider}>
      <Resource name="users" list={UserList} />
      <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
    </Admin>
  );
}
