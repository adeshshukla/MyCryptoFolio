const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseAcc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://CryptoFolio.firebaseio.com'
});
var db = admin.firestore();

class FireBaseService {
    getUsers(req, res) {
        var data = [];
        db.collection('users').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // console.log(doc.id, '=>', doc.data());
                    data.push(doc.data());
                });

                res.send(data);
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                res.send(err);
            });
    }
}

module.exports = FireBaseService;

