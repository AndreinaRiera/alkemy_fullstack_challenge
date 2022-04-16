var admin = require("firebase-admin");

// the account service key must be obtained from the associated firebase project. As of 09/04/2022, it can be obtained from the path: 
// https://console.firebase.google.com/u/0/project/PROJECT_NAME/settings/serviceaccounts/adminsdk
// when "PROJECT_NAME" is the name of the project in firebase.

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;