# tobeyou_admin
React Admin Firebase for game.ToBeYou.sg

This will be deployed to admin.tobeyou.sg  and only authorised users (admin priv) will be able to access it.

## Setup

Copy the `.env` file for ToBeYou into this project directory.
Add a new environmental variable `REACT_APP_ADMINS`, whose value is a comma-separated list of emails.
Only users with these specified emails will be allowed to log in.

Run `npm install` to install the required dependencies,
and `npm start` to start the app on [http://localhost:3000](http://localhost:3000).

