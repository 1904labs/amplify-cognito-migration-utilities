const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const { userToCsvHeader } = require('./csv-utils/userToCsv');
const AWS = require('aws-sdk');
const globalAWSConfig = require('../globalAWSConfig');
const getAllUsers = require('./cognito-utils/getAllUsers');

// Configure the AWS SDK with your credentials
AWS.config.update(globalAWSConfig);

// Create an instance of the AWS Cognito Identity provider client
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// @TODO: Update these to user pool values
const USER_POOL_ID_CONTAINING_USERS_TO_MIGRATE = 'user-pool-id';

// provide the user pool ID of the new pool you want to transfer users to
const USER_POOL_ID_FOR_CSV_HEADERS = 'user-pool-id';

const init = async () => {
  const params = {
    UserPoolId: USER_POOL_ID_CONTAINING_USERS_TO_MIGRATE,
  };

  const allUsers = await getAllUsers(params);

  cognitoIdentityServiceProvider.getCSVHeader(
    {
      UserPoolId: USER_POOL_ID_FOR_CSV_HEADERS,
    },
    (err, csvData) => {
      if (err) console.error('oh no! an error occurred', err);
      if (csvData) {
        const csvWriter = createCsvWriter({
          header: csvData.CSVHeader,
          alwaysQuote: false,
          path: './userToCsvHeader.csv',
        });

        const results = userToCsvHeader(allUsers.Users);

        csvWriter
          .writeRecords(results) // returns a promise
          .then(() => {
            console.log('...Done');
          })
          .catch((err) => console.log('Issue writing records', err));
      }
    }
  );
};

init();
