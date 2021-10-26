import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { FirebaseAuthProvider } from 'react-admin-firebase';

import config from './config';

firebase.initializeApp(config);
export const db = firebase.firestore();
export const defaultAuthProvider = FirebaseAuthProvider(config);
