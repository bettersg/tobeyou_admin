import config from '../config';
import { defaultAuthProvider } from '../firebase';

const authProvider = {
  ...defaultAuthProvider,
  // Override the login method to allow only admins to log in
  login: async (params) => {
    const isAdmin = config.admins.includes(params.username);
    if (!isAdmin) throw new Error("Login error, invalid permissions");
    const user = await defaultAuthProvider.login(params);
    return user;
    // const tokenResult = await firebase.auth().currentUser.getIdTokenResult();
    // const isAdmin = !!tokenResult.claims.admin;
    // if (isAdmin) return user;
    // // If not an admin, log out and restrict access
    // await defaultAuthProvider.logout();
    // throw new Error("Login error, invalid permissions");
  },
};

export default authProvider;
