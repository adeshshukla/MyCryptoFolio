
var admin = require('firebase-admin');

var serviceAccount = require('./config/firebaseAcc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://CryptoFolio.firebaseio.com'
});

var db = admin.firestore();

// var docRef = db.collection('users').doc('alovelace');

// var setAda = docRef.set({
//     first: 'Ada',
//     last: 'Lovelace',
//     born: 1815
// });

// var aTuringRef = db.collection('users').doc('aturing')

// var setAlan = aTuringRef.set({
//     'first': 'Alan',
//     'middle': 'Mathison',
//     'last': 'Turing',
//     'born': 1912
// });

db.collection('users').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
