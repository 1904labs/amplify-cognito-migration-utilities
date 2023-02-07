/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const AWS = require('aws-sdk');

// Configure the AWS SDK with your credentials
AWS.config.update({
  accessKeyId: 'your_access_key',
  secretAccessKey: 'your_secret_access_key',
  region: 'your_region',
});

// Create an instance of the AWS Cognito Identity provider client
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// The ID of the Cognito User Pool you want to retrieve users from
const userPoolId = 'example-user-pool-ID';

// Create an instance of the AWS DynamoDB client
const dynamoDB = new AWS.DynamoDB();

// The name of the DynamoDB table you want to update
const exampleTableName1 = 'Receipt-example-staging';
const exampleTableName2 = 'Vehicle-example-staging';
const exampleTableName3 = 'User-example-staging';

// Define a function to update the cognitoUsername field for a single entry in the DynamoDB table
const updateCognitoItem = async (item, newSubID, tableName, fieldName) => {
  const idIndex = Object.keys(item).findIndex((it) => it === 'id');

  const params = {
    TableName: tableName,
    Key: {
      // The primary key of the entry you want to update
      [Object.keys(item)[idIndex]]: {
        S: Object.values(item)[idIndex].S,
      },
    },
    UpdateExpression: `SET ${fieldName} = :userID`,
    ExpressionAttributeValues: {
      ':userID': {
        S: newSubID,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    // Call the DynamoDB updateItem method to update the cognitoUsername field
    await dynamoDB.updateItem(params).promise();
  } catch (err) {
    console.log('This is a unsuccessful upload', err);
  }
};

// Define a function to retrieve all entries from the DynamoDB table
const getAllItems = async (users, tableName, fieldName) => {
  const vehicleParams = {
    TableName: tableName,
  };

  // Call the DynamoDB scan method to retrieve all entries from the table
  dynamoDB.scan(vehicleParams, async (error, data) => {
    if (error) {
      console.error(`Error retrieving items from table ${tableName}:`, error);
    } else {
      // Loop through the items and update the cognitoUsername field for each one

      for (const item of data.Items) {
        const cognitoUsername = users.find((user) => {
          const { Attributes } = user;

          const subIDIndex = Attributes.findIndex(
            (attr) => attr.Name === 'custom:prev_sub_id'
          );

          return Attributes[subIDIndex].Value === item[fieldName].S;
        });

        if (cognitoUsername && fieldName === 'userID') {
          const newSubID = cognitoUsername.Attributes.find(
            (it) => it.Name === 'sub'
          ).Value;

          updateCognitoItem(item, newSubID, tableName, fieldName);
        }
      }
    }
  });
};

// Cognito list users pulls about 60 users at a time. This function is needed for more than 60 users
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

  // Call the getAllItems function to retrieve all entries from the DynamoDB table
  // and update the items with the new subID of the migrated users
  // repeat this for as many tables as needed
  await getAllItems(allUsers.Users, exampleTableName1, 'userID');

  await getAllItems(allUsers.Users, exampleTableName2, 'userID');

  await getAllItems(allUsers.Users, exampleTableName3, 'userID');
};

init();
