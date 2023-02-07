const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const { userToCsvHeader } = require('./csv-utils/userToCsv');
const AWS = require('aws-sdk');
const globalAWSConfig = require('../globalAWSConfig');

// Configure the AWS SDK with your credentials
AWS.config.update(globalAWSConfig);

// Create an instance of the AWS Cognito Identity provider client
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const userPoolId = 'user-pool-id';

// Cognito paginates users to return 60. We must loop through paginated results to grab all users
const getAllUsers = async (params) => {
  try {
    // string must not be empty
    let paginationToken = 'notEmpty';
    let itemsAll = {
      Users: [],
    };
    while (paginationToken) {
      const data = await cognitoIdentityServiceProvider
        .listUsers(params)
        .promise();

      const { Users } = data;
      itemsAll = {
        ...data,
        ...{ Users: [...itemsAll.Users, ...(Users ? [...Users] : [])] },
      };
      paginationToken = data.PaginationToken;
      if (paginationToken) {
        params.PaginationToken = paginationToken;
      }
    }
    return itemsAll;
  } catch (err) {
    console.error('Unable to scan the cognito pool users. Error JSON:', err);
  }
};

const init = async () => {
  const params = {
    UserPoolId: userPoolId,
  };

  const allUsers = await getAllUsers(params);

  // provide the user pool ID of the new pool you want to transfer users to
  cognitoIdentityServiceProvider.getCSVHeader(
    {
      UserPoolId: 'example-user-pool-id',
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
          });
      }
    }
  );
};

init();
