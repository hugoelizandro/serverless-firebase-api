# Serverless Firebase API with Cloud Functions, Firestore, Express and TypeScript

A simple API that saves information on Firestore. 

## Requirements

[NodeJS](https://nodejs.org/en/)

You will need a Firebase project and firebase tools cli.

```
npm install -g firebase-tools
```

## Getting Started

```
git clone https://github.com/hugoelizandro/serverless-firebase-api.git
```

You need to change the firebase project name in *.firebaserc* file.

After that, you can log in to firebase in the terminal.

```
firebase login
```

## Deploy to firebase

For the first time, you have deploy the hosting and functions together.

```
firebase deploy
```

After that, you just need to deploy functions only.

```
firebase deploy --only functions
```
