const { copy } = require('copy-dynamodb-table');
const globalAWSConfig = require('../globalAWSConfig');

function promiseCopy(data) {
  return new Promise((resolve, reject) => {
    copy(data, function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

async function copyTable(sourceTable, destinationTable) {
  await promiseCopy({
    config: globalAWSConfig, // config for AWS
    source: {
      tableName: sourceTable, // required
    },
    destination: {
      tableName: destinationTable, // required
    },
    log: true, // default false
    create: false, // create destination table if not exist
  });
}

async function init() {
  try {
    await copyTable('example-source-table', 'example-destination-table');
    // Duplicate the above line for every dynamoDB table you need copied
  } catch (err) {
    console.log('Oh no! Issue copying tables');
  }
}

init();
