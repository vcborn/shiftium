<h3 align="center">
  <img src="https://user-images.githubusercontent.com/39876629/143676769-30164064-157b-4da7-92f5-00a0eb888c5f.png" height=100 />
</h3>

<table>
<tbody>
  <tr>
    <td><a href="https://github.com/vcborn/shiftium/blob/main/README.md">English</a></td>
    <td><a href="https://github.com/vcborn/shiftium/blob/main/README_jp.md">日本語</a></td>
  </tr>
  </tbody>
</table>

# Shiftium

Shiftium is a simple and easy attendance management tool.

This program uses Firebase Auth and Firestore.

## Features

- Email + Pass / Google Login
- View history to 30 days
  - Download with csv
- Simple UI
- Auto send to discord ( with webhook )
- Admin panel

## Getting Started

You know how to setup this, right?

But this tool using firebase, and you might not be know variables of .env file.
If you don't know that, setup .env.local like this:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

DISCORD_WEBHOOK_URL=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### Admin panel
To use admin panel, you must create some cloud functions.  
```js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.addAdminClaim = functions.firestore
  .document("admin_users/{docID}")
  .onCreate((snap) => {
    const newAdminUser = snap.data();
    if (newAdminUser === undefined) {
      return;
    }
    modifyAdmin(newAdminUser.uid, true);
  });

exports.removeAdminClaim = functions.firestore
  .document("admin_users/{docID}")
  .onDelete((snap) => {
    const deletedAdminUser = snap.data();
    if (deletedAdminUser === undefined) {
      return;
    }
    modifyAdmin(deletedAdminUser.uid, false);
  });

const modifyAdmin = (uid, isAdmin) => {
  admin.auth().setCustomUserClaims(uid, { admin: isAdmin }).then();
};
```
Deploy it and create a Firestore document at `admin_users/{AUTOID}/`.  
The field must contains `uid`, the value must contains someone's uid that you want to make an administrator.

## Known issues

- It will not be allowed to leave work after 24:00
- Slow login process
- Can't press leave button
- Sometimes cause 500 error

## Upcoming features

- i18n support
