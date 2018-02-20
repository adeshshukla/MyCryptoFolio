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
        console.log('dbservice -> Firebase.getTradeHistory()')
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
        console.log('dbservice -> Firebase.getPortFolioSnapshot()')
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
        // console.log('Adding PortFolio Snapshot in collection ------------ ')
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

    saveTrade(req, res) {
        const data = req.body;
        // console.log('Adding Trade in collection ------------ ')
        // console.log(req.body)

        if (data) {
            var collRef = db.collection(Collections.TradeHistory);
            var addDoc = collRef.add(data)
                .then(ref => {
                    console.log('Trade added with ID: ', ref.id);
                    res.send({ 'statusCode': 'OK' });
                })
                .catch(err => {
                    console.log('Error adding Trade...!!!');
                    res.send(err);
                });
        } else {
            res.send({ 'statusCode': 'KO', 'msg': 'No data to save...!!!' });
        }
    }

    saveTradeHistory(req, res) {
        res.send({ 'statusCode': 'KO', 'msg': 'Function Not Implemented...!!!' });

        var tradeHistory = req.body;

        var batch = db.batch();
        var collRef = db.collection(Collections.TradeHistory);

        console.log('Sorting data in ascending order ---- ', Collections.TradeHistory);
        tradeHistory = tradeHistory.sort((a, b) => {
            return new Date(a.timestamp) < new Date(b.timestamp) ? -1 : 1;
        });

        console.log('Adding to the batch ---- ', Collections.TradeHistory);
        for (var i = 0; i < tradeHistory.length; i++) {
            tradeHistory[i]["userId"] = serverConfig.user.userId;

            let docRef = collRef.doc();
            batch.set(docRef, tradeHistory[i]);
        }

        console.log('Batch committing ----- ', Collections.TradeHistory);
        return batch.commit().then(function () {
            console.log('Batch commit Successfull.');
        }, function (err) {
            console.log('Batch commit Error ...!!!');
            console.log(err);
        });
    }
}

module.exports = FireBaseService;

