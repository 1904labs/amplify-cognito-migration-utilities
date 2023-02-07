const { copy } = require('copy-dynamodb-table');
const globalAWSConfig = require('../globalAWSConfig');

// @TODO: Update these to the correct dynamo table names
const EXAMPLE_SOURCE_TABLE = 'example-source-table';
const EXAMPLE_DESTINATION_TABLE = 'example-destination-table';

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
    // Duplicate this line for every dynamoDB table you need copied
    await copyTable(EXAMPLE_SOURCE_TABLE, EXAMPLE_DESTINATION_TABLE);
  } catch (err) {
    console.log('Oh no! Issue copying tables');
  }
}

init();
