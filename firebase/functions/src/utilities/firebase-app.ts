import * as admin from "firebase-admin";
export const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://line-kakeibot.firebaseio.com",
});

const db = app.database();
export const statesRef = db.ref("/states");
export const groupsRef = db.ref("/groups");
export const paymentsRef = db.ref("/payments");
export const usersRef = db.ref("/users");

const storage = app.storage();
export const kakeibotBucket = storage.bucket("line-kakeibot.appspot.com");
