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

Shiftiumはシンプルで簡単な勤怠管理ツールです。

このプログラムはFirebase AuthとFirestoreを使用しています。

## 機能

- メール + パスワード / Google ログイン
- 30日前までの履歴を確認
  - CSVでダウンロード
- シンプルなUI
- 自動でDiscordに送信 ( webhook )
- 管理画面

## はじめに

これのセットアップの仕方は知っていますよね？

ただ、このツールはFirebaseを使っていて、あなたは`.env`ファイルの変数名を知らないかもしれません。  
もし知らなければ、`.env.local`ファイルをこのように設定してください。

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

### 管理画面
管理画面を使用するには、Cloud Functionsを作成する必要があります。
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
これをデプロイし、`admin_users/{AUTOID}/`にドキュメントを作成してください。（{AUTOID}は自動IDで作成）  
フィールドは`uid`、値は管理者にしたい誰かのuidを入れてください。

## 既知の問題

- 24:00以降の退勤ができない
- ログインが遅い
- 退勤ボタンが押せない
- 500エラーがたまにでる

## 追加予定の機能

- i18n サポート
