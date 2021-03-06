const serverConfig = require('../node_server/config/serverConfig.ts');
const FireBaseMigration = require("./firebaseMigrationService");

const collections = [{
    'name': 'portfolioSnapshot',
    'fileName': 'portfolioPerformance.txt'
},
{
    'name': 'tradeHistory',
    'fileName': 'tradeHistory.txt'
}
];

const fireBaseMigrationService = new FireBaseMigration();

// Migrate Data.
// migrateAllData();

// deleteData('portfolioSnapshot');

// migrateData('portfolioSnapshot', 'portfolioPerformance.txt');

// Verify Data.
verifyMigratedData();

function migrateData(collName, fileName){
    fireBaseMigrationService.migrateData(collName, fileName);
}

function migrateAllData() {
    // Add user    
    fireBaseMigrationService.addUser(serverConfig.user);

    collections.forEach(function (element) {
        console.log('migrating --> ', element.name);
        fireBaseMigrationService.migrateData(element.name, element.fileName);
    });
}

function verifyMigratedData() {
    collections.forEach(function (element) {
        fireBaseMigrationService.readDataFromFile(element.fileName);
        fireBaseMigrationService.readData(element.name);

        // fireBaseMigrationService.deleteData(element.name);
    });
}

function deleteAllData() {
    collections.forEach(function (element) {
        fireBaseMigrationService.deleteData(element.name);
    });
}

function deleteData(name) {
    fireBaseMigrationService.deleteData(name);
}