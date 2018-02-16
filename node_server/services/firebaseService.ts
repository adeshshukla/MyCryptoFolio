const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseAcc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://CryptoFolio.firebaseio.com'
});

// DB instance
var db = admin.firestore();

// DB Collections.
var Collections = {
    Users: 'users',
    TradeHistory: 'tradeHistory',
    PortfolioSnapshot: 'portfolioSnapshot'
}

class FireBaseService {
    getUsers(req, res) {
        var data = [];
        db.collection(Collections.Users).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // console.log(doc.id, '=>', doc.data());
                    data.push(doc.data());
                });

                res.send(data);
            })
            .catch((err) => {
                console.log('Error getting users', err);
                res.send(err);
            });
    }

    getTradeHistory(req, res) {
        var data = [];
        db.collection(Collections.TradeHistory).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    data.push(doc.data());
                });

                res.send(data);
            })
            .catch((err) => {
                console.log('Error getting TradeHistory', err);
                res.send(err);
            });
    }

    getPortFolioSnapshot(req, res) {
        var data = [];
        db.collection(Collections.PortfolioSnapshot).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    data.push(doc.data());
                });

                res.send(data);
            })
            .catch((err) => {
                console.log('Error getting Portfolio Snapshot', err);
                res.send(err);
            });
    }

    savePortFolioSnapshot(req, res) {
        const data = req.body;
        // console.log('Adding Data in collection ------------ ')
        // console.log(req.body)

        if (data) {
            var collRef = db.collection(Collections.PortfolioSnapshot);
            var addDoc = collRef.add(data)
                .then(ref => {
                    console.log('Portfolio Snapshot added with ID: ', ref.id);
                    res.send({ 'statusCode': 'OK' });
                })
                .catch(err => {
                    console.log('Error adding Portfolio Snapshot...!!!');
                    res.send(err);
                });
        } else {
            res.send({ 'statusCode': 'KO', 'msg': 'No data' });
        }
    }
}

module.exports = FireBaseService;

