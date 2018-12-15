const admin = require('firebase-admin');
const serviceAccount = require('../constants/service-account-key.json');

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://line-kakeibot.firebaseio.com'
});

const db = app.database();
const storage = app.storage();

module.exports = {
  stateRef: db.ref('/states'),
  groupsRef: db.ref('/groups'),
  paymentsRef: db.ref('/payments'),
  usersRef: db.ref('/users'),
  lemaBucket: storage.bucket('line-kakeibot.appspot.com')
};
