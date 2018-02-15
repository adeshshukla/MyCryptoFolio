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

    getPortfolio(req, res) {
        var data = [];
        db.collection(Collections.PortfolioSnapshot).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    data.push(doc.data());
                });

                res.send(data);
            })
            .catch((err) => {
                console.log('Error getting Portfolio', err);
                res.send(err);
            });
    }
}

module.exports = FireBaseService;

