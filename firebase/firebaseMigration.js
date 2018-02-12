var fs = require('fs');
var admin = require('firebase-admin');

var serviceAccount = require('./config/firebaseAcc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://CryptoFolio.firebaseio.com'
});

var db = admin.firestore();

fs.readFile('../db/portfolioPerformance.txt', 'utf8', function (err, contents) {
    if (err) {
        console.log(err);        
    }
    else {
        var jsonObj = [];
        if (contents) {
            jsonObj = JSON.parse(contents);
        }

        // send data to front end
        console.log('data length => ', jsonObj.length)
        for(var i = 0; i< jsonObj.length; i++)
        {
            // console.log(jsonObj[i]);
        }
        
    }
});


