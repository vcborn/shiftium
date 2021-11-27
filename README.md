<h3 align="center">
  <img src="https://user-images.githubusercontent.com/39876629/143676769-30164064-157b-4da7-92f5-00a0eb888c5f.png" height=100 />
</h3>

# Shiftium

Shiftium is a simple and easy attendance management tool.

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

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

## Known issues..
* It will not be allowed to leave work after 24:00
* Slow login process
* Can't press leave button
* Sometimes cause 500 error
