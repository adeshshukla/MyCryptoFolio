const fs = require('fs');
const admin = require('firebase-admin');
const serverConfig = require('../node_server/config/serverConfig.ts');

const serviceAccount = require('../node_server/config/firebaseAcc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://CryptoFolio.firebaseio.com'
});

var db = admin.firestore();

class FireBaseMigrationService {

    addUser(userData) {
        // Add a new document in collection "cities" with ID 'LA'
        var setDoc = db.collection('users').doc(userData.userId).set(userData);
        // [END set_document]

        setDoc.then(res => {
            console.log('User added successfully.');
        });
    }

    migrateData(collectionPath, fileName) {
        var batch = db.batch();
        var collRef = db.collection(collectionPath);
        var fileUrl = '../db/' + fileName;
        fs.readFile(fileUrl, 'utf8', function (err, contents) {
            if (err) {
                console.log(err);
            }
            else {
                var jsonObj = [];
                if (contents) {
                    jsonObj = JSON.parse(contents);
                }

                console.log('Sorting data in ascending order ---- ', collectionPath);
                jsonObj =  jsonObj.sort((a, b) => {
                    return new Date(a.timestamp) < new Date(b.timestamp) ? -1 : 1;
                });

                console.log('Adding to the batch ---- ', collectionPath);
                for (var i = 0; i < jsonObj.length; i++) {
                    jsonObj[i]["userId"] = serverConfig.user.userId;

                    let docRef = collRef.doc();
                    batch.set(docRef, jsonObj[i]);
                }

                console.log('Batch committing ----- ', collectionPath);
                return batch.commit().then(function () {
                    console.log('Batch commit Successfull.');
                }, function (err) {
                    console.log('Batch commit Error ...!!!');
                    console.log(err);
                });

            }
        });
    }

    addData(collectionPath, data) {
        var collRef = db.collection(collectionPath);
        var addDoc = collRef.add(data)
            .then(ref => {
                console.log('Added document with ID: ', ref.id);
            });
    }

    readData(collectionPath) {
        db.collection(collectionPath).get()
            .then((snapshot) => {
                console.log('DB Collection --> ', collectionPath);
                console.log('\t--> Data Count \t => ', snapshot.docs.length);

                // console.log('data => ');
                // snapshot.forEach((doc) => {
                //     console.log('\n');
                //     console.log(doc.id, '=>', doc.data());
                // });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
    }

    deleteData(collectionPath) {
        db.collection(collectionPath).get()
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    doc.ref.delete();
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
    }

    readDataFromFile(fileName) {
        var fileUrl = '../db/' + fileName;
        fs.readFile(fileUrl, 'utf8', function (err, contents) {
            if (err) {
                console.log(err);
            }
            else {
                var jsonObj = [];
                if (contents) {
                    jsonObj = JSON.parse(contents);
                }
                console.log('fileName --> ', fileName);
                console.log('\t--> Data Count \t => ', jsonObj.length);
            }
        });
    }

    // deleteCollection(db, collectionPath, batchSize) {
    //     var collectionRef = db.collection(collectionPath);
    //     var query = collectionRef.orderBy('__name__').limit(batchSize);

    //     return new Promise((resolve, reject) => {
    //         deleteQueryBatch(db, query, batchSize, resolve, reject);
    //     });
    // }

    // deleteQueryBatch(db, query, batchSize, resolve, reject) {
    //     query.get()
    //         .then((snapshot) => {
    //             // When there are no documents left, we are done
    //             if (snapshot.size == 0) {
    //                 return 0;
    //             }

    //             // Delete documents in a batch
    //             var batch = db.batch();
    //             snapshot.docs.forEach((doc) => {
    //                 batch.delete(doc.ref);
    //             });

    //             return batch.commit().then(() => {
    //                 return snapshot.size;
    //             });
    //         }).then((numDeleted) => {
    //             if (numDeleted === 0) {
    //                 resolve();
    //                 return;
    //             }

    //             // Recurse on the next process tick, to avoid
    //             // exploding the stack.
    //             process.nextTick(() => {
    //                 deleteQueryBatch(db, query, batchSize, resolve, reject);
    //             });
    //         })
    //         .catch(reject);
    // }
}

module.exports = FireBaseMigrationService;